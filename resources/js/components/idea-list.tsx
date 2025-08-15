import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  searchQuery?: string;
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

export default function IdeaList({ ideas, searchQuery }: IdeaListProps) {
  if (ideas.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            {searchQuery ? (
              <>
                <p className="text-muted-foreground">No ideas found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">No ideas yet</p>
                <p className="text-sm text-muted-foreground">Add your first idea using the form above!</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((idea) => (
            <TableRow key={idea.id}>
              <TableCell>
                <Link href={`/ideas/${idea.id}`} className="font-medium text-wrap wrap-normal text-primary hover:underline">
                  {idea.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={statusColors[idea.status]}>{statusLabels[idea.status]}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{new Date(idea.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
