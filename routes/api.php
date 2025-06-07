<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Platform Settings


// Packages
Route::prefix('packages')->group(function () {
    Route::get('/', [PackageController::class, 'index']);
    Route::get('/{id}', [PackageController::class, 'show']);
    Route::get('/featured', [PackageController::class, 'randomFeatured']);
});

Route::get('agent/packages', [PackageController::class, 'userPackages']);

//booking end point for guest users and authenticated users
Route::post('/bookings', [BookingController::class, 'store'])->name('api.bookings.store');
Route::get('/bookings/{id}', [BookingController::class, 'show'])->name('api.bookings.show'); 


// Your existing payment routes
Route::post('pay/initiate', [PaymentController::class, 'initiate']);
Route::get('verify/{reference}', [PaymentController::class, 'verify']);
Route::post('webhook', [PaymentController::class, 'webhook']);

// Espees callback routes
Route::get('espees/success', [PaymentController::class, 'espeesSuccess'])->name('payment.espees.success');
Route::get('espees/failed', [PaymentController::class, 'espeesFailed'])->name('payment.espees.failed');







// For testing purposes - authenticated user info
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
