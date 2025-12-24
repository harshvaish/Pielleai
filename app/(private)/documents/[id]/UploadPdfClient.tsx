// app/(private)/documents/[id]/UplodPdfClient.tsx
"use client";

import { FormProvider, useForm } from "react-hook-form";
import UplodPdf from "../_components/UploadPdf";

export default function UplodPdfClient({ payload }: { payload: any }) {
  const methods = useForm({
    defaultValues: {
      contractDocument: payload?.fileUrl
        ? {
            url: payload.fileUrl,
            name: payload.fileName,
          }
        : undefined,
    },
  });

  return (
    <FormProvider {...methods}>
      <UplodPdf payload={payload} />
    </FormProvider>
  );
}
