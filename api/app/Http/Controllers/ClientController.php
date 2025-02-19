<?php

namespace App\Http\Controllers;

use App\Enums\Permission;
use App\Http\Requests\updapteUserProfileRequest;
use App\Http\Requests\UserCreateRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{

    public $repository;

    public function __construct(User $repository)
    {
        $this->repository = $repository;
    }

    function index(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        $clientes = $this->repository
            ->where('is_active', true)
            ->with(['suscriptions', 'permissions'])
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::CUSTOMER);
            })
            ->paginate($limit);

        return $clientes;
    }

    function find(Request $request, $client_id)
    {

        $user = $this->repository
            ->where('id', $client_id)
            ->with([
                'suscriptions',
                'permissions',
                'suscriptions.productos',
                'suscriptions.productos.plataforma',
                'suscriptions.productos.credencial'
            ])
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::CUSTOMER);
            })
            ->first();

        if (!$user) {
            throw new HttpResponseException(response()->json(['error' => 'Usuario no encontrado'], 404));
        }

        if ($user) {
            // Modificar la URL de la imagen de la categoría (si es necesario)
            $user->image_url = url('images/' . $user->image_url);

            // Iterar sobre las suscripciones
            $user->suscriptions->each(function ($suscripcion) {
                // Iteramos sobre los productos de cada suscripción
                $suscripcion->productos->each(function ($producto) {
                    // Verificamos si la plataforma existe para el producto
                    if ($producto->plataforma) {
                        // Modificamos la URL de la imagen de la plataforma
                        $producto->plataforma->image_url = url('images/' . $producto->plataforma->image_url);
                    }
                    // Verificamos si la credencial existe para el producto
                    if ($producto->credencial) {
                        // Modificamos la URL de la imagen de la credencial (si aplica)
                        $producto->credencial->image_url = url('images/' . $producto->credencial->image_url);
                    }
                });
            });
        }

        return $user;
    }

    function create(UserCreateRequest $request)
    {
        $notAllowedPermissions = [Permission::SUPER_ADMIN, Permission::PROVIDER];

        if ((isset($request->permission->value) && in_array($request->permission->value, $notAllowedPermissions)) || (isset($request->permission) && in_array($request->permission, $notAllowedPermissions))) {
            throw new HttpResponseException(response()->json(['error' => 'NOT_AUTHORIZED'], 401));
        }

        $permissions = [];
        if (isset($request->permission)) {
            $permissions[] = isset($request->permission->value) ? $request->permission->value : $request->permission;
        }

        $user = $this->repository->create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'wallet' => $request->wallet ? $request->wallet  : 0,
        ]);

        $user->givePermissionTo($permissions);

        return ["token" => $user->createToken('auth_token')->plainTextToken, "permissions" => $user->getPermissionNames()];
    }

    public function update(updapteUserProfileRequest $request, $client_id)
    {
        $data = $request->all();

        $user = $this->repository
            ->where('id', $client_id)
            ->with(['suscriptions', 'permissions'])
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::CUSTOMER);
            })
            ->first();

        if (!$user) {
            throw new HttpResponseException(response()->json(['error' => 'Usuario no encontrado'], 404));
        }

        $user->update($data);

        return response()->json(['error' => 'Usuario actualizado correctamente'], 200);
    }


    function destroy(Request $request, $client_id)
    {
        $hoy = Carbon::now();

        $usuario = $this->repository
            ->where('id', $client_id)
            ->with(['suscriptions', 'permissions'])
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::CUSTOMER);
            })
            ->first();

        if (!$usuario) {
            throw new HttpResponseException(response()->json(['error' => 'Usuario no encontrado'], 404));
        }


        $tieneSuscripciones = $usuario->suscriptions()->where(function ($query) use ($hoy) {
            $query->where(function ($subQuery) use ($hoy) {
                // Suscripciones activas
                $subQuery->where('start_date', '<=', $hoy)
                    ->where('end_date', '>=', $hoy);
            })->orWhere(function ($subQuery) use ($hoy) {
                // Suscripciones pendientes
                $subQuery->where('start_date', '>', $hoy)
                    ->where('end_date', '>', $hoy);
            });
        })->exists();

        if (!$tieneSuscripciones) {
            $usuario->is_active = false;
            $usuario->save();
            return response()->json(['error' => 'Usuario eliminado correctamente'], 200);
        }


        return response()->json(['error' => 'El usuario no se puede eliminar porque tiene suscripciones activas o pendientes.'], 200);
    }
}
