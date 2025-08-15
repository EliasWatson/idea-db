<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $searchQuery = request('search');

        if ($searchQuery) {
            $ideas = App\Models\Idea::search($searchQuery)
                ->where('user_id', auth()->id())
                ->get();
        } else {
            $ideas = auth()->user()->ideas()->latest()->get();
        }

        return Inertia::render('dashboard', [
            'ideas' => $ideas,
            'search' => $searchQuery,
        ]);
    })->name('dashboard');

    Route::post('ideas', [App\Http\Controllers\IdeaController::class, 'store'])->name('ideas.store');
    Route::post('ideas/batch', [App\Http\Controllers\IdeaController::class, 'batchStore'])->name('ideas.batch-store');
    Route::get('ideas/{idea}', [App\Http\Controllers\IdeaController::class, 'show'])->name('ideas.show');
    Route::put('ideas/{idea}', [App\Http\Controllers\IdeaController::class, 'update'])->name('ideas.update');
    Route::delete('ideas/{idea}', [App\Http\Controllers\IdeaController::class, 'destroy'])->name('ideas.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
