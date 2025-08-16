<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Models\IdeaVote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class IdeaVoteController extends Controller
{
    public function vote(Request $request, Idea $idea): JsonResponse
    {
        try {
            $validated = $request->validate([
                'vote' => 'required|integer|in:-1,1',
            ]);

            $userId = $request->user()->id;
            $voteValue = $validated['vote'];

            DB::transaction(function () use ($idea, $userId, $voteValue) {
                $existingVote = $idea->getUserTodayVote($userId);

                if ($existingVote) {
                    $existingVote->update(['vote' => $voteValue]);
                } else {
                    IdeaVote::create([
                        'idea_id' => $idea->id,
                        'user_id' => $userId,
                        'vote' => $voteValue,
                    ]);
                }

                $idea->updateScore();
            });

            $idea->refresh();

            return response()->json([
                'success' => true,
                'score' => $idea->score,
                'user_vote' => $voteValue,
                'message' => $voteValue === 1 ? 'Idea liked!' : 'Idea disliked!',
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->validator->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your vote.',
            ], 500);
        }
    }
}
