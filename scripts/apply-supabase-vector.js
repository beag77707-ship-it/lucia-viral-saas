const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Conectando a Supabase para instalar pgvector...");
    
    // 1. Install extension
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
    console.log("✅ Extensión 'vector' habilitada.");

    // 2. Create table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS documents (
        id bigserial primary key,
        content text,
        metadata jsonb,
        embedding vector(1536)
      );
    `);
    console.log("✅ Tabla 'documents' creada.");

    // 3. Create match_documents function
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION match_documents (
        query_embedding vector(1536),
        match_count int DEFAULT null,
        filter jsonb DEFAULT '{}'
      ) RETURNS TABLE (
        id bigint,
        content text,
        metadata jsonb,
        similarity float
      )
      LANGUAGE plpgsql
      AS $$
      #variable_conflict use_column
      BEGIN
        RETURN query
        SELECT
          id,
          content,
          metadata,
          1 - (documents.embedding <=> query_embedding) AS similarity
        FROM documents
        WHERE metadata @> filter
        ORDER BY documents.embedding <=> query_embedding
        LIMIT match_count;
      END;
      $$;
    `);
    console.log("✅ Función 'match_documents' creada.");

    console.log("¡Supabase está listo para RAG!");
  } catch (error) {
    console.error("Error ajustando Supabase:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
