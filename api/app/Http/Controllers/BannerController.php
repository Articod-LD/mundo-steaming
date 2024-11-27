<?php

namespace App\Http\Controllers;

use App\Http\Requests\BannerRequest;
use App\Models\banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BannerController extends Controller
{
    public $repository;

    public function __construct(banner $repository)
    {
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banners = Banner::all()->map(function ($banner) {
            $banner->imagen_url = url('images/' . $banner->imagen);
            return $banner;
        });

        return response()->json($banners);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(BannerRequest $request)
    {
        $imageName = time() . '.' . $request->imagen->extension();
        $request->imagen->move(public_path('images'), $imageName);

        $response = Banner::create([
            'titulo' => $request->titulo,
            'texto' => $request->texto,
            'imagen' => $imageName,
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

        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['message' => 'Banner no encontrado'], 404);
        }

            // Si se envió una nueva imagen, procesarla
    if ($request->hasFile('imagen')) {
        // Eliminar la imagen anterior si existe
        if ($banner->imagen && file_exists(public_path('images/' . $banner->imagen))) {
            unlink(public_path('images/' . $banner->imagen));
        }

        // Guardar la nueva imagen
        $imageName = time() . '.' . $request->imagen->extension();
        $request->imagen->move(public_path('images'), $imageName);

        $banner->imagen = $imageName;
        
    }

    // Actualizar los demás campos
    $banner->titulo = $request->titulo ?? $banner->titulo;
    $banner->texto = $request->texto ?? $banner->texto;

    // Guardar los cambios
    $banner->save();

    return response()->json(['message' => 'Banner actualizado exitosamente', 'BannerItem' => $banner], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $banner_id)
    {
        $banner = Banner::find($banner_id);

        if (!$banner) {
            return response()->json(['error' => 'Banner not found'], 404);
        }

        // Delete the image file from the public/images directory
        $imagePath = public_path('images/' . $banner->imagen);
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }

        // Delete the banner from the database
        $banner->delete();

        return response()->json(['success' => 'Banner deleted successfully.']);
    }
}
