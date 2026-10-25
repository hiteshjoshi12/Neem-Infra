import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import path from 'path';
import fs from 'fs/promises';
import { requireAdmin } from '@/lib/auth/authGuard';

// Dynamic route configuration
export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
  'image/gif',
  'image/x-icon',
  'image/vnd.microsoft.icon'
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
  'video/x-matroska'
];

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

function getImageKitInstance() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (publicKey && privateKey && urlEndpoint) {
    return new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    });
  }
  return null;
}

export async function POST(req) {
  try {
    await requireAdmin(req);
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || '/saudagar-properties/general';

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: 'No file provided in form-data' },
        { status: 400 }
      );
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);

    // 1. Validate MIME Type
    if (!isVideo && !isImage) {
      return NextResponse.json(
        {
          success: false,
          message: `Unsupported file format (${file.type}). Allowed image formats: JPEG, PNG, WebP, AVIF, SVG, GIF. Allowed video formats: MP4, WebM, MOV, OGG.`
        },
        { status: 400 }
      );
    }

    // 2. Resolve Alt Text (Optional on upload, centrally managed in Image Alt Text Hub)
    const rawAlt = (formData.get('altText') || formData.get('alt') || '').trim();
    const fallbackAlt = file.name ? file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') : 'Saudagar Properties Asset';
    const altText = rawAlt || fallbackAlt;

    // 2. Validate File Size
    const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum permitted limit of ${isVideo ? '100MB for videos' : '25MB for images'}.`
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const sanitizedName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : `upload_${Date.now()}.jpg`;

    const ik = getImageKitInstance();

    // 1. Primary: ImageKit.io Cloud Upload
    if (ik) {
      const uploadResponse = await ik.upload({
        file: buffer.toString('base64'),
        fileName: `${Date.now()}_${sanitizedName}`,
        folder: folder.startsWith('/') ? folder : `/${folder}`,
        useUniqueFileName: true
      });

      return NextResponse.json({
        success: true,
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        name: uploadResponse.name,
        fileType: isVideo ? 'video' : 'image',
        size: file.size,
        thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
        folder: uploadResponse.filePath || folder,
        provider: 'imagekit'
      });
    }

    // 2. Fallback: Local upload if ImageKit keys are pending in .env.local
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (e) {}

    const localFileName = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(uploadsDir, localFileName);
    await fs.writeFile(filePath, buffer);

    const localUrl = `/uploads/${localFileName}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
      name: localFileName,
      thumbnailUrl: localUrl,
      folder: folder,
      provider: 'local',
      notice: 'Saved locally. Add IMAGEKIT_PUBLIC_KEY & IMAGEKIT_PRIVATE_KEY in .env.local for automatic ImageKit cloud hosting.'
    });

  } catch (error) {
    console.error('[API /api/upload Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
