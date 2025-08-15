import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data, setData, put, processing, errors, reset } = useForm({
    title: idea.title,
    content: idea.content || '',
    status: idea.status,
  });

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const handleSave = () => {
    put(`/ideas/${idea.id}`, {
      onSuccess: () => {
        setIsEditing(false);
      },
      onError: (errors) => {
        console.error('Failed to update idea:', errors);
      },
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    router.delete(`/ideas/${idea.id}`, {
      onFinish: () => {
        setIsDeleting(false);
      },
      onError: (errors) => {
        console.error('Failed to delete idea:', errors);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={idea.title} />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Idea Details</h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={processing}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={processing}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Idea</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{idea.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      className="text-xl font-semibold"
                      disabled={processing}
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-xl">{idea.title}</CardTitle>
                    <CardDescription>
                      Created {new Date(idea.created_at).toLocaleDateString()}
                      {idea.updated_at !== idea.created_at && <span> • Updated {new Date(idea.updated_at).toLocaleDateString()}</span>}
                    </CardDescription>
                  </>
                )}
              </div>
              <div className="ml-4">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={data.status}
                      onValueChange={(value) => setData('status', value as 'draft' | 'active' | 'archived' | 'completed')}
                      disabled={processing}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                  </div>
                ) : (
                  <Badge variant={statusColors[idea.status]}>{statusLabels[idea.status]}</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    placeholder="Enter idea content..."
                    rows={6}
                    disabled={processing}
                  />
                  {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                </div>
              ) : (
                <>
                  {idea.content ? (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Content</h3>
                      <p className="whitespace-pre-wrap">{idea.content}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No content provided</p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
