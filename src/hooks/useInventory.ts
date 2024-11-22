import { useState } from 'react';
import { Product } from '../types';

export function useInventory(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const addProduct = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date(),
      quantity: Number(product.quantity),
      parLevel: Number(product.parLevel),
      reorderPoint: Number(product.reorderPoint)
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const editProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { 
            ...product, 
            ...updatedProduct,
            lastUpdated: new Date() 
          }
        : product
    ));
  };

  const sortProducts = (field: keyof Product) => {
    setSortField(field);
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedProducts = products
    .filter(product => filterCategory === 'all' || product.category === filterCategory)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Compare values based on sort direction
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    });

  return {
    products: filteredAndSortedProducts,
    addProduct,
    deleteProduct,
    editProduct,
    sortProducts,
    sortField,
    sortDirection,
    filterCategory,
    setFilterCategory
  };
}
