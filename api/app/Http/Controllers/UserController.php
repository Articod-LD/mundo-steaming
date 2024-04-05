<?php

namespace App\Http\Controllers;

use App\Enums\Permission;
use App\Exceptions\ShopException;
use App\Http\Requests\actualizarBilleteraRequest;
use App\Http\Requests\authRequest;
use App\Http\Requests\ChagePassRequest;
use App\Http\Requests\udapteUserProfileRequest;
use App\Http\Requests\UserCreateRequest;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{



    public $repository;

    public function __construct(User $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function me(Request $request)
    {
        try {
            $user = $request->user();

            if (isset($user)) {
                return $this->repository->with(['suscription' => function ($query) {
                    $query->with(['credential', 'credential.tipo']);
                }, 'permissions', 'solicitudes'])->find($user->id);
            }
            throw new AuthorizationException('NOT_AUTHORIZED');
        } catch (ShopException $e) {
            throw new ShopException('NOT_AUTHORIZED');
        }
    }

    public function token(authRequest $request)
    {
        $user = User::where('email', $request->email)->where('is_active', true)->first();


        if (!$user || !Hash::check($request->password, $user->password)) {
            return ["token" => null, "permissions" => []];
        }

        $email_verified = $user->hasVerifiedEmail();

        return ["token" => $user->createToken('auth_token')->plainTextToken, "permissions" => $user->getPermissionNames(), "email_verified" => $email_verified];
    }

    public function register(UserCreateRequest $request)
    {
        $notAllowedPermissions = [Permission::SUPER_ADMIN];

        if ((isset($request->permission->value) && in_array($request->permission->value, $notAllowedPermissions)) || (isset($request->permission) && in_array($request->permission, $notAllowedPermissions))) {
            throw new AuthorizationException('NOT_AUTHORIZED');
        }
        $permissions = [];
        if (isset($request->permission)) {
            $permissions[] = isset($request->permission->value) ? $request->permission->value : $request->permission;
        }

        $user = $this->repository->create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'documento' => $request->documento,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
        ]);

        $user->givePermissionTo($permissions);

        return ["token" => $user->createToken('auth_token')->plainTextToken, "permissions" => $user->getPermissionNames()];
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return true;
        }
        return $request->user()->currentAccessToken()->delete();
    }

    function clientes(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        $clientes = $this->repository
            ->where('is_active', true)
            ->with(['suscription', 'permissions'])
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::CUSTOMER);
            })
            ->paginate($limit);

        return $clientes;
    }

    function providers(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        $clientes = $this->repository
            ->where('is_active', true)
            ->with(['suscription', 'permissions'])
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::PROVIDER);
            })
            ->paginate($limit);

        return $clientes;
    }

    function findOne(Request $request, $client_id)
    {
        $cliente = $this->repository
            ->where('id', $client_id)
            ->where('is_active', true)
            ->with(['suscription' => function ($query) {
                $query->with(['credential', 'credential.tipo']);
            }, 'permissions', 'solicitudes'])
            ->whereHas('permissions', function ($query) {
                $query->where('name', Permission::CUSTOMER);
            })
            ->first();


        return $cliente;
    }

    function changePassword(ChagePassRequest $request, $user_id)
    {
        if ($request->newpassword != $request->repeatpassword) {
            throw new HttpResponseException(response()->json(['message' => 'Las nueva contraseña es distinta a la confirmacion'], 422));
        }

        $user = $this->repository->find($user_id);

        if (!$user) {
            throw new HttpResponseException(response()->json(['message' => 'Usuario no encontrado'], 404));
        }

        if (!Hash::check($request->currentpassword, $user->password)) {
            throw new HttpResponseException(response()->json(['message' => 'La contraseña actual no es correcta'], 422));
        }

        $user->password = Hash::make($request->newpassword);
        $user->save();

        // Retornar una respuesta de éxito
        return ["token" => $user->createToken('auth_token')->plainTextToken, "permissions" => $user->getPermissionNames()];
    }

    function updateProfile(udapteUserProfileRequest $request, $user_id)
    {
        $data = $request->all();
        $user = User::find($user_id);
        if (!$user) {
            throw new HttpResponseException(response()->json(['message' => 'Usuario no encontrado'], 404));
        }
        $user->update($data);

        return response()->json(['message' => 'Usuario actualizado correctamente'], 200);
    }


    public function updateWallet(actualizarBilleteraRequest $request)
    {
        $user = User::findOrFail($request->userId);
        if ($request->operation !== 'add' &&  $request->operation !== 'subtract') {
            return response()->json(['error' => 'Operación no válida'], 422);
        }

        if ($request->operation === 'add') {
            $user->billetera += $request->amount;
        } else {
            $user->billetera -= $request->amount;
            if ($user->wallet < 0) {
                return response()->json(['error' => 'No tienes suficientes fondos en tu billetera'], 422);
            }
        }

        // Guardar los cambios en la base de datos
        $user->save();

        return response()->json(['message' => 'Billetera actualizada exitosamente', 'new_balance' => $user->billetera]);
    }
}
