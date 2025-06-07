<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

 use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PlatformSettingController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Models\Package;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

     Route::get('/settings/platform', [PlatformSettingController::class, 'edit'])
         ->name('settings.platform');
         
    Route::put('/settings/platform', [PlatformSettingController::class, 'update'])
         ->name('settings.platform.update');

    Route::get('/dashboard', [AnalyticsController::class, 'index'])->name('dashboard');


    Route::get('/activities/all', [ActivityController::class, 'index'])->name('activities.index');
    Route::get('/activities/create', [ActivityController::class, 'create'])->name('activities.create');
    Route::get('/activities/agent/{agent}', [ActivityController::class, 'agentActivities'])->name('activities.agent');
    Route::get('/activities/{activity}', [ActivityController::class, 'show'])->name('activities.show');
    Route::post('/activities', [ActivityController::class, 'store'])->name('activities.store');
    Route::put('/activities/{activity}', [ActivityController::class, 'update'])->name('activities.update');
    Route::delete('/activities/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');



    Route::get('/packages/all', [PackageController::class, 'index'])->name('packages.index');
    Route::get('/packages/create', [PackageController::class, 'create'])->name('packages.create');
    Route::get('/packages/{package}', [PackageController::class, 'show'])->name('packages.show');
    Route::post('/packages/create', [PackageController::class, 'store'])->name('packages.store');
    Route::get('/packages/edit/{package}', [PackageController::class, 'edit'])->name('packages.edit');
    Route::put('/packages/{package}', [PackageController::class, 'update'])->name('packages.update');
    Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->name('packages.destroy');


    Route::get('/roles/all', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');


    // User management routes
    Route::get('users/all', [UserController::class, 'index'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::get('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggleActive');
    Route::post('users/{user}/remove-media/{type}', [UserController::class, 'removeMedia'])
        ->name('users.removeMedia');


    Route::get('bookings/all', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('bookings/{id}', [BookingController::class, 'show'])->name('bookings.show');




    
});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
