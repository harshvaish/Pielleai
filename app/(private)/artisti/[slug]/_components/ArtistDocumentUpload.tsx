'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn, getFileMagicNumber, isValidPdfMagicNumber } from '@/lib/utils';
import { pdfUploadSchema } from '@/lib/validation/pdf-upload-schema';
import { ApiResponse } from '@/lib/types';
import { updateArtistDocuments } from '@/lib/server-actions/artists/update-artist-documents';

type ArtistDocumentUploadProps = {
  artistId: number;
  label: string;
  docType: 'tax-code' | 'id-card';
  fileUrl: string | null;
  fileName: string | null;
};

export default function ArtistDocumentUpload({
  artistId,
  label,
  docType,
  fileUrl,
  fileName,
}: ArtistDocumentUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(fileUrl);
  const [currentFileName, setCurrentFileName] = useState<string | null>(fileName);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCurrentFileUrl(fileUrl);
    setCurrentFileName(fileName);
  }, [fileUrl, fileName]);

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

      const { signedUrl, path, fileName: sanitizedFileName } = response.data;
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
      const saveResponse = await updateArtistDocuments(artistId, {
        type: docType,
        fileName: sanitizedFileName,
        fileUrl: url,
      });

      if (!saveResponse.success) {
        toast.error(saveResponse.message || 'Aggiornamento non riuscito.');
        return;
      }

      setCurrentFileUrl(url);
      setCurrentFileName(sanitizedFileName);
      toast.success('Documento caricato.');
      router.refresh();
    } catch {
      toast.error('Caricamento pdf non riuscito.');
    } finally {
      setUploading(false);
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
      {currentFileUrl ? (
        <a
          href={currentFileUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 hover:underline'
        >
          {currentFileName || `${label}.pdf`}
        </a>
      ) : (
        <span className='text-sm text-zinc-400'>Mancante</span>
      )}
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
