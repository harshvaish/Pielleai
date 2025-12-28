import getSession from "@/lib/data/auth/get-session";
import { hasRole, resolveNextPath } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { getUserProfileIdCached } from "@/lib/cache/users";
import ContractDetailTile from "./ContractDetailTile";

type ContractDetailPageProps = {
  params?: Promise<{ id: string }>;
  searchParams?: Promise<{
    stage?: string;
    data?: string;
  }>;
};

export default async function ContractDetailPage({
  searchParams,
}: ContractDetailPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) redirect("/logout");

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ["admin", "artist-manager", "venue-manager"])) {
    notFound();
  }

  const sp = await searchParams;
  if (!sp?.data) notFound();

  const payload = JSON.parse(decodeURIComponent(sp.data));

  return <ContractDetailTile payload={payload} />;
}
