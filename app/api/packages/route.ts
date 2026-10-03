import { NextResponse } from 'next/server';
import { getPackages, addPackage } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination');
  
  const packages = await getPackages();
  
  if (destination) {
    const filtered = packages.filter(pkg => pkg.destination.toLowerCase() === destination.toLowerCase());
    return NextResponse.json(filtered);
  }
  
  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.destination || !body.price || !body.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newPackage = await addPackage(body);
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error('Error adding package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
