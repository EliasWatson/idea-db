<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $searchQuery = request('search');
        $userId = auth()->id();

        if ($searchQuery) {
            $ideas = App\Models\Idea::search($searchQuery)
                ->where('user_id', $userId)
                ->get()
                ->sortByDesc('score');
        } else {
            $ideas = auth()->user()->ideas()
                ->orderByDesc('score')
                ->orderByDesc('created_at')
                ->get();
        }

        $ideas = $ideas->map(function ($idea) use ($userId) {
            return [
                'id' => $idea->id,
                'title' => $idea->title,
                'content' => $idea->content,
                'status' => $idea->status,
                'score' => $idea->score,
                'created_at' => $idea->created_at,
                'updated_at' => $idea->updated_at,
                'user_vote' => $idea->getUserTodayVote($userId)?->vote,
                'can_vote' => $idea->canUserVoteToday($userId),
            ];
        });

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
    Route::post('ideas/{idea}/vote', [App\Http\Controllers\IdeaVoteController::class, 'vote'])->name('ideas.vote');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
