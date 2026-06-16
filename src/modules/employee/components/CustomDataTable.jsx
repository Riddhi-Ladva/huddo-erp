import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function CustomDataTable({ 
  columns, 
  data, 
  searchPlaceholder = "Search...", 
  searchKeys = [],
  emptyStateText = "No items found",
  onRowClick
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting handler
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter + Sort + Paginate
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchTerm && searchKeys.length > 0) {
      result = result.filter(item => 
        searchKeys.some(key => {
          const val = typeof key === 'function' ? key(item) : item[key];
          return val?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        const col = columns.find(c => c.accessor === sortConfig.key);
        if (col && typeof col.accessor === 'function') {
          valA = col.accessor(a);
          valB = col.accessor(b);
        }

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }

        const strA = valA.toString().toLowerCase();
        const strB = valB.toString().toLowerCase();

        if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, sortConfig, columns]);

  // Pagination bounds
  const totalPages = Math.ceil(processedData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white font-medium"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-700 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, index) => (
                <th 
                  key={index}
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                  className={`px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${col.sortable !== false ? 'cursor-pointer hover:bg-slate-100 select-none' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && sortConfig.key === col.accessor && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-slate-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, colIndex) => {
                    const cellVal = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
                    return (
                      <td key={colIndex} className="px-5 py-3.5 text-xs text-slate-700 font-medium">
                        {col.render ? col.render(cellVal, row) : cellVal}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="text-slate-500 text-xs font-semibold">{emptyStateText}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {processedData.length > 0 && (
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="text-[11px] font-semibold text-slate-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, processedData.length)} of {processedData.length} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-slate-200 hover:bg-slate-100 text-xs rounded-md disabled:opacity-50 disabled:hover:bg-white text-slate-600 font-bold transition-colors"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-7 h-7 flex items-center justify-center text-xs rounded-md font-bold transition-colors ${
                  currentPage === i + 1 
                    ? 'bg-brand-orange text-white' 
                    : 'border border-transparent hover:bg-slate-100 text-slate-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-slate-200 hover:bg-slate-100 text-xs rounded-md disabled:opacity-50 disabled:hover:bg-white text-slate-600 font-bold transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
