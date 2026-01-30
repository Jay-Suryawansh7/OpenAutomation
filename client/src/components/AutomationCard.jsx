import {
    Copy,
    MoreVertical,
    Users,
    Play,
    PlayCircle
} from 'lucide-react';

const AutomationCard = ({ automation }) => {
    return (
        <div className="bg-white border-b border-gray-100 last:border-0 p-4 hover:bg-gray-50 transition-colors duration-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group min-h-[100px]">

            {/* SECTION 1: Thumbnail & Metadata (Left) - Span 5 */}
            <div className="md:col-span-5 flex items-start gap-3">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-[6px] bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                    <img
                        src={automation.thumbnail}
                        alt={automation.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Text Info */}
                <div className="flex flex-col">
                    <h3 className="text-[14px] font-semibold text-[#333333] mb-0.5 leading-tight group-hover:text-blue-600 transition-colors">
                        {automation.title}
                    </h3>
                    <p className="text-[12px] text-[#999999] mb-1.5 line-clamp-1">
                        {automation.description}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Users size={12} className="text-gray-400" />
                        <span>{automation.followers} Followers Gained</span>
                    </div>
                </div>
            </div>

            {/* SECTION 2: Status & Runs (Center) - Span 4 */}
            <div className="md:col-span-4 flex items-center justify-between md:justify-center md:gap-8 gap-4">
                {/* Status Badge */}
                <div className={`
           px-2 py-1 rounded-[4px] text-[12px] font-medium flex items-center gap-1.5
           ${automation.status === 'Live' ? 'bg-[#E8F5E9] text-[#4CAF50]' : ''}
           ${automation.status === 'Draft' ? 'bg-gray-100 text-gray-500' : ''}
           ${automation.status === 'Paused' ? 'bg-amber-50 text-amber-600' : ''}
         `}>
                    <div className={`w-1.5 h-1.5 rounded-full ${automation.status === 'Live' ? 'bg-[#4CAF50]' :
                            automation.status === 'Paused' ? 'bg-amber-500' : 'bg-gray-400'
                        }`}></div>
                    {automation.status}
                </div>

                {/* Run Counter */}
                <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                    <PlayCircle size={14} className="text-gray-400" />
                    <span>{automation.runs.toLocaleString()} Runs</span>
                </div>
            </div>

            {/* SECTION 3: Actions (Right) - Span 3 */}
            <div className="md:col-span-3 flex items-center justify-end gap-4">
                {/* Duplicate Link */}
                <button className="flex items-center gap-1.5 text-[12px] text-[#666666] hover:text-[#333333] hover:underline group/btn transition-colors">
                    <Copy size={12} />
                    Duplicate
                </button>

                {/* Menu Button */}
                <button className="p-1.5 hover:bg-gray-100 rounded-[4px] text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={16} />
                </button>
            </div>

        </div>
    );
};

export default AutomationCard;
