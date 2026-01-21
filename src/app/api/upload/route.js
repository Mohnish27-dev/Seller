import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Handle both single file and multiple files
    const file = formData.get('file');
    const files = formData.getAll('files');
    
    const filesToUpload = file ? [file] : files;
    
    if (!filesToUpload || filesToUpload.length === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const uploadResults = [];

    for (const fileItem of filesToUpload) {
      if (!fileItem || typeof fileItem === 'string') continue;
      
      const bytes = await fileItem.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'ladies-garments',
            transformation: [
              { width: 800, height: 1000, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      uploadResults.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    // Return both formats for compatibility
    if (uploadResults.length === 1) {
      return NextResponse.json({
        url: uploadResults[0].url,
        publicId: uploadResults[0].publicId,
        urls: [uploadResults[0].url],
      });
    }

    return NextResponse.json({
      urls: uploadResults.map(r => r.url),
      results: uploadResults,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { publicId } = await request.json();

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
