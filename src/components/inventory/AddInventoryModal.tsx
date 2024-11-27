import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';
import { modalStyles as styles } from '../../styles/modal';
import { useCategories } from '../../contexts/CategoriesContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
}

export default function AddInventoryModal({ onClose, onAdd }: Props) {
  const { categories: allCategories } = useCategories();
  const { user } = useAuth();

  const categories = allCategories.filter(category => category.isActive !== false);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    quantity: '',
    unit: 'kg',
    reorderPoint: '',
    expirationDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to add items');
      return;
    }

    try {
      if (!formData.categoryId) {
        toast.error('Please select a category');
        return;
      }

      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      if (!selectedCategory) {
        toast.error('Please select a valid category');
        return;
      }

      await onAdd({
        ...formData,
        quantity: Number(formData.quantity),
        reorderPoint: Number(formData.reorderPoint),
        expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
        userId: user.uid,
        archived: false
      });

      toast.success('Item added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add item');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Add New Item</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Item Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.input}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={styles.label}>Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={styles.select}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className={styles.select}
              >
                <option>kg</option>
                <option>l</option>
                <option>pcs</option>
                <option>boxes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={styles.label}>Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className={styles.input}
                required
                min="0"
                step="0.1"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className={styles.label}>Reorder Point</label>
              <input
                type="number"
                value={formData.reorderPoint}
                onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
                className={styles.input}
                required
                min="0"
                step="0.1"
                placeholder="0.0"
              />
            </div>
          </div>

          <div>
            <label className={styles.label}>Expiration Date</label>
            <input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-150"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}