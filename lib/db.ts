import { getDb } from './mongodb';
import fs from 'fs/promises';
import path from 'path';

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

const DEFAULT_DESTINATIONS: Destination[] = [
  {
    id: 'dubai',
    title: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    toursCount: 154,
  },
  {
    id: 'abu-dhabi',
    title: 'Abu Dhabi',
    image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80',
    toursCount: 86,
  },
  {
    id: 'sharjah',
    title: 'Sharjah',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80',
    toursCount: 42,
  },
];

let isInitialized = false;

/**
 * Initializes database indexes and seed data if collections are empty
 */
async function initializeDatabase() {
  if (isInitialized) return;
  try {
    const db = await getDb();

    // Ensure indexes for blazing fast query performance
    await Promise.allSettled([
      db.collection('packages').createIndex({ id: 1 }, { unique: true }),
      db.collection('packages').createIndex({ destination: 1 }),
      db.collection('packages').createIndex({ isPopular: 1 }),
      db.collection('packages').createIndex({ isBestDeal: 1 }),
      db.collection('destinations').createIndex({ id: 1 }, { unique: true }),
      db.collection('orders').createIndex({ id: 1 }, { unique: true }),
      db.collection('orders').createIndex({ createdAt: -1 }),
      db.collection('preferences').createIndex({ id: 1 }, { unique: true }),
      db.collection('wishlist').createIndex({ userId: 1, packageId: 1 }, { unique: true }),
    ]);

    // Seed destinations if empty
    const destCount = await db.collection('destinations').countDocuments();
    if (destCount === 0) {
      // Check if data/destinations.json exists to migrate existing ones
      try {
        const legacyFile = path.join(process.cwd(), 'data', 'destinations.json');
        const raw = await fs.readFile(legacyFile, 'utf8');
        const legacyDests = JSON.parse(raw);
        if (Array.isArray(legacyDests) && legacyDests.length > 0) {
          await db.collection('destinations').insertMany(legacyDests);
        } else {
          await db.collection('destinations').insertMany(DEFAULT_DESTINATIONS);
        }
      } catch {
        await db.collection('destinations').insertMany(DEFAULT_DESTINATIONS);
      }
    }

    // Seed preferences if empty
    const prefCount = await db.collection('preferences').countDocuments();
    if (prefCount === 0) {
      try {
        const legacyPrefFile = path.join(process.cwd(), 'data', 'preferences.json');
        const raw = await fs.readFile(legacyPrefFile, 'utf8');
        const legacyPrefs = JSON.parse(raw);
        if (Array.isArray(legacyPrefs) && legacyPrefs.length > 0) {
          await db.collection('preferences').insertMany(legacyPrefs);
        } else {
          await db.collection('preferences').insertMany(DEFAULT_PREFERENCES);
        }
      } catch {
        await db.collection('preferences').insertMany(DEFAULT_PREFERENCES);
      }
    }

    isInitialized = true;
  } catch (err) {
    console.error('Database initialization warning:', err);
  }
}

// -------------------------------------------------------------
// PACKAGES (CRUD)
// -------------------------------------------------------------

export async function getPackages(): Promise<Package[]> {
  await initializeDatabase();
  const db = await getDb();

  // Get active destination titles
  const activeDests = await db
    .collection('destinations')
    .find({}, { projection: { _id: 0, title: 1 } })
    .toArray();
  const activeTitles = activeDests.map((d: any) => String(d.title || '').toLowerCase().trim()).filter(Boolean);

  const docs = await db
    .collection('packages')
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  if (activeTitles.length > 0) {
    // Check for orphaned packages whose destinations no longer exist
    const orphanedIds: string[] = [];
    const validPackages: Package[] = [];

    for (const pkg of docs as any[]) {
      const destName = String(pkg.destination || '').toLowerCase().trim();
      if (activeTitles.includes(destName)) {
        validPackages.push(pkg);
      } else {
        orphanedIds.push(pkg.id);
      }
    }

    // Auto-purge orphaned packages from DB so deleted destinations never linger
    if (orphanedIds.length > 0) {
      await db.collection('packages').deleteMany({ id: { $in: orphanedIds } });
    }

    return validPackages;
  }

  return docs as unknown as Package[];
}

export async function getPackageById(id: string): Promise<Package | null> {
  await initializeDatabase();
  const db = await getDb();
  const safeId = String(id).trim();
  const doc = await db.collection('packages').findOne({ id: safeId }, { projection: { _id: 0 } });
  return (doc as unknown as Package) || null;
}

export async function getPackagesByDestination(destination: string): Promise<Package[]> {
  await initializeDatabase();
  const db = await getDb();
  const safeDest = String(destination).trim().toLowerCase();
  const docs = await db
    .collection('packages')
    .find(
      { destination: { $regex: new RegExp(`^${safeDest}$`, 'i') } },
      { projection: { _id: 0 } }
    )
    .sort({ createdAt: -1 })
    .toArray();
  return docs as unknown as Package[];
}

export async function addPackage(newPackage: Omit<Package, 'id'>): Promise<Package> {
  await initializeDatabase();
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
  try {
    await db.collection('destinations').updateOne(
      { title: { $regex: new RegExp(`^${newPackage.destination}$`, 'i') } },
      { $inc: { toursCount: 1 } }
    );
  } catch (e) {
    console.error('Failed to update destination count:', e);
  }

  // Return clean package without MongoDB _id
  const { _id, ...cleanPkg } = pkgWithId as any;
  return cleanPkg as Package;
}

export async function updatePackage(id: string, updates: Partial<Package>): Promise<Package | null> {
  await initializeDatabase();
  const db = await getDb();
  const safeId = String(id).trim();

  const updateDoc = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const res = await db.collection('packages').findOneAndUpdate(
    { id: safeId },
    { $set: updateDoc },
    { returnDocument: 'after', projection: { _id: 0 } }
  );

  return (res as unknown as Package) || null;
}

export async function deletePackage(id: string): Promise<boolean> {
  await initializeDatabase();
  const db = await getDb();
  const safeId = String(id).trim();

  // Find package first to decrement destination count
  const existing = await db.collection('packages').findOne({ id: safeId });
  const result = await db.collection('packages').deleteOne({ id: safeId });

  if (result.deletedCount > 0 && existing?.destination) {
    try {
      await db.collection('destinations').updateOne(
        { title: { $regex: new RegExp(`^${existing.destination}$`, 'i') } },
        { $inc: { toursCount: -1 } }
      );
    } catch (e) {
      console.error('Failed to decrement tours count:', e);
    }
    // Also remove from wishlists
    await db.collection('wishlist').deleteMany({ packageId: safeId });
    return true;
  }

  return result.deletedCount > 0;
}

// -------------------------------------------------------------
// DESTINATIONS (CRUD)
// -------------------------------------------------------------

export async function getDestinations(): Promise<Destination[]> {
  await initializeDatabase();
  const db = await getDb();
  const docs = await db
    .collection('destinations')
    .find({}, { projection: { _id: 0 } })
    .toArray();
  return docs as unknown as Destination[];
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  await initializeDatabase();
  const db = await getDb();
  const safeId = String(id).trim().toLowerCase();
  const doc = await db.collection('destinations').findOne(
    { $or: [{ id: safeId }, { title: { $regex: new RegExp(`^${safeId}$`, 'i') } }] },
    { projection: { _id: 0 } }
  );
  return (doc as unknown as Destination) || null;
}

export async function addDestination(
  newDest: Omit<Destination, 'id' | 'toursCount'>
): Promise<Destination> {
  await initializeDatabase();
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

  // Count current packages for this destination
  const currentCount = await db.collection('packages').countDocuments({
    destination: { $regex: new RegExp(`^${newDest.title}$`, 'i') },
  });

  const destWithId: Destination = {
    ...newDest,
    id,
    toursCount: currentCount,
    createdAt: new Date().toISOString(),
  };

  await db.collection('destinations').insertOne(destWithId as any);

  const { _id, ...cleanDest } = destWithId as any;
  return cleanDest as Destination;
}

export async function updateDestination(
  id: string,
  updates: Partial<Destination>
): Promise<Destination | null> {
  await initializeDatabase();
  const db = await getDb();
  const safeId = String(id).trim();

  const res = await db.collection('destinations').findOneAndUpdate(
    { id: safeId },
    { $set: updates },
    { returnDocument: 'after', projection: { _id: 0 } }
  );

  return (res as unknown as Destination) || null;
}

export async function deleteDestination(id: string): Promise<boolean> {
  await initializeDatabase();
  const db = await getDb();
  const safeId = String(id).trim();

  // Find destination first to get title
  const dest = await db.collection('destinations').findOne({ id: safeId });
  const result = await db.collection('destinations').deleteOne({ id: safeId });

  if (result.deletedCount > 0 && dest?.title) {
    // Cascade delete packages belonging to this deleted destination
    await db.collection('packages').deleteMany({
      destination: { $regex: new RegExp(`^${dest.title}$`, 'i') }
    });
  }

  return result.deletedCount > 0;
}

// -------------------------------------------------------------
// ORDERS (CRUD)
// -------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  await initializeDatabase();
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
  await initializeDatabase();
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

export async function updateOrderStatus(
  id: string,
  status: Order['status']
): Promise<Order | null> {
  await initializeDatabase();
  const db = await getDb();
  const safeId = String(id).trim();

  const res = await db.collection('orders').findOneAndUpdate(
    { id: safeId },
    { $set: { status } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );

  return (res as unknown as Order) || null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  await initializeDatabase();
  const db = await getDb();
  const safeId = String(id).trim();
  const res = await db.collection('orders').deleteOne({ id: safeId });
  return res.deletedCount > 0;
}

// -------------------------------------------------------------
// PREFERENCES
// -------------------------------------------------------------

export async function getPreferences(): Promise<PreferenceOption[]> {
  await initializeDatabase();
  const db = await getDb();
  const docs = await db
    .collection('preferences')
    .find({}, { projection: { _id: 0 } })
    .toArray();
  return (docs as unknown as PreferenceOption[]) || DEFAULT_PREFERENCES;
}

export async function addPreference(
  newPref: Omit<PreferenceOption, 'id'>
): Promise<PreferenceOption> {
  await initializeDatabase();
  const db = await getDb();

  const id = newPref.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const existing = await db.collection('preferences').findOne({
    $or: [{ id }, { label: { $regex: new RegExp(`^${newPref.label}$`, 'i') } }],
  });

  if (existing) {
    const { _id, ...cleanExisting } = existing as any;
    return cleanExisting as PreferenceOption;
  }

  const prefWithId: PreferenceOption = { ...newPref, id, isCustom: true };
  await db.collection('preferences').insertOne(prefWithId as any);

  const { _id, ...cleanPref } = prefWithId as any;
  return cleanPref as PreferenceOption;
}

// -------------------------------------------------------------
// WISHLIST (Database Stored)
// -------------------------------------------------------------

export async function getWishlist(userId: string): Promise<Package[]> {
  await initializeDatabase();
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
    .find({ id: { $in: packageIds } }, { projection: { _id: 0 } })
    .toArray();

  return packages as unknown as Package[];
}

export async function addToWishlist(userId: string, packageId: string): Promise<boolean> {
  await initializeDatabase();
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
  await initializeDatabase();
  const db = await getDb();
  const safeUser = String(userId).trim();
  const safePkg = String(packageId).trim();

  const res = await db.collection('wishlist').deleteOne({ userId: safeUser, packageId: safePkg });
  return res.deletedCount > 0;
}

export async function isWishlisted(userId: string, packageId: string): Promise<boolean> {
  await initializeDatabase();
  const db = await getDb();
  const safeUser = String(userId).trim();
  const safePkg = String(packageId).trim();

  const count = await db.collection('wishlist').countDocuments({ userId: safeUser, packageId: safePkg });
  return count > 0;
}

// -------------------------------------------------------------
// DATABASE STORED MEDIA / IMAGES
// -------------------------------------------------------------

export async function saveImageToDb(
  buffer: Buffer,
  contentType = 'image/jpeg',
  filename = 'image.jpg'
): Promise<string> {
  await initializeDatabase();
  const db = await getDb();

  const id = `img-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const base64 = buffer.toString('base64');

  await db.collection('images').insertOne({
    id,
    data: base64,
    contentType,
    filename,
    size: buffer.length,
    createdAt: new Date().toISOString(),
  });

  return `/api/images/${id}`;
}

export async function getImageFromDb(
  id: string
): Promise<{ data: Buffer; contentType: string } | null> {
  await initializeDatabase();
  const db = await getDb();
  const safeId = String(id).trim();

  const doc = await db.collection('images').findOne({ id: safeId });
  if (!doc || !doc.data) return null;

  return {
    data: Buffer.from(doc.data, 'base64'),
    contentType: doc.contentType || 'image/jpeg',
  };
}
