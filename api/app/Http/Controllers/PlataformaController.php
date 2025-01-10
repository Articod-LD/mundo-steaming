<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopException;
use App\Http\Requests\PlataformaCreateRequest;
use App\Models\categorias;
use App\Models\plataforma;
use Illuminate\Http\Request;

class PlataformaController extends Controller
{


    public $repository;

    public function __construct(plataforma $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->repository->with(['productos','categoria'])->get()
            ->filter(function ($categoria) {
                return $categoria->is_active === 1; // Filtrar las categorías que están activas
            })
            ->map(function ($categoria) {
                $categoria->image_url = url('images/' . $categoria->image_url);
                return $categoria;
            })
            ->values(); // Forzar a que sea un array
    }

    public function plataformasDisponibles()
    {
        $plataformas = Plataforma::whereHas('productos', function ($query) {
            $query->where('status', 'DISPONIBLE');
        })
            ->with(['productos' => function ($query) {
                $query->where('status', 'DISPONIBLE');
            }])
            ->with('categoria')
            ->get()
            ->filter(function ($plataforma) {
                return $plataforma->productos->count() > 0;
                // && $plataforma->productos->count() === $plataforma->count_avaliable;
            })
            ->map(function ($categoria) {
                // Transformamos la URL de la imagen
                $categoria->image_url = url('images/' . $categoria->image_url);
                return $categoria;
            })
            ->values(); // Usamos values() para convertirlo en un array de objetos

        return response()->json($plataformas);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create(PlataformaCreateRequest $request)
    {

        $categoria = categorias::where('id', $request->categoria_id)->first();
        if (!$categoria) {
            return response()->json([
                'error' => 'No Existe una categoria con este ID.'
            ], 400);
        }

        $existingPlatform = plataforma::where('name', $request->name)
            ->where('type', $request->type)
            ->where('is_active', true) // Cambia 'estado' según el campo real en tu base de datos
            ->first();

        if ($existingPlatform) {
            return response()->json([
                'error' => 'Ya existe una plataforma activa con el mismo nombre y tipo.'
            ], 400);
        }

        $imageName = time() . '.' . $request->image_url->extension();
        $request->image_url->move(public_path('images'), $imageName);

        $response = $this->repository->create([
            'name' => $request->name,
            'image_url' => $imageName,
            'public_price' => $request->public_price,
            'provider_price' => $request->provider_price,
            'type' => $request->type,
            'categoria_id' => $categoria->id,
            'description' => $request->description,
        ]);

        return response()->json(['Plataforma' => $response], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $platform = plataforma::find($id);

        if (!$platform) {
            return response()->json(['error' => 'Plataforma no encontrada.'], 404);
        }

        // Verificar si la plataforma tiene productos asociados
        if ($platform->productos()->exists()) { // Cambia 'products' según la relación definida
            return response()->json(['error' => 'No se puede editar una plataforma con productos asociados.'], 400);
        }

        // Validar si existe otra plataforma activa con el mismo nombre y tipo
        $existingPlatform = plataforma::where('name', $request->name)
            ->where('type', $request->type)
            ->where('is_active', true) // Cambia 'estado' según el campo real en tu base de datos
            ->where('id', '!=', $id) // Excluir la plataforma actual
            ->first();

        if ($existingPlatform) {
            return response()->json([
                'error' => 'Ya existe otra plataforma activa con el mismo nombre y tipo.'
            ], 400);
        }

        // Si se proporciona una nueva imagen, subirla
        if ($request->hasFile('image_url')) {
            $imageName = time() . '.' . $request->image_url->extension();
            $request->image_url->move(public_path('images'), $imageName);

            // Eliminar la imagen anterior si existe
            if ($platform->image_url && file_exists(public_path('images/' . $platform->image_url))) {
                unlink(public_path('images/' . $platform->image_url));
            }

            $platform->image_url = $imageName;
        }

        // Actualizar los demás campos
        $platform->name = $request->name;
        $platform->public_price = $request->public_price;
        $platform->provider_price = $request->provider_price;
        $platform->type = $request->type;
        $platform->save();

        return response()->json(['Plataforma actualizada' => $platform], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $plataforma_id)
    {
        // Encuentra la plataforma
        $plataforma = plataforma::with('productos')->find($plataforma_id);

        // Verifica si existe la plataforma
        if (!$plataforma) {
            return response()->json(['error' => 'Plataforma no encontrada.'], 404);
        }

        // Verifica si la plataforma no tiene productos asociados
        if ($plataforma->productos->isEmpty()) {
            // Inhabilita la plataforma
            $plataforma->update(['is_active' => false]);

            $imagePath = public_path('images/' . $plataforma->image_url);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }

            return response()->json(['success' => 'Plataforma inhabilitada exitosamente.']);
        }

        // Si tiene productos, devuelve un mensaje
        return response()->json(['error' => 'No se puede inhabilitar porque tiene productos asociados.'], 400);
    }

}
