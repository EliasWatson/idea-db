import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, router } from '@inertiajs/react';

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
  const totalIdeas = ideas.length;
  const searchResultsText = searchQuery 
    ? `${totalIdeas} idea${totalIdeas !== 1 ? 's' : ''} found for "${searchQuery}"`
    : `${totalIdeas} idea${totalIdeas !== 1 ? 's' : ''} total`;

  if (ideas.length === 0) {
    return (
      <div 
        className="rounded-md border"
        role="region"
        aria-label="Ideas list"
        aria-live="polite"
      >
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
    <div 
      className="rounded-md border"
      role="region"
      aria-label="Ideas list"
      aria-live="polite"
    >
      <Table>
        <TableCaption className="sr-only">
          {searchResultsText}. Navigate through ideas using arrow keys and access individual ideas with Enter.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Title</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((idea, index) => (
            <TableRow 
              key={idea.id}
              role="row"
              aria-rowindex={index + 2}
              className="cursor-pointer"
              aria-label={`${idea.title}, ${statusLabels[idea.status]}, created ${new Date(idea.created_at).toLocaleDateString()}`}
              onClick={() => router.visit(`/ideas/${idea.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.visit(`/ideas/${idea.id}`);
                }
              }}
              tabIndex={0}
            >
              <TableCell role="gridcell">
                <Link 
                  href={`/ideas/${idea.id}`}
                  className="font-medium text-wrap wrap-normal text-primary hover:underline"
                  tabIndex={-1}
                >
                  {idea.title}
                </Link>
              </TableCell>
              <TableCell role="gridcell">
                <Badge 
                  variant={statusColors[idea.status]}
                  aria-label={`Status: ${statusLabels[idea.status]}`}
                >
                  {statusLabels[idea.status]}
                </Badge>
              </TableCell>
              <TableCell 
                className="text-muted-foreground"
                role="gridcell"
                aria-label={`Created on ${new Date(idea.created_at).toLocaleDateString()}`}
              >
                {new Date(idea.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
