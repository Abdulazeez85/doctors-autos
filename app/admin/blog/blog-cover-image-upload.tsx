 
"use client";

import { useState, useTransition } from "react";
import { uploadBlogCoverImage } from "./actions";

export function BlogCoverImageUpload({
  initialImage = "",
}: {
  initialImage?: string;
}) {
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleFileChange(file: File | null) {
    setSelectedFile(file);
    setError("");
    setSuccess("");

    if (!file) {
      setPreviewUrl(imageUrl);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  }

  function handleUpload() {
    if (!selectedFile) {
      setError("Choose an image first.");
      return;
    }

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("image", selectedFile);

        const result = await uploadBlogCoverImage(formData);

        setImageUrl(result.url);
        setPreviewUrl(result.url);
        setSelectedFile(null);
        setSuccess("Image uploaded successfully.");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Image upload failed. Please try again.",
        );
      }
    });
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor="coverImageFile"
        className="mb-2 block text-sm font-semibold text-[#111827]"
      >
        Cover image
      </label>

      <input
        id="coverImageFile"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) =>
          handleFileChange(event.target.files?.[0] ?? null)
        }
        className="block w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] file:mr-4 file:rounded-md file:border-0 file:bg-[#F7F7F3] file:px-3 file:py-2 file:font-semibold file:text-[#111827]"
      />

      <p className="text-xs text-[#6B7280]">
        JPG, PNG, or WebP. Maximum file size: 5 MB.
      </p>

      {previewUrl && (
        <div className="overflow-hidden rounded-lg border border-[#E8E8E2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Blog cover preview"
            className="h-56 w-full object-cover"
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || isPending}
        className="inline-flex items-center justify-center rounded-lg border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#111827] hover:bg-[#F7F7F3] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Uploading image..." : "Upload cover image"}
      </button>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm font-medium text-green-700">{success}</p>
      )}

      <input type="hidden" name="coverImage" value={imageUrl} />
    </div>
  );
}
 