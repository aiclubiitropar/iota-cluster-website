"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGalleryImages() {
  return await prisma.galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }]
  });
}

export async function reorderGalleryImage(id: string, direction: "up" | "down") {
  const all = await prisma.galleryImage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  const index = all.findIndex(i => i.id === id);
  if (index === -1) return;

  let newOrder = all.map((item, i) => ({ id: item.id, order: i }));

  if (direction === "up" && index > 0) {
    newOrder[index].order = index - 1;
    newOrder[index - 1].order = index;
  } else if (direction === "down" && index < newOrder.length - 1) {
    newOrder[index].order = index + 1;
    newOrder[index + 1].order = index;
  }

  await Promise.all(newOrder.map(item => 
    prisma.galleryImage.update({ where: { id: item.id }, data: { order: item.order } })
  ));

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

import { uploadImageToStorage } from "@/lib/supabase";

export async function createGalleryImage(data: { title: string; imageUrl?: string; imageFile?: File }) {
  try {
    let finalUrl = data.imageUrl || "";

    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
    }

    if (!finalUrl) {
      return { success: false, error: "Image URL or File is required" };
    }

    const img = await prisma.galleryImage.create({ data: { title: data.title, imageUrl: finalUrl } });
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true, img };
  } catch (error) {
    console.error("Failed to create gallery image:", error);
    return { success: false, error: "Failed to create gallery image" };
  }
}

export async function updateGalleryImage(id: string, data: { title: string; imageUrl?: string; imageFile?: File }) {
  try {
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Not found" };

    let finalUrl = data.imageUrl || existing.imageUrl;

    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
    }

    const img = await prisma.galleryImage.update({
      where: { id },
      data: { title: data.title, imageUrl: finalUrl }
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true, img };
  } catch (error) {
    console.error("Failed to update gallery image:", error);
    return { success: false, error: "Failed to update gallery image" };
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await prisma.galleryImage.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete gallery image:", error);
    return { success: false, error: "Failed to delete gallery image" };
  }
}
