'server only';

import { supabaseServerClient } from '@/lib/supabase-server-client';

export type EventSummaryDocument = {
  name: string;
  url: string;
  uploadedAt: string | null;
};

const formatDocumentDate = (value?: string | null): string | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const stripTimestampPrefix = (value: string): string => value.replace(/^\d+-\d+-/, '');

export async function getEventSummaryDocument(
  eventId: number,
): Promise<EventSummaryDocument | null> {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME;
  if (!bucket) return null;

  const { data, error } = await supabaseServerClient.storage
    .from(bucket)
    .list('other-documents', {
      limit: 50,
      search: `${eventId}-`,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error || !data) return null;

  const summaryItem = data.find(
    (item) => item.name?.startsWith(`${eventId}-`) && item.name.includes('Event Summary -'),
  );

  if (!summaryItem?.name) return null;

  const path = `other-documents/${summaryItem.name}`;
  const { data: urlData } = supabaseServerClient.storage.from(bucket).getPublicUrl(path);
  const displayName = stripTimestampPrefix(summaryItem.name);
  const uploadedAt = formatDocumentDate(summaryItem.created_at ?? summaryItem.updated_at ?? null);

  return {
    name: displayName,
    url: urlData.publicUrl,
    uploadedAt,
  };
}
