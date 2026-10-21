import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rawEnv = (process.env.MONGODB_URI || '').trim();
  let sanitizedEnv = 'NOT CONFIGURED IN VERCEL';

  if (rawEnv) {
    try {
      const atIdx = rawEnv.indexOf('@');
      if (atIdx !== -1) {
        const protocol = rawEnv.split('://')[0];
        const host = rawEnv.substring(atIdx + 1);
        sanitizedEnv = `${protocol}://*****@${host}`;
      } else {
        sanitizedEnv = rawEnv.substring(0, 15) + '...';
      }
    } catch {
      sanitizedEnv = 'Configured (Masked)';
    }
  }

  let dbConnectionResult: any = {
    connected: false,
    error: null,
  };

  let collections: string[] = [];
  let packagesCount = 0;
  let destinationsCount = 0;

  try {
    const db = await getDb();
    const cols = await db.listCollections().toArray();
    collections = cols.map(c => c.name);
    packagesCount = await db.collection('packages').countDocuments();
    destinationsCount = await db.collection('destinations').countDocuments();
    dbConnectionResult.connected = true;
  } catch (err: any) {
    dbConnectionResult.connected = false;
    dbConnectionResult.error = err?.message || String(err);
    dbConnectionResult.errorName = err?.name;
    dbConnectionResult.code = err?.code;
  }

  return NextResponse.json({
    status: dbConnectionResult.connected ? 'HEALTHY' : 'DATABASE_DISCONNECTED',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    mongodbEnvConfigured: Boolean(rawEnv),
    mongodbUriSummary: sanitizedEnv,
    database: dbConnectionResult,
    stats: {
      collectionsFound: collections,
      packagesCount,
      destinationsCount,
    },
    quickHelp: !dbConnectionResult.connected
      ? 'Ensure 0.0.0.0/0 is active in Atlas Network Access, verify username/password in MONGODB_URI, and trigger a Redeploy in Vercel.'
      : 'Database is connected and functioning normally.',
  });
}
