import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync('git status -s', { cwd: process.cwd() });
    return NextResponse.json({ status: stdout });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
