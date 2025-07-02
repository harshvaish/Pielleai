import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

export function CancelNewNoteDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sei sicuro di voler uscire?</DialogTitle>
          <DialogDescription>
            Il processo verrà interrotto e i dati verranno persi.
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
  ) : (
    <Drawer
      open={open}
      onOpenChange={onClose}
    >
      <DrawerContent>
        <DrawerHeader className='mb-20'>
          <DrawerTitle className='text-xl'>
            Sei sicuro di voler uscire?
          </DrawerTitle>
          <DrawerDescription className='text-base'>
            Il processo verrà interrotto e i dati verranno persi.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='grid grid-cols-2 gap-4'>
          <Button
            variant='outline'
            onClick={onClose}
          >
            Annulla
          </Button>
          <Button
            variant='destructive'
            className='w-full'
            onClick={onConfirm}
          >
            Elimina
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
