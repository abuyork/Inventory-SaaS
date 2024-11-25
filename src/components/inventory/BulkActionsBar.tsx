import { useState } from 'react';
import { Trash2, Archive, Download } from 'lucide-react';

interface Props {
  selectedCount: number;
  onDelete: () => void;
  onExport: () => void;
  onArchive: () => void;
}

export default function BulkActionsBar({ selectedCount, onDelete, onExport, onArchive }: Props) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (selectedCount === 0) return null;

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowConfirmDelete(false);
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 flex items-center gap-4 z-50">
        <span className="text-sm font-medium text-gray-600">
          {selectedCount} items selected
        </span>
        <div className="h-4 w-px bg-gray-300" />
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
        <button
          onClick={onArchive}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
        >
          <Archive className="w-4 h-4" />
          Archive
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedCount} items? This action cannot be undone.
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