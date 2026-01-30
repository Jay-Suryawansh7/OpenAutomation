import {
    House,
    Sparkles,
    Zap,
    Users,
    FileText,
    Gift,
    Settings,
    ChevronDown,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen, // For expand
    X,
    CheckCircle2,
    HelpCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, isCollapsed, toggleCollapsed, toggleMobile, isMobile }) => {
    const navItems = [
        { name: 'Home', icon: House, id: 'home' },
        { name: 'AI Studio', icon: Sparkles, id: 'ai-studio', badge: 'NEW' },
        { name: 'Automations', icon: Zap, id: 'automations' },
        { name: 'Contacts', icon: Users, id: 'contacts' },
        { name: 'Forms', icon: FileText, id: 'forms' },
        { name: 'Refer & Earn', icon: Gift, id: 'refer' },
        { name: 'Settings', icon: Settings, id: 'settings' },
    ];

    const location = useLocation();
    const activeId = navItems.find(item => location.pathname.startsWith(`/${item.id}`) || (item.id === 'home' && location.pathname === '/'))?.id || 'home';

    // Width handling
    // Mobile: Fixed 280px if open, else 0/hidden.
    // Desktop: 280px if !collapsed, 80px if collapsed.
    const widthClass = isMobile
        ? (isOpen ? 'w-[280px] translate-x-0' : 'w-[280px] -translate-x-full')
        : (isCollapsed ? 'w-[80px]' : 'w-[280px]');

    return (
        <aside
            className={`
        bg-white border-r border-gray-200 h-full flex-shrink-0 flex flex-col
        transition-all duration-300 ease-in-out
        ${isMobile ? 'fixed inset-y-0 left-0 z-30 shadow-2xl' : 'relative z-20'}
        ${widthClass}
        overflow-hidden
      `}
        >

            {/* Header Section */}
            <div className={`
           h-16 flex items-center border-b border-gray-100 mb-2 flex-shrink-0 transition-all duration-300
           ${isCollapsed && !isMobile ? 'justify-center px-0' : 'justify-between px-4'}
        `}>

                {/* User Profile - CONDITIONAL RENDERING */}
                {(!isCollapsed || isMobile) ? (
                    <button className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors text-left flex-1 mr-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden relative">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jay"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-gray-800 truncate leading-tight">Jay Suryawanshi</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                ) : (
                    // Collapsed Avatar
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer hover:ring-2 ring-gray-100">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jay" alt="Avatar" />
                    </div>
                )}

                {/* Toggle Button */}
                {(!isCollapsed || isMobile) && (
                    <button
                        onClick={isMobile ? toggleMobile : toggleCollapsed}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title={isMobile ? "Close Drawer" : "Collapse Sidebar"}
                    >
                        <PanelLeftClose size={18} />
                    </button>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => {
                    const isActive = item.id === activeId;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.id}
                            to={item.id === 'home' ? '/' : `/${item.id}`}
                            title={isCollapsed && !isMobile ? item.name : ''}
                            className={`
                  flex items-center rounded-md transition-all duration-200 group relative
                  ${isCollapsed && !isMobile ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'}
                  ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-[#666666] hover:text-[#333333] hover:bg-gray-50'
                                }
                `}
                        >
                            {/* Icon */}
                            <div className={`
                    flex-shrink-0 w-5 h-5 flex items-center justify-center
                    ${item.id === 'ai-studio' ? 'text-purple-500' : ''} 
                    ${isActive ? 'text-blue-600' : 'group-hover:text-gray-600'}
                `}>
                                {item.id === 'ai-studio' ? (
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500" />
                                ) : (
                                    <Icon size={20} className={isActive ? 'fill-blue-100/50' : ''} />
                                )}
                            </div>

                            {/* Text (Hidden if collapsed) */}
                            {(!isCollapsed || isMobile) && (
                                <span className="text-[13px] font-medium flex-1 truncate transition-opacity duration-200">
                                    {item.name}
                                </span>
                            )}

                            {/* Badge (Dot if collapsed) */}
                            {item.badge && (
                                (!isCollapsed || isMobile) ? (
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-pink-600 bg-pink-100 rounded border border-pink-200">
                                        {item.badge}
                                    </span>
                                ) : (
                                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 border border-white"></span>
                                )
                            )}
                        </Link>
                    );
                })}

                {/* Collapsed Expand Button (Bottom) */}
                {isCollapsed && !isMobile && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={toggleCollapsed}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            <PanelLeftOpen size={20} />
                        </button>
                    </div>
                )}
            </nav>

            {/* Upgrade Card (Hidden if collapsed) */}
            {(!isCollapsed || isMobile) && (
                <div className="p-4 mt-auto">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <h4 className="text-[12px] text-gray-500 mb-1">Upgrade to</h4>
                        <h3 className="text-[16px] font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-3">
                            Unlock your Growth
                        </h3>

                        <ul className="space-y-2 mb-4">
                            <li className="flex items-center gap-2 text-xs text-gray-600">
                                <X size={14} className="text-gray-400" />
                                <span>AI Credits: 1x</span>
                            </li>
                            <li className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                                <CheckCircle2 size={14} className="text-purple-600" />
                                <span>Automations: Unlimited</span>
                            </li>
                            <li className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                                <CheckCircle2 size={14} className="text-purple-600" />
                                <span>Forms: Unlimited</span>
                            </li>
                        </ul>

                        <button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-md py-[10px] px-[16px] text-sm font-medium flex items-center justify-center gap-2 hover:from-slate-800 hover:to-slate-700 transition-all">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400"></div>
                            Upgrade Plan
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
