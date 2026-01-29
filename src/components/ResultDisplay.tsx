import { Download, RefreshCw, ImageIcon } from "lucide-react";

interface ResultDisplayProps {
  originalImage: string | null;
  resultImage: string | null;
  isProcessing: boolean;
  onRegenerate: () => void;
}

export function ResultDisplay({
  originalImage,
  resultImage,
  isProcessing,
  onRegenerate,
}: ResultDisplayProps) {
  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "ai-outfit-result.png";
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        {resultImage && (
          <div className="flex gap-2">
            <button
              onClick={onRegenerate}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? "animate-spin" : ""}`} />
              重新生成
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors"
            >
              <Download className="w-4 h-4" />
              下载
            </button>
          </div>
        )}
      </div>

      <div
        className={`result-container aspect-[3/4] ${
          resultImage ? "has-result" : ""
        }`}
      >
        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-secondary animate-spin-slow" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium mb-1">AI 正在处理中...</p>
              <p className="text-sm text-muted-foreground">
                正在为您生成换装效果
              </p>
            </div>
          </div>
        ) : resultImage ? (
          <img
            src={resultImage}
            alt="换装结果"
            className="w-full h-full object-cover animate-fade-in"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium mb-1">等待生成</p>
              <p className="text-sm text-muted-foreground">
                上传照片并选择风格后开始
              </p>
            </div>
          </div>
        )}

        {/* Before/After Comparison Overlay */}
        {resultImage && originalImage && !isProcessing && (
          <div className="absolute bottom-4 left-4 glass-card p-2 flex items-center gap-2">
            <img
              src={originalImage}
              alt="原图"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <span className="text-xs text-muted-foreground">原图</span>
          </div>
        )}
      </div>
    </div>
  );
}
