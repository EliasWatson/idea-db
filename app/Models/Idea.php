<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Idea extends Model
{
    /** @use HasFactory<\Database\Factories\IdeaFactory> */
    use HasFactory, Searchable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'content',
        'status',
        'user_id',
        'score',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'string',
            'score' => 'integer',
        ];
    }

    /**
     * Get the user that owns the idea.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(IdeaVote::class);
    }

    public function calculateScore(): int
    {
        return $this->votes()->sum('vote');
    }

    public function updateScore(): void
    {
        $this->update(['score' => $this->calculateScore()]);
    }

    public function getUserTodayVote(?int $userId = null): ?IdeaVote
    {
        if (! $userId) {
            return null;
        }

        return $this->votes()
            ->forIdeaAndUser($this->id, $userId)
            ->today()
            ->first();
    }

    public function canUserVoteToday(?int $userId = null): bool
    {
        if (! $userId) {
            return false;
        }

        return $this->getUserTodayVote($userId) === null;
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
        ];
    }
}
