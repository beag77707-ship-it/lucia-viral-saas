import jsPDF from "jspdf";

export const generatePDF = (project: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Titulo - B/N Elegante
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0); 
  doc.text("Calendario de Contenido Viral", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(`Nicho: ${project.niche || "General"}`, 20, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 35);
  doc.text(`ID Proyecto: ${project.id}`, 20, 40);

  let yOffset = 55;
  
  // Extraer ideas de forma robusta
  let ideas = [];
  const rawData = project.resultJSON;

  if (Array.isArray(rawData)) {
    ideas = rawData;
  } else if (rawData && typeof rawData === 'object') {
    ideas = rawData.ideas || rawData.data || rawData.results || [];
  }
  
  if (!ideas || ideas.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(150, 0, 0);
    doc.text("Aviso: No se han encontrado datos detallados en este proyecto.", 20, yOffset);
    doc.setTextColor(0, 0, 0);
    doc.text("Por favor, verifica el estado del flujo en n8n.", 20, yOffset + 10);
    doc.save(`Reporte_${project.id}.pdf`);
    return;
  }
  
  ideas.forEach((idea: any, index: number) => {
    // Control de nueva página
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
    }

    // Cabecera de Idea
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const title = (idea.title || `Idea ${index + 1}`).replace(/\*\*/g, "");
    doc.text(`${index + 1}. ${title}`, 20, yOffset);
    yOffset += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    // Función auxiliar para añadir secciones con salto de línea
    const addSection = (label: string, text: string) => {
      if (!text) return;
      if (yOffset > 270) { doc.addPage(); yOffset = 20; }
      
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, yOffset);
      doc.setFont("helvetica", "normal");
      
      const cleanText = text.replace(/\*\*/g, "").replace(/#/g, "");
      const lines = doc.splitTextToSize(cleanText, pageWidth - 40);
      doc.text(lines, 25, yOffset + 5);
      yOffset += (lines.length * 5) + 12;
    };

    addSection("Hook", idea.hook);
    addSection("Guión", idea.full_script || idea.script);
    addSection("Copy IG", idea.copy);
    
    if (idea.hashtags) {
      const tags = Array.isArray(idea.hashtags) ? idea.hashtags.join(" ") : idea.hashtags;
      addSection("Hashtags", tags);
    }

    yOffset += 5; // Separación entre bloques
    doc.setDrawColor(230, 230, 230);
    doc.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 15;
  });

  doc.save(`Calendario_Viral_${project.id}.pdf`);
};
