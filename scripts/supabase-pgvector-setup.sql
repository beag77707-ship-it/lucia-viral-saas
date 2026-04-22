-- 1. Habilitar la extensión de vectores (pgvector)
create extension if not exists vector;

-- 2. Crear una tabla para almacenar los documentos y sus embeddings
create table if not exists documents (
  id bigserial primary key,
  content text, -- El texto del fragmento del libro/documento
  metadata jsonb, -- Metadatos adicionales (autor, título, etc)
  embedding vector(1536) -- 1536 es la dimensión para el modelo text-embedding-ada-002 o text-embedding-3-small de OpenAI
);

-- 3. Crear una función para buscar documentos similares
create or replace function match_documents (
  query_embedding vector(1536),
  match_count int default null,
  filter jsonb default '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
