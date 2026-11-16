import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface RealQrCodeProps {
  value: string;
  size?: number;
  className?: string;
  fgColor?: string;
  bgColor?: string;
  alt?: string;
}

export const RealQrCode: React.FC<RealQrCodeProps> = ({
  value,
  size = 64,
  className = '',
  fgColor = '#0f172a',
  bgColor = '#ffffff',
  alt = 'QR Code officiel SmartSchool'
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const payload = (value || 'SMARTSCHOOL-GN-MEPUA').trim();
    QRCode.toDataURL(payload, {
      width: Math.max(size * 3, 240),
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: fgColor,
        light: bgColor
      }
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        // Ignore transient QR encoding errors
      });

    return () => {
      cancelled = true;
    };
  }, [value, size, fgColor, bgColor]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: bgColor }}
        className={`flex items-center justify-center rounded border border-slate-200 text-[9px] font-mono text-slate-400 ${className}`}
      >
        QR...
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`block object-contain ${className}`}
    />
  );
};

export async function generateQrDataUrl(
  value: string,
  width = 300,
  fgColor = '#0f172a',
  bgColor = '#ffffff'
): Promise<string> {
  return QRCode.toDataURL((value || 'SMARTSCHOOL-GN-MEPUA').trim(), {
    width,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: fgColor,
      light: bgColor
    }
  });
}

export async function downloadQrCodePng(
  value: string,
  filename: string,
  fgColor = '#0f172a'
): Promise<void> {
  const url = await generateQrDataUrl(value, 512, fgColor, '#ffffff');
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename.replace(/[^a-zA-Z0-9_-]+/g, '_')}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
