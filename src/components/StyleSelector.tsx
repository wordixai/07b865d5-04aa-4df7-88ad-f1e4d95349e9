import { Check } from "lucide-react";

export interface Style {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const STYLES: Style[] = [
  {
    id: "business",
    name: "商务正装",
    description: "专业商务造型",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop&q=80",
  },
  {
    id: "casual",
    name: "休闲时尚",
    description: "轻松日常穿搭",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=300&fit=crop&q=80",
  },
  {
    id: "sporty",
    name: "运动风格",
    description: "活力运动装扮",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop&q=80",
  },
  {
    id: "elegant",
    name: "优雅晚装",
    description: "华丽正式场合",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&h=300&fit=crop&q=80",
  },
  {
    id: "streetwear",
    name: "街头潮流",
    description: "前卫街头风格",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=300&fit=crop&q=80",
  },
  {
    id: "vintage",
    name: "复古经典",
    description: "经典复古造型",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=300&fit=crop&q=80",
  },
];

interface StyleSelectorProps {
  selectedStyle: string | null;
  onStyleSelect: (styleId: string) => void;
}

export function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {STYLES.length} 种风格可选
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={`style-card group text-left ${
              selectedStyle === style.id ? "selected" : ""
            }`}
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {selectedStyle === style.id && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
            <h3 className="font-medium text-foreground text-sm">{style.name}</h3>
            <p className="text-xs text-muted-foreground">{style.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
