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
  // Grab all in-page styles to preserve complete Tailwind & component styling
  let existingStyles = '';
  try {
    const styleTags = document.querySelectorAll('style, link[rel="stylesheet"]');
    styleTags.forEach(tag => {
      existingStyles += tag.outerHTML + '\n';
    });
  } catch {
    // ignore in non-browser context
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!-- Load Tailwind CSS runtime to ensure all utility classes (gradients, flex, borders, colors) render perfectly -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8'
            }
          }
        }
      }
    }
  </script>
  ${existingStyles}
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff !important;
      margin: 0;
      padding: 12px;
      font-size: 12px;
      line-height: 1.4;
    }
    .no-print {
      display: none !important;
    }
    .print-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 18px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      margin-bottom: 24px;
      font-family: sans-serif;
    }
    .btn-print {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 10px 22px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
    }
    .btn-print:hover { background: #1d4ed8; }

    /* CR-80 ISO/IEC 7810 ID-1 Card Exact Dimensions & Styling for Printing */
    .pvc-card-container, #pvc-print-platter {
      background: transparent !important;
      padding: 0 !important;
      border: none !important;
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 16px !important;
    }

    /* Specific student ID card styling */
    #student-id-card-printable {
      width: 380px !important;
      max-width: 380px !important;
      height: 240px !important;
      border-radius: 16px !important;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e3a8a 100%) !important;
      border: 2px solid #60a5fa !important;
      color: #ffffff !important;
      padding: 16px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      position: relative !important;
      overflow: hidden !important;
      margin: 20px auto !important;
      page-break-inside: avoid !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Force CR-80 card proportions when printed */
    [class*="w-[340px]"], #card-face-recto, #card-face-verso {
      width: 340px !important;
      min-width: 340px !important;
      max-width: 340px !important;
      height: 214px !important;
      min-height: 214px !important;
      max-height: 214px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      page-break-inside: avoid !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

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
        padding: 0 !important;
        background: #ffffff !important;
      }
      .print-banner {
        display: none !important;
      }
      /* Ensure colors, gradients and borders don't fade or invert in print */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #pvc-print-platter {
        background: #ffffff !important;
        color: #0f172a !important;
        gap: 20px !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-banner no-print">
    <div>
      <strong style="color: #1e3a8a; font-size: 14px;">SmartSchool ERP Guinée · Document & Badges PVC Officiels</strong>
      <div style="font-size: 11px; color: #475569; margin-top: 2px;">
        Le design exact affiché à l'écran (couleurs, dégradés, armoiries, QR codes, dimensions CR-80) est préservé à 100%.
      </div>
    </div>
    <button class="btn-print" onclick="window.print()">🖨️ Imprimer / Sauvegarder en PDF</button>
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
      // Use outerHTML so that the container element with its background gradient, borders, and dimensions is 100% preserved
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
      content = (candidate as HTMLElement).outerHTML;
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

      const runPrint = () => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
        } catch (iframeErr) {
          console.warn('Iframe direct print modal blocked by environment sandbox. Document file downloaded.', iframeErr);
        }
      };

      // Wait for iframe stylesheets and images to load before printing
      if (printFrame.contentWindow) {
        printFrame.contentWindow.onload = () => {
          setTimeout(runPrint, 250);
        };
      }
      setTimeout(runPrint, 600);
    }
  } catch (err) {
    console.warn('Direct print iframe error:', err);
  }
};

