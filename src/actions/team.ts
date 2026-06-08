"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeamMembers() {
  return await prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }]
  });
}

export async function reorderTeamMember(id: string, direction: "up" | "down") {
  const all = await prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
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
    prisma.teamMember.update({ where: { id: item.id }, data: { order: item.order } })
  ));

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
}

export async function createTeamMember(data: { name: string; position: string; imageUrl?: string; linkedinUrl?: string; githubUrl?: string }) {
  try {
    const member = await prisma.teamMember.create({ data });
    revalidatePath("/team");
    revalidatePath("/admin/team");
    return { success: true, member };
  } catch (error) {
    console.error("Failed to create team member:", error);
    return { success: false, error: "Failed to create team member" };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/team");
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete team member:", error);
    return { success: false, error: "Failed to delete team member" };
  }
}
