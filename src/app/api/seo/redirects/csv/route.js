import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import { requireAdmin } from '@/lib/auth/authGuard';
import { normalizePath } from '@/lib/seo/metadataHelper';
import { invalidateRedirectLookupCache } from '@/app/api/seo/redirects/lookup/route';

/**
 * CSV Import & Export API for Technical SEO Redirects
 */

// ─── 1. Export Redirects to CSV (GET) ────────────────────────────────────────
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const redirects = await Redirect.find({}).sort({ createdAt: -1 }).lean();

    const headers = ['fromPath', 'toPath', 'statusCode', 'isActive', 'notes', 'hits', 'lastHitAt'];
    const rows = redirects.map((r) => [
      `"${r.fromPath || ''}"`,
      `"${r.toPath || ''}"`,
      r.statusCode || 301,
      r.isActive !== false ? 'true' : 'false',
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      r.hits || 0,
      r.lastHitAt ? `"${new Date(r.lastHitAt).toISOString()}"` : '""',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="saudagar_redirects_export.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.status || 500 });
  }
}

// ─── 2. Import Redirects from CSV (POST) ──────────────────────────────────────
export async function POST(req) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    const { csvData } = body;

    if (!csvData || typeof csvData !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: csvData string is required' },
        { status: 400 }
      );
    }

    const lines = csvData
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, message: 'CSV must contain a header row and at least one data row' },
        { status: 400 }
      );
    }

    const header = lines[0].toLowerCase().split(',').map((h) => h.replace(/["'\s]/g, ''));
    const fromIdx = header.indexOf('frompath');
    const toIdx = header.indexOf('topath');
    const statusIdx = header.indexOf('statuscode');
    const activeIdx = header.indexOf('isactive');
    const notesIdx = header.indexOf('notes');

    if (fromIdx === -1 || toIdx === -1) {
      return NextResponse.json(
        { success: false, message: "CSV header must contain 'fromPath' and 'toPath' columns" },
        { status: 400 }
      );
    }

    let importedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Basic CSV column split respecting quotes
      const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      const cleanCols = cols.map((c) => c.replace(/^"|"$/g, '').trim());

      const rawFrom = cleanCols[fromIdx];
      const rawTo = cleanCols[toIdx];
      const rawStatus = statusIdx !== -1 ? parseInt(cleanCols[statusIdx], 10) : 301;
      const rawActive = activeIdx !== -1 ? cleanCols[activeIdx].toLowerCase() !== 'false' : true;
      const rawNotes = notesIdx !== -1 ? cleanCols[notesIdx] : 'Bulk CSV Import';

      if (!rawFrom || !rawTo) {
        skippedCount++;
        continue;
      }

      const fromPath = normalizePath(rawFrom);
      const toPath = rawTo.startsWith('http') ? rawTo : normalizePath(rawTo);

      if (fromPath === toPath) {
        errors.push(`Row ${i + 1}: Self-redirect loop detected for '${fromPath}'`);
        skippedCount++;
        continue;
      }

      try {
        await Redirect.findOneAndUpdate(
          { fromPath },
          {
            $set: {
              fromPath,
              toPath,
              statusCode: rawStatus === 302 ? 302 : (rawStatus === 410 ? 410 : 301),
              isActive: rawActive,
              notes: rawNotes,
              createdBy: admin.name || admin.email || 'CSV Import',
            },
          },
          { upsert: true, new: true }
        );
        importedCount++;
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err.message}`);
        skippedCount++;
      }
    }

    invalidateRedirectLookupCache();
    try {
      const { revalidateTag } = await import('next/cache');
      revalidateTag('redirects');
    } catch {}

    return NextResponse.json({
      success: true,
      message: `CSV import completed: ${importedCount} processed, ${skippedCount} skipped.`,
      importedCount,
      skippedCount,
      errors: errors.slice(0, 10),
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.status || 500 });
  }
}
