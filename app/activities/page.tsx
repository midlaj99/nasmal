import Link from 'next/link';
import ActivitiesFilter from '@/components/ActivitiesFilter';
import styles from './page.module.css';
import { getPackages, getPackagesByDestination } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const location = typeof resolvedSearchParams.location === 'string' ? resolvedSearchParams.location : '';
  
  let packages = [];
  let formattedLocation = 'All Destinations';

  if (location) {
    formattedLocation = location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    packages = await getPackagesByDestination(formattedLocation);
  } else {
    packages = await getPackages();
  }

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / {location ? <><Link href={`/destinations/${location}`}>{formattedLocation}</Link> / </> : null} Activities
        </div>
        
        <ActivitiesFilter packages={packages} destinationName={formattedLocation} />
      </div>
    </main>
  );
}
