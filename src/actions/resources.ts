"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFileToStorage } from "@/lib/supabase";
import { getCurrentRole } from "@/actions/auth";

// Only Secy, Rep, mentors, coordinators
async function checkAdminAccess() {
  const role = await getCurrentRole();
  const isMember = role === "member" || role === "members";
  if (isMember) {
    throw new Error("Members cannot modify resources");
  }
  return true;
}

export async function getResources() {
  return await prisma.resource.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }]
  });
}

export async function createResource(data: {
  title: string;
  description?: string;
  youtubeUrl?: string;
  files: File[];
  resourceLinks?: string[];
}) {
  try {
    await checkAdminAccess();

    const fileUrls: string[] = [];
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        if (file.size > 0) {
          const url = await uploadFileToStorage(file);
          if (url) fileUrls.push(url);
        }
      }
    }

    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description || null,
        youtubeUrl: data.youtubeUrl || null,
        fileUrls: fileUrls,
        resourceLinks: data.resourceLinks || [],
      }
    });

    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    return { success: true, resource };
  } catch (error) {
    console.error("Failed to create resource:", error);
    return { success: false, error: (error as Error).message || "Failed to create resource" };
  }
}

export async function updateResource(id: string, data: {
  title: string;
  description?: string;
  youtubeUrl?: string;
  files?: File[];
  existingFiles?: string[];
  resourceLinks?: string[];
}) {
  try {
    await checkAdminAccess();

    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Resource not found" };

    const fileUrls: string[] = data.existingFiles ? [...data.existingFiles] : [];
    
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        if (file.size > 0) {
          const url = await uploadFileToStorage(file);
          if (url) fileUrls.push(url);
        }
      }
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        youtubeUrl: data.youtubeUrl || null,
        fileUrls: fileUrls,
        resourceLinks: data.resourceLinks || [],
      }
    });

    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    return { success: true, resource };
  } catch (error) {
    console.error("Failed to update resource:", error);
    return { success: false, error: (error as Error).message || "Failed to update resource" };
  }
}

export async function deleteResource(id: string) {
  try {
    await checkAdminAccess();
    await prisma.resource.delete({ where: { id } });
    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete resource:", error);
    return { success: false, error: (error as Error).message || "Failed to delete resource" };
  }
}

export async function reorderResource(id: string, direction: "up" | "down") {
  try {
    await checkAdminAccess();
    const all = await prisma.resource.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
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
      prisma.resource.update({ where: { id: item.id }, data: { order: item.order } })
    ));

    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder resource:", error);
    return { success: false, error: "Failed to reorder" };
  }
}

import { redirect } from "next/navigation";

export async function addResourceAction(formData: FormData) {
  const fileEntries = formData.getAll("files") as File[];
  const resourceLinksStr = formData.get("resourceLinks") as string;
  let resourceLinks: string[] = [];
  try {
    if (resourceLinksStr) resourceLinks = JSON.parse(resourceLinksStr);
  } catch(e) {}

  await createResource({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    youtubeUrl: formData.get("youtubeUrl") as string || undefined,
    files: fileEntries,
    resourceLinks,
  });
}

export async function editResourceAction(formData: FormData) {
  const id = formData.get("id") as string;
  const fileEntries = formData.getAll("files") as File[];
  const existingFilesStr = formData.get("existingFiles") as string;
  let existingFiles: string[] = [];
  try {
    if (existingFilesStr) existingFiles = JSON.parse(existingFilesStr);
  } catch(e) {}

  const resourceLinksStr = formData.get("resourceLinks") as string;
  let resourceLinks: string[] = [];
  try {
    if (resourceLinksStr) resourceLinks = JSON.parse(resourceLinksStr);
  } catch(e) {}

  const result = await updateResource(id, {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    youtubeUrl: formData.get("youtubeUrl") as string || undefined,
    files: fileEntries,
    existingFiles,
    resourceLinks,
  });

  if (!result.success) {
    redirect(`/admin/resources?error=${encodeURIComponent(result.error as string)}`);
  } else {
    redirect("/admin/resources");
  }
}

export async function deleteResourceAction(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteResource(id);
}

export async function moveUpAction(id: string) {
  await reorderResource(id, "up");
}

export async function moveDownAction(id: string) {
  await reorderResource(id, "down");
}
