import ActivitiesCatalog from '@/components/ActivitiesCatalog';
import { getPackages, getPackagesByDestination, DEFAULT_PACKAGES } from '@/lib/db';

export const revalidate = 30;

export default async function ActivitiesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedSearchParams = await searchParams;
  const location = typeof resolvedSearchParams.location === 'string' ? resolvedSearchParams.location : '';
  const search = typeof resolvedSearchParams.search === 'string' 
    ? resolvedSearchParams.search 
    : typeof resolvedSearchParams.q === 'string' 
    ? resolvedSearchParams.q 
    : '';
  
  let packages: any[] = [];
  let formattedLocation = 'All Destinations';

  try {
    if (location) {
      formattedLocation = location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      packages = await getPackagesByDestination(formattedLocation);
    } else {
      packages = await getPackages();
    }
  } catch (err) {
    console.error('ActivitiesPage data load error:', err);
    packages = location 
      ? DEFAULT_PACKAGES.filter(p => p.destination.toLowerCase() === formattedLocation.toLowerCase())
      : DEFAULT_PACKAGES;
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '80px' }}>
      <ActivitiesCatalog 
        initialPackages={packages} 
        destinationName={formattedLocation} 
        initialSearch={search}
      />
    </div>
  );
}
