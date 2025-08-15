import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import * as React from 'react';

interface AddIdeaFormProps {
  onSuccess?: () => void;
}

export default function AddIdeaForm({ onSuccess }: AddIdeaFormProps) {
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
        }
      });
    }
  };

  return (
    <div className="space-y-2">
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
