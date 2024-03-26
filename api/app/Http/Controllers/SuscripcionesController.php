<?php

namespace App\Http\Controllers;

use App\Http\Requests\createSuscriptionRequest;
use App\Models\credenciales;
use App\Models\suscription;
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
        $suscription = $this->repository::with('credential', 'credential.tipo')->get();
        return response()->json(['suscripcion' => $suscription], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(createSuscriptionRequest $request)
    {
        $fecha_inicio = Carbon::parse($request->fecha_inicio)->toDateTimeString();
        $fecha_fin = Carbon::parse($request->fecha_fin)->toDateTimeString();

        $suscripcion = suscription::create([
            'Fecha_Inicio' => $fecha_inicio,
            'Fecha_Fin' => $fecha_fin,
            'precio' => $request->precio,
            'pagado' => $request->pagado ?? false,
            'usuario_id' => $request->usuario_id
        ]);

        $credencial = credenciales::create([
            'email' => $request->email,
            'password' => $request->password,
            'suscripcion_id' => $suscripcion->id,
            'tipo_id' => $request->tipo_id,
        ]);


        return response()->json(['message' => 'Suscripción y credencial creadas correctamente', 'suscripcion' => $suscripcion, 'credencial' => $credencial], 201);
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
