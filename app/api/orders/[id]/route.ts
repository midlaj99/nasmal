import { NextResponse } from 'next/server';
import { updateOrderStatus, deleteOrder } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`patch_order_${ip}`, { windowMs: 60000, max: 40 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const auth = await requireAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const resolvedParams = await params;
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];
    const matchedStatus = validStatuses.find(s => s.toLowerCase() === String(body.status).toLowerCase());

    if (!matchedStatus) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(resolvedParams.id, matchedStatus as any);

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`del_order_${ip}`, { windowMs: 60000, max: 40 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const auth = await requireAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const rawId = resolvedParams?.id || '';
    if (!rawId.trim()) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await deleteOrder(rawId);
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
