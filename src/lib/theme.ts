import {
  BookOpen, Calculator, Laptop, Languages, GraduationCap,
  PenLine, Globe, ShieldCheck, FileText, Brain, ClipboardList,
  Trophy, BarChart3, type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Calculator,
  Laptop,
  Languages,
  GraduationCap,
  PenLine,
  Globe,
  ShieldCheck,
  FileText,
  Brain,
  ClipboardList,
  Trophy,
  BarChart3,
};

export function getModuleIcon(name: string): LucideIcon {
  return iconMap[name] ?? BookOpen;
}

export const colorClasses: Record<string, { bg: string; text: string; ring: string; soft: string; gradient: string }> = {
  rose: { bg: 'bg-rose-500', text: 'text-rose-600', ring: 'ring-rose-200', soft: 'bg-rose-50', gradient: 'from-rose-500 to-pink-500' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', ring: 'ring-blue-200', soft: 'bg-blue-50', gradient: 'from-blue-500 to-cyan-500' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-200', soft: 'bg-emerald-50', gradient: 'from-emerald-500 to-teal-500' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-200', soft: 'bg-amber-50', gradient: 'from-amber-500 to-orange-500' },
};

export function getColor(name: string) {
  return colorClasses[name] ?? colorClasses.blue;
}
