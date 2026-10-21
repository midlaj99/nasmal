import { MongoClient, Db } from 'mongodb';

const DIRECT_ATLAS_URI = 'mongodb://nasmaltourism_db_user:Nasmaldiya123@ac-y4ckc6u-shard-00-00.ac74uw1.mongodb.net:27017,ac-y4ckc6u-shard-00-01.ac74uw1.mongodb.net:27017,ac-y4ckc6u-shard-00-02.ac74uw1.mongodb.net:27017/nasmal_tourism?ssl=true&replicaSet=atlas-787a4g-shard-0&authSource=admin&retryWrites=true&w=majority';

function cleanUri(val?: string | null): string {
  if (!val) return '';
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

const envUri = cleanUri(process.env.MONGODB_URI);
const primaryUri = envUri || DIRECT_ATLAS_URI;
const dbName = process.env.MONGODB_DB || 'nasmal_tourism';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

function getClientOptions(uriString: string) {
  const isSrv = uriString.startsWith('mongodb+srv://');
  return {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    maxPoolSize: 10,
    ...(isSrv ? {} : { tls: true }),
  };
}

async function connectToMongo(uriString: string): Promise<MongoClient> {
  const client = new MongoClient(uriString, getClientOptions(uriString));
  return await client.connect();
}

/**
 * Returns the active MongoDB Database instance with automatic reconnect and fallback
 */
export async function getDb(): Promise<Db> {
  // 1. If we already have a connected client in this container, verify it's responsive
  if (global._mongoClient) {
    try {
      await global._mongoClient.db(dbName).command({ ping: 1 });
      return global._mongoClient.db(dbName);
    } catch {
      // Socket was closed or timed out in frozen serverless container; reset and reconnect
      global._mongoClient = undefined;
      global._mongoClientPromise = undefined;
    }
  }

  // 2. Attempt connection with primary URI (configured in Vercel)
  try {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connectToMongo(primaryUri);
    }
    const client = await global._mongoClientPromise;
    global._mongoClient = client;
    return client.db(dbName);
  } catch (primaryErr: any) {
    console.error('MongoDB primary URI connection error:', primaryErr?.message || primaryErr);
    global._mongoClientPromise = undefined;
    global._mongoClient = undefined;

    // 3. If custom MONGODB_URI failed and is different from DIRECT_ATLAS_URI, try fallback
    if (primaryUri !== DIRECT_ATLAS_URI) {
      try {
        console.warn('Attempting fallback to DIRECT_ATLAS_URI...');
        const fallbackClient = await connectToMongo(DIRECT_ATLAS_URI);
        global._mongoClient = fallbackClient;
        global._mongoClientPromise = Promise.resolve(fallbackClient);
        return fallbackClient.db(dbName);
      } catch (fallbackErr: any) {
        console.error('MongoDB fallback connection also failed:', fallbackErr?.message || fallbackErr);
      }
    }

    throw new Error(
      `Database connection failed: ${primaryErr?.message || 'Check MONGODB_URI and verify IP Whitelist (0.0.0.0/0) in MongoDB Atlas'}`
    );
  }
}

// Global promise export for next-auth or custom plugins
if (!global._mongoClientPromise) {
  global._mongoClientPromise = connectToMongo(primaryUri).catch(() => {
    if (primaryUri !== DIRECT_ATLAS_URI) {
      return connectToMongo(DIRECT_ATLAS_URI);
    }
    throw new Error('Could not establish initial MongoDB connection');
  });
}

export default global._mongoClientPromise;
