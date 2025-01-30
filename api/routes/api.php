<?php

use App\Http\Controllers\aboutUSController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\configController;
use App\Http\Controllers\CredencialesController;
use App\Http\Controllers\ourbenefitsController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlataformaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\rechargeController;
use App\Http\Controllers\SolicitudController;
use App\Http\Controllers\SoporteController;
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
Route::get('me', [UserController::class, 'me']);
Route::post('/update_profile/{user_id}', [UserController::class, 'updateProfile']);
Route::post('/change_password/{user_id}', [UserController::class, 'changePassword']);
Route::post('/logout', [UserController::class, 'logout']);

Route::get('/user/list', [UserController::class, 'index']);

Route::get('/admin/list', [AdminController::class, 'index']);
Route::post('/admin/register', [AdminController::class, 'create']);
Route::get('/admin/{admin_id}', [AdminController::class, 'find']);
Route::post('/admin/{admin_id}', [AdminController::class, 'update']);
Route::delete('/admin/{admin_id}', [AdminController::class, 'destroy']);

Route::get('/client/list', [ClientController::class, 'index']);
Route::post('/client/register', [ClientController::class, 'create']);
Route::get('/client/{client_id}', [ClientController::class, 'find']);
Route::post('/client/{client_id}', [ClientController::class, 'update']);
Route::delete('/client/{client_id}', [ClientController::class, 'destroy']);

Route::get('/provider/list', [ProviderController::class, 'index']);
Route::post('/provider/register', [ProviderController::class, 'create']);
Route::get('/provider/{provider_id}', [ProviderController::class, 'find']);
Route::post('/provider/{provider_id}', [ProviderController::class, 'update']);
Route::delete('/provider/{provider_id}', [ProviderController::class, 'destroy']);

Route::get('/suscription/list', [SuscripcionesController::class, 'index']);
Route::post('/suscription/register/provider', [SuscripcionesController::class, 'create']);
Route::get('/suscription/{orden_code}', [SuscripcionesController::class, 'find']);
// Route::post('/suscriptions/{suscription_id}', [ProviderController::class, 'update']);
Route::delete('/suscriptions/{suscription_id}', [ProviderController::class, 'destroy']);
Route::post('/suscription/register/client', [PaymentController::class, 'createPaymentCompraCliente']);

Route::get('/credencial/list', [CredencialesController::class, 'index']);
Route::post('/credencial/register', [CredencialesController::class, 'create']);
Route::get('/credencial/{credencial_id}', [ProviderController::class, 'find']);
Route::post('/credencial/{credencial_id}', [ProviderController::class, 'update']);
Route::delete('/credencial/{credencial_id}', [ProviderController::class, 'destroy']);

Route::get('/plataforma/list', [PlataformaController::class, 'index']);
Route::post('/plataforma/register', [PlataformaController::class, 'create']);
Route::get('/plataforma/disponibles', [PlataformaController::class, 'plataformasDisponibles']);
Route::get('/plataforma/{plataforma_id}', [PlataformaController::class, 'find']);
Route::post('/plataforma/{plataforma_id}', [PlataformaController::class, 'update']);
Route::delete('/plataforma/{plataforma_id}', [PlataformaController::class, 'destroy']);

Route::post('/soporte/register', [SoporteController::class, 'create']);
Route::get('/soporte/list', [SoporteController::class, 'soportes']);
Route::delete('/soporte/{soporte_id}', [SoporteController::class, 'destroy']);

Route::get('/banner/list', [BannerController::class, 'index']);
Route::post('/banner/register', [BannerController::class, 'create']);
Route::post('/banner/{id}', [BannerController::class, 'update']);
Route::delete('/banner/{banner_id}', [BannerController::class, 'destroy']);

Route::get('/categorie/list', [CategoriasController::class, 'index']);
Route::post('/categorie/register', [CategoriasController::class, 'store']);
Route::post('/categorie/{id}', [CategoriasController::class, 'update']);
Route::delete('/categorie/{categorie_id}', [CategoriasController::class, 'destroy']);
Route::get('/categorie/{nombre_categoria}/plataformas', [CategoriasController::class, 'getPlataformaByCategoria']);

Route::get('/productos/list', [ProductoController::class, 'index']);
Route::post('/productos/register', [ProductoController::class, 'create']);
Route::get('/productos/{product_id}', [ProductoController::class, 'find']);
Route::post('/productos/carga-masiva/register', [ProductoController::class, 'import']);
Route::post('/productos/{product_id}', [ProductoController::class, 'update']);
Route::delete('/productos/{product_id}', [ProductoController::class, 'destroy']);


Route::post('/recharge', [PaymentController::class, 'createPayment']);
Route::get('/recharge/list', [rechargeController::class, 'index']);
Route::get('/recharge/{recharge_id}', [rechargeController::class, 'find']);


Route::get('/beneficio/list', [ourbenefitsController::class, 'index']);
Route::post('/beneficio/register', [ourbenefitsController::class, 'create']);
Route::post('/beneficio/{beneficio_id}', [ourbenefitsController::class, 'update']);
Route::delete('/beneficio/{beneficio_id}', [ourbenefitsController::class, 'destroy']);


Route::get('/configuracion/list', [configController::class, 'index']);
Route::post('/configuracion/register', [configController::class, 'create']);
Route::post('/configuracion/{configuracion_id}', [configController::class, 'update']);
Route::delete('/configuracion/{configuracion_id}', [configController::class, 'destroy']);



Route::get('/about/list', [aboutUSController::class, 'index']);
Route::post('/about/register', [aboutUSController::class, 'create']);
Route::post('/about/{configuracion_id}', [aboutUSController::class, 'update']);
Route::delete('/about/{configuracion_id}', [aboutUSController::class, 'destroy']);


Route::post('/recharge/manual', [ProviderController::class, 'recargBilleteraManual']);

