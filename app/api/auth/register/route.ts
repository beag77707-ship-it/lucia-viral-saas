import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Basic list of known disposable domains (example list, should be expanded in production)
const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
  "guerrillamail.com"
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return NextResponse.json({ error: "Temporary emails are not allowed" }, { status: 403 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        plan: "BASIC",
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { email: user.email, id: user.id } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
