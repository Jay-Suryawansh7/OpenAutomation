import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop: Collapsed to icon
    const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile: Open drawer

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768; // Tablet breakpoint as per request is complex (768-1279), let's simplify logic first
            // Request: Tablet (768-1279) - Sidebar icon-only by default
            // Mobile (<768) - Sidebar hidden (drawer)

            setIsMobile(mobile);

            if (window.innerWidth >= 768 && window.innerWidth < 1280) {
                setIsSidebarCollapsed(true);
            } else if (window.innerWidth >= 1280) {
                setIsSidebarCollapsed(false);
            }
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleCollapsed = () => setIsSidebarCollapsed(!isSidebarCollapsed);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">

            {/* Mobile Overlay */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <Sidebar
                isOpen={isMobileOpen} // For mobile slide-in
                isCollapsed={isSidebarCollapsed} // For desktop collapse
                toggleCollapsed={toggleCollapsed}
                toggleMobile={toggleMobile}
                isMobile={isMobile}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">

                <Header
                    toggleSidebar={toggleMobile}
                    isOpen={isMobileOpen}
                // Header toggle mainly for mobile now, maybe also for desktop if we want
                />

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
