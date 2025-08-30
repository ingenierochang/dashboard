import { Category } from "./category";

export type Product = {
  restaurant_id: number;
  created_at: string;
  id: number;

  // image: string | null; // deprecated for the ones below
  thumbnail_image: string | null;
  detail_image: string | null;

  name: string;
  price?: number;
  discounted_price?: number | null;
  category: Category;
  category_name: string; // serializer only
  active: boolean;

  description?: string;
};
