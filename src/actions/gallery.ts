import prisma from "@/lib/prisma";

export async function getGalleryImages() {
  return await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function createGalleryImage(data: { title: string; imageUrl: string }) {
  return await prisma.galleryImage.create({
    data
  });
}
