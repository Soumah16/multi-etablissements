import { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HTMLCanvasElementLuminanceSource,
  HybridBinarizer,
  MultiFormatReader
} from '@zxing/library';

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

function createZxingReader(): MultiFormatReader {
  const reader = new MultiFormatReader();
  const hints = new Map<DecodeHintType, unknown>();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.DATA_MATRIX
  ]);
  hints.set(DecodeHintType.TRY_HARDER, true);
  reader.setHints(hints);
  return reader;
}

async function decodeCanvasTripleEngine(
  canvas: HTMLCanvasElement,
  nativeDetector: BarcodeDetectorLike | null,
  zxingReader: MultiFormatReader
): Promise<string | null> {
  // 1. Native hardware-accelerated BarcodeDetector (Chrome / Edge / Android)
  if (nativeDetector) {
    try {
      const barcodes = await nativeDetector.detect(canvas);
      if (Array.isArray(barcodes) && barcodes.length > 0 && barcodes[0]?.rawValue) {
        return String(barcodes[0].rawValue).trim();
      }
    } catch {
      // Fallback to jsQR / ZXing
    }
  }

  // 2. Fast jsQR decode (handles standard + inverted QR codes cleanly)
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (ctx && canvas.width > 0 && canvas.height > 0) {
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decoded = jsQR(imageData.data, canvas.width, canvas.height, {
        inversionAttempts: 'attemptBoth'
      });
      if (decoded?.data) {
        return decoded.data.trim();
      }
    } catch {
      // Fallback to ZXing
    }
  }

  // 3. Universal ZXing decode (QR + 1D ISBN EAN-13/Code-128/Code-39 on iOS Safari, Firefox, Desktop)
  try {
    const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
    const bitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    const result = zxingReader.decode(bitmap);
    const text = result?.getText?.();
    if (text && text.trim()) {
      return text.trim();
    }
  } catch {
    // NotFoundException when no code is present in frame
  } finally {
    zxingReader.reset();
  }

  return null;
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
  const zxingReaderRef = useRef<MultiFormatReader | null>(null);
  const onDetectRef = useRef(onDetect);
  onDetectRef.current = onDetect;

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeCameraInfo, setActiveCameraInfo] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [videoDevices, setVideoDevices] = useState<CameraDeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const getZxingReader = useCallback(() => {
    if (!zxingReaderRef.current) {
      zxingReaderRef.current = createZxingReader();
    }
    return zxingReaderRef.current;
  }, []);

  const refreshVideoDevices = useCallback(async (preferredDeviceId?: string) => {
    if (!navigator?.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices
        .filter(d => d.kind === 'videoinput' && Boolean(d.deviceId))
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label?.trim() || `Caméra / Webcam ${idx + 1}`
        }));

      setVideoDevices(cams);

      if (preferredDeviceId && cams.some(c => c.deviceId === preferredDeviceId)) {
        setSelectedDeviceId(preferredDeviceId);
      } else if (cams.length > 0) {
        setSelectedDeviceId(prev =>
          prev && cams.some(c => c.deviceId === prev) ? prev : ''
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
    setActiveCameraInfo('');
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
    async (options?: { mode?: 'environment' | 'user'; deviceId?: string; isAuto?: boolean }) => {
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
          "Votre navigateur ne permet pas la caméra vidéo en direct. Utilisez « Photo Caméra » ou « Importer image QR »."
        );
        return;
      }

      setCameraStarting(true);
      try {
        const stream = await openStreamWithFallback(targetMode, targetDeviceId);
        streamRef.current = stream;

        const activeTrack = stream.getVideoTracks()[0];
        if (activeTrack?.applyConstraints) {
          // Request continuous autofocus where hardware/driver supports it (phones & autofocus webcams)
          void activeTrack
            .applyConstraints({
              advanced: [{ focusMode: 'continuous' } as unknown as MediaTrackConstraintSet]
            })
            .catch(() => undefined);
        }

        const videoEl = videoRef.current;
        if (!videoEl) {
          setCameraActive(true);
          setCameraStarting(false);
          return;
        }

        // Attach stream and start playback immediately (critical for iOS Safari & Android gesture rules)
        videoEl.setAttribute('playsinline', 'true');
        videoEl.setAttribute('webkit-playsinline', 'true');
        videoEl.muted = true;
        videoEl.srcObject = stream;

        let playbackOk = false;
        try {
          await videoEl.play();
          playbackOk = true;
        } catch {
          await new Promise<void>(resolve => {
            const onReady = () => {
              videoEl.removeEventListener('loadedmetadata', onReady);
              resolve();
            };
            videoEl.addEventListener('loadedmetadata', onReady);
            window.setTimeout(resolve, 450);
          });
          try {
            await videoEl.play();
            playbackOk = true;
          } catch {
            playbackOk = false;
          }
        }

        if (!playbackOk) {
          stopCamera();
          setCameraError(
            "Le navigateur demande un clic direct pour démarrer la vidéo. Cliquez sur « Activer la Caméra » ci-dessous."
          );
          return;
        }

        const activeSettings = activeTrack?.getSettings?.();
        const activeDeviceId = activeSettings?.deviceId;
        const w = activeSettings?.width || videoEl.videoWidth;
        const h = activeSettings?.height || videoEl.videoHeight;
        const trackLabel = activeTrack?.label?.trim() || 'Caméra active';
        setActiveCameraInfo(w && h ? `${trackLabel} (${w}×${h})` : trackLabel);

        setCameraActive(true);
        setCameraStarting(false);

        // Enumerate devices AFTER permission & playback succeed so labels/deviceIds are real
        void refreshVideoDevices(activeDeviceId);
      } catch (err: unknown) {
        stopCamera();
        const errName =
          typeof err === 'object' && err !== null && 'name' in err
            ? String((err as { name?: unknown }).name || '')
            : '';

        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setCameraError(
            isInIframe
              ? "La caméra en direct est bloquée par l'aperçu intégré. Ouvrez l'application dans un onglet dédié (bouton ci-dessous), ou utilisez « Photo Caméra » / « Importer image QR »."
              : "Autorisation caméra refusée. Cliquez sur l'icône de cadenas / caméra dans la barre d'adresse pour autoriser votre caméra (téléphone ou ordinateur), puis cliquez sur « Activer la Caméra »."
          );
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError(
            "Aucune caméra ou webcam détectée sur cet appareil. Branchez une webcam ou utilisez « Importer image QR »."
          );
        } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
          setCameraError(
            "La caméra est déjà utilisée par une autre application (Zoom, Teams, Caméra, etc.). Fermez l'autre application puis réessayez."
          );
        } else if (options?.isAuto) {
          setCameraError(
            "Cliquez sur « Activer la Caméra » ci-dessous pour autoriser l'accès à votre caméra."
          );
        } else {
          setCameraError(
            "Impossible de démarrer la caméra en direct ici. Essayez « Ouvrir hors aperçu » ou utilisez « Photo Caméra » / « Importer image QR »."
          );
        }
      }
    },
    [facingMode, isInIframe, openStreamWithFallback, refreshVideoDevices, stopCamera]
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
        void startCameraRef.current({ isAuto: true });
      }, 120);
    }

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      mediaDevices?.removeEventListener?.('devicechange', handleDeviceChange);
      stopCamera();
    };
  }, [isOpen, autoStart, refreshVideoDevices, stopCamera]);

  const decodeCurrentVideoFrame = useCallback(
    async (
      nativeDetector: BarcodeDetectorLike | null,
      fullFrame: boolean
    ): Promise<string | null> => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        return null;
      }

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;

      // 1. Center crop pass (razor-sharp resolution on the reticle box!)
      if (!fullFrame) {
        const cropSize = Math.floor(Math.min(vw, vh) * 0.68);
        const sx = Math.max(0, Math.floor((vw - cropSize) / 2));
        const sy = Math.max(0, Math.floor((vh - cropSize) / 2));
        const targetSize = Math.min(800, cropSize);
        if (canvas.width !== targetSize) canvas.width = targetSize;
        if (canvas.height !== targetSize) canvas.height = targetSize;
        ctx.drawImage(video, sx, sy, cropSize, cropSize, 0, 0, targetSize, targetSize);

        const cropResult = await decodeCanvasTripleEngine(canvas, nativeDetector, getZxingReader());
        if (cropResult) return cropResult;
      }

      // 2. Full-frame pass (high resolution up to 1080px for off-center QR codes or wide ISBN barcodes)
      const maxDim = 1080;
      const scale = Math.min(1, maxDim / Math.max(vw, vh));
      const w = Math.max(1, Math.floor(vw * scale));
      const h = Math.max(1, Math.floor(vh * scale));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      ctx.drawImage(video, 0, 0, w, h);

      return decodeCanvasTripleEngine(canvas, nativeDetector, getZxingReader());
    },
    [getZxingReader]
  );

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
    let tickCount = 0;

    scanTimerRef.current = window.setInterval(async () => {
      if (isDecoding) return;
      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.videoWidth === 0) return;

      isDecoding = true;
      tickCount += 1;
      try {
        // Alternate between center reticle crop and full frame so both close-up and wide codes decode rapidly
        const useFullFrameOnly = tickCount % 3 === 0;
        const found = await decodeCurrentVideoFrame(detector, useFullFrameOnly);
        if (found) {
          onDetectRef.current(found, 'camera');
        }
      } finally {
        isDecoding = false;
      }
    }, 150);

    return () => {
      if (scanTimerRef.current !== null) {
        window.clearInterval(scanTimerRef.current);
        scanTimerRef.current = null;
      }
    };
  }, [isOpen, cameraActive, decodeCurrentVideoFrame]);

  const captureAndScanNow = useCallback(async () => {
    if (!cameraActive) return;
    setCameraError(null);
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

    const foundCrop = await decodeCurrentVideoFrame(detector, false);
    if (foundCrop) {
      onDetectRef.current(foundCrop, 'camera');
      return;
    }
    const foundFull = await decodeCurrentVideoFrame(detector, true);
    if (foundFull) {
      onDetectRef.current(foundFull, 'camera');
      return;
    }

    setCameraError(
      "Aucun QR Code ou code-barres détecté dans cette capture. Rapprochez ou stabilisez le code dans le cadre vert avec une bonne luminosité."
    );
  }, [cameraActive, decodeCurrentVideoFrame]);

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

  const scanImageFile = useCallback(
    (file: File) => {
      setCameraError(null);
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = async () => {
        try {
          const canvas = canvasRef.current || document.createElement('canvas');
          const maxDim = 1600;
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.max(1, Math.floor(img.width * scale));
          const h = Math.max(1, Math.floor(img.height * scale));
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, w, h);

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

          const decoded = await decodeCanvasTripleEngine(canvas, detector, getZxingReader());
          if (decoded) {
            onDetectRef.current(decoded, 'image');
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
    },
    [getZxingReader]
  );

  return {
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
  };
}
