export type Role = "cliente" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: Role;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  stock: number;
  created_at?: string;
}

export interface WellnessClass {
  id: string;
  name: string;
  description: string | null;
  instructor: string | null;
  capacity: number;
  image_url: string | null;
  created_at?: string;
}

export interface ClassSchedule {
  id: string;
  class_id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_slots: number;
  created_at?: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  schedule_id: string;
  status: "confirmada" | "cancelada";
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: "pendiente" | "pagada" | "cancelada";
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}
