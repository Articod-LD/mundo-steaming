<?php

namespace App\Http\Controllers;

use App\Http\Requests\createRecharge;
use App\Http\Requests\createSuscriptionRequest;
use App\Models\plataforma;
use App\Models\Producto;
use App\Models\purchase;
use App\Models\recharge;
use App\Models\suscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use MercadoPago\MercadoPagoConfig;
use Illuminate\Support\Str;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\Client\Preference\PreferenceClient;

class PaymentController extends Controller
{
    public function __construct()
    {
        MercadoPagoConfig::setAccessToken(config('mercadopago.access_token'));
    }

    function createPreferenceRequest($items, $payer, $external): array
    {
        $paymentMethods = [
            "excluded_payment_methods" => [],
            "installments" => 12,
            "default_installments" => 1
        ];

        $backUrls = array(
            'success' => route('mercadopago.success'),
            'approved' => route('mercadopago.success'),
            'failure' => route('mercadopago.failed'),
            'pending' => route('mercadopago.pending'),
            'rejected' => route('mercadopago.rejected'),
            'cancelled' => route('mercadopago.cancelled'),
        );

        $request = [
            "items" => $items,
            "payer" => $payer,
            "payment_methods" => $paymentMethods,
            "back_urls" => $backUrls,
            "statement_descriptor" => "NAME_DISPLAYED_IN_USER_BILLING",
            "external_reference" => $external,
            "expires" => true,
            "auto_return" => 'all',
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

        $external_reference =  strtoupper(Str::random(8));

        $requestMP = $this->createPreferenceRequest($items, $payer, $external_reference);

        $client = new PreferenceClient();

        $preference = $client->create($requestMP);


        $recharge = new recharge();
        $recharge->user_id = $user->id;
        $recharge->amount = $request->amount;
        $recharge->payment_status = 'pending';
        $recharge->payment_reference = $preference->id;
        $recharge->external_reference = $external_reference;
        $recharge->save();

        return response()->json([
            'payment_url' => $preference->init_point,
            'preference' => $external_reference,
            'status' => 'pending',
            'message' => 'Recarga Creada'
        ]);
    }

    public function handlePaymentStatus(Request $request)
    {

        $paymentReference = $request->get('preference_id');
        $paymentStatus = $request->get('status');
        $paymentIdReference = $request->get('payment_id');

        if ($paymentIdReference) {
            $client = new PaymentClient();
            $payment = $client->get($paymentIdReference);
            $paymentReference = $payment->external_reference;
            $paymentStatus = $payment->status;
        }


        if (!$paymentReference && !$paymentStatus) {
            return redirect()->away(
                trim(env('FRONTEND_URL_SUSCRIPTION')) . '?status=unknown&message=No se pudo determinar el estado de la suscripción'
            );
        }

        // Verificar si es una recarga
        $recharge = recharge::where('external_reference', $paymentReference)->first();

        if ($recharge) {
            // Manejar el pago de recargas
            switch ($paymentStatus) {
                case 'approved':
                    $recharge->payment_status = 'approved';
                    $recharge->save();

                    $user = $recharge->user;
                    $user->wallet += $recharge->amount;
                    $user->save();
                    $url = trim(env('FRONTEND_URL_TRANSACTION'));
                    $query = http_build_query([
                        'status' => 'approved',
                        'amount' => $recharge->amount,
                        'wallet' => $user->wallet,
                        // Opcional: puedes agregar un mensaje
                        'message' => 'Recarga aprobada exitosamente',
                    ]);

                    return redirect()->away("$url?$query");

                case 'pending':
                    $recharge->payment_status = 'pending';
                    $recharge->save();

                    $url = trim(env('FRONTEND_URL_TRANSACTION'));
                    $query = http_build_query([
                        'status' => 'pending',
                        'reference' => $paymentReference,
                        'message' => 'Pago en proceso de confirmación'
                    ]);

                    return redirect()->away("$url?$query");

                case 'rejected':
                    $recharge->payment_status = 'rejected';
                    $recharge->save();

                    $url = trim(env('FRONTEND_URL_TRANSACTION'));
                    $query = http_build_query([
                        'status' => 'rejected',
                        'message' => 'El pago fue rechazado. Por favor, intenta nuevamente o usa otro método.'
                    ]);

                    return redirect()->away("$url?$query");

                case 'cancelled':
                    $recharge->payment_status = 'cancelled';
                    $recharge->save();

                    $url = trim(env('FRONTEND_URL_TRANSACTION'));
                    $query = http_build_query([
                        'status' => 'cancelled',
                        'message' => 'El pago fue cancelado por el usuario'
                    ]);

                    return redirect()->away("$url?$query");
                default:
                    $url = trim(env('FRONTEND_URL_TRANSACTION'));
                    $query = http_build_query([
                        'status' => 'unknown',
                        'message' => 'No se pudo determinar el estado de la transacción'
                    ]);

                    return redirect()->away("$url?$query");
            }
        }

        // Verificar si es una compra
        $purchase = purchase::where('external_reference', $paymentReference)->with(['productos', 'user'])->first();

        if ($purchase) {
            // Manejar el pago de compras
            switch ($paymentStatus) {
                case 'approved':
                    $latestEndDate = Carbon::now();


                    foreach ($purchase->productos as $producto) {
                        $productoEndDate = Carbon::parse($producto->purchase_date)->addDays($producto->months);
                        if ($productoEndDate->greaterThan($latestEndDate)) {
                            $latestEndDate = $productoEndDate;
                        }
                    }
                    $orde_code = 'ORD-' . strtoupper(Str::random(8));
                    $purchase->payment_status = 'approved';
                    $purchase->save();
                    $subscription = new suscription();
                    $subscription->start_date = now();
                    $subscription->end_date  = now();
                    $subscription->price = $purchase->price;
                    $subscription->order_code = $orde_code;
                    $subscription->usuario_id = $purchase->user->id;
                    $subscription->save();

                    foreach ($purchase->productos as $producto) {
                        Producto::where('id', $producto['id'])->update([
                            'suscripcion_id' => $subscription->id,
                            'status' => 'COMPRADO',
                        ]);

                        $plataforma = Plataforma::find($producto['plataforma_id']);
                        $plataforma->count_avaliable -= 1;
                        $plataforma->save();
                    }
                    $url = trim(env('FRONTEND_URL_SUSCRIPTION'));
                    $query = http_build_query([
                        'status' => 'approved',
                        'ordenCode' => $orde_code,
                        'message' => 'La suscripción ha sido aprobada exitosamente.'
                    ]);

                    return redirect()->away("$url?$query");
                case 'success':
                    $latestEndDate = Carbon::now();


                    foreach ($purchase->productos as $producto) {
                        $productoEndDate = Carbon::parse($producto->purchase_date)->addDays($producto->months);
                        if ($productoEndDate->greaterThan($latestEndDate)) {
                            $latestEndDate = $productoEndDate;
                        }
                    }
                    $orde_code = 'ORD-' . strtoupper(Str::random(8));
                    $purchase->payment_status = 'approved';
                    $purchase->save();
                    $subscription = new suscription();
                    $subscription->start_date = now();
                    $subscription->end_date  = now();
                    $subscription->price = $purchase->price;
                    $subscription->order_code = $orde_code;
                    $subscription->usuario_id = $purchase->user->id;
                    $subscription->save();

                    foreach ($purchase->productos as $producto) {
                        Producto::where('id', $producto['id'])->update([
                            'suscripcion_id' => $subscription->id,
                            'status' => 'COMPRADO',
                        ]);

                        $plataforma = Plataforma::find($producto['plataforma_id']);
                        $plataforma->count_avaliable -= 1;
                        $plataforma->save();
                    }
                    $url = trim(env('FRONTEND_URL_SUSCRIPTION'));
                    $query = http_build_query([
                        'status' => 'approved',
                        'ordenCode' => $orde_code,
                        'message' => 'La suscripción ha sido aprobada exitosamente.'
                    ]);

                    return redirect()->away("$url?$query");

                case 'in_process':
                    $purchase->payment_status = 'pending';
                    $purchase->save();

                    $url = trim(env('FRONTEND_URL_SUSCRIPTION'));
                    $query = http_build_query([
                        'status' => 'pending',
                        'reference' => $paymentReference,
                        'message' => 'El pago está en espera de confirmación.'
                    ]);

                    return redirect()->away("$url?$query");

                case 'pending':
                    $purchase->payment_status = 'pending';
                    $purchase->save();

                    $url = trim(env('FRONTEND_URL_SUSCRIPTION'));
                    $query = http_build_query([
                        'status' => 'pending',
                        'reference' => $paymentReference,
                        'message' => 'El pago está en espera de confirmación.'
                    ]);

                    return redirect()->away("$url?$query");
                case 'rejected':
                    $purchase->payment_status = 'rejected';
                    $purchase->save();

                    $productosAsociados = Producto::where('purchase_id', $purchase->id)->get();

                    foreach ($productosAsociados as $producto) {
                        $producto->purchase_id = null;
                        $producto->status = 'DISPONIBLE';
                        $producto->save();
                    }

                    $url = trim(env('FRONTEND_URL_SUSCRIPTION'));
                    $query = http_build_query([
                        'status' => 'rejected',
                        'message' => 'El pago de la suscripción fue rechazado. Por favor, intenta nuevamente.'
                    ]);

                    return redirect()->away("$url?$query");
                case 'failed':
                    $purchase->payment_status = 'rejected';
                    $purchase->save();

                    $productosAsociados = Producto::where('purchase_id', $purchase->id)->get();

                    foreach ($productosAsociados as $producto) {
                        $producto->purchase_id = null;
                        $producto->status = 'DISPONIBLE';
                        $producto->save();
                    }

                    $url = trim(env('FRONTEND_URL_SUSCRIPTION'));
                    $query = http_build_query([
                        'status' => 'rejected',
                        'message' => 'El pago de la suscripción fue rechazado. Intenta nuevamente o usa otro método de pago.'
                    ]);

                    return redirect()->away("$url?$query");

                case 'cancelled':
                    $purchase->payment_status = 'cancelled';
                    $purchase->save();
                    $productosAsociados = Producto::where('purchase_id', $purchase->id)->get();

                    foreach ($productosAsociados as $producto) {
                        $producto->purchase_id = null;
                        $producto->status = 'DISPONIBLE';
                        $producto->save();
                    }

                    $url = trim(env('FRONTEND_URL_SUSCRIPTION'));
                    $query = http_build_query([
                        'status' => 'cancelled',
                        'message' => 'El pago fue cancelado por el usuario'
                    ]);

                    return redirect()->away("$url?$query");
                default:
                    $url = trim(env('FRONTEND_URL_TRANSACTION'));
                    $query = http_build_query([
                        'status' => 'unknown',
                        'message' => 'No se pudo determinar el estado de la transacción' . 'paymentmetod='. $paymentStatus
                    ]);

                    return redirect()->away("$url?$query");
            }
        }

        // Si no es recarga ni compra
        $url = trim(env('FRONTEND_URL_SUSCRIPTION'));
        $query = http_build_query([
            'status' => 'rejected',
            'message' => 'La referencia de pago no fue encontrada. Por favor, verifica los detalles e intenta nuevamente.'
        ]);

        return redirect()->away("$url?$query");
    }



    public function createPaymentCompraCliente(createSuscriptionRequest $request)
    {
        $user = User::where('id', $request->user_id)->first();

        $payer = array(
            "name" => $user->name,
            "email" => $user->email,
        );

        $productosCompra = [];
        $productosAsociados = [];
        $totalPrice = 0;
        $latestEndDate = Carbon::now();

        foreach ($request->plataformas as $item) {
            $plataforma = plataforma::find($item['id']);
            if (!$plataforma) {
                return response()->json(['error' => "La plataforma con ID {$item['id']} no existe"], 404);
            }

            $price = $plataforma->provider_price;
            $cantidadSolicitada = $item['cantidad'];

            $productosDisponibles = $plataforma->productos()
                ->where('status', 'DISPONIBLE')
                ->limit($cantidadSolicitada)
                ->get();

            if ($productosDisponibles->count() < $cantidadSolicitada) {
                return response()->json([
                    'error' => "No hay suficientes productos disponibles en la plataforma {$plataforma->name}"
                ], 400);
            }

            $totalPrice += $price * $productosDisponibles->count();
            $productosAsociados = array_merge($productosAsociados, $productosDisponibles->toArray());

            foreach ($productosDisponibles as $producto) {
                // Calcular la fecha de vencimiento de cada producto
                $productoEndDate = Carbon::parse($producto->purchase_date)->addMonths($producto->months);

                // Actualizar la fecha de vencimiento más lejana
                if ($productoEndDate->greaterThan($latestEndDate)) {
                    $latestEndDate = $productoEndDate;
                }

                $product = array(
                    "id" => "compra_producto_" . $producto->id,
                    "title" =>  $plataforma->name,
                    "description" => "Compra plataforma virtual",
                    "currency_id" => "COP",
                    "quantity" => 1,
                    "unit_price" => floatval($plataforma->public_price)
                );

                $productosCompra[] = $product;
            }
        }
        $external_reference =  strtoupper(Str::random(8));

        $requestMP = $this->createPreferenceRequest($productosCompra, $payer, $external_reference);

        $client = new PreferenceClient();


        try {
            $preference = $client->create($requestMP);
            $purchase = new purchase();
            $purchase->user_id = $user->id;
            $purchase->price = $totalPrice;
            $purchase->payment_status = 'pending';
            $purchase->payment_reference = $preference->id;
            $purchase->external_reference = $external_reference;
            $purchase->save();

            //setear el producto al purchase
            foreach ($productosAsociados as $producto) {
                $productModel = Producto::find($producto['id']);
                if ($productModel) {
                    $productModel->purchase_id = $purchase->id;
                    // $productModel->status = 'PENDIENTE';
                    $productModel->save();
                }
            }

            return response()->json([
                'payment_url' => $preference->init_point,
                'preference' => $external_reference,
                'status' => 'pending',
                'message' => 'Compra creada'
            ]);
        } catch (\Throwable $th) {

            dd($th);
            return null;
        }
    }
}
