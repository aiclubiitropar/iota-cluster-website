"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return members;
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
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
