import { useState, useEffect } from 'react';
import { X, Loader2, Instagram, MessageSquare, Tag, Check } from 'lucide-react';
import axios from 'axios';
import { cn } from "@/lib/utils";

const CreateAutomationModal = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [mediaItems, setMediaItems] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [formData, setFormData] = useState({
        triggerKeyword: '',
        replyMessage: ''
    });
    const [error, setError] = useState(null);

    // Fetch Instagram Media
    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

                // Assuming you use Clerk for auth and axios interceptor is set up for token
                // If not, we might need to get token here. 
                // For now, assuming Global Axios Configuration handled Authorization header
                const response = await axios.get(`${apiUrl}/api/instagram/media`);
                setMediaItems(response.data.data || []);
            } catch (err) {
                console.error("Failed to fetch media:", err);
                setError("Failed to load Instagram media. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    const handleSubmit = async () => {
        if (!selectedMedia || !formData.triggerKeyword || !formData.replyMessage) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;

            const payload = {
                title: selectedMedia.caption ? selectedMedia.caption.substring(0, 30) + '...' : 'New Automation',
                triggerKeywords: [formData.triggerKeyword], // Backend expects array
                replyMessage: formData.replyMessage,
                postId: selectedMedia.id,
                mediaUrl: selectedMedia.media_url,
                thumbnailUrl: selectedMedia.thumbnail_url || selectedMedia.media_url,
                isActive: true
            };

            await axios.post(`${apiUrl}/api/automations`, payload);
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to create automation:", err);
            setError("Failed to create automation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Create Automation</h2>
                        <p className="text-sm text-gray-500">
                            {step === 1 ? 'Select a post to automate' : 'Configure automation details'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <>
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                                </div>
                            ) : mediaItems.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    <Instagram className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                    <p>No Instagram media found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {mediaItems.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedMedia(item)}
                                            className={cn(
                                                "relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02]",
                                                selectedMedia?.id === item.id
                                                    ? "border-indigo-600 ring-2 ring-indigo-600 ring-offset-2"
                                                    : "border-transparent hover:border-gray-200"
                                            )}
                                        >
                                            <img
                                                src={item.thumbnail_url || item.media_url}
                                                alt="Instagram Media"
                                                className="w-full h-full object-cover"
                                            />
                                            {item.media_type === 'VIDEO' && (
                                                <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white font-medium">
                                                    Reel
                                                </div>
                                            )}
                                            {selectedMedia?.id === item.id && (
                                                <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                                    <div className="bg-white rounded-full p-2 shadow-lg">
                                                        <Check size={20} className="text-indigo-600" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-6">
                            {/* Selected Media Preview */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <img
                                    src={selectedMedia.thumbnail_url || selectedMedia.media_url}
                                    alt="Selected"
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                        {selectedMedia.caption || 'No caption'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Published on {new Date(selectedMedia.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Tag size={16} /> Trigger Keyword
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. guide, link, info"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    value={formData.triggerKeyword}
                                    onChange={(e) => setFormData({ ...formData, triggerKeyword: e.target.value })}
                                />
                                <p className="text-xs text-gray-500">When users comment this word, we'll auto-reply.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <MessageSquare size={16} /> Auto-Reply DM
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Hey! Thanks for commenting. Here is the link you asked for..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                                    value={formData.replyMessage}
                                    onChange={(e) => setFormData({ ...formData, replyMessage: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Back
                        </button>
                    )}

                    {step === 1 ? (
                        <button
                            onClick={() => selectedMedia && setStep(2)}
                            disabled={!selectedMedia}
                            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm hover:shadow flex items-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            Create Automation
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateAutomationModal;
