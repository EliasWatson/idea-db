<?php

use App\Models\Idea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('single idea creation truncates long titles and prepends to content', function () {
    $user = User::factory()->create();

    $longTitle = str_repeat('a', 300);
    $content = 'Original content';

    $response = $this->actingAs($user)
        ->post('/ideas', [
            'title' => $longTitle,
            'content' => $content,
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Idea created successfully!');

    $idea = Idea::first();
    expect(strlen($idea->title))->toBe(255);
    expect($idea->title)->toBe(str_repeat('a', 255));
    expect($idea->content)->toBe($longTitle."\n\n".$content);
});

test('single idea creation with empty content truncates long titles and sets content', function () {
    $user = User::factory()->create();

    $longTitle = str_repeat('b', 300);

    $response = $this->actingAs($user)
        ->post('/ideas', [
            'title' => $longTitle,
            'content' => '',
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Idea created successfully!');

    $idea = Idea::first();
    expect(strlen($idea->title))->toBe(255);
    expect($idea->title)->toBe(str_repeat('b', 255));
    expect($idea->content)->toBe($longTitle);
});

test('single idea creation with no content truncates long titles and sets content', function () {
    $user = User::factory()->create();

    $longTitle = str_repeat('c', 300);

    $response = $this->actingAs($user)
        ->post('/ideas', [
            'title' => $longTitle,
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Idea created successfully!');

    $idea = Idea::first();
    expect(strlen($idea->title))->toBe(255);
    expect($idea->title)->toBe(str_repeat('c', 255));
    expect($idea->content)->toBe($longTitle);
});

test('single idea creation with normal title preserves content unchanged', function () {
    $user = User::factory()->create();

    $normalTitle = 'Normal title';
    $content = 'Original content';

    $response = $this->actingAs($user)
        ->post('/ideas', [
            'title' => $normalTitle,
            'content' => $content,
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Idea created successfully!');

    $idea = Idea::first();
    expect($idea->title)->toBe($normalTitle);
    expect($idea->content)->toBe($content);
});

test('idea update truncates long titles and prepends to content', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id, 'title' => 'Short title', 'content' => 'Original content']);

    $longTitle = str_repeat('d', 300);
    $newContent = 'New content';

    $response = $this->actingAs($user)
        ->put("/ideas/{$idea->id}", [
            'title' => $longTitle,
            'content' => $newContent,
            'status' => 'active',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Idea updated successfully!');

    $idea->refresh();
    expect(strlen($idea->title))->toBe(255);
    expect($idea->title)->toBe(str_repeat('d', 255));
    expect($idea->content)->toBe($longTitle."\n\n".$newContent);
});

test('idea update with normal title preserves content unchanged', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id, 'title' => 'Short title', 'content' => 'Original content']);

    $normalTitle = 'Updated normal title';
    $newContent = 'New content';

    $response = $this->actingAs($user)
        ->put("/ideas/{$idea->id}", [
            'title' => $normalTitle,
            'content' => $newContent,
            'status' => 'active',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Idea updated successfully!');

    $idea->refresh();
    expect($idea->title)->toBe($normalTitle);
    expect($idea->content)->toBe($newContent);
});
