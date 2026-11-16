/**
 * Universal Infallible Printing & Document Export Helper
 * Specially engineered for browser iframes, sandboxed environments, and standalone windows.
 */

export interface PrintOptions {
  title?: string;
  elementId?: string;
  htmlContent?: string;
  autoDownloadFallback?: boolean;
  pvcMode?: 'landscape' | 'portrait' | false;
}

/**
 * Clean printable template with official MEPU-A styling and high-contrast typography
 */
export const buildPrintableHtml = (
  title: string,
  bodyContent: string,
  pvcMode: 'landscape' | 'portrait' | false = false
): string => {
  let extractedStyles = '';
  try {
    if (typeof document !== 'undefined') {
      const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
      styleElements.forEach(el => {
        extractedStyles += el.outerHTML + '\n';
      });
    }
  } catch {
    // ignore
  }

  const pvcCss = pvcMode
    ? `
    .pvc-card {
      width: 85.6mm !important;
      height: 53.98mm !important;
      min-width: 85.6mm !important;
      max-width: 85.6mm !important;
      min-height: 53.98mm !important;
      max-height: 53.98mm !important;
      aspect-ratio: auto !important;
      margin: 6mm auto !important;
      border-radius: 3.18mm !important;
      outline: 0.25mm dashed #94a3b8;
      outline-offset: 1.5mm;
      page-break-inside: avoid !important;
      overflow: hidden !important;
    }
    .pvc-card-portrait {
      width: 53.98mm !important;
      height: 85.6mm !important;
      min-width: 53.98mm !important;
      max-width: 53.98mm !important;
      min-height: 85.6mm !important;
      max-height: 85.6mm !important;
      aspect-ratio: auto !important;
      margin: 6mm auto !important;
      border-radius: 3.18mm !important;
      outline: 0.25mm dashed #94a3b8;
      outline-offset: 1.5mm;
      page-break-inside: avoid !important;
      overflow: hidden !important;
    }
    .pvc-print-grid {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: center !important;
      align-items: flex-start !important;
      gap: 10mm !important;
    }
  `
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${extractedStyles}
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 16px;
      font-size: 12px;
      line-height: 1.5;
    }
    .no-print {
      display: none !important;
    }
    .print-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      margin-bottom: 20px;
      font-family: sans-serif;
    }
    .btn-print {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 9px 20px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
    }
    .btn-print:hover { background: #1d4ed8; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9 !important;
      font-weight: bold;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    img { max-width: 100%; height: auto; }
    ${pvcCss}
    @media print {
      body {
        padding: 0;
      }
      .print-banner {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-banner no-print">
    <div>
      <strong style="color: #1e3a8a; font-size: 14px;">SmartSchool ERP Guinée · ${pvcMode ? 'Carte PVC CR-80 (85.60 × 53.98 mm)' : 'Document Officiel Imprimable'}</strong>
      <div style="font-size: 11px; color: #475569;">${pvcMode ? 'Taille réelle normalisée PVC CR-80 avec repères de découpe. Imprimez à échelle 100% (Sans ajustement).' : 'Cliquez sur le bouton ci-contre pour lancer l\'impression ou enregistrer en PDF (Ctrl+P / Cmd+P).'}</div>
    </div>
    <button class="btn-print" onclick="window.print()">🖨️ Lancer l'Impression / Sauvegarder en PDF</button>
  </div>
  ${bodyContent}
</body>
</html>`;
};

/**
 * Downloads a self-contained, print-ready document immediately.
 * This guarantees the user ALWAYS gets their document even when iframe sandbox blocks print dialogs.
 */
export const exportPrintableDocument = (
  title: string,
  htmlContent: string,
  pvcMode: 'landscape' | 'portrait' | false = false
): boolean => {
  try {
    const trimmed = htmlContent.trim();
    const fullHtml = trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')
      ? htmlContent
      : buildPrintableHtml(title, htmlContent, pvcMode);
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch (e) {
    console.error('Failed to export document:', e);
    return false;
  }
};

/**
 * Shows a lightweight floating notification on screen
 */
const showPrintFeedback = (title: string, pvcMode: 'landscape' | 'portrait' | false = false) => {
  const existing = document.getElementById('smartschool-print-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'smartschool-print-toast';
  toast.setAttribute('style', `
    position: fixed;
    bottom: 24px;
    right: 24px;
    max-width: 420px;
    background: #0f172a;
    color: #f8fafc;
    border: 1px solid #3b82f6;
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    z-index: 99999;
    font-family: sans-serif;
    font-size: 12px;
    line-height: 1.4;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  `);

  toast.innerHTML = `
    <div style="font-size: 20px;">🖨️</div>
    <div style="flex: 1;">
      <div style="font-weight: bold; color: #60a5fa; margin-bottom: 2px;">${pvcMode ? 'Carte PVC CR-80 prête (85.6 × 53.98 mm) !' : "Ordre d'impression transmis !"}</div>
      <div style="color: #cbd5e1;">Le document <strong>${title}</strong> est prêt. ${pvcMode ? 'Taille PVC normalisée conservée (imprimer à 100%).' : 'Le fichier autonome a été téléchargé pour impression directe ou PDF.'}</div>
    </div>
    <button style="background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 0 4px;" onclick="this.parentElement.remove()">✕</button>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 5000);
};

/**
 * Universal Trigger Print Function:
 * 1. Locates target printable content
 * 2. Attempts print via isolated hidden iframe
 * 3. Exports self-contained printable file so users in sandboxed iframes always succeed
 * 4. Displays clear on-screen confirmation
 */
export const triggerPrint = (
  elementIdOrTitle?: string,
  customTitle?: string,
  pvcMode: 'landscape' | 'portrait' | false = false
) => {
  let content = '';
  let title = customTitle || 'Document_Officiel_SmartSchool';

  // Check if passed string is an existing DOM element id
  if (elementIdOrTitle) {
    const el = document.getElementById(elementIdOrTitle);
    if (el) {
      content = el.outerHTML;
      if (!customTitle) {
        title = elementIdOrTitle;
      }
    } else {
      title = elementIdOrTitle;
    }
  }

  // If no content found by id, try searching for standard printable containers
  if (!content) {
    const candidate =
      document.querySelector('.printable-document') ||
      document.querySelector('.printable-content') ||
      document.querySelector('.print-paper') ||
      document.querySelector('article') ||
      document.querySelector('main');
    if (candidate) {
      content = candidate.innerHTML;
    } else {
      content = document.body.innerHTML;
    }
  }

  const autoPvc =
    pvcMode ||
    (content.includes('pvc-card-portrait')
      ? 'portrait'
      : content.includes('pvc-card')
      ? 'landscape'
      : false);

  // Always export the printable file for immediate access
  exportPrintableDocument(title, content, autoPvc);
  showPrintFeedback(title, autoPvc);

  // Also attempt hidden iframe printing for browsers allowing it
  try {
    let printFrame = document.getElementById('smartschool-isolated-print-frame') as HTMLIFrameElement;
    if (printFrame) {
      printFrame.remove();
    }

    printFrame = document.createElement('iframe');
    printFrame.id = 'smartschool-isolated-print-frame';
    printFrame.setAttribute('style', 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:none;opacity:0.01;pointer-events:none;z-index:-999;');
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(buildPrintableHtml(title, content, autoPvc));
      frameDoc.close();

      setTimeout(() => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
        } catch (iframeErr) {
          console.warn('Iframe direct print modal blocked by environment sandbox. Document file downloaded.', iframeErr);
        }
      }, 350);
    }
  } catch (err) {
    console.warn('Direct print iframe error:', err);
  }
};

