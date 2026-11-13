import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  X, 
  Check, 
  FileUp, 
  HardDrive, 
  AlertCircle,
  Eye
} from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  aspectRatio?: 'square' | 'circle' | 'banner';
  placeholder?: string;
  required?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
  aspectRatio = 'square',
  placeholder = 'https://...',
  required = false
}) => {
  // Determine initial mode: if value starts with data:, it was uploaded from PC; otherwise URL
  const [mode, setMode] = useState<'upload' | 'url'>(
    value && value.startsWith('data:') ? 'upload' : 'url'
  );
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide (PNG, JPG, WEBP, SVG).');
      return;
    }

    // Allow up to 10MB input and compress raster images automatically for fast web/mobile storage
    if (file.size > 10 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 10 Mo.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      // Keep SVG or small files (< 220KB) untouched
      if (file.type === 'image/svg+xml' || file.size < 220 * 1024) {
        onChange(result);
        return;
      }

      // Compress larger PNG/JPG/WEBP onto a canvas (max 1400px) so localStorage stays lightweight
      const img = new Image();
      img.onload = () => {
        const maxDim = 1400;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          onChange(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        onChange(compressed);
      };
      img.onerror = () => onChange(result);
      img.src = result;
    };
    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    onChange('');
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isDataUrl = value && value.startsWith('data:');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-slate-700">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
        
        {/* Source Toggle Mode */}
        <div className="inline-flex rounded-lg bg-slate-50 p-0.5 border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => { setMode('upload'); setError(null); }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
              mode === 'upload'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-blue-950'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>PC / Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('url'); setError(null); }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              mode === 'url'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-blue-950'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Lien URL</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-2">
        {mode === 'upload' ? (
          /* Upload from PC */
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            {!value ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300 bg-white/90 hover:bg-white'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileUp className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    Cliquez pour choisir une photo ou glissez-déposez
                  </div>
                  <p className="text-[10px] text-slate-500">
                    PNG, JPG, WEBP, SVG (Max. 5 Mo)
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* Direct URL Input */
          <div className="relative">
            <input
              type="url"
              value={isDataUrl ? '' : value}
              onChange={e => {
                setError(null);
                onChange(e.target.value);
              }}
              placeholder={isDataUrl ? 'Fichier importé depuis le PC (ou entrez une URL)' : placeholder}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500 pr-8"
            />
            {value && !isDataUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-2 text-slate-500 hover:text-rose-600 transition-colors"
                title="Effacer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Preview Card when image is available */}
        {value && (
          <div className="p-2.5 rounded-lg bg-blue-50/60 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Thumbnail */}
              <div className={`overflow-hidden border border-slate-300 bg-white shrink-0 flex items-center justify-center ${
                aspectRatio === 'circle' 
                  ? 'w-10 h-10 rounded-full' 
                  : aspectRatio === 'banner'
                    ? 'w-20 h-10 rounded-md'
                    : 'w-10 h-10 rounded-lg'
              }`}>
                <img 
                  src={value} 
                  alt="Aperçu" 
                  className="w-full h-full object-cover"
                  onError={() => setError('Impossible de charger cette image. Vérifiez le lien ou le fichier.')}
                />
              </div>

              {/* Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-blue-950 truncate max-w-[160px]">
                    {fileName || (isDataUrl ? 'Fichier importé du PC' : 'Image en ligne')}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {isDataUrl ? 'Local PC' : 'URL Web'}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" />
                  <span>Image prête et valide</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {mode === 'upload' && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:text-blue-950 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  Remplacer
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                title="Supprimer l'image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {helperText && (
          <p className="text-[10px] text-slate-500">{helperText}</p>
        )}
      </div>
    </div>
  );
};
