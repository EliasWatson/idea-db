<?php

use App\Models\Idea;
use App\Models\IdeaVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('dashboard includes voting data for ideas', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id, 'score' => 0]);

    $response = $this->actingAs($user)
        ->get('/dashboard');

    $response->assertOk();

    $props = $response->getOriginalContent()->getData()['page']['props'];
    $ideaData = $props['ideas'][0];

    expect($ideaData)->toHaveKeys([
        'id', 'title', 'content', 'status', 'score',
        'created_at', 'updated_at', 'user_vote', 'can_vote',
    ]);

    expect($ideaData['score'])->toBe(0);
    expect($ideaData['user_vote'])->toBeNull();
    expect($ideaData['can_vote'])->toBe(true);
});

test('dashboard shows user vote and updated score after voting', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id, 'score' => 0]);

    IdeaVote::create([
        'idea_id' => $idea->id,
        'user_id' => $user->id,
        'vote' => 1,
    ]);
    $idea->updateScore();

    $response = $this->actingAs($user)
        ->get('/dashboard');

    $response->assertOk();

    $props = $response->getOriginalContent()->getData()['page']['props'];
    $ideaData = $props['ideas'][0];

    expect($ideaData['score'])->toBe(1);
    expect($ideaData['user_vote'])->toBe(1);
    expect($ideaData['can_vote'])->toBe(false);
});
