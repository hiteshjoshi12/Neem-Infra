import { NextResponse } from 'next/server';
import { getOrphanAuditReport } from '@/services/blogService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = await getOrphanAuditReport();
    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating orphan report:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
