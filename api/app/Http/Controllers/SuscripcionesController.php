<?php

namespace App\Http\Controllers;

use App\Enums\Permission;
use App\Http\Requests\createSuscriptionRequest;
use App\Models\credenciales;
use App\Models\plataforma;
use App\Models\Producto;
use App\Models\suscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SuscripcionesController extends Controller
{

    public $repository;

    public function __construct(suscription $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */


    public function index()
    {
        $suscripcion = suscription::with(['user', 'productos', 'productos.credencial', 'productos.plataforma'])->get();
        return $suscripcion;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(createSuscriptionRequest $request)
    {
        $user = User::where('id', $request->user_id)
            ->whereHas('permissions', function ($query) {
                $query->whereIn('name', [Permission::PROVIDER]);
            })
            ->first();

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado o sin los permisos requeridos'], 404);
        }

        $totalPrice = 0;
        $productosAsociados = [];
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
                $productoEndDate = Carbon::parse($producto->purchase_date)->addDays($producto->months);

                // Actualizar la fecha de vencimiento más lejana
                if ($productoEndDate->greaterThan($latestEndDate)) {
                    $latestEndDate = $productoEndDate;
                }
            }
        }

        if ((float)$user->wallet < (float)$totalPrice) {
            return response()->json(['error' => 'Saldo insuficiente para completar la suscripción'], 400);
        }

        $start_date = now();
        $end_date = $latestEndDate;
        $orderCode = 'ORD-' . strtoupper(Str::random(8));

        $suscripcion = Suscription::create([
            'start_date' => $start_date,
            'end_date' => $end_date,
            'price' => $totalPrice,
            'usuario_id' => $user->id,
            'order_code' => $orderCode,
        ]);

        foreach ($productosAsociados as $producto) {
            Producto::where('id', $producto['id'])->update([
                'suscripcion_id' => $suscripcion->id,
                'status' => 'COMPRADO',
            ]);

            $plataforma = Plataforma::find($producto['plataforma_id']);
            $plataforma->count_avaliable -= 1;
            $plataforma->save();
        }

        $user->wallet -= $totalPrice;
        $user->save();

        return response()->json([
            'message' => 'Suscripción creada con éxito',
            'order_code' => $orderCode
        ], 201);
    }
    function find($orden_code)
    {
        $suscription = $this->repository
            ->where('order_code', $orden_code)
            ->with(['user', 'productos', 'productos.plataforma', 'productos.credencial'])
            ->first();
    
        if (!$suscription) {
            throw new HttpResponseException(response()->json(['error' => 'Suscripcion no encontrada'], 404));
        }
    
        // Crear la estructura personalizada
        $result = [
            'usuario' => [
                'id' => $suscription->user->id,
                'name' => $suscription->user->name,
                'email' => $suscription->user->email,
                'phone'=> $suscription->user->phone
            ],
            'plataformas' => []
        ];
    
        // Agrupar los productos por plataforma y contar la cantidad de productos asociados
        $plataformasCantidad = [];
    
        foreach ($suscription->productos as $producto) {
            $plataforma = $producto->plataforma;
    
            if ($plataforma) {
                // Asegurarse de que la imagen tenga un formato válido
                if (
                    $plataforma->image_url &&
                    !str_starts_with($plataforma->image_url, 'http://') &&
                    !str_starts_with($plataforma->image_url, 'https://')
                ) {
                    $plataforma->image_url = url('images/' . ltrim($plataforma->image_url, '/'));
                }
    
                // Sumar la cantidad de productos para cada plataforma
                if (!isset($plataformasCantidad[$plataforma->id])) {
                    $plataformasCantidad[$plataforma->id] = [
                        'id' => $plataforma->id,
                        'name' => $plataforma->name,
                        'image_url' => $plataforma->image_url,
                        'type' => $plataforma->type,
                        'cantidad' => 0,
                        'productos' => [],
                    ];
                }
    
                $plataformasCantidad[$plataforma->id]['productos'][] = [
                    'id' => $producto->id,
                    'fecha_compra' => $producto->purchase_date,
                    'profile_name' => $producto->profile_name,
                    'profile_pin' =>$producto->profile_pin,
                    'months' => $producto->months,
                    'email'=> $producto->credencial->email,
                    'password'=> $producto->credencial->password,

                ];


                $plataformasCantidad[$plataforma->id]['cantidad']++;
            }
        }
    
        // Agregar las plataformas al resultado final
        $result['plataformas'] = array_values($plataformasCantidad);
    
        return response()->json($result);
    }
    


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
