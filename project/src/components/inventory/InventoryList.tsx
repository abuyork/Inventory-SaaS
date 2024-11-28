import { useState, useMemo } from 'react';
import { Plus, Filter, ArrowUpDown, Archive, ArchiveRestore, Settings } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import InventoryItem from './InventoryItem';
import AddInventoryModal from './AddInventoryModal';
import BulkActionsBar from './BulkActionsBar';
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
    loading: productsLoading,
    archiveProducts,
    unarchiveProducts,
    showArchived,
    setShowArchived,
    exportSelectedItems
  } = useInventory();

  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === 'all') return products;
    return products.filter(product => product.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

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
    if (selectedItems.size === filteredProducts.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredProducts.map(p => p.id)));
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
      toast.error("Failed to archive items");
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
      toast.error("Failed to restore items");
    } finally {
      setArchiveOperationLoading(false);
    }
  };

  const handleExport = async () => {
    return await exportSelectedItems(Array.from(selectedItems));
  };

  const loading = productsLoading || categoriesLoading;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            aria-expanded={showFilters}
            aria-controls="filters-panel"
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
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
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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

      <div 
        role="grid"
        aria-label="Inventory items"
        className="bg-white rounded-lg shadow"
      >
        <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-200 bg-gray-50/80 font-medium text-gray-600 text-sm">
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={selectedItems.size === filteredProducts.length}
                onCheckedChange={handleSelectAll}
              />
            </div>
          )}
          <div 
            className={`${filteredProducts.length > 0 ? 'col-span-2' : 'col-span-3'} cursor-pointer flex items-center gap-2 hover:text-blue-600`}
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
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <Archive className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No items found</h3>
            <p className="text-sm text-gray-500">
              {showArchived 
                ? "No archived items found" 
                : selectedCategoryId !== 'all'
                  ? "No items in this category"
                  : "Get started by adding your first inventory item"}
            </p>
          </div>
        ) : (
          filteredProducts.map(product => (
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

      {showCategoryModal && (
        <CategoryManagementModal 
          onClose={() => setShowCategoryModal(false)} 
        />
      )}

      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}


