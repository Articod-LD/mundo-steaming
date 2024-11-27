<?php

namespace App\Imports;

use App\Models\Credenciales;
use App\Models\Plataforma;
use App\Models\Producto;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ProductoImport implements ToCollection, WithHeadingRow, WithValidation
{
    public function collection(Collection $rows)
    {
        $errores = []; // Para almacenar los errores de validación
        $productosIds = []; // Para almacenar los IDs de los productos creados

        // Iniciar la transacción
        DB::beginTransaction();

        try {
            // Primero, validamos y creamos los productos
            foreach ($rows as $index => $row) {
                $NamePlataforma = $row['plataforma'];
                $type = $row['pantalla'] === 'SI' ? 'pantalla' : 'completa';
                $correo = $row['correo'];
                $password = $row['contrasena'];
                $perfil = $row['perfil'];
                $pin_perfil = $row['pin_perfil'];
                $fecha_compra = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['fecha_compra']);
                $meses = $row['meses'];

                // Buscar la plataforma correspondiente
                $platform = plataforma::where('name', $NamePlataforma)
                    ->where('type', $type)
                    ->first();

                if (!$platform) {
                    $errores[] = "Plataforma '{$NamePlataforma}' con tipo '{$type}' no encontrada en la fila {$index}.";
                    continue; // Pasar a la siguiente fila
                }

                // Crear o buscar la credencial
                $credencial = Credenciales::where('email', $correo)
                    ->where('password', $password)
                    ->first();

                if (!$credencial) {
                    // Si no existe, crear la credencial
                    $credencial = new Credenciales([
                        'email' => $correo,
                        'password' => $password,
                        'is_active' => true,
                    ]);
                    $credencial->save(); // Guardar la credencial inmediatamente
                }

                if ($platform->type === 'pantalla') {
                    $duplicado = Producto::where('plataforma_id', $platform->id)
                        ->where('credencial_id', $credencial->id)
                        ->where(function ($query) use ($perfil) {
                            $query->where('profile_name', $perfil);
                        })
                        ->first();
    
                    if ($duplicado) {
                        $errores[] = "El perfil '{$perfil}' ya esta en uso para la plataforma '{$NamePlataforma}' con tipo 'pantalla' en la fila {$index}.";
                        continue;
                    }
                }

                // Buscar el producto
                $producto = Producto::where('plataforma_id', $platform->id)
                    ->where('credencial_id', $credencial->id)
                    ->where('profile_name', $perfil)
                    ->first();

                if ($producto) {
                    // Validamos que no sea una plataforma completa
                    if ($producto->plataforma->type === 'completa') {
                        $errores[] = "No se pueden crear más productos a una plataforma de tipo completa con correo '{$correo}' y plataforma '{$NamePlataforma}' en la fila {$index}.";
                        continue; // Pasar a la siguiente fila
                    } 
                } else {

                    $screenCount = Producto::where('plataforma_id', $platform->id)
                    ->where('credencial_id', $credencial->id)
                    ->count();
                    // Si no existe el producto, lo creamos
                    $producto = new Producto([
                        'plataforma_id' => $platform->id,
                        'credencial_id' => $credencial->id,
                        'profile_name' => $perfil,
                        'profile_pin' => $pin_perfil,
                        'purchase_date' => $fecha_compra,
                        'screen_count' => $screenCount + 1, 
                        'months' => $meses
                    ]);
                    $producto->save();

                    // Almacenar el ID del producto creado para revertirlo si hay un error
                    $productosIds[] = $producto->id;
                }

                // Actualizar la plataforma
                $platform->count_avaliable += 1;
                $platform->save();
            }

            // Si hay errores, lanzamos una excepción
            if (!empty($errores)) {
                throw new Exception("Se encontraron los siguientes errores:\n" . implode("\n", $errores));
            }

            // Si todo está bien, confirmamos la transacción
            DB::commit();
        } catch (Exception $e) {
            // Si hubo un error, revertimos todos los productos creados
            foreach ($productosIds as $productoId) {
                $producto = Producto::find($productoId);
                if ($producto) {
                    $producto->delete(); // Eliminar el producto creado
                }
            }

            // Hacer rollback de la transacción
            DB::rollBack();

            // Lanzamos la excepción para manejarla más arriba
            throw new Exception($e->getMessage());
        }
    }

    public function rules(): array
    {
        return [
            'plataforma' => 'required|string',
            'correo' => 'required|email',
            'contrasena' => 'required',
            'pantalla' => ['required', Rule::in(['SI', 'NO'])],
            'perfil' => 'nullable|required_if:pantalla,SI|string',
            'pin_perfil' => 'nullable|required_if:pantalla,SI|numeric',
            'fecha_compra' => 'required',
            'meses' => 'required|numeric|min:1',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'plataforma.required' => 'El campo Plataforma es obligatorio.',
            'plataforma.string' => 'El campo Plataforma debe ser un texto.',

            'correo.required' => 'El campo Correo es obligatorio.',
            'correo.email' => 'El campo Correo debe ser un correo electrónico válido.',

            'contrasena.required' => 'El campo Contraseña es obligatorio.',

            'pantalla.required' => 'El campo Pantalla es obligatorio.',
            'pantalla.in' => 'El campo Pantalla debe ser "SI" o "NO".',

            'perfil.required_if' => 'El campo Perfil es obligatorio cuando el campo Pantalla es "SI".',
            'perfil.string' => 'El campo Perfil debe ser un texto.',

            'pin_perfil.required_if' => 'El campo Pin Perfil es obligatorio cuando el campo Pantalla es "SI".',
            'pin_perfil.numeric' => 'El campo Pin Perfil debe ser un número.',

            'fecha_compra.required' => 'El campo Fecha Compra es obligatorio.',

            'meses.required' => 'El campo Meses es obligatorio.',
            'meses.numeric' => 'El campo Meses debe ser un número.',
            'meses.min' => 'El campo Meses debe ser al menos 1.',
        ];
    }
}
