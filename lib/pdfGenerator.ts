import jsPDF from "jspdf";

export const generatePDF = (project: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Primary color
  doc.text("Reporte de Contenido Viral", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(`Nicho: ${project.niche}`, 20, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 38);

  let yOffset = 50;
  
  if (!project.resultJSON) {
    doc.text("No se encontraron resultados en el JSON.", 20, yOffset);
    doc.save(`Viral_Report_${project.id}.pdf`);
    return;
  }

  const ideas = project.resultJSON.ideas || [];
  
  ideas.forEach((idea: any, index: number) => {
    if (yOffset > 270) {
      doc.addPage();
      yOffset = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(`Idea #${index + 1}: ${idea.title || "Sin título"}`, 20, yOffset);
    yOffset += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(79, 70, 229);
    doc.text(`Hook: ${idea.hook || ""}`, 20, yOffset);
    yOffset += 10;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    
    // Auto-wrap text
    const scriptLines = doc.splitTextToSize(`Script: ${idea.script || ""}`, pageWidth - 40);
    doc.text(scriptLines, 20, yOffset);
    
    yOffset += (scriptLines.length * 6) + 10;
  });

  doc.save(`Viral_Report_${project.id}.pdf`);
};
