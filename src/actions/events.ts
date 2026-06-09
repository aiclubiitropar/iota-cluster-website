"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImageToStorage } from "@/lib/supabase";
import { getCurrentRole } from "@/actions/auth";

export async function getEvents() {
  return await prisma.event.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }]
  });
}

export async function reorderEvent(id: string, direction: "up" | "down") {
  const role = await getCurrentRole();
  const isMember = role === "members" || role === "member";
  if (isMember) return;

  const all = await prisma.event.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
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
    prisma.event.update({ where: { id: item.id }, data: { order: item.order } })
  ));

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}

export async function createEvent(data: {
  title: string;
  imageUrl?: string;
  imageFile?: File;
  unstopUrl?: string;
  deploymentUrl?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const role = await getCurrentRole();
    const isMember = role === "members" || role === "member";
    if (isMember) return { success: false, error: "Members cannot manage events." };

    let finalUrl = data.imageUrl;
    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
    }

    const event = await prisma.event.create({ 
      data: {
        title: data.title,
        imageUrl: finalUrl,
        unstopUrl: data.unstopUrl,
        deploymentUrl: data.deploymentUrl,
        startDate: data.startDate,
        endDate: data.endDate,
      } 
    });
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, event };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    const role = await getCurrentRole();
    const isMember = role === "members" || role === "member";
    if (isMember) return { success: false, error: "Members cannot manage events." };

    await prisma.event.delete({ where: { id } });
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

export async function updateEvent(id: string, data: {
  title: string;
  imageUrl?: string;
  imageFile?: File;
  unstopUrl?: string;
  deploymentUrl?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const role = await getCurrentRole();
    const isMember = role === "members" || role === "member";
    if (isMember) return { success: false, error: "Members cannot manage events." };

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Event not found" };

    let finalUrl = data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl;
    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        imageUrl: finalUrl,
        unstopUrl: data.unstopUrl,
        deploymentUrl: data.deploymentUrl,
        startDate: data.startDate !== undefined ? data.startDate : existing.startDate,
        endDate: data.endDate !== undefined ? data.endDate : existing.endDate,
      }
    });
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, event };
  } catch (error) {
    console.error("Failed to update event:", error);
    return { success: false, error: "Failed to update event" };
  }
}
