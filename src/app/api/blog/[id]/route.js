import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Redirect from '@/models/Redirect';
import AuditLog from '@/models/AuditLog';
import { requireAdmin } from '@/lib/auth/authGuard';
import { clearBlogCache } from '@/services/blogService';
import { revalidateBlogPost } from '@/lib/cache/revalidateHelper';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const post = await BlogPost.findById(id)
      .populate('author', 'name slug avatar bio')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate('location', 'name slug')
      .populate('propertyType', 'name slug')
      .lean();

    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
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

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    const isAutosave = Boolean(body._isAutosave);
    delete body._isAutosave;

    // Handle background autosave requests safely without overwriting live published articles
    if (isAutosave) {
      if (existingPost.status === 'published') {
        const draftRevision = {
          title: body.title !== undefined ? body.title : existingPost.title,
          slug: body.slug !== undefined ? body.slug : existingPost.slug,
          excerpt: body.excerpt !== undefined ? body.excerpt : existingPost.excerpt,
          content: body.content !== undefined ? body.content : existingPost.content,
          savedAt: new Date()
        };
        await BlogPost.updateOne({ _id: id }, { $set: { draftRevision } }, { timestamps: false });
        return NextResponse.json({
          success: true,
          message: 'Draft revision auto-saved safely without altering live publication',
          isDraftRevision: true,
          savedAt: draftRevision.savedAt
        });
      } else {
        const post = await BlogPost.findByIdAndUpdate(id, body, {
          new: true,
          runValidators: false,
          timestamps: false
        });
        clearBlogCache();
        return NextResponse.json({
          success: true,
          message: 'Draft post auto-saved successfully',
          data: post
        });
      }
    }

    // Explicit publish or update clears pending draft revision
    body.draftRevision = null;

    const previousState = existingPost.toObject();

    // Ensure slug is never empty and check for slug change
    if (body.slug && body.slug.trim()) {
      const cleanSlug = body.slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      body.slug = cleanSlug;

      if (cleanSlug !== existingPost.slug && existingPost.slug) {
        try {
          await Redirect.findOneAndUpdate(
            { fromPath: `/blog/${existingPost.slug}` },
            {
              $set: {
                fromPath: `/blog/${existingPost.slug}`,
                toPath: `/blog/${cleanSlug}`,
                statusCode: 301,
                isActive: true,
                notes: `Auto-generated redirect on blog slug change from '${existingPost.slug}' to '${cleanSlug}'`,
                createdBy: admin.name || 'System',
              },
            },
            { upsert: true }
          );
        } catch (redirErr) {
          console.warn('[Auto-Redirect] Error creating redirect on blog slug change:', redirErr?.message);
        }
      }
    } else if (body.title && !body.slug) {
      body.slug = body.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const post = await BlogPost.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    // Record audit log
    try {
      await AuditLog.create({
        entityType: 'BlogPost',
        entityId: String(id),
        action: 'update',
        description: `Updated blog post: ${post.title}`,
        previousState,
        newState: post.toObject(),
        modifiedBy: admin.name || admin.email || 'Admin',
      });
    } catch (auditErr) {
      console.warn('[Audit] Failed to log blog update:', auditErr.message);
    }

    clearBlogCache();
    await revalidateBlogPost(post);

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    });
  } catch (error) {
    const status = error.status || 400;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();

    const { id } = await params;
    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    // Record audit log
    try {
      await AuditLog.create({
        entityType: 'BlogPost',
        entityId: String(id),
        action: 'delete',
        description: `Deleted blog post: ${post.title}`,
        previousState: post.toObject(),
        newState: null,
        modifiedBy: admin.name || admin.email || 'Admin',
      });
    } catch (auditErr) {
      console.warn('[Audit] Failed to log blog deletion:', auditErr.message);
    }

    clearBlogCache();
    await revalidateBlogPost(post);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
