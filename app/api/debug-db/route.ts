import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlProto: process.env.DATABASE_URL ? process.env.DATABASE_URL.split(":")[0] : null,
      nodeEnv: process.env.NODE_ENV,
    },
    connection: null,
    error: null
  };

  const prisma = new PrismaClient();

  try {
    // Intentamos una consulta ultra-simple que no dependa del esquema
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    diagnostics.connection = "SUCCESS";
    diagnostics.queryResult = result;
    
    // Intentamos contar usuarios para ver si las tablas existen
    const userCount = await prisma.user.count();
    diagnostics.userCount = userCount;
    diagnostics.tables = "OK";
  } catch (err: any) {
    diagnostics.connection = "FAILED";
    diagnostics.error = {
      message: err.message,
      code: err.code,
      meta: err.meta
    };
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json(diagnostics);
}
