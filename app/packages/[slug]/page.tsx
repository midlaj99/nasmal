import PackageDetailClient from '@/components/PackageDetailClient';
import { getPackageById } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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
