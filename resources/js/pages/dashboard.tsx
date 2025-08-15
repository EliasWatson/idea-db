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
        <AddIdeaForm />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Ideas</h2>
          <IdeaList ideas={ideas} />
        </div>
      </div>
    </AppLayout>
  );
}
