import { clsx, type ClassValue } from 'clsx';
import { View } from 'react-big-calendar';
import { twMerge } from 'tailwind-merge';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { it } from 'date-fns/locale';
import imageCompression from 'browser-image-compression';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildCalendarLabel(date: Date, view: View): string {
  switch (view) {
    case 'day': {
      // Lunedì 01 gennaio 2025
      return format(date, 'eeee d MMMM yyyy', { locale: it });
    }

    case 'week': {
      const start = startOfWeek(date, { weekStartsOn: 1 }); // lun
      const end = endOfWeek(date, { weekStartsOn: 1 }); // dom

      const sameMonth = start.getMonth() === end.getMonth();
      const sameYear = start.getFullYear() === end.getFullYear();

      if (sameMonth) {
        // 01-07 Gennaio 2025
        return `${format(start, 'd', { locale: it })}-${format(
          end,
          'd MMMM yyyy',
          { locale: it }
        )}`.replace(/\b\w/g, (c) => c.toUpperCase());
      }
      // 31 Gennaio - 06 Febbraio 2026
      if (sameYear) {
        return `${format(start, 'd MMMM', { locale: it })} - ${format(
          end,
          'dd MMMM yyyy',
          { locale: it }
        )}`.replace(/\b\w/g, (c) => c.toUpperCase());
      }

      // 31 Dicembre 2025 - 06 Gennaio 2026
      return `${format(start, 'd MMMM yyyy', { locale: it })} - ${format(
        end,
        'dd MMMM yyyy',
        { locale: it }
      )}`.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    case 'month':
    default:
      // Gennaio 2025
      return format(date, 'MMMM yyyy', { locale: it });
  }
}

// IMAGE UPLOAD
export async function getFileMagicNumber(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function (e) {
      if (!e.target?.result) return reject('Failed to read file');
      const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 4);
      const magic = Array.from(arr)
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('');
      resolve(magic);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
}

export function isValidImageMagicNumber(magic: string): boolean {
  const validMagicNumbers = [
    'ffd8ffe0', // JPEG
    'ffd8ffe1', // JPEG
    'ffd8ffe2', // JPEG
    '89504e47', // PNG
    '52494646', // WEBP
  ];
  return validMagicNumbers.some((sig) => magic.startsWith(sig));
}

export function sanitizeFileName(fileName: string): string {
  const name = fileName.split('.').slice(0, -1).join('.') || 'file';
  const ext = fileName.split('.').pop() || 'png';
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')}.${ext}`;
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}
