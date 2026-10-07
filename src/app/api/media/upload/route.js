import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { generateSeoImageFilename, validateAltText } from '@/lib/seo/imageSeoHelper';
import { requireAdmin } from '@/lib/auth/authGuard';

// Restrict uploads strictly to raster formats to prevent Stored XSS via executable SVGs
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/media/upload
 * ============================================================================
 * Handles media uploads with automatic SEO filename transformation.
 * Replaces generic camera filenames (e.g., IMG_83929.jpg) with descriptive,
 * localized real-estate keywords (e.g., dlf-phase-5-luxury-apartments-gurugram.webp).
 */
export async function POST(request) {
  try {
    await requireAdmin(request);
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title') || '';
    const locality = formData.get('locality') || 'Gurugram';
    const propertyType = formData.get('propertyType') || 'luxury-residence';
    const rawAlt = formData.get('alt') || '';

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'No image file provided in upload request.' },
        { status: 400 }
      );
    }

    // 1. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: `Unsupported image format (${file.type}). Allowed types: JPEG, PNG, WebP, AVIF.` 
        },
        { status: 400 }
      );
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit of 10MB.' },
        { status: 400 }
      );
    }

    // 3. Generate SEO Hyphenated Filename
    const originalExt = path.extname(file.name || '').replace('.', '') || 'webp';
    const seoFilename = generateSeoImageFilename({
      title,
      locality,
      propertyType,
      originalFilename: file.name,
      extension: originalExt
    });

    // 4. Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    await fs.mkdir(uploadDir, { recursive: true });

    // 5. Write file to disk
    const filePath = path.join(uploadDir, seoFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // 6. Generate or validate accessible alt text
    const defaultAlt = title 
      ? `${title} in ${locality}, Gurugram` 
      : `Luxury real estate development in ${locality}, Gurugram`;
    const finalAlt = rawAlt ? rawAlt.trim() : defaultAlt;
    const altValidation = validateAltText(finalAlt);

    const publicUrl = `/uploads/blog/${seoFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: seoFilename,
      originalName: file.name,
      alt: finalAlt,
      altValid: altValidation.isValid,
      altIssues: altValidation.issues,
      sizeBytes: file.size,
      mimeType: file.type
    });
  } catch (error) {
    console.error('Media upload error:', error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || 'Failed to process and store media asset.' },
      { status }
    );
  }
}

/**
 * GET /api/media/upload
 * Health & test helper for SEO filename generator
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sampleTitle = searchParams.get('title') || 'DLF Phase 5 Luxury Apartments';
  const sampleLocality = searchParams.get('locality') || 'Gurugram';
  const sampleFilename = searchParams.get('filename') || 'IMG_83929.jpg';

  const generated = generateSeoImageFilename({
    title: sampleTitle,
    locality: sampleLocality,
    originalFilename: sampleFilename,
    extension: 'webp'
  });

  return NextResponse.json({
    status: 'Media Upload & SEO Filename Engine Active',
    sampleInput: { sampleTitle, sampleLocality, sampleFilename },
    seoGeneratedFilename: generated
  });
}
