import React, { useState } from 'react';
import { X, Plus, Trash2, Edit, AlertCircle, GripVertical } from 'lucide-react';
import { useCategories } from '../../contexts/CategoriesContext';
import { Category, CategoryFormData, CATEGORY_CONSTANTS } from '../../types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
}

interface ValidationErrors {
  name?: string;
  color?: string;
  general?: string;
}

export default function CategoryManagementModal({ onClose }: Props) {
  const { 
    categories, 
    addCategory, 
    deleteCategory, 
    updateCategory, 
    reorderCategories,
    loading 
  } = useCategories();

  const [newCategory, setNewCategory] = useState<CategoryFormData>({
    name: '',
    color: CATEGORY_CONSTANTS.DEFAULT_COLORS[0].value
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_CONSTANTS.DEFAULT_COLORS[0]);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validation functions
  const validateCategory = (data: CategoryFormData): boolean => {
    const errors: ValidationErrors = {};

    if (!data.name.trim()) {
      errors.name = 'Category name is required';
    } else if (data.name.length < CATEGORY_CONSTANTS.MIN_NAME_LENGTH) {
      errors.name = `Name must be at least ${CATEGORY_CONSTANTS.MIN_NAME_LENGTH} characters`;
    } else if (data.name.length > CATEGORY_CONSTANTS.MAX_NAME_LENGTH) {
      errors.name = `Name must be less than ${CATEGORY_CONSTANTS.MAX_NAME_LENGTH} characters`;
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(data.name)) {
      errors.name = 'Name can only contain letters, numbers, spaces, and hyphens';
    }

    if (!data.color) {
      errors.color = 'Color is required';
    } else if (!/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
      errors.color = 'Invalid color format';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle category addition
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCategory(newCategory) || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addCategory(newCategory);
      setNewCategory({ name: '', color: selectedColor.value });
      setValidationErrors({});
    } catch (error) {
      if (error instanceof Error) {
        setValidationErrors({ general: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category update
  const handleUpdateCategory = async (category: Category, newData: Partial<CategoryFormData>) => {
    if (isSubmitting) return;

    const updatedData = { ...category, ...newData };
    if (!validateCategory(updatedData)) return;

    try {
      setIsSubmitting(true);
      await updateCategory(category.id, newData);
      setEditingCategory(null);
      setValidationErrors({});
    } catch (error) {
      if (error instanceof Error) {
        setValidationErrors({ general: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (category: Category) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await deleteCategory(category.id);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(filteredCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      await reorderCategories(items.map(item => item.id));
    } catch (error) {
      toast.error('Failed to reorder categories');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manage Categories</h3>
            <p className="text-sm text-gray-500 mt-1">
              {categories.length} / {CATEGORY_CONSTANTS.MAX_CATEGORIES_PER_USER} categories
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORY_CONSTANTS.DEFAULT_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        setNewCategory({ ...newCategory, color: color.value });
                      }}
                      className={`p-2 rounded-lg border transition-all ${
                        selectedColor.id === color.id
                          ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {color.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || categories.length >= CATEGORY_CONSTANTS.MAX_CATEGORIES_PER_USER}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150
                  ${!isSubmitting && categories.length < CATEGORY_CONSTANTS.MAX_CATEGORIES_PER_USER
                    ? 'text-white bg-blue-600 hover:bg-blue-700' 
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </form>

          {/* Search Categories */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Categories List */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading categories...
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                        <AlertCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No categories found</p>
                    </div>
                  ) : (
                    filteredCategories.map((category, index) => (
                      <Draggable 
                        key={category.id} 
                        draggableId={category.id} 
                        index={index}
                        isDragDisabled={!!editingCategory}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-150"
                          >
                            {editingCategory?.id === category.id ? (
                              <form 
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleUpdateCategory(category, {
                                    name: editingCategory.name,
                                    color: editingCategory.color
                                  });
                                }} 
                                className="flex-1 flex items-center gap-3"
                              >
                                <input
                                  type="text"
                                  value={editingCategory.name}
                                  onChange={(e) => setEditingCategory({
                                    ...editingCategory,
                                    name: e.target.value
                                  })}
                                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  autoFocus
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-150"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <div 
                                    className="w-4 h-4 rounded-full shadow-sm" 
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <span className="text-sm font-medium text-gray-900">
                                    {category.name}
                                  </span>
                                  {category.isDefault && (
                                    <span className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                                      Default
                                    </span>
                                  )}
                                  {category.productCount !== undefined && category.productCount > 0 && (
                                    <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                                      {category.productCount} items
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setEditingCategory(category)}
                                    disabled={isSubmitting || category.isDefault}
                                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                    title="Edit category"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(category)}
                                    disabled={isSubmitting || category.isDefault}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                    title="Delete category"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
} 