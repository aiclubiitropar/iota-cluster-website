"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

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

export async function createTeamMember(data: { 
  name: string; 
  position: string; 
  email?: string;
  password?: string;
  imageUrl?: string; 
  linkedinUrl?: string; 
  githubUrl?: string 
}) {
  try {
    // Enforce Singleton roles
    if (data.position === "Secretary" || data.position === "Representative") {
      const existing = await prisma.teamMember.findFirst({
        where: { position: data.position }
      });
      if (existing) {
        return { success: false, error: `Only one ${data.position} is allowed.` };
      }
    }

    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const member = await prisma.teamMember.create({ 
      data: {
        name: data.name,
        position: data.position,
        email: data.email || undefined,
        password: hashedPassword,
        imageUrl: data.imageUrl,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
      } 
    });
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
