// Tipos de la base de datos (basado en tu page.tsx)
// Es mejor si estos tipos vienen de la generación de tipos de Supabase,
// pero los definimos aquí para claridad.

export type GeneralText = {
  id: string;
  key: string;
  text_es: string;
  text_en: string;
};

export type Hero = {
  id: string; // Asumimos que tiene un id, aunque solo haya una fila
  greeting_es: string;
  greeting_en: string;
  title: string;
  subtitle_es: string;
  subtitle_en: string;
  cv_url: string;
};

export type Project = {
  id: string;
  order: number;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  image_url: string;
  gallery_urls: string[];
  tech: string[];
  live_url?: string;
  github_url?: string;
};

export type Experience = {
  id: string;
  order: number;
  position_es: string;
  position_en: string;
  company: string;
  period_es: string;
  period_en: string;
  description_items_es: string[];
  description_items_en: string[];
  technologies: string[];
};

export type Technology = {
  id: string;
  order: number;
  name: string;
  logo_url: string;
  category: "dominant" | "knowledge";
};

export type SocialLink = {
  id: string;
  name: string;
  url: string;
  display_text_es: string;
  display_text_en: string;
  icon_key: string;
};

// Tipo para las secciones del panel de admin
export type Section =
  | "general_text"
  | "hero"
  | "projects"
  | "experience"
  | "technologies"
  | "social_links";