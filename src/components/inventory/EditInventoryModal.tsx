import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';
import { modalStyles as styles } from '../../styles/modal';
import { useCategories } from '../../contexts/CategoriesContext';

interface Props {
  product: Product;
  onClose: () => void;
  onEdit: (id: string, product: Partial<Product>) => void;
}

export default function EditInventoryModal({ product, onClose, onEdit }: Props) {
  const { categories } = useCategories();

  const [formData, setFormData] = useState({
    name: product.name,
    categoryId: product.categoryId,
    quantity: product.quantity.toString(),
    unit: product.unit,
    reorderPoint: product.reorderPoint.toString(),
    expirationDate: product.expirationDate ? product.expirationDate.toISOString().split('T')[0] : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(product.id, {
      ...formData,
      quantity: Number(formData.quantity),
      reorderPoint: Number(formData.reorderPoint),
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Edit Item</h3>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 