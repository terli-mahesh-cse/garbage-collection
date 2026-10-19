import jsPDF from "jspdf";

interface CertificateParams {
  volunteerName: string;
  eventTitle: string;
  cityName: string;
  eventDate: string;
  orgName: string;
  certificateId: string;
}

export function generateVolunteerCertificate({
  volunteerName,
  eventTitle,
  cityName,
  eventDate,
  orgName,
  certificateId,
}: CertificateParams): void {
  // Landscape orientation A4
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background frame
  doc.setFillColor(248, 250, 248);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Border Outer Green
  doc.setDrawColor(46, 125, 50); // Primary green
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Border Inner Gold
  doc.setDrawColor(251, 140, 0); // Orange gold
  doc.setLineWidth(1);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Corner decorations
  doc.setFillColor(46, 125, 50);
  doc.circle(14, 14, 3, "F");
  doc.circle(pageWidth - 14, 14, 3, "F");
  doc.circle(14, pageHeight - 14, 3, "F");
  doc.circle(pageWidth - 14, pageHeight - 14, 3, "F");

  // Title Header
  doc.setFont("helvetica", "bold");
  doc.setTextColor(46, 125, 50);
  doc.setFontSize(28);
  doc.text("GARBAGE COLLECTION PLATFORM", pageWidth / 2, 38, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139);
  doc.text("COMMUNITY-POWERED CLEAN CITY INITIATIVE", pageWidth / 2, 46, { align: "center" });

  // Main Ribbon Banner
  doc.setFillColor(232, 245, 233);
  doc.roundedRect(pageWidth / 2 - 80, 53, 160, 12, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 94, 32);
  doc.setFontSize(15);
  doc.text("CERTIFICATE OF APPRECIATION", pageWidth / 2, 61, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(12);
  doc.text("This certificate is proudly awarded to", pageWidth / 2, 78, { align: "center" });

  // Volunteer Name
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(24);
  doc.text(volunteerName.toUpperCase(), pageWidth / 2, 92, { align: "center" });

  // Underline for name
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 60, 95, pageWidth / 2 + 60, 95);

  // Body text
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(13);
  const narrative = `for outstanding dedication in participating as an active volunteer in the cleanup drive:`;
  doc.text(narrative, pageWidth / 2, 107, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(46, 125, 50);
  doc.setFontSize(16);
  doc.text(`"${eventTitle}"`, pageWidth / 2, 118, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(12);
  doc.text(
    `Organized by ${orgName} in ${cityName} on ${eventDate}.`,
    pageWidth / 2,
    128,
    { align: "center" }
  );

  doc.text(
    `Your active contribution helps eradicate litter hotspots and restores a green, healthy environment for all citizens.`,
    pageWidth / 2,
    136,
    { align: "center" }
  );

  // Signatures & Stamp
  const sigY = 168;

  // Signer 1: Community Lead
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(40, sigY, 95, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Community Organiser Lead", 67.5, sigY + 6, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(orgName, 67.5, sigY + 11, { align: "center" });

  // Official Gold Seal in Center
  doc.setFillColor(255, 248, 225);
  doc.setDrawColor(251, 140, 0);
  doc.setLineWidth(1.5);
  doc.circle(pageWidth / 2, sigY - 4, 15, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text("VERIFIED", pageWidth / 2, sigY - 6, { align: "center" });
  doc.text("VOLUNTEER", pageWidth / 2, sigY - 1, { align: "center" });
  doc.setFontSize(7);
  doc.text("CLEAN CITY", pageWidth / 2, sigY + 4, { align: "center" });

  // Signer 2: Municipal Sanitation Officer
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 95, sigY, pageWidth - 40, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Municipal Sanitation Officer", pageWidth - 67.5, sigY + 6, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`GHMC / Municipal Ward Authority`, pageWidth - 67.5, sigY + 11, { align: "center" });

  // Footer Certificate ID
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Certificate ID: GC-${certificateId} • Verified on garbagecollection.in`, pageWidth / 2, pageHeight - 16, { align: "center" });

  // Save / Trigger Download
  doc.save(`Volunteer-Certificate-${volunteerName.replace(/\s+/g, "_")}.pdf`);
}
