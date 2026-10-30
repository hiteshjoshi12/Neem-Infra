import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { requireAdmin } from '@/lib/auth/authGuard';
import { revalidateSectionContent } from '@/lib/cache/revalidateHelper';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { pageKey } = await params;
    const record = await SectionContent.findOne({ sectionKey: pageKey }).lean();

    if (!record) {
      return NextResponse.json({ success: false, message: `Page/Section '${pageKey}' not found` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: record.data,
      pageKey: record.sectionKey,
      updatedAt: record.updatedAt
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const { pageKey } = await params;
    const body = await req.json();
    const { data, title } = body;

    if (!data) {
      return NextResponse.json({ success: false, message: 'Please provide page/section data' }, { status: 400 });
    }

    const updatedRecord = await SectionContent.findOneAndUpdate(
      { sectionKey: pageKey },
      {
        $set: {
          sectionKey: pageKey,
          title: title || pageKey,
          data,
          lastUpdatedBy: admin.name || 'Admin'
        }
      },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    await revalidateSectionContent(pageKey);

    return NextResponse.json({
      success: true,
      message: `Page content for '${pageKey}' updated successfully`,
      data: updatedRecord.data,
      pageKey: updatedRecord.sectionKey
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
