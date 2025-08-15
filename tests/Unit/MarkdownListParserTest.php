<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// Helper function to test the parsing logic (we'll extract this from the frontend component)
function parseMarkdownList(string $text): array
{
    $lines = explode("\n", $text);
    $ideas = [];
    $currentIdea = null;

    foreach ($lines as $line) {
        $trimmed = trim($line);
        if (empty($trimmed)) {
            continue;
        }

        // Check if this is a main list item (- or * at the start with no indentation, or numbered with no indentation)
        if (preg_match('/^[-*]\s+(.+)$/', $line, $mainListMatch) ||
            preg_match('/^\d+\.\s+(.+)$/', $line, $mainListMatch)) {
            // Save previous idea if exists
            if ($currentIdea) {
                $ideas[] = $currentIdea;
            }
            // Start new idea
            $currentIdea = ['title' => $mainListMatch[1]];
        } else {
            // Check if this is a nested list item (indented - or *, or indented numbered)
            if ((preg_match('/^\s+[-*]\s+(.+)$/', $line, $nestedMatch) ||
                 preg_match('/^\s+\d+\.\s+(.+)$/', $line, $nestedMatch)) && $currentIdea) {
                // Add to description of current idea
                $description = $nestedMatch[1];
                if (isset($currentIdea['description'])) {
                    $currentIdea['description'] .= "\n".$description;
                } else {
                    $currentIdea['description'] = $description;
                }
            } elseif ($currentIdea && str_starts_with($line, '  ')) {
                // Treat indented text as part of description
                $description = substr($trimmed, 0); // Use trimmed but keep the text
                if (isset($currentIdea['description'])) {
                    $currentIdea['description'] .= "\n".$description;
                } else {
                    $currentIdea['description'] = $description;
                }
            } elseif (! preg_match('/^[-*]\s+/', $line) && ! preg_match('/^\d+\.\s+/', $line)) {
                // This is a regular line - treat as a standalone idea
                if ($currentIdea) {
                    $ideas[] = $currentIdea;
                    $currentIdea = null;
                }
                $ideas[] = ['title' => $trimmed];
            }
        }
    }

    // Don't forget the last idea
    if ($currentIdea) {
        $ideas[] = $currentIdea;
    }

    return $ideas;
}

test('parseMarkdownList handles simple unordered list', function () {
    $input = "- First idea\n- Second idea\n- Third idea";
    $result = parseMarkdownList($input);

    expect($result)->toHaveCount(3);
    expect($result[0])->toBe(['title' => 'First idea']);
    expect($result[1])->toBe(['title' => 'Second idea']);
    expect($result[2])->toBe(['title' => 'Third idea']);
});

test('parseMarkdownList handles ordered list', function () {
    $input = "1. First idea\n2. Second idea\n3. Third idea";
    $result = parseMarkdownList($input);

    expect($result)->toHaveCount(3);
    expect($result[0])->toBe(['title' => 'First idea']);
    expect($result[1])->toBe(['title' => 'Second idea']);
    expect($result[2])->toBe(['title' => 'Third idea']);
});

test('parseMarkdownList handles nested unordered list items', function () {
    $input = "- Main idea one\n  - Sub item 1\n  - Sub item 2\n- Main idea two\n  - Sub item 3";
    $result = parseMarkdownList($input);

    expect($result)->toHaveCount(2);
    expect($result[0]['title'])->toBe('Main idea one');
    expect($result[0]['description'])->toBe("Sub item 1\nSub item 2");
    expect($result[1]['title'])->toBe('Main idea two');
    expect($result[1]['description'])->toBe('Sub item 3');
});

test('parseMarkdownList handles nested ordered list items', function () {
    $input = "1. Main idea one\n   1. Sub item 1\n   2. Sub item 2\n2. Main idea two";
    $result = parseMarkdownList($input);

    expect($result)->toHaveCount(2);
    expect($result[0]['title'])->toBe('Main idea one');
    expect($result[0]['description'])->toBe("Sub item 1\nSub item 2");
    expect($result[1]['title'])->toBe('Main idea two');
    expect($result[1])->not->toHaveKey('description');
});

test('parseMarkdownList handles mixed list types', function () {
    $input = "- Main idea with dashes\n  1. Numbered sub item\n  2. Another numbered sub item\n* Main idea with asterisk\n  - Dash sub item";
    $result = parseMarkdownList($input);

    expect($result)->toHaveCount(2);
    expect($result[0]['title'])->toBe('Main idea with dashes');
    expect($result[0]['description'])->toBe("Numbered sub item\nAnother numbered sub item");
    expect($result[1]['title'])->toBe('Main idea with asterisk');
    expect($result[1]['description'])->toBe('Dash sub item');
});

test('parseMarkdownList handles indented text as description', function () {
    $input = "- Main idea\n  This is additional text\n  More descriptive text\n- Another idea";
    $result = parseMarkdownList($input);

    expect($result)->toHaveCount(2);
    expect($result[0]['title'])->toBe('Main idea');
    expect($result[0]['description'])->toBe("This is additional text\nMore descriptive text");
    expect($result[1]['title'])->toBe('Another idea');
});

test('parseMarkdownList handles empty lines', function () {
    $input = "- First idea\n\n- Second idea\n\n\n- Third idea";
    $result = parseMarkdownList($input);

    expect($result)->toHaveCount(3);
    expect($result[0])->toBe(['title' => 'First idea']);
    expect($result[1])->toBe(['title' => 'Second idea']);
    expect($result[2])->toBe(['title' => 'Third idea']);
});

test('parseMarkdownList handles plain text lines', function () {
    $input = "First plain idea\nSecond plain idea\n- List item\nAnother plain idea";
    $result = parseMarkdownList($input);

    expect($result)->toHaveCount(4);
    expect($result[0])->toBe(['title' => 'First plain idea']);
    expect($result[1])->toBe(['title' => 'Second plain idea']);
    expect($result[2])->toBe(['title' => 'List item']);
    expect($result[3])->toBe(['title' => 'Another plain idea']);
});

test('parseMarkdownList handles complex mixed content', function () {
    $input = "- Create authentication system\n  - Implement login\n  - Add password reset\n  - Set up sessions\n\nPlain text idea\n\n1. Database setup\n   1. Create migrations\n   2. Seed data\n- Final list item";
    $result = parseMarkdownList($input);

    expect($result)->toHaveCount(4);

    expect($result[0]['title'])->toBe('Create authentication system');
    expect($result[0]['description'])->toBe("Implement login\nAdd password reset\nSet up sessions");

    expect($result[1])->toBe(['title' => 'Plain text idea']);

    expect($result[2]['title'])->toBe('Database setup');
    expect($result[2]['description'])->toBe("Create migrations\nSeed data");

    expect($result[3])->toBe(['title' => 'Final list item']);
});
