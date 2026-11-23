import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfCanvasViewerProps {
  source: string;
  title: string;
  onDownload: () => void;
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array | null {
  try {
    const commaIdx = dataUrl.indexOf(',');
    if (commaIdx === -1) return null;
    const header = dataUrl.slice(0, commaIdx);
    const body = dataUrl.slice(commaIdx + 1);
    if (/;base64/i.test(header)) {
      const binary = atob(body);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }
    const decoded = decodeURIComponent(body);
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i) & 0xff;
    }
    return bytes;
  } catch {
    return null;
  }
}

function toGoogleDrivePreviewUrl(url: string): string | null {
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
  if (openMatch?.[1]) {
    return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
  }
  return null;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  source,
  title,
  onDownload,
}) => {
  const drivePreviewUrl = toGoogleDrivePreviewUrl(source);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(!drivePreviewUrl);
  const [renderingPage, setRenderingPage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  // Load PDF document
  useEffect(() => {
    if (drivePreviewUrl) {
      setLoading(false);
      setErrorMsg(null);
      return;
    }
    let cancelled = false;
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;

    const loadPdf = async () => {
      setLoading(true);
      setErrorMsg(null);
      setPdfDoc(null);
      setNumPages(0);
      setCurrentPage(1);

      try {
        if (source.startsWith('data:')) {
          const bytes = dataUrlToUint8Array(source);
          if (!bytes) {
            throw new Error('Fichier PDF invalide ou corrompu.');
          }
          loadingTask = pdfjsLib.getDocument({ data: bytes });
        } else if (source.startsWith('blob:') || source.startsWith('http://') || source.startsWith('https://')) {
          const res = await fetch(source);
          if (!res.ok) {
            throw new Error(`Impossible de charger le fichier (${res.status}).`);
          }
          const buffer = await res.arrayBuffer();
          loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        } else {
          throw new Error('Source PDF non reconnue.');
        }

        const doc = await loadingTask.promise;
        if (cancelled) {
          void loadingTask.destroy();
          return;
        }
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Impossible d'afficher l'aperçu PDF dans le navigateur."
          );
          setLoading(false);
        }
      }
    };

    void loadPdf();

    return () => {
      cancelled = true;
      if (loadingTask) {
        void loadingTask.destroy();
      }
    };
  }, [source]);

  // Render active page to canvas responsively
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || currentPage < 1 || currentPage > pdfDoc.numPages) {
      return;
    }

    let cancelled = false;

    const renderPage = async () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        renderTaskRef.current = null;
      }

      setRenderingPage(true);
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (cancelled || !canvasRef.current) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const containerWidth = containerRef.current
          ? Math.max(280, containerRef.current.clientWidth - 28)
          : 760;
        const fitScale = Math.min(2.2, containerWidth / baseViewport.width);
        const effectiveScale = Math.max(0.4, fitScale * zoom);
        const viewport = page.getViewport({ scale: effectiveScale });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const task = page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        });
        renderTaskRef.current = task;
        await task.promise;
        if (!cancelled) {
          renderTaskRef.current = null;
          setRenderingPage(false);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === 'RenderingCancelledException')) {
          setRenderingPage(false);
        }
      }
    };

    void renderPage();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [pdfDoc, currentPage, zoom]);

  if (drivePreviewUrl) {
    return (
      <div className="flex-1 flex flex-col min-h-0 p-2 sm:p-4">
        <iframe
          src={drivePreviewUrl}
          title={title}
          allow="autoplay"
          className="w-full h-full flex-1 rounded-xl border border-slate-200 bg-white shadow-inner"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <div className="text-xs font-semibold text-slate-700">
          Chargement des pages du livre PDF...
        </div>
      </div>
    );
  }

  if (errorMsg) {
    if (source.startsWith('http://') || source.startsWith('https://')) {
      return (
        <div className="flex-1 flex flex-col min-h-0 p-2 sm:p-4 gap-2">
          <iframe
            src={source}
            title={title}
            className="w-full h-full flex-1 rounded-xl border border-slate-200 bg-white shadow-inner"
          />
        </div>
      );
    }
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-amber-200 shadow-md space-y-4">
          <AlertTriangle className="w-9 h-9 text-amber-600 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-blue-950">{title}</h3>
            <p className="text-xs text-slate-600 mt-1">{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le PDF sur l'appareil</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Page & Zoom Navigation Bar */}
      <div className="px-3 sm:px-4 py-2 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold text-slate-800 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Préc.</span>
          </button>

          <div className="flex items-center gap-1 px-2">
            <span className="text-slate-600">Page</span>
            <input
              type="number"
              min={1}
              max={Math.max(1, numPages)}
              value={currentPage}
              onChange={e => {
                const n = Number(e.target.value);
                if (Number.isFinite(n) && n >= 1 && n <= numPages) {
                  setCurrentPage(n);
                }
              }}
              className="w-12 px-1.5 py-1 rounded border border-slate-200 text-center font-mono font-bold text-blue-950 bg-slate-50"
            />
            <span className="text-slate-600 font-mono">/ {numPages}</span>
          </div>

          <button
            type="button"
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold text-slate-800 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Suiv.</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom(z => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            title="Dézoomer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono font-bold text-[11px] text-slate-700 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(z => Math.min(2.4, Number((z + 0.15).toFixed(2))))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            title="Zoomer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Rendered PDF Page Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-3 sm:p-5 bg-slate-200/80 flex flex-col items-center"
      >
        <div className="relative bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300">
          {renderingPage && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
            </div>
          )}
          <canvas ref={canvasRef} className="block" />
        </div>
      </div>
    </div>
  );
};
