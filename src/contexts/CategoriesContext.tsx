import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';

export interface Category {
  id: string;
  label: string;
  color: string;
  isDefault?: boolean;
}

// Default categories that will always be present
export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { label: 'Produce', color: '#22c55e' },
  { label: 'Meat', color: '#ef4444' },
  { label: 'Dairy', color: '#3b82f6' },
  { label: 'Dry Goods', color: '#f59e0b' }
];

interface CategoriesContextType {
  categories: Category[];
  addCategory: (label: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateCategory: (id: string, label: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize default categories if they don't exist
  useEffect(() => {
    const initializeDefaultCategories = async () => {
      try {
        const categoriesRef = collection(db, 'categories');
        const defaultCategoriesQuery = query(categoriesRef, where('isDefault', '==', true));
        const snapshot = await getDocs(defaultCategoriesQuery);
        
        // Get existing default categories
        const existingDefaults = new Set(
          snapshot.docs.map(doc => doc.data().label.toLowerCase())
        );
        
        // Only add default categories that don't already exist
        const categoriesToAdd = DEFAULT_CATEGORIES.filter(
          category => !existingDefaults.has(category.label.toLowerCase())
        );
        
        if (categoriesToAdd.length > 0) {
          await Promise.all(
            categoriesToAdd.map(category => 
              addDoc(categoriesRef, category)
            )
          );
        }
      } catch (error) {
        console.error('Error initializing default categories:', error);
        setError('Failed to initialize default categories');
      }
    };

    initializeDefaultCategories();
  }, []);

  // Listen for category changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        // Use a Map to ensure unique categories by label
        const categoryMap = new Map();
        
        snapshot.docs.forEach(doc => {
          const category = {
            id: doc.id,
            ...doc.data()
          } as Category;
          
          // Only keep the first occurrence of each category label
          if (!categoryMap.has(category.label.toLowerCase())) {
            categoryMap.set(category.label.toLowerCase(), category);
          }
        });
        
        // Convert Map back to array and sort
        const categoriesData = Array.from(categoryMap.values());
        const sortedCategories = categoriesData.sort((a, b) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return a.label.localeCompare(b.label);
        });
        
        setCategories(sortedCategories);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addCategory = async (label: string) => {
    try {
      // Check if category with same label already exists
      if (categories.some(cat => cat.label.toLowerCase() === label.toLowerCase())) {
        throw new Error('Category with this name already exists');
      }

      const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      await addDoc(collection(db, 'categories'), {
        label,
        color,
        isDefault: false
      });
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, label: string) => {
    try {
      if (categories.some(cat => 
        cat.id !== id && 
        cat.label.toLowerCase() === label.toLowerCase()
      )) {
        throw new Error('Category with this name already exists');
      }

      await updateDoc(doc(db, 'categories', id), { label });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  return (
    <CategoriesContext.Provider value={{
      categories,
      addCategory,
      deleteCategory,
      updateCategory,
      loading,
      error
    }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
} 