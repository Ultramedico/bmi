import { useState } from "react";

const Table = ({ headers, data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50; // Limit to 50 rows per page

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
             S/N
            </th>
            {headers.map((header) => (
              <th
                key={header.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {/* Serial Number Column */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {(currentPage - 1) * rowsPerPage + index + 1}
              </td>
              {headers.map((header) => {
                const cellValue = row[header.key] || "";
                const truncatedValue =
                  cellValue.length > 30 ? `${cellValue.substring(0, 30)}...` : cellValue;

                return (
                  <td
                    key={`${index}-${header.key}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative group"
                  >
                    {header.key === "link" ? (
                      <a
                        href={cellValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {truncatedValue}
                      </a>
                    ) : (
                      <div className="relative inline-block cursor-default">
                        <span>{truncatedValue}</span>
                        {cellValue.length > 30 && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 min-h-[80px] bg-black text-white text-xs font-medium p-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-pre-wrap break-words flex items-center justify-center">
                            {cellValue}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 p-4 border-t bg-gray-50">
          <button
            className={`px-4 py-2 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 border rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
