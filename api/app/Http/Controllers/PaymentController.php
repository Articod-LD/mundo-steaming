<?php

namespace App\Http\Controllers;

use App\Http\Requests\createRecharge;
use App\Models\recharge;
use App\Models\User;
use Illuminate\Http\Request;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;


class PaymentController extends Controller
{
    public function __construct()
    {
        MercadoPagoConfig::setAccessToken(config('mercadopago.access_token'));
    }

    function createPreferenceRequest($items, $payer): array
    {
        $paymentMethods = [
            "excluded_payment_methods" => [],
            "installments" => 12,
            "default_installments" => 1
        ];

        $backUrls = array(
            'success' => route('mercadopago.success'),
            'failure' => route('mercadopago.failed')
        );

        $request = [
            "items" => $items,
            "payer" => $payer,
            "payment_methods" => $paymentMethods,
            "back_urls" => $backUrls,
            "statement_descriptor" => "NAME_DISPLAYED_IN_USER_BILLING",
            "external_reference" => "1234567890",
            "expires" => false,
            "auto_return" => 'approved',
        ];

        return $request;
    }


    public function createPayment(createRecharge $request)
    {
        $user = User::where('id', $request->user_id)->first();

        $payer = array(
            "name" => $user->name,
            "email" => $user->email,
        );

        $product1 = array(
            "id" => "recarga_billetera_virtual_001",
            "title" => "Recarga Billetera Virtual",
            "description" => "Recarga para billetera virtual",
            "currency_id" => "COP",
            "quantity" => 1,
            "unit_price" => $request->amount
        );

        $items = array($product1);

        $requestMP = $this->createPreferenceRequest($items, $payer);

        $client = new PreferenceClient();

        $preference = $client->create($requestMP);

        $recharge = new recharge();
        $recharge->user_id = $user->id;
        $recharge->amount = $request->amount;
        $recharge->payment_status = 'pending';
        $recharge->payment_reference = $preference->id;
        $recharge->save();

        return response()->json([
            'payment_url' => $preference->init_point,
            'preference' => $preference->id,
            'status' => 'pending',
            'message' => 'Recarga Creada'
        ]);
    }

    public function handlePaymentStatus(Request $request)
    {
        $paymentReference = $request->get('preference_id');
        $paymentStatus = $request->get('status'); // Estado del pago recibido desde Mercado Pago

        $recharge = recharge::where('payment_reference', $paymentReference)->first();
    
        if (!$recharge) {
            // Redirige a una vista de error en el frontend si no se encuentra la recarga
            return redirect()->away(env('FRONTEND_URL') . '?message=Recarga no encontrada');
        }
    
        // Actualiza el estado del pago y toma acciones específicas
        switch ($paymentStatus) {
            case 'approved':
                $recharge->payment_status = 'approved';
                $recharge->save();
    
                $user = $recharge->user;
                $user->wallet += $recharge->amount;
                $user->save();
    
                // Redirige a una vista de éxito en el frontend con la información del pago
                return redirect()->away(env('FRONTEND_URL') . '?status=approved&amount=' . $recharge->amount . '&wallet=' . $user->wallet);
    
            case 'pending':
                $recharge->payment_status = 'pending';
                $recharge->save();
    
                // Redirige a una vista de pendiente en el frontend
                return redirect()->away(env('FRONTEND_URL') . '?status=pending&reference=' . $paymentReference);
    
            case 'rejected':
                $recharge->payment_status = 'rejected';
                $recharge->save();
    
                // Redirige a una vista de rechazo en el frontend
                return redirect()->away(env('FRONTEND_URL') . '?status=rejected&message=Pago rechazado');
    
            case 'cancelled':
                $recharge->payment_status = 'cancelled';
                $recharge->save();
    
                // Redirige a una vista de cancelación en el frontend
                return redirect()->away(env('FRONTEND_URL') . '?status=cancelled&message=Pago cancelado por el usuario');
    
            default:
                // Redirige a una vista de error si el estado es desconocido
                return redirect()->away(env('FRONTEND_URL') .'?status=cancelled&message=Pago cancelado por el usuario');
        }
    }
    
    
}
