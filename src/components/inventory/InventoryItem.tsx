import { useState } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { format } from 'date-fns';
import EditInventoryModal from './EditInventoryModal';

interface Props {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (id: string, product: Partial<Product>) => void;
}

export default function InventoryItem({ product, onDelete, onEdit }: Props) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getStatusColor = (quantity: number, reorderPoint: number, parLevel: number) => {
    if (quantity <= reorderPoint) return 'text-red-500 bg-red-50';
    if (quantity < parLevel) return 'text-yellow-500 bg-yellow-50';
    return 'text-green-500 bg-green-50';
  };

  const getStatusText = (quantity: number, reorderPoint: number, parLevel: number) => {
    if (quantity <= reorderPoint) return 'Low Stock';
    if (quantity < parLevel) return 'Below Par';
    return 'In Stock';
  };

  const statusColor = getStatusColor(product.quantity, product.reorderPoint, product.parLevel);
  const statusText = getStatusText(product.quantity, product.reorderPoint, product.parLevel);

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDelete(product.id);
    setShowConfirmDelete(false);
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 items-center hover:bg-gray-50">
        <div className="col-span-2">
          <p className="font-medium text-gray-800">{product.name}</p>
          <p className="text-sm text-gray-500">
            Updated {format(product.lastUpdated, 'MMM d, yyyy')}
          </p>
        </div>
        <div className="text-gray-600">{product.category}</div>
        <div className="text-gray-600">
          {product.quantity} {product.unit}
        </div>
        <div className="text-gray-600">
          {product.parLevel} {product.unit}
        </div>
        <div>
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {statusText}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => setShowEditModal(true)}
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Trash2 className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditInventoryModal
          product={product}
          onClose={() => setShowEditModal(false)}
          onEdit={onEdit}
        />
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {product.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}