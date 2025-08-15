import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Idea {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'active' | 'archived' | 'completed';
  created_at: string;
  updated_at: string;
}

interface ShowIdeaProps {
  idea: Idea;
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

export default function ShowIdea({ idea }: ShowIdeaProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: idea.title,
      href: `/ideas/${idea.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={idea.title} />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Idea Details</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">{idea.title}</CardTitle>
                <CardDescription>
                  Created {new Date(idea.created_at).toLocaleDateString()}
                  {idea.updated_at !== idea.created_at && <span> • Updated {new Date(idea.updated_at).toLocaleDateString()}</span>}
                </CardDescription>
              </div>
              <Badge variant={statusColors[idea.status]}>{statusLabels[idea.status]}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {idea.content ? (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Content</h3>
                  <p className="whitespace-pre-wrap">{idea.content}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No content provided</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
