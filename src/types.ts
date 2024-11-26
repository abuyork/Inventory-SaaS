export interface Product {
  id: string;
  userId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  lastUpdated: Date;
  expirationDate?: Date;
  archived: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}