
import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface CRUDTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function CRUDTable<T extends { id: string }>({ 
  title, data, columns, onAdd, onEdit, onDelete 
}: CRUDTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        {onAdd && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            <Plus size={14} /> Adicionar
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-4 font-bold text-slate-600">{col.header}</th>
                ))}
                <th className="px-6 py-4 font-bold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors group">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-6 py-4 text-slate-700">
                      {typeof col.accessor === 'function' 
                        ? col.accessor(item) 
                        : (item[col.accessor] as any)?.toString() || '-'}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit?.(item)}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => onDelete?.(item)}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400 italic">
                    Nenhum registro cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
