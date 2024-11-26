import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';

interface Props {
  product: Product;
  onClose: () => void;
  onEdit: (id: string, product: Partial<Product>) => void;
}

export default function EditInventoryModal({ product, onClose, onEdit }: Props) {
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    quantity: product.quantity.toString(),
    unit: product.unit,
    parLevel: product.parLevel.toString(),
    reorderPoint: product.reorderPoint.toString(),
    expirationDate: product.expirationDate ? product.expirationDate.toISOString().split('T')[0] : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(product.id, {
      ...formData,
      quantity: Number(formData.quantity),
      parLevel: Number(formData.parLevel),
      reorderPoint: Number(formData.reorderPoint),
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Edit Item</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-primary w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-primary w-full"
              >
                <option>Produce</option>
                <option>Meat</option>
                <option>Dairy</option>
                <option>Dry Goods</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="input-primary w-full"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="input-primary w-full"
                required
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reorder Point
              </label>
              <input
                type="number"
                value={formData.parLevel}
                onChange={(e) => setFormData({ ...formData, parLevel: e.target.value })}
                className="input-primary w-full"
                required
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                className="input-primary w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 