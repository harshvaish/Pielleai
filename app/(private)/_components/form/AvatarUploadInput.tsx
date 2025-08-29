'use client';

import { SpinnerLoading } from '@/app/_components/SpinnerLoading';
import { AU_LOCAL_STORAGE_TTL } from '@/lib/constants';
import { ApiResponse } from '@/lib/types';
import {
  cn,
  compressImage,
  fileToBase64,
  getFileMagicNumber,
  isValidImageMagicNumber,
} from '@/lib/utils';
import { avatarUploadSchema } from '@/lib/validation/avatar-upload-schema';
import { Plus, UserRound } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

type AvatarUploadInputProps = {
  localStorageKey: string;
  value?: string;
  onChange: (newValue: string) => void;
  hasError: boolean;
};

export default function AvatarUploadInput({
  localStorageKey,
  value,
  onChange,
  hasError,
}: AvatarUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = avatarUploadSchema.safeParse(file);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      try {
        const magicNumber = await getFileMagicNumber(file);

        if (!isValidImageMagicNumber(magicNumber)) {
          toast.error("Il contenuto dell'immagine non è valido.");
          return;
        }

        const compressedFile = await compressImage(file);
        const base64 = await fileToBase64(compressedFile);
        setPreview(base64);

        await uploadImage(compressedFile);
      } catch {
        toast.error('Caricamento immagine non riuscito.');
        setPreview(null);
      }
    });
  };

  const uploadImage = async (file: File) => {
    const fetchResponse = await fetch('/api/upload/avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type,
      }),
    });

    const response: ApiResponse<{ signedUrl: string; path: string }> = await fetchResponse.json();

    if (!response.success) {
      toast.error(response.message || 'Caricamento immagine non riuscito.');
      return;
    }

    const { signedUrl, path } = response.data;

    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      toast.error('Caricamento immagine non riuscito, riprova più tardi.');
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/${path}`;

    // Save to react-hook-form state via onChange
    onChange(url);

    // Also store locally for preview on next render
    localStorage.setItem(localStorageKey, JSON.stringify({ url, timestamp: Date.now() }));

    setPreview(url);
  };

  useEffect(() => {
    if (value) {
      setPreview(value);
      return;
    }
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      const { url, timestamp } = JSON.parse(stored);
      if (Date.now() - timestamp < AU_LOCAL_STORAGE_TTL) {
        setPreview(url);
        onChange(url);
      } else {
        localStorage.removeItem(localStorageKey);
      }
    }
  }, [value, onChange, localStorageKey]);

  return (
    <>
      <input
        type='file'
        ref={fileInputRef}
        accept='image/*'
        onChange={handleFileChange}
        className='hidden absolute -top-full -left-full'
        disabled={isPending}
      />
      <div
        className={cn(
          'relative w-16 h-16 flex justify-center items-center bg-muted rounded-full group hover:cursor-pointer',
          hasError && 'border border-destructive',
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        {isPending ? (
          <SpinnerLoading />
        ) : preview ? (
          <Image
            src={preview}
            fill
            sizes='64px'
            alt='Immagine profilo caricata'
            className='object-cover object-center rounded-full'
          />
        ) : (
          <UserRound className='size-8 text-zinc-400' />
        )}
        <div className='absolute -bottom-1 right-0 w-6 h-6 flex justify-center items-center bg-emerald-600 text-white rounded-full transition-transform group-hover:scale-105'>
          <Plus className='size-4' />
        </div>
      </div>
    </>
  );
}
