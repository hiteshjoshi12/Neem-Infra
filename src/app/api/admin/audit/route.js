import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth/authGuard';
import AuditLog from '@/models/AuditLog';
import SeoSettings from '@/models/SeoSettings';
import BusinessProfile from '@/models/BusinessProfile';
import Page from '@/models/Page';
import Property from '@/models/Property';
import BlogPost from '@/models/BlogPost';
import Redirect from '@/models/Redirect';
import SectionContent from '@/models/SectionContent';
import Testimonial from '@/models/Testimonial';
import Author from '@/models/Author';

export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get('entityType');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const query = {};
    if (entityType) query.entityType = entityType;

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const body = await req.json();
    const { action, auditId } = body;

    if (action === 'rollback') {
      if (!auditId) {
        return NextResponse.json(
          { success: false, message: 'Missing auditId for rollback' },
          { status: 400 }
        );
      }

      const logToRevert = await AuditLog.findById(auditId);
      if (!logToRevert) {
        return NextResponse.json(
          { success: false, message: 'Audit log entry not found' },
          { status: 404 }
        );
      }

      const { entityType, entityId, previousState } = logToRevert;
      if (!previousState) {
        return NextResponse.json(
          { success: false, message: 'No previous state recorded in this audit log to restore' },
          { status: 400 }
        );
      }

      let restoredDoc = null;
      const modelMap = {
        SeoSettings,
        BusinessProfile,
        Page,
        Property,
        BlogPost,
        Redirect,
        SectionContent,
        Testimonial,
        Author,
      };

      const Model = modelMap[entityType];
      if (!Model) {
        return NextResponse.json(
          { success: false, message: `Unsupported entity type: ${entityType}` },
          { status: 400 }
        );
      }

      // Restore previous state
      if (entityType === 'SeoSettings') {
        restoredDoc = await SeoSettings.findOneAndUpdate(
          { singletonKey: 'global_seo_settings' },
          { $set: previousState },
          { returnDocument: 'after' }
        );
        revalidateTag('settings');
        revalidatePath('/', 'layout');
        revalidatePath('/robots.txt');
        revalidatePath('/sitemap.xml');
      } else if (entityType === 'BusinessProfile') {
        restoredDoc = await BusinessProfile.findOneAndUpdate(
          { singletonKey: 'primary_business_profile' },
          { $set: previousState },
          { returnDocument: 'after' }
        );
        revalidateTag('business_profile');
        revalidatePath('/', 'layout');
      } else if (entityType === 'SectionContent') {
        restoredDoc = await SectionContent.findOneAndUpdate(
          { sectionKey: entityId },
          { $set: previousState },
          { returnDocument: 'after' }
        );
        revalidateTag('sections');
        revalidatePath('/', 'layout');
      } else {
        restoredDoc = await Model.findByIdAndUpdate(
          entityId,
          { $set: previousState },
          { returnDocument: 'after' }
        );
        if (entityType === 'Property') revalidateTag('properties');
        if (entityType === 'BlogPost') revalidateTag('blog');
        if (entityType === 'Testimonial') revalidateTag('testimonials');
        if (entityType === 'Author') revalidateTag('team');
        if (entityType === 'Redirect') revalidateTag('redirects');
        revalidatePath('/', 'layout');
      }

      // Record rollback event
      await AuditLog.create({
        entityType,
        entityId: String(entityId),
        action: 'rollback',
        description: `Rolled back to state before audit event ${auditId}`,
        previousState: logToRevert.newState,
        newState: previousState,
        modifiedBy: admin.name || admin.email || 'Admin',
      });

      return NextResponse.json({
        success: true,
        message: `Successfully rolled back ${entityType} (${entityId})`,
        data: restoredDoc,
      });
    }

    // Default POST: record an audit entry
    const newLog = await AuditLog.create({
      entityType: body.entityType,
      entityId: String(body.entityId),
      action: body.action || 'update',
      description: body.description || '',
      previousState: body.previousState || null,
      newState: body.newState || null,
      modifiedBy: admin.name || admin.email || 'Admin',
    });

    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status || 500 }
    );
  }
}
