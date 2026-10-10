
import { NextResponse } from "next/server";
import { processPendingCloudinaryDeletions } from "@/lib/cloudinary-cleanup";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await processPendingCloudinaryDeletions();

    return NextResponse.json({
      success: true,
      message: "Cloudinary cleanup queue processed.",
    });
  } catch (error) {
    console.error("Cloudinary cleanup cron failed:", error);

    return NextResponse.json(
      { success: false, message: "Cleanup processing failed." },
      { status: 500 },
    );
  }
}
