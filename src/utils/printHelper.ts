/**
 * Universal Infallible Printing & Document Export Helper
 * Specially engineered for browser iframes, sandboxed environments, and standalone windows.
 */

export interface PrintOptions {
  title?: string;
  elementId?: string;
  htmlContent?: string;
  autoDownloadFallback?: boolean;
}

/**
 * Clean printable template with official MEPU-A styling and high-contrast typography
 */
export const buildPrintableHtml = (title: string, bodyContent: string): string => {
  let extractedStyles = '';
  try {
    if (typeof document !== 'undefined') {
      const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
      styleElements.forEach(el => {
        extractedStyles += el.outerHTML + '\n';
      });
    }
  } catch (e) {
    // ignore
  }

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
      <strong style="color: #1e3a8a; font-size: 14px;">SmartSchool ERP Guinée · Document Officiel Imprimable</strong>
      <div style="font-size: 11px; color: #475569;">Cliquez sur le bouton ci-contre pour lancer l'impression ou enregistrer en PDF (Ctrl+P / Cmd+P).</div>
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
export const exportPrintableDocument = (title: string, htmlContent: string): boolean => {
  try {
    const fullHtml = buildPrintableHtml(title, htmlContent);
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
const showPrintFeedback = (title: string) => {
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
      <div style="font-weight: bold; color: #60a5fa; margin-bottom: 2px;">Ordre d'impression transmis !</div>
      <div style="color: #cbd5e1;">Le document <strong>${title}</strong> est prêt. Le fichier A4 autonome a été téléchargé pour impression directe ou sauvegarde PDF.</div>
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
export const triggerPrint = (elementIdOrTitle?: string, customTitle?: string) => {
  let content = '';
  let title = customTitle || 'Document_Officiel_SmartSchool';

  // Check if passed string is an existing DOM element id
  if (elementIdOrTitle) {
    const el = document.getElementById(elementIdOrTitle);
    if (el) {
      content = el.innerHTML;
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

  // Always export the printable file for immediate access
  exportPrintableDocument(title, content);
  showPrintFeedback(title);

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
      frameDoc.write(buildPrintableHtml(title, content));
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

