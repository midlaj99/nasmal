import ActivitiesCatalog from '@/components/ActivitiesCatalog';
import { getPackages, getPackagesByDestination } from '@/lib/db';

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
  
  let packages = [];
  let formattedLocation = 'All Destinations';

  if (location) {
    formattedLocation = location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    packages = await getPackagesByDestination(formattedLocation);
  } else {
    packages = await getPackages();
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
