import { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

export interface CameraDeviceOption {
  deviceId: string;
  label: string;
}

interface BarcodeDetectorLike {
  detect: (source: HTMLVideoElement | HTMLCanvasElement) => Promise<Array<{ rawValue?: string }>>;
}

interface BarcodeDetectorConstructorLike {
  new (options?: { formats?: string[] }): BarcodeDetectorLike;
}

interface UseCameraScannerOptions {
  isOpen: boolean;
  autoStart?: boolean;
  onDetect: (code: string, source: 'camera' | 'image') => void;
}

function getBarcodeDetectorCtor(): BarcodeDetectorConstructorLike | null {
  if (typeof window === 'undefined') return null;
  const ctor = (window as unknown as { BarcodeDetector?: BarcodeDetectorConstructorLike }).BarcodeDetector;
  return typeof ctor === 'function' ? ctor : null;
}

export function useCameraScanner({
  isOpen,
  autoStart = true,
  onDetect
}: UseCameraScannerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<number | null>(null);
  const onDetectRef = useRef(onDetect);
  onDetectRef.current = onDetect;

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [videoDevices, setVideoDevices] = useState<CameraDeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const refreshVideoDevices = useCallback(async (preferredDeviceId?: string) => {
    if (!navigator?.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices
        .filter(d => d.kind === 'videoinput')
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label?.trim() || `Caméra / Webcam ${idx + 1}`
        }));
      setVideoDevices(cams);

      if (preferredDeviceId && cams.some(c => c.deviceId === preferredDeviceId)) {
        setSelectedDeviceId(preferredDeviceId);
      } else if (cams.length > 0) {
        setSelectedDeviceId(prev =>
          prev && cams.some(c => c.deviceId === prev) ? prev : cams[0].deviceId
        );
      }
    } catch {
      // Ignore enumerateDevices failures on restricted browsers
    }
  }, []);

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

  const openStreamWithFallback = useCallback(
    async (mode: 'environment' | 'user', explicitDeviceId?: string): Promise<MediaStream> => {
      if (explicitDeviceId) {
        try {
          return await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: explicitDeviceId },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });
        } catch {
          try {
            return await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: explicitDeviceId } },
              audio: false
            });
          } catch {
            // Fall through to facingMode / generic webcam constraints
          }
        }
      }

      try {
        return await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch {
        try {
          return await navigator.mediaDevices.getUserMedia({
            video: { facingMode: mode },
            audio: false
          });
        } catch {
          // Universal fallback for laptop webcams / USB cameras / older drivers
          return await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }
      }
    },
    []
  );

  const startCamera = useCallback(
    async (options?: { mode?: 'environment' | 'user'; deviceId?: string }) => {
      const targetMode = options?.mode ?? facingMode;
      const targetDeviceId = options?.deviceId;

      stopCamera();
      setCameraError(null);

      if (typeof window !== 'undefined' && !window.isSecureContext) {
        setCameraError(
          "La caméra nécessite une connexion sécurisée (HTTPS ou localhost). Utilisez « Photo Caméra » ou « Importer image QR »."
        );
        return;
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError(
          "Votre navigateur ne prend pas en charge l'accès direct à la caméra vidéo. Utilisez « Photo Caméra » ou « Importer image QR »."
        );
        return;
      }

      setCameraStarting(true);
      try {
        const stream = await openStreamWithFallback(targetMode, targetDeviceId);
        streamRef.current = stream;

        const activeTrack = stream.getVideoTracks()[0];
        const activeSettings = activeTrack?.getSettings?.();
        const activeDeviceId = activeSettings?.deviceId;

        await refreshVideoDevices(activeDeviceId);

        const videoEl = videoRef.current;
        if (videoEl) {
          videoEl.setAttribute('playsinline', 'true');
          videoEl.setAttribute('webkit-playsinline', 'true');
          videoEl.muted = true;
          videoEl.srcObject = stream;
          setCameraActive(true);
          try {
            await videoEl.play();
          } catch {
            await new Promise<void>(resolve => {
              const onMeta = () => {
                videoEl.removeEventListener('loadedmetadata', onMeta);
                resolve();
              };
              videoEl.addEventListener('loadedmetadata', onMeta);
              window.setTimeout(resolve, 450);
            });
            await videoEl.play().catch(() => undefined);
          }
        } else {
          setCameraActive(true);
        }
        setCameraStarting(false);
      } catch (err: unknown) {
        stopCamera();
        const errName =
          typeof err === 'object' && err !== null && 'name' in err
            ? String((err as { name?: unknown }).name || '')
            : '';
        const inIframe = typeof window !== 'undefined' && window.self !== window.top;

        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setCameraError(
            inIframe
              ? "La caméra a été refusée ou bloquée par l'aperçu intégré. Cliquez sur l'icône caméra dans la barre d'adresse, ouvrez l'application dans un onglet dédié, ou utilisez « Photo Caméra » / « Importer image QR »."
              : "Permission caméra refusée. Cliquez sur l'icône de cadenas / caméra dans la barre d'adresse pour autoriser la caméra de votre téléphone ou ordinateur, puis réessayez."
          );
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError(
            "Aucune caméra ou webcam détectée sur cet appareil. Branchez une webcam ou utilisez « Importer image QR »."
          );
        } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
          setCameraError(
            "La caméra est déjà utilisée par une autre application (Zoom, Teams, Caméra, etc.). Fermez l'autre application puis cliquez sur « Activer la Caméra »."
          );
        } else {
          setCameraError(
            "Impossible de démarrer le flux caméra en direct. Vérifiez l'autorisation navigateur ou utilisez « Photo Caméra » / « Importer image QR »."
          );
        }
      }
    },
    [facingMode, openStreamWithFallback, refreshVideoDevices, stopCamera]
  );

  const startCameraRef = useRef(startCamera);
  startCameraRef.current = startCamera;

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCameraError(null);
      return;
    }

    void refreshVideoDevices();
    const mediaDevices = navigator?.mediaDevices;
    const handleDeviceChange = () => {
      void refreshVideoDevices();
    };
    mediaDevices?.addEventListener?.('devicechange', handleDeviceChange);

    let timer: number | undefined;
    if (autoStart) {
      timer = window.setTimeout(() => {
        void startCameraRef.current();
      }, 120);
    }

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      mediaDevices?.removeEventListener?.('devicechange', handleDeviceChange);
      stopCamera();
    };
  }, [isOpen, autoStart, refreshVideoDevices, stopCamera]);

  // Continuous live frame decoding loop
  useEffect(() => {
    if (!isOpen || !cameraActive) return;

    const BarcodeDetectorCtor = getBarcodeDetectorCtor();
    let detector: BarcodeDetectorLike | null = null;
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
        if (detector) {
          try {
            const barcodes = await detector.detect(video);
            if (Array.isArray(barcodes) && barcodes.length > 0 && barcodes[0]?.rawValue) {
              onDetectRef.current(String(barcodes[0].rawValue), 'camera');
              return;
            }
          } catch {
            // Continue with jsQR
          }
        }

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const maxDim = 720;
          const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
          const w = Math.max(1, Math.floor(video.videoWidth * scale));
          const h = Math.max(1, Math.floor(video.videoHeight * scale));
          if (canvas.width !== w) canvas.width = w;
          if (canvas.height !== h) canvas.height = h;
          ctx.drawImage(video, 0, 0, w, h);
          const imageData = ctx.getImageData(0, 0, w, h);
          const decoded = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
          if (decoded?.data) {
            onDetectRef.current(decoded.data, 'camera');
          }
        }
      } finally {
        isDecoding = false;
      }
    }, 160);

    return () => {
      if (scanTimerRef.current !== null) {
        window.clearInterval(scanTimerRef.current);
        scanTimerRef.current = null;
      }
    };
  }, [isOpen, cameraActive]);

  const toggleFacingMode = useCallback(() => {
    const nextMode: 'environment' | 'user' = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraActive) {
      void startCamera({ mode: nextMode });
    }
  }, [cameraActive, facingMode, startCamera]);

  const selectDevice = useCallback(
    (deviceId: string) => {
      setSelectedDeviceId(deviceId);
      if (deviceId) {
        void startCamera({ deviceId });
      }
    },
    [startCamera]
  );

  const scanImageFile = useCallback((file: File) => {
    setCameraError(null);
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        const canvas = canvasRef.current || document.createElement('canvas');
        const maxDim = 1280;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.floor(img.width * scale));
        const h = Math.max(1, Math.floor(img.height * scale));
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);

        const BarcodeDetectorCtor = getBarcodeDetectorCtor();
        if (BarcodeDetectorCtor) {
          try {
            const detector = new BarcodeDetectorCtor({
              formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e']
            });
            const barcodes = await detector.detect(canvas);
            if (Array.isArray(barcodes) && barcodes.length > 0 && barcodes[0]?.rawValue) {
              onDetectRef.current(String(barcodes[0].rawValue), 'image');
              return;
            }
          } catch {
            // Continue to jsQR
          }
        }

        const imageData = ctx.getImageData(0, 0, w, h);
        const decoded = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
        if (decoded?.data) {
          onDetectRef.current(decoded.data, 'image');
        } else {
          setCameraError(
            "Aucun QR Code ou code-barres lisible détecté dans cette photo. Rapprochez la caméra et assurez une bonne luminosité."
          );
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
  }, []);

  return {
    videoRef,
    canvasRef,
    cameraActive,
    cameraStarting,
    cameraError,
    setCameraError,
    facingMode,
    videoDevices,
    selectedDeviceId,
    startCamera,
    stopCamera,
    toggleFacingMode,
    selectDevice,
    scanImageFile
  };
}
