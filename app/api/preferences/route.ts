import { NextResponse } from 'next/server';
import { getPreferences, addPreference } from '@/lib/db';

export async function GET() {
  try {
    const preferences = await getPreferences();
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.label || typeof body.label !== 'string') {
      return NextResponse.json({ error: 'Title/Label is required' }, { status: 400 });
    }
    
    const icon = body.icon && typeof body.icon === 'string' ? body.icon.trim() : '🏷️';
    const label = body.label.trim();
    
    const newPref = await addPreference({ label, icon });
    return NextResponse.json(newPref, { status: 201 });
  } catch (error) {
    console.error('Error adding preference:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
