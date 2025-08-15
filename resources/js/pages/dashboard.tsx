import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddIdeaForm from '@/components/add-idea-form';
import IdeaList from '@/components/idea-list';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

interface Idea {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'active' | 'archived' | 'completed';
  created_at: string;
  updated_at: string;
}

interface DashboardProps {
  ideas: Idea[];
}

export default function Dashboard({ ideas }: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Add New Idea</CardTitle>
              <CardDescription>
                Share your brilliant ideas and track their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddIdeaForm />
            </CardContent>
          </Card>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Ideas</h2>
          <IdeaList ideas={ideas} />
        </div>
      </div>
    </AppLayout>
  );
}
