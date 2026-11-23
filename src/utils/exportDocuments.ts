import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  StudentReportCard,
  DirectorExam,
  TeacherPedagogicalProfile,
  StudentMonitoringRecord,
  DisciplinaryIncident,
  DirectorNewsItem
} from '../types/director';
import { School, SchoolClass, SchoolRoom, SubscriptionPlan } from '../types';

export interface DirectorReportLiveData {
  reportCards: StudentReportCard[];
  teacherProfiles: TeacherPedagogicalProfile[];
  exams: DirectorExam[];
  studentRecords: StudentMonitoringRecord[];
  disciplineIncidents: DisciplinaryIncident[];
}

export interface DirectorReportDataset {
  reportId: string;
  title: string;
  category: string;
  sheetName: string;
  summaryLines: string[];
  headers: string[];
  rows: (string | number)[][];
}

function pdfSafe(input?: string | number | null): string {
  if (input === undefined || input === null) return '';
  return String(input)
    .replace(/\u00b7/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u0153/g, 'oe')
    .replace(/\u0152/g, 'OE')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, ' ')
    .trim();
}

function slugifyFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 65);
}

export function buildDirectorReportDataset(
  reportId: string,
  title: string,
  category: string,
  data: DirectorReportLiveData
): DirectorReportDataset {
  if (reportId === 'rep-01') {
    const cards = data.reportCards;
    const avgGeneral =
      cards.length > 0
        ? (cards.reduce((sum, c) => sum + c.generalAverage, 0) / cards.length).toFixed(2)
        : '0.00';
    const passing = cards.filter(c => c.generalAverage >= 10).length;
    const approved = cards.filter(c => c.directorStatus === 'approuve').length;

    return {
      reportId,
      title,
      category,
      sheetName: 'Synthese Pedagogique',
      summaryLines: [
        `Bulletins traités : ${cards.length}`,
        `Moyenne globale de l'échantillon : ${avgGeneral}/20`,
        `Élèves >= 10/20 : ${passing}/${cards.length}`,
        `Bulletins visés & signés : ${approved}`
      ],
      headers: [
        'Matricule',
        'Élève',
        'Classe',
        'Moyenne /20',
        'Rang',
        'Absences (h)',
        'Décision Conseil',
        'Statut Direction'
      ],
      rows: cards.map(c => [
        c.studentMatricule,
        c.studentName,
        c.className,
        Number(c.generalAverage.toFixed(2)),
        `${c.classRank}e / ${c.totalStudentsInClass}`,
        c.absencesHours,
        c.councilDecision,
        c.directorStatus === 'approuve'
          ? 'Approuvé & Signé'
          : c.directorStatus === 'correction_demandee'
          ? 'Correction demandée'
          : c.directorStatus === 'rejete'
          ? 'Rejeté'
          : 'En attente de visa'
      ])
    };
  }

  if (reportId === 'rep-02') {
    const teachers = data.teacherProfiles;
    const avgProgress =
      teachers.length > 0
        ? Math.round(teachers.reduce((sum, t) => sum + t.syllabusProgressPct, 0) / teachers.length)
        : 0;
    const avgLogbook =
      teachers.length > 0
        ? Math.round(teachers.reduce((sum, t) => sum + t.logbookFilledPct, 0) / teachers.length)
        : 0;

    return {
      reportId,
      title,
      category,
      sheetName: 'Avancement Syllabus',
      summaryLines: [
        `Enseignants suivis : ${teachers.length}`,
        `Progression moyenne des programmes : ${avgProgress}%`,
        `Taux moyen de tenue du cahier de textes : ${avgLogbook}%`
      ],
      headers: [
        'Matricule',
        'Enseignant',
        'Matière',
        'Classes Affectées',
        'Syllabus (%)',
        'Heures Faites / Prévues',
        'Cahier Texte (%)',
        'Note Inspection /5'
      ],
      rows: teachers.map(t => [
        t.matricule,
        t.teacherName,
        t.subject,
        t.assignedClasses.join(', '),
        `${t.syllabusProgressPct}%`,
        `${t.hoursCompleted}h / ${t.hoursScheduled}h`,
        `${t.logbookFilledPct}%`,
        t.pedagogicalRating
      ])
    };
  }

  if (reportId === 'rep-03') {
    const exams = data.exams;
    const totalCandidates = exams.reduce((sum, e) => sum + e.candidatesCount, 0);
    const totalPassed = exams.reduce((sum, e) => sum + e.passedCount, 0);
    const globalRate = totalCandidates > 0 ? ((totalPassed / totalCandidates) * 100).toFixed(1) : '0.0';

    return {
      reportId,
      title,
      category,
      sheetName: 'PV Examens',
      summaryLines: [
        `Sessions d'examen : ${exams.length}`,
        `Candidats inscrits : ${totalCandidates}`,
        `Admis cumulés : ${totalPassed} (${globalRate}%)`
      ],
      headers: [
        'Épreuve / Examen',
        'Niveau',
        'Date',
        'Candidats',
        'Présents',
        'Admis',
        'Réussite (%)',
        'Moy. Générale',
        'Statut'
      ],
      rows: exams.map(ex => [
        ex.title,
        ex.level,
        ex.date,
        ex.candidatesCount,
        ex.presentCount,
        ex.passedCount,
        `${ex.successRate.toFixed(1)}%`,
        Number(ex.classAverage.toFixed(2)),
        ex.status === 'publie'
          ? 'Publié'
          : ex.status === 'valide'
          ? 'Validé'
          : ex.status === 'rejete'
          ? 'Rejeté'
          : 'En attente'
      ])
    };
  }

  // rep-04: Assiduité & Discipline
  const students = data.studentRecords;
  const incidents = data.disciplineIncidents;
  const totalAbsences = students.reduce((sum, s) => sum + s.absencesHours, 0);
  const atRisk = students.filter(
    s => s.riskCategory === 'a_risque' || s.riskCategory === 'absenteisme_critique'
  ).length;

  return {
    reportId,
    title,
    category,
    sheetName: 'Assiduite et Discipline',
    summaryLines: [
      `Élèves sous suivi : ${students.length}`,
      `Volume total d'absences relevées : ${totalAbsences}h`,
      `Élèves en situation critique / à risque : ${atRisk}`,
      `Dossiers disciplinaires enregistrés : ${incidents.length}`
    ],
    headers: [
      'Matricule',
      'Élève',
      'Classe',
      'Moyenne /20',
      'Absences Totales (h)',
      'Non Justifiées (h)',
      'Retards',
      'Conduite /20',
      'Niveau Vigilance'
    ],
    rows: students.map(s => [
      s.matricule,
      `${s.firstName} ${s.lastName}`,
      s.className,
      Number(s.generalAverage.toFixed(2)),
      s.absencesHours,
      s.unjustifiedAbsencesHours,
      s.delaysCount,
      s.conductScore,
      s.riskCategory === 'excellent'
        ? "Tableau d'Honneur"
        : s.riskCategory === 'absenteisme_critique'
        ? 'Absentéisme Critique'
        : s.riskCategory === 'a_risque'
        ? 'À risque décrochage'
        : s.riskCategory === 'en_difficulte'
        ? 'En difficulté'
        : 'Régulier'
    ])
  };
}

export function downloadDirectorReportPdf(params: {
  reportId: string;
  title: string;
  category: string;
  schoolName: string;
  directorName: string;
  data: DirectorReportLiveData;
}): string {
  const dataset = buildDirectorReportDataset(
    params.reportId,
    params.title,
    params.category,
    params.data
  );
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Official Header Banner
  doc.setFillColor(15, 39, 86);
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Guinea flag ribbon accent
  doc.setFillColor(206, 17, 38);
  doc.rect(0, 26, pageWidth / 3, 1.5, 'F');
  doc.setFillColor(252, 209, 22);
  doc.rect(pageWidth / 3, 26, pageWidth / 3, 1.5, 'F');
  doc.setFillColor(0, 148, 96);
  doc.rect((pageWidth / 3) * 2, 26, pageWidth / 3, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(pdfSafe(params.schoolName.toUpperCase()), 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    pdfSafe("République de Guinée - MEPU-A · Direction des Études"),
    14,
    18
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(pdfSafe(`Catégorie : ${dataset.category}`), pageWidth - 14, 11, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(
    pdfSafe(`Édité le ${new Date().toLocaleDateString('fr-FR')}`),
    pageWidth - 14,
    18,
    { align: 'right' }
  );

  // Title & Metadata
  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(pdfSafe(dataset.title), 14, 37);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(pdfSafe(`Directeur des Études : ${params.directorName}`), 14, 43);

  // Summary KPI Box
  doc.setFillColor(240, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(14, 47, pageWidth - 28, 16, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  const summaryText = dataset.summaryLines.map(pdfSafe).join('   |   ');
  doc.text(summaryText, 18, 56.5, { maxWidth: pageWidth - 36 });

  autoTable(doc, {
    startY: 68,
    head: [dataset.headers.map(h => pdfSafe(h))],
    body: dataset.rows.map(row => row.map(cell => pdfSafe(cell))),
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14, bottom: 18 },
    didDrawPage: (hookData) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        pdfSafe(`SmartSchool ERP Guinée - Document certifié par ${params.directorName}`),
        14,
        pageHeight - 8
      );
      doc.text(
        `Page ${hookData.pageNumber} / ${pageCount}`,
        pageWidth - 14,
        pageHeight - 8,
        { align: 'right' }
      );
    }
  });

  const filename = `${slugifyFilename(params.title)}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  return filename;
}

export function downloadDirectorReportExcel(params: {
  reportId: string;
  title: string;
  category: string;
  schoolName: string;
  directorName: string;
  data: DirectorReportLiveData;
}): string {
  const dataset = buildDirectorReportDataset(
    params.reportId,
    params.title,
    params.category,
    params.data
  );

  const sheetRows: (string | number)[][] = [
    [params.schoolName.toUpperCase()],
    [dataset.title],
    [`Catégorie : ${dataset.category}`, '', `Directeur : ${params.directorName}`, '', `Date : ${new Date().toLocaleDateString('fr-FR')}`],
    ['Synthèse :', ...dataset.summaryLines],
    [],
    dataset.headers,
    ...dataset.rows
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetRows);

  // Auto-calculate comfortable column widths
  const colWidths = dataset.headers.map((header, colIdx) => {
    const maxLen = Math.max(
      header.length,
      ...dataset.rows.map(r => String(r[colIdx] ?? '').length)
    );
    return { wch: Math.min(Math.max(maxLen + 4, 14), 42) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, dataset.sheetName.slice(0, 31));

  const filename = `${slugifyFilename(params.title)}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
  return filename;
}

export function downloadBulletinPdf(card: StudentReportCard, schoolName: string): string {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Official Top Header
  doc.setFillColor(15, 39, 86);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(206, 17, 38);
  doc.rect(0, 28, pageWidth / 3, 1.5, 'F');
  doc.setFillColor(252, 209, 22);
  doc.rect(pageWidth / 3, 28, pageWidth / 3, 1.5, 'F');
  doc.setFillColor(0, 148, 96);
  doc.rect((pageWidth / 3) * 2, 28, pageWidth / 3, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(pdfSafe(schoolName.toUpperCase()), 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe("Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation (MEPU-A)"), 14, 17);
  doc.text(pdfSafe("République de Guinée - Travail - Justice - Solidarité"), 14, 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(pdfSafe('BULLETIN DE NOTES'), pageWidth - 14, 12, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe(`${card.termName} - ${card.academicYear}`), pageWidth - 14, 18, { align: 'right' });
  doc.text(
    pdfSafe(card.directorStatus === 'approuve' ? 'Statut : CERTIFIÉ & SIGNÉ' : 'Statut : SPÉCIMEN DIRECTION'),
    pageWidth - 14,
    23,
    { align: 'right' }
  );

  // Student Info Box
  doc.setFillColor(240, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(14, 35, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(pdfSafe(card.studentName), 18, 43);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(pdfSafe(`Matricule : ${card.studentMatricule}`), 18, 49);
  doc.text(pdfSafe(`Classe : ${card.className} (${card.level})`), 18, 55);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(5, 150, 105);
  doc.text(pdfSafe(`Moyenne : ${card.generalAverage.toFixed(2)} / 20`), pageWidth - 18, 43, { align: 'right' });
  doc.setTextColor(15, 39, 86);
  doc.setFontSize(9.5);
  doc.text(pdfSafe(`Rang : ${card.classRank}e / ${card.totalStudentsInClass}`), pageWidth - 18, 49, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(pdfSafe(`Moy. Classe : ${card.classAverage.toFixed(2)}/20`), pageWidth - 18, 55, { align: 'right' });

  // Grades Table
  autoTable(doc, {
    startY: 64,
    head: [[
      'Matière',
      'Coef',
      'Devoirs /20',
      'Examen /20',
      'Moyenne /20',
      'Appréciation',
      'Enseignant'
    ]],
    body: card.grades.map(g => [
      pdfSafe(g.subjectName),
      g.coefficient,
      g.continuousNote.toFixed(2),
      g.examNote.toFixed(2),
      g.finalNote.toFixed(2),
      pdfSafe(g.appreciation),
      pdfSafe(g.teacherName)
    ]),
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2.8, textColor: [30, 41, 59] },
    headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      1: { halign: 'center', cellWidth: 12 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'center', cellWidth: 22, fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 }
  });

  const finalY = ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 150) + 8;

  // Attendance & Council Decision Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, finalY, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 39, 86);
  doc.text(pdfSafe(`Décision du Conseil de Classe : ${card.councilDecision}`), 18, finalY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    pdfSafe(`Assiduité : ${card.absencesHours}h d'absences (${card.unjustifiedAbsencesHours}h non justifiées) - ${card.delaysCount} retards`),
    18,
    finalY + 13
  );
  doc.text(pdfSafe(`Conduite : "${card.conductAppreciation}"`), 18, finalY + 19, { maxWidth: pageWidth - 36 });

  // Director Visa & Signature Box
  const sigY = finalY + 34;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(134, 239, 172);
  doc.roundedRect(14, sigY, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(6, 95, 70);
  doc.text(pdfSafe('VISA & SIGNATURE NUMÉRIQUE DU DIRECTEUR DES ÉTUDES'), 18, sigY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(
    pdfSafe(`Observation : ${card.directorObservation || "En attente d'observation."}`),
    18,
    sigY + 14,
    { maxWidth: pageWidth - 36 }
  );

  if (card.directorStatus === 'approuve') {
    doc.setFont('helvetica', 'bold');
    doc.text(
      pdfSafe(`Signé par : ${card.validatedBy || 'Direction des Études'} le ${card.validatedAt || ''}`),
      18,
      sigY + 23
    );
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.text(pdfSafe(card.signatureHash || 'CERT-SMARTSCHOOL-GN'), pageWidth - 18, sigY + 23, { align: 'right' });
  } else {
    doc.setTextColor(180, 83, 9);
    doc.text(pdfSafe('Document provisoire - En attente de signature PIN du Directeur'), 18, sigY + 23);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    pdfSafe(`SmartSchool ERP Guinée - Bulletin officiel généré le ${new Date().toLocaleDateString('fr-FR')}`),
    14,
    pageHeight - 10
  );

  const filename = `Bulletin_${slugifyFilename(card.studentName)}_${slugifyFilename(card.termName)}.pdf`;
  doc.save(filename);
  return filename;
}

export function downloadArticlePdf(item: DirectorNewsItem, schoolName: string): string {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(15, 39, 86);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(pdfSafe(schoolName.toUpperCase()), 14, 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe(`Publication Officielle - Catégorie : ${item.category}`), 14, 18);

  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(pdfSafe(item.title), pageWidth - 28);
  doc.text(titleLines, 14, 38);

  const afterTitleY = 38 + titleLines.length * 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(pdfSafe(`Publié le ${item.date} par ${item.author}`), 14, afterTitleY + 2);

  doc.setFillColor(240, 246, 255);
  doc.setDrawColor(191, 219, 254);
  const summaryLines = doc.splitTextToSize(pdfSafe(item.summary), pageWidth - 36);
  const summaryBoxH = summaryLines.length * 5.5 + 8;
  doc.roundedRect(14, afterTitleY + 8, pageWidth - 28, summaryBoxH, 2, 2, 'FD');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text(summaryLines, 18, afterTitleY + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  const bodyLines = doc.splitTextToSize(pdfSafe(item.content), pageWidth - 28);
  doc.text(bodyLines, 14, afterTitleY + summaryBoxH + 18);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(pdfSafe(`SmartSchool ERP Guinée - ${schoolName}`), 14, pageHeight - 10);

  const rawName = item.pdfFilename?.replace(/\.pdf$/i, '') || item.title;
  const filename = `${slugifyFilename(rawName)}.pdf`;
  doc.save(filename);
  return filename;
}

export function downloadSchoolAdminExcel(params: {
  schoolName: string;
  schoolCode: string;
  studentsCount: number;
  teachersCount: number;
  adminStaffCount: number;
  classes: SchoolClass[];
  rooms: SchoolRoom[];
}): string {
  const wb = XLSX.utils.book_new();

  const classesSheetData: (string | number)[][] = [
    [`${params.schoolName} (${params.schoolCode}) - Répartition des Classes`],
    [`Total Élèves : ${params.studentsCount}`, `Enseignants : ${params.teachersCount}`, `Admin/Appui : ${params.adminStaffCount}`],
    [],
    ['Classe', 'Niveau', 'Section', 'Salle Principale', 'Inscrits', 'Capacité', 'Occupation (%)'],
    ...params.classes.map(c => [
      c.name,
      c.level,
      c.section,
      c.mainRoomName,
      c.studentsCount,
      c.capacity,
      `${c.capacity > 0 ? Math.round((c.studentsCount / c.capacity) * 100) : 0}%`
    ])
  ];
  const wsClasses = XLSX.utils.aoa_to_sheet(classesSheetData);
  wsClasses['!cols'] = [{ wch: 24 }, { wch: 14 }, { wch: 24 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsClasses, 'Classes');

  const roomsSheetData: (string | number)[][] = [
    [`${params.schoolName} (${params.schoolCode}) - Parc Immobilier & Salles`],
    [],
    ['Salle', 'Type', 'Capacité', 'Affectation Actuelle', 'Statut'],
    ...params.rooms.map(r => [
      r.name,
      r.type,
      r.capacity,
      r.currentOccupation || 'Disponible',
      r.currentOccupation ? 'Occupée' : 'Libre'
    ])
  ];
  const wsRooms = XLSX.utils.aoa_to_sheet(roomsSheetData);
  wsRooms['!cols'] = [{ wch: 24 }, { wch: 20 }, { wch: 12 }, { wch: 24 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsRooms, 'Salles');

  const filename = `Rapport_Etablissement_${slugifyFilename(params.schoolCode)}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
  return filename;
}

export function downloadSchoolAdminPdf(params: {
  schoolName: string;
  schoolCode: string;
  academicYear: string;
  studentsCount: number;
  teachersCount: number;
  adminStaffCount: number;
  classes: SchoolClass[];
  rooms: SchoolRoom[];
}): string {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 39, 86);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(pdfSafe(`${params.schoolName.toUpperCase()} (${params.schoolCode})`), 14, 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe(`Rapport Administratif des Effectifs & Capacités - Année ${params.academicYear}`), 14, 18);

  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(
    pdfSafe(`Élèves : ${params.studentsCount}  |  Enseignants : ${params.teachersCount}  |  Admin/Appui : ${params.adminStaffCount}  |  Classes : ${params.classes.length}`),
    14,
    34
  );

  autoTable(doc, {
    startY: 40,
    head: [['Classe', 'Niveau', 'Salle', 'Inscrits / Capacité', 'Occupation']],
    body: params.classes.map(c => [
      pdfSafe(c.name),
      pdfSafe(c.level),
      pdfSafe(c.mainRoomName),
      `${c.studentsCount} / ${c.capacity}`,
      `${c.capacity > 0 ? Math.round((c.studentsCount / c.capacity) * 100) : 0}%`
    ]),
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 }
  });

  const afterClassesY = ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 120) + 10;

  autoTable(doc, {
    startY: afterClassesY,
    head: [['Salle / Installation', 'Type', 'Capacité', 'Affectation', 'Statut']],
    body: params.rooms.map(r => [
      pdfSafe(r.name),
      pdfSafe(r.type),
      `${r.capacity} places`,
      pdfSafe(r.currentOccupation || 'Disponible'),
      r.currentOccupation ? 'Occupée' : 'Libre'
    ]),
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 }
  });

  const filename = `Rapport_Admin_${slugifyFilename(params.schoolCode)}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  return filename;
}

function dataUrlToBlob(dataUrl: string): Blob | null {
  try {
    const commaIdx = dataUrl.indexOf(',');
    if (commaIdx === -1) return null;
    const header = dataUrl.slice(0, commaIdx);
    const body = dataUrl.slice(commaIdx + 1);
    const mimeMatch = header.match(/^data:([^;]+)/i);
    const mime = mimeMatch?.[1] || 'application/octet-stream';
    if (/;base64/i.test(header)) {
      const binary = atob(body);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Blob([bytes], { type: mime });
    }
    return new Blob([decodeURIComponent(body)], { type: mime });
  } catch {
    return null;
  }
}

function triggerDirectUrlDownload(url: string, filename: string): void {
  if (url.startsWith('data:')) {
    const blob = dataUrlToBlob(url);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 8000);
      return;
    }
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    const driveMatch =
      url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i) ||
      url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
    if (driveMatch?.[1]) {
      const dlUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
      const link = document.createElement('a');
      link.href = dlUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('HTTP download error');
        return res.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 8000);
      })
      .catch(() => {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    return;
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadCsvWithBom(
  filename: string,
  headers: string[],
  rows: (string | number | undefined | null)[][],
  separator = ';'
): void {
  const escapeCell = (val: string | number | undefined | null) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };
  const csvLines = [
    headers.map(escapeCell).join(separator),
    ...rows.map(r => r.map(escapeCell).join(separator))
  ];
  const csvContent = '\uFEFF' + csvLines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  triggerDirectUrlDownload(url, filename.endsWith('.csv') ? filename : `${filename}.csv`);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function downloadCourseResourceFile(params: {
  title: string;
  subject: string;
  teacherName?: string;
  className?: string;
  date?: string;
  description?: string;
  objectives?: string[];
  resourceName?: string;
  resourceType?: string;
  fileUrl?: string;
  schoolName?: string;
}): string {
  const url = (params.fileUrl || '').trim();
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    const ext = params.resourceType ? `.${params.resourceType.toLowerCase()}` : '.pdf';
    const raw = params.resourceName || `${slugifyFilename(params.title)}${ext}`;
    triggerDirectUrlDownload(url, raw);
    return raw;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const school = params.schoolName || "Lycée d'Excellence de Conakry";

  doc.setFillColor(15, 39, 86);
  doc.rect(0, 0, pageWidth, 26, 'F');
  doc.setFillColor(206, 17, 38);
  doc.rect(0, 26, pageWidth / 3, 1.5, 'F');
  doc.setFillColor(252, 209, 22);
  doc.rect(pageWidth / 3, 26, pageWidth / 3, 1.5, 'F');
  doc.setFillColor(0, 148, 96);
  doc.rect((pageWidth / 3) * 2, 26, pageWidth / 3, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(pdfSafe(school.toUpperCase()), 14, 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe('Support de Cours Officiel · Programme National MEPU-A'), 14, 18);

  doc.setFont('helvetica', 'bold');
  doc.text(pdfSafe(params.subject.toUpperCase()), pageWidth - 14, 11, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(pdfSafe(params.date || new Date().toLocaleDateString('fr-FR')), pageWidth - 14, 18, { align: 'right' });

  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  const titleLines = doc.splitTextToSize(pdfSafe(params.title), pageWidth - 28);
  doc.text(titleLines, 14, 38);

  let y = 38 + titleLines.length * 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const metaParts = [
    params.teacherName ? `Enseignant : ${params.teacherName}` : '',
    params.className ? `Classe : ${params.className}` : '',
    params.resourceName ? `Fichier : ${params.resourceName}` : ''
  ].filter(Boolean);
  if (metaParts.length > 0) {
    doc.text(pdfSafe(metaParts.join('  |  ')), 14, y);
    y += 8;
  }

  // Content box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  const desc =
    params.description ||
    `Support pédagogique complet pour le module "${params.title}" (${params.subject}).`;
  const descLines = doc.splitTextToSize(pdfSafe(desc), pageWidth - 36);
  const boxH = Math.max(24, descLines.length * 5.5 + 12);
  doc.roundedRect(14, y, pageWidth - 28, boxH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text(pdfSafe('Résumé & Contenu du Chapitre'), 18, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text(descLines, 18, y + 14);
  y += boxH + 8;

  if (params.objectives && params.objectives.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 39, 86);
    doc.text(pdfSafe('Objectifs Pédagogiques :'), 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    params.objectives.forEach((obj) => {
      const lines = doc.splitTextToSize(pdfSafe(`- ${obj}`), pageWidth - 32);
      doc.text(lines, 18, y);
      y += lines.length * 5 + 1.5;
    });
    y += 4;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 39, 86);
  doc.text(pdfSafe('Plan d’Étude & Travaux Dirigés :'), 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const notes = [
    '1. Assimiler les définitions, théorèmes et formules clés présentés en classe.',
    '2. Refaire étape par étape les exemples résolus du chapitre.',
    '3. Préparer les exercices d’application avant la prochaine séance de TD.',
    '4. Consulter les manuels de référence complémentaires dans la Médiathèque Numérique.'
  ];
  notes.forEach((n) => {
    doc.text(pdfSafe(n), 18, y);
    y += 5.5;
  });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    pdfSafe(`SmartSchool ERP Guinée - Document pédagogique téléchargé le ${new Date().toLocaleDateString('fr-FR')}`),
    14,
    pageHeight - 10
  );

  const baseName = params.resourceName?.replace(/\.[^.]+$/, '') || params.title;
  const filename = `${slugifyFilename(baseName)}.pdf`;
  doc.save(filename);
  return filename;
}

export function downloadHomeworkStatementPdf(params: {
  title: string;
  subject: string;
  teacherName: string;
  className?: string;
  assignedDate: string;
  dueDate: string;
  maxScore: number;
  description: string;
  schoolName?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}): string {
  if (params.attachmentUrl && (params.attachmentUrl.startsWith('data:') || params.attachmentUrl.startsWith('blob:'))) {
    const name = params.attachmentName || `${slugifyFilename(params.title)}.pdf`;
    triggerDirectUrlDownload(params.attachmentUrl, name);
    return name;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const school = params.schoolName || "Lycée d'Excellence de Conakry";

  doc.setFillColor(180, 83, 9);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.text(pdfSafe(school.toUpperCase()), 14, 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe("ÉNONCÉ OFFICIEL DE DEVOIR / TRAVAIL DIRIGÉ · MEPU-A"), 14, 18);

  doc.setFont('helvetica', 'bold');
  doc.text(pdfSafe(params.subject.toUpperCase()), pageWidth - 14, 10.5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(pdfSafe(`Barème : / ${params.maxScore} pts`), pageWidth - 14, 18, { align: 'right' });

  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  const titleLines = doc.splitTextToSize(pdfSafe(params.title), pageWidth - 28);
  doc.text(titleLines, 14, 38);

  let y = 38 + titleLines.length * 7;

  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(120, 53, 15);
  doc.text(pdfSafe(`Enseignant : ${params.teacherName}`), 18, y + 7);
  if (params.className) {
    doc.text(pdfSafe(`Classe : ${params.className}`), pageWidth - 18, y + 7, { align: 'right' });
  }
  doc.text(pdfSafe(`Donné le : ${params.assignedDate}`), 18, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(pdfSafe(`Date limite de remise : ${params.dueDate}`), pageWidth - 18, y + 14, { align: 'right' });

  y += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 86);
  doc.text(pdfSafe('Consignes et Sujet du Devoir :'), 14, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const bodyLines = doc.splitTextToSize(pdfSafe(params.description), pageWidth - 28);
  doc.text(bodyLines, 14, y);
  y += bodyLines.length * 5.8 + 10;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 58, 138);
  doc.text(pdfSafe('Modalités de remise :'), 18, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(pdfSafe('- Rédigez soigneusement en indiquant votre Nom, Prénom, Classe et Matricule.'), 18, y + 13.5);
  doc.text(pdfSafe('- Déposez votre copie numérisée (PDF ou photo claire) sur votre Espace Élève avant la date limite.'), 18, y + 19.5);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(pdfSafe(`SmartSchool ERP Guinée - Énoncé généré le ${new Date().toLocaleDateString('fr-FR')}`), 14, pageHeight - 10);

  const filename = `Enonce_${slugifyFilename(params.subject)}_${slugifyFilename(params.title)}.pdf`;
  doc.save(filename);
  return filename;
}

export function downloadSubmittedHomeworkFile(params: {
  studentName: string;
  studentMatricule: string;
  homeworkTitle: string;
  fileName: string;
  fileUrl?: string;
  submittedAt: string;
  grade?: number;
  maxScore: number;
  teacherComment?: string;
}): string {
  const url = (params.fileUrl || '').trim();
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    triggerDirectUrlDownload(url, params.fileName || `Copie_${slugifyFilename(params.studentName)}.pdf`);
    return params.fileName;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(15, 39, 86);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(pdfSafe('COPIE NUMÉRISÉE & FICHE DE CORRECTION'), 14, 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe(`Fichier : ${params.fileName}  |  Remis le : ${params.submittedAt}`), 14, 18);

  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(pdfSafe(params.homeworkTitle), 14, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(pdfSafe(`Élève : ${params.studentName} (${params.studentMatricule})`), 14, 44);
  doc.text(
    pdfSafe(`Note : ${params.grade !== undefined ? `${params.grade} / ${params.maxScore}` : 'En attente de notation'}`),
    14,
    51
  );

  if (params.teacherComment) {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(134, 239, 172);
    doc.roundedRect(14, 58, pageWidth - 28, 30, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70);
    doc.text(pdfSafe('Annotation de l’enseignant :'), 18, 65);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(pdfSafe(params.teacherComment), pageWidth - 36);
    doc.text(lines, 18, 72);
  }

  const filename = `${slugifyFilename(params.fileName.replace(/\.[^.]+$/, ''))}.pdf`;
  doc.save(filename);
  return filename;
}

export function downloadSyllabusPdf(params: {
  subjectName: string;
  level: string;
  coefficient: number;
  classNames: string[];
  hoursCompleted: number;
  hoursTotal: number;
  chaptersCount: number;
  summary: string;
  teacherName?: string;
  schoolName?: string;
}): string {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const school = params.schoolName || "Lycée d'Excellence de Conakry";

  doc.setFillColor(88, 28, 135);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(pdfSafe(school.toUpperCase()), 14, 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe('Programme Officiel MEPU-A / Syllabus Pédagogique'), 14, 18);

  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(pdfSafe(`Syllabus Officiel : ${params.subjectName}`), 14, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(
    pdfSafe(`Niveau : ${params.level}  |  Coefficient : ${params.coefficient}  |  Volume horaire : ${params.hoursCompleted}h / ${params.hoursTotal}h (${params.chaptersCount} chapitres)`),
    14,
    46
  );
  doc.text(pdfSafe(`Classes concernées : ${params.classNames.join(', ')}`), 14, 53);
  if (params.teacherName) {
    doc.text(pdfSafe(`Enseignant Titulaire : ${params.teacherName}`), 14, 60);
  }

  doc.setFillColor(245, 243, 255);
  doc.setDrawColor(196, 181, 253);
  const summaryLines = doc.splitTextToSize(pdfSafe(params.summary), pageWidth - 36);
  const boxH = Math.max(28, summaryLines.length * 5.8 + 14);
  doc.roundedRect(14, 68, pageWidth - 28, boxH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(88, 28, 135);
  doc.text(pdfSafe('Contenu & Progression du Programme :'), 18, 76);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text(summaryLines, 18, 83);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(pdfSafe(`SmartSchool ERP Guinée - Syllabus MEPU-A édité le ${new Date().toLocaleDateString('fr-FR')}`), 14, pageHeight - 10);

  const filename = `Syllabus_${slugifyFilename(params.subjectName)}_${slugifyFilename(params.level)}.pdf`;
  doc.save(filename);
  return filename;
}

export function downloadLibraryResourcePdf(params: {
  title: string;
  author?: string;
  subject?: string;
  level?: string;
  description: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  schoolName?: string;
}): string {
  const url = (params.fileUrl || '').trim();
  if (
    url &&
    url !== '#' &&
    (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://'))
  ) {
    const filename = params.fileName?.trim() || `${slugifyFilename(params.title)}.pdf`;
    triggerDirectUrlDownload(url, filename);
    return filename;
  }

  if (params.content && params.content.startsWith('data:')) {
    const filename = params.fileName?.trim() || `${slugifyFilename(params.title)}.pdf`;
    triggerDirectUrlDownload(params.content, filename);
    return filename;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const school = params.schoolName || "Lycée d'Excellence de Conakry";

  doc.setFillColor(88, 28, 135);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(pdfSafe(school.toUpperCase()), 14, 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe('Médiathèque Numérique Scolaire · MEPU-A'), 14, 18);

  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  const titleLines = doc.splitTextToSize(pdfSafe(params.title), pageWidth - 28);
  doc.text(titleLines, 14, 36);

  let y = 36 + titleLines.length * 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const meta = [params.author ? `Auteur : ${params.author}` : '', params.subject || '', params.level || '']
    .filter(Boolean)
    .join('  |  ');
  if (meta) {
    doc.text(pdfSafe(meta), 14, y);
    y += 8;
  }

  const fullText = params.content || params.description;
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const lines = doc.splitTextToSize(pdfSafe(fullText), pageWidth - 28);

  lines.forEach((line: string) => {
    if (y > pageHeight - 18) {
      doc.addPage();
      y = 18;
    }
    doc.text(line, 14, y);
    y += 5.5;
  });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(pdfSafe(`SmartSchool ERP Guinée - Bibliothèque Numérique - ${new Date().toLocaleDateString('fr-FR')}`), 14, pageHeight - 10);

  const filename = `${slugifyFilename(params.title)}.pdf`;
  doc.save(filename);
  return filename;
}

export function downloadAccountantFinanceExcel(params: {
  schoolName: string;
  period: string;
  payments: Array<{
    reference: string;
    studentName: string;
    studentMatricule: string;
    className: string;
    feeType: string;
    amountPaidGnf: number;
    method: string;
    date: string;
    status: string;
    parentName: string;
    parentPhone: string;
  }>;
  expenses: Array<{
    reference: string;
    title: string;
    category: string;
    vendor: string;
    amountGnf: number;
    date: string;
    status: string;
  }>;
  salaries: Array<{
    staffName: string;
    role: string;
    month: string;
    baseSalaryGnf: number;
    bonusesGnf: number;
    deductionsGnf: number;
    netSalaryGnf: number;
    status: string;
  }>;
  debtors: Array<{
    studentName: string;
    studentMatricule: string;
    className: string;
    parentName: string;
    parentPhone: string;
    totalDueGnf: number;
    amountPaidGnf: number;
    balanceRemainingGnf: number;
    dueDate: string;
  }>;
}): string {
  const wb = XLSX.utils.book_new();
  const totalCollected = params.payments
    .filter(p => p.status === 'valide')
    .reduce((sum, p) => sum + p.amountPaidGnf, 0);
  const totalExpenses = params.expenses
    .filter(e => e.status === 'valide')
    .reduce((sum, e) => sum + e.amountGnf, 0);
  const totalSalaries = params.salaries
    .filter(s => s.status === 'paye')
    .reduce((sum, s) => sum + s.netSalaryGnf, 0);
  const netSurplus = totalCollected - (totalExpenses + totalSalaries);

  const summarySheet = XLSX.utils.aoa_to_sheet([
    [`${params.schoolName} - Rapport Financier Consolidé (${params.period})`],
    [`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, 'Devise : GNF'],
    [],
    ['Indicateur Financier', 'Montant (GNF)'],
    ['Total Recettes Encaissées', totalCollected],
    ['Total Dépenses de Fonctionnement', totalExpenses],
    ['Total Masse Salariale Payée', totalSalaries],
    ['Total Charges (Dépenses + Salaires)', totalExpenses + totalSalaries],
    ['Résultat Net / Excédent', netSurplus]
  ]);
  summarySheet['!cols'] = [{ wch: 38 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Synthese');

  const paymentsSheet = XLSX.utils.aoa_to_sheet([
    ['Référence', 'Élève', 'Matricule', 'Classe', 'Type de Frais', 'Parent / Payeur', 'Tél Parent', 'Mode', 'Montant (GNF)', 'Date', 'Statut'],
    ...params.payments.map(p => [
      p.reference,
      p.studentName,
      p.studentMatricule,
      p.className,
      p.feeType,
      p.parentName,
      p.parentPhone,
      p.method,
      p.amountPaidGnf,
      p.date,
      p.status
    ])
  ]);
  paymentsSheet['!cols'] = [
    { wch: 18 }, { wch: 24 }, { wch: 16 }, { wch: 22 }, { wch: 22 },
    { wch: 24 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(wb, paymentsSheet, 'Recettes');

  const expensesSheet = XLSX.utils.aoa_to_sheet([
    ['Référence', 'Libellé', 'Catégorie', 'Fournisseur', 'Montant (GNF)', 'Date', 'Statut'],
    ...params.expenses.map(e => [e.reference, e.title, e.category, e.vendor, e.amountGnf, e.date, e.status])
  ]);
  expensesSheet['!cols'] = [{ wch: 16 }, { wch: 30 }, { wch: 20 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, expensesSheet, 'Depenses');

  const salariesSheet = XLSX.utils.aoa_to_sheet([
    ['Personnel', 'Fonction', 'Mois', 'Salaire Base', 'Primes', 'Retenues', 'Net à Payer (GNF)', 'Statut'],
    ...params.salaries.map(s => [
      s.staffName, s.role, s.month, s.baseSalaryGnf, s.bonusesGnf, s.deductionsGnf, s.netSalaryGnf, s.status
    ])
  ]);
  salariesSheet['!cols'] = [{ wch: 26 }, { wch: 22 }, { wch: 14 }, { wch: 15 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, salariesSheet, 'Salaires');

  const debtorsSheet = XLSX.utils.aoa_to_sheet([
    ['Élève', 'Matricule', 'Classe', 'Parent / Tuteur', 'Téléphone Parent', 'Total Dû (GNF)', 'Payé (GNF)', 'Reste Dû (GNF)', 'Échéance'],
    ...params.debtors.map(d => [
      d.studentName, d.studentMatricule, d.className, d.parentName, d.parentPhone,
      d.totalDueGnf, d.amountPaidGnf, d.balanceRemainingGnf, d.dueDate
    ])
  ]);
  debtorsSheet['!cols'] = [{ wch: 24 }, { wch: 16 }, { wch: 22 }, { wch: 24 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, debtorsSheet, 'Debiteurs');

  const filename = `Bilan_Financier_${params.period}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
  return filename;
}

export function downloadPlatformRevenueExcel(
  transactions: Array<{
    invoiceNumber: string;
    schoolName: string;
    planId: string;
    amountGnf: number;
    date: string;
    dueDate: string;
    paymentMethod: string;
    status: string;
    reference: string;
  }>
): string {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ['SmartSchool Technologies SARL - Journal des Revenus Plateforme (GNF)'],
    [`Date : ${new Date().toLocaleDateString('fr-FR')}`],
    [],
    ['N° Facture', 'Établissement', 'Formule', 'Montant (GNF)', 'Date', 'Échéance', 'Méthode', 'Statut', 'Référence'],
    ...transactions.map(t => [
      t.invoiceNumber,
      t.schoolName,
      t.planId.toUpperCase(),
      t.amountGnf,
      t.date,
      t.dueDate,
      t.paymentMethod,
      t.status,
      t.reference
    ])
  ]);
  ws['!cols'] = [
    { wch: 18 }, { wch: 30 }, { wch: 14 }, { wch: 16 }, { wch: 14 },
    { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 22 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Revenus Plateforme');
  const filename = `Revenus_SmartSchool_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
  return filename;
}

export function downloadUsersExcel(
  accounts: Array<{
    lastName?: string;
    firstName?: string;
    name: string;
    role: string;
    matricule: string;
    email: string;
    plainPassword?: string;
    password?: string;
    schoolName: string;
    status: string;
  }>
): string {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ['Registre National des Comptes SmartSchool ERP (MEPU-A)'],
    [`Date d'export : ${new Date().toLocaleDateString('fr-FR')}`, `Total : ${accounts.length} comptes`],
    [],
    ['Nom', 'Prénom', 'Nom Complet', 'Rôle', 'Matricule', 'Email / Identifiant', 'Mot de passe Initial', 'Établissement', 'Statut'],
    ...accounts.map(a => [
      a.lastName || '',
      a.firstName || '',
      a.name,
      a.role,
      a.matricule,
      a.email,
      a.plainPassword || a.password || 'Personnel (Chiffré SHA-256)',
      a.schoolName,
      a.status
    ])
  ]);
  ws['!cols'] = [
    { wch: 16 }, { wch: 18 }, { wch: 24 }, { wch: 16 }, { wch: 16 },
    { wch: 32 }, { wch: 20 }, { wch: 28 }, { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Comptes');
  const filename = `Registre_Comptes_SmartSchool_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
  return filename;
}

export function downloadSchoolsListPdf(params: {
  schools: School[];
  plans: SubscriptionPlan[];
  filterSummary?: string;
}): string {
  const { schools, plans, filterSummary } = params;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const generatedAt = new Date().toLocaleString('fr-FR');

  // Top Header Banner
  doc.setFillColor(15, 39, 86);
  doc.rect(0, 0, pageWidth, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(pdfSafe('SMARTSCHOOL ERP GUINEE (MEPU-A) - RAPPORT DES ETABLISSEMENTS'), 14, 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(pdfSafe(`Généré le ${generatedAt}${filterSummary ? `  |  Filtre : ${filterSummary}` : ''}`), 14, 19);

  // Summary Strip
  const activeCount = schools.filter(s => s.status === 'active').length;
  const suspendedCount = schools.filter(s => s.status === 'suspended').length;
  const archivedCount = schools.filter(s => s.status === 'archived').length;
  const totalStudents = schools.reduce((sum, s) => sum + (s.stats?.studentsCount || 0), 0);
  const totalTeachers = schools.reduce((sum, s) => sum + (s.stats?.teachersCount || 0), 0);
  const totalRevenue = schools.reduce((sum, s) => sum + (s.stats?.monthlyRevenueGnf || 0), 0);

  doc.setFillColor(240, 245, 250);
  doc.roundedRect(14, 31, pageWidth - 28, 12, 2, 2, 'F');
  doc.setTextColor(15, 39, 86);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    pdfSafe(
      `Établissements : ${schools.length} (Actifs: ${activeCount}, Suspendus: ${suspendedCount}, Archivés: ${archivedCount})   |   Élèves : ${totalStudents.toLocaleString('fr-FR')}   |   Enseignants : ${totalTeachers.toLocaleString('fr-FR')}   |   Revenu Mensuel : ${totalRevenue.toLocaleString('fr-FR')} GNF`
    ),
    18,
    38.5
  );

  const statusLabel = (status: School['status']) =>
    status === 'active' ? 'Actif' : status === 'suspended' ? 'Suspendu' : 'Archivé';

  autoTable(doc, {
    startY: 48,
    head: [[
      '#',
      'Code',
      'Établissement',
      'Type',
      'Ville / Préfecture',
      'Téléphone / Email',
      'Élèves',
      'Profs',
      'Formule SaaS',
      'Revenu / mois',
      'Statut',
    ]],
    body: schools.map((s, idx) => {
      const plan = plans.find(p => p.id === s.subscriptionTier);
      const planName = plan ? plan.name.split('(')[0].trim() : s.subscriptionTier.toUpperCase();
      return [
        String(idx + 1),
        pdfSafe(s.code),
        pdfSafe(s.name),
        pdfSafe(s.type),
        pdfSafe(`${s.city}, ${s.prefecture}`),
        pdfSafe([s.phone, s.email].filter(Boolean).join(' / ') || '-'),
        (s.stats?.studentsCount || 0).toLocaleString('fr-FR'),
        (s.stats?.teachersCount || 0).toLocaleString('fr-FR'),
        pdfSafe(planName),
        `${(s.stats?.monthlyRevenueGnf || 0).toLocaleString('fr-FR')} GNF`,
        statusLabel(s.status),
      ];
    }),
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
      valign: 'middle',
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 9 },
      1: { cellWidth: 22 },
      2: { cellWidth: 48, fontStyle: 'bold' },
      3: { cellWidth: 22 },
      4: { cellWidth: 34 },
      5: { cellWidth: 48 },
      6: { halign: 'right', cellWidth: 16 },
      7: { halign: 'right', cellWidth: 14 },
      8: { cellWidth: 22 },
      9: { halign: 'right', cellWidth: 28 },
      10: { halign: 'center', cellWidth: 18 },
    },
    margin: { left: 14, right: 14, bottom: 16 },
    didDrawPage: () => {
      const pageNum = doc.getNumberOfPages();
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        pdfSafe('SmartSchool ERP Guinée - Rapport administratif officiel imprimable'),
        14,
        pageHeight - 8
      );
      doc.text(
        pdfSafe(`Page ${pageNum}`),
        pageWidth - 14,
        pageHeight - 8,
        { align: 'right' }
      );
    },
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(255, 255, 255);
    doc.rect(pageWidth - 45, pageHeight - 12, 32, 6, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(pdfSafe(`Page ${i} / ${totalPages}`), pageWidth - 14, pageHeight - 8, { align: 'right' });
  }

  const filename = `Liste_Ecoles_SmartSchool_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  return filename;
}


