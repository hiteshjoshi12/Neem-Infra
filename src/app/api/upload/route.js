import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import path from 'path';
import fs from 'fs/promises';
import { requireAdmin } from '@/lib/auth/authGuard';

// Dynamic route configuration
export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

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

    // 1. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `Unsupported image format (${file.type}). Allowed formats: JPEG, PNG, WebP, AVIF.` },
        { status: 400 }
      );
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds maximum permitted limit of 10MB.' },
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
