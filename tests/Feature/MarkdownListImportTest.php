<?php

use App\Models\Idea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('batch import handles markdown lists with nested items', function () {
    $user = User::factory()->create();

    $ideas = [
        ['title' => 'First idea', 'description' => null],
        ['title' => 'Second idea with details', 'description' => "First detail\nSecond detail"],
        ['title' => 'Third idea', 'description' => 'Some description'],
    ];

    $response = $this->actingAs($user)
        ->post('/ideas/batch', [
            'ideas' => $ideas,
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Successfully imported 3 ideas!');

    $this->assertDatabaseCount('ideas', 3);

    $importedIdeas = Idea::where('user_id', $user->id)->orderBy('id')->get();

    expect($importedIdeas[0]->title)->toBe('First idea');
    expect($importedIdeas[0]->content)->toBeNull();

    expect($importedIdeas[1]->title)->toBe('Second idea with details');
    expect($importedIdeas[1]->content)->toBe("First detail\nSecond detail");

    expect($importedIdeas[2]->title)->toBe('Third idea');
    expect($importedIdeas[2]->content)->toBe('Some description');
});

test('batch import validates array format correctly', function () {
    $user = User::factory()->create();

    $ideas = [
        ['title' => 'Valid idea'],
        ['title' => ''], // Invalid: empty title
    ];

    $response = $this->actingAs($user)
        ->post('/ideas/batch', [
            'ideas' => $ideas,
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['ideas.1.title']);

    $this->assertDatabaseCount('ideas', 0);
});
