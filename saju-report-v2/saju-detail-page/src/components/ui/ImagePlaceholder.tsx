import { ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  alt: string;
  aspectRatio?: string;
  className?: string;
}

export function ImagePlaceholder({
  alt,
  aspectRatio = '16/9',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`bg-card border border-border rounded-card flex items-center justify-center ${className}`}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt}
    >
      <div className="text-center text-muted">
        <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">{alt}</p>
      </div>
    </div>
  );
}
