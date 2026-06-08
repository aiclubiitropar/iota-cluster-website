"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const position = formData.get("position") as string;

  // Master Admin fallback check
  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (email === validEmail && password === validPassword && position.toLowerCase() === "admin") {
    cookies().set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return { success: true };
  }

  // Database check
  if (!email.endsWith("@iitrpr.ac.in")) {
    return { success: false, error: "Only @iitrpr.ac.in emails are allowed" };
  }

  const member = await prisma.teamMember.findUnique({
    where: { email },
  });

  if (!member || !member.password) {
    return { success: false, error: "Invalid email or password" };
  }

  if (member.position.toLowerCase() !== position.toLowerCase()) {
    return { success: false, error: "Position does not match our records" };
  }

  const passwordMatch = await bcrypt.compare(password, member.password);

  if (!passwordMatch) {
    return { success: false, error: "Invalid email or password" };
  }

  cookies().set("admin_token", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  
  return { success: true };
}

export async function logoutAdmin() {
  cookies().delete("admin_token");
  redirect("/");
}
