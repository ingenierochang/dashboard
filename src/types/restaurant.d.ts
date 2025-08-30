export type BannerImageBackend = {
  id: number;
  image: string;
};

export interface Restaurant {
  id?: number;
  owner: number;
  name: string;
  slug: string;
  logo_image?: string;
  banner_images?: BannerImageBackend[];
  slogan?: string;
  description?: string;
  address?: string;
  address_url?: string;
  whatsapp?: number;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  open_hours?: string;
  payment_methods?: string;
  parking?: string;
  alcohol_patents?: string;
  website?: string;
  custom_css_text?: string;
  custom_css_json?: string;
}
