const fs = require('fs');

try {
  // 1. Cargar el JSON original
  const flowPath = 'Flujo1 (1).json';
  const data = JSON.parse(fs.readFileSync(flowPath, 'utf8'));

  // 2. Filtrar el nodo antiguo de OpenAI
  const openaiNodeIndex = data.nodes.findIndex(n => n.name === 'OpenAI Generador');
  const openaiNode = data.nodes[openaiNodeIndex];
  data.nodes.splice(openaiNodeIndex, 1);

  // 3. Crear los nuevos nodos de Agente, Modelo, RAG y Web Search
  const agentNodes = [
    {
      "parameters": {
        "text": "={{ $json.corpus }}\n\nINSTRUCCIONES EXTRA:\nFormato exacto de salida debe coincidir con el schema solicitado.",
        "options": {
          "systemMessage": "Eres un 'Consejo de Expertos en Marketing Viral' compuesto por:\n1. Seth Godin: Maestro del Vaca Púrpura.\n2. Neil Patel: Genio del valor táctico.\n3. Gary Vaynerchuk: Furia y Hooks.\n4. Guy Kawasaki: Magia del Pitch.\n\nSigue en estricto orden todas las instrucciones de tu Memoria Semántica para analizar el corpus antes de generar ideas. Devuelve siempre un JSON estructurado con la clave 'ideas'."
        }
      },
      "id": "agent-core",
      "name": "Consejo de Expertos (AI Agent)",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.6,
      "position": [7408, 1392]
    },
    {
      "parameters": {
        "modelId": { "__rl": true, "value": "gpt-4o", "mode": "list", "cachedResultName": "gpt-4o" },
        "options": {}
      },
      "id": "chat-model-1",
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1,
      "position": [7380, 1600],
      "credentials": { "openAiApi": { "id": "8lgcaFH4RanfXIZr", "name": "OpenAI account" } }
    },
    {
      "parameters": {
        "tableName": "documents",
        "matchName": "match_documents"
      },
      "id": "vector-store-rag",
      "name": "Supabase Vector Store Tool",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreSupabase",
      "typeVersion": 1,
      "position": [7560, 1600]
    },
    {
      "parameters": {
        "modelId": { "__rl": true, "value": "text-embedding-3-small", "mode": "list", "cachedResultName": "text-embedding-3-small" }
      },
      "id": "openai-embeddings-tools",
      "name": "OpenAI Embeddings Vector",
      "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
      "typeVersion": 1,
      "position": [7560, 1800],
      "credentials": { "openAiApi": { "id": "8lgcaFH4RanfXIZr", "name": "OpenAI account" } }
    },
    {
      "parameters": {},
      "id": "serpapi-tool",
      "name": "Buscador de Tendencias",
      "type": "@n8n/n8n-nodes-langchain.toolSerpApi",
      "typeVersion": 1,
      "position": [7740, 1600]
    }
  ];

  // 4. Inyectar nuevos nodos
  data.nodes.push(...agentNodes);

  // 5. Actualizar las conexiones
  if (data.connections['Code: Aggregate Text'] && data.connections['Code: Aggregate Text'].main[0]) {
    data.connections['Code: Aggregate Text'].main[0] = [
      { node: 'Consejo de Expertos (AI Agent)', type: 'main', index: 0 }
    ];
  }

  data.connections['Consejo de Expertos (AI Agent)'] = {
    main: [
      [ { node: 'Code in JavaScript', type: 'main', index: 0 } ]
    ]
  };

  data.connections['OpenAI Chat Model'] = {
    ai_languageModel: [ [ { node: 'Consejo de Expertos (AI Agent)', type: 'ai_languageModel', index: 0 } ] ]
  };

  data.connections['Supabase Vector Store Tool'] = {
    ai_tool: [ [ { node: 'Consejo de Expertos (AI Agent)', type: 'ai_tool', index: 0 } ] ]
  };

  data.connections['Buscador de Tendencias'] = {
    ai_tool: [ [ { node: 'Consejo de Expertos (AI Agent)', type: 'ai_tool', index: 0 } ] ]
  };

  data.connections['OpenAI Embeddings Vector'] = {
    ai_embedding: [ [ { node: 'Supabase Vector Store Tool', type: 'ai_embedding', index: 0 } ] ]
  };

  // Limpiar conexión vieja huérfana
  delete data.connections['OpenAI Generador'];

  // 6. Sobrescribir el archivo
  fs.writeFileSync(flowPath, JSON.stringify(data, null, 2));
  console.log('✅ Flujo migrado con éxito a Arquitectura Multi-Agente Avanzada.');
} catch (error) {
  console.error('Error migrando el flujo:', error);
}
