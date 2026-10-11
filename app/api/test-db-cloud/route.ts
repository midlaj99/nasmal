import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  const results: any = {
    mongo: { status: 'testing' },
    cloudinary: { status: 'testing' }
  };

  const uri = process.env.MONGODB_URI || 'mongodb+srv://nasmaltourism_db_user:Nasmaldiya123@cluster0.ac74uw1.mongodb.net/nasmal_tourism?retryWrites=true&w=majority&appName=Cluster0';
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'woe2kr5p';
  const apiKey = process.env.CLOUDINARY_API_KEY || 'nasmal';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'Y5gSgiAmpgItACkSKO2KFPIiqAY';

  // 1. Test Mongo
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    const db = client.db('nasmal_tourism');
    const ping = await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();
    await client.close();
    results.mongo = {
      status: 'success',
      ping,
      collections: collections.map(c => c.name)
    };
  } catch (err: any) {
    results.mongo = {
      status: 'error',
      message: err.message
    };
  }

  // 2. Test Cloudinary
  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });

    // Test upload of a 1x1 transparent png data uri
    const sampleImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAtdEVYdGRhdGU6Y3JlYXRlADIwMjYtMTAtMTFUMDI6MjI6MzQrMDA6MDDNlGgGAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI2LTEwLTExVDAyOjIyOjM0KzAwOjAw2n383wAAAABJRU5ErkJggg==';
    const uploadRes = await cloudinary.uploader.upload(sampleImage, {
      folder: 'nasmal_tests',
      public_id: `test_${Date.now()}`
    });

    results.cloudinary = {
      status: 'success',
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id
    };
  } catch (err: any) {
    results.cloudinary = {
      status: 'error',
      message: err.message
    };
  }

  return NextResponse.json(results);
}
