"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { uploadImageToStorage } from "@/lib/supabase";

export async function getTeamMembers() {
  return await prisma.teamMember.findMany({
    select: {
      id: true,
      name: true,
      position: true,
      email: true,
      imageUrl: true,
      linkedinUrl: true,
      githubUrl: true,
      order: true,
      createdAt: true,
      updatedAt: true,
    },
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
  imageFile?: File;
  linkedinUrl?: string;
  githubUrl?: string;
}) {
  try {
    if (data.email) {
      const existing = await prisma.teamMember.findUnique({ where: { email: data.email } });
      if (existing) return { success: false, error: "Email already exists" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return { success: false, error: "Unauthorized" };

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_development_only"));
    const editorRole = (payload.position as string)?.toLowerCase() || "";

    if (editorRole !== "secretary" && editorRole !== "secy") {
      if (data.position.toLowerCase() === "secretary" || data.position.toLowerCase() === "secy") {
        return { success: false, error: "Only the current Secretary can create a Secretary account." };
      }
    }

    const checkPos = await prisma.teamMember.findFirst({
      where: { position: { equals: data.position, mode: 'insensitive' } }
    });
    const posUpper = data.position.toUpperCase();
    if (checkPos && (posUpper === "SECRETARY" || posUpper === "SECY" || posUpper === "REPRESENTATIVE" || posUpper === "REP")) {
      return { success: false, error: `Only one ${data.position} is allowed` };
    }

    let finalUrl = data.imageUrl;
    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
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
        imageUrl: finalUrl,
        linkedinUrl: data.linkedinUrl || undefined,
        githubUrl: data.githubUrl || undefined,
      }
    });

    revalidatePath("/admin/team");
    revalidatePath("/team");
    revalidatePath("/");
    return { success: true, member };
  } catch (error) {
    console.error("Failed to create team member:", error);
    return { success: false, error: "Failed to create team member" };
  }
}

export async function updateTeamMember(id: string, data: {
  name: string;
  position: string;
  email?: string;
  password?: string;
  imageUrl?: string;
  imageFile?: File;
  linkedinUrl?: string;
  githubUrl?: string;
}) {
  try {
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Team member not found" };

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return { success: false, error: "Unauthorized" };

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_development_only"));
    const editorRole = (payload.position as string)?.toLowerCase() || "";

    const targetRole = existing.position.toLowerCase();

    if (editorRole !== "secretary" && editorRole !== "secy") {
      if (targetRole === "secretary" || targetRole === "secy") {
        return { success: false, error: "You do not have permission to edit the Secretary." };
      }
      if (data.position.toLowerCase() === "secretary" || data.position.toLowerCase() === "secy") {
        return { success: false, error: "You do not have permission to assign the Secretary role." };
      }
    }

    if (data.email && data.email !== existing.email) {
      const emailCheck = await prisma.teamMember.findUnique({ where: { email: data.email } });
      if (emailCheck) return { success: false, error: "Email already exists" };
    }

    if (data.position.toLowerCase() !== existing.position.toLowerCase()) {
      const checkPos = await prisma.teamMember.findFirst({
        where: { position: { equals: data.position, mode: 'insensitive' } }
      });
      const posUpper = data.position.toUpperCase();
      if (checkPos && (posUpper === "SECRETARY" || posUpper === "SECY" || posUpper === "REPRESENTATIVE" || posUpper === "REP")) {
        return { success: false, error: `Only one ${data.position} is allowed` };
      }
    }

    let finalUrl = data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl;
    if (data.imageFile && data.imageFile.size > 0) {
      const uploadUrl = await uploadImageToStorage(data.imageFile);
      if (uploadUrl) finalUrl = uploadUrl;
    }

    let hashedPassword = existing.password;
    if (data.password && data.password.trim() !== "") {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: data.name,
        position: data.position,
        email: data.email || undefined,
        password: hashedPassword,
        imageUrl: finalUrl,
        linkedinUrl: data.linkedinUrl || undefined,
        githubUrl: data.githubUrl || undefined,
      }
    });

    revalidatePath("/admin/team");
    revalidatePath("/team");
    revalidatePath("/");
    return { success: true, member };
  } catch (error) {
    console.error("Failed to update team member:", error);
    return { success: false, error: "Failed to update team member" };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Team member not found" };

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return { success: false, error: "Unauthorized" };

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_development_only"));
    const editorRole = (payload.position as string)?.toLowerCase() || "";

    if (editorRole !== "secretary" && editorRole !== "secy") {
      if (existing.position.toLowerCase() === "secretary" || existing.position.toLowerCase() === "secy") {
        return { success: false, error: "You do not have permission to delete the Secretary." };
      }
    }

    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/team");
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete team member:", error);
    return { success: false, error: "Failed to delete team member" };
  }
}
