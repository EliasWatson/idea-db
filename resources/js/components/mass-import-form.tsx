import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm, router } from '@inertiajs/react';
import * as React from 'react';

interface MassImportFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function MassImportForm({ onSuccess, className }: MassImportFormProps) {
  const { data, setData, processing, errors, reset } = useForm({
    ideas: '',
    status: 'draft',
  });

  const [lineCount, setLineCount] = React.useState(0);

  React.useEffect(() => {
    const parsedIdeas = parseMarkdownList(data.ideas);
    setLineCount(parsedIdeas.length);
  }, [data.ideas]);

  const parseMarkdownList = (text: string) => {
    const lines = text.split('\n');
    const ideas: Array<{ title: string; description?: string }> = [];
    let currentIdea: { title: string; description?: string } | null = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Check if this is a main list item (- or * at the start with no indentation, or numbered with no indentation)
      const mainListMatch = line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+\.\s+(.+)$/);
      
      if (mainListMatch) {
        // Save previous idea if exists
        if (currentIdea) {
          ideas.push(currentIdea);
        }
        // Start new idea
        currentIdea = { title: mainListMatch[1] };
      } else {
        // Check if this is a nested list item (indented - or *, or indented numbered)
        const nestedMatch = line.match(/^\s+[-*]\s+(.+)$/) || line.match(/^\s+\d+\.\s+(.+)$/);
        
        if (nestedMatch && currentIdea) {
          // Add to description of current idea
          const description = nestedMatch[1];
          if (currentIdea.description) {
            currentIdea.description += '\n' + description;
          } else {
            currentIdea.description = description;
          }
        } else if (currentIdea && line.startsWith('  ')) {
          // Treat indented text as part of description
          const description = trimmed; // Use trimmed text
          if (currentIdea.description) {
            currentIdea.description += '\n' + description;
          } else {
            currentIdea.description = description;
          }
        } else if (!line.match(/^[-*]\s+/) && !line.match(/^\d+\.\s+/)) {
          // This is a regular line - treat as a standalone idea
          if (currentIdea) {
            ideas.push(currentIdea);
            currentIdea = null;
          }
          ideas.push({ title: trimmed });
        }
      }
    }
    
    // Don't forget the last idea
    if (currentIdea) {
      ideas.push(currentIdea);
    }
    
    return ideas;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.ideas.trim()) {
      return;
    }

    const parsedIdeas = parseMarkdownList(data.ideas);
    
    router.post('/ideas/batch', {
      ideas: parsedIdeas,
      status: data.status,
    }, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
      onError: (errors: Record<string, string>) => {
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
          placeholder="Enter ideas (one per line or as Markdown list with nested items)..."
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
