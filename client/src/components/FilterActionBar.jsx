import {
    Check,
    Search,
    Plus,
    ArrowUpDown,
    Circle
} from 'lucide-react';

const FilterActionBar = ({
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    totalCount
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-gray-200 pb-4 mb-6 sticky top-0 bg-[#F5F5F5] z-10 pt-2 transition-all">

            {/* Left: Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`
            flex items-center gap-2 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors whitespace-nowrap
            ${activeTab === 'active'
                            ? 'bg-[#E8F5E9] text-[#4CAF50]'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
          `}
                >
                    {activeTab === 'active' && <Check size={16} />}
                    Active
                </button>
                <button
                    onClick={() => setActiveTab('archived')}
                    className={`
            px-3 py-2 rounded-[4px] text-sm font-medium transition-colors whitespace-nowrap
            ${activeTab === 'archived'
                            ? 'bg-gray-200 text-gray-800'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
          `}
                >
                    Archived
                </button>
            </div>

            {/* Middle: Search & Counter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-[220px] group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className={`text-gray-400 group-focus-within:text-blue-500 transition-colors`} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search automations"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-[6px] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 h-[36px] transition-all"
                    />
                </div>

                {/* Counter Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-[20px] shadow-sm whitespace-nowrap">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">
                        {totalCount} / Unlimited
                    </span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 ml-auto w-full md:w-auto justify-end">
                {/* Sort Button */}
                <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium whitespace-nowrap">
                    <span className="hidden sm:inline">Last Published</span>
                    <span className="sm:hidden">Sort</span>
                    <ArrowUpDown size={14} />
                </button>

                {/* Primary Button */}
                <button className="flex items-center gap-2 bg-[#1F2937] hover:bg-gray-800 text-white px-4 py-2.5 rounded-[6px] text-sm font-medium shadow-sm transition-colors whitespace-nowrap">
                    <Plus size={16} />
                    <span className="hidden sm:inline">New Automation</span>
                </button>
            </div>
        </div>
    );
};

export default FilterActionBar;
