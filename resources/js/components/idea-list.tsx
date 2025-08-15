import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

interface Idea {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'active' | 'archived' | 'completed';
  created_at: string;
  updated_at: string;
}

interface IdeaListProps {
  ideas: Idea[];
}

const statusColors = {
  draft: 'outline',
  active: 'default',
  archived: 'secondary',
  completed: 'destructive',
} as const;

const statusLabels = {
  draft: 'Draft',
  active: 'Active',
  archived: 'Archived',
  completed: 'Completed',
} as const;

export default function IdeaList({ ideas }: IdeaListProps) {
  if (ideas.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">No ideas yet</p>
            <p className="text-sm text-muted-foreground">Add your first idea using the form above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {ideas.map((idea) => (
        <Link key={idea.id} href={`/ideas/${idea.id}`}>
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <CardDescription>Created {new Date(idea.created_at).toLocaleDateString()}</CardDescription>
                </div>
                <Badge variant={statusColors[idea.status]}>{statusLabels[idea.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm whitespace-pre-wrap text-muted-foreground">{idea.content}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
