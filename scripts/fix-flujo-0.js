const fs = require('fs');

try {
  const content = fs.readFileSync('knowledge_base.md', 'utf8');
  
  // Escapar el contenido para código JS
  const escapedContent = content
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');

  // Código para inyectar en n8n que crea un archivo virtual
  const codeNodeCode = `
const text = "${escapedContent}";
const binaryData = Buffer.from(text, 'utf8').toString('base64');

return [{
  binary: {
    data: {
      data: binaryData,
      mimeType: 'text/markdown',
      fileName: 'knowledge_base.md'
    }
  }
}];
  `;

  // Modificar Flujo 0 para incluir este nodo en lugar de Read File
  const jsonContent = {
    "name": "Flujo 0 - Ingestor RAG V2",
    "nodes": [
      {
        "parameters": {},
        "id": "trigger",
        "name": "Manual Trigger",
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1,
        "position": [0, 0]
      },
      {
        "parameters": {
          "jsCode": codeNodeCode
        },
        "id": "read-file",
        "name": "Generar Archivo Virtual",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [200, 0]
      },
      {
        "parameters": { "options": {} },
        "id": "document-loader",
        "name": "Default Data Loader",
        "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
        "typeVersion": 1,
        "position": [400, 0]
      },
      {
        "parameters": { "chunkSize": 1000, "chunkOverlap": 100 },
        "id": "text-splitter",
        "name": "Text Splitter",
        "type": "@n8n/n8n-nodes-langchain.textSplitterCharacterTextSplitter",
        "typeVersion": 1,
        "position": [400, 200]
      },
      {
        "parameters": {
          "modelId": { "__rl": true, "value": "text-embedding-3-small", "mode": "list", "cachedResultName": "text-embedding-3-small" }
        },
        "id": "embeddings",
        "name": "OpenAI Embeddings",
        "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
        "typeVersion": 1,
        "position": [600, 200]
      },
      {
        "parameters": {
          "mode": "insert",
          "tableName": "documents",
          "matchName": "match_documents"
        },
        "id": "supabase-vector",
        "name": "Supabase Vector Store",
        "type": "@n8n/n8n-nodes-langchain.vectorStoreSupabase",
        "typeVersion": 1,
        "position": [600, 0]
      }
    ],
    "connections": {
      "Manual Trigger": { "main": [ [ { "node": "Generar Archivo Virtual", "type": "main", "index": 0 } ] ] },
      "Generar Archivo Virtual": { "main": [ [ { "node": "Supabase Vector Store", "type": "main", "index": 0 } ] ] },
      "Default Data Loader": { "ai_document": [ [ { "node": "Supabase Vector Store", "type": "ai_document", "index": 0 } ] ] },
      "Text Splitter": { "ai_textSplitter": [ [ { "node": "Default Data Loader", "type": "ai_textSplitter", "index": 0 } ] ] },
      "OpenAI Embeddings": { "ai_embedding": [ [ { "node": "Supabase Vector Store", "type": "ai_embedding", "index": 0 } ] ] }
    }
  };

  fs.writeFileSync('Flujo 0 - Ingestor RAG V2.json', JSON.stringify(jsonContent, null, 2));
  console.log('✅ Archivo regenerado con éxito');
} catch (e) {
  console.error(e);
}
