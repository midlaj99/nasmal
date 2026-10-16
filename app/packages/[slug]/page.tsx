import PackageDetailClient from '@/components/PackageDetailClient';
import { getPackageById } from '@/lib/db';
import { notFound } from 'next/navigation';

// Revalidate every 30 seconds with immediate on-demand invalidation when admin updates
export const revalidate = 30;

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await getPackageById(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '80px' }}>
      <PackageDetailClient packageData={data} />
    </main>
  );
}
