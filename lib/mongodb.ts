import { MongoClient, Db } from 'mongodb';

const DIRECT_ATLAS_URI = 'mongodb://nasmaltourism_db_user:Nasmaldiya123@ac-y4ckc6u-shard-00-00.ac74uw1.mongodb.net:27017,ac-y4ckc6u-shard-00-01.ac74uw1.mongodb.net:27017,ac-y4ckc6u-shard-00-02.ac74uw1.mongodb.net:27017/nasmal_tourism?ssl=true&replicaSet=atlas-787a4g-shard-0&authSource=admin&retryWrites=true&w=majority';

// Use the user's MONGODB_URI configured in Vercel environment variables, with fallback to DIRECT_ATLAS_URI
let rawEnvUri = (process.env.MONGODB_URI || '').trim();
// Strip surrounding single or double quotes if user accidentally pasted them in Vercel
if ((rawEnvUri.startsWith('"') && rawEnvUri.endsWith('"')) || (rawEnvUri.startsWith("'") && rawEnvUri.endsWith("'"))) {
  rawEnvUri = rawEnvUri.slice(1, -1).trim();
}

const uri = rawEnvUri || DIRECT_ATLAS_URI;
const dbName = process.env.MONGODB_DB || 'nasmal_tourism';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClient(uriString: string): MongoClient {
  const isSrv = uriString.startsWith('mongodb+srv://');
  return new MongoClient(uriString, {
    serverSelectionTimeoutMS: 6000,
    connectTimeoutMS: 7000,
    maxPoolSize: 20, // Optimized for serverless concurrency without exceeding Atlas M0 limits
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    ...(isSrv ? {} : { tls: true, autoSelectFamily: false }),
  });
}

// Global connection caching in both production and development for Next.js serverless/container runtimes
if (!global._mongoClientPromise) {
  client = createClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

/**
 * Returns the MongoDB Database instance with automatic retry if disconnected
 */
export async function getDb(): Promise<Db> {
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (err: any) {
    console.error('MongoDB primary connection error:', err?.message || err);
    global._mongoClientPromise = undefined;

    // If environment URI failed and is different from DIRECT_ATLAS_URI, try fallback
    const fallbackUri = uri !== DIRECT_ATLAS_URI ? DIRECT_ATLAS_URI : uri;

    try {
      const freshClient = createClient(fallbackUri);
      const connectedClient = await freshClient.connect();
      global._mongoClientPromise = Promise.resolve(connectedClient);
      clientPromise = global._mongoClientPromise;
      return connectedClient.db(dbName);
    } catch (retryErr: any) {
      global._mongoClientPromise = undefined;
      console.error('MongoDB connection failed completely:', retryErr?.message || retryErr);
      throw new Error(
        `Database connection failed: ${retryErr?.message || 'Check MONGODB_URI and verify IP Whitelist (0.0.0.0/0) in MongoDB Atlas Network Access'}`
      );
    }
  }
}

export default clientPromise;
