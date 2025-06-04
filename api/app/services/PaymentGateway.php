<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentGateway
{
    protected $baseUrl;
    
    public function __construct()
    {
        // En producción, esta sería la URL real del proveedor de pagos
        // En pruebas, apuntamos al servidor mock
        $this->baseUrl = env('PAYMENT_GATEWAY_URL', 'http://mockserver:1080/api');
    }
    
    /**
     * Procesa un pago con tarjeta de crédito
     *
     * @param array $cardData Datos de la tarjeta
     * @param float $amount Monto a cobrar
     * @param array $metadata Datos adicionales
     * @return array Respuesta del procesador de pagos
     */
    public function processCardPayment(array $cardData, float $amount, array $metadata = [])
    {
        try {
            $response = Http::post($this->baseUrl . '/payment/process/card', [
                'card_number' => $cardData['card_number'],
                'card_expiry' => $cardData['card_expiry'],
                'card_cvc' => $cardData['card_cvc'],
                'card_holder' => $cardData['card_holder'],
                'amount' => $amount,
                'currency' => 'COP',
                'metadata' => $metadata
            ]);
            
            return $response->json();
        } catch (\Exception $e) {
            Log::error('Error procesando pago con tarjeta: ' . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Error al procesar el pago con tarjeta: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Procesa un pago con PSE
     *
     * @param array $pseData Datos para PSE
     * @param float $amount Monto a cobrar
     * @param array $metadata Datos adicionales
     * @return array Respuesta del procesador de pagos
     */
    public function processPSEPayment(array $pseData, float $amount, array $metadata = [])
    {
        try {
            $response = Http::post($this->baseUrl . '/payment/process/pse', [
                'bank_code' => $pseData['bank_code'],
                'user_type' => $pseData['user_type'],
                'reference' => $pseData['reference'],
                'amount' => $amount,
                'currency' => 'COP',
                'metadata' => $metadata
            ]);
            
            return $response->json();
        } catch (\Exception $e) {
            Log::error('Error procesando pago con PSE: ' . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Error al procesar el pago con PSE: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Verifica el estado de un pago PSE
     *
     * @param string $reference Referencia de la transacción
     * @return array Estado actual de la transacción
     */
    public function checkPSEStatus(string $reference)
    {
        try {
            $response = Http::get($this->baseUrl . '/payment/status/pse', [
                'reference' => $reference
            ]);
            
            return $response->json();
        } catch (\Exception $e) {
            Log::error('Error verificando estado de pago PSE: ' . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Error al verificar el estado del pago PSE: ' . $e->getMessage()
            ];
        }
    }
}
