/**
 * SmartSchool ERP - High-Fidelity Sovereign PVC Card Renderer & Exporter
 * Standard: ISO/IEC 7810 ID-1 (CR-80: 85.60 mm × 53.98 mm)
 * Resolution: 300 DPI (1012 × 638 px landscape | 638 × 1012 px portrait)
 * Uses real scannable QR codes (qrcode library) and exact physical CR-80 mm sizing.
 */

import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

export interface PvcRenderData {
  schoolName: string;
  schoolCode: string;
  categoryLabel: string;
  fullName: string;
  title: string;
  matricule: string;
  nationalUid: string;
  bloodGroup: string;
  validityPeriod: string;
  photoUrl: string;
  themeColor: string;
  accentBg: string;
  isDarkTheme: boolean;
  showNationalArms: boolean;
  showTricolorBanner: boolean;
  showOfficialStamp: boolean;
  showMicrotext: boolean;
  showWatermark: boolean;
  showBarcode: boolean;
  qrValue?: string;
  orientation?: 'landscape' | 'portrait';
  phone?: string;
  email?: string;
  footerRightText?: string;
}

function getThemeColors(themeColor: string): { start: string; end: string; lightAccent: string } {
  const hex = (themeColor || '#059669').toLowerCase();
  if (hex.includes('2563eb') || hex.includes('1e3a8a')) {
    return { start: '#1e3a8a', end: '#0f172a', lightAccent: '#93c5fd' };
  }
  if (hex.includes('d97706') || hex.includes('f59e0b')) {
    return { start: '#b45309', end: '#78350f', lightAccent: '#fde68a' };
  }
  if (hex.includes('7c3aed') || hex.includes('581c87') || hex.includes('4f46e5')) {
    return { start: '#4c1d95', end: '#1e1b4b', lightAccent: '#c4b5fd' };
  }
  if (hex.includes('be123c') || hex.includes('dc2626') || hex.includes('881337')) {
    return { start: '#9f1239', end: '#4c0519', lightAccent: '#fda4af' };
  }
  if (hex.includes('0d9488') || hex.includes('0f766e')) {
    return { start: '#0f766e', end: '#134e4a', lightAccent: '#99f6e4' };
  }
  if (hex.includes('94a3b8') || hex.includes('0f172a')) {
    return { start: '#1e293b', end: '#090d16', lightAccent: '#cbd5e1' };
  }
  return { start: '#047857', end: '#064e3b', lightAccent: '#6ee7b7' };
}

function resolveQrPayload(data: PvcRenderData): string {
  if (data.qrValue && data.qrValue.trim()) return data.qrValue.trim();
  return `MEPU-A|SMARTSCHOOL|${data.schoolCode}|${data.matricule}|${data.nationalUid}|${data.fullName}`;
}

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getInitials(name: string): string {
  const parts = String(name || 'ID').trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() || '')
    .join('') || 'ID';
}

/**
 * Builds self-contained HTML with embedded styles for infallible 1:1 CR-80 printing.
 * Real scannable QR code embedded as PNG data URL.
 */
export const buildPvcPrintSheetHtml = async (
  data: PvcRenderData,
  face: 'both' | 'recto' | 'verso' = 'both'
): Promise<string> => {
  const primaryBg = data.isDarkTheme ? '#0f172a' : '#ffffff';
  const textColor = data.isDarkTheme ? '#f8fafc' : '#0f172a';
  const subtextColor = data.isDarkTheme ? '#cbd5e1' : '#475569';
  const cardBorder = data.themeColor || '#059669';
  const theme = getThemeColors(cardBorder);
  const headerGradient = `linear-gradient(135deg, ${theme.start}, ${theme.end})`;

  const qrPayload = resolveQrPayload(data);
  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 320,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#0f172a', light: '#ffffff' }
  });

  const rectoCardHtml = `
    <div class="pvc-card" style="border: 1.5px solid ${cardBorder}; background-color: ${primaryBg}; color: ${textColor};">
      ${data.showTricolorBanner ? `
        <div class="tricolor-banner">
          <div style="background-color: #ce1126;"></div>
          <div style="background-color: #fcd116;"></div>
          <div style="background-color: #009460;"></div>
        </div>
      ` : ''}

      <div class="card-header" style="background: ${headerGradient};">
        <div class="header-left">
          ${data.showNationalArms ? `<div class="emblem-circle">GN</div>` : ''}
          <div>
            <div class="header-rep">RÉPUBLIQUE DE GUINÉE</div>
            <div class="header-motto">Travail · Justice · Solidarité</div>
          </div>
        </div>
        <div class="header-right">
          <div class="school-title">${escapeHtml(data.schoolName.toUpperCase())}</div>
          <div class="category-tag" style="color: ${theme.lightAccent};">${escapeHtml(data.categoryLabel.toUpperCase())}</div>
        </div>
      </div>

      ${data.showMicrotext ? `
        <div class="microtext">
          MEPU-A · SMARTSCHOOL ERP SOVEREIGN ID · RÉPUBLIQUE DE GUINÉE · ${escapeHtml(data.matricule)}
        </div>
      ` : ''}

      <div class="card-body">
        ${data.showWatermark ? `
          <div class="watermark">
            <div class="wm-text">MEPU-A</div>
            <div class="wm-sub">GUINÉE SOUVERAIN</div>
          </div>
        ` : ''}

        <div class="photo-box">
          <img src="${escapeHtml(data.photoUrl)}" alt="Photo" class="id-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="photo-fallback" style="display: none;">${escapeHtml(getInitials(data.fullName))}</div>
          <div class="photo-tag">ID CERTIFIÉE</div>
        </div>

        <div class="id-details">
          <div class="id-sub">Identité du Porteur</div>
          <div class="id-name" style="color: ${textColor};">${escapeHtml(data.fullName)}</div>
          <div class="id-role" style="color: ${data.isDarkTheme ? theme.lightAccent : cardBorder};">${escapeHtml(data.title)}</div>

          <div class="meta-grid" style="color: ${subtextColor};">
            <div>
              <span class="label">Matricule : </span>
              <span class="value" style="font-family: monospace; font-weight: bold; color: ${textColor};">${escapeHtml(data.matricule)}</span>
            </div>
            <div>
              <span class="label">Sang : </span>
              <span class="value" style="color: #dc2626; font-weight: bold;">${escapeHtml(data.bloodGroup || 'O+')}</span>
            </div>
            <div style="grid-column: span 2;">
              <span class="label">UID : </span>
              <span class="value-uid" style="color: ${data.isDarkTheme ? '#94a3b8' : '#0f172a'};">${escapeHtml(data.nationalUid)}</span>
            </div>
          </div>
        </div>

        ${data.showOfficialStamp ? `
          <div class="official-stamp" style="border-color: ${cardBorder}; color: ${cardBorder};">
            <div class="stamp-inner">
              <div class="stamp-icon">★</div>
              <div class="stamp-txt">SCEAU MEPU-A</div>
              <div class="stamp-sub">OFFICIEL</div>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="card-footer" style="background: ${headerGradient};">
        <div>Année Scolaire : <strong>${escapeHtml(data.validityPeriod)}</strong></div>
        <div>Badge N° : <strong>${escapeHtml(data.matricule)}</strong></div>
      </div>
    </div>
  `;

  const versoCardHtml = `
    <div class="pvc-card" style="border: 1.5px solid ${cardBorder}; background-color: ${primaryBg}; color: ${textColor};">
      <div class="card-header" style="background: ${headerGradient};">
        <div class="header-rep">CERTIFICAT D'AUTHENTICITÉ &amp; CONTRÔLE</div>
        <div class="category-tag" style="color: ${theme.lightAccent};">MEPU-A · GUINÉE</div>
      </div>

      <div class="card-body-verso">
        <div class="rules-text" style="color: ${subtextColor};">
          <div class="rules-title" style="color: ${textColor};">Conditions d'Utilisation Officielles :</div>
          <p>1. Cette carte est strictement personnelle et obligatoire dans l'enceinte de l'établissement.</p>
          <p>2. Elle donne accès aux examens nationaux, cours, bibliothèque numérique et activités scolaires.</p>
          <p>3. ${data.phone ? `Contact : ${escapeHtml(data.phone)} · ` : ''}En cas de perte, rapporter à l'administration scolaire.</p>

          <div class="signature-box">
            <div>
              <div class="sig-label">Direction Générale</div>
              <div class="sig-title" style="color: ${textColor};">Signature &amp; Cachet</div>
            </div>
            <div class="sig-line">SmartSchool ERP</div>
          </div>
        </div>

        <div class="qr-box">
          <img src="${qrDataUrl}" alt="QR Code" class="qr-svg" />
          <div class="qr-label">SCAN MEPU-A</div>
        </div>
      </div>

      ${data.showBarcode ? `
        <div class="barcode-footer">
          <div class="barcode-bars">
            <span style="width: 2px;"></span>
            <span style="width: 1px; background: transparent;"></span>
            <span style="width: 3px;"></span>
            <span style="width: 1px; background: transparent;"></span>
            <span style="width: 2px;"></span>
            <span style="width: 2px; background: transparent;"></span>
            <span style="width: 4px;"></span>
            <span style="width: 1px; background: transparent;"></span>
            <span style="width: 2px;"></span>
            <span style="width: 3px; background: transparent;"></span>
            <span style="width: 3px;"></span>
            <span style="width: 1px; background: transparent;"></span>
            <span style="width: 4px;"></span>
            <span style="width: 2px; background: transparent;"></span>
            <span style="width: 2px;"></span>
          </div>
          <div class="barcode-num">*${escapeHtml(data.matricule.replace(/[^A-Z0-9]/gi, ''))}*</div>
        </div>
      ` : ''}
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Badge_PVC_CR80_${escapeHtml(data.matricule)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f8fafc;
      color: #0f172a;
    }
    .print-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 20px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .btn-print {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 10px 24px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
    }
    .btn-print:hover { background: #1d4ed8; }

    .cards-platter {
      display: flex;
      flex-wrap: wrap;
      gap: 14mm;
      align-items: center;
      justify-content: center;
    }

    /* ISO/IEC 7810 ID-1 (CR-80) EXACT DIMENSIONS: 85.60mm x 53.98mm */
    .pvc-card {
      width: 85.6mm !important;
      height: 53.98mm !important;
      min-width: 85.6mm !important;
      max-width: 85.6mm !important;
      min-height: 53.98mm !important;
      max-height: 53.98mm !important;
      border-radius: 3.18mm;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      outline: 0.25mm dashed #94a3b8;
      outline-offset: 1.5mm;
      box-shadow: 0 8px 16px rgba(0,0,0,0.12);
      page-break-inside: avoid;
    }

    .tricolor-banner {
      width: 100%;
      height: 1.8mm;
      display: flex;
      flex-shrink: 0;
    }
    .tricolor-banner div {
      width: 33.333%;
      height: 100%;
    }

    .card-header {
      padding: 1.8mm 3.2mm;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1.8mm;
    }
    .emblem-circle {
      width: 4.8mm;
      height: 4.8mm;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6.5px;
      font-weight: 900;
    }
    .header-rep {
      font-size: 7px;
      font-weight: 900;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      line-height: 1.1;
    }
    .header-motto {
      font-size: 5px;
      letter-spacing: 0.3px;
      opacity: 0.85;
      text-transform: uppercase;
    }
    .header-right {
      text-align: right;
      max-width: 42mm;
    }
    .school-title {
      font-size: 6.5px;
      font-weight: 800;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .category-tag {
      font-size: 5.5px;
      font-family: monospace;
      font-weight: bold;
    }

    .microtext {
      width: 100%;
      font-size: 4px;
      font-family: monospace;
      letter-spacing: 0.8px;
      white-space: nowrap;
      overflow: hidden;
      padding: 0.35mm 2mm;
      background: rgba(0,0,0,0.06);
      color: #64748b;
    }

    .card-body {
      padding: 1.5mm 3.2mm;
      flex: 1;
      display: flex;
      align-items: center;
      gap: 2.8mm;
      position: relative;
      overflow: hidden;
    }

    .photo-box {
      width: 17.5mm;
      height: 22mm;
      border-radius: 2mm;
      border: 1px solid #cbd5e1;
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
      background: #e2e8f0;
    }
    .id-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      display: block;
    }
    .photo-fallback {
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 16px;
      color: #1e3a8a;
      background: #dbeafe;
    }
    .photo-tag {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(15,23,42,0.8);
      color: #ffffff;
      font-size: 4.5px;
      font-family: monospace;
      text-align: center;
      padding: 0.3mm 0;
    }

    .id-details {
      flex: 1;
      min-width: 0;
    }
    .id-sub {
      font-size: 5.5px;
      text-transform: uppercase;
      font-weight: bold;
      color: #94a3b8;
      letter-spacing: 0.4px;
    }
    .id-name {
      font-size: 9.5px;
      font-weight: 900;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 0.5mm;
    }
    .id-role {
      font-size: 7px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 1mm;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.7mm;
      font-size: 6px;
    }
    .label {
      color: #94a3b8;
    }
    .value-uid {
      font-family: monospace;
      font-size: 5.2px;
    }

    .official-stamp {
      position: absolute;
      right: 2.8mm;
      top: 50%;
      transform: translateY(-50%) rotate(12deg);
      width: 10.5mm;
      height: 10.5mm;
      border: 1px dashed #059669;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      opacity: 0.85;
    }
    .stamp-inner {
      font-size: 4.2px;
      font-weight: 900;
      line-height: 1.1;
    }
    .stamp-icon { font-size: 5.5px; }

    .watermark {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: rotate(-12deg);
      opacity: 0.07;
      pointer-events: none;
    }
    .wm-text {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
    }
    .wm-sub {
      font-size: 6px;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .card-footer {
      padding: 1.2mm 3.2mm;
      color: #ffffff;
      font-size: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .card-body-verso {
      padding: 2.2mm 3.2mm;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2.8mm;
    }
    .rules-text {
      flex: 1;
      font-size: 5.2px;
      line-height: 1.28;
    }
    .rules-title {
      font-weight: bold;
      font-size: 5.8px;
      margin-bottom: 0.8mm;
    }
    .rules-text p {
      margin: 0.5mm 0;
    }
    .signature-box {
      margin-top: 1.4mm;
      padding-top: 0.9mm;
      border-top: 0.5px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sig-label { font-size: 4.8px; color: #94a3b8; }
    .sig-title { font-size: 5.8px; font-weight: bold; }
    .sig-line { font-family: monospace; font-size: 6px; color: #2563eb; font-weight: bold; }

    .qr-box {
      background: #ffffff;
      padding: 1.3mm;
      border: 1px solid #cbd5e1;
      border-radius: 2mm;
      text-align: center;
      flex-shrink: 0;
    }
    .qr-svg {
      width: 15mm;
      height: 15mm;
      display: block;
    }
    .qr-label {
      font-size: 4.8px;
      font-weight: bold;
      font-family: monospace;
      color: #475569;
      margin-top: 0.4mm;
    }

    .barcode-footer {
      background: #ffffff;
      border-top: 1px solid #e2e8f0;
      padding: 0.8mm 0;
      text-align: center;
      flex-shrink: 0;
    }
    .barcode-bars {
      display: inline-flex;
      height: 4mm;
      gap: 0.5px;
      align-items: center;
    }
    .barcode-bars span {
      display: inline-block;
      height: 100%;
      background: #0f172a;
    }
    .barcode-num {
      font-size: 5px;
      font-family: monospace;
      color: #475569;
    }

    @media print {
      body {
        padding: 0;
        background: transparent;
      }
      .print-controls {
        display: none !important;
      }
      .cards-platter {
        gap: 10mm;
      }
      .pvc-card {
        box-shadow: none;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="print-controls">
    <div>
      <strong style="color: #1e3a8a; font-size: 14px;">SmartSchool ERP · Planche PVC CR-80 Normalisée (85.60 × 53.98 mm)</strong>
      <div style="font-size: 11px; color: #64748b;">Dimensions PVC exactes ISO/IEC 7810 ID-1 avec QR Code réel scannable. Imprimez à échelle 100% (sans ajuster à la page).</div>
    </div>
    <button class="btn-print" onclick="window.print()">🖨️ Imprimer Taille PVC (100%)</button>
  </div>

  <div class="cards-platter">
    ${face === 'recto' || face === 'both' ? rectoCardHtml : ''}
    ${face === 'verso' || face === 'both' ? versoCardHtml : ''}
  </div>
</body>
</html>`;
};

function loadImageSafe(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * High-definition Canvas Rendering at 300 DPI
 * Landscape: 1012 × 638 px (85.60 × 53.98 mm)
 * Portrait: 638 × 1012 px (53.98 × 85.60 mm)
 */
export const drawPvcCardToCanvas = async (
  canvas: HTMLCanvasElement,
  data: PvcRenderData,
  face: 'recto' | 'verso'
): Promise<void> => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isPortrait = data.orientation === 'portrait';
  const width = isPortrait ? 638 : 1012;
  const height = isPortrait ? 1012 : 638;
  canvas.width = width;
  canvas.height = height;

  const theme = getThemeColors(data.themeColor || '#059669');
  const cornerRadius = 38;

  const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  ctx.save();
  roundRect(0, 0, width, height, cornerRadius);
  ctx.clip();

  ctx.fillStyle = data.isDarkTheme ? '#0f172a' : '#ffffff';
  ctx.fillRect(0, 0, width, height);

  if (isPortrait) {
    // Portrait CR-80 (53.98 x 85.60 mm)
    if (data.showTricolorBanner) {
      const segW = width / 3;
      ctx.fillStyle = '#ce1126';
      ctx.fillRect(0, 0, segW, 14);
      ctx.fillStyle = '#fcd116';
      ctx.fillRect(segW, 0, segW, 14);
      ctx.fillStyle = '#009460';
      ctx.fillRect(segW * 2, 0, segW, 14);
    }

    const headerY = data.showTricolorBanner ? 14 : 0;
    const headerH = 148;
    const grad = ctx.createLinearGradient(0, headerY, width, headerY + headerH);
    grad.addColorStop(0, theme.start);
    grad.addColorStop(1, theme.end);
    ctx.fillStyle = grad;
    ctx.fillRect(0, headerY, width, headerH);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText('RÉPUBLIQUE DE GUINÉE · MEPU-A', width / 2, headerY + 38);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText(data.schoolName.toUpperCase().slice(0, 34), width / 2, headerY + 78);

    ctx.fillStyle = theme.lightAccent;
    ctx.font = 'bold 17px monospace';
    ctx.fillText(data.categoryLabel.toUpperCase(), width / 2, headerY + 114);

    // Photo centered
    const photoW = 220;
    const photoH = 265;
    const photoX = (width - photoW) / 2;
    const photoY = headerY + headerH + 34;

    const photoImg = await loadImageSafe(data.photoUrl);
    if (photoImg) {
      ctx.save();
      roundRect(photoX, photoY, photoW, photoH, 20);
      ctx.clip();
      ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#dbeafe';
      roundRect(photoX, photoY, photoW, photoH, 20);
      ctx.fill();
      ctx.fillStyle = theme.start;
      ctx.font = 'bold 64px Arial';
      ctx.fillText(getInitials(data.fullName), width / 2, photoY + 150);
    }
    ctx.strokeStyle = data.themeColor || '#1e3a8a';
    ctx.lineWidth = 4;
    roundRect(photoX, photoY, photoW, photoH, 20);
    ctx.stroke();

    // Name, Title, Matricule
    ctx.fillStyle = data.isDarkTheme ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.fillText(data.fullName, width / 2, photoY + photoH + 54);

    ctx.fillStyle = data.themeColor || '#1e3a8a';
    ctx.font = 'bold 21px Arial, sans-serif';
    ctx.fillText(data.title.slice(0, 38), width / 2, photoY + photoH + 92);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`Matricule : ${data.matricule}`, width / 2, photoY + photoH + 130);

    // Real QR code centered
    const qrPayload = resolveQrPayload(data);
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 240,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' }
    });
    const qrImg = await loadImageSafe(qrDataUrl);
    const qrSize = 185;
    const qrX = (width - qrSize) / 2;
    const qrY = height - 62 - qrSize - 26;
    ctx.fillStyle = '#ffffff';
    roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 14);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 14);
    ctx.stroke();
    if (qrImg) {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    }

    // Footer
    ctx.fillStyle = theme.end;
    ctx.fillRect(0, height - 56, width, 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Valide : ${data.validityPeriod}`, 26, height - 22);
    ctx.textAlign = 'right';
    ctx.fillText('SmartSchool ERP', width - 26, height - 22);
    ctx.textAlign = 'left';

    ctx.restore();
    // Outer card border
    ctx.strokeStyle = data.themeColor || '#1e3a8a';
    ctx.lineWidth = 6;
    roundRect(3, 3, width - 6, height - 6, cornerRadius);
    ctx.stroke();
    return;
  }

  // LANDSCAPE CR-80 (85.60 x 53.98 mm => 1012 x 638 px)
  if (face === 'recto') {
    if (data.showTricolorBanner) {
      const segW = width / 3;
      ctx.fillStyle = '#ce1126';
      ctx.fillRect(0, 0, segW, 14);
      ctx.fillStyle = '#fcd116';
      ctx.fillRect(segW, 0, segW, 14);
      ctx.fillStyle = '#009460';
      ctx.fillRect(segW * 2, 0, segW, 14);
    }

    const headerH = 110;
    const headerY = data.showTricolorBanner ? 14 : 0;
    const grad = ctx.createLinearGradient(0, headerY, width, headerY + headerH);
    grad.addColorStop(0, theme.start);
    grad.addColorStop(1, theme.end);
    ctx.fillStyle = grad;
    ctx.fillRect(0, headerY, width, headerH);

    // Emblem Badge
    if (data.showNationalArms) {
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.arc(46, headerY + 55, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GN', 46, headerY + 61);
      ctx.textAlign = 'left';
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 21px Arial, sans-serif';
    ctx.fillText('RÉPUBLIQUE DE GUINÉE', data.showNationalArms ? 80 : 32, headerY + 44);

    ctx.fillStyle = theme.lightAccent;
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText('Travail · Justice · Solidarité', data.showNationalArms ? 80 : 32, headerY + 70);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 21px Arial, sans-serif';
    ctx.fillText(data.schoolName.toUpperCase().slice(0, 32), width - 34, headerY + 44);

    ctx.fillStyle = theme.lightAccent;
    ctx.font = 'bold 16px monospace';
    ctx.fillText(data.categoryLabel.toUpperCase(), width - 34, headerY + 72);
    ctx.textAlign = 'left';

    if (data.showMicrotext) {
      ctx.fillStyle = data.isDarkTheme ? '#1e293b' : '#f1f5f9';
      ctx.fillRect(0, headerY + headerH, width, 20);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`MEPU-A · SMARTSCHOOL ERP SOVEREIGN ID · RÉPUBLIQUE DE GUINÉE · ${data.matricule}`, 24, headerY + headerH + 14);
    }

    if (data.showWatermark) {
      ctx.save();
      ctx.translate(width / 2 + 80, height / 2 + 30);
      ctx.rotate(-0.2);
      ctx.fillStyle = data.isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
      ctx.font = 'bold 88px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('MEPU-A', 0, 0);
      ctx.font = 'bold 19px Arial';
      ctx.fillText('GUINÉE SOUVERAIN', 0, 36);
      ctx.restore();
    }

    const contentY = headerY + headerH + 54;
    const textX = 292;

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('IDENTITÉ DU PORTEUR', textX, contentY);

    ctx.fillStyle = data.isDarkTheme ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 31px Arial';
    ctx.fillText(data.fullName.slice(0, 28), textX, contentY + 38);

    ctx.fillStyle = data.isDarkTheme ? theme.lightAccent : (data.themeColor || '#2563eb');
    ctx.font = 'bold 20px Arial';
    ctx.fillText(data.title.slice(0, 36), textX, contentY + 70);

    ctx.font = '17px Arial';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Matricule :', textX, contentY + 120);
    ctx.fillStyle = data.isDarkTheme ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(data.matricule, textX + 94, contentY + 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '17px Arial';
    ctx.fillText('Sang :', textX + 325, contentY + 120);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(data.bloodGroup || 'O+', textX + 385, contentY + 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px Arial';
    ctx.fillText('UID :', textX, contentY + 156);
    ctx.fillStyle = data.isDarkTheme ? '#cbd5e1' : '#0f172a';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(data.nationalUid, textX + 46, contentY + 156);

    if (data.showOfficialStamp) {
      ctx.save();
      ctx.translate(width - 108, height / 2 + 44);
      ctx.rotate(0.22);
      ctx.strokeStyle = data.themeColor || '#059669';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, 56, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = data.isDarkTheme ? theme.lightAccent : theme.start;
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px Arial';
      ctx.fillText('★ MEPU-A ★', 0, -14);
      ctx.font = 'bold 12px Arial';
      ctx.fillText('RÉPUBLIQUE', 0, 5);
      ctx.fillText('DE GUINÉE', 0, 22);
      ctx.restore();
    }

    // Footer
    const footerH = 48;
    ctx.fillStyle = theme.end;
    ctx.fillRect(0, height - footerH, width, footerH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px Arial';
    ctx.fillText(`Année Scolaire : ${data.validityPeriod}`, 34, height - 18);

    ctx.textAlign = 'right';
    ctx.fillText(data.footerRightText || `Badge N° : ${data.matricule}`, width - 34, height - 18);
    ctx.textAlign = 'left';

    // Photo Box
    const photoX = 38;
    const photoY = contentY - 16;
    const photoW = 215;
    const photoH = 272;

    const photoImg = await loadImageSafe(data.photoUrl);
    if (photoImg) {
      ctx.save();
      roundRect(photoX, photoY, photoW, photoH, 18);
      ctx.clip();
      ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#dbeafe';
      roundRect(photoX, photoY, photoW, photoH, 18);
      ctx.fill();
      ctx.fillStyle = theme.start;
      ctx.font = 'bold 64px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(data.fullName), photoX + photoW / 2, photoY + photoH / 2 + 12);
      ctx.textAlign = 'left';
    }

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    roundRect(photoX, photoY, photoW, photoH, 18);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(photoX, photoY + 240, photoW, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ID CERTIFIÉE', photoX + photoW / 2, photoY + 261);
    ctx.textAlign = 'left';

    ctx.restore();
    ctx.strokeStyle = data.themeColor || '#059669';
    ctx.lineWidth = 5;
    roundRect(2.5, 2.5, width - 5, height - 5, cornerRadius);
    ctx.stroke();
  } else {
    // VERSO LANDSCAPE
    const headerH = 74;
    const grad = ctx.createLinearGradient(0, 0, width, headerH);
    grad.addColorStop(0, theme.start);
    grad.addColorStop(1, theme.end);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, headerH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText("CERTIFICAT D'AUTHENTICITÉ & CONTRÔLE", 40, 44);

    ctx.textAlign = 'right';
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = theme.lightAccent;
    ctx.fillText('MEPU-A · GUINÉE', width - 40, 44);
    ctx.textAlign = 'left';

    ctx.fillStyle = data.isDarkTheme ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 18px Arial';
    ctx.fillText("CONDITIONS D'UTILISATION OFFICIELLES :", 48, 128);

    ctx.font = '15.5px Arial';
    ctx.fillStyle = data.isDarkTheme ? '#cbd5e1' : '#475569';
    ctx.fillText("1. Cette carte est strictement personnelle et obligatoire dans l'établissement.", 48, 172);
    ctx.fillText('2. Elle donne accès aux examens, cours, bibliothèque numérique et activités.', 48, 212);
    ctx.fillText(
      `3. ${data.phone ? `Tél : ${data.phone} · ` : ''}En cas de perte, rapporter à l'administration scolaire.`,
      48,
      252
    );

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 306);
    ctx.lineTo(480, 306);
    ctx.stroke();

    ctx.font = '13px Arial';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Direction Générale · Signature & Sceau :', 48, 334);

    ctx.font = 'bold 19px Arial';
    ctx.fillStyle = data.isDarkTheme ? theme.lightAccent : theme.start;
    ctx.fillText(data.schoolName.slice(0, 36), 48, 370);

    // Real Scannable QR Code Container
    const qrX = width - 266;
    const qrY = 108;
    const qrSize = 216;

    ctx.fillStyle = '#ffffff';
    roundRect(qrX, qrY, qrSize, qrSize, 14);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    roundRect(qrX, qrY, qrSize, qrSize, 14);
    ctx.stroke();

    const qrPayload = resolveQrPayload(data);
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 300,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' }
    });
    const qrImg = await loadImageSafe(qrDataUrl);
    if (qrImg) {
      ctx.drawImage(qrImg, qrX + 12, qrY + 12, qrSize - 24, qrSize - 24);
    }

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN MEPU-A', qrX + qrSize / 2, qrY + qrSize + 24);
    ctx.textAlign = 'left';

    // Barcode footer
    if (data.showBarcode) {
      const barH = 74;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, height - barH, width, barH);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height - barH);
      ctx.lineTo(width, height - barH);
      ctx.stroke();

      const barStartY = height - barH + 12;
      const barHeight = 32;
      const barStartX = width / 2 - 180;
      ctx.fillStyle = '#0f172a';
      const pattern = [2, 1, 3, 1, 2, 2, 4, 1, 2, 3, 3, 1, 4, 2, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 2, 4, 1, 2];
      let currX = barStartX;
      pattern.forEach((w, idx) => {
        if (idx % 2 === 0) {
          ctx.fillRect(currX, barStartY, w * 3, barHeight);
        }
        currX += w * 3 + 2;
      });

      ctx.textAlign = 'center';
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText(`*${data.matricule.replace(/[^A-Z0-9]/gi, '')}*`, width / 2, height - 10);
      ctx.textAlign = 'left';
    }

    ctx.restore();
    ctx.strokeStyle = data.themeColor || '#059669';
    ctx.lineWidth = 5;
    roundRect(2.5, 2.5, width - 5, height - 5, cornerRadius);
    ctx.stroke();
  }
};

/**
 * Generates an exact-dimension CR-80 PVC PDF (85.60 x 53.98 mm or 53.98 x 85.60 mm portrait).
 * Ideal for direct PVC card printers (Evolis, Zebra, Datacard) or digital archiving.
 */
export const downloadPvcBadgePdf = async (
  data: PvcRenderData,
  face: 'both' | 'recto' | 'verso' = 'both',
  filenamePrefix = 'Badge_PVC'
): Promise<string> => {
  const isPortrait = data.orientation === 'portrait';
  const cardW = isPortrait ? 53.98 : 85.6;
  const cardH = isPortrait ? 85.6 : 53.98;

  const doc = new jsPDF({
    orientation: isPortrait ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [cardW, cardH]
  });

  const canvas = document.createElement('canvas');

  const addFacePage = async (targetFace: 'recto' | 'verso', isFirst: boolean) => {
    await drawPvcCardToCanvas(canvas, data, targetFace);
    const imgData = canvas.toDataURL('image/png', 1.0);
    if (!isFirst) {
      doc.addPage([cardW, cardH], isPortrait ? 'portrait' : 'landscape');
    }
    doc.addImage(imgData, 'PNG', 0, 0, cardW, cardH, undefined, 'FAST');
  };

  if (isPortrait || face === 'recto') {
    await addFacePage('recto', true);
  } else if (face === 'verso') {
    await addFacePage('verso', true);
  } else {
    await addFacePage('recto', true);
    await addFacePage('verso', false);
  }

  const safeMat = (data.matricule || 'ID').replace(/[^a-zA-Z0-9_-]+/g, '_');
  const filename = `${filenamePrefix}_${safeMat}_PVC_CR80.pdf`;
  doc.save(filename);
  return filename;
};

/**
 * Generates an A4 PDF placing the PVC card(s) at exact physical CR-80 size (85.60 x 53.98 mm)
 * with dashed cut lines so printing on normal A4 paper preserves true PVC size.
 */
export const downloadPvcBadgeA4Pdf = async (
  data: PvcRenderData,
  face: 'both' | 'recto' | 'verso' = 'both',
  filenamePrefix = 'Planche_PVC_A4'
): Promise<string> => {
  const isPortrait = data.orientation === 'portrait';
  const cardW = isPortrait ? 53.98 : 85.6;
  const cardH = isPortrait ? 85.6 : 53.98;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 39, 86);
  doc.text('SmartSchool ERP - Planche Impression PVC CR-80 (Taille Normale 100%)', 14, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Dimensions ISO/IEC 7810 ID-1 : ${cardW} mm x ${cardH} mm | Imprimer a echelle 100% (Sans ajustement)`, 14, 22);

  const canvas = document.createElement('canvas');

  const drawCutBox = (x: number, y: number, w: number, h: number, label: string) => {
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(label, x, y - 2.5);
    doc.setDrawColor(148, 163, 184);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.rect(x - 1, y - 1, w + 2, h + 2);
    doc.setLineDashPattern([], 0);
  };

  if (isPortrait) {
    const x = (pageW - cardW) / 2;
    const y = 34;
    await drawPvcCardToCanvas(canvas, data, 'recto');
    const imgData = canvas.toDataURL('image/png', 1.0);
    drawCutBox(x, y, cardW, cardH, 'Face Recto (53.98 x 85.60 mm)');
    doc.addImage(imgData, 'PNG', x, y, cardW, cardH, undefined, 'FAST');
  } else if (face === 'both') {
    const gap = 12;
    const totalW = cardW * 2 + gap;
    const startX = (pageW - totalW) / 2;
    const y = 36;

    await drawPvcCardToCanvas(canvas, data, 'recto');
    const rectoData = canvas.toDataURL('image/png', 1.0);
    drawCutBox(startX, y, cardW, cardH, 'RECTO (85.60 x 53.98 mm)');
    doc.addImage(rectoData, 'PNG', startX, y, cardW, cardH, undefined, 'FAST');

    await drawPvcCardToCanvas(canvas, data, 'verso');
    const versoData = canvas.toDataURL('image/png', 1.0);
    drawCutBox(startX + cardW + gap, y, cardW, cardH, 'VERSO (85.60 x 53.98 mm)');
    doc.addImage(versoData, 'PNG', startX + cardW + gap, y, cardW, cardH, undefined, 'FAST');
  } else {
    const x = (pageW - cardW) / 2;
    const y = 36;
    await drawPvcCardToCanvas(canvas, data, face);
    const imgData = canvas.toDataURL('image/png', 1.0);
    drawCutBox(x, y, cardW, cardH, `${face.toUpperCase()} (85.60 x 53.98 mm)`);
    doc.addImage(imgData, 'PNG', x, y, cardW, cardH, undefined, 'FAST');
  }

  const safeMat = (data.matricule || 'ID').replace(/[^a-zA-Z0-9_-]+/g, '_');
  const filename = `${filenamePrefix}_${safeMat}_A4_100pct.pdf`;
  doc.save(filename);
  return filename;
};

/**
 * Downloads image directly from Canvas to disk (PNG or JPEG)
 */
export const downloadCanvasImage = (canvas: HTMLCanvasElement, filename: string, format: 'png' | 'jpeg'): void => {
  const mime = format === 'png' ? 'image/png' : 'image/jpeg';
  const url = canvas.toDataURL(mime, 0.95);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
