const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center mt-8 cursor-pointer">
            <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-[20px] px-3 py-2 shadow-sm text-[12px] text-gray-500 hover:shadow-md transition-shadow">
                <span>Prev</span>
                <div className="flex items-center gap-1">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-medium text-[11px]">
                        {currentPage}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span>{totalPages}</span>
                </div>
                <span>Next</span>
            </div>
        </div>
    );
};

export default Pagination;
