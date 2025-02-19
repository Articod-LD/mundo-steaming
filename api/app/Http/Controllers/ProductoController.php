<?php

namespace App\Http\Controllers;

use App\Http\Requests\createProductoRequest;
use App\Http\Requests\updateProducto;
use App\Imports\ProductoImport;
use App\Models\credenciales;
use App\Models\plataforma;
use App\Models\Producto;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

class ProductoController extends Controller
{

    public $repository;

    public function __construct(Producto $repository)
    {
        $this->repository = $repository;
    }


    function index(Request $request)
    {
        $limit = $request->limit ?? 100000;

        // Obtener productos con relaciones
        $productos = $this->repository
            ->with(['plataforma', 'suscripcion', 'credencial'])
            ->paginate($limit);

        // Obtener la colección de productos y procesar cada uno
        foreach ($productos->items() as $producto) {
            if ($producto->plataforma->image_url && !str_starts_with($producto->plataforma->image_url, 'http://') && !str_starts_with($producto->plataforma->image_url, 'https://')) {
                $producto->plataforma->image_url = url('images/' . ltrim($producto->plataforma->image_url, '/'));
            }
        }

        // Retornar los productos con la plataforma y la imagen actualizada
        return $productos;
    }




    function import(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file',
            ]);

            Excel::import(new ProductoImport, $request->file('file'));

            return response()->json(['message' => 'Importación completada con éxito.'], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    function create(createProductoRequest $request)
    {
        $productosIds = [];
        try {
            $plataforma = plataforma::where('id', $request->plataforma_id)
                ->first();

            if (!$plataforma) {
                throw new HttpResponseException(response()->json(['error' => 'plataforma no encontrada'], 404));
            }

            $credencial = Credenciales::where('email', $request->email)
                ->where('password', $request->password)
                ->first();

            if (!$credencial) {
                // Si no existe, crear la credencial
                $credencial = new Credenciales([
                    'email' => $request->email,
                    'password' => $request->password,
                    'is_active' => true,
                ]);
                $credencial->save();
            }
            $perfil = $request->perfil;
            if ($plataforma->type === 'pantalla') {
                $duplicado = Producto::where('plataforma_id', $plataforma->id)
                    ->where('credencial_id', $credencial->id)
                    ->where(function ($query) use ($perfil) {
                        $query->where('profile_name', $perfil);
                    })
                    ->first();

                if ($duplicado) {
                    throw new HttpResponseException(response()->json(['error' => "El perfil '{$perfil}' ya esta en uso para la plataforma '{$plataforma->name}' con tipo 'pantalla'"], 404));
                }
            }
            $producto = Producto::where('plataforma_id', $plataforma->id)
                ->with(['credencial', 'plataforma'])
                ->where('credencial_id', $credencial->id)
                ->where('profile_name', $perfil)
                ->first();

            if ($producto) {
                // Validamos que no sea una plataforma completa
                if ($producto->plataforma->type === 'completa') {
                    throw new HttpResponseException(response()->json(['error' => "No se pueden crear más productos a una plataforma de tipo completa con correo '{$request->correo}' y plataforma '{$plataforma->name}'."], 404));
                }
            } else {
                $fechaConvertida = Carbon::parse($request->fecha_compra)->setTimezone('UTC')->format('Y-m-d H:i:s');

                $screenCount = Producto::where('plataforma_id', $plataforma->id)
                    ->where('credencial_id', $credencial->id)
                    ->count();
                // Si no existe el producto, lo creamos
                $producto = new Producto([
                    'plataforma_id' => $plataforma->id,
                    'credencial_id' => $credencial->id,
                    'profile_name' => $perfil,
                    'profile_pin' => $request->pin_perfil,
                    'purchase_date' => $fechaConvertida,
                    'screen_count' => $screenCount + 1,
                    'months' => $request->meses
                ]);
                $producto->save();
                $productosIds[] = $producto->id;
            }

            // Actualizar la plataforma
            $plataforma->count_avaliable += 1;
            $plataforma->save();

            return response()->json([
                'message' => 'producto creado correctamente'
            ], 200);
        } catch (Exception $e) {
            foreach ($productosIds as $productoId) {
                $producto = Producto::find($productoId);
                if ($producto) {
                    $producto->delete();
                }
            }

            throw new Exception("Error: " . $e->getMessage());
        }
    }

    function update(updateProducto $request, string $product_id)
    {
        $producto = Producto::find($product_id);
        if (!$producto || $producto->status !== 'DISPONIBLE') {
            // Si no se encuentra el producto o su estado no es "DISPONIBLE"
            return response()->json([
                'message' => 'No se puede actualizar el producto. El estado no es "DISPONIBLE".'
            ], 400);
        }

        $credencial = $producto->credencial;
        $mensaje = 'Producto actualizado exitosamente. ';  // Mensaje predeterminado
        // Elimina la credencial solo si vienen email y password
        if ($credencial && $request->filled(['email', 'password'])) {
            $credencialUsos = Producto::where('credencial_id', $credencial->id)->count();
            $credencial->email = $request->email;
            $credencial->password = $request->password;
            $credencial->save();
            $mensaje = $mensaje . " y Se actualizaron {$credencialUsos} cuenta(s) con la nueva credencial.";
        }

        // Actualiza los campos del producto solo si están presentes en el request
        if ($request->has('perfil')) {
            $producto->profile_name = $request->perfil;
        }

        if ($request->has('pin_perfil')) {
            $producto->profile_pin = $request->pin_perfil;
        }

        if ($request->has('fecha_compra')) {
            $producto->purchase_date = Carbon::parse($request->fecha_compra)->setTimezone('UTC')->format('Y-m-d H:i:s');
        }

        if ($request->has('meses')) {
            $producto->months = $request->meses;
        }

        // Guarda los cambios del producto
        $producto->save();

        // Responder con éxito
        return response()->json(['message' => $mensaje], 200);
    }


    function destroy(Request $request, $product_id)
    {
        $producto = Producto::find($product_id);

        // Verificar si el producto existe y su estado es 'disponible'
        if ($producto && $producto->status === 'DISPONIBLE') {

            $credencial = $producto->credencial;
            $credencialUsos = Producto::where('credencial_id', $credencial->id)->count();
            if ($credencialUsos == 1) {
                $credencial->delete();
            }

            $plataforma = $producto->plataforma;
            if ($plataforma) {
                // Actualizar el campo 'count_available' de la plataforma, restando 1
                $plataforma->count_avaliable = max(0, $plataforma->count_avaliable - 1); // No permitir que sea negativo
                $plataforma->save();
            }

            // Eliminar el producto
            $producto->delete();

            // Responder con éxito
            return response()->json([
                'message' => 'Producto eliminado exitosamente.'
            ], 200);
        }

        // Si no se cumple la condición, responder con error
        return response()->json([
            'message' => 'No se puede eliminar el producto. El estado no es "disponible".'
        ], 400);
    }
}
