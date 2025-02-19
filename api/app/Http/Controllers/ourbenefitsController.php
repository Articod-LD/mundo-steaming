<?php

namespace App\Http\Controllers;

use App\Models\ourbenefits;
use Illuminate\Http\Request;

class ourbenefitsController extends Controller
{

    public function index()
    {
        $beneficios = ourbenefits::get();
        return response()->json($beneficios);
    }

    public function create(Request $request)
    {

        try {
            $validatedData = $request->validate([
                'beneficio' => 'required|string|max:255',
            ]);
            $response = ourbenefits::create($validatedData);

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
        $banner = ourbenefits::find($id);

        if (!$banner) {
            return response()->json(['error' => 'Beneficio no encontrada'], 404);
        }

        $banner->beneficio = $request->beneficio;
        $banner->save();

        return response()->json(['error' => 'Beneficio actualizada exitosamente', 'CategoriaItem' => $banner], 200);
    }


    public function destroy(Request $request, $categoria_id)
    {
        $banner = ourbenefits::find($categoria_id);

        if (!$banner) {
            return response()->json(['error' => 'Categoria not found'], 404);
        }
        $banner->delete();

        return response()->json(['success' => 'Banner deleted successfully.']);
    }
}
