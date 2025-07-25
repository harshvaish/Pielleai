'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isTitleHidden?: boolean;
  isDescriptionHidden?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  children?: ReactNode;
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  isTitleHidden = false,
  isDescriptionHidden = false,
  onConfirm,
  onCancel,
  confirmLabel = 'Conferma',
  cancelLabel = 'Annulla',
  loadingLabel = 'Attendere...',
  isLoading = false,
  children,
}: ConfirmDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const cancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  return isDesktop ? (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogTitle className={isTitleHidden ? 'hidden' : ''}>
          {title}
        </DialogTitle>
        <DialogDescription className={isDescriptionHidden ? 'hidden' : ''}>
          {description}
        </DialogDescription>
        {children ? (
          children
        ) : (
          <DialogFooter className='flex justify-end gap-2 mt-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={cancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? loadingLabel : confirmLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <div className='py-8 px-4'>
          <DrawerTitle className={cn('mb-2', isTitleHidden && 'hidden')}>
            {title}
          </DrawerTitle>
          <DrawerDescription
            className={cn('mb-6', isDescriptionHidden && 'hidden')}
          >
            {description}
          </DrawerDescription>
          {children ? (
            children
          ) : (
            <DrawerFooter className='grid grid-cols-2 gap-2 p-0'>
              <Button
                variant='outline'
                onClick={cancel}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button
                variant='destructive'
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? loadingLabel : confirmLabel}
              </Button>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
