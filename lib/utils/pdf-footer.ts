type PdfTextAlign = 'left' | 'center' | 'right';

type AddPdfFooterOptions = {
  align?: PdfTextAlign;
  fontSize?: number;
  marginBottomMm?: number;
  maxChars?: number;
  textColor?: number | [number, number, number];
};

const truncate = (value: string, maxChars: number): string => {
  const trimmed = value.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
};

export function addFooterTextToAllPages(
  pdf: any,
  text: string,
  options: AddPdfFooterOptions = {},
): void {
  if (!pdf) return;

  const safeText = truncate(text, options.maxChars ?? 140);
  if (!safeText) return;

  const getPages = pdf?.internal?.getNumberOfPages;
  const totalPages = typeof getPages === 'function' ? Number(getPages.call(pdf.internal)) : 0;
  if (!Number.isFinite(totalPages) || totalPages <= 0) return;

  const pageSize = pdf?.internal?.pageSize;
  const pageWidth =
    typeof pageSize?.getWidth === 'function' ? pageSize.getWidth() : Number(pageSize?.width ?? 0);
  const pageHeight =
    typeof pageSize?.getHeight === 'function' ? pageSize.getHeight() : Number(pageSize?.height ?? 0);

  if (!Number.isFinite(pageWidth) || !Number.isFinite(pageHeight) || pageWidth <= 0 || pageHeight <= 0) {
    return;
  }

  const fontSize = options.fontSize ?? 8;
  const marginBottomMm = options.marginBottomMm ?? 6;
  const align: PdfTextAlign = options.align ?? 'center';
  const y = pageHeight - marginBottomMm;
  const x = align === 'left' ? 10 : align === 'right' ? pageWidth - 10 : pageWidth / 2;

  try {
    pdf.setFontSize(fontSize);
    if (Array.isArray(options.textColor)) {
      pdf.setTextColor(options.textColor[0], options.textColor[1], options.textColor[2]);
    } else {
      pdf.setTextColor(options.textColor ?? 120);
    }

    for (let page = 1; page <= totalPages; page += 1) {
      pdf.setPage(page);
      pdf.text(safeText, x, y, { align });
    }
  } catch {
    // best-effort stamping; never fail PDF generation because of footer rendering.
  }
}

