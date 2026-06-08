"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImageToStorage } from "@/lib/supabase";

export async function getProjects() {
  return await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }]
  });
}

export async function reorderProject(id: string, direction: "up" | "down") {
  const all = await prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
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
    prisma.project.update({ where: { id: item.id }, data: { order: item.order } })
  ));

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function createProject(data: {
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
  githubUrl?: string;
  liveUrl?: string;
  deploymentUrl?: string;
  tags: string;
}) {
  try {
    let finalUrl = data.imageUrl;
    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
    }

    const project = await prisma.project.create({ 
      data: {
        title: data.title,
        description: data.description,
        imageUrl: finalUrl,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        deploymentUrl: data.deploymentUrl,
        tags: data.tags,
      } 
    });
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function updateProject(id: string, data: {
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
  githubUrl?: string;
  liveUrl?: string;
  deploymentUrl?: string;
  tags: string;
}) {
  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Project not found" };

    let finalUrl = data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl;
    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: finalUrl,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        deploymentUrl: data.deploymentUrl,
        tags: data.tags,
      }
    });
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }
}
