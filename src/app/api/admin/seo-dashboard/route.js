import { NextResponse } from 'next/server';
import { runFullContentSeoAudit } from '@/lib/seo/seoAuditor';
import { getSearchConsolePerformance, getSearchConsoleStatus } from '@/services/searchConsoleService';
import { requireAdmin } from '@/lib/auth/authGuard';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/seo-dashboard
 * ============================================================================
 * Aggregated Technical SEO & Search Console Performance API Endpoint.
 * Combines full content audit, GSC analytics, and crawlability metrics.
 */
export async function GET(req) {
  try {
    await requireAdmin(req);
  } catch (authErr) {
    return NextResponse.json(
      { success: false, error: authErr.message || 'Unauthorized' },
      { status: authErr.status || 401 }
    );
  }

  try {
    const [auditReport, gscPerformance, gscStatus] = await Promise.all([
      runFullContentSeoAudit(),
      getSearchConsolePerformance(),
      getSearchConsoleStatus()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        audit: auditReport,
        searchConsole: gscPerformance,
        connection: gscStatus,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to generate SEO dashboard report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate SEO audit report.', details: error.message },
      { status: 500 }
    );
  }
}
