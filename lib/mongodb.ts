import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://nasmaltourism_db_user:Nasmaldiya123@cluster0.ac74uw1.mongodb.net/nasmal_tourism?retryWrites=true&w=majority&appName=Cluster0';
const dbName = process.env.MONGODB_DB || 'nasmal_tourism';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

function createClient(uriString: string): MongoClient {
  return new MongoClient(uriString, {
    tls: true,
    tlsAllowInvalidCertificates: true, // Resolves local OpenSSL 3.0 / Windows SSL alert 80 proxy interception
    tlsAllowInvalidHostnames: true,
    autoSelectFamily: false,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 20000,
    maxPoolSize: 20,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
  });
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = createClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = createClient(uri);
  clientPromise = client.connect();
}

/**
 * Returns the MongoDB Database instance with automatic retry if disconnected
 */
export async function getDb(): Promise<Db> {
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (err: any) {
    // If the cached promise rejected (e.g. temporary network/TLS handshake reset),
    // recreate the client promise and retry once
    console.error('Initial MongoDB connection error:', err?.message || err);
    try {
      const freshClient = createClient(uri);
      const connectedClient = await freshClient.connect();
      if (process.env.NODE_ENV === 'development') {
        global._mongoClientPromise = Promise.resolve(connectedClient);
      }
      return connectedClient.db(dbName);
    } catch (retryErr: any) {
      console.error('MongoDB retry connection error:', retryErr?.message || retryErr);
      throw retryErr;
    }
  }
}

export default clientPromise;
