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

export async function createGalleryImage(data: { title: string; imageUrl: string }) {
  return await prisma.galleryImage.create({
    data
  });
}
