import { 
  Palette, Search, Scale, BookOpen, Eye, 
  Shield, Timer, Zap, Heart, HandHeart, 
  Users, UserPlus, Crown, RotateCcw, Leaf, 
  Compass, Activity, Star, Sun, CloudSun, 
  Laugh, Moon, Sparkles 
} from 'lucide-react';

export const STRENGTH_ICONS: { [key: string]: any } = {
  "Creativity": Palette,
  "Curiosity": Search,
  "Open-mindedness/judgement": Scale,
  "Love of learning": BookOpen,
  "Perspective": Eye,
  "Bravery": Shield,
  "Persistence/perseverence": Timer,
  "Zest": Zap,
  "Love": Heart,
  "Kindness": HandHeart,
  "Social Intelligence": Users,
  "Teamwork": UserPlus,
  "Fairness": Scale,
  "Leadership": Crown,
  "Forgiveness": RotateCcw,
  "Modesty/humility": Leaf,
  "Prudence": Compass,
  "Self-regulation": Activity,
  "Appreciation of beauty and excellence": Star,
  "Gratitude": Sun,
  "Hope": CloudSun,
  "Humor": Laugh,
  "Religiousness/spirituality": Moon
};

export const getStrengthIcon = (strength: string) => {
  return STRENGTH_ICONS[strength] || Sparkles;
};
