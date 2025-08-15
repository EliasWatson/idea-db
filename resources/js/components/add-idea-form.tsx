import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddIdeaFormProps {
  onSuccess?: () => void;
}

export default function AddIdeaForm({ onSuccess }: AddIdeaFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    content: '',
    status: 'draft',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post('/ideas', {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={data.title}
          onChange={(e) => setData('title', e.target.value)}
          placeholder="Enter your idea title..."
          required
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Description</Label>
        <textarea
          id="content"
          value={data.content}
          onChange={(e) => setData('content', e.target.value)}
          placeholder="Describe your idea..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          rows={4}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
      </div>

      <Button type="submit" disabled={processing} className="w-full">
        {processing ? 'Adding...' : 'Add Idea'}
      </Button>
    </form>
  );
}