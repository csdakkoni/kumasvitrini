import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { cookies } from 'next/headers';

// Ensure all required R2 variables exist
const REGION = 'auto'; // R2 uses 'auto' region
const ENDPOINT = process.env.R2_ENDPOINT!;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;

let s3Client: S3Client | null = null;
if (ENDPOINT && ACCESS_KEY_ID && SECRET_ACCESS_KEY) {
    s3Client = new S3Client({
        region: REGION,
        endpoint: ENDPOINT,
        credentials: {
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY,
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        // Authenticate the user (Admin only)
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (!adminToken) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!s3Client) {
            return NextResponse.json({ error: 'R2 credentials are not configured in environment variables' }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize and generate unique filename
        const extension = file.name.split('.').pop() || 'png';
        const fileName = `${crypto.randomUUID()}.${extension}`;
        // Store inside a products/ folder in the bucket
        const r2Key = `products/${fileName}`;

        // Upload to Cloudflare R2
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: r2Key,
            Body: buffer,
            ContentType: file.type || 'image/png',
            CacheControl: 'public, max-age=31536000, immutable',
        }));

        // Construct the public URL
        const imageUrl = `${PUBLIC_URL}/${r2Key}`;

        return NextResponse.json({ 
            success: true, 
            url: imageUrl 
        });

    } catch (error) {
        console.error('Error uploading file to R2:', error);
        return NextResponse.json(
            { error: 'Görsel yüklenirken bir hata oluştu.' },
            { status: 500 }
        );
    }
}
