// Direct Cloudinary client-side upload service
// Bypasses backend servers entirely so uploads succeed even during cold-starts or sleep

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'enqntmyw';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '331694533156599';
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'Gr9lQqB_qJNnwaQNnTYuMRWOjN8';

async function calculateSHA1(str: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export async function uploadScreenshotDirectly(file: File): Promise<CloudinaryUploadResult> {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'biriyani-orders/payments';
  
  // Cloudinary signature formula: alphabetical query string + api_secret
  const signatureString = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = await calculateSHA1(signatureString);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folder);
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Direct Cloudinary upload failed:', errText);
    throw new Error(`Cloudinary upload failed with status ${response.status}`);
  }

  const result = await response.json();
  return {
    url: result.secure_url || result.url,
    publicId: result.public_id,
  };
}
