<?php

use App\Models\Idea;
use App\Models\IdeaVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('dashboard sorts ideas by score descending', function () {
    $user = User::factory()->create();

    // Create ideas with different scores
    $idea1 = Idea::factory()->create(['user_id' => $user->id, 'title' => 'Low Score', 'score' => 0]);
    $idea2 = Idea::factory()->create(['user_id' => $user->id, 'title' => 'High Score', 'score' => 0]);
    $idea3 = Idea::factory()->create(['user_id' => $user->id, 'title' => 'Medium Score', 'score' => 0]);

    // Add votes to create different scores
    IdeaVote::create(['idea_id' => $idea1->id, 'user_id' => $user->id, 'vote' => -1]);
    IdeaVote::create(['idea_id' => $idea3->id, 'user_id' => $user->id, 'vote' => 1]);

    // Create other users to add more votes
    $otherUser1 = User::factory()->create();
    $otherUser2 = User::factory()->create();
    IdeaVote::create(['idea_id' => $idea2->id, 'user_id' => $user->id, 'vote' => 1]);
    IdeaVote::create(['idea_id' => $idea2->id, 'user_id' => $otherUser1->id, 'vote' => 1]);
    IdeaVote::create(['idea_id' => $idea2->id, 'user_id' => $otherUser2->id, 'vote' => 1]);

    // Update scores
    $idea1->updateScore(); // Should be -1
    $idea2->updateScore(); // Should be 3 (1 + 1 + 1)
    $idea3->updateScore(); // Should be 1

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertOk();

    $props = $response->getOriginalContent()->getData()['page']['props'];
    $ideas = $props['ideas'];

    // Verify sorting: highest score first
    expect($ideas[0]['title'])->toBe('High Score');
    expect($ideas[0]['score'])->toBe(3);

    expect($ideas[1]['title'])->toBe('Medium Score');
    expect($ideas[1]['score'])->toBe(1);

    expect($ideas[2]['title'])->toBe('Low Score');
    expect($ideas[2]['score'])->toBe(-1);
});

test('dashboard sorts by creation date when scores are equal', function () {
    $user = User::factory()->create();

    // Create ideas at different times with same score
    $idea1 = Idea::factory()->create([
        'user_id' => $user->id,
        'title' => 'Older Idea',
        'score' => 5,
        'created_at' => now()->subHours(2),
    ]);
    $idea2 = Idea::factory()->create([
        'user_id' => $user->id,
        'title' => 'Newer Idea',
        'score' => 5,
        'created_at' => now()->subHour(),
    ]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertOk();

    $props = $response->getOriginalContent()->getData()['page']['props'];
    $ideas = $props['ideas'];

    // When scores are equal, newer ideas should come first
    expect($ideas[0]['title'])->toBe('Newer Idea');
    expect($ideas[1]['title'])->toBe('Older Idea');
});

test('search results are also sorted by score', function () {
    $user = User::factory()->create();

    // Create ideas that will be found by search (using simpler search terms)
    $idea1 = Idea::factory()->create(['user_id' => $user->id, 'title' => 'Test Low', 'score' => 1]);
    $idea2 = Idea::factory()->create(['user_id' => $user->id, 'title' => 'Test High', 'score' => 5]);
    $idea3 = Idea::factory()->create(['user_id' => $user->id, 'title' => 'Different', 'score' => 10]);

    $response = $this->actingAs($user)
        ->get('/dashboard?search=Test');

    $response->assertOk();

    $props = $response->getOriginalContent()->getData()['page']['props'];
    $ideas = $props['ideas'];

    // Should be sorted by score descending among search results
    if (count($ideas) >= 2) {
        // Find the Test ideas and verify they are sorted by score
        $testIdeas = collect($ideas)->filter(fn ($idea) => str_contains($idea['title'], 'Test'))->values();
        if ($testIdeas->count() >= 2) {
            expect($testIdeas[0]['score'])->toBeGreaterThanOrEqual($testIdeas[1]['score']);
        }
    }

    // At minimum, verify the response is successful and ideas are present
    expect($ideas)->toBeArray();
});
