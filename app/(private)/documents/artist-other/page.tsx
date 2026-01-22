import BackButton from "@/app/_components/BackButton";
import ManagersBadge from "@/app/(private)/_components/Badges/ManagersBadge";
import { TablePagination } from "@/app/(private)/_components/form/TablePagination";
import getSession from "@/lib/data/auth/get-session";
import { getUserProfileIdCached } from "@/lib/cache/users";
import { getArtistOtherDocuments } from "@/lib/data/documents/get-artist-other-documents";
import { hasRole, resolveNextPath } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, ChevronRight, FileText, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AVATAR_FALLBACK } from "@/lib/constants";
import { PAGINATED_TABLE_ROWS_X_PAGE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type ArtistOtherDocumentsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function ArtistOtherDocumentsPage({
  searchParams,
}: ArtistOtherDocumentsPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect("/logout");
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ["admin", "artist-manager", "venue-manager"])) {
    notFound();
  }

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? "1");

  const otherDocuments = await getArtistOtherDocuments(500);
  const totalPages = Math.max(
    1,
    Math.ceil(otherDocuments.length / PAGINATED_TABLE_ROWS_X_PAGE),
  );
  const paginatedDocuments = otherDocuments.slice(
    (currentPage - 1) * PAGINATED_TABLE_ROWS_X_PAGE,
    currentPage * PAGINATED_TABLE_ROWS_X_PAGE,
  );

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <BackButton />
      </div>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold">Other</h1>
      </div>

      {paginatedDocuments.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            {paginatedDocuments.map((doc) => (
              <div
                key={`${doc.artist.id}-${doc.url}`}
                className="rounded-2xl border border-zinc-100 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={doc.artist.avatarUrl || AVATAR_FALLBACK}
                      />
                      <AvatarFallback>
                        {doc.artist.stageName.substring(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Link
                        href={`/artisti/${doc.artist.slug}`}
                        className="text-xs font-semibold text-zinc-800"
                      >
                        @{doc.artist.stageName}
                      </Link>
                      <div className="text-[10px] text-zinc-500">
                        {doc.artist.name} {doc.artist.surname}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/artisti/${doc.artist.slug}`}
                    aria-label="Open artist details"
                    className="inline-flex items-center text-zinc-400 hover:text-zinc-600"
                  >
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-400">Manager</span>
                    <ManagersBadge
                      userRole={user.role}
                      managers={doc.artist.managers}
                      pathSegment="manager-artisti"
                    />
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-400">Email</span>
                    <span className="text-zinc-700">{doc.artist.email || "-"}</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 pt-3">
                  <FileText className="h-4 w-4 text-zinc-400" />
                  <span>Documento</span>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-600 hover:underline"
                  >
                    <FileText className="h-4 w-4 text-zinc-400" />
                    {doc.name}
                  </a>
                  {doc.uploadedAt && (
                    <span className="text-zinc-400">· {doc.uploadedAt}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <TablePagination
              totalPages={totalPages}
              currentPage={currentPage}
              searchParams={sp ?? {}}
            />
          )}
        </>
      ) : (
        <div className="px-4 py-6 text-sm text-zinc-500">
          Nessun documento disponibile.
        </div>
      )}
    </div>
  );
}
