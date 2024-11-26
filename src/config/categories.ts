import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'produce',
    label: 'Produce',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200'
  },
  {
    id: 'meat',
    label: 'Meat',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  {
    id: 'dairy',
    label: 'Dairy',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  {
    id: 'dry-goods',
    label: 'Dry Goods',
    color: 'amber',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200'
  }
];

export const getCategoryStyles = (categoryLabel: string) => {
  const category = categories.find(c => c.label === categoryLabel);
  return category || categories[0]; // Default to first category if not found
}; 