const AIStudio = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="p-4 bg-purple-50 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI Studio</h2>
            <p className="text-gray-500 max-w-md">
                Build advanced AI-powered workflows. This feature is currently in development.
            </p>
        </div>
    );
};

export default AIStudio;
