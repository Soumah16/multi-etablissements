import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Universal Colorful PDF, CSV & Excel Export / Print Helper
 * Zero HTML file downloads — every print/download across the entire app
 * generates a richly designed colorful PDF (plus instant CSV & Excel exports).
 */

export interface PrintOptions {
  title?: string;
  elementId?: string;
  htmlContent?: string;
  autoDownloadFallback?: boolean;
  pvcMode?: 'landscape' | 'portrait' | false;
}

type Rgb = [number, number, number];

interface DocTheme {
  id: 'finance' | 'library' | 'surveillance' | 'official' | 'academic';
  label: string;
  bannerBg: Rgb;
  accent: Rgb;
  softFill: Rgb;
  border: Rgb;
  headingText: Rgb;
}

interface ToneStyle {
  fill: Rgb;
  border: Rgb;
  accent: Rgb;
  text: Rgb;
}

interface ExtractedTable {
  title?: string;
  headers: string[];
  rows: string[][];
}

interface ResolvedImage {
  dataUrl: string;
  format: 'PNG' | 'JPEG';
  width: number;
  height: number;
  isQr: boolean;
  alt: string;
}

type DocBlock =
  | { kind: 'heading'; level: number; text: string; tone?: ToneStyle }
  | { kind: 'cards-row'; cards: Array<{ lines: string[]; tone: ToneStyle; image?: ResolvedImage }> }
  | { kind: 'callout'; lines: string[]; tone: ToneStyle; image?: ResolvedImage }
  | { kind: 'table'; table: ExtractedTable }
  | { kind: 'paragraph'; text: string; bold?: boolean }
  | { kind: 'image-row'; images: ResolvedImage[] };

interface ExtractedDocument {
  title: string;
  theme: DocTheme;
  pvcMode: 'landscape' | 'portrait' | false;
  blocks: DocBlock[];
  tables: ExtractedTable[];
  images: ResolvedImage[];
  keyValueRows: Array<[string, string]>;
  schoolSubtitle: string;
}

/**
 * Escape HTML special characters (kept for compatibility with any caller)
 */
export const escapeHtml = (unsafe: string): string => {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

function pdfSafe(input?: string | number | null): string {
  if (input === undefined || input === null) return '';
  return String(input)
    .replace(/\u00b7/g, ' - ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u0153/g, 'oe')
    .replace(/\u0152/g, 'OE')
    .replace(/\u2713|\u2714/g, 'OK')
    .replace(/\u2715|\u2716/g, 'X')
    .replace(/\u2022/g, '-')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function slugifyFilename(name: string): string {
  const cleaned = String(name || 'Document_SmartSchool')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);
  return cleaned || 'Document_SmartSchool';
}

function formatReadableTitle(raw: string): string {
  return String(raw || 'Document Officiel SmartSchool')
    .replace(/[_]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function resolveDocTheme(title: string, pvcMode: 'landscape' | 'portrait' | false): DocTheme {
  const lower = title.toLowerCase();

  if (
    /recu|quittance|facture|paie|salaire|bilan|financier|debiteur|comptab|caisse|paiement/.test(lower)
  ) {
    return {
      id: 'finance',
      label: 'FINANCE & COMPTABILITE',
      bannerBg: [6, 78, 59],
      accent: [5, 150, 105],
      softFill: [236, 253, 245],
      border: [167, 243, 208],
      headingText: [6, 95, 70]
    };
  }

  if (/livre|ebook|chapitre|biblio|etiquette|catalogue|ouvrage/.test(lower)) {
    return {
      id: 'library',
      label: 'MEDIATHEQUE & RESSOURCES',
      bannerBg: [76, 29, 149],
      accent: [109, 40, 217],
      softFill: [245, 243, 255],
      border: [221, 214, 254],
      headingText: [91, 33, 182]
    };
  }

  if (/discipline|assiduite|incident|surveillan|billet|rentree|presence|patrouille/.test(lower)) {
    return {
      id: 'surveillance',
      label: 'VIE SCOLAIRE & ASSIDUITE',
      bannerBg: [15, 76, 92],
      accent: [13, 148, 136],
      softFill: [240, 253, 250],
      border: [153, 246, 228],
      headingText: [17, 94, 89]
    };
  }

  if (pvcMode || /certificat|attestation|badge|carte|specimen|acces|fiche/.test(lower)) {
    return {
      id: 'official',
      label: pvcMode ? 'CARTE OFFICIELLE PVC CR-80' : 'ACTE ADMINISTRATIF OFFICIEL',
      bannerBg: [15, 39, 86],
      accent: [217, 119, 6],
      softFill: [255, 251, 235],
      border: [253, 230, 138],
      headingText: [15, 39, 86]
    };
  }

  return {
    id: 'academic',
    label: 'PEDAGOGIE & SCOLARITE',
    bannerBg: [15, 39, 86],
    accent: [37, 99, 235],
    softFill: [239, 246, 255],
    border: [191, 219, 254],
    headingText: [30, 58, 138]
  };
}

function detectToneFromClass(className: string, defaultTheme: DocTheme): ToneStyle {
  const cls = (className || '').toLowerCase();
  if (/emerald|green|teal/.test(cls)) {
    return {
      fill: [236, 253, 245],
      border: [110, 231, 183],
      accent: [5, 150, 105],
      text: [6, 95, 70]
    };
  }
  if (/rose|red|crimson/.test(cls)) {
    return {
      fill: [255, 241, 242],
      border: [253, 164, 175],
      accent: [225, 29, 72],
      text: [159, 18, 57]
    };
  }
  if (/amber|yellow|orange/.test(cls)) {
    return {
      fill: [255, 251, 235],
      border: [252, 211, 77],
      accent: [217, 119, 6],
      text: [146, 64, 14]
    };
  }
  if (/purple|violet|indigo/.test(cls)) {
    return {
      fill: [245, 243, 255],
      border: [196, 181, 253],
      accent: [109, 40, 217],
      text: [91, 33, 182]
    };
  }
  if (/blue|sky|cyan/.test(cls)) {
    return {
      fill: [239, 246, 255],
      border: [147, 197, 253],
      accent: [37, 99, 235],
      text: [30, 58, 138]
    };
  }
  return {
    fill: defaultTheme.softFill,
    border: defaultTheme.border,
    accent: defaultTheme.accent,
    text: defaultTheme.headingText
  };
}

function isHiddenOrIgnored(el: Element): boolean {
  if (el.classList?.contains('no-print')) return true;
  const tag = el.tagName.toUpperCase();
  if (tag === 'BUTTON' || tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return true;
  if (tag === 'SVG') {
    const w = Number(el.getAttribute('width') || 0);
    const rect = el.getBoundingClientRect?.();
    const actualW = rect?.width || w;
    // Skip tiny Lucide UI icons (< 34px)
    if (actualW < 34) return true;
  }
  try {
    if (el instanceof HTMLElement && el.style.display === 'none') return true;
  } catch {
    // ignore
  }
  return false;
}

function cleanNodeText(el: Element): string {
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll('.no-print, button, script, style, svg').forEach((n) => n.remove());
  return (clone.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCompactLines(el: Element): string[] {
  const lines: string[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const txt = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt) lines.push(txt);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const child = node as Element;
    if (isHiddenOrIgnored(child)) return;
    const tag = child.tagName.toUpperCase();
    if (tag === 'BR') {
      lines.push('\n');
      return;
    }
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      const val = (child as HTMLInputElement).value?.trim();
      if (val) lines.push(val);
      return;
    }
    const isBlock = /^(DIV|P|H1|H2|H3|H4|H5|LI|TR|SECTION|HEADER|FOOTER|ARTICLE)$/.test(tag);
    if (isBlock && lines.length > 0 && lines[lines.length - 1] !== '\n') {
      lines.push('\n');
    }
    child.childNodes.forEach(walk);
    if (isBlock && lines.length > 0 && lines[lines.length - 1] !== '\n') {
      lines.push('\n');
    }
  };

  walk(el);

  const joined = lines
    .join(' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();

  return joined
    .split('\n')
    .map((l) => l.replace(/\s{2,}/g, ' ').trim())
    .filter(Boolean);
}

async function resolveImageElement(img: HTMLImageElement): Promise<ResolvedImage | null> {
  const src = img.currentSrc || img.getAttribute('src') || '';
  if (!src) return null;
  const alt = img.getAttribute('alt') || '';
  const isQr = /qr/i.test(alt) || /qr/i.test(img.className || '');

  // Already a PNG/JPEG data URL
  if (src.startsWith('data:image/png')) {
    return {
      dataUrl: src,
      format: 'PNG',
      width: img.naturalWidth || img.width || 120,
      height: img.naturalHeight || img.height || 120,
      isQr,
      alt
    };
  }
  if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) {
    return {
      dataUrl: src,
      format: 'JPEG',
      width: img.naturalWidth || img.width || 120,
      height: img.naturalHeight || img.height || 120,
      isQr,
      alt
    };
  }

  // Try converting external or webp/svg images safely with short timeout
  return new Promise<ResolvedImage | null>((resolve) => {
    let settled = false;
    const finish = (val: ResolvedImage | null) => {
      if (!settled) {
        settled = true;
        resolve(val);
      }
    };
    const timer = setTimeout(() => finish(null), 900);

    try {
      const loader = new Image();
      loader.crossOrigin = 'anonymous';
      loader.onload = () => {
        clearTimeout(timer);
        try {
          const w = loader.naturalWidth || 160;
          const h = loader.naturalHeight || 160;
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          const ctx = c.getContext('2d');
          if (!ctx) {
            finish(null);
            return;
          }
          ctx.drawImage(loader, 0, 0, w, h);
          const png = c.toDataURL('image/png');
          finish({ dataUrl: png, format: 'PNG', width: w, height: h, isQr, alt });
        } catch {
          finish(null);
        }
      };
      loader.onerror = () => {
        clearTimeout(timer);
        finish(null);
      };
      loader.src = src;
    } catch {
      clearTimeout(timer);
      finish(null);
    }
  });
}

function extractTable(tableEl: HTMLTableElement): ExtractedTable | null {
  const headers: string[] = [];
  const rows: string[][] = [];

  const theadRows = Array.from(tableEl.querySelectorAll('thead tr'));
  if (theadRows.length > 0) {
    const headerCells = Array.from(theadRows[theadRows.length - 1].querySelectorAll('th, td'));
    headerCells.forEach((cell) => headers.push(cleanNodeText(cell)));
  }

  const bodyRows = Array.from(tableEl.querySelectorAll('tbody tr'));
  const targetRows = bodyRows.length > 0 ? bodyRows : Array.from(tableEl.querySelectorAll('tr'));

  targetRows.forEach((tr, rowIdx) => {
    if (theadRows.includes(tr)) return;
    const cells = Array.from(tr.querySelectorAll('th, td'));
    if (cells.length === 0) return;

    if (headers.length === 0 && rowIdx === 0 && cells.every((c) => c.tagName.toUpperCase() === 'TH')) {
      cells.forEach((cell) => headers.push(cleanNodeText(cell)));
      return;
    }

    const rowValues = cells.map((cell) => cleanNodeText(cell));
    if (rowValues.some((v) => v.length > 0)) {
      rows.push(rowValues);
    }
  });

  const tfootRows = Array.from(tableEl.querySelectorAll('tfoot tr'));
  tfootRows.forEach((tr) => {
    const cells = Array.from(tr.querySelectorAll('th, td'));
    const rowValues = cells.map((cell) => cleanNodeText(cell));
    if (rowValues.some((v) => v.length > 0)) {
      rows.push(rowValues);
    }
  });

  if (headers.length === 0 && rows.length === 0) return null;

  // Drop empty trailing "Actions" columns that only held UI buttons
  let finalHeaders = headers;
  let finalRows = rows;
  if (finalHeaders.length > 1) {
    const keepIndices = finalHeaders
      .map((h, idx) => {
        const isActionCol = /^(action|actions|modifier|options)$/i.test(h.trim());
        const allEmpty = finalRows.every((r) => !r[idx] || !r[idx].trim());
        return isActionCol && allEmpty ? -1 : idx;
      })
      .filter((idx) => idx >= 0);

    if (keepIndices.length > 0 && keepIndices.length < finalHeaders.length) {
      finalHeaders = keepIndices.map((idx) => finalHeaders[idx]);
      finalRows = finalRows.map((r) => keepIndices.map((idx) => r[idx] ?? ''));
    }
  }

  return {
    headers: finalHeaders,
    rows: finalRows
  };
}

async function extractDocumentFromRoot(
  rootEl: HTMLElement,
  title: string,
  pvcMode: 'landscape' | 'portrait' | false
): Promise<ExtractedDocument> {
  const theme = resolveDocTheme(title, pvcMode);
  const blocks: DocBlock[] = [];
  const tables: ExtractedTable[] = [];
  const images: ResolvedImage[] = [];
  const keyValueRows: Array<[string, string]> = [];
  const imageCache = new WeakMap<HTMLImageElement, ResolvedImage>();

  // Resolve all meaningful <img> elements in root
  const imgElements = Array.from(rootEl.querySelectorAll('img'));
  for (const img of imgElements) {
    if (isHiddenOrIgnored(img)) continue;
    const resolved = await resolveImageElement(img);
    if (resolved) {
      imageCache.set(img, resolved);
      images.push(resolved);
    }
  }

  // Also capture any <canvas> elements (e.g. badge or chart)
  const canvasElements = Array.from(rootEl.querySelectorAll('canvas'));
  for (const cv of canvasElements) {
    if (isHiddenOrIgnored(cv) || cv.width < 20 || cv.height < 20) continue;
    try {
      const dataUrl = cv.toDataURL('image/png');
      images.push({
        dataUrl,
        format: 'PNG',
        width: cv.width,
        height: cv.height,
        isQr: false,
        alt: 'Visuel'
      });
    } catch {
      // ignore tainted canvas
    }
  }

  const recordLinesAsKeyValues = (lines: string[]) => {
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 1 && colonIdx < 42 && colonIdx < line.length - 1) {
        keyValueRows.push([
          line.slice(0, colonIdx).trim(),
          line.slice(colonIdx + 1).trim()
        ]);
      } else if (line.trim()) {
        keyValueRows.push(['Information', line.trim()]);
      }
    }
  };

  const findFirstImageIn = (el: Element): ResolvedImage | undefined => {
    const img = el.querySelector('img');
    if (img && imageCache.has(img)) return imageCache.get(img);
    return undefined;
  };

  const walkBlock = (el: Element) => {
    if (isHiddenOrIgnored(el)) return;
    const tag = el.tagName.toUpperCase();

    if (tag === 'TABLE') {
      const parsed = extractTable(el as HTMLTableElement);
      if (parsed) {
        tables.push(parsed);
        blocks.push({ kind: 'table', table: parsed });
      }
      return;
    }

    if (/^H[1-4]$/.test(tag)) {
      const txt = cleanNodeText(el);
      if (txt) {
        blocks.push({
          kind: 'heading',
          level: Number(tag[1]),
          text: txt,
          tone: detectToneFromClass(el.className || '', theme)
        });
        keyValueRows.push(['Section', txt]);
      }
      return;
    }

    if (tag === 'IMG') {
      const resolved = imageCache.get(el as HTMLImageElement);
      if (resolved) {
        blocks.push({ kind: 'image-row', images: [resolved] });
      }
      return;
    }

    const cls = typeof el.className === 'string' ? el.className : '';
    const hasTableInside = Boolean(el.querySelector('table'));

    // Grid or flex row of multi-card widgets (e.g. KPIs, student/parent box, schedule cards)
    const isGridLike =
      !hasTableInside &&
      /\bgrid\b/.test(cls) &&
      el.children.length >= 2 &&
      el.children.length <= 24;

    if (isGridLike) {
      const cardItems: Array<{ lines: string[]; tone: ToneStyle; image?: ResolvedImage }> = [];
      Array.from(el.children).forEach((child) => {
        if (isHiddenOrIgnored(child)) return;
        const lines = extractCompactLines(child);
        const childImg = findFirstImageIn(child);
        if (lines.length > 0 || childImg) {
          recordLinesAsKeyValues(lines);
          cardItems.push({
            lines,
            tone: detectToneFromClass(typeof child.className === 'string' ? child.className : cls, theme),
            image: childImg
          });
        }
      });

      if (cardItems.length >= 2) {
        const perRow = cardItems.length === 2 || cardItems.length === 4 ? 2 : 3;
        for (let i = 0; i < cardItems.length; i += perRow) {
          blocks.push({
            kind: 'cards-row',
            cards: cardItems.slice(i, i + perRow)
          });
        }
        return;
      }
    }

    // Notice / Visa / Signature / Bordered Callout box (without tables)
    const isCalloutBox =
      !hasTableInside &&
      (/\brounded-/.test(cls) && /\bborder\b/.test(cls) && /\bbg-/.test(cls)) &&
      el !== rootEl;

    if (isCalloutBox && el.querySelectorAll('div').length <= 6) {
      const lines = extractCompactLines(el);
      const boxImg = findFirstImageIn(el);
      if (lines.length > 0) {
        recordLinesAsKeyValues(lines);
        blocks.push({
          kind: 'callout',
          lines,
          tone: detectToneFromClass(cls, theme),
          image: boxImg
        });
        return;
      }
    }

    if (tag === 'P' || tag === 'LI') {
      const txt = cleanNodeText(el);
      if (txt) {
        const prefix = tag === 'LI' ? '- ' : '';
        blocks.push({ kind: 'paragraph', text: `${prefix}${txt}`, bold: /\bfont-(bold|black|semibold)\b/.test(cls) });
        recordLinesAsKeyValues([txt]);
      }
      return;
    }

    // Leaf container with direct text and no nested block elements
    const hasBlockChildren = Array.from(el.children).some((c) => !isHiddenOrIgnored(c));
    if (!hasBlockChildren) {
      const txt = cleanNodeText(el);
      if (txt) {
        blocks.push({ kind: 'paragraph', text: txt, bold: /\bfont-(bold|black|semibold)\b/.test(cls) });
        recordLinesAsKeyValues([txt]);
      }
      return;
    }

    Array.from(el.children).forEach((child) => walkBlock(child));
  };

  walkBlock(rootEl);

  // Detect school subtitle if mentioned in document text
  const fullText = cleanNodeText(rootEl);
  const schoolMatch = fullText.match(/Lyc[ée]e[^.\n|·]{2,50}|Groupe Scolaire[^.\n|·]{2,50}|Coll[èe]ge[^.\n|·]{2,50}/i);
  const schoolSubtitle = schoolMatch?.[0]?.trim() || 'SmartSchool ERP Guinee - MEPU-A';

  return {
    title: formatReadableTitle(title),
    theme,
    pvcMode,
    blocks,
    tables,
    images,
    keyValueRows,
    schoolSubtitle
  };
}

function drawTricolorRibbon(doc: jsPDF, y: number, pageWidth: number) {
  const seg = pageWidth / 3;
  doc.setFillColor(206, 17, 38);
  doc.rect(0, y, seg, 1.4, 'F');
  doc.setFillColor(252, 209, 22);
  doc.rect(seg, y, seg, 1.4, 'F');
  doc.setFillColor(0, 148, 96);
  doc.rect(seg * 2, y, seg, 1.4, 'F');
}

function drawExecutiveHeader(
  doc: jsPDF,
  extracted: ExtractedDocument,
  pageWidth: number
): number {
  const { theme } = extracted;

  // Deep executive banner
  doc.setFillColor(...theme.bannerBg);
  doc.rect(0, 0, pageWidth, 27, 'F');

  // Accent right corner pill strip
  doc.setFillColor(...theme.accent);
  doc.rect(pageWidth - 78, 0, 78, 27, 'F');

  drawTricolorRibbon(doc, 27, pageWidth);

  // Left: Republic & School branding
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(pdfSafe(extracted.schoolSubtitle.toUpperCase()), 14, 10.5, { maxWidth: pageWidth - 96 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text(
    pdfSafe('Republique de Guinee - Travail - Justice - Solidarite  |  MEPU-A'),
    14,
    17
  );
  doc.text(
    pdfSafe(`Edition officielle : ${new Date().toLocaleString('fr-FR')}`),
    14,
    22.5
  );

  // Right: Category pill & format badge
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(pdfSafe(theme.label), pageWidth - 10, 11.5, { align: 'right', maxWidth: 68 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(pdfSafe('Document Certifie SmartSchool'), pageWidth - 10, 18.5, { align: 'right' });

  // Document Title block below banner
  doc.setTextColor(...theme.headingText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const titleLines = doc.splitTextToSize(pdfSafe(extracted.title), pageWidth - 52);
  doc.text(titleLines, 14, 37);

  // If document has a QR code, show a neat QR badge in the top-right title area
  const qrImg = extracted.images.find((i) => i.isQr);
  let headerBottom = 37 + titleLines.length * 6 + 3;
  if (qrImg) {
    try {
      const qrSize = 20;
      const qrX = pageWidth - 14 - qrSize;
      const qrY = 31;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...theme.border);
      doc.roundedRect(qrX - 1.5, qrY - 1.5, qrSize + 3, qrSize + 3, 2, 2, 'FD');
      doc.addImage(qrImg.dataUrl, qrImg.format, qrX, qrY, qrSize, qrSize);
      headerBottom = Math.max(headerBottom, qrY + qrSize + 5);
    } catch {
      // ignore image error
    }
  }

  // Subtle colored divider line
  doc.setDrawColor(...theme.accent);
  doc.setLineWidth(0.5);
  doc.line(14, headerBottom, pageWidth - 14, headerBottom);
  doc.setLineWidth(0.2);

  return headerBottom + 6;
}

function drawPvcBadgePdf(
  doc: jsPDF,
  extracted: ExtractedDocument
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const isPortrait = extracted.pvcMode === 'portrait';
  const cardW = isPortrait ? 53.98 : 85.6;
  const cardH = isPortrait ? 85.6 : 53.98;
  const cardX = (pageWidth - cardW) / 2;
  const cardY = 48;
  const { theme } = extracted;

  // Instruction header
  doc.setFillColor(...theme.softFill);
  doc.setDrawColor(...theme.border);
  doc.roundedRect(14, 33, pageWidth - 28, 10, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...theme.headingText);
  doc.text(
    pdfSafe(`Norme ISO/IEC 7810 ID-1 (CR-80 : ${cardW} x ${cardH} mm) - Imprimer a echelle 100% avec reperes de decoupe`),
    pageWidth / 2,
    39.2,
    { align: 'center' }
  );

  // Dashed cutting guide box
  doc.setDrawColor(148, 163, 184);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.rect(cardX - 1.5, cardY - 1.5, cardW + 3, cardH + 3);
  doc.setLineDashPattern([], 0);

  // Card body
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...theme.accent);
  doc.setLineWidth(0.5);
  doc.roundedRect(cardX, cardY, cardW, cardH, 3, 3, 'FD');
  doc.setLineWidth(0.2);

  // Card top colored header
  const topH = isPortrait ? 18 : 13;
  doc.setFillColor(...theme.bannerBg);
  doc.roundedRect(cardX, cardY, cardW, topH, 3, 3, 'F');
  doc.rect(cardX, cardY + topH - 3, cardW, 3, 'F');

  // Guinea ribbon inside card
  const seg = cardW / 3;
  doc.setFillColor(206, 17, 38);
  doc.rect(cardX, cardY + topH, seg, 1, 'F');
  doc.setFillColor(252, 209, 22);
  doc.rect(cardX + seg, cardY + topH, seg, 1, 'F');
  doc.setFillColor(0, 148, 96);
  doc.rect(cardX + seg * 2, cardY + topH, seg, 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isPortrait ? 7 : 7.5);
  doc.text(pdfSafe(extracted.schoolSubtitle.toUpperCase()), cardX + 3, cardY + 5.5, { maxWidth: cardW - 6 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.text(pdfSafe('MEPU-A  |  CARTE OFFICIELLE'), cardX + 3, cardY + (isPortrait ? 11.5 : 10));

  const qrImg = extracted.images.find((i) => i.isQr);
  const photoImg = extracted.images.find((i) => !i.isQr);

  // Extract clean text lines inside card
  const textLines = extracted.keyValueRows
    .map(([k, v]) => (k === 'Information' ? v : `${k} : ${v}`))
    .filter((l, idx, arr) => l.length > 1 && arr.indexOf(l) === idx)
    .slice(0, 8);

  if (isPortrait) {
    let curY = cardY + topH + 5;
    if (photoImg) {
      try {
        const pSize = 18;
        doc.addImage(photoImg.dataUrl, photoImg.format, cardX + (cardW - pSize) / 2, curY, pSize, pSize);
        curY += pSize + 4;
      } catch {
        // skip
      }
    }
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.2);
    textLines.forEach((line, idx) => {
      doc.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
      const wrapped = doc.splitTextToSize(pdfSafe(line), cardW - 8);
      doc.text(wrapped, cardX + cardW / 2, curY, { align: 'center' });
      curY += wrapped.length * 3.6 + 1;
    });
    if (qrImg) {
      try {
        const qSize = 16;
        doc.addImage(qrImg.dataUrl, qrImg.format, cardX + (cardW - qSize) / 2, cardY + cardH - qSize - 3, qSize, qSize);
      } catch {
        // skip
      }
    }
  } else {
    const contentY = cardY + topH + 4.5;
    let textX = cardX + 4;
    if (photoImg) {
      try {
        doc.addImage(photoImg.dataUrl, photoImg.format, cardX + 3.5, contentY, 17, 21);
        textX = cardX + 23;
      } catch {
        // skip
      }
    }
    const maxTextW = qrImg ? cardW - (textX - cardX) - 21 : cardW - (textX - cardX) - 4;
    let lineY = contentY + 2;
    doc.setTextColor(15, 23, 42);
    textLines.slice(0, 6).forEach((line, idx) => {
      if (lineY > cardY + cardH - 6) return;
      doc.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
      doc.setFontSize(idx === 0 ? 8 : 6.4);
      const wrapped = doc.splitTextToSize(pdfSafe(line), maxTextW);
      doc.text(wrapped[0] || '', textX, lineY);
      lineY += idx === 0 ? 4.5 : 3.8;
    });

    if (qrImg) {
      try {
        doc.addImage(qrImg.dataUrl, qrImg.format, cardX + cardW - 19, cardY + cardH - 20, 15.5, 15.5);
      } catch {
        // skip
      }
    }
  }

  // Details verification table below card
  if (extracted.keyValueRows.length > 0) {
    autoTable(doc, {
      startY: cardY + cardH + 14,
      head: [['Champ du Badge / Carte', 'Valeur Certifiee']],
      body: extracted.keyValueRows
        .filter((row, idx, arr) => arr.findIndex((x) => x[0] === row[0] && x[1] === row[1]) === idx)
        .slice(0, 14)
        .map(([k, v]) => [pdfSafe(k), pdfSafe(v)]),
      theme: 'grid',
      headStyles: { fillColor: theme.accent, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
      styles: { fontSize: 8.5, cellPadding: 2.8, textColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: theme.softFill },
      margin: { left: 14, right: 14 }
    });
  }
}

function resolveCellStatusStyle(val: string): { fill?: Rgb; text?: Rgb; bold?: boolean } {
  const lower = val.toLowerCase();
  if (/^(paye|payé|valide|validé|present|présent|approuve|approuvé|actif|admis|complet|disponible|recu|reçu|ok)/i.test(lower) || /tableau d'honneur|valide &|payé ✓/i.test(lower)) {
    return { fill: [236, 253, 245], text: [6, 95, 70], bold: true };
  }
  if (/^(impaye|impayé|absent|rejete|rejeté|suspendu|contentieux|critique|exclu|retard|incomplet)/i.test(lower) || /absent|impayé|retard/i.test(lower)) {
    return { fill: [255, 241, 242], text: [159, 18, 57], bold: true };
  }
  if (/en attente|partiel|emprunte|emprunté|alerte|correction/i.test(lower)) {
    return { fill: [255, 251, 235], text: [146, 64, 14], bold: true };
  }
  return {};
}

function buildColorfulPdf(
  extracted: ExtractedDocument,
  orientationOverride?: 'portrait' | 'landscape'
): { doc: jsPDF; filename: string; orientation: 'portrait' | 'landscape' } {
  const maxCols = extracted.tables.reduce((max, t) => Math.max(max, t.headers.length, t.rows[0]?.length || 0), 0);
  const autoOrientation: 'portrait' | 'landscape' =
    extracted.pvcMode
      ? 'portrait'
      : orientationOverride || (maxCols >= 7 ? 'landscape' : 'portrait');

  const doc = new jsPDF({
    orientation: autoOrientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const { theme } = extracted;

  let curY = drawExecutiveHeader(doc, extracted, pageWidth);

  const ensureSpace = (neededHeight: number) => {
    if (curY + neededHeight > pageHeight - 18) {
      doc.addPage();
      doc.setFillColor(...theme.bannerBg);
      doc.rect(0, 0, pageWidth, 6, 'F');
      drawTricolorRibbon(doc, 6, pageWidth);
      curY = 16;
    }
  };

  if (extracted.pvcMode) {
    drawPvcBadgePdf(doc, extracted);
  } else {
    // Non-QR photos (e.g. student avatar, school logo)
    const nonQrImages = extracted.images.filter((i) => !i.isQr);
    if (nonQrImages.length > 0 && extracted.blocks.length > 0) {
      const thumb = nonQrImages[0];
      try {
        const aspect = thumb.width / Math.max(thumb.height, 1);
        const h = 18;
        const w = Math.min(28, Math.max(14, h * aspect));
        doc.setDrawColor(...theme.border);
        doc.roundedRect(pageWidth - 14 - w - 1, curY - 1, w + 2, h + 2, 1.5, 1.5, 'D');
        doc.addImage(thumb.dataUrl, thumb.format, pageWidth - 14 - w, curY, w, h);
      } catch {
        // ignore
      }
    }

    const seenTexts = new Set<string>();

    for (const block of extracted.blocks) {
      if (block.kind === 'heading') {
        const key = block.text.trim();
        if (seenTexts.has(key)) continue;
        seenTexts.add(key);

        ensureSpace(12);
        const tone = block.tone || {
          fill: theme.softFill,
          border: theme.border,
          accent: theme.accent,
          text: theme.headingText
        };
        doc.setFillColor(...tone.accent);
        doc.rect(14, curY - 3.2, 2.2, 5.2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(block.level <= 2 ? 11.5 : 10);
        doc.setTextColor(...tone.text);
        const lines = doc.splitTextToSize(pdfSafe(block.text), pageWidth - 34);
        doc.text(lines, 18.5, curY);
        curY += lines.length * 5 + 3.5;
      } else if (block.kind === 'cards-row') {
        const count = block.cards.length;
        const gap = 4;
        const totalW = pageWidth - 28;
        const cardW = (totalW - gap * (count - 1)) / count;

        const prepared = block.cards.map((c) => {
          const wrappedLines: string[] = [];
          c.lines.slice(0, 8).forEach((ln) => {
            const safe = pdfSafe(ln);
            if (!safe) return;
            wrappedLines.push(...doc.splitTextToSize(safe, cardW - 8));
          });
          return { ...c, wrappedLines };
        });

        const maxLines = prepared.reduce((m, c) => Math.max(m, c.wrappedLines.length), 1);
        const cardH = Math.max(18, maxLines * 4.4 + 8);
        ensureSpace(cardH + 4);

        prepared.forEach((card, idx) => {
          const x = 14 + idx * (cardW + gap);
          doc.setFillColor(...card.tone.fill);
          doc.setDrawColor(...card.tone.border);
          doc.roundedRect(x, curY, cardW, cardH, 2, 2, 'FD');

          // Colored left accent stripe
          doc.setFillColor(...card.tone.accent);
          doc.rect(x, curY + 1.5, 1.8, cardH - 3, 'F');

          let lineY = curY + 5.5;
          card.wrappedLines.forEach((line, lIdx) => {
            doc.setFont('helvetica', lIdx === 0 ? 'bold' : 'normal');
            doc.setFontSize(lIdx === 0 ? 8.8 : 7.8);
            doc.setTextColor(...(lIdx === 0 ? card.tone.text : ([30, 41, 59] as Rgb)));
            doc.text(line, x + 4.5, lineY);
            lineY += 4.3;
          });
        });

        curY += cardH + 5;
      } else if (block.kind === 'callout') {
        const key = block.lines.join(' ');
        if (seenTexts.has(key)) continue;
        seenTexts.add(key);

        const wrapped: Array<{ text: string; bold: boolean }> = [];
        block.lines.forEach((ln, idx) => {
          const split = doc.splitTextToSize(pdfSafe(ln), pageWidth - 40);
          split.forEach((s: string) => wrapped.push({ text: s, bold: idx === 0 }));
        });
        const boxH = Math.max(16, wrapped.length * 4.5 + 8);
        ensureSpace(boxH + 4);

        doc.setFillColor(...block.tone.fill);
        doc.setDrawColor(...block.tone.border);
        doc.roundedRect(14, curY, pageWidth - 28, boxH, 2, 2, 'FD');
        doc.setFillColor(...block.tone.accent);
        doc.rect(14, curY + 1.5, 2, boxH - 3, 'F');

        let textY = curY + 6;
        wrapped.forEach((item) => {
          doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
          doc.setFontSize(item.bold ? 9 : 8.2);
          doc.setTextColor(...(item.bold ? block.tone.text : ([30, 41, 59] as Rgb)));
          doc.text(item.text, 19, textY);
          textY += 4.5;
        });

        curY += boxH + 5;
      } else if (block.kind === 'table') {
        ensureSpace(24);
        const headRow = block.table.headers.length > 0 ? [block.table.headers.map((h) => pdfSafe(h))] : undefined;
        const bodyRows = block.table.rows.map((r) => r.map((c) => pdfSafe(c)));

        autoTable(doc, {
          startY: curY,
          head: headRow,
          body: bodyRows,
          theme: 'grid',
          styles: {
            fontSize: autoOrientation === 'landscape' ? 8 : 8.2,
            cellPadding: 2.6,
            textColor: [30, 41, 59],
            lineColor: [203, 213, 225],
            lineWidth: 0.2,
            valign: 'middle'
          },
          headStyles: {
            fillColor: theme.accent,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8.2
          },
          alternateRowStyles: {
            fillColor: theme.softFill
          },
          margin: { left: 14, right: 14, bottom: 18 },
          didParseCell: (hookData) => {
            if (hookData.section === 'body') {
              const rawText = String(hookData.cell.raw || '');
              const statusStyle = resolveCellStatusStyle(rawText);
              if (statusStyle.fill) hookData.cell.styles.fillColor = statusStyle.fill;
              if (statusStyle.text) hookData.cell.styles.textColor = statusStyle.text;
              if (statusStyle.bold) hookData.cell.styles.fontStyle = 'bold';
              if (/^\s*[\d\s.,+-]+(GNF|%|\/20)?\s*$/i.test(rawText) && rawText.length < 24) {
                hookData.cell.styles.halign = 'right';
                hookData.cell.styles.fontStyle = 'bold';
              }
            }
          }
        });

        const lastY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY;
        curY = (lastY ?? curY + 20) + 6;
      } else if (block.kind === 'paragraph') {
        const key = block.text.trim();
        if (!key || seenTexts.has(key)) continue;
        seenTexts.add(key);

        const lines = doc.splitTextToSize(pdfSafe(block.text), pageWidth - 28);
        ensureSpace(lines.length * 4.8 + 4);
        doc.setFont('helvetica', block.bold ? 'bold' : 'normal');
        doc.setFontSize(block.bold ? 9.5 : 8.8);
        doc.setTextColor(...(block.bold ? theme.headingText : ([30, 41, 59] as Rgb)));
        doc.text(lines, 14, curY);
        curY += lines.length * 4.6 + 2.5;
      }
    }
  }

  // Paint consistent colorful footer with page count on ALL pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...theme.border);
    doc.line(14, ph - 13, pw - 14, ph - 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      pdfSafe(`SmartSchool ERP Guinee (MEPU-A)  -  Document officiel PDF couleur`),
      14,
      ph - 8
    );
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...theme.headingText);
    doc.text(pdfSafe(`Page ${i} / ${totalPages}`), pw - 14, ph - 8, { align: 'right' });
  }

  const datePart = new Date().toISOString().split('T')[0];
  const filename = `${slugifyFilename(extracted.title)}_${datePart}.pdf`;
  return { doc, filename, orientation: autoOrientation };
}

function downloadBlobFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 6000);
}

export function exportDocumentAsCsv(extracted: ExtractedDocument): string {
  const escapeCsvCell = (val: string | number | undefined | null) =>
    `"${String(val ?? '').replace(/"/g, '""')}"`;

  const lines: string[] = [];

  if (extracted.tables.length > 0) {
    extracted.tables.forEach((tbl, idx) => {
      if (idx > 0) lines.push('');
      if (tbl.headers.length > 0) {
        lines.push(tbl.headers.map(escapeCsvCell).join(';'));
      }
      tbl.rows.forEach((row) => {
        lines.push(row.map(escapeCsvCell).join(';'));
      });
    });
  } else {
    lines.push(['Rubrique', 'Valeur / Detail'].map(escapeCsvCell).join(';'));
    const seen = new Set<string>();
    extracted.keyValueRows.forEach(([k, v]) => {
      const sig = `${k}|${v}`;
      if (!seen.has(sig)) {
        seen.add(sig);
        lines.push([k, v].map(escapeCsvCell).join(';'));
      }
    });
  }

  const csvContent = '\uFEFF' + lines.join('\n');
  const filename = `${slugifyFilename(extracted.title)}_${new Date().toISOString().split('T')[0]}.csv`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlobFile(blob, filename);
  return filename;
}

export function exportDocumentAsExcel(extracted: ExtractedDocument): string {
  const wb = XLSX.utils.book_new();

  if (extracted.tables.length > 0) {
    extracted.tables.forEach((tbl, idx) => {
      const sheetData: string[][] = [
        [extracted.schoolSubtitle],
        [extracted.title],
        [`Edite le : ${new Date().toLocaleDateString('fr-FR')}`],
        [],
        ...(tbl.headers.length > 0 ? [tbl.headers] : []),
        ...tbl.rows
      ];
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      const colCount = Math.max(tbl.headers.length, tbl.rows[0]?.length || 1);
      ws['!cols'] = Array.from({ length: colCount }, (_, cIdx) => {
        const maxLen = Math.max(
          (tbl.headers[cIdx] || '').length,
          ...tbl.rows.map((r) => String(r[cIdx] || '').length)
        );
        return { wch: Math.min(Math.max(maxLen + 4, 14), 45) };
      });
      XLSX.utils.book_append_sheet(wb, ws, `Tableau_${idx + 1}`);
    });
  } else {
    const seen = new Set<string>();
    const rows: string[][] = [];
    extracted.keyValueRows.forEach(([k, v]) => {
      const sig = `${k}|${v}`;
      if (!seen.has(sig)) {
        seen.add(sig);
        rows.push([k, v]);
      }
    });
    const ws = XLSX.utils.aoa_to_sheet([
      [extracted.schoolSubtitle],
      [extracted.title],
      [`Edite le : ${new Date().toLocaleDateString('fr-FR')}`],
      [],
      ['Rubrique', 'Valeur / Detail'],
      ...rows
    ]);
    ws['!cols'] = [{ wch: 30 }, { wch: 56 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Document');
  }

  const filename = `${slugifyFilename(extracted.title)}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
  return filename;
}

let activePdfBlobUrl: string | null = null;

function printPdfBlobDirectly(pdfBlob: Blob) {
  try {
    if (activePdfBlobUrl) {
      URL.revokeObjectURL(activePdfBlobUrl);
      activePdfBlobUrl = null;
    }
    const pdfUrl = URL.createObjectURL(pdfBlob);
    activePdfBlobUrl = pdfUrl;

    let frame = document.getElementById('smartschool-pdf-print-frame') as HTMLIFrameElement | null;
    if (frame) frame.remove();

    frame = document.createElement('iframe');
    frame.id = 'smartschool-pdf-print-frame';
    frame.setAttribute(
      'style',
      'position:fixed;right:0;bottom:0;width:1px;height:1px;border:none;opacity:0.01;pointer-events:none;z-index:-999;'
    );
    frame.src = pdfUrl;
    document.body.appendChild(frame);

    frame.onload = () => {
      setTimeout(() => {
        try {
          frame?.contentWindow?.focus();
          frame?.contentWindow?.print();
        } catch {
          // Fallback: download PDF directly if browser sandbox blocks PDF plugin print
        }
      }, 300);
    };
  } catch {
    // ignore
  }
}

/**
 * Interactive Colorful Export Center Bar (PDF / CSV / Excel / Imprimer PDF)
 * Built with safe DOM APIs (never innerHTML) and zero HTML downloads.
 */
function showExportActionBar(
  extracted: ExtractedDocument,
  pdfResult: { doc: jsPDF; filename: string; orientation: 'portrait' | 'landscape' },
  pdfBlob: Blob
) {
  const existing = document.getElementById('smartschool-print-toast');
  if (existing) existing.remove();

  const bar = document.createElement('div');
  bar.id = 'smartschool-print-toast';
  bar.setAttribute(
    'style',
    `
    position: fixed;
    bottom: 20px;
    right: 20px;
    max-width: 460px;
    width: calc(100vw - 32px);
    background: #ffffff;
    color: #0f172a;
    border: 2px solid #2563eb;
    padding: 14px 16px;
    border-radius: 16px;
    box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.35);
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 12px;
    line-height: 1.45;
  `
  );

  // Header row
  const header = document.createElement('div');
  header.setAttribute('style', 'display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px;');

  const titleWrap = document.createElement('div');
  const badge = document.createElement('div');
  badge.setAttribute(
    'style',
    'display:inline-block;padding:2px 8px;border-radius:999px;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;font-size:10px;font-weight:700;margin-bottom:4px;'
  );
  badge.textContent = 'PDF Couleur genere avec succes';

  const heading = document.createElement('div');
  heading.setAttribute('style', 'font-weight:800;color:#0f2756;font-size:13px;');
  heading.textContent = extracted.title;

  const sub = document.createElement('div');
  sub.setAttribute('style', 'font-size:11px;color:#475569;margin-top:2px;');
  sub.textContent = `Fichier : ${pdfResult.filename}  |  Choisissez un autre format si besoin :`;

  titleWrap.appendChild(badge);
  titleWrap.appendChild(heading);
  titleWrap.appendChild(sub);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute(
    'style',
    'background:#f1f5f9;border:none;color:#475569;font-size:14px;font-weight:700;cursor:pointer;width:26px;height:26px;border-radius:8px;flex-shrink:0;'
  );
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => bar.remove());

  header.appendChild(titleWrap);
  header.appendChild(closeBtn);
  bar.appendChild(header);

  // Action buttons row
  const actions = document.createElement('div');
  actions.setAttribute('style', 'display:flex;flex-wrap:wrap;gap:6px;');

  const makeBtn = (label: string, bg: string, color: string, borderColor: string, onClick: () => void) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.setAttribute(
      'style',
      `padding:7px 11px;border-radius:10px;background:${bg};color:${color};border:1px solid ${borderColor};font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;`
    );
    btn.addEventListener('click', onClick);
    return btn;
  };

  const altOrientation: 'portrait' | 'landscape' =
    pdfResult.orientation === 'portrait' ? 'landscape' : 'portrait';

  actions.appendChild(
    makeBtn('PDF Couleur', '#1d4ed8', '#ffffff', '#1d4ed8', () => {
      downloadBlobFile(pdfBlob, pdfResult.filename);
    })
  );

  actions.appendChild(
    makeBtn(
      altOrientation === 'landscape' ? 'PDF Paysage' : 'PDF Portrait',
      '#eff6ff',
      '#1e40af',
      '#bfdbfe',
      () => {
        const rebuilt = buildColorfulPdf(extracted, altOrientation);
        rebuilt.doc.save(rebuilt.filename);
      }
    )
  );

  actions.appendChild(
    makeBtn('CSV (.csv)', '#ecfdf5', '#065f46', '#6ee7b7', () => {
      exportDocumentAsCsv(extracted);
    })
  );

  actions.appendChild(
    makeBtn('Excel (.xlsx)', '#f5f3ff', '#5b21b6', '#c4b5fd', () => {
      exportDocumentAsExcel(extracted);
    })
  );

  actions.appendChild(
    makeBtn('Imprimer PDF', '#0f172a', '#ffffff', '#0f172a', () => {
      printPdfBlobDirectly(pdfBlob);
    })
  );

  bar.appendChild(actions);
  document.body.appendChild(bar);

  setTimeout(() => {
    if (bar.parentElement) bar.remove();
  }, 15000);
}

async function runUniversalExport(
  rootEl: HTMLElement,
  title: string,
  pvcMode: 'landscape' | 'portrait' | false
): Promise<boolean> {
  try {
    const extracted = await extractDocumentFromRoot(rootEl, title, pvcMode);
    const pdfResult = buildColorfulPdf(extracted);
    const pdfBlob = pdfResult.doc.output('blob');
    downloadBlobFile(pdfBlob, pdfResult.filename);
    showExportActionBar(extracted, pdfResult, pdfBlob);
    return true;
  } catch (err) {
    console.error('Universal colorful PDF export failed:', err);
    return false;
  }
}

/**
 * Exports any HTML string or document content directly as a colorful designed PDF
 * (NEVER downloads .html). Also surfaces CSV & Excel actions.
 */
export const exportPrintableDocument = (
  title: string,
  htmlContent: string,
  pvcMode: 'landscape' | 'portrait' | false = false
): boolean => {
  try {
    const scratch = document.createElement('div');
    scratch.style.position = 'fixed';
    scratch.style.left = '-99999px';
    scratch.style.top = '0';
    scratch.style.width = '900px';
    scratch.innerHTML = htmlContent;
    document.body.appendChild(scratch);

    void runUniversalExport(scratch, title, pvcMode).finally(() => {
      if (scratch.parentElement) scratch.remove();
    });
    return true;
  } catch (e) {
    console.error('Failed to export colorful document:', e);
    return false;
  }
};

/**
 * Universal Trigger Print Function across the entire site:
 * 1. Locates target printable DOM container
 * 2. Generates and immediately downloads a richly colored, designed PDF
 * 3. Provides 1-click CSV, Excel (.xlsx), alternate orientation PDF, and direct PDF print
 * (Never downloads raw .html files)
 */
export const triggerPrint = (
  elementIdOrTitle?: string,
  customTitle?: string,
  pvcMode: 'landscape' | 'portrait' | false = false
) => {
  let targetEl: HTMLElement | null = null;
  let title = customTitle || 'Document_Officiel_SmartSchool';

  if (elementIdOrTitle) {
    const el = document.getElementById(elementIdOrTitle);
    if (el) {
      targetEl = el;
      if (!customTitle) {
        title = elementIdOrTitle;
      }
    } else {
      title = elementIdOrTitle;
    }
  }

  if (!targetEl) {
    targetEl =
      (document.querySelector('.printable-document') as HTMLElement | null) ||
      (document.querySelector('.printable-content') as HTMLElement | null) ||
      (document.querySelector('.print-paper') as HTMLElement | null) ||
      (document.querySelector('article') as HTMLElement | null) ||
      (document.querySelector('main') as HTMLElement | null) ||
      document.body;
  }

  const htmlSnapshot = targetEl.outerHTML || '';
  const autoPvc =
    pvcMode ||
    (htmlSnapshot.includes('pvc-card-portrait')
      ? 'portrait'
      : htmlSnapshot.includes('pvc-card')
      ? 'landscape'
      : false);

  void runUniversalExport(targetEl, title, autoPvc);
};
