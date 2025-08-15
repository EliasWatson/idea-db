<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function update(Request $request, Idea $idea): RedirectResponse
    {
        if ($idea->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'nullable|string',
                'status' => 'string|in:draft,active,archived,completed',
            ]);

            $idea->update($validated);

            return redirect()->back()->with('success', 'Idea updated successfully!');
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput();
        }
    }

    public function batchStore(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ideas' => 'required|string',
                'status' => 'string|in:draft,active,archived,completed',
            ]);

            $lines = array_filter(
                array_map('trim', explode("\n", $validated['ideas'])),
                fn ($line) => ! empty($line)
            );

            if (empty($lines)) {
                return redirect()->back()->withErrors(['ideas' => 'Please provide at least one idea.']);
            }

            if (count($lines) > 1000) {
                return redirect()->back()->withErrors(['ideas' => 'Maximum 1000 ideas can be imported at once.']);
            }

            $userId = $request->user()->id;
            $status = $validated['status'] ?? 'draft';
            $now = now();

            $ideaData = array_map(function ($line) use ($userId, $status, $now) {
                return [
                    'title' => substr($line, 0, 255),
                    'content' => null,
                    'status' => $status,
                    'user_id' => $userId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, $lines);

            DB::transaction(function () use ($ideaData) {
                $chunks = array_chunk($ideaData, 100);
                foreach ($chunks as $chunk) {
                    Idea::insert($chunk);
                }
            });

            $count = count($lines);

            return redirect()->back()->with('success', "Successfully imported {$count} ideas!");

        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput();
        }
    }

    public function destroy(Idea $idea): RedirectResponse
    {
        if ($idea->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $idea->delete();

        return redirect()->route('dashboard')->with('success', 'Idea deleted successfully!');
    }
}
