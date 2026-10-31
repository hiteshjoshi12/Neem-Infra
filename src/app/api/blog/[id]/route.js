import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Redirect from '@/models/Redirect';
import AuditLog from '@/models/AuditLog';
import { requireAdmin } from '@/lib/auth/authGuard';
import { getCached, setCached, invalidateCache } from '@/lib/cache/apiCache';
import { clearBlogCache } from '@/services/blogService';
import { revalidateBlogPost } from '@/lib/cache/revalidateHelper';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const post = await BlogPost.findOne(filter)
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

    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const existingPost = await BlogPost.findOne(filter);
    if (!existingPost) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    const postId = existingPost._id;
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
        await BlogPost.updateOne({ _id: postId }, { $set: { draftRevision } }, { timestamps: false });
        return NextResponse.json({
          success: true,
          message: 'Draft revision auto-saved safely without altering live publication',
          isDraftRevision: true,
          savedAt: draftRevision.savedAt
        });
      } else {
        const post = await BlogPost.findByIdAndUpdate(postId, body, {
          new: true,
          runValidators: false,
          timestamps: false
        });
        invalidateCache('blog');
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

    const post = await BlogPost.findByIdAndUpdate(postId, body, {
      new: true,
      runValidators: true,
    });

    // Record audit log
    try {
      await AuditLog.create({
        entityType: 'BlogPost',
        entityId: String(postId),
        action: 'update',
        description: `Updated blog post: ${post.title}`,
        previousState,
        newState: post.toObject(),
        modifiedBy: admin.name || admin.email || 'Admin',
      });
    } catch (auditErr) {
      console.warn('[Audit] Failed to log blog update:', auditErr.message);
    }

    invalidateCache('blog');
    invalidateCache();
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
    if (!id) {
      return NextResponse.json({ success: false, message: 'Article ID is required' }, { status: 400 });
    }

    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const post = await BlogPost.findOneAndDelete(filter);

    if (!post) {
      return NextResponse.json({ success: false, message: 'Article not found or already deleted' }, { status: 404 });
    }

    // Clean up references to this deleted article across other blog posts
    try {
      await BlogPost.updateMany(
        { $or: [{ relatedPosts: post._id }, { childArticles: post._id }, { parentPillar: post._id }] },
        { 
          $pull: { relatedPosts: post._id, childArticles: post._id },
          $unset: { parentPillar: 1, parentPillarSlug: 1 }
        }
      );
    } catch (cleanupErr) {
      console.warn('[Cleanup] Error unlinking deleted blog post references:', cleanupErr?.message);
    }

    // Record audit log safely
    try {
      await AuditLog.create({
        entityType: 'BlogPost',
        entityId: String(post._id || id),
        action: 'delete',
        description: `Deleted blog post: ${post.title}`,
        previousState: typeof post.toObject === 'function' ? post.toObject() : post,
        newState: null,
        modifiedBy: admin.name || admin.email || 'Admin',
      });
    } catch (auditErr) {
      console.warn('[Audit] Failed to log blog deletion:', auditErr.message);
    }

    // Comprehensive cache invalidation
    try {
      invalidateCache('blog');
      invalidateCache();
      clearBlogCache();
      await revalidateBlogPost(post);
    } catch (cacheErr) {
      console.warn('[Cache] Revalidation warning on blog deletion:', cacheErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
      data: { id: post._id, slug: post.slug }
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
