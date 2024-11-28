import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  lastUpdated: Date;
  userId: string;
  unit: string;
  archived?: boolean;
  categoryId: string;
  expirationDate?: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  isDefault?: boolean;
  isActive?: boolean;
  productCount?: number;
}

export interface CategoryFormData {
  name: string;
  color: string;
  description?: string;
}

export interface CategoryUpdateData {
  name?: string;
  color?: string;
  isActive?: boolean;
  description?: string;
  sortOrder?: number;
}

export interface CategoryColor {
  id: string;
  value: string;
  label: string;
}

export const CATEGORY_CONSTANTS = {
  MAX_CATEGORIES_PER_USER: 50,
  MAX_NAME_LENGTH: 30,
  MIN_NAME_LENGTH: 2,
  DEFAULT_COLORS: [
    { id: '1', value: '#EF4444', label: 'Red' },
    { id: '2', value: '#F59E0B', label: 'Orange' },
    { id: '3', value: '#10B981', label: 'Green' },
    { id: '4', value: '#3B82F6', label: 'Blue' },
    { id: '5', value: '#6366F1', label: 'Indigo' },
    { id: '6', value: '#8B5CF6', label: 'Purple' },
    { id: '7', value: '#EC4899', label: 'Pink' },
    { id: '8', value: '#6B7280', label: 'Gray' },
  ] as CategoryColor[],
} as const;