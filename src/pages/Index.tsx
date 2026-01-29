import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { StyleSelector, STYLES } from "@/components/StyleSelector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Wand2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage || !selectedStyle) return;

    setIsProcessing(true);
    setResultImage(null);

    const style = STYLES.find((s) => s.id === selectedStyle);
    if (!style) {
      toast.error("请选择有效的服装风格");
      setIsProcessing(false);
      return;
    }

    try {
      // 调用真实的 AI 换装 API
      const { data, error } = await supabase.functions.invoke("ai-try-on", {
        body: {
          personImage: uploadedImage,
          style: {
            id: style.id,
            name: style.name,
            description: style.description,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.resultImage) {
        setResultImage(data.resultImage);
        toast.success("AI 换装完成！");
      } else {
        throw new Error("未能生成换装效果");
      }
    } catch (error) {
      console.error("AI try-on error:", error);
      toast.error(error instanceof Error ? error.message : "换装失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedImage, selectedStyle]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const canGenerate = uploadedImage && selectedStyle && !isProcessing;

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh">
      <div className="container max-w-7xl mx-auto px-4">
        <Header />

        {/* Hero Section */}
        <section className="py-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">用 AI </span>
            <span className="text-gradient">改变你的穿搭</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            上传照片，选择风格，让 AI 为你呈现不同穿搭效果
          </p>
        </section>

        {/* Main Content */}
        <main className="pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  1
                </div>
                <h2 className="text-lg font-semibold text-foreground">上传照片</h2>
              </div>
              <ImageUploader
                image={uploadedImage}
                onImageChange={setUploadedImage}
              />
            </div>

            {/* Center: Style Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  2
                </div>
                <h2 className="text-lg font-semibold text-foreground">选择风格</h2>
              </div>
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleSelect={setSelectedStyle}
              />
              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                <Wand2 className="w-5 h-5" />
                {isProcessing ? "生成中..." : "开始换装"}
              </button>
            </div>

            {/* Right: Result Display */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  3
                </div>
                <h2 className="text-lg font-semibold text-foreground">换装效果</h2>
              </div>
              <ResultDisplay
                originalImage={uploadedImage}
                resultImage={resultImage}
                isProcessing={isProcessing}
                onRegenerate={handleRegenerate}
              />
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="py-12 border-t border-border/30">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">智能识别</h3>
              <p className="text-sm text-muted-foreground">
                AI 自动识别人物轮廓，精准匹配服装
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">多种风格</h3>
              <p className="text-sm text-muted-foreground">
                商务、休闲、运动等多种风格任你选择
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">极速生成</h3>
              <p className="text-sm text-muted-foreground">
                几秒内即可生成高质量换装效果图
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 AI 换装. 智能服装试穿体验平台
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
