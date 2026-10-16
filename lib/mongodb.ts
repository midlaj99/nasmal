import { MongoClient, Db } from 'mongodb';

const DIRECT_ATLAS_URI = 'mongodb://nasmaltourism_db_user:Nasmaldiya123@ac-y4ckc6u-shard-00-00.ac74uw1.mongodb.net:27017,ac-y4ckc6u-shard-00-01.ac74uw1.mongodb.net:27017,ac-y4ckc6u-shard-00-02.ac74uw1.mongodb.net:27017/nasmal_tourism?ssl=true&replicaSet=atlas-787a4g-shard-0&authSource=admin&retryWrites=true&w=majority';

let envUri = process.env.MONGODB_URI || '';
// Bypass DNS SRV ECONNREFUSED in environments where SRV records fail
if (!envUri || envUri.startsWith('mongodb+srv://')) {
  envUri = DIRECT_ATLAS_URI;
}

const uri = envUri;
const dbName = process.env.MONGODB_DB || 'nasmal_tourism';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClient(uriString: string): MongoClient {
  return new MongoClient(uriString, {
    tls: true,
    autoSelectFamily: false,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 15000,
    maxPoolSize: 100, // High-throughput connection pool to handle thousands of concurrent Dubai customers
    minPoolSize: 5,   // Keep hot connections ready for zero-latency queries
    maxIdleTimeMS: 60000,
    waitQueueTimeoutMS: 10000,
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
    console.error('MongoDB connection retry needed:', err?.message || err);
    try {
      const freshClient = createClient(uri);
      const connectedClient = await freshClient.connect();
      global._mongoClientPromise = Promise.resolve(connectedClient);
      clientPromise = global._mongoClientPromise;
      return connectedClient.db(dbName);
    } catch (retryErr: any) {
      console.error('MongoDB critical connection failure:', retryErr?.message || retryErr);
      throw retryErr;
    }
  }
}

export default clientPromise;
