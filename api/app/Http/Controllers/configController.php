<?php

namespace App\Http\Controllers;

use App\Models\config;
use Illuminate\Http\Request;

class configController extends Controller
{
    public function index()
    {
        $beneficio = config::first();
        return response()->json($beneficio);
    }

    public function create(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'cel' => 'required|string|max:255',
                'insta_url' => 'required|string|max:255',
                'whatsapp_url' => 'required|string|max:255',
                'plataforma' => 'required|string|max:255',
            ]);
            $response = config::create($validatedData);

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
        $banner = config::find($id);

        if (!$banner) {
            return response()->json(['error' => 'Configuracion no encontrada'], 404);
        }

        $banner->title = $request->title;
        $banner->cel = $request->cel;
        $banner->insta_url = $request->insta_url;
        $banner->whatsapp_url = $request->whatsapp_url;
        $banner->plataforma = $request->plataforma;

        $banner->save();

        return response()->json(['error' => 'Configuracion actualizada exitosamente', 'CategoriaItem' => $banner], 200);
    }


    public function destroy(Request $request, $categoria_id)
    {
        $banner = config::find($categoria_id);

        if (!$banner) {
            return response()->json(['error' => 'Categoria not found'], 404);
        }
        $banner->delete();

        return response()->json(['success' => 'Configuracion deleted successfully.']);
    }
}
