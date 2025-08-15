import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import * as React from 'react';

interface MassImportFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function MassImportForm({ onSuccess, className }: MassImportFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    ideas: '',
    status: 'draft',
  });

  const [lineCount, setLineCount] = React.useState(0);

  React.useEffect(() => {
    const lines = data.ideas.split('\n').filter((line) => line.trim().length > 0);
    setLineCount(lines.length);
  }, [data.ideas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.ideas.trim()) {
      return;
    }

    post('/ideas/batch', {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
      onError: (errors) => {
        console.error('Failed to import ideas:', errors);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label htmlFor="ideas">Ideas to Import</Label>
        <Textarea
          id="ideas"
          value={data.ideas}
          onChange={(e) => setData('ideas', e.target.value)}
          placeholder="Enter one idea per line..."
          disabled={processing}
          rows={10}
          className="min-h-[200px]"
        />
        {lineCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {lineCount} idea{lineCount !== 1 ? 's' : ''} to import
            {lineCount > 1000 && <span className="text-destructive"> (maximum 1000 allowed)</span>}
          </p>
        )}
        {errors.ideas && <p className="text-sm text-destructive">{errors.ideas}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status for all ideas</Label>
        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={processing || !data.ideas.trim() || lineCount > 1000} className="w-full">
        {processing ? 'Importing...' : `Import ${lineCount} Idea${lineCount !== 1 ? 's' : ''}`}
      </Button>
    </form>
  );
}
