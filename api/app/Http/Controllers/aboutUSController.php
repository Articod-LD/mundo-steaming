<?php

namespace App\Http\Controllers;

use App\Models\aboutus;
use Illuminate\Http\Request;

class aboutUSController extends Controller
{
    public function index()
    {
        $categoria = aboutus::first();

        if ($categoria) {
            $categoria->image_url = url('images/' . $categoria->image_url);
        }

        return $categoria;
    }


    public function create(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'description' => 'required|string',
                'video_url' => 'required|string|max:255',
                'image_url' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $imageName = time() . '.' . $request->image_url->extension();
            $request->image_url->move(public_path('images'), $imageName);

            $validatedData['image_url'] = $imageName;

            $response = aboutus::create($validatedData);

            return response()->json(['beneficio' => $response], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Retorna un JSON con los errores de validación
            return response()->json([
                'success' => false,
                'message' => 'Errores de validación.',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function update(Request $request, string $id)
    {
        $banner = aboutus::find($id);

        if (!$banner) {
            return response()->json(['error' => 'Configuracion no encontrada'], 404);
        }

        if ($request->hasFile('image_url')) {
            $imageName = time() . '.' . $request->image_url->extension();
            $request->image_url->move(public_path('images'), $imageName);

            // Eliminar la imagen anterior si existe
            if ($banner->image_url && file_exists(public_path('images/' . $banner->image_url))) {
                unlink(public_path('images/' . $banner->image_url));
            }

            $banner->image_url = $imageName;
        }

        $banner->description = $request->description;
        $banner->video_url = $request->video_url;
        $banner->save();

        return response()->json(['error' => 'Configuracion actualizada exitosamente', 'CategoriaItem' => $banner], 200);
    }


    public function destroy(Request $request, $categoria_id)
    {
        $banner = aboutus::find($categoria_id);

        if (!$banner) {
            return response()->json(['error' => 'Categoria not found'], 404);
        }
        $banner->delete();

        return response()->json(['success' => 'Configuracion deleted successfully.']);
    }
}
