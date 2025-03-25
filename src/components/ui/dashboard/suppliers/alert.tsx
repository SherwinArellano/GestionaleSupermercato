import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../alert';
import { cn } from '@/lib/utils';

export function SuppliersAlert({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Alert
      className={cn('bg-accent text-accent-foreground', className)}
      {...props}
    >
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Suppliers data are saved using in memory storage. Any additions and/or
        modifications will be gone if the website redeploys.
      </AlertDescription>
    </Alert>
  );
}
