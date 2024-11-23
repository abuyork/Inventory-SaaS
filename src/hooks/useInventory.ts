import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  where} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useInventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Set up real-time listener
  useEffect(() => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // Create query with user filter
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('userId', '==', user.uid),
      orderBy('lastUpdated', 'desc')  // Changed to sort by lastUpdated
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            lastUpdated: data.lastUpdated.toDate(),
            expirationDate: data.expirationDate ? data.expirationDate.toDate() : undefined
          } as Product;
        });
        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addProduct = async (product: Omit<Product, 'id' | 'lastUpdated' | 'userId'>) => {
    if (!user) return;
    
    try {
      const newProduct = {
        ...product,
        userId: user.uid,
        lastUpdated: Timestamp.now(),
        expirationDate: product.expirationDate ? Timestamp.fromDate(new Date(product.expirationDate)) : null
      };

      // Just add to Firestore and let the real-time listener handle the state update
      await addDoc(collection(db, 'products'), newProduct);
      
    } catch (error) {
      console.error('Error adding product:', error);
      // You might want to show an error message to the user here
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const editProduct = async (id: string, updates: Partial<Product>) => {
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
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const sortProducts = (field: keyof Product) => {
    setSortField(field);
    const sorted = [...products].sort((a, b) => {
      // Ensure both objects have the field
      if (!(field in a) || !(field in b)) {
        console.warn(`Sorting field "${field}" not found in one or both products`);
        return 0;
      }

      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });
    setProducts(sorted);
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
    setFilterCategory,
    loading
  };
}
