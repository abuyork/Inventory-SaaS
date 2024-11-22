export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  parLevel: number;
  reorderPoint: number;
  lastUpdated: Date;
  expirationDate?: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}