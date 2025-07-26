import ResetPasswordForm from './_components/ResetPasswordForm';
import { redirect } from 'next/navigation';
import InvalidTokenCard from './_components/InvalidTokenCard';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string; error?: string }>;
}) {
  const params = await searchParams;
  const token = decodeURIComponent(params.token);
  const error = params.error ? decodeURIComponent(params.error) : null;

  if (error) return <InvalidTokenCard />;

  if (!token) redirect('/accedi');

  return <ResetPasswordForm token={token} />;
}
