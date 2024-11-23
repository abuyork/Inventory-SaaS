import { useState } from 'react';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Product } from '../../types';
import { useInventory } from '../../hooks/useInventory';
import InventoryItem from './InventoryItem';
import AddInventoryModal from './AddInventoryModal';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Tomatoes',
    category: 'Produce',
    quantity: 45.5,
    unit: 'kg',
    parLevel: 50,
    reorderPoint: 20,
    lastUpdated: new Date(),
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 25,
    unit: 'kg',
    parLevel: 30,
    reorderPoint: 15,
    lastUpdated: new Date(),
    expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  }
];

export default function InventoryList() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const {
    products,
    addProduct,
    deleteProduct,
    editProduct,
    sortProducts,
    sortField,
    filterCategory,
    setFilterCategory
  } = useInventory(initialProducts);

  const categories = ['all', 'Produce', 'Meat', 'Dairy', 'Dry Goods'];

  const processedProducts = products.map(product => ({
    ...product,
    lastUpdated: new Date(product.lastUpdated),
    expirationDate: product.expirationDate ? new Date(product.expirationDate) : undefined
  }));

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
        <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium">
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
        {processedProducts.map(product => (
          <InventoryItem 
            key={product.id} 
            product={product}
            onDelete={deleteProduct}
            onEdit={editProduct}
          />
        ))}
      </div>

      {showAddModal && (
        <AddInventoryModal 
          onClose={() => setShowAddModal(false)}
          onAdd={addProduct}
        />
      )}
    </div>
  );
}