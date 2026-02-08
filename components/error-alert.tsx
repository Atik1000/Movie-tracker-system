import { ErrorAlertProps } from '@/types/components';

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
      <p className="text-destructive">{message}</p>
    </div>
  );
}
