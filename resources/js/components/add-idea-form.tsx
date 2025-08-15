import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import * as React from 'react';

interface AddIdeaFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function AddIdeaForm({ onSuccess, className }: AddIdeaFormProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    content: '',
    status: 'draft',
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !processing && data.title.trim()) {
      e.preventDefault();

      post('/ideas', {
        onSuccess: () => {
          reset();
          onSuccess?.();
          // Keep focus on the input after submission
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        },
        onError: (errors) => {
          console.error('Failed to create idea:', errors);
        },
      });
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Input
        ref={inputRef}
        type="text"
        value={data.title}
        onChange={(e) => setData('title', e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your idea and press Enter..."
        disabled={processing}
        autoFocus
      />
      {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
    </div>
  );
}
