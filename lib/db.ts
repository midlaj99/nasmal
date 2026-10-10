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
  suitableFor?: string[];
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

const packagesFilePath = path.join(process.cwd(), 'data', 'packages.json');
const destinationsFilePath = path.join(process.cwd(), 'data', 'destinations.json');
const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');
const preferencesFilePath = path.join(process.cwd(), 'data', 'preferences.json');

// Initialize the file if it doesn't exist
async function ensureDbExists() {
  try {
    await fs.access(packagesFilePath);
  } catch (error) {
    await fs.mkdir(path.dirname(packagesFilePath), { recursive: true });
    await fs.writeFile(packagesFilePath, JSON.stringify([]));
  }

  try {
    await fs.access(destinationsFilePath);
  } catch (error) {
    await fs.writeFile(destinationsFilePath, JSON.stringify([]));
  }

  try {
    await fs.access(ordersFilePath);
  } catch (error) {
    await fs.writeFile(ordersFilePath, JSON.stringify([]));
  }

  try {
    await fs.access(preferencesFilePath);
  } catch (error) {
    await fs.writeFile(preferencesFilePath, JSON.stringify(DEFAULT_PREFERENCES, null, 2));
  }
}

export async function getPackages(): Promise<Package[]> {
  await ensureDbExists();
  const fileData = await fs.readFile(packagesFilePath, 'utf8');
  try {
    return JSON.parse(fileData) as Package[];
  } catch (error) {
    return [];
  }
}

export async function getDestinations(): Promise<Destination[]> {
  await ensureDbExists();
  const fileData = await fs.readFile(destinationsFilePath, 'utf8');
  try {
    return JSON.parse(fileData) as Destination[];
  } catch (error) {
    return [];
  }
}

export async function getOrders(): Promise<Order[]> {
  await ensureDbExists();
  const fileData = await fs.readFile(ordersFilePath, 'utf8');
  try {
    return JSON.parse(fileData) as Order[];
  } catch (error) {
    return [];
  }
}

export async function getPackagesByDestination(destination: string): Promise<Package[]> {
  const allPackages = await getPackages();
  return allPackages.filter(pkg => 
    pkg.destination.toLowerCase() === destination.toLowerCase()
  );
}

export async function getPackageById(id: string): Promise<Package | null> {
  const allPackages = await getPackages();
  return allPackages.find(pkg => pkg.id === id) || null;
}

export async function addPackage(newPackage: Omit<Package, 'id'>): Promise<Package> {
  const allPackages = await getPackages();
  
  // Generate a URL-friendly ID from the title
  const id = newPackage.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  const pkgWithId = { ...newPackage, id };
  
  // Check if ID already exists, append random string if so
  if (allPackages.some(pkg => pkg.id === id)) {
    pkgWithId.id = `${id}-${Math.floor(Math.random() * 1000)}`;
  }
  
  allPackages.push(pkgWithId);
  await fs.writeFile(packagesFilePath, JSON.stringify(allPackages, null, 2));
  
  return pkgWithId;
}

export async function updatePackage(id: string, updates: Partial<Package>): Promise<Package | null> {
  const allPackages = await getPackages();
  const index = allPackages.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedPackage = { ...allPackages[index], ...updates };
  allPackages[index] = updatedPackage;
  
  await fs.writeFile(packagesFilePath, JSON.stringify(allPackages, null, 2));
  return updatedPackage;
}

export async function deletePackage(id: string): Promise<boolean> {
  const allPackages = await getPackages();
  const index = allPackages.findIndex(p => p.id === id);
  if (index === -1) return false;
  allPackages.splice(index, 1);
  await fs.writeFile(packagesFilePath, JSON.stringify(allPackages, null, 2));
  return true;
}

export async function addDestination(newDest: Omit<Destination, 'id' | 'toursCount'>): Promise<Destination> {
  const allDestinations = await getDestinations();
  
  const id = newDest.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
    
  const destWithId = { ...newDest, id, toursCount: 0 };
  
  allDestinations.push(destWithId);
  await fs.writeFile(destinationsFilePath, JSON.stringify(allDestinations, null, 2));
  
  return destWithId;
}

export async function updateDestination(id: string, updates: Partial<Destination>): Promise<Destination | null> {
  const allDestinations = await getDestinations();
  const index = allDestinations.findIndex(d => d.id === id);
  if (index === -1) return null;
  const updatedDest = { ...allDestinations[index], ...updates };
  allDestinations[index] = updatedDest;
  await fs.writeFile(destinationsFilePath, JSON.stringify(allDestinations, null, 2));
  return updatedDest;
}

export async function deleteDestination(id: string): Promise<boolean> {
  const allDestinations = await getDestinations();
  const index = allDestinations.findIndex(d => d.id === id);
  if (index === -1) return false;
  allDestinations.splice(index, 1);
  await fs.writeFile(destinationsFilePath, JSON.stringify(allDestinations, null, 2));
  return true;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  const allOrders = await getOrders();
  
  const id = `ord-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  
  const newOrder: Order = {
    ...orderData,
    id,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  allOrders.push(newOrder);
  await fs.writeFile(ordersFilePath, JSON.stringify(allOrders, null, 2));
  
  return newOrder;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const allOrders = await getOrders();
  const index = allOrders.findIndex(o => o.id === id);
  
  if (index === -1) {
    return null;
  }
  
  allOrders[index].status = status;
  await fs.writeFile(ordersFilePath, JSON.stringify(allOrders, null, 2));
  
  return allOrders[index];
}

export async function getPreferences(): Promise<PreferenceOption[]> {
  await ensureDbExists();
  const fileData = await fs.readFile(preferencesFilePath, 'utf8');
  try {
    const list = JSON.parse(fileData) as PreferenceOption[];
    return list.length > 0 ? list : DEFAULT_PREFERENCES;
  } catch (error) {
    return DEFAULT_PREFERENCES;
  }
}

export async function addPreference(newPref: Omit<PreferenceOption, 'id'>): Promise<PreferenceOption> {
  const allPrefs = await getPreferences();
  
  const id = newPref.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
    
  const existing = allPrefs.find(p => p.id === id || p.label.toLowerCase() === newPref.label.toLowerCase());
  if (existing) {
    return existing;
  }
  
  const prefWithId: PreferenceOption = { ...newPref, id, isCustom: true };
  allPrefs.push(prefWithId);
  await fs.writeFile(preferencesFilePath, JSON.stringify(allPrefs, null, 2));
  
  return prefWithId;
}
