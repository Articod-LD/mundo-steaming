<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopException;
use App\Http\Requests\PlataformaCreateRequest;
use App\Models\suscriptionType;
use Illuminate\Http\Request;

class PlataformaController extends Controller
{


    public $repository;

    public function __construct(suscriptionType $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->repository->with(['credenciales' => function ($query) {
            $query->where('is_active', true);
        }])->get()->map(function ($categoria) {
            $categoria->imagen = url('images/' . $categoria->image_url);
            return $categoria;
        });
    }

    public function plataformasDisponibles()
    {
        return $this->repository->with([])->whereHas('credenciales', function ($query) {
            $query->where('is_active', true);
        })->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(PlataformaCreateRequest $request)
    {
        $imageName = time() . '.' . $request->image_url->extension();
        $request->image_url->move(public_path('images'), $imageName);

        $response = suscriptionType::create([
            'name' => $request->name,
            'image_url' => $imageName,
            'precio' => $request->precio,
            'precio_provider' => $request->precio_provider,
        ]);

        return response()->json(['BannerItem' => $response], 200);
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
    public function destroy(Request $request, string $plataforma_id)
    {
        $banner = suscriptionType::find($plataforma_id);
        $banner->delete();

        return response()->json(['success' => 'Banner deleted successfully.']);
    }
}
