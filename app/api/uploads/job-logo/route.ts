import { NextResponse } from "next/server";
import { uploadJobAssetToCloudinary } from "@/lib/server-cloudinary";
import { requireCurrentUser } from "@/lib/server-users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { dataUri, publicId } = (await request.json()) as { dataUri?: string; publicId?: string };
    if (!dataUri) {
      return NextResponse.json({ message: "Image data is required." }, { status: 400 });
    }

    const result = await uploadJobAssetToCloudinary(dataUri, publicId);
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Image upload failed." },
      { status: 500 },
    );
  }
}
