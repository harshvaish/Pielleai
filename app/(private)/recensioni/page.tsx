import { Metadata } from 'next';
import ReviewsManagementClient from './ReviewsManagementClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gestione Recensioni | Admin',
  description: 'Gestisci le recensioni degli eventi',
};

export default function ReviewsManagementPage() {
  return <ReviewsManagementClient />;
}
