import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
}

export function ImageUploader({ image, onImageChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onImageChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onImageChange(null);
  }, [onImageChange]);

  if (image) {
    return (
      <div className="relative group animate-scale-in">
        <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-card">
          <img
            src={image}
            alt="上传的图片"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      className={`upload-zone aspect-[3/4] flex flex-col items-center justify-center cursor-pointer ${
        isDragging ? "drag-over" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          {isDragging ? (
            <ImageIcon className="w-8 h-8 text-primary animate-pulse" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium mb-1">
            {isDragging ? "松开即可上传" : "上传人物照片"}
          </p>
          <p className="text-sm text-muted-foreground">
            拖拽或点击选择图片
          </p>
        </div>
      </div>
    </label>
  );
}
