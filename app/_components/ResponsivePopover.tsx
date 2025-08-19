'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ResponsivePopoverProps = {
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isTitleHidden?: boolean;
  isDescriptionHidden?: boolean;
  children: ReactNode;
  align?: 'end' | 'center' | 'start' | undefined;
};

export default function ResponsivePopover({ trigger, open, onOpenChange, title, description, isTitleHidden = false, isDescriptionHidden = false, children, align = 'end' }: ResponsivePopoverProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className='min-w-xl h-full grid grid-rows-[min-content_min-content_1fr] overflow-hidden'
        align={align}
      >
        {!isTitleHidden && <div className='text-2xl font-semibold'>{title}</div>}
        {!isDescriptionHidden && <div className='text-sm text-zinc-500 mb-4'>{description}</div>}

        <div className='h-full overflow-y-auto'>{children}</div>
      </PopoverContent>
    </Popover>
  ) : (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className='h-full grid grid-rows-[min-content_min-content_1fr] p-4 overflow-hidden'>
          <DrawerTitle className={cn('mb-2', isTitleHidden && 'hidden')}>{title}</DrawerTitle>
          <DrawerDescription className={cn('mb-6', isDescriptionHidden && 'hidden')}>{description}</DrawerDescription>

          <div className='h-full overflow-y-auto'>{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
