<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class IdeaController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'nullable|string',
                'status' => 'string|in:draft,active,archived,completed',
            ]);

            $validated['user_id'] = $request->user()->id;

            Idea::create($validated);

            return redirect()->back()->with('success', 'Idea created successfully!');
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput();
        }
    }

    public function show(Idea $idea): Response
    {
        if ($idea->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
        
        return Inertia::render('Ideas/Show', [
            'idea' => $idea,
        ]);
    }
}