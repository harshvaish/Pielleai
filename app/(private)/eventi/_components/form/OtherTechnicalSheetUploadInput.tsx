'use client';

import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn, getFileMagicNumber, isValidPdfMagicNumber } from '@/lib/utils';
import { pdfUploadSchema } from '@/lib/validation/pdf-upload-schema';
import { ApiResponse } from '@/lib/types';
import type { EventFormSchema } from '@/lib/validation/event-form-schema';

export default function OtherTechnicalSheetUploadInput() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { watch } = useFormContext<EventFormSchema>();

  const eventId = watch('eventId');

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = pdfUploadSchema.safeParse(file);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    if (!eventId) {
      toast.error('ID evento obbligatorio.');
      return;
    }

    try {
      setUploading(true);
      const magicNumber = await getFileMagicNumber(file);

      if (!isValidPdfMagicNumber(magicNumber)) {
        toast.error('Il contenuto del pdf non è valido.');
        return;
      }

      const fetchResponse = await fetch('/api/upload/other-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type,
          eventId,
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
      setUploadedFile({ name: fileName, url });
      toast.success('Documento caricato.');
    } catch {
      toast.error('Caricamento pdf non riuscito.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className='relative'>
      <input
        type='file'
        ref={fileInputRef}
        accept='application/pdf'
        onChange={onChangeHandler}
        className='hidden absolute -top-full -left-full'
        disabled={!eventId}
      />
      <Button
        type='button'
        size='sm'
        variant='outline'
        className={cn(
          'w-full grid grid-cols-[max-content_1fr] text-sm font-normal overflow-hidden',
          !eventId && 'opacity-70',
        )}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || !eventId}
      >
        <Upload />
        <div className={cn('text-start truncate', uploadedFile ? 'pe-2' : 'text-zinc-400')}>
          {uploading ? 'Caricamento...' : uploadedFile?.name || 'Carica pdf'}
        </div>
      </Button>
      {!eventId && (
        <div className='mt-2 text-xs text-zinc-400'>Salva l’evento per caricare file.</div>
      )}
      {uploadedFile?.url && (
        <a
          href={uploadedFile.url}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-2 block text-xs text-zinc-500 hover:underline'
        >
          {uploadedFile.name}
        </a>
      )}
    </div>
  );
}
