<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\plataforma;
use App\Models\Producto;
use App\Models\purchase;
use App\Models\suscription;
use App\Services\PaymentGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Str;
use Mockery;

class PaymentTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $paymentGatewayMock;

    public function setUp(): void
    {
        parent::setUp();
        
        // Crear mock para el servicio PaymentGateway
        $this->paymentGatewayMock = Mockery::mock(PaymentGateway::class);
        $this->app->instance(PaymentGateway::class, $this->paymentGatewayMock);
        
        // Configurar variables de entorno para pruebas
        $this->app['config']->set('services.payment_gateway.url', 'http://mockserver:1080/api');
        $this->app['config']->set('app.frontend_url_transaction', 'http://localhost:3000/transaction');
    }
    
    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
    
    /**
     * Prueba de pago con tarjeta de crédito
     */
    public function test_card_payment_creates_purchase()
    {
        // Crear usuario de prueba
        $user = User::factory()->create();
        
        // Crear plataforma de prueba
        $plataforma = plataforma::create([
            'name' => 'Netflix Test',
            'provider_price' => 15000,
            'count_avaliable' => 5
        ]);
        
        // Crear productos disponibles
        Producto::create([
            'plataforma_id' => $plataforma->id,
            'status' => 'DISPONIBLE'
        ]);
        
        // Configurar el mock para simular respuesta de pago con tarjeta
        $this->paymentGatewayMock->shouldReceive('processCardPayment')
            ->once()
            ->andReturn([
                'status' => 'approved',
                'transaction_id' => 'card-tx-12345',
                'message' => 'Pago con tarjeta aprobado',
                'reference' => 'CARD-REF-12345'
            ]);
        
        // Datos para la solicitud de pago
        $paymentData = [
            'plataforma_id' => $plataforma->id,
            'user_id' => $user->id,
            'card_number' => '4111111111111111',
            'card_expiry' => '12/25',
            'card_cvc' => '123',
            'card_holder' => 'Test User'
        ];
        
        // Enviar solicitud de pago
        $response = $this->postJson('/api/payment/byCard', $paymentData);
        
        // Verificar respuesta
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'status',
                    'message',
                    'external_reference'
                ]);
        
        // Verificar que se creó la compra
        $this->assertDatabaseHas('purchases', [
            'user_id' => $user->id,
            'price' => $plataforma->provider_price,
            'payment_method' => 'CARD',
            'payment_status' => 'approved'
        ]);
    }
    
    /**
     * Prueba de pago con PSE
     */
    public function test_pse_payment_flow()
    {
        // Crear usuario de prueba
        $user = User::factory()->create();
        
        // Crear plataforma de prueba
        $plataforma = plataforma::create([
            'name' => 'Disney+ Test',
            'provider_price' => 12000,
            'count_avaliable' => 5
        ]);
        
        // Crear productos disponibles
        Producto::create([
            'plataforma_id' => $plataforma->id,
            'status' => 'DISPONIBLE'
        ]);
        
        // Configurar el mock para simular respuesta de pago PSE inicial
        $this->paymentGatewayMock->shouldReceive('processPSEPayment')
            ->once()
            ->andReturn([
                'status' => 'pending',
                'transaction_id' => 'pse-tx-12345',
                'message' => 'Pago PSE en proceso',
                'reference' => 'PSE-REF-12345',
                'redirect_url' => 'http://mockserver:1080/bank-simulator'
            ]);
        
        // Datos para la solicitud de pago PSE
        $pseData = [
            'plataforma_id' => $plataforma->id,
            'user_id' => $user->id,
            'FINANCIAL_INSTITUTION_CODE' => '1022',
            'USER_TYPE' => 'N', // Natural
            'PSE_REFERENCE2' => 'TEST-PSE-REF'
        ];
        
        // Enviar solicitud de pago PSE
        $response = $this->postJson('/api/payment/byPSE', $pseData);
        
        // Verificar respuesta inicial
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'status',
                    'message',
                    'external_reference',
                    'redirect_url'
                ]);
        
        // Obtener la referencia externa
        $externalReference = $response->json('external_reference');
        
        // Verificar que se creó la compra en estado pendiente
        $this->assertDatabaseHas('purchases', [
            'user_id' => $user->id,
            'price' => $plataforma->provider_price,
            'payment_method' => 'PSE',
            'payment_status' => 'pending',
            'external_reference' => $externalReference
        ]);
        
        // Configurar el mock para simular respuesta de consulta de estado PSE
        $this->paymentGatewayMock->shouldReceive('checkPSEStatus')
            ->once()
            ->andReturn([
                'status' => 'approved',
                'transaction_id' => 'pse-tx-12345',
                'message' => 'Pago PSE aprobado',
                'reference' => $externalReference
            ]);
        
        // Simular consulta de estado
        $statusResponse = $this->getJson('/api/payment/checkPSEStatus?reference=' . $externalReference);
        
        // Verificar respuesta de estado
        $statusResponse->assertStatus(200)
                      ->assertJson([
                          'status' => 'approved',
                          'reference' => $externalReference
                      ]);
        
        // Verificar que la compra se actualizó a aprobada
        $this->assertDatabaseHas('purchases', [
            'external_reference' => $externalReference,
            'payment_status' => 'approved'
        ]);
        
        // Verificar que se creó una suscripción
        $this->assertDatabaseHas('suscriptions', [
            'usuario_id' => $user->id,
            'price' => $plataforma->provider_price
        ]);
    }
    
    /**
     * Prueba de error en pago PSE
     */
    public function test_pse_payment_error_handling()
    {
        // Crear usuario de prueba
        $user = User::factory()->create();
        
        // Crear plataforma de prueba
        $plataforma = plataforma::create([
            'name' => 'Prime Video Test',
            'provider_price' => 10000,
            'count_avaliable' => 5
        ]);
        
        // Crear productos disponibles
        Producto::create([
            'plataforma_id' => $plataforma->id,
            'status' => 'DISPONIBLE'
        ]);
        
        // Configurar el mock para simular error en pago PSE
        $this->paymentGatewayMock->shouldReceive('processPSEPayment')
            ->once()
            ->andReturn([
                'status' => 'error',
                'message' => 'Error al procesar el pago PSE: Banco no disponible'
            ]);
        
        // Datos para la solicitud de pago PSE
        $pseData = [
            'plataforma_id' => $plataforma->id,
            'user_id' => $user->id,
            'FINANCIAL_INSTITUTION_CODE' => '1022',
            'USER_TYPE' => 'N',
            'PSE_REFERENCE2' => 'TEST-PSE-REF'
        ];
        
        // Enviar solicitud de pago PSE
        $response = $this->postJson('/api/payment/byPSE', $pseData);
        
        // Verificar respuesta de error
        $response->assertStatus(500)
                ->assertJson([
                    'status' => 'error',
                    'message' => 'Error al procesar el pago PSE: Banco no disponible'
                ]);
        
        // Verificar que la compra se marcó como rechazada
        $this->assertDatabaseHas('purchases', [
            'user_id' => $user->id,
            'payment_method' => 'PSE',
            'payment_status' => 'rejected'
        ]);
    }
}
