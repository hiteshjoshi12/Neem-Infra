import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import Redirect from '@/models/Redirect';
import AuditLog from '@/models/AuditLog';
import { requireAdmin } from '@/lib/auth/authGuard';
import { revalidateProperty } from '@/lib/cache/revalidateHelper';

function normalizeArrayField(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
  if (typeof val === 'string') {
    return val
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const property = await Property.findById(id).lean();

    if (!property) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    const previousState = existingProperty.toObject();

    // Auto-redirect on slug change
    if (body.slug && body.slug.trim() && body.slug.trim() !== existingProperty.slug) {
      const oldSlug = existingProperty.slug;
      const newSlug = body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      body.slug = newSlug;

      try {
        await Redirect.findOneAndUpdate(
          { fromPath: `/properties/${oldSlug}` },
          {
            $set: {
              fromPath: `/properties/${oldSlug}`,
              toPath: `/properties/${newSlug}`,
              statusCode: 301,
              isActive: true,
              notes: `Auto-generated redirect on property slug change from '${oldSlug}' to '${newSlug}'`,
              createdBy: admin.name || 'System',
            },
          },
          { upsert: true }
        );
      } catch (redirErr) {
        console.warn('[Auto-Redirect] Error creating redirect on property slug change:', redirErr?.message);
      }
    }

    // Sanitize reraNumber to prevent marketing slogans from polluting the schema
    if (body.reraNumber !== undefined) {
      const rera = String(body.reraNumber).trim();
      if (rera.includes('Freehold') || rera.includes('Title') || rera.includes('Municipal') || rera.includes('Sanction')) {
        body.reraNumber = '';
      }
    }

    delete body._id;
    delete body.id;

    if (body.features !== undefined) body.features = normalizeArrayField(body.features);
    if (body.nearbyLandmarks !== undefined) body.nearbyLandmarks = normalizeArrayField(body.nearbyLandmarks);
    if (body.images !== undefined) body.images = normalizeArrayField(body.images);
    if (body.imagesAlt !== undefined) body.imagesAlt = normalizeArrayField(body.imagesAlt);

    const property = await Property.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    // Record audit log
    try {
      await AuditLog.create({
        entityType: 'Property',
        entityId: String(id),
        action: 'update',
        description: `Updated property: ${property.title}`,
        previousState,
        newState: property.toObject(),
        modifiedBy: admin.name || admin.email || 'Admin',
      });
    } catch (auditErr) {
      console.warn('[Audit] Failed to log property update:', auditErr.message);
    }

    await revalidateProperty(property);

    return NextResponse.json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    // Record audit log
    try {
      await AuditLog.create({
        entityType: 'Property',
        entityId: String(id),
        action: 'delete',
        description: `Deleted property: ${property.title}`,
        previousState: property.toObject(),
        newState: null,
        modifiedBy: admin.name || admin.email || 'Admin',
      });
    } catch (auditErr) {
      console.warn('[Audit] Failed to log property deletion:', auditErr.message);
    }

    await revalidateProperty(property);

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
