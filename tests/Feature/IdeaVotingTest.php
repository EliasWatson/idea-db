<?php

use App\Models\Idea;
use App\Models\IdeaVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated users can vote on ideas', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)
        ->postJson(route('ideas.vote', $idea), ['vote' => 1]);

    $response->assertOk();
    $response->assertJson([
        'success' => true,
        'score' => 1,
        'user_vote' => 1,
        'message' => 'Idea liked!',
    ]);

    $this->assertDatabaseHas('idea_votes', [
        'idea_id' => $idea->id,
        'user_id' => $user->id,
        'vote' => 1,
    ]);

    expect($idea->refresh()->score)->toBe(1);
});

test('authenticated users can change their vote', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    IdeaVote::create([
        'idea_id' => $idea->id,
        'user_id' => $user->id,
        'vote' => 1,
    ]);
    $idea->updateScore();

    $response = $this->actingAs($user)
        ->postJson(route('ideas.vote', $idea), ['vote' => -1]);

    $response->assertOk();
    $response->assertJson([
        'success' => true,
        'score' => -1,
        'user_vote' => -1,
        'message' => 'Idea disliked!',
    ]);

    $this->assertDatabaseHas('idea_votes', [
        'idea_id' => $idea->id,
        'user_id' => $user->id,
        'vote' => -1,
    ]);

    expect($idea->refresh()->score)->toBe(-1);
});

test('voting validates vote value', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)
        ->postJson(route('ideas.vote', $idea), ['vote' => 2]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['vote']);
});

test('guests cannot vote on ideas', function () {
    $idea = Idea::factory()->create();

    $response = $this->postJson(route('ideas.vote', $idea), ['vote' => 1]);

    $response->assertUnauthorized();
});
