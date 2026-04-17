import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Usamos una instancia directa de Prisma para esta ruta de registro 
// para asegurar que herede la configuración que funcionó en el test de diagnóstico.

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos", details: "Email y contraseña son obligatorios" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Usuario ya existe", details: "Este email ya está registrado. Intenta iniciar sesión." }, { status: 400 });
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
      { message: "Registro exitoso", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Critical Register Error:", error);
    return NextResponse.json({ 
      error: "Error en el servidor de Base de Datos", 
      details: error.message || "Error desconocido",
      prismaCode: error.code
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
