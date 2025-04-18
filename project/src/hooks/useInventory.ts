import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  query,
  Timestamp,
  where,
  writeBatch} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../contexts/CategoriesContext';

export function useInventory() {
  const { user } = useAuth();
  const { categories } = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Set up real-time listener with composite index
  useEffect(() => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const productsRef = collection(db, 'products');
    // Create a compound query that will update in real-time
    const q = query(
      productsRef,
      where('userId', '==', user.uid),
      where('archived', '==', showArchived)
    );

    setLoading(true);

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          lastUpdated: doc.data().lastUpdated.toDate(),
          expirationDate: doc.data().expirationDate ? doc.data().expirationDate.toDate() : undefined,
          archived: doc.data().archived ?? false
        } as Product));

        // Apply sorting if sortField is set
        const sortedData = sortField 
          ? [...productsData].sort((a, b) => {
              const aValue = a[sortField];
              const bValue = b[sortField];
              if (aValue == null && bValue == null) return 0;
              if (aValue == null) return 1;
              if (bValue == null) return -1;
              return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            })
          : productsData;

        setProducts(sortedData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, showArchived, sortField]); // Add sortField to dependencies

  const addProduct = async (product: Omit<Product, 'id' | 'lastUpdated' | 'userId' | 'archived'>) => {
    if (!user) return;
    
    try {
      const newProduct = {
        ...product,
        userId: user.uid,
        lastUpdated: Timestamp.now(),
        archived: false,
        expirationDate: product.expirationDate ? Timestamp.fromDate(new Date(product.expirationDate)) : null
      };

      await addDoc(collection(db, 'products'), newProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const deleteProduct = async (ids: string | string[]) => {
    if (!user) return;

    try {
      const idsArray = Array.isArray(ids) ? ids : [ids];
      const batch = writeBatch(db);
      
      for (const id of idsArray) {
        const productRef = doc(db, 'products', id);
        batch.delete(productRef);
      }

      await batch.commit();
      // The onSnapshot listener will automatically update the UI
    } catch (error) {
      console.error('Error deleting products:', error);
      throw error;
    }
  };

  const editProduct = async (id: string, updates: Partial<Product>) => {
    if (!user) return;

    try {
      const productRef = doc(db, 'products', id);
      const updateData = {
        ...updates,
        lastUpdated: Timestamp.now(),
        expirationDate: updates.expirationDate 
          ? Timestamp.fromDate(new Date(updates.expirationDate))
          : null
      };
      await updateDoc(productRef, updateData);
      // The onSnapshot listener will automatically update the UI
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const archiveProducts = async (ids: string[]) => {
    if (!user || ids.length === 0) return;

    try {
      const batch = writeBatch(db);
      
      for (const id of ids) {
        const productRef = doc(db, 'products', id);
        batch.update(productRef, { 
          archived: true,
          lastUpdated: Timestamp.now()
        });
      }

      await batch.commit();
      // The onSnapshot listener will automatically update the UI
    } catch (error) {
      console.error('Error archiving products:', error);
      throw error;
    }
  };

  const unarchiveProducts = async (ids: string[]) => {
    if (!user || ids.length === 0) return;

    try {
      const batch = writeBatch(db);
      
      for (const id of ids) {
        const productRef = doc(db, 'products', id);
        batch.update(productRef, { 
          archived: false,
          lastUpdated: Timestamp.now()
        });
      }

      await batch.commit();
      // The onSnapshot listener will automatically update the UI
    } catch (error) {
      console.error('Error unarchiving products:', error);
      throw error;
    }
  };

  const sortProducts = (field: keyof Product) => {
    setSortField(field);
  };

  const getFilteredProducts = () => {
    return products.filter(product => 
      filterCategory === 'all' || product.category === filterCategory
    );
  };

  const exportSelectedItems = async (selectedIds: string[]) => {
    try {
      if (!selectedIds || selectedIds.length === 0) {
        throw new Error('No items selected for export');
      }

      const exportData = selectedIds.map(id => {
        const item = products.find(product => product.id === id);
        if (!item) return null;
        
        // Get category name from categoryId
        const category = categories?.find(c => c.id === item.categoryId)?.name || 'Uncategorized';
        
        // Determine status based on quantity and reorderPoint
        const status = determineStatus(item.quantity, item.reorderPoint);
        
        // Format the data for Excel export
        return {
          'Item Name': item.name,
          'Category': category,
          'Quantity': `${item.quantity}`, 
          'Reorder Point': `${item.reorderPoint}`,
          'Status': status,
          'Last Updated': item.lastUpdated instanceof Date 
            ? item.lastUpdated.toLocaleDateString() 
            : new Date(item.lastUpdated).toLocaleDateString(),
        };
      }).filter((item): item is NonNullable<typeof item> => item !== null);

      if (exportData.length === 0) {
        throw new Error('No data available for export');
      }

      return exportData;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  };

  // Helper function to determine status
  const determineStatus = (quantity: number, reorderPoint: number): string => {
    if (quantity <= 0) {
      return 'Out of Stock';
    } else if (quantity <= reorderPoint) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  };

  return {
    products: getFilteredProducts(),
    addProduct,
    deleteProduct,
    editProduct,
    sortProducts,
    sortField,
    filterCategory,
    setFilterCategory,
    loading,
    archiveProducts,
    unarchiveProducts,
    showArchived,
    setShowArchived,
    exportSelectedItems,
  };
}
