import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  runTransaction,
  serverTimestamp,
  addDoc,
  updateDoc,
  getDocs,
  Timestamp,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Category, CategoryFormData, CategoryUpdateData, CATEGORY_CONSTANTS } from '../types';
import toast from 'react-hot-toast';

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  addCategory: (data: CategoryFormData) => Promise<string>;
  updateCategory: (id: string, data: Partial<CategoryUpdateData>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  reorderCategories: (orderedIds: string[]) => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

const logError = (error: unknown, context: string) => {
  console.error(`[CategoriesContext] ${context}:`, {
    error,
    timestamp: new Date().toISOString(),
    user: user?.uid
  });
};

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Subscribe to categories
  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const categoriesQuery = query(
      collection(db, 'categories'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        console.log('[CategoriesContext] Received categories snapshot:', {
          count: snapshot.size,
          docs: snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        });
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Category[];
        setCategories(categoriesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        logError(err, 'Error fetching categories');
        setError(err as Error);
        setLoading(false);
        toast.error('Failed to load categories');
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add new category
  const addCategory = useCallback(async (data: CategoryFormData): Promise<string> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      // Check category count
      const categoriesQuery = query(
        collection(db, 'categories'),
        where('userId', '==', user.uid),
        where('isActive', '==', true)
      );
      const categoriesSnapshot = await getDocs(categoriesQuery);
      
      if (categoriesSnapshot.size >= CATEGORY_CONSTANTS.MAX_CATEGORIES_PER_USER) {
        throw new Error(`Maximum number of categories (${CATEGORY_CONSTANTS.MAX_CATEGORIES_PER_USER}) reached`);
      }

      // Create new category
      const newCategory = {
        ...data,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        productCount: 0,
        sortOrder: categoriesSnapshot.size,
        isDefault: false
      };

      const docRef = await addDoc(collection(db, 'categories'), newCategory);
      toast.success('Category added successfully');
      return docRef.id;

    } catch (err) {
      console.error('Error adding category:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to add category');
      throw err;
    }
  }, [user]);

  // Update category
  const updateCategory = useCallback(async (id: string, data: Partial<CategoryUpdateData>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      toast.success('Category updated successfully');
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error('Failed to update category');
      throw err;
    }
  }, [user]);

  // Delete category (soft delete)
  const deleteCategory = useCallback(async (id: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const categoryRef = doc(db, 'categories', id);
      
      // First check if category exists and get its data
      const categoryDoc = await getDoc(categoryRef);
      if (!categoryDoc.exists()) {
        throw new Error('Category not found');
      }

      const categoryData = categoryDoc.data() as Category;
      if (categoryData.isDefault) {
        throw new Error('Cannot delete default category');
      }

      // Check for associated products
      const productsQuery = query(
        collection(db, 'products'),
        where('categoryId', '==', id),
        where('userId', '==', user.uid)
      );
      const productsSnapshot = await getDocs(productsQuery);

      if (!productsSnapshot.empty) {
        throw new Error('Cannot delete category with associated products');
      }

      // Actually delete the document instead of soft delete
      await deleteDoc(categoryRef);

      toast.success('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  }, [user]);

  // Get category by ID
  const getCategoryById = useCallback((id: string) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  // Reorder categories
  const reorderCategories = useCallback(async (orderedIds: string[]) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      await runTransaction(db, async (transaction) => {
        orderedIds.forEach((id, index) => {
          const categoryRef = doc(db, 'categories', id);
          transaction.update(categoryRef, {
            sortOrder: index,
            updatedAt: serverTimestamp()
          });
        });
      });

      toast.success('Categories reordered successfully');
    } catch (err) {
      console.error('Error reordering categories:', err);
      toast.error('Failed to reorder categories');
      throw err;
    }
  }, [user]);

  const value = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    reorderCategories
  };

  return (
    <CategoriesContext.Provider value={value}>
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