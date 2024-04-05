<?php

use App\Http\Controllers\CredencialesController;
use App\Http\Controllers\PlataformaController;
use App\Http\Controllers\SolicitudController;
use App\Http\Controllers\SuscripcionesController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/token', [UserController::class, 'token']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/change_password/{user_id}', [UserController::class, 'changePassword']);
Route::post('/update_profile/{user_id}', [UserController::class, 'updateProfile']);
Route::post('/logout', [UserController::class, 'logout']);
Route::get('me', [UserController::class, 'me']);
Route::get('/clientes/list', [UserController::class, 'clientes']);
Route::get('/providers/list', [UserController::class, 'providers']);
Route::get('/clientes/{client_id}', [UserController::class, 'findOne']);
Route::post('/clientes/billtera/update', [UserController::class, 'updateWallet']);
Route::post('/plataforma/register', [PlataformaController::class, 'create']);
Route::get('/plataforma/list', [PlataformaController::class, 'index']);
Route::post('/credencial/register', [CredencialesController::class, 'create']);
Route::get('/credencial/list', [CredencialesController::class, 'index']);


Route::get('/plataforma/disponibles', [PlataformaController::class, 'plataformasDisponibles']);

Route::post('/solicitud/register', [SolicitudController::class, 'create']);
Route::get('/solicitud/list', [SolicitudController::class, 'solicitudes']);
Route::delete('/solicitud/delete/{solicitud_id}', [SolicitudController::class, 'deleteSolicitud']);
Route::post('/solicitud/aceptar/{solicitud_id}', [SolicitudController::class, 'aceptarSolicitud']);

Route::get('/suscriptions/list', [SuscripcionesController::class, 'index']);
Route::post('/suscriptions/register', [SuscripcionesController::class, 'create']);
