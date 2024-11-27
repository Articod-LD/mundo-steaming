<?php

namespace App\Http\Controllers;

use App\Enums\Permission;
use App\Http\Requests\createSuscriptionRequest;
use App\Models\credenciales;
use App\Models\plataforma;
use App\Models\suscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

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
                $query->whereIn('name', [Permission::CUSTOMER, Permission::PROVIDER]);
            })
            ->first();

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado o sin los permisos requeridos'], 404);
        }
        // Buscar la plataforma
        $plataforma = plataforma::find($request->plataforma_id);
        if (!$plataforma) {
            return response()->json(['error' => 'Plataforma no encontrada'], 404);
        }
        $isCustomer = $user->permissions->contains('name', Permission::CUSTOMER);
        $price = $isCustomer ? $plataforma->public_price : $plataforma->provider_price;

        if ((float)$user->wallet < (float)$price) {
            return response()->json(['error' => 'Saldo insuficiente'], 400);
        }

        $producto = $plataforma->productos()
            ->where('status', 'DISPONIBLE')
            ->first();

        if (!$producto) {
            return response()->json(['error' => 'No hay productos disponibles en la plataforma'], 400);
        }

        $user->wallet -= $price;
        $user->save();

        $plataforma->count_avaliable -= 1;
        $plataforma->save();

        $start_date = now();
        $end_date = now()->addMonths($producto->months);

        $suscripcion = suscription::create([
            'start_date' => $start_date,
            'end_date' => $end_date,
            'price' => $price,
            'usuario_id' => $user->id,
        ]);

        $producto->suscripcion_id = $suscripcion->id;
        $producto->status = 'COMPRADO';
        $producto->save();


        return response()->json([
            'message' => 'Suscripción creada con éxito',
            'suscripcion' => $suscripcion,
        ], 201);
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
