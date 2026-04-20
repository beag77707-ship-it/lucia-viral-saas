const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const projectId = 'cmo73o2se0003ivrydncxwpov';
  
  console.log(`--- Iniciando simulacion para proyecto ${projectId} ---`);

  // 1. Borrar videos antiguos del proyecto
  const deleted = await prisma.video.deleteMany({
    where: { projectId }
  });
  console.log(`Eliminados ${deleted.count} videos antiguos.`);

  // 2. Insertar los 3 videos manuales
  const videosData = [
    {
      projectId,
      title: 'Video Simulado 1 - Finanzas',
      script: 'Guion del primer video de finanzas.',
      videoUrl: '/reels/video1.mp4',
      status: 'COMPLETED'
    },
    {
      projectId,
      title: 'Video Simulado 2 - Finanzas',
      script: 'Guion del segundo video de finanzas.',
      videoUrl: '/reels/video2.mp4',
      status: 'COMPLETED'
    },
    {
      projectId,
      title: 'Video Simulado 3 - Finanzas',
      script: 'Guion del tercer video de finanzas.',
      videoUrl: '/reels/video3.mp4',
      status: 'COMPLETED'
    }
  ];

  for (const data of videosData) {
    const v = await prisma.video.create({ data });
    console.log(`Creado video: ${v.title} (${v.id})`);
  }

  console.log('--- Simulacion completada con exito ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
