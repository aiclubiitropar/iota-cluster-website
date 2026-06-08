"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_development_only");

async function createToken(position: string) {
  return await new SignJWT({ position: position.toLowerCase() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const position = formData.get("position") as string;

  if (!email || !password || !position) {
    return { success: false, error: "Please fill in all fields" };
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

  const token = await createToken(member.position);
  (await cookies()).set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  
  return { success: true };
}

export async function logoutAdmin() {
  (await cookies()).delete("admin_token");
  redirect("/");
}

export async function getCurrentRole(): Promise<string | null> {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return (payload.position as string)?.toLowerCase() || null;
  } catch (err) {
    return null;
  }
}
