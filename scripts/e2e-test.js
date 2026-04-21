const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

async function main() {
  const prisma = new PrismaClient();
  
  // 1. Encontrar el primer usuario
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No se encontró ningún usuario en la base de datos.");
    return;
  }
  
  console.log(`Usando usuario: ${user.email} (${user.id})`);

  // 2. Crear un proyecto de prueba
  const niche = "Marketing de Afiliados";
  const competitors = ["vilmanunez", "conviertemas", "ebitda.es"];
  
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      niche: niche,
      competitors: JSON.stringify(competitors),
      status: "PROCESSING"
    }
  });

  console.log(`Proyecto creado: ${project.id}`);

  // 3. Disparar Webhook de n8n (PROD)
  const webhookUrl = "https://vmi3229350.contaboserver.net/webhook/generate-content";
  
  console.log(`Disparando webhook: ${webhookUrl}`);
  
  try {
    const response = await axios.post(webhookUrl, {
      projectId: project.id,
      userId: user.id,
      niche: niche,
      competitors: competitors,
      plan: user.plan || "BASIC"
    });
    
    console.log("Respuesta de n8n:", response.data);
    console.log("¡Prueba enviada con éxito! Revisa tu dashboard en unos minutos.");
  } catch (err) {
    console.error("Error al disparar n8n:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
