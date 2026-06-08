"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { uploadImageToStorage } from "@/lib/supabase";

export async function getBlogs() {
  return await prisma.blog.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function getBlogById(id: string) {
  return await prisma.blog.findUnique({
    where: { id }
  });
}

export async function createBlog(data: {
  title: string;
  author: string;
  summary: string;
  content: string;
  imageFile?: File;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return { success: false, error: "Unauthorized" };

    let finalUrl: string | undefined = undefined;
    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
    }

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        author: data.author,
        summary: data.summary,
        content: data.content,
        imageUrl: finalUrl,
      }
    });

    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
    revalidatePath("/");
    return { success: true, blog };
  } catch (error) {
    console.error("Failed to create blog:", error);
    return { success: false, error: "Failed to create blog" };
  }
}

export async function updateBlog(id: string, data: {
  title: string;
  author: string;
  summary: string;
  content: string;
  imageUrl?: string;
  imageFile?: File;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return { success: false, error: "Unauthorized" };

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Blog not found" };

    let finalUrl = data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl;
    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        author: data.author,
        summary: data.summary,
        content: data.content,
        imageUrl: finalUrl,
      }
    });

    revalidatePath("/admin/blogs");
    revalidatePath(`/blogs/${id}`);
    revalidatePath("/blogs");
    revalidatePath("/");
    return { success: true, blog };
  } catch (error) {
    console.error("Failed to update blog:", error);
    return { success: false, error: "Failed to update blog" };
  }
}

export async function deleteBlog(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return { success: false, error: "Unauthorized" };

    await prisma.blog.delete({ where: { id } });
    
    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return { success: false, error: "Failed to delete blog" };
  }
}
