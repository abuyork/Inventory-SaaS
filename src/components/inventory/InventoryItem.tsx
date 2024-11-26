import { useState } from 'react';
import { 
  PenSquare,
  Trash,
  AlertCircle
} from 'lucide-react';
import { Product } from '../../types';
import { format } from 'date-fns';
import EditInventoryModal from './EditInventoryModal';
import { Checkbox } from '../ui/Checkbox';

interface Props {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (id: string, product: Partial<Product>) => void;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function InventoryItem({ product, onDelete, onEdit, selected, onSelect }: Props) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getStatusColor = (quantity: number, reorderPoint: number) => {
    if (quantity <= reorderPoint) return 'text-red-500 bg-red-50';
    return 'text-green-500 bg-green-50';
  };

  const getStatusText = (quantity: number, reorderPoint: number) => {
    if (quantity <= reorderPoint) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusIcon = (quantity: number, reorderPoint: number) => {
    if (quantity <= reorderPoint) return <AlertCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const statusColor = getStatusColor(product.quantity, product.parLevel);
  const statusText = getStatusText(product.quantity, product.parLevel);
  const statusIcon = getStatusIcon(product.quantity, product.parLevel);

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDelete(product.id);
    setShowConfirmDelete(false);
  };

  return (
    <>
      <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-200 items-center hover:bg-gray-50">
        <div>
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelect(product.id)}
          />
        </div>
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-800">{product.name}</p>
            {statusIcon}
          </div>
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
            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
            onClick={() => setShowEditModal(true)}
            title="Edit item"
          >
            <PenSquare className="w-4 h-4 text-blue-600" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-full transition-colors"
            title="Delete item"
          >
            <Trash className="w-4 h-4 text-red-600" />
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold">Confirm Delete</h3>
            </div>
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