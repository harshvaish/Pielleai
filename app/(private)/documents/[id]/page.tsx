import getSession from "@/lib/data/auth/get-session";
import { hasRole, resolveNextPath } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { getUserProfileIdCached } from "@/lib/cache/users";
import ContractDetailTile from "./ContractDetailTile";
import { getContractDetailById } from "@/lib/data/contracts/get-contract-by-id";

type ContractDetailPageProps = {
  params?: Promise<{ id: string }>;
};

export default async function ContractDetailPage({
  params,
}: ContractDetailPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) redirect("/logout");

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ["admin", "artist-manager", "venue-manager"])) {
    notFound();
  }

  const sp = await params;
  const contractId = Number(sp?.id)
  const payload = await getContractDetailById(contractId);
  if (!payload) notFound();
  
  return <ContractDetailTile payload={payload?.data} />;
  }
