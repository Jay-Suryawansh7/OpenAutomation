import AutomationCard from './AutomationCard';
import Pagination from './Pagination';
import { PackageOpen } from 'lucide-react';

const AutomationList = ({ automations, loading, currentPage, totalPages, onCreateClick }) => {
    if (loading) {
        return (
            <div className="bg-white border border-gray-100 rounded-[8px] p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 h-[100px]">
                        <div className="w-12 h-12 bg-gray-100 rounded"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (automations.length === 0) {
        return (
            <div className="bg-white border border-gray-100 rounded-[8px] p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <PackageOpen size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No automations found</h3>
                <p className="text-gray-500 max-w-sm mb-6">
                    Try adjusting your filters or create a new automation to get started.
                </p>
                <button
                    onClick={onCreateClick}
                    className="bg-[#1F2937] text-white px-4 py-2 rounded-[6px] text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Create Automation
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm flex flex-col">
                {automations.map((automation) => (
                    <AutomationCard key={automation.id} automation={automation} />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={() => { }}
            />
        </>
    );
};

export default AutomationList;
