export const getContractPreviewUrl = (
  fileUrl?: string | null,
  fileName?: string | null,
): string | null => {
  if (!fileUrl) return null;
  if (!fileName) return fileUrl;
  const safeName = fileName.replace(/[\\/]/g, '-');
  return `/api/contract/preview/${encodeURIComponent(safeName)}?url=${encodeURIComponent(fileUrl)}`;
};
