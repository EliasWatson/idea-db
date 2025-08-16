import { Button } from '@/components/ui/button';
import { Heart, HeartOff } from 'lucide-react';
import * as React from 'react';

interface VoteButtonsProps {
  ideaId: number;
  score: number;
  userVote: number | null | undefined;
  canVote: boolean;
  className?: string;
}

export default function VoteButtons({
  ideaId,
  score: initialScore,
  userVote: initialUserVote,
  canVote: initialCanVote,
  className,
}: VoteButtonsProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentScore, setCurrentScore] = React.useState(initialScore);
  const [currentUserVote, setCurrentUserVote] = React.useState(initialUserVote);
  const [currentCanVote, setCurrentCanVote] = React.useState(initialCanVote);

  const handleVote = async (voteValue: 1 | -1) => {
    if (isLoading || !currentCanVote) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/ideas/${ideaId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          Accept: 'application/json',
        },
        body: JSON.stringify({ vote: voteValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();

      if (data.success) {
        setCurrentScore(data.score);
        setCurrentUserVote(data.user_vote);
        setCurrentCanVote(false); // User has now voted today
      }
    } catch (error) {
      console.error('Error voting:', error);
      // Optionally show a toast or error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <div className="flex items-center gap-1">
        <Button
          variant={currentUserVote === 1 ? 'default' : 'outline'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleVote(1);
          }}
          disabled={!currentCanVote || isLoading}
          className="h-8 px-2"
          aria-label={currentUserVote === 1 ? 'Remove like' : 'Like idea'}
        >
          <Heart className={`h-3 w-3 ${currentUserVote === 1 ? 'fill-current' : ''}`} />
        </Button>

        <Button
          variant={currentUserVote === -1 ? 'destructive' : 'outline'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleVote(-1);
          }}
          disabled={!currentCanVote || isLoading}
          className="h-8 px-2"
          aria-label={currentUserVote === -1 ? 'Remove dislike' : 'Dislike idea'}
        >
          <HeartOff className={`h-3 w-3 ${currentUserVote === -1 ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <span
        className={`text-sm font-medium tabular-nums ${
          currentScore > 0 ? 'text-green-600 dark:text-green-400' : currentScore < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
        }`}
        aria-label={`Score: ${currentScore}`}
      >
        {currentScore > 0 ? '+' : ''}
        {currentScore}
      </span>

      {!currentCanVote && (
        <span className="text-xs text-muted-foreground" aria-label="Already voted today">
          ✓
        </span>
      )}
    </div>
  );
}
