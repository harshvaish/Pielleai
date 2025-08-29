'use client';

import { Button } from '@/components/ui/button';
import { cn, getFileMagicNumber, isValidPdfMagicNumber } from '@/lib/utils';
import { pdfUploadSchema } from '@/lib/validation/pdf-upload-schema';
import { EventFormSchema } from '@/lib/validation/event-form-schema';
import { Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiResponse } from '@/lib/types';

export default function PdfUploadInput() {
  const [uploading, setUploading] = useState<boolean>(false);

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EventFormSchema>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pdf = watch('tecnicalRiderDocument');

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = pdfUploadSchema.safeParse(file);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    try {
      setUploading(true);
      const magicNumber = await getFileMagicNumber(file);

      if (!isValidPdfMagicNumber(magicNumber)) {
        toast.error('Il contenuto del pdf non è valido.');
        return;
      }
      await uploadPdf(file);
    } catch {
      toast.error('Caricamento pdf non riuscito.');
    } finally {
      setUploading(false);
    }
  };

  const onDeleteHandler = () => {
    setValue('tecnicalRiderDocument', undefined);
  };

  const uploadPdf = async (file: File) => {
    const fetchResponse = await fetch('/api/upload/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type,
      }),
    });

    const response: ApiResponse<{ signedUrl: string; path: string; fileName: string }> =
      await fetchResponse.json();

    if (!response.success) {
      toast.error(response.message || 'Caricamento pdf non riuscito.');
      return;
    }

    const { signedUrl, path, fileName } = response.data;

    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      toast.error('Caricamento pdf non riuscito, riprova più tardi.');
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/${path}`;

    setValue('tecnicalRiderDocument', { url, name: fileName });
  };

  return (
    <div className='relative'>
      <input
        type='file'
        ref={fileInputRef}
        accept='application/pdf'
        onChange={onChangeHandler}
        className='hidden absolute -top-full -left-full'
      />
      <Button
        type='button'
        size='sm'
        variant='outline'
        className={cn(
          'w-full justify-start text-sm font-normal',
          errors.tecnicalRiderDocument && 'border-destructive text-destructive',
        )}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload />
        <span className={cn('truncate', pdf && pdf.name ? 'pe-6' : 'text-zinc-400')}>
          {uploading ? 'Caricamento...' : pdf && pdf.name ? pdf.name : 'Carica pdf'}
        </span>
      </Button>
      {pdf && pdf.url && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex justify-center items-center hover:cursor-pointer',
            pdf && pdf.name && 'text-destructive',
          )}
          onClick={onDeleteHandler}
        >
          <Trash2 />
        </Button>
      )}
    </div>
  );
}
