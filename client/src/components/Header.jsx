import { HelpCircle } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Header = ({ toggleSidebar, isOpen }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center gap-4">
                {/* Toggle Button (Mobile/Desktop logic handled by Layout mainly, but good to have here) */}
                {!isOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-600 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}

                {/* Page Title */}
                <h1 className="text-[18px] font-semibold text-[#333333]">Automations</h1>
            </div>

            {/* Right Section: Auth + Support */}
            <div className="flex items-center gap-4">
                {/* Clerk Authentication */}
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="px-4 py-2 text-[12px] font-medium text-white bg-[#6366F1] hover:bg-[#5558E3] rounded-md transition-colors">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>

                <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8"
                            }
                        }}
                    />
                </SignedIn>

                {/* Support Button */}
                <button className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                    <HelpCircle size={16} />
                    <span>Support</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
