import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI 换装</h1>
            <p className="text-xs text-muted-foreground">智能服装试穿体验</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            使用指南
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            关于我们
          </a>
        </nav>
      </div>
    </header>
  );
}
