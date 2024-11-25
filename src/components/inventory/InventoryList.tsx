import { useState } from 'react';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import InventoryItem from './InventoryItem';
import AddInventoryModal from './AddInventoryModal';
import BulkActionsBar from './BulkActionsBar';
import { Product } from '../../types';
import { format } from 'date-fns';
import { Checkbox } from '../ui/Checkbox';

export default function InventoryList() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const {
    products,
    addProduct,
    deleteProduct,
    editProduct,
    sortProducts,
    sortField,
    filterCategory,
    setFilterCategory,
    loading
  } = useInventory();

  const categories = ['all', 'Produce', 'Meat', 'Dairy', 'Dry Goods'];

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

  const handleExport = () => {
    const selectedProducts = products.filter(p => selectedItems.has(p.id));
    const csv = convertToCSV(selectedProducts);
    downloadCSV(csv, 'inventory-export.csv');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={() => sortProducts('name')}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium">
          <div>
            <Checkbox
              checked={selectedItems.size === products.length}
              onCheckedChange={handleSelectAll}
            />
          </div>
          <div 
            className="col-span-2 cursor-pointer flex items-center gap-2"
            onClick={() => sortProducts('name')}
          >
            Item
            {sortField === 'name' && (
              <ArrowUpDown className="w-4 h-4" />
            )}
          </div>
          <div 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => sortProducts('category')}
          >
            Category
            {sortField === 'category' && (
              <ArrowUpDown className="w-4 h-4" />
            )}
          </div>
          <div 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => sortProducts('quantity')}
          >
            Quantity
            {sortField === 'quantity' && (
              <ArrowUpDown className="w-4 h-4" />
            )}
          </div>
          <div>Par Level</div>
          <div>Status</div>
          <div>Actions</div>
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
        onArchive={() => {/* Implement archive logic */}}
      />

      {showAddModal && (
        <AddInventoryModal 
          onClose={() => setShowAddModal(false)}
          onAdd={addProduct}
        />
      )}
    </div>
  );
}

function convertToCSV(products: Product[]): string {
  const headers = ['Name', 'Category', 'Quantity', 'Unit', 'Par Level', 'Reorder Point', 'Last Updated'];
  const rows = products.map(p => [
    p.name,
    p.category,
    p.quantity,
    p.unit,
    p.parLevel,
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