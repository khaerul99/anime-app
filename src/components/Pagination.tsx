import React from 'react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, lastPage, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; 
    const halfMax = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(lastPage, currentPage + halfMax);

    if (endPage - startPage + 1 < maxPagesToShow) {
        if (startPage === 1) {
            endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);
        } else if (endPage === lastPage) {
            startPage = Math.max(1, lastPage - maxPagesToShow + 1);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
      >
        &larr; Previous
      </button>

     
      {pageNumbers[0] > 1 && (
        <span className="px-4 py-2 text-gray-700">...</span>
      )}

      
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg transition duration-300 ${
            page === currentPage
              ? 'bg-[#284b63] text-white font-semibold shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      
      {pageNumbers[pageNumbers.length - 1] < lastPage && (
        <span className="px-4 py-2 text-gray-700">...</span>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage || lastPage === 0}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default Pagination;