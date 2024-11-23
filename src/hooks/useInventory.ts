import { useState, useEffect } from 'react';
import { Product } from '../types';

export function useInventory(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('inventoryProducts');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });
  
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    localStorage.setItem('inventoryProducts', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      lastUpdated: new Date()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, lastUpdated: new Date() }
        : product
    ));
  };

  const sortProducts = (field: keyof Product) => {
    setSortField(field);
    setProducts(prev => [...prev].sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    }));
  };

  return {
    products: filterCategory === 'all' 
      ? products 
      : products.filter(p => p.category === filterCategory),
    addProduct,
    deleteProduct,
    editProduct,
    sortProducts,
    sortField,
    filterCategory,
    setFilterCategory
  };
}
