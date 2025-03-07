<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::get('/payment/success', [PaymentController::class, 'handlePaymentStatus'])->name('mercadopago.success');
Route::get('/payment/failed', [PaymentController::class, 'handlePaymentStatus'])->name('mercadopago.failed');
Route::get('/payment/pending', [PaymentController::class, 'handlePaymentStatus'])->name('mercadopago.pending');
Route::get('/payment/rejected', [PaymentController::class, 'handlePaymentStatus'])->name('mercadopago.rejected');
Route::get('/payment/cancelled', [PaymentController::class, 'handlePaymentStatus'])->name('mercadopago.cancelled');