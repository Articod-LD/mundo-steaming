<?php

namespace App\Http\Controllers;

use App\Http\Requests\aceptarSolicitudRequest;
use App\Http\Requests\createSolicitudeRequest;
use App\Models\credenciales;
use App\Models\solicitudes;
use App\Models\suscription;
use Carbon\Carbon;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;

class SolicitudController extends Controller
{

    public $repository;

    public function __construct(solicitudes $repository)
    {
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(createSolicitudeRequest $request)
    {

        $existingSolicitud = $this->repository
            ->where('usuario_id', $request->usuario_id)
            ->where('tipo_id', $request->tipo_id)
            ->first();

        if ($existingSolicitud) {
            throw new HttpResponseException(response()->json(['error' => 'El usuario ya ha realizado esta solicitud previamente'], 400));
        }

        $solicitud = $this->repository->create([
            'usuario_id' => $request->usuario_id,
            'tipo_id' => $request->tipo_id
        ]);


        return ["message" => 'Solicitud creada correctamente', "solicitud" => $solicitud];
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

    function solicitudes(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        $solicitudes = $this->repository
            ->with(['user', 'tipo', 'user.permissions'])
            ->paginate($limit);

        return $solicitudes;
    }

    function deleteSolicitud(Request $request, $solicitud_id)
    {
        $solicitud = $this->repository::find($solicitud_id);
        if (!$solicitud) {
            throw new HttpResponseException(response()->json(['error' => 'Solicitud no encontrada'], 404));
        }
        $solicitud->delete();

        return response()->json(['message' => 'Solicitud eliminada correctamente'], 200);
    }


    function aceptarSolicitud(aceptarSolicitudRequest $request, $solicitud_id)
    {
        $solicitud = $this->repository::with(['user', 'tipo'])->find($solicitud_id);
        $usuario_id = $solicitud->usuario_id;
        $tipo_id = $solicitud->tipo_id;

        // Verificar si la solicitud existe
        if (!$solicitud) {
            throw new HttpResponseException(response()->json(['error' => 'Solicitud no encontrada'], 404));
        }

        $fecha_inicio = Carbon::parse($request->fecha_inicio)->toDateTimeString();
        $fecha_fin = Carbon::parse($request->fecha_fin)->toDateTimeString();

        $suscripcion = suscription::create([
            'Fecha_Inicio' => $fecha_inicio,
            'Fecha_Fin' => $fecha_fin,
            'precio' => $request->precio,
            'pagado' => $request->pagado ?? false,
            'usuario_id' => $usuario_id
        ]);

        $credencial = credenciales::create([
            'email' => $request->email,
            'password' => $request->password,
            'suscripcion_id' => $suscripcion->id,
            'tipo_id' => $tipo_id,
        ]);

        // Borra la solicitud
        $solicitud->delete();

        return response()->json(['message' => 'Suscripción y credencial creadas correctamente', 'suscripcion' => $suscripcion, 'credencial' => $credencial], 201);
    }
}
