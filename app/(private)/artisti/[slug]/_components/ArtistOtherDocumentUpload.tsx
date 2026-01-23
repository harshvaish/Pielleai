'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn, getFileMagicNumber, isValidPdfMagicNumber } from '@/lib/utils';
import { pdfUploadSchema } from '@/lib/validation/pdf-upload-schema';
import { ApiResponse } from '@/lib/types';

type ArtistOtherDocumentUploadProps = {
  artistId: number;
};

export default function ArtistOtherDocumentUpload({ artistId }: ArtistOtherDocumentUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = pdfUploadSchema.safeParse({
      name: file.name,
      size: file.size,
      type: file.type,
    });
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

      const fetchResponse = await fetch('/api/upload/artist-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type,
          artistId,
        }),
      });

      const response: ApiResponse<{ signedUrl: string; path: string; fileName: string }> =
        await fetchResponse.json();

      if (!response.success) {
        toast.error(response.message || 'Caricamento pdf non riuscito.');
        return;
      }

      const { signedUrl } = response.data;
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        toast.error('Caricamento pdf non riuscito, riprova più tardi.');
        return;
      }

      toast.success('Documento caricato.');
      router.refresh();
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
    <div className='flex flex-wrap items-center gap-2'>
      <input
        ref={fileInputRef}
        type='file'
        accept='application/pdf'
        className='hidden'
        onChange={onChangeHandler}
      />
      <Button
        type='button'
        size='sm'
        variant='outline'
        className={cn(uploading && 'opacity-70')}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className='h-4 w-4' />
        {uploading ? 'Caricamento...' : 'Upload'}
      </Button>
    </div>
  );
}
