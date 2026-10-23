import {
  Code, Smartphone, Palette, Cloud, BrainCircuit, TrendingUp, Boxes, Factory,
  UsersRound, Package, Layers, BarChart3, Circle, type LucideIcon,
} from 'lucide-react';

/** Explicit icon map (keeps the bundle small: no `import * as Icons`). */
const map: Record<string, LucideIcon> = {
  Code, Smartphone, Palette, Cloud, BrainCircuit, TrendingUp, Boxes, Factory, UsersRound, Package, Layers, BarChart3,
};

export const getIcon = (name: string): LucideIcon => map[name] ?? Circle;
