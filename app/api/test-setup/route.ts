import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  const filesToDelete = [
    join(process.cwd(), 'app', 'api', 'test-db-cloud', 'route.ts'),
    join(process.cwd(), 'app', 'api', 'test-cloud-preset', 'route.ts'),
    join(process.cwd(), 'app', 'api', 'check-git', 'route.ts'),
    join(process.cwd(), 'app', 'api', 'test-setup', 'route.ts'),
  ];

  for (const f of filesToDelete) {
    try {
      await unlink(f);
    } catch {}
  }

  return NextResponse.json({ success: true, message: 'Temporary test endpoints cleaned' });
}
