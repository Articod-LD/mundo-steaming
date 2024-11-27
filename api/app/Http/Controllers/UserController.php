<?php

namespace App\Http\Controllers;

use App\Enums\Permission;
use App\Exceptions\ShopException;
use App\Http\Requests\actualizarBilleteraRequest;
use App\Http\Requests\authRequest;
use App\Http\Requests\ChagePassRequest;
use App\Http\Requests\udapteUserProfileRequest;
use App\Http\Requests\updapteUserProfileRequest;
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
    public function index(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        $users = $this->repository
            ->where('is_active', true)
            ->with(['suscriptions', 'permissions'])
            ->paginate($limit);

        return $users;
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

    public function me(Request $request)
    {
        try {
            $user = $request->user();

            if (isset($user)) {
                $user = $this->repository->with([
                    'suscriptions',
                    'permissions',
                    'suscriptions.productos',
                    'suscriptions.productos.plataforma',
                    'suscriptions.productos.credencial'
                ])->find($user->id);

                // Asegúrate de que el usuario existe
                if ($user) {

                    // Iterar sobre las suscripciones
                    $user->suscriptions->each(function ($suscripcion) {
                        // Iteramos sobre los productos de cada suscripción
                        $suscripcion->productos->each(function ($producto) {
                            // Verificamos si la plataforma existe para el producto
                            if ($producto->plataforma) {
                                if (!str_starts_with($producto->plataforma->image_url, 'http://') && !str_starts_with($producto->plataforma->image_url, 'https://')) {
                                    $producto->plataforma->image_url = url('images/' . $producto->plataforma->image_url);
                                }
                            }
                        });
                    });
                }

                return response()->json($user);
            }
            throw new AuthorizationException('NOT_AUTHORIZED');
        } catch (ShopException $e) {
            throw new ShopException('NOT_AUTHORIZED');
        }
    }

    public function updateProfile(updapteUserProfileRequest $request, $user_id)
    {
        $data = $request->all();
        $user = User::find($user_id);
        if (!$user) {
            throw new HttpResponseException(response()->json(['message' => 'Usuario no encontrado'], 404));
        }
        $user->update($data);

        return response()->json(['message' => 'Usuario actualizado correctamente'], 200);
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

    public function logout(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return true;
        }
        return $request->user()->currentAccessToken()->delete();
    }
}
