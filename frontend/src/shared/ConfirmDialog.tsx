'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/stores/useUIStore';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog() {
  const { confirmDialog, closeConfirmDialog } = useUIStore();

  return (
    <Dialog open={confirmDialog.open} onOpenChange={closeConfirmDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
            </div>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {confirmDialog.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={closeConfirmDialog}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              confirmDialog.onConfirm();
              closeConfirmDialog();
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
