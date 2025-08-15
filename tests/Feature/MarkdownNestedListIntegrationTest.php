<?php

use App\Models\Idea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('mass import correctly handles nested markdown lists end-to-end', function () {
    $user = User::factory()->create();

    // Real-world example with nested lists
    $markdownIdeas = [
        [
            'title' => 'Create authentication system',
            'description' => "Implement login\nAdd password reset\nSet up sessions"
        ],
        [
            'title' => 'Design dashboard interface',
            'description' => "Create responsive layout\nAdd data visualization"
        ],
        [
            'title' => 'Setup development environment',
            'description' => null
        ]
    ];

    $response = $this->actingAs($user)
        ->post('/ideas/batch', [
            'ideas' => $markdownIdeas,
            'status' => 'active',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Successfully imported 3 ideas!');

    $this->assertDatabaseCount('ideas', 3);

    $importedIdeas = Idea::where('user_id', $user->id)->orderBy('id')->get();
    
    // Verify first idea with nested description
    expect($importedIdeas[0]->title)->toBe('Create authentication system');
    expect($importedIdeas[0]->content)->toBe("Implement login\nAdd password reset\nSet up sessions");
    expect($importedIdeas[0]->status)->toBe('active');
    
    // Verify second idea with nested description
    expect($importedIdeas[1]->title)->toBe('Design dashboard interface');
    expect($importedIdeas[1]->content)->toBe("Create responsive layout\nAdd data visualization");
    expect($importedIdeas[1]->status)->toBe('active');
    
    // Verify third idea without description
    expect($importedIdeas[2]->title)->toBe('Setup development environment');
    expect($importedIdeas[2]->content)->toBeNull();
    expect($importedIdeas[2]->status)->toBe('active');
});

test('mass import handles mixed markdown and plain text correctly', function () {
    $user = User::factory()->create();

    $mixedIdeas = [
        ['title' => 'Simple plain idea'],
        [
            'title' => 'Complex idea with details',
            'description' => "Detail one\nDetail two\nDetail three"
        ],
        ['title' => 'Another plain idea'],
    ];

    $response = $this->actingAs($user)
        ->post('/ideas/batch', [
            'ideas' => $mixedIdeas,
            'status' => 'draft',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Successfully imported 3 ideas!');

    $this->assertDatabaseCount('ideas', 3);

    $importedIdeas = Idea::where('user_id', $user->id)->orderBy('id')->get();
    
    expect($importedIdeas[0]->title)->toBe('Simple plain idea');
    expect($importedIdeas[0]->content)->toBeNull();
    
    expect($importedIdeas[1]->title)->toBe('Complex idea with details');
    expect($importedIdeas[1]->content)->toBe("Detail one\nDetail two\nDetail three");
    
    expect($importedIdeas[2]->title)->toBe('Another plain idea');
    expect($importedIdeas[2]->content)->toBeNull();
});