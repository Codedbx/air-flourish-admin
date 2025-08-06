<?php

// use App\Http\Controllers\Api\BookingController;
// use App\Http\Controllers\Api\CouponController;
// use App\Http\Controllers\Api\LocationController;
// use App\Http\Controllers\Api\PackageController;
// use App\Http\Controllers\Api\PaymentController;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


// // Packages
// Route::prefix('packages')->group(function () {
//     Route::get('/', [PackageController::class, 'index']);
//     Route::get('/{id}', [PackageController::class, 'show']);
//     Route::get('/featured', [PackageController::class, 'getFeaturedPackages']);
// });

// Route::get('agent/packages', [PackageController::class, 'userPackages']);

// //booking end point for guest users and authenticated users
// Route::post('/bookings', [BookingController::class, 'store'])->name('api.bookings.store');
// Route::get('/bookings/{id}', [BookingController::class, 'show'])->name('api.bookings.show'); 


// // Your existing payment routes
// Route::post('pay/initiate', [PaymentController::class, 'initiate']);
// Route::get('verify/{reference}', [PaymentController::class, 'verify']);
// Route::post('webhook', [PaymentController::class, 'webhook']);

// // Espees callback routes
// Route::get('espees/success', [PaymentController::class, 'espeesSuccess'])->name('payment.espees.success');
// Route::get('espees/failed', [PaymentController::class, 'espeesFailed'])->name('payment.espees.failed');


// Route::get('/locations/search', [LocationController::class, 'search']);

// Route::post('/coupons/validate', [CouponController::class, 'validateCoupon'])
//          ->name('coupons.validate');


// // For testing purposes - authenticated user info
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });




use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Packages
Route::prefix('packages')->group(function () {
    Route::get('/', [PackageController::class, 'index']);
    Route::get('/{id}', [PackageController::class, 'show']);
    Route::get('/featured', [PackageController::class, 'getFeaturedPackages']);
});

Route::get('agent/packages', [PackageController::class, 'userPackages']);

// Booking endpoints for guest users and authenticated users
Route::post('/bookings', [BookingController::class, 'store'])->name('api.bookings.store');
Route::get('/bookings/{id}', [BookingController::class, 'show'])->name('api.bookings.show');

// Payment routes
Route::post('pay/initiate', [PaymentController::class, 'initiate']);
Route::get('verify/{reference}', [PaymentController::class, 'verify']);
Route::post('webhook', [PaymentController::class, 'webhook']);

// Espees callback routes
Route::get('espees/success', [PaymentController::class, 'espeesSuccess'])->name('payment.espees.success');
Route::get('espees/failed', [PaymentController::class, 'espeesFailed'])->name('payment.espees.failed');

// Invoice/Receipt routes with rate limiting
Route::middleware(['throttle:10,1'])->group(function () {
    Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download'])
        ->name('invoices.download')
        ->middleware('signed'); // Requires signed URL
    
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])
        ->name('invoices.show')
        ->middleware('signed'); // Also requires signed URL for security


    Route::get('/invoices/{invoice}/status', [InvoiceController::class, 'status'])
    ->name('invoices.status')
    ->middleware('signed');
});

Route::get('/locations/search', [LocationController::class, 'search']);

Route::post('/coupons/validate', [CouponController::class, 'validateCoupon'])
    ->name('coupons.validate');

// For testing purposes - authenticated user info
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});