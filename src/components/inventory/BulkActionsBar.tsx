import { useState } from 'react';
import { Trash2, Archive, Download, ArchiveRestore } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

interface Props {
  selectedCount: number;
  onDelete: () => void;
  onExport: () => Promise<Array<any>>;
  onArchive: () => Promise<void>;
  isArchiving?: boolean;
  isArchived?: boolean;
}

export default function BulkActionsBar({ 
  selectedCount, 
  onDelete, 
  onExport, 
  onArchive,
  isArchiving = false,
  isArchived = false
}: Props) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showArchiveSuccess, setShowArchiveSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (!selectedCount || selectedCount === 0) return null;

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowConfirmDelete(false);
  };

  const handleArchive = async () => {
    if (isArchiving) return;

    try {
      await onArchive();
      setShowArchiveSuccess(true);
      setTimeout(() => setShowArchiveSuccess(false), 3000);
    } catch (error) {
      setShowArchiveSuccess(false);
    }
  };

  const handleExport = async () => {
    try {
      console.log('Starting export...');
      const data = await onExport();
      console.log('Export data received:', data);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No data available for export');
      }

      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(data, {
        header: Object.keys(data[0]),
        skipHeader: false
      });
      
      // Auto-size columns
      const colWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(key.length, 
          ...data.map(row => String(row[key]).length))
      }));
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Inventory");
      
      // Generate Excel file
      const fileName = `inventory_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      console.log('Generating file:', fileName);
      XLSX.writeFile(wb, fileName);
      
      toast.success('Export completed successfully');
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err : new Error('Export failed'));
      toast.error(err instanceof Error ? err.message : 'Failed to export items');
    }
  };

  if (error) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow-lg">
        {error.message}
        <button 
          onClick={() => setError(null)}
          className="ml-2 text-red-800 hover:text-red-900"
          aria-label="Dismiss error"
        >
          ×
        </button>
      </div>
    );
  }

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
          onClick={handleArchive}
          disabled={isArchiving}
          className={`flex items-center gap-2 ${
            isArchiving 
              ? 'opacity-50 cursor-not-allowed text-gray-400' 
              : isArchived 
                ? 'text-blue-600 hover:text-blue-700'
                : 'text-gray-600 hover:text-gray-700'
          }`}
        >
          {isArchiving ? (
            <>
              <span className="animate-spin">⌛</span>
              {isArchived ? 'Restoring...' : 'Archiving...'}
            </>
          ) : (
            <>
              {isArchived ? (
                <ArchiveRestore className="w-4 h-4" />
              ) : (
                <Archive className="w-4 h-4" />
              )}
              {isArchived ? 'Restore' : 'Archive'}
            </>
          )}
        </button>
        <button
          onClick={handleExport}
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

      {showArchiveSuccess && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-50 text-green-800 px-4 py-2 rounded-lg shadow-lg">
          {selectedCount} items {isArchived ? 'unarchived' : 'archived'} successfully
        </div>
      )}
    </>
  );
}