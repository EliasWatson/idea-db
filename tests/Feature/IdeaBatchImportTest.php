<?php

use App\Models\Idea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated users can batch import ideas', function () {
    $user = User::factory()->create();

    $ideas = "First idea\nSecond idea\nThird idea with longer content";

    $response = $this->actingAs($user)
        ->post('/ideas/batch', [
            'ideas' => $ideas,
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Successfully imported 3 ideas!');

    $this->assertDatabaseCount('ideas', 3);

    $importedIdeas = Idea::where('user_id', $user->id)->get();
    expect($importedIdeas->pluck('title')->toArray())
        ->toBe(['First idea', 'Second idea', 'Third idea with longer content']);
    expect($importedIdeas->pluck('status')->unique()->toArray())
        ->toBe(['draft']);
});

test('batch import handles empty lines and whitespace', function () {
    $user = User::factory()->create();

    $ideas = "First idea\n\n  \nSecond idea\n   Third idea   \n\n";

    $response = $this->actingAs($user)
        ->post('/ideas/batch', [
            'ideas' => $ideas,
            'status' => 'active',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Successfully imported 3 ideas!');

    $this->assertDatabaseCount('ideas', 3);

    $importedIdeas = Idea::where('user_id', $user->id)->get();
    expect($importedIdeas->pluck('title')->toArray())
        ->toBe(['First idea', 'Second idea', 'Third idea']);
});

test('batch import rejects more than 1000 ideas', function () {
    $user = User::factory()->create();

    $ideas = str_repeat("Idea\n", 1001);

    $response = $this->actingAs($user)
        ->post('/ideas/batch', [
            'ideas' => $ideas,
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['ideas' => 'Maximum 1000 ideas can be imported at once.']);

    $this->assertDatabaseCount('ideas', 0);
});

test('batch import requires at least one idea', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post('/ideas/batch', [
            'ideas' => "   \n\n  \n",
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['ideas']);

    $this->assertDatabaseCount('ideas', 0);
});

test('batch import truncates long titles to 255 characters', function () {
    $user = User::factory()->create();

    $longTitle = str_repeat('a', 300);

    $response = $this->actingAs($user)
        ->post('/ideas/batch', [
            'ideas' => $longTitle,
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Successfully imported 1 ideas!');

    $idea = Idea::first();
    expect(strlen($idea->title))->toBe(255);
    expect($idea->title)->toBe(str_repeat('a', 255));
});

test('guests cannot batch import ideas', function () {
    $response = $this->post('/ideas/batch', [
        'ideas' => 'Test idea',
        'status' => 'draft',
    ]);

    $response->assertRedirect('/login');
    $this->assertDatabaseCount('ideas', 0);
});
