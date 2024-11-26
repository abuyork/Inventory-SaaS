import { useState } from 'react';
import { Plus, Filter, ArrowUpDown, Archive, ArchiveRestore, Settings } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import InventoryItem from './InventoryItem';
import AddInventoryModal from './AddInventoryModal';
import BulkActionsBar from './BulkActionsBar';
import { Product } from '../../types';
import { format } from 'date-fns';
import { Checkbox } from '../ui/Checkbox';
import toast from 'react-hot-toast';
import CategoryManagementModal from './CategoryManagementModal';
import { useCategories } from '../../contexts/CategoriesContext';

export default function InventoryList() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [archiveOperationLoading, setArchiveOperationLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const {
    products,
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
    setShowArchived
  } = useInventory();
  const { categories } = useCategories();

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === products.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(products.map(p => p.id)));
    }
  };

  const handleBulkDelete = () => {
    selectedItems.forEach(id => deleteProduct(id));
    setSelectedItems(new Set());
  };

  const handleBulkArchive = async () => {
    try {
      setError(null);
      setArchiveOperationLoading(true);
      await archiveProducts(Array.from(selectedItems));
      
      toast.success(`${selectedItems.size} items archived successfully`);
      setSelectedItems(new Set());
    } catch (error) {
      setError('Failed to archive items. Please try again.');
      console.error('Archive error:', error);
      toast.error("Failed to archive items. Please try again.");
    } finally {
      setArchiveOperationLoading(false);
    }
  };

  const handleBulkUnarchive = async () => {
    try {
      setError(null);
      setArchiveOperationLoading(true);
      await unarchiveProducts(Array.from(selectedItems));
      
      toast.success(`${selectedItems.size} items restored successfully`);
      setSelectedItems(new Set());
    } catch (error) {
      setError('Failed to restore items. Please try again.');
      console.error('Unarchive error:', error);
      toast.error("Failed to restore items. Please try again.");
    } finally {
      setArchiveOperationLoading(false);
    }
  };

  const handleExport = () => {
    const selectedProducts = products.filter(p => selectedItems.has(p.id));
    const csv = convertToCSV(selectedProducts);
    downloadCSV(csv, 'inventory-export.csv');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <Settings className="w-4 h-4" />
            Manage Categories
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.label}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                View Archived Items
              </label>
              <button
                onClick={() => {
                  setSelectedItems(new Set());
                  setShowArchived(!showArchived);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  showArchived 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {showArchived ? (
                  <>
                    <ArchiveRestore className="w-4 h-4" />
                    Viewing Archived
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    View Archived
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-200 bg-gray-50/80 font-medium text-gray-600 text-sm">
          {products.length > 0 && (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={selectedItems.size === products.length}
                onCheckedChange={handleSelectAll}
              />
            </div>
          )}
          <div 
            className={`${products.length > 0 ? 'col-span-2' : 'col-span-3'} cursor-pointer flex items-center gap-2 hover:text-blue-600`}
            onClick={() => sortProducts('name')}
          >
            Item
            {sortField === 'name' && (
              <ArrowUpDown className="w-4 h-4" />
            )}
          </div>
          <div 
            className="cursor-pointer flex items-center gap-2 hover:text-blue-600"
            onClick={() => sortProducts('category')}
          >
            Category
            {sortField === 'category' && (
              <ArrowUpDown className="w-4 h-4" />
            )}
          </div>
          <div 
            className="cursor-pointer flex items-center gap-2 hover:text-blue-600"
            onClick={() => sortProducts('quantity')}
          >
            Quantity
            {sortField === 'quantity' && (
              <ArrowUpDown className="w-4 h-4" />
            )}
          </div>
          <div className="text-gray-600">Reorder Point</div>
          <div className="text-gray-600">Status</div>
          <div className="text-gray-600">Actions</div>
        </div>
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading inventory...
          </div>
        ) : products.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No items in inventory
          </div>
        ) : (
          products.map(product => (
            <InventoryItem 
              key={product.id} 
              product={product}
              onDelete={deleteProduct}
              onEdit={editProduct}
              selected={selectedItems.has(product.id)}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>

      <BulkActionsBar
        selectedCount={selectedItems.size}
        onDelete={handleBulkDelete}
        onExport={handleExport}
        onArchive={showArchived ? handleBulkUnarchive : handleBulkArchive}
        isArchiving={archiveOperationLoading}
        isArchived={showArchived}
      />

      {showAddModal && (
        <AddInventoryModal 
          onClose={() => setShowAddModal(false)}
          onAdd={addProduct}
        />
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {showCategoryModal && (
        <CategoryManagementModal onClose={() => setShowCategoryModal(false)} />
      )}
    </div>
  );
}

function convertToCSV(products: Product[]): string {
  const headers = ['Name', 'Category', 'Quantity', 'Unit', 'Reorder Point', 'Last Updated'];
  const rows = products.map(p => [
    p.name,
    p.category,
    p.quantity,
    p.unit,
    p.reorderPoint,
    format(p.lastUpdated, 'yyyy-MM-dd')
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}