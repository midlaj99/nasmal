import { getDb } from './mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import fsSync from 'fs';

// Clean up deprecated middleware.ts in favor of proxy.ts
try {
  const legacyMiddlewarePath = path.join(process.cwd(), 'middleware.ts');
  const proxyPath = path.join(process.cwd(), 'proxy.ts');
  if (fsSync.existsSync(legacyMiddlewarePath) && fsSync.existsSync(proxyPath)) {
    fsSync.unlinkSync(legacyMiddlewarePath);
  }
} catch {}

export interface PackageOption {
  id: string;
  title: string;
  badge?: string;
  inclusions?: string[];
  moreDetails?: string;
  price?: string;
  childPrice?: string;
  isAvailable?: boolean;
}

// Define the Package type
export interface Package {
  id: string;
  title: string;
  destination: string;
  image: string;
  price: string;
  rating: string;
  reviewsCount: number;
  tags: string[];
  images: string[];
  description: string;
  highlights: string[];
  quickFacts: string[];
  inclusions: string[];
  isPopular?: boolean;
  isBestDeal?: boolean;
  originalPrice?: string;
  childPrice?: string;
  childAgeLimit?: string;
  suitableFor?: string[];
  hasOptions?: boolean;
  optionsSectionTitle?: string;
  options?: PackageOption[];
  video?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PreferenceOption {
  id: string;
  label: string;
  icon: string;
  isCustom?: boolean;
}

export const DEFAULT_PREFERENCES: PreferenceOption[] = [
  { id: 'attractions', label: 'Attractions', icon: '🏛️' },
  { id: 'families', label: 'Families With Kids', icon: '👨‍👩‍👧‍👦' },
  { id: 'couple', label: 'Couple', icon: '💑' },
  { id: 'food', label: 'Food Drinks', icon: '🍹' },
  { id: 'culture', label: 'Culture & Heritage', icon: '🕌' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🌲' },
];

export interface Destination {
  id: string;
  title: string;
  image: string;
  toursCount: number;
  createdAt?: string;
}

export interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  packageTitle: string;
  visitDate: string;
  adultsCount: number;
  childrenCount: number;
  totalPrice: number;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface WishlistItem {
  userId: string;
  packageId: string;
  createdAt: string;
}

export interface ContactEnquiry {
  id: string;
  fullname: string;
  phone: string;
  email: string;
  enquiryType: string;
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
}


export const DEFAULT_DESTINATIONS: Destination[] = [
  {
    id: 'dubai',
    title: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2560&q=95&auto=format',
    toursCount: 154,
  },
  {
    id: 'abu-dhabi',
    title: 'Abu Dhabi',
    image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1600&q=90&auto=format',
    toursCount: 86,
  },
  {
    id: 'sharjah',
    title: 'Sharjah',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1600&q=90&auto=format',
    toursCount: 42,
  },
];

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'burj-khalifa-at-the-top',
    title: 'Burj Khalifa At The Top (Level 124 & 125)',
    destination: 'Dubai',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1600&q=90&auto=format',
    price: '179',
    originalPrice: '220',
    rating: '4.9',
    reviewsCount: 1420,
    tags: ['Attractions', 'Iconic', 'Skyline'],
    images: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1600&q=90&auto=format',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=90&auto=format',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=90&auto=format'
    ],
    description: "Experience panoramic 360-degree views of Dubai from the world's tallest building. Step onto the open-air terrace of Level 124 and explore Level 125 with state-of-the-art telescopes and immersive displays.",
    highlights: [
      'High-speed elevators travelling at 10 meters per second',
      'Observation decks on Level 124 & 125',
      'Breathtaking 360-degree panoramic views of Dubai skyline and Arabian Gulf',
      'State-of-the-art telescopes for close-up city exploration'
    ],
    quickFacts: [
      'Duration: ~1.5 Hours',
      'Mobile Tickets Accepted',
      'Instant Confirmation',
      'Wheelchair Accessible'
    ],
    inclusions: [
      'Burj Khalifa At The Top entry ticket',
      'Access to Levels 124 and 125',
      'High-speed elevator ride',
      'Access to viewing telescopes',
      'Free high-speed Wi-Fi'
    ],
    isPopular: true,
    isBestDeal: true,
    hasOptions: true,
    optionsSectionTitle: 'Available Options',
    options: [
      {
        id: 'opt_std_124_125',
        title: 'At The Top (Level 124 & 125) - Standard Hours',
        badge: 'Best Value',
        price: '179',
        childPrice: '139',
        isAvailable: true,
        inclusions: [
          'Admission tickets to 124 & 125 Floors of Burj Khalifa',
          'Access to the telescopes on 124th floor',
          'Standard non-prime hours admission'
        ],
        moreDetails: 'Instant confirmation. Please arrive 15 minutes before your scheduled entry time.'
      },
      {
        id: 'opt_prime_sunset',
        title: 'At The Top - Sunset Prime Hours',
        badge: 'Prime Hours',
        price: '249',
        childPrice: '179',
        isAvailable: true,
        inclusions: [
          'Admission tickets to 124 & 125 Floors during golden hour',
          'Access to the outdoor observation terrace',
          'Witness Dubai transition from golden sunset to sparkling night'
        ],
        moreDetails: 'The most popular viewing time in Dubai. Advance booking strongly recommended.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'desert-safari-bbq-dinner',
    title: 'Dubai Red Dune Desert Safari & BBQ Dinner',
    destination: 'Dubai',
    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1600&q=90&auto=format',
    price: '149',
    originalPrice: '199',
    rating: '4.8',
    reviewsCount: 980,
    tags: ['Adventure', 'Families', 'Culture'],
    images: [
      'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1600&q=90&auto=format',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&q=90&auto=format',
      'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1600&q=90&auto=format'
    ],
    description: 'Conquer the golden red dunes in a 4x4 Land Cruiser, try sandboarding, ride camels, and enjoy a lavish 5-star BBQ dinner with Tanoura dance and fire show under the Arabian desert stars.',
    highlights: [
      'Thrilling 4x4 Dune Bashing in Lahbab Red Dunes',
      'Camel ride and sandboarding adventure',
      'Sunset photography stop over the desert horizon',
      'Lavish BBQ dinner buffet with vegetarian and non-vegetarian selections',
      'Live Tanoura, belly dance, and mesmerizing fire show'
    ],
    quickFacts: [
      'Duration: ~6 Hours',
      'Hotel Pick-up & Drop-off Included',
      'Dinner Included',
      'Instant Confirmation'
    ],
    inclusions: [
      'Hotel pick-up and drop-off in air-conditioned 4x4',
      '30-40 minutes Dune Bashing session',
      'Camel ride experience',
      'Sandboarding gear and briefing',
      'International BBQ buffet dinner with unlimited water and soft drinks',
      'Live cultural performances'
    ],
    isPopular: true,
    isBestDeal: true,
    hasOptions: true,
    optionsSectionTitle: 'Available Options',
    options: [
      {
        id: 'opt_safari_standard',
        title: 'Standard Desert Safari with BBQ Dinner',
        badge: 'Popular',
        price: '149',
        childPrice: '119',
        isAvailable: true,
        inclusions: [
          '4x4 Dune Bashing & Sandboarding',
          'Camel ride & Henna painting',
          'International BBQ dinner buffet'
        ],
        moreDetails: 'Pick up between 2:30 PM - 3:30 PM from your hotel in Dubai or Sharjah.'
      },
      {
        id: 'opt_safari_vip',
        title: 'VIP Desert Safari with Table Service',
        badge: 'VIP Pass',
        price: '229',
        childPrice: '169',
        isAvailable: true,
        inclusions: [
          'VIP seating area with dedicated waiter service',
          'Dune Bashing, Camel ride & Quad bike access',
          'Premium BBQ dinner served directly at your table'
        ],
        moreDetails: 'Enjoy royal treatment with dedicated table service and premium seating.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dubai-marina-luxury-yacht',
    title: 'Dubai Marina Luxury Yacht Cruise & Refreshments',
    destination: 'Dubai',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=90&auto=format',
    price: '199',
    originalPrice: '280',
    rating: '4.9',
    reviewsCount: 650,
    tags: ['Luxury', 'Couple', 'Sightseeing'],
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=90&auto=format',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=90&auto=format'
    ],
    description: 'Sail through Dubai Marina, Ain Dubai, JBR, and the iconic Atlantis The Palm on an ultra-luxury yacht with refreshing drinks, experienced captain, and onboard sound system.',
    highlights: [
      'Scenic cruise through Dubai Marina lagoon and Arabian Gulf',
      'Close-up views of Ain Dubai, JBR, and Atlantis The Palm',
      'Spacious sunbathing deck and air-conditioned indoor salon',
      'Complimentary chilled drinks and fruit platter'
    ],
    quickFacts: [
      'Duration: ~2 Hours',
      'Boarding at Dubai Marina',
      'Refreshments Included',
      'Instant Confirmation'
    ],
    inclusions: [
      '2-hour luxury yacht cruise',
      'Chilled water, sodas, and juices',
      'Professional captain and crew',
      'Life jackets and marine safety equipment'
    ],
    isPopular: true,
    isBestDeal: false,
    hasOptions: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'abu-dhabi-grand-mosque-tour',
    title: 'Abu Dhabi City Tour & Sheikh Zayed Grand Mosque',
    destination: 'Abu Dhabi',
    image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1600&q=90&auto=format',
    price: '210',
    originalPrice: '260',
    rating: '4.9',
    reviewsCount: 520,
    tags: ['Culture', 'Sightseeing', 'Attractions'],
    images: [
      'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1600&q=90&auto=format',
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1600&q=90&auto=format'
    ],
    description: 'Discover the cultural richness and architectural splendor of the UAE capital. Visit the breathtaking Sheikh Zayed Grand Mosque, drive along the Corniche, and glimpse the Emirates Palace.',
    highlights: [
      'Guided visit to the magnificent Sheikh Zayed Grand Mosque',
      'Drive along the picturesque Abu Dhabi Corniche',
      'Photo stops at Emirates Palace and Etihad Towers',
      'Visit to the Date Market and Heritage Village'
    ],
    quickFacts: [
      'Duration: ~8 Hours',
      'Round-trip Transfer from Dubai',
      'Guided Tour',
      'Instant Confirmation'
    ],
    inclusions: [
      'Round-trip transfer from Dubai hotels in AC coach',
      'Professional English-speaking licensed guide',
      'Sheikh Zayed Grand Mosque entrance ticket',
      'Bottled drinking water'
    ],
    isPopular: true,
    isBestDeal: true,
    hasOptions: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

/**
 * ReDoS & NoSQL Injection Protection
 * Safely escapes characters before constructing regular expressions
 */
export function escapeRegex(text: string): string {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// =============================================================
// HIGH-SPEED IN-MEMORY CACHE FOR MASSIVE CONCURRENCY
// Delivers sub-millisecond responses to handle lakhs of visitors
// =============================================================
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

let packagesCache: CacheEntry<Package[]> | null = null;
const packageItemCache = new Map<string, CacheEntry<Package>>();
let destinationsCache: CacheEntry<Destination[]> | null = null;
const destinationItemCache = new Map<string, CacheEntry<Destination>>();
let preferencesCache: CacheEntry<PreferenceOption[]> | null = null;

// Memory cache for active images (Max 100 items to bound RAM)
const imageMemoryCache = new Map<string, { data: Buffer; contentType: string; expiresAt: number }>();

export function invalidatePackagesCache() {
  packagesCache = null;
  packageItemCache.clear();
}

export function invalidateDestinationsCache() {
  destinationsCache = null;
  destinationItemCache.clear();
  invalidatePackagesCache();
}

export function invalidatePreferencesCache() {
  preferencesCache = null;
}

let isInitialized = false;
let initPromise: Promise<void> | null = null;
const SEED_MARKER = 'nasmal_db_seeded_v1';

/**
 * Initializes database indexes and seed data if collections are empty (ONLY ONCE)
 */
async function initializeDatabase() {
  if (isInitialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const db = await getDb();

        // Check if database was already seeded. If seeded, NEVER re-seed!
        const marker = await db.collection('settings').findOne({ id: SEED_MARKER });
        if (!marker) {
          const [destCount, pkgCount, prefCount] = await Promise.all([
            db.collection('destinations').countDocuments(),
            db.collection('packages').countDocuments(),
            db.collection('preferences').countDocuments(),
          ]);

          if (destCount === 0) {
            await db.collection('destinations').insertMany(DEFAULT_DESTINATIONS as any);
          }
          if (pkgCount === 0) {
            await db.collection('packages').insertMany(DEFAULT_PACKAGES as any);
          }
          if (prefCount === 0) {
            await db.collection('preferences').insertMany(DEFAULT_PREFERENCES as any);
          }

          await db.collection('settings').insertOne({ id: SEED_MARKER, seededAt: new Date().toISOString() });
        }

        // Fire-and-forget indexes in the background (NEVER block user actions)
        Promise.resolve().then(async () => {
          try {
            await Promise.allSettled([
              db.collection('packages').createIndex({ id: 1 }, { unique: true }),
              db.collection('packages').createIndex({ destination: 1 }),
              db.collection('packages').createIndex({ createdAt: -1 }),
              db.collection('destinations').createIndex({ id: 1 }, { unique: true }),
              db.collection('orders').createIndex({ id: 1 }, { unique: true }),
              db.collection('admins').createIndex({ id: 1 }, { unique: true }),
              db.collection('sessions').createIndex({ id: 1 }, { unique: true }),
            ]);
          } catch {}
        });

        isInitialized = true;
      } catch (err) {
        console.error('Database initialization note:', err);
      }
    })();
  }
  await initPromise;
}

// -------------------------------------------------------------
// PACKAGES (CRUD)
// -------------------------------------------------------------

export async function getPackages(): Promise<Package[]> {
  const now = Date.now();
  if (packagesCache && packagesCache.expiresAt > now) {
    return packagesCache.data;
  }

  try {
    initializeDatabase().catch(() => {});
    const db = await getDb();

    // Fetch all packages cleanly and ensure each document has a valid `id`
    const docs = await db.collection('packages').find({}).sort({ createdAt: -1 }).toArray();

    const resultPackages: Package[] = docs.map((doc: any) => {
      const id = String(doc.id || doc._id?.toString() || '').trim();
      const { _id, ...cleanDoc } = doc;
      return { ...cleanDoc, id } as Package;
    });

    // Cache for 5 seconds (instantly invalidated upon any admin add/update/delete)
    packagesCache = {
      data: resultPackages,
      expiresAt: now + 5000,
    };

    return resultPackages;
  } catch (err) {
    console.error('getPackages DB fetch error, using defaults:', err);
    return DEFAULT_PACKAGES;
  }
}

export async function getPackageById(id: string): Promise<Package | null> {
  const safeId = String(id || '').trim();
  if (!safeId) return null;

  const decodedId = decodeURIComponent(safeId).trim();
  const slugifiedId = safeId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const now = Date.now();
  const cached = packageItemCache.get(safeId) || packageItemCache.get(decodedId);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  try {
    const db = await getDb();

    const queryConditions: any[] = [
      { id: safeId },
      { id: decodedId },
      { id: slugifiedId },
      { id: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
      { id: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
      { title: safeId },
      { title: decodedId },
      { title: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
      { title: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
      { _id: safeId },
      { _id: decodedId },
    ];

    if (ObjectId.isValid(safeId)) {
      try {
        queryConditions.push({ _id: new ObjectId(safeId) });
      } catch {}
    }
    if (ObjectId.isValid(decodedId)) {
      try {
        queryConditions.push({ _id: new ObjectId(decodedId) });
      } catch {}
    }

    const doc = await db.collection('packages').findOne({ $or: queryConditions });
    
    if (doc) {
      const pkgId = String(doc.id || doc._id?.toString() || safeId).trim();
      const { _id, ...cleanDoc } = doc;
      const pkg: Package = { ...cleanDoc, id: pkgId } as Package;
      packageItemCache.set(safeId, { data: pkg, expiresAt: now + 60000 });
      packageItemCache.set(pkgId, { data: pkg, expiresAt: now + 60000 });
      return pkg;
    }
  } catch (err) {
    console.error(`getPackageById error for ${safeId}, using fallback:`, err);
  }

  // Fallback match from DEFAULT_PACKAGES
  const defaultPkg = DEFAULT_PACKAGES.find(
    p => p.id === safeId || p.id === decodedId || p.id === slugifiedId || p.title.toLowerCase() === safeId.toLowerCase()
  );
  return defaultPkg || null;
}

export async function getPackagesByDestination(destination: string): Promise<Package[]> {
  const safeDest = escapeRegex(String(destination || '').trim());
  try {
    const db = await getDb();
    
    const docs = await db
      .collection('packages')
      .find(
        { destination: { $regex: new RegExp(`^${safeDest}$`, 'i') } }
      )
      .sort({ createdAt: -1 })
      .toArray();

    if (docs && docs.length > 0) {
      return docs.map((doc: any) => {
        const id = String(doc.id || doc._id?.toString() || '').trim();
        const { _id, ...cleanDoc } = doc;
        return { ...cleanDoc, id } as Package;
      });
    }
  } catch (err) {
    console.error('getPackagesByDestination error, using fallback:', err);
  }

  return DEFAULT_PACKAGES.filter(
    p => p.destination.toLowerCase() === (destination || '').toLowerCase()
  );
}

export async function addPackage(newPackage: Omit<Package, 'id'>): Promise<Package> {
  const db = await getDb();

  // Generate clean slug ID from title
  let id = newPackage.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (!id) {
    id = `pkg-${Date.now()}`;
  }

  // Ensure unique ID
  const existing = await db.collection('packages').findOne({ id });
  if (existing) {
    id = `${id}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const pkgWithId: Package = {
    ...newPackage,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection('packages').insertOne(pkgWithId as any);

  // Update toursCount on matching destination
  const safeDestTitle = escapeRegex(newPackage.destination);
  db.collection('destinations').updateOne(
    { title: { $regex: new RegExp(`^${safeDestTitle}$`, 'i') } },
    { $inc: { toursCount: 1 } }
  ).catch(console.error);

  // Invalidate cache immediately for zero-lag sync
  invalidatePackagesCache();

  const { _id, ...cleanPkg } = pkgWithId as any;
  return cleanPkg as Package;
}

export async function updatePackage(id: string, updates: Partial<Package>): Promise<Package | null> {
  const db = await getDb();
  const safeId = String(id || '').trim();
  if (!safeId) return null;

  const decodedId = decodeURIComponent(safeId).trim();
  const slugifiedId = safeId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const queryConditions: any[] = [
    { id: safeId },
    { id: decodedId },
    { id: slugifiedId },
    { id: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { id: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { title: safeId },
    { title: decodedId },
    { title: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { title: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { _id: safeId },
    { _id: decodedId },
  ];

  if (ObjectId.isValid(safeId)) {
    try {
      queryConditions.push({ _id: new ObjectId(safeId) });
    } catch {}
  }
  if (ObjectId.isValid(decodedId)) {
    try {
      queryConditions.push({ _id: new ObjectId(decodedId) });
    } catch {}
  }

  const updateDoc = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const res = await db.collection('packages').findOneAndUpdate(
    { $or: queryConditions },
    { $set: updateDoc },
    { returnDocument: 'after' }
  );

  invalidatePackagesCache();

  if (res) {
    const pkgId = String((res as any).id || (res as any)._id?.toString() || safeId).trim();
    const { _id, ...cleanPkg } = res as any;
    return { ...cleanPkg, id: pkgId } as Package;
  }

  return null;
}

export async function deletePackage(id: string): Promise<boolean> {
  const db = await getDb();
  const safeId = String(id || '').trim();
  if (!safeId) return true;

  const decodedId = decodeURIComponent(safeId).trim();
  const slugifiedId = safeId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const queryConditions: any[] = [
    { id: safeId },
    { id: decodedId },
    { id: slugifiedId },
    { id: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { id: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { id: { $regex: new RegExp(`^${escapeRegex(slugifiedId)}$`, 'i') } },
    { title: safeId },
    { title: decodedId },
    { title: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { title: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { _id: safeId },
    { _id: decodedId },
  ];

  if (ObjectId.isValid(safeId)) {
    try {
      queryConditions.push({ _id: new ObjectId(safeId) });
    } catch {}
  }
  if (ObjectId.isValid(decodedId)) {
    try {
      queryConditions.push({ _id: new ObjectId(decodedId) });
    } catch {}
  }

  // 1. Find existing record to clean up associations
  const existing = await db.collection('packages').findOne({ $or: queryConditions });

  // 2. Perform deletion in MongoDB
  await db.collection('packages').deleteOne({ $or: queryConditions });

  // 3. Purge from in-memory DEFAULT_PACKAGES so it never reappears
  const defaultIdx = DEFAULT_PACKAGES.findIndex(
    p => p.id === safeId || p.id === decodedId || p.id === slugifiedId || p.title.toLowerCase() === safeId.toLowerCase()
  );
  if (defaultIdx !== -1) {
    DEFAULT_PACKAGES.splice(defaultIdx, 1);
  }

  if (existing?.destination) {
    const safeDestTitle = escapeRegex(existing.destination);
    db.collection('destinations').updateOne(
      { title: { $regex: new RegExp(`^${safeDestTitle}$`, 'i') } },
      { $inc: { toursCount: -1 } }
    ).catch(console.error);
  }

  const packageIdentifier = existing?.id || safeId;
  db.collection('wishlist').deleteMany({
    $or: [{ packageId: packageIdentifier }, { packageId: safeId }, { packageId: decodedId }]
  }).catch(console.error);

  invalidatePackagesCache();
  return true;
}

// -------------------------------------------------------------
// DESTINATIONS (CRUD)
// -------------------------------------------------------------

export async function getDestinations(): Promise<Destination[]> {
  const now = Date.now();
  if (destinationsCache && destinationsCache.expiresAt > now) {
    return destinationsCache.data;
  }

  try {
    const db = await getDb();
    const docs = await db
      .collection('destinations')
      .find({})
      .toArray();

    const result: Destination[] = docs.map((doc: any) => {
      const id = String(doc.id || doc._id?.toString() || '').trim();
      const { _id, ...cleanDoc } = doc;
      return { ...cleanDoc, id } as Destination;
    });

    destinationsCache = {
      data: result,
      expiresAt: now + 15000,
    };

    return result;
  } catch (err) {
    console.error('getDestinations DB error, using fallback:', err);
    return DEFAULT_DESTINATIONS;
  }
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const safeId = String(id || '').trim().toLowerCase();
  if (!safeId) return null;

  const now = Date.now();
  const cached = destinationItemCache.get(safeId);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  try {
    const db = await getDb();
    const safeEscaped = escapeRegex(safeId);
    
    // 1. Direct match by id or title with escaped regex
    let doc = await db.collection('destinations').findOne(
      { $or: [{ id: safeId }, { title: { $regex: new RegExp(`^${safeEscaped}$`, 'i') } }] },
      { projection: { _id: 0 } }
    );

    // 2. Fallback fuzzy match for typos or slug variants
    if (!doc) {
      const cleanSlug = safeId.replace(/[^a-z0-9]/g, '');
      const all = await getDestinations();
      doc = all.find((d: any) => {
        const dId = String(d.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const dTitle = String(d.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return dId.startsWith(cleanSlug) || cleanSlug.startsWith(dId) || 
               dTitle.startsWith(cleanSlug) || cleanSlug.startsWith(dTitle) ||
               dId.includes(cleanSlug) || cleanSlug.includes(dId);
      }) as any;
    }

    if (doc) {
      const dest = doc as unknown as Destination;
      destinationItemCache.set(safeId, { data: dest, expiresAt: now + 60000 });
      return dest;
    }
  } catch (err) {
    console.error(`getDestinationById error for ${safeId}, using fallback:`, err);
  }

  const defaultDest = DEFAULT_DESTINATIONS.find(
    d => d.id === safeId || d.title.toLowerCase() === safeId
  );
  return defaultDest || null;
}

export async function addDestination(
  newDest: Omit<Destination, 'id' | 'toursCount'>
): Promise<Destination> {
  const db = await getDb();

  let id = newDest.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (!id) id = `dest-${Date.now()}`;

  const existing = await db.collection('destinations').findOne({ id });
  if (existing) {
    id = `${id}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const safeTitle = escapeRegex(newDest.title);
  const currentCount = await db.collection('packages').countDocuments({
    destination: { $regex: new RegExp(`^${safeTitle}$`, 'i') },
  });

  const destWithId: Destination = {
    ...newDest,
    id,
    toursCount: currentCount,
    createdAt: new Date().toISOString(),
  };

  await db.collection('destinations').insertOne(destWithId as any);
  invalidateDestinationsCache();

  const { _id, ...cleanDest } = destWithId as any;
  return cleanDest as Destination;
}

export async function updateDestination(
  id: string,
  updates: Partial<Destination>
): Promise<Destination | null> {
  const db = await getDb();
  const safeId = String(id || '').trim();
  if (!safeId) return null;

  const decodedId = decodeURIComponent(safeId).trim();
  const slugifiedId = safeId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const queryConditions: any[] = [
    { id: safeId },
    { id: decodedId },
    { id: slugifiedId },
    { id: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { id: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { title: safeId },
    { title: decodedId },
    { title: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { title: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { _id: safeId },
    { _id: decodedId },
  ];

  if (ObjectId.isValid(safeId)) {
    try {
      queryConditions.push({ _id: new ObjectId(safeId) });
    } catch {}
  }
  if (ObjectId.isValid(decodedId)) {
    try {
      queryConditions.push({ _id: new ObjectId(decodedId) });
    } catch {}
  }

  const res = await db.collection('destinations').findOneAndUpdate(
    { $or: queryConditions },
    { $set: updates },
    { returnDocument: 'after', projection: { _id: 0 } }
  );

  invalidateDestinationsCache();
  return (res as unknown as Destination) || null;
}

export async function deleteDestination(id: string): Promise<boolean> {
  const db = await getDb();
  const safeId = String(id || '').trim();
  if (!safeId) return true;

  const decodedId = decodeURIComponent(safeId).trim();
  const slugifiedId = safeId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const queryConditions: any[] = [
    { id: safeId },
    { id: decodedId },
    { id: slugifiedId },
    { id: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { id: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { title: safeId },
    { title: decodedId },
    { title: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { title: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { _id: safeId },
    { _id: decodedId },
  ];

  if (ObjectId.isValid(safeId)) {
    try {
      queryConditions.push({ _id: new ObjectId(safeId) });
    } catch {}
  }
  if (ObjectId.isValid(decodedId)) {
    try {
      queryConditions.push({ _id: new ObjectId(decodedId) });
    } catch {}
  }

  const dest = await db.collection('destinations').findOne({ $or: queryConditions });
  await db.collection('destinations').deleteOne({ $or: queryConditions });

  // 1. Purge from in-memory DEFAULT_DESTINATIONS so it never reappears on fallback
  const defaultIdx = DEFAULT_DESTINATIONS.findIndex(
    d => d.id === safeId || d.id === decodedId || d.id === slugifiedId || d.title.toLowerCase() === safeId.toLowerCase()
  );
  if (defaultIdx !== -1) {
    DEFAULT_DESTINATIONS.splice(defaultIdx, 1);
  }

  // 2. Cascade delete matching packages from both MongoDB and in-memory defaults
  if (dest?.title) {
    const safeTitle = escapeRegex(dest.title);
    await db.collection('packages').deleteMany({
      destination: { $regex: new RegExp(`^${safeTitle}$`, 'i') }
    });
    for (let i = DEFAULT_PACKAGES.length - 1; i >= 0; i--) {
      if (DEFAULT_PACKAGES[i].destination.toLowerCase() === dest.title.toLowerCase()) {
        DEFAULT_PACKAGES.splice(i, 1);
      }
    }
    invalidatePackagesCache();
  }

  invalidateDestinationsCache();
  return true;
}

// -------------------------------------------------------------
// ORDERS (CRUD)
// -------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  const db = await getDb();
  const docs = await db
    .collection('orders')
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs as unknown as Order[];
}

export async function createOrder(
  orderData: Omit<Order, 'id' | 'createdAt' | 'status'>
): Promise<Order> {
  const db = await getDb();

  const id = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const newOrder: Order = {
    ...orderData,
    id,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  await db.collection('orders').insertOne(newOrder as any);

  const { _id, ...cleanOrder } = newOrder as any;
  return cleanOrder as Order;
}

export async function createEnquiry(
  data: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>
): Promise<ContactEnquiry> {
  const db = await getDb();

  const id = `ENQ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const newEnquiry: ContactEnquiry = {
    ...data,
    id,
    status: 'New',
    createdAt: new Date().toISOString(),
  };

  await db.collection('enquiries').insertOne(newEnquiry as any);

  const { _id, ...cleanEnquiry } = newEnquiry as any;
  return cleanEnquiry as ContactEnquiry;
}

export async function getEnquiries(): Promise<ContactEnquiry[]> {
  const db = await getDb();
  const results = await db
    .collection('enquiries')
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return results as unknown as ContactEnquiry[];
}


export async function updateOrderStatus(
  id: string,
  status: Order['status']
): Promise<Order | null> {
  const db = await getDb();
  const safeId = String(id || '').trim();
  if (!safeId) return null;

  const decodedId = decodeURIComponent(safeId).trim();

  const queryConditions: any[] = [
    { id: safeId },
    { id: decodedId },
    { id: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { id: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { _id: safeId },
    { _id: decodedId },
  ];

  if (ObjectId.isValid(safeId)) {
    try {
      queryConditions.push({ _id: new ObjectId(safeId) });
    } catch {}
  }
  if (ObjectId.isValid(decodedId)) {
    try {
      queryConditions.push({ _id: new ObjectId(decodedId) });
    } catch {}
  }

  const res = await db.collection('orders').findOneAndUpdate(
    { $or: queryConditions },
    { $set: { status } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );

  return (res as unknown as Order) || null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const db = await getDb();
  const safeId = String(id || '').trim();
  if (!safeId) return true;

  const decodedId = decodeURIComponent(safeId).trim();

  const queryConditions: any[] = [
    { id: safeId },
    { id: decodedId },
    { id: { $regex: new RegExp(`^${escapeRegex(safeId)}$`, 'i') } },
    { id: { $regex: new RegExp(`^${escapeRegex(decodedId)}$`, 'i') } },
    { _id: safeId },
    { _id: decodedId },
  ];

  if (ObjectId.isValid(safeId)) {
    try {
      queryConditions.push({ _id: new ObjectId(safeId) });
    } catch {}
  }
  if (ObjectId.isValid(decodedId)) {
    try {
      queryConditions.push({ _id: new ObjectId(decodedId) });
    } catch {}
  }

  await db.collection('orders').deleteOne({ $or: queryConditions });
  return true;
}

// -------------------------------------------------------------
// PREFERENCES
// -------------------------------------------------------------

export async function getPreferences(): Promise<PreferenceOption[]> {
  const now = Date.now();
  if (preferencesCache && preferencesCache.expiresAt > now) {
    return preferencesCache.data;
  }

  const db = await getDb();
  const docs = await db
    .collection('preferences')
    .find({}, { projection: { _id: 0 } })
    .toArray();

  const result = (docs as unknown as PreferenceOption[]) || DEFAULT_PREFERENCES;
  preferencesCache = {
    data: result,
    expiresAt: now + 60000,
  };

  return result;
}

export async function addPreference(
  newPref: Omit<PreferenceOption, 'id'>
): Promise<PreferenceOption> {
  const db = await getDb();

  const id = newPref.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const safeLabel = escapeRegex(newPref.label);
  const existing = await db.collection('preferences').findOne({
    $or: [{ id }, { label: { $regex: new RegExp(`^${safeLabel}$`, 'i') } }],
  });

  if (existing) {
    const { _id, ...cleanExisting } = existing as any;
    return cleanExisting as PreferenceOption;
  }

  const prefWithId: PreferenceOption = { ...newPref, id, isCustom: true };
  await db.collection('preferences').insertOne(prefWithId as any);
  invalidatePreferencesCache();

  const { _id, ...cleanPref } = prefWithId as any;
  return cleanPref as PreferenceOption;
}

// -------------------------------------------------------------
// WISHLIST (Database Stored)
// -------------------------------------------------------------

export async function getWishlist(userId: string): Promise<Package[]> {
  const db = await getDb();
  const safeUser = String(userId).trim();

  const items = await db
    .collection('wishlist')
    .find({ userId: safeUser })
    .sort({ createdAt: -1 })
    .toArray();

  const packageIds = items.map(item => item.packageId);
  if (packageIds.length === 0) return [];

  const packages = await db
    .collection('packages')
    .find({ $or: [{ id: { $in: packageIds } }, { _id: { $in: packageIds } }] })
    .toArray();

  return packages.map((doc: any) => {
    const id = String(doc.id || doc._id?.toString() || '').trim();
    const { _id, ...cleanDoc } = doc;
    return { ...cleanDoc, id } as Package;
  });
}

export async function addToWishlist(userId: string, packageId: string): Promise<boolean> {
  const db = await getDb();
  const safeUser = String(userId).trim();
  const safePkg = String(packageId).trim();

  try {
    await db.collection('wishlist').updateOne(
      { userId: safeUser, packageId: safePkg },
      { $setOnInsert: { userId: safeUser, packageId: safePkg, createdAt: new Date().toISOString() } },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    return false;
  }
}

export async function removeFromWishlist(userId: string, packageId: string): Promise<boolean> {
  const db = await getDb();
  const safeUser = String(userId).trim();
  const safePkg = String(packageId).trim();

  const res = await db.collection('wishlist').deleteOne({ userId: safeUser, packageId: safePkg });
  return res.deletedCount > 0;
}

export async function isWishlisted(userId: string, packageId: string): Promise<boolean> {
  const db = await getDb();
  const safeUser = String(userId).trim();
  const safePkg = String(packageId).trim();

  const count = await db.collection('wishlist').countDocuments({ userId: safeUser, packageId: safePkg });
  return count > 0;
}

// -------------------------------------------------------------
// DATABASE STORED MEDIA / IMAGES WITH IN-MEMORY SPEED ACCELERATOR
// -------------------------------------------------------------

export async function saveImageToDb(
  buffer: Buffer,
  contentType = 'image/jpeg',
  filename = 'image.jpg'
): Promise<string> {
  const db = await getDb();

  const id = `img-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Use GridFS for media larger than 8MB to prevent BSON 16MB document limit
  if (buffer.length > 8 * 1024 * 1024) {
    const bucket = new GridFSBucket(db, { bucketName: 'media_files' });
    await new Promise<void>((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(id, {
        metadata: { contentType, filename, size: buffer.length }
      });
      uploadStream.on('finish', () => resolve());
      uploadStream.on('error', reject);
      uploadStream.end(buffer);
    });

    await db.collection('images').insertOne({
      id,
      isGridFs: true,
      contentType,
      filename,
      size: buffer.length,
      createdAt: new Date().toISOString(),
    });
  } else {
    const base64 = buffer.toString('base64');
    await db.collection('images').insertOne({
      id,
      data: base64,
      isGridFs: false,
      contentType,
      filename,
      size: buffer.length,
      createdAt: new Date().toISOString(),
    });

    // Populate memory cache immediately for images under 8MB
    if (imageMemoryCache.size > 100) {
      const oldestKey = imageMemoryCache.keys().next().value;
      if (oldestKey) imageMemoryCache.delete(oldestKey);
    }
    imageMemoryCache.set(id, {
      data: buffer,
      contentType,
      expiresAt: Date.now() + 300000, // 5 minutes in-memory cache
    });
  }

  return `/api/images/${id}`;
}

export async function getImageFromDb(
  id: string
): Promise<{ data: Buffer; contentType: string } | null> {
  const safeId = String(id).trim();
  if (!safeId) return null;

  // Check fast in-memory accelerator
  const cached = imageMemoryCache.get(safeId);
  if (cached && cached.expiresAt > Date.now()) {
    return { data: cached.data, contentType: cached.contentType };
  }

  const db = await getDb();

  const doc = await db.collection('images').findOne({ id: safeId });
  if (!doc) return null;

  if (doc.isGridFs) {
    const bucket = new GridFSBucket(db, { bucketName: 'media_files' });
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      const downloadStream = bucket.openDownloadStreamByName(safeId);
      downloadStream.on('data', chunk => chunks.push(chunk));
      downloadStream.on('end', () => resolve());
      downloadStream.on('error', reject);
    });
    const buffer = Buffer.concat(chunks);
    const contentType = doc.contentType || 'application/octet-stream';
    return { data: buffer, contentType };
  }

  if (!doc.data) return null;
  const buffer = Buffer.from(doc.data, 'base64');
  const contentType = doc.contentType || 'image/jpeg';

  // Save into in-memory accelerator
  if (imageMemoryCache.size > 100) {
    const oldestKey = imageMemoryCache.keys().next().value;
    if (oldestKey) imageMemoryCache.delete(oldestKey);
  }
  imageMemoryCache.set(safeId, {
    data: buffer,
    contentType,
    expiresAt: Date.now() + 300000,
  });

  return { data: buffer, contentType };
}


// -------------------------------------------------------------
// WHATSAPP SETTINGS & ORDER DISPATCH CONFIGURATION
// -------------------------------------------------------------

export interface WhatsAppConfig {
  countryCode: string;
  phone: string;
  fullNumber: string;
  updatedAt?: string;
}

let whatsAppConfigCache: CacheEntry<WhatsAppConfig> | null = null;

export async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  const defaultConfig: WhatsAppConfig = {
    countryCode: '+971',
    phone: '582659321',
    fullNumber: '+971582659321',
  };

  const now = Date.now();
  if (whatsAppConfigCache && whatsAppConfigCache.expiresAt > now) {
    return whatsAppConfigCache.data;
  }

  try {
    const db = await getDb();
    const doc = await db.collection('settings').findOne({ id: 'whatsapp_config' });
    const config: WhatsAppConfig = doc
      ? {
          countryCode: doc.countryCode || defaultConfig.countryCode,
          phone: doc.phone || defaultConfig.phone,
          fullNumber: doc.fullNumber || defaultConfig.fullNumber,
          updatedAt: doc.updatedAt,
        }
      : defaultConfig;

    whatsAppConfigCache = {
      data: config,
      expiresAt: now + 60000,
    };

    return config;
  } catch (err) {
    console.warn('Error fetching WhatsApp config from DB, using defaults:', err);
    return defaultConfig;
  }
}

export async function updateWhatsAppConfig(config: {
  countryCode: string;
  phone: string;
  fullNumber: string;
}): Promise<WhatsAppConfig> {
  const db = await getDb();

  const doc: WhatsAppConfig & { id: string } = {
    id: 'whatsapp_config',
    countryCode: config.countryCode.trim(),
    phone: config.phone.trim(),
    fullNumber: config.fullNumber.trim(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection('settings').updateOne(
    { id: 'whatsapp_config' },
    { $set: doc },
    { upsert: true }
  );

  whatsAppConfigCache = {
    data: doc,
    expiresAt: Date.now() + 60000,
  };

  return doc;
}

// -------------------------------------------------------------
// CLOUDINARY CONFIGURATION FOR ZERO-MONGO-STORAGE VIDEO STREAMING
// -------------------------------------------------------------

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset?: string;
  isConfigured: boolean;
  updatedAt?: string;
}

let cloudinaryConfigCache: CacheEntry<CloudinaryConfig> | null = null;

export async function getCloudinaryConfig(): Promise<CloudinaryConfig> {
  const now = Date.now();
  if (cloudinaryConfigCache && cloudinaryConfigCache.expiresAt > now) {
    return cloudinaryConfigCache.data;
  }

  const db = await getDb();

  const envCloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const envApiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
  const envApiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();
  const envUploadPreset = (process.env.CLOUDINARY_UPLOAD_PRESET || '').trim();

  try {
    const doc = await db.collection('settings').findOne({ id: 'cloudinary_config' });

    const cloudName = doc?.cloudName || envCloudName || 'woe2kr5p';
    const apiKey = doc?.apiKey || envApiKey || '';
    const apiSecret = doc?.apiSecret || envApiSecret || '';
    const uploadPreset = doc?.uploadPreset || envUploadPreset || '';
    const isConfigured = Boolean((cloudName && apiKey && apiSecret) || (cloudName && uploadPreset));

    const result: CloudinaryConfig = {
      cloudName,
      apiKey,
      apiSecret,
      uploadPreset,
      isConfigured,
      updatedAt: doc?.updatedAt,
    };

    cloudinaryConfigCache = {
      data: result,
      expiresAt: now + 60000,
    };

    return result;
  } catch (err) {
    console.error('Error fetching Cloudinary config:', err);
    return {
      cloudName: envCloudName || 'woe2kr5p',
      apiKey: envApiKey,
      apiSecret: envApiSecret,
      uploadPreset: envUploadPreset,
      isConfigured: Boolean((envCloudName && envApiKey && envApiSecret) || (envCloudName && envUploadPreset)),
    };
  }
}

export async function updateCloudinaryConfig(config: {
  cloudName: string;
  apiKey?: string;
  apiSecret?: string;
  uploadPreset?: string;
}): Promise<CloudinaryConfig> {
  const db = await getDb();

  const doc = {
    id: 'cloudinary_config',
    cloudName: (config.cloudName || '').trim(),
    apiKey: (config.apiKey || '').trim(),
    apiSecret: (config.apiSecret || '').trim(),
    uploadPreset: (config.uploadPreset || '').trim(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection('settings').updateOne(
    { id: 'cloudinary_config' },
    { $set: doc },
    { upsert: true }
  );

  const isConfigured = Boolean((doc.cloudName && doc.apiKey && doc.apiSecret) || (doc.cloudName && doc.uploadPreset));
  const result: CloudinaryConfig = { ...doc, isConfigured };

  cloudinaryConfigCache = {
    data: result,
    expiresAt: Date.now() + 60000,
  };

  return result;
}
