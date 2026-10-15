
"use server";

import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cloudinary } from "@/lib/cloudinary";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}



async function createUniqueSlug(title: string, excludeId?: string) {
  const baseSlug = slugify(title) || "blog-post";
  let slug = baseSlug;
  let suffix = 1;

  while (
    await prisma.blogPost.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  return slug;
}

function readPostForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();

  if (!title || !content) {
    throw new Error("Title and article content are required.");
  }

  if (title.length > 200) {
    throw new Error("The title must be 200 characters or fewer.");
  }

  if (excerpt.length > 500) {
    throw new Error("The excerpt must be 500 characters or fewer.");
  }

  if (coverImage) {
    try {
      const imageUrl = new URL(coverImage);

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error("Please enter a valid cover image URL.");
    }
  }

  return {
    title,
    excerpt: excerpt || null,
    content,
    coverImage: coverImage || null,
  };
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();

  const post = readPostForm(formData);
  const slug = await createUniqueSlug(post.title);
  const published = formData.get("published") === "on";

  await prisma.blogPost.create({
    data: {
      ...post,
      slug,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/dashboard");

  redirect("/admin/blog");
}


export async function uploadBlogCoverImage(formData: FormData) {
  await requireAdmin();

  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please select an image to upload.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WebP image.");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("The image must be 5 MB or smaller.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "doctors-autos/blog",
          resource_type: "image",
        },
        (error, uploadedImage) => {
          if (error) {
            reject(new Error("Image upload failed. Please try again."));
            return;
          }

          if (!uploadedImage?.secure_url) {
            reject(new Error("Cloudinary did not return an image URL."));
            return;
          }

          resolve({ secure_url: uploadedImage.secure_url });
        },
      );

      stream.end(buffer);
    },
  );

  return { url: result.secure_url };
}

 

export async function updateBlogPost(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Blog post ID is required.");
  }

  const existingPost = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!existingPost) {
    throw new Error("Blog post not found.");
  }

  const post = readPostForm(formData);
  const slug =
    post.title === existingPost.title
      ? existingPost.slug
      : await createUniqueSlug(post.title, id);

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...post,
      slug,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${existingPost.slug}`);
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}/edit`);

  redirect("/admin/blog");
}

export async function toggleBlogPost(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Blog post ID is required.");
  }

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Blog post not found.");
  }

  const published = !post.published;

  await prisma.blogPost.update({
    where: { id },
    data: {
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
  revalidatePath("/admin/dashboard");

  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Blog post ID is required.");
  }

  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!post) {
    throw new Error("Blog post not found.");
  }

  await prisma.blogPost.delete({
    where: { id },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
  revalidatePath("/admin/dashboard");

  redirect("/admin/blog");
}
