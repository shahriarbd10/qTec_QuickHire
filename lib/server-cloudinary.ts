import { v2 as cloudinary } from "cloudinary";

let configured = false;

function configureCloudinary() {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  configured = true;
}

export async function uploadJobAssetToCloudinary(dataUri: string, publicId?: string | null) {
  configureCloudinary();

  return cloudinary.uploader.upload(dataUri, {
    folder: "quickhire/job-assets",
    public_id: publicId ?? undefined,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    transformation: [
      { width: 480, height: 480, crop: "fill", gravity: "auto" },
      { quality: "auto:eco", fetch_format: "auto" },
    ],
  });
}

export async function uploadCompanyLogoToCloudinary(dataUri: string, publicId?: string | null) {
  configureCloudinary();

  return cloudinary.uploader.upload(dataUri, {
    folder: "quickhire/company-logos",
    public_id: publicId ?? undefined,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    transformation: [
      { width: 320, height: 320, crop: "fill", gravity: "auto" },
      { quality: "auto:eco", fetch_format: "auto" },
    ],
  });
}
