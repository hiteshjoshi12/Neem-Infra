import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { requireAdmin } from '@/lib/auth/authGuard';

// In-memory rate limiting map for inquiry spam prevention: ip -> timestamp[]
const inquiryRateLimits = new Map();
const MAX_INQUIRIES_PER_WINDOW = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const now = Date.now();

    // Rate limiting check
    const recentSubmissions = (inquiryRateLimits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
    if (recentSubmissions.length >= MAX_INQUIRIES_PER_WINDOW) {
      return NextResponse.json(
        { success: false, message: 'Too many inquiry submissions. Please contact us directly via telephone or WhatsApp.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 1. Honeypot Bot Trap: Reject silent automated bot spam
    if (body.website_hp || body.honeypot || body.company_fax) {
      return NextResponse.json({ success: true, message: 'Inquiry received' }, { status: 200 });
    }

    // 2. Strict Input Validation & Length Limits
    const rawEmail = (body.email || '').trim().toLowerCase();
    const rawName = (body.name || '').trim().slice(0, 100);
    const rawPhone = (body.phone || '').trim().slice(0, 30);
    const rawMessage = (body.message || '').trim().slice(0, 3000);
    const rawPropertyTitle = (body.propertyTitle || '').trim().slice(0, 200);
    const rawType = body.type || 'contact_form';

    if (!rawEmail) {
      return NextResponse.json({ success: false, message: 'A valid email address or phone is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail)) {
      return NextResponse.json({ success: false, message: 'Please provide a valid email format' }, { status: 400 });
    }

    await connectDB();

    const inquiry = await Inquiry.create({
      type: rawType,
      email: rawEmail,
      name: rawName,
      phone: rawPhone,
      message: rawMessage,
      propertyTitle: rawPropertyTitle,
      status: 'new'
    });

    // Record submission timestamp for IP
    recentSubmissions.push(now);
    inquiryRateLimits.set(ip, recentSubmissions);

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully',
      data: inquiry
    }, { status: 201 });
  } catch (error) {
    console.error('[API Error /api/inquiries]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

