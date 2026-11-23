import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  FlipHorizontal,
  QrCode,
  Search,
  Upload,
  X,
  BookOpen,
  RotateCcw,
  PlusCircle,
  AlertCircle,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useLibrarian } from '../../context/LibrarianContext';
import { BookItem, LoanRecord } from '../../types/librarian';

interface LibraryQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReader?: (book: BookItem) => void;
}

interface ParsedScanToken {
  raw: string;
  normalized: string;
  extractedMatricule?: string;
}

function parseScannedToken(rawInput: string): ParsedScanToken {
  const raw = rawInput.trim();
  const normalized = raw.toLowerCase();
  let extractedMatricule: string | undefined;

  // Handle JSON payloads on badges if any
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.matricule === 'string' && parsed.matricule.trim()) {
        extractedMatricule = parsed.matricule.trim();
      } else if (typeof parsed?.qrCodeId === 'string' && parsed.qrCodeId.trim()) {
        return {
          raw: parsed.qrCodeId.trim(),
          normalized: parsed.qrCodeId.trim().toLowerCase()
        };
      }
    } catch {
      // ignore non-JSON
    }
  }

  // Handle pipe or colon delimited SmartSchool badge payloads (e.g., "SMARTSCHOOL|MAT-2026-001|...")
  if (!extractedMatricule && (raw.includes('|') || raw.includes('MAT-') || raw.includes('LEC-'))) {
    const match = raw.match(/\b(?:MAT|LEC|STF|LIB|DIR|SEC|ENS|SUR|CPT|ADM)[A-Z0-9-]*\b/i);
    if (match) {
      extractedMatricule = match[0];
    }
  }

  return { raw, normalized, extractedMatricule };
}

export const LibraryQrScannerModal: React.FC<LibraryQrScannerModalProps> = ({
  isOpen,
  onClose,
  onOpenReader
}) => {
  const { books, loans, returnBook, registerLoan, canManageLibrary, showToast } = useLibrarian();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<number | null>(null);
  const imageUploadRef = useRef<HTMLInputElement | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const [manualCode, setManualCode] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [lastDetectedSource, setLastDetectedSource] = useState<'camera' | 'image' | 'manual' | null>(null);

  // Quick Loan sub-form inside scanner
  const [showQuickLoanForm, setShowQuickLoanForm] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerMatricule, setBorrowerMatricule] = useState('');
  const [borrowerRole, setBorrowerRole] = useState<'Élève' | 'Enseignant'>('Élève');
  const [borrowerClass, setBorrowerClass] = useState('Terminale SM');
  const [loanDueDate, setLoanDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const stopCamera = useCallback(() => {
    if (scanTimerRef.current !== null) {
      window.clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraStarting(false);
  }, []);

  const handleDetectedCode = useCallback(
    (code: string, source: 'camera' | 'image' | 'manual') => {
      const cleaned = code.trim();
      if (!cleaned) return;
      setManualCode(cleaned);
      setActiveCode(cleaned);
      setLastDetectedSource(source);
      setShowQuickLoanForm(false);

      // If it looks like a borrower matricule on a badge, prefill borrowerMatricule for quick loan
      const parsed = parseScannedToken(cleaned);
      if (parsed.extractedMatricule) {
        setBorrowerMatricule(parsed.extractedMatricule);
      }

      if (source === 'camera') {
        showToast(`Code détecté par caméra : ${cleaned}`);
        stopCamera();
      }
    },
    [showToast, stopCamera]
  );

  const startCamera = useCallback(
    async (mode: 'environment' | 'user' = facingMode) => {
      stopCamera();
      setCameraError(null);

      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError(
          "Votre navigateur ou cet aperçu ne permet pas l'accès direct à la caméra. Utilisez « Importer image QR » ou la saisie du code / douchette ci-dessous."
        );
        return;
      }

      setCameraStarting(true);
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: mode },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });
        } catch {
          // Fallback without facingMode constraint (e.g. desktop webcam)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraActive(true);
        setCameraStarting(false);
      } catch (err: any) {
        stopCamera();
        const errName = err?.name || '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setCameraError(
            "Permission caméra refusée. Autorisez la caméra dans votre navigateur, ou utilisez « Importer image QR » / saisie manuelle."
          );
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError(
            "Aucune caméra détectée sur cet appareil. Utilisez « Importer image QR » ou saisissez le code manuellement."
          );
        } else {
          setCameraError(
            "Impossible de démarrer la caméra dans cet environnement (iFrame ou HTTPS requis). Utilisez « Importer image QR » ou le code ci-dessous."
          );
        }
      }
    },
    [facingMode, stopCamera]
  );

  // Clean up camera when modal closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCameraError(null);
      return;
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, stopCamera]);

  // Continuous live frame decoding loop when camera is active
  useEffect(() => {
    if (!isOpen || !cameraActive) return;

    const BarcodeDetectorCtor = (window as any).BarcodeDetector;
    let detector: any = null;
    if (BarcodeDetectorCtor) {
      try {
        detector = new BarcodeDetectorCtor({
          formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e']
        });
      } catch {
        detector = null;
      }
    }

    let isDecoding = false;

    scanTimerRef.current = window.setInterval(async () => {
      if (isDecoding) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) return;

      isDecoding = true;
      try {
        // 1. Native BarcodeDetector (supports QR + 1D ISBN barcodes)
        if (detector) {
          try {
            const barcodes = await detector.detect(video);
            if (Array.isArray(barcodes) && barcodes.length > 0 && barcodes[0]?.rawValue) {
              handleDetectedCode(String(barcodes[0].rawValue), 'camera');
              return;
            }
          } catch {
            // fallback to jsQR below
          }
        }

        // 2. Universal jsQR frame decoding via offscreen canvas
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const maxDim = 640;
          const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
          const w = Math.max(1, Math.floor(video.videoWidth * scale));
          const h = Math.max(1, Math.floor(video.videoHeight * scale));
          if (canvas.width !== w) canvas.width = w;
          if (canvas.height !== h) canvas.height = h;
          ctx.drawImage(video, 0, 0, w, h);
          const imageData = ctx.getImageData(0, 0, w, h);
          const decoded = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
          if (decoded?.data) {
            handleDetectedCode(decoded.data, 'camera');
          }
        }
      } finally {
        isDecoding = false;
      }
    }, 200);

    return () => {
      if (scanTimerRef.current !== null) {
        window.clearInterval(scanTimerRef.current);
        scanTimerRef.current = null;
      }
    };
  }, [isOpen, cameraActive, handleDetectedCode]);

  const handleImageFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = async () => {
        try {
          const canvas = canvasRef.current || document.createElement('canvas');
          const maxDim = 1024;
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.max(1, Math.floor(img.width * scale));
          const h = Math.max(1, Math.floor(img.height * scale));
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, w, h);

          // Try native BarcodeDetector first if available
          const BarcodeDetectorCtor = (window as any).BarcodeDetector;
          if (BarcodeDetectorCtor) {
            try {
              const detector = new BarcodeDetectorCtor({
                formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39']
              });
              const barcodes = await detector.detect(canvas);
              if (Array.isArray(barcodes) && barcodes.length > 0 && barcodes[0]?.rawValue) {
                handleDetectedCode(String(barcodes[0].rawValue), 'image');
                showToast(`Code décodé depuis l'image : ${barcodes[0].rawValue}`);
                return;
              }
            } catch {
              // continue to jsQR
            }
          }

          const imageData = ctx.getImageData(0, 0, w, h);
          const decoded = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
          if (decoded?.data) {
            handleDetectedCode(decoded.data, 'image');
            showToast(`QR Code décodé depuis l'image : ${decoded.data}`);
          } else {
            setCameraError("Aucun QR Code lisible détecté dans cette image. Vérifiez la netteté ou saisissez le code.");
          }
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setCameraError("Impossible de lire le fichier image sélectionné.");
      };
      img.src = objectUrl;
    } catch {
      setCameraError("Erreur lors du décodage de l'image QR.");
    }
  };

  if (!isOpen) return null;

  const parsedToken = activeCode ? parseScannedToken(activeCode) : null;
  const normalizedQuery = parsedToken?.normalized || '';
  const cleanDigitsQuery = normalizedQuery.replace(/[-\s]/g, '');

  const matchedBook: BookItem | undefined = parsedToken
    ? books.find(b => {
        const qr = b.qrCodeId.toLowerCase();
        const isbnClean = b.isbn.toLowerCase().replace(/[-\s]/g, '');
        return (
          qr === normalizedQuery ||
          b.id.toLowerCase() === normalizedQuery ||
          isbnClean === cleanDigitsQuery ||
          b.title.toLowerCase() === normalizedQuery
        );
      }) ||
      books.find(b =>
        b.qrCodeId.toLowerCase().includes(normalizedQuery) ||
        b.title.toLowerCase().includes(normalizedQuery)
      )
    : undefined;

  const matriculeLookup = (parsedToken?.extractedMatricule || activeCode).trim().toLowerCase();

  const matchedBookActiveLoans: LoanRecord[] = matchedBook
    ? loans.filter(
        l => l.bookId === matchedBook.id && (l.status === 'en_cours' || l.status === 'en_retard')
      )
    : [];

  const matchedBorrowerLoans: LoanRecord[] = parsedToken && !matchedBook
    ? loans.filter(
        l =>
          l.id.toLowerCase() === normalizedQuery ||
          l.borrowerMatricule.toLowerCase() === matriculeLookup ||
          l.borrowerName.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setCameraError(null);
    handleDetectedCode(manualCode, 'manual');
  };

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraActive) {
      void startCamera(nextMode);
    }
  };

  const handleQuickLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageLibrary || !matchedBook || !borrowerName.trim() || !borrowerMatricule.trim()) return;
    registerLoan({
      bookId: matchedBook.id,
      bookTitle: matchedBook.title,
      borrowerName: borrowerName.trim(),
      borrowerMatricule: borrowerMatricule.trim(),
      borrowerRole,
      borrowerClass: borrowerRole === 'Élève' ? borrowerClass : undefined,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: loanDueDate,
      status: 'en_cours'
    });
    setShowQuickLoanForm(false);
    setBorrowerName('');
    setBorrowerMatricule('');
  };

  const sampleBook = books[0];
  const sampleLoan = loans.find(l => l.status === 'en_cours' || l.status === 'en_retard');

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-indigo-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 via-blue-50 to-white border-b border-indigo-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-blue-950">
                Scanner Caméra, Code QR &amp; ISBN Bibliothèque
              </h3>
              <p className="text-[11px] text-slate-600">
                Lecture en direct par caméra, image QR ou saisie manuelle / douchette USB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-950 hover:bg-indigo-100/60 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Live Camera Viewport */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative">
            <div className="relative aspect-video w-full flex items-center justify-center bg-slate-900">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {cameraActive ? (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl border-2 border-emerald-400/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.45)] relative">
                    <div className="absolute inset-x-2 top-1/2 h-0.5 bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="mt-3 px-3 py-1 rounded-full bg-slate-900/80 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                    Caméra active · Placez le QR Code ou code-barres ISBN dans le cadre
                  </span>
                </div>
              ) : (
                <div className="p-6 text-center space-y-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-white font-bold text-xs">
                    {cameraStarting ? 'Activation de la caméra en cours...' : 'Caméra prête à scanner'}
                  </div>
                  <p className="text-[11px] text-slate-300 max-w-sm mx-auto">
                    Cliquez sur <strong>« Activer la Caméra »</strong> pour lire un QR Code livre/badge ou importez une photo de QR Code.
                  </p>
                </div>
              )}
            </div>

            {/* Camera Controls Strip */}
            <div className="px-3.5 py-2.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {!cameraActive ? (
                  <button
                    type="button"
                    disabled={cameraStarting}
                    onClick={() => void startCamera()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] cursor-pointer disabled:opacity-60"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{cameraStarting ? 'Démarrage...' : 'Activer la Caméra'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                  >
                    <CameraOff className="w-3.5 h-3.5" />
                    <span>Arrêter Caméra</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] cursor-pointer"
                  title="Basculer caméra arrière / frontale"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>{facingMode === 'environment' ? 'Caméra Arrière' : 'Caméra Frontale'}</span>
                </button>
              </div>

              <div>
                <input
                  ref={imageUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileScan}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageUploadRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-semibold text-[11px] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importer image QR</span>
                </button>
              </div>
            </div>
          </div>

          {cameraError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-[11px]">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Manual / USB Barcode Scanner Input */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-700">
              Code QR, ISBN ou Matricule (Saisie manuelle ou douchette USB) :
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  placeholder="Ex: QR-BIB-101, 978-2-09-172534-5 ou MAT-2026-045"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer shrink-0"
              >
                Vérifier
              </button>
            </div>

            {(sampleBook || sampleLoan) && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] text-slate-500">
                <span>Codes rapides :</span>
                {sampleBook && (
                  <button
                    type="button"
                    onClick={() => handleDetectedCode(sampleBook.qrCodeId, 'manual')}
                    className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono border border-indigo-200 cursor-pointer"
                  >
                    {sampleBook.qrCodeId}
                  </button>
                )}
                {sampleBook?.isbn && (
                  <button
                    type="button"
                    onClick={() => handleDetectedCode(sampleBook.isbn, 'manual')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono border border-slate-200 cursor-pointer"
                  >
                    ISBN {sampleBook.isbn}
                  </button>
                )}
                {sampleLoan && (
                  <button
                    type="button"
                    onClick={() => handleDetectedCode(sampleLoan.borrowerMatricule, 'manual')}
                    className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-mono border border-emerald-200 cursor-pointer"
                  >
                    {sampleLoan.borrowerMatricule}
                  </button>
                )}
              </div>
            )}
          </form>

          {/* Scan Result Panel */}
          {activeCode && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Résultat ({lastDetectedSource === 'camera' ? 'Caméra' : lastDetectedSource === 'image' ? 'Image QR' : 'Code saisi'}) :
                  </span>
                  <code className="px-1.5 py-0.5 rounded bg-white border border-indigo-200 font-mono text-blue-950">
                    {activeCode}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCode('');
                    setManualCode('');
                    setShowQuickLoanForm(false);
                  }}
                  className="text-[11px] text-slate-500 hover:text-blue-950 font-semibold cursor-pointer"
                >
                  Effacer
                </button>
              </div>

              {matchedBook ? (
                <div className="bg-white rounded-xl border border-blue-100 p-3.5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-black text-sm text-blue-950">{matchedBook.title}</div>
                      <div className="text-[11px] text-slate-500">
                        {matchedBook.author} · {matchedBook.category}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-1">
                        QR: <strong>{matchedBook.qrCodeId}</strong> · ISBN: {matchedBook.isbn} · Rayon: <strong>{matchedBook.shelfLocation}</strong>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 border ${
                        matchedBook.availableQuantity > 0
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {matchedBook.availableQuantity}/{matchedBook.totalQuantity} dispo
                    </span>
                  </div>

                  {/* Active loans for this book */}
                  {matchedBookActiveLoans.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-700">
                        Emprunts en cours pour cet ouvrage ({matchedBookActiveLoans.length}) :
                      </div>
                      {matchedBookActiveLoans.map(loan => (
                        <div
                          key={loan.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-200"
                        >
                          <div>
                            <div className="font-bold text-blue-950">{loan.borrowerName}</div>
                            <div className="text-[10px] text-slate-600 font-mono">
                              {loan.borrowerMatricule} · Échéance : {loan.dueDate}
                            </div>
                          </div>
                          {canManageLibrary && (
                            <button
                              type="button"
                              onClick={() => returnBook(loan.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Valider Retour</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Actions on matched book */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {canManageLibrary && matchedBook.availableQuantity > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowQuickLoanForm(v => !v)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{showQuickLoanForm ? 'Fermer formulaire prêt' : 'Enregistrer un Prêt Rapide'}</span>
                      </button>
                    )}

                    {(matchedBook.fileData || matchedBook.content) && onOpenReader && (
                      <button
                        type="button"
                        onClick={() => onOpenReader(matchedBook)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-[11px] cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Lire / Ouvrir PDF</span>
                      </button>
                    )}
                  </div>

                  {canManageLibrary && showQuickLoanForm && matchedBook.availableQuantity > 0 && (
                    <form onSubmit={handleQuickLoanSubmit} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={borrowerName}
                          onChange={e => setBorrowerName(e.target.value)}
                          placeholder="Nom complet de l'emprunteur *"
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-950 text-xs"
                        />
                        <input
                          type="text"
                          required
                          value={borrowerMatricule}
                          onChange={e => setBorrowerMatricule(e.target.value)}
                          placeholder="Matricule (ex: MAT-2026-045) *"
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-950 font-mono text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={borrowerRole}
                          onChange={e => setBorrowerRole(e.target.value as 'Élève' | 'Enseignant')}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-950 text-xs"
                        >
                          <option value="Élève">Élève</option>
                          <option value="Enseignant">Enseignant</option>
                        </select>
                        <input
                          type="text"
                          value={borrowerClass}
                          onChange={e => setBorrowerClass(e.target.value)}
                          placeholder="Classe"
                          disabled={borrowerRole !== 'Élève'}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-950 text-xs disabled:opacity-50"
                        />
                        <input
                          type="date"
                          required
                          value={loanDueDate}
                          onChange={e => setLoanDueDate(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-950 text-xs"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                        >
                          Confirmer le Prêt
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : matchedBorrowerLoans.length > 0 ? (
                <div className="bg-white rounded-xl border border-emerald-200 p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Dossier Emprunteur identifié ({matchedBorrowerLoans.length} prêt(s))</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedBorrowerLoans.map(loan => (
                      <div
                        key={loan.id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                      >
                        <div>
                          <div className="font-bold text-blue-950">{loan.bookTitle}</div>
                          <div className="text-[10px] text-slate-600">
                            {loan.borrowerName} (<span className="font-mono">{loan.borrowerMatricule}</span>) · Échéance : {loan.dueDate}
                          </div>
                        </div>
                        {loan.status === 'en_cours' || loan.status === 'en_retard' ? (
                          canManageLibrary ? (
                            <button
                              type="button"
                              onClick={() => returnBook(loan.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer shrink-0"
                            >
                              Retourner
                            </button>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-700">En cours</span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            Retourné
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-amber-200 p-3 flex items-start gap-2 text-amber-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Code scanné : {activeCode}</div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Aucun ouvrage ou emprunt actif correspondant trouvé dans le catalogue de cette école. Vérifiez le code QR/ISBN du livre ou le matricule saisi.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-indigo-100 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
