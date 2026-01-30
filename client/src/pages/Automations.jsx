import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import FilterActionBar from '../components/FilterActionBar';
import AutomationList from '../components/AutomationList';
import { cn } from "@/lib/utils";

const Automations = () => {
    const [automations, setAutomations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'archived'

    // Fetch Automations
    useEffect(() => {
        const fetchAutomations = async () => {
            try {
                setLoading(true);
                // Use environment variable or fallback to localhost
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await axios.get(`${apiUrl}/automation`);
                setAutomations(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch automations:", err);
                setError("Failed to load automations. Please check if the server is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchAutomations();
    }, []);

    // Filter Logic
    const filteredAutomations = useMemo(() => {
        return automations.filter(item => {
            // Tab Filter
            if (activeTab === 'active' && item.isArchived) return false;
            if (activeTab === 'archived' && !item.isArchived) return false;

            // Search Filter
            if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            return true;
        });
    }, [automations, searchTerm, activeTab]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Automations</h1>
                <p className="text-gray-500">Manage your automated workflows and campaigns.</p>
            </div>

            {error && (
                <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
                    {error}
                </div>
            )}

            {/* Filter & Action Bar */}
            <FilterActionBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                totalCount={filteredAutomations.length}
            />

            {/* Content Area */}
            <AutomationList
                automations={filteredAutomations}
                loading={loading}
                currentPage={1}
                totalPages={1} // Pagination logic to be added later if API supports it
            />
        </div>
    );
};

export default Automations;
