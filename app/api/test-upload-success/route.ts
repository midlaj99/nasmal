import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    await unlink(join(process.cwd(), 'app', 'api', 'test-upload-success', 'route.ts'));
  } catch {}
  return NextResponse.json({ cleaned: true });
}
