<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoriaRequest;
use App\Models\categorias;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Calculation\Category;

class CategoriasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categorie = categorias::all()->map(function ($banner) {
            $banner->imagen_url = url('images/' . $banner->imagen);
            return $banner;
        });

        return response()->json($categorie);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoriaRequest $request)
    {
        $imageName = time() . '.' . $request->imagen->extension();
        $request->imagen->move(public_path('images'), $imageName);

        $response = categorias::create([
            'titulo' => $request->titulo,
            'imagen' => $imageName,
        ]);

        return response()->json(['BannerItem' => $response], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banner = categorias::find($id);

        if (!$banner) {
            return response()->json(['error' => 'Categoria no encontrada'], 404);
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
        // Guardar los cambios
        $banner->save();

        return response()->json(['error' => 'Categoria actualizada exitosamente', 'CategoriaItem' => $banner], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function getPlataformaByCategoria(Request $request, string $nombre_categoria)
    {
        // Buscar la categoría ignorando mayúsculas/minúsculas
        $categoria = categorias::whereRaw('LOWER(titulo) = ?', [Str::lower($nombre_categoria)])
            ->with('plataformas.productos','plataformas.categoria') // Cargar las relaciones necesarias
            ->first();

        if (!$categoria) {
            return response()->json(['error' => 'Categoría no encontrada'], 404);
        }

        // Filtrar las plataformas que tienen productos asociados
        $plataformas = $categoria->plataformas
            ->filter(function ($plataforma) {
                return $plataforma->productos->where('status', 'DISPONIBLE')->count() > 0 ;
            })
            ->map(function ($plataforma) {
                // Agregar la URL absoluta de la imagen
                $plataforma->image_url = url('images/' . $plataforma->image_url);
                return $plataforma;
            })
            ->values(); // Reiniciar los índices del array

        return response()->json($plataformas);
    }

    public function destroy(Request $request, $categoria_id)
    {
        $banner = categorias::find($categoria_id);

        if (!$banner) {
            return response()->json(['error' => 'Categoria not found'], 404);
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
