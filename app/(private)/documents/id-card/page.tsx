import BackButton from "@/app/_components/BackButton";
import ExportButton from "@/app/(private)/_components/ExportButton";
import ArtistsBadge from "@/app/(private)/_components/Badges/ArtistsBadge";
import ManagersBadge from "@/app/(private)/_components/Badges/ManagersBadge";
import { TablePagination } from "@/app/(private)/_components/form/TablePagination";
import FiltersButton from "@/app/(private)/artisti/_components/filters/FiltersButton";
import getSession from "@/lib/data/auth/get-session";
import { getUserProfileIdCached } from "@/lib/cache/users";
import { getArtistManagersCached } from "@/lib/cache/artist-managers";
import { getZonesCached } from "@/lib/cache/zones";
import { getPaginatedArtists } from "@/lib/data/artists/get-paginated-artists";
import { artistsTableFiltersSchema } from "@/lib/validation/filters/artists-table-filters-schema";
import { ArtistsTableFilters } from "@/lib/types";
import { hasRole, resolveNextPath, splitCsv } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, ChevronRight, FileText, Mail, User } from "lucide-react";

type IdCardPageProps = {
  searchParams?: Promise<{
    page?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    manager?: string;
    zone?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function IdCardPage({ searchParams }: IdCardPageProps) {
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

  const isAdmin = user.role === "admin";
  const isArtistManager = user.role === "artist-manager";
  const isVenueManager = user.role === "venue-manager";

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? "1");

  const managersFilter = isAdmin
    ? splitCsv(sp?.manager)
    : isArtistManager
      ? [profileId!.toString()]
      : [];

  const filters: ArtistsTableFilters = {
    currentPage: currentPage,
    fullName: isVenueManager ? null : sp?.fullName || null,
    email: isVenueManager ? null : sp?.email || null,
    phone: isVenueManager ? null : sp?.phone || null,
    managerIds: isVenueManager ? [] : managersFilter,
    zoneIds: isVenueManager ? [] : splitCsv(sp?.zone),
  };

  const validation = artistsTableFiltersSchema.safeParse(filters);
  if (!validation.success) {
    notFound();
  }

  const [{ data: artists, totalPages }, artistManagers, zones] =
    await Promise.all([
      getPaginatedArtists(filters),
      isVenueManager ? Promise.resolve([]) : getArtistManagersCached(),
      isVenueManager ? Promise.resolve([]) : getZonesCached(),
    ]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <BackButton />
        {!isVenueManager && (
          <div className="flex items-center gap-2">
            {isAdmin && (
              <ExportButton
                endpoint="/api/artists/export"
                filename="export-artisti.csv"
              />
            )}
            <FiltersButton
              isAdmin={isAdmin}
              filters={filters}
              artistManagers={artistManagers}
              zones={zones}
              label="Mostra ricerca"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold">ID Card</h1>
      </div>

      {artists.length > 0 ? (
        <div className="flex flex-col gap-3">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="rounded-2xl border border-zinc-100 bg-white p-4"
            >
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <div className="flex flex-wrap items-center gap-4">
                  <ArtistsBadge
                    artists={[artist]}
                    userRole={user.role}
                  />
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-zinc-400" />
                      <span className="text-zinc-400">Manager</span>
                      <ManagersBadge
                        userRole={user.role}
                        managers={artist.managers}
                        pathSegment="manager-artisti"
                      />
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-4 w-4 text-zinc-400" />
                      <span className="text-zinc-400">Tour manager</span>
                      <span className="text-zinc-700">
                        {artist.tourManagerName || artist.tourManagerSurname
                          ? `${artist.tourManagerName ?? ""} ${
                              artist.tourManagerSurname ?? ""
                            }`.trim()
                          : artist.tourManagerEmail || "-"}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-zinc-400" />
                      <span className="text-zinc-400">Amministrazione</span>
                      <span className="text-zinc-700">
                        {artist.email || "-"}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 justify-end">
                  <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                    <FileText className="h-4 w-4 text-zinc-400" />
                    <span>ID Card</span>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700">
                    <FileText className="h-4 w-4 text-zinc-400" />
                    ID Card.pdf
                  </span>
                  <Link
                    href={`/artisti/${artist.slug}`}
                    aria-label="Open artist details"
                    className="inline-flex items-center text-zinc-400 hover:text-zinc-600"
                  >
                    <ChevronRight className="h-4 w-4 translate-y-[0.5px]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <section className="flex flex-col justify-center items-center bg-white rounded-2xl p-8">
          <h2 className="text-base font-bold">Nessun documento</h2>
          <div className="text-sm font-medium text-zinc-400">
            Aggiungi un artista per vedere gli ID card.
          </div>
        </section>
      )}

      {artists.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
