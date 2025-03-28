'use client';

import { useActionState } from 'react';
import { Button } from '../../button';
import { samplePopulate } from './actions';
import { toast } from 'sonner';

export function PopulateSuppliersButton() {
  const formAction = useActionState(async () => {
    const message = await samplePopulate();
    toast(message);
    return message;
  }, '')[1];

  return (
    <form action={formAction}>
      <Button className="hidden cursor-pointer">
        Populate with sample data
      </Button>
    </form>
  );
}
