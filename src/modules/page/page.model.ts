export interface Page {
  id: number;
  external_id: string;
  title: string;
  description?: string;
  image_url?: string;
  banner_url?: string;
  background_color?: string;
  allowed_link_quantity: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
