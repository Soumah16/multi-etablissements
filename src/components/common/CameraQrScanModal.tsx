import React, { useCallback, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  FlipHorizontal,
  Laptop,
  QrCode,
  RotateCcw,
  Search,
  Smartphone,
  Upload,
  X,
  ExternalLink,
  ScanLine
} from 'lucide-react';
import { useCameraScanner } from '../../hooks/useCameraScanner';

export interface CameraQrScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  expectedHint?: string;
  onCodeDetected?: (decodedValue: string, source: 'camera' | 'image' | 'manual') => void;
}

export const CameraQrScanModal: React.FC<CameraQrScanModalProps> = ({
  isOpen,
  onClose,
  title = 'Scanner QR Code (Téléphone & Ordinateur)',
  subtitle = 'Pointez un badge ou document devant la caméra du téléphone ou la webcam de votre ordinateur',
  expectedHint,
  onCodeDetected
}) => {
  const imageUploadRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraCaptureRef = useRef<HTMLInputElement | null>(null);

  const [detectedCode, setDetectedCode] = useState<string>('');
  const [detectedSource, setDetectedSource] = useState<'camera' | 'image' | 'manual' | null>(null);
  const [manualInput, setManualInput] = useState<string>('');

  const handleDetect = useCallback(
    (code: string, source: 'camera' | 'image') => {
      const cleaned = code.trim();
      if (!cleaned) return;
      setDetectedCode(cleaned);
      setDetectedSource(source);
      setManualInput(cleaned);
      onCodeDetected?.(cleaned, source);
    },
    [onCodeDetected]
  );

  const {
    videoRef,
    canvasRef,
    cameraActive,
    cameraStarting,
    cameraError,
    setCameraError,
    activeCameraInfo,
    isInIframe,
    facingMode,
    videoDevices,
    selectedDeviceId,
    startCamera,
    stopCamera,
    toggleFacingMode,
    selectDevice,
    scanImageFile,
    captureAndScanNow
  } = useCameraScanner({
    isOpen,
    autoStart: true,
    onDetect: (code, source) => {
      handleDetect(code, source);
      if (source === 'camera') {
        stopCamera();
      }
    }
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      scanImageFile(file);
    }
  };

  const handleManualCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = manualInput.trim();
    if (!cleaned) return;
    setCameraError(null);
    setDetectedCode(cleaned);
    setDetectedSource('manual');
    onCodeDetected?.(cleaned, 'manual');
  };

  const parsedParts = detectedCode.includes('|') ? detectedCode.split('|').map(p => p.trim()).filter(Boolean) : [];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-blue-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-white border-b border-blue-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-blue-950">{title}</h3>
              <p className="text-[11px] text-slate-600">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-950 hover:bg-blue-100/60 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Device Compatibility Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 font-semibold">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                Téléphone (Arrière / Frontale)
              </span>
              <span className="inline-flex items-center gap-1 font-semibold">
                <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                Ordinateur (Webcam intégrée / USB)
              </span>
            </div>
            {videoDevices.length > 0 && (
              <select
                value={selectedDeviceId}
                onChange={e => selectDevice(e.target.value)}
                aria-label="Sélectionner une caméra"
                className="px-2 py-1 rounded-lg bg-white border border-blue-200 text-blue-950 font-semibold text-[11px] focus:outline-hidden focus:border-blue-500 max-w-[220px]"
              >
                {!selectedDeviceId && <option value="">Caméra automatique</option>}
                {videoDevices.map(dev => (
                  <option key={dev.deviceId} value={dev.deviceId}>
                    {dev.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Live Video Viewport */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="relative aspect-[4/3] sm:aspect-video min-h-[240px] w-full flex items-center justify-center bg-slate-900 overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                  cameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {cameraActive ? (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 p-3">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl border-2 border-emerald-400/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.42)] relative">
                    <div className="absolute inset-x-2 top-1/2 h-0.5 bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="mt-3 px-3 py-1 rounded-full bg-slate-900/85 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 text-center max-w-full truncate">
                    {activeCameraInfo || 'Caméra active'} · Cadrez le QR Code devant l&apos;objectif
                  </span>
                </div>
              ) : (
                <div className="relative z-10 p-6 text-center space-y-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-white font-bold text-xs">
                    {cameraStarting ? 'Activation de la caméra en cours...' : 'Caméra prête à scanner'}
                  </div>
                  <p className="text-[11px] text-slate-300 max-w-sm mx-auto">
                    Autorisez l&apos;accès à la caméra du navigateur ou cliquez sur <strong>« Activer la Caméra »</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Controls Strip */}
            <div className="px-3.5 py-2.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {!cameraActive ? (
                  <button
                    type="button"
                    disabled={cameraStarting}
                    onClick={() => void startCamera(selectedDeviceId ? { deviceId: selectedDeviceId } : undefined)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] cursor-pointer disabled:opacity-60"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{cameraStarting ? 'Démarrage...' : 'Activer la Caméra'}</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => void captureAndScanNow()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                      title="Capturer et analyser immédiatement la vue caméra"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      <span>Analyser maintenant</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                    >
                      <CameraOff className="w-3.5 h-3.5" />
                      <span>Arrêter</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] cursor-pointer"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>{facingMode === 'environment' ? 'Caméra Arrière' : 'Caméra Frontale'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={nativeCameraCaptureRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => nativeCameraCaptureRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Photo Caméra</span>
                </button>

                <input
                  ref={imageUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageUploadRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 font-semibold text-[11px] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importer image QR</span>
                </button>
              </div>
            </div>
          </div>

          {cameraError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-[11px]">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
              {isInIframe && typeof window !== 'undefined' && (
                <div className="pl-6">
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ouvrir hors aperçu (Activer la Caméra)</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Optional Manual Input / USB Scanner */}
          <form onSubmit={handleManualCheck} className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700">
              {expectedHint || 'Code détecté ou saisie manuelle / douchette USB :'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  placeholder="Code QR ou matricule..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shrink-0"
              >
                Vérifier
              </button>
            </div>
          </form>

          {/* Result Card */}
          {detectedCode && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    QR Code lu avec succès ({detectedSource === 'camera' ? 'Caméra en direct' : detectedSource === 'image' ? 'Image QR' : 'Saisie'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDetectedCode('');
                    setDetectedSource(null);
                    setManualInput('');
                    void startCamera(selectedDeviceId ? { deviceId: selectedDeviceId } : undefined);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Rescanner</span>
                </button>
              </div>

              {parsedParts.length > 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {parsedParts.map((part, idx) => (
                    <div
                      key={`${part}-${idx}`}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-200 font-mono text-blue-950 break-all"
                    >
                      {part}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-white border border-emerald-200 font-mono text-xs text-blue-950 break-all">
                  {detectedCode}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-blue-100 flex items-center justify-end shrink-0">
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
