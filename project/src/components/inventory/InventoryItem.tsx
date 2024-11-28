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
import { useCategories } from '../../contexts/CategoriesContext';

interface Props {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (id: string, product: Partial<Product>) => void;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function InventoryItem({ product, onDelete, onEdit, selected, onSelect }: Props) {
  const { categories } = useCategories();
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

  const statusColor = getStatusColor(product.quantity, product.reorderPoint);
  const statusText = getStatusText(product.quantity, product.reorderPoint);
  const statusIcon = getStatusIcon(product.quantity, product.reorderPoint);

  const getCategoryDetails = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category?.name || 'Unknown',
      color: category?.color || '#94a3b8'
    };
  };

  const { name: categoryName, color: categoryColor } = getCategoryDetails(product.categoryId);

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDelete(product.id);
    setShowConfirmDelete(false);
  };

  return (
    <>
      <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-100 items-center hover:bg-gray-50/50 transition-colors duration-150">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelect(product.id)}
          />
        </div>
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer">
              {product.name}
            </p>
            {statusIcon}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Updated {format(product.lastUpdated, 'MMM d, yyyy')}
          </p>
        </div>
        <div className="text-gray-600 text-sm">
          <span 
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${categoryColor}15`,
              color: categoryColor
            }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            {categoryName}
          </span>
        </div>
        <div className="text-gray-600 text-sm font-medium">
          {product.quantity} {product.unit}
        </div>
        <div className="text-gray-600 text-sm font-medium">
          {product.reorderPoint} {product.unit}
        </div>
        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {statusText}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 hover:bg-blue-50 rounded-full transition-colors duration-150"
            onClick={() => setShowEditModal(true)}
            title="Edit item"
          >
            <PenSquare className="w-4 h-4 text-blue-600" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-50 rounded-full transition-colors duration-150"
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