import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function DeleteNoteDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sei sicuro di voler eliminare la nota?</DialogTitle>
          <DialogDescription>
            Attenzione: questa operazione è irreversibile. La nota verrà
            eliminata definitivamente.
          </DialogDescription>
          <div className='flex justify-end gap-2 mt-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={onClose}
            >
              Annulla
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={onConfirm}
            >
              Elimina
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
