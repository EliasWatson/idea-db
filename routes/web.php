<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'ideas' => auth()->user()->ideas()->latest()->get(),
        ]);
    })->name('dashboard');
    
    Route::post('ideas', [App\Http\Controllers\IdeaController::class, 'store'])->name('ideas.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
