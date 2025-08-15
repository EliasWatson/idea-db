import AddIdeaForm from '@/components/add-idea-form';
import IdeaList from '@/components/idea-list';
import MassImportForm from '@/components/mass-import-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, Upload } from 'lucide-react';
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
  search?: string;
}

export default function Dashboard({ ideas, search }: DashboardProps) {
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(search || '');
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearch = React.useCallback(
    (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        router.get(
          '/dashboard',
          { search: query || undefined },
          {
            preserveScroll: true,
            preserveState: true,
          },
        );
      }, 300);
    },
    [router],
  );

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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Ideas</h2>
            <div className="relative max-w-sm">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-9"
              />
            </div>
          </div>
          <IdeaList ideas={ideas} searchQuery={search} />
        </div>
      </div>
    </AppLayout>
  );
}
