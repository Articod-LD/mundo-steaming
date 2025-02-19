<?php

namespace App\Http\Controllers;

use App\Enums\Permission;
use App\Http\Requests\updapteUserProfileRequest;
use App\Http\Requests\UserCreateRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    
    public $repository;

    public function __construct(User $repository)
    {
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        $clientes = $this->repository
            ->where('is_active', true)
            ->with(['suscriptions', 'permissions'])
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::SUPER_ADMIN);
            })
            ->paginate($limit);

        return $clientes;
    }

    public function create(UserCreateRequest $request)
    {
        $notAllowedPermissions = [Permission::CUSTOMER, Permission::PROVIDER];

        if ((isset($request->permission->value) && in_array($request->permission->value, $notAllowedPermissions)) || (isset($request->permission) && in_array($request->permission, $notAllowedPermissions))) {
            throw new HttpResponseException(response()->json(['message' =>'NOT_AUTHORIZED'], 401));
        }
        
        $permissions = [];
        if (isset($request->permission)) {
            $permissions[] = isset($request->permission->value) ? $request->permission->value : $request->permission;
        }

        $user = $this->repository->create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->telefono,
        ]);

        $user->givePermissionTo($permissions);

        return ["token" => $user->createToken('auth_token')->plainTextToken, "permissions" => $user->getPermissionNames()];
    }

    
    function find(Request $request, $admin_id)
    {

        $client = $this->repository
            ->where('id', $admin_id)
            ->with(['suscriptions', 'permissions'])
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::SUPER_ADMIN);
            })
            ->first();

        if (!$client) {
            throw new HttpResponseException(response()->json(['message' => 'Usuario no encontrado'], 404));
        }
        return $client;
    }

    public function update(updapteUserProfileRequest $request, $admin_id)
    {
        $data = $request->all();

        $user = $this->repository
        ->where('id', $admin_id)
        ->with(['suscriptions', 'permissions'])
        ->where('is_active', true)
        ->whereHas('permissions', function ($query) {
            $query->where('name', Permission::SUPER_ADMIN);
        })
        ->first();

        if (!$user) {
            throw new HttpResponseException(response()->json(['message' => 'Usuario no encontrado'], 404));
        }
        
        $user->update($data);

        return response()->json(['message' => 'Usuario actualizado correctamente'], 200);
    }


    function destroy(Request $request, $client_id)
    {
        $usuario = $this->repository
            ->where('id', $client_id)
            ->with(['suscriptions', 'permissions'])
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::SUPER_ADMIN);
            })
            ->first();

        if (!$usuario) {
            throw new HttpResponseException(response()->json(['message' => 'Usuario no encontrado'], 404));
        }

        $usuario->is_active = false;
        $usuario->save();
        return response()->json(['message' => 'Usuario eliminado correctamente'], 200);
    }
}
