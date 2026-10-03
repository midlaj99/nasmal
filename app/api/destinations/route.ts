import { NextResponse } from 'next/server';
import { getDestinations, addDestination } from '@/lib/db';

export async function GET() {
  const destinations = await getDestinations();
  return NextResponse.json(destinations);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newDestination = await addDestination(body);
    return NextResponse.json(newDestination, { status: 201 });
  } catch (error) {
    console.error('Error adding destination:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
