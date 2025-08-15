import AddIdeaForm from '@/components/add-idea-form';
import IdeaList from '@/components/idea-list';
import MassImportForm from '@/components/mass-import-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import * as React from 'react';

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
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AddIdeaForm className="flex-1" />
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                <Upload className="mr-2 h-4 w-4" />
                Mass Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Mass Import Ideas</DialogTitle>
              </DialogHeader>
              <MassImportForm
                onSuccess={() => {
                  setIsImportDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Ideas</h2>
          <IdeaList ideas={ideas} />
        </div>
      </div>
    </AppLayout>
  );
}
