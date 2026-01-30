import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card" // Assuming I'll create these later or just use div for now if I haven't created the component file.
// Actually, since I haven't manually created the components/ui/card.jsx, I should stick to standard HTML/Tailwind for placeholders or create the generic Card component now.
// I'll stick to HTML/Tailwind to avoid dependency on uncreated files, but using the design tokens.

const Home = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back to your automation command center.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month" },
                    { title: "Active Automations", value: "12", change: "+2 since yesterday" },
                    { title: "Total Emails Sent", value: "2350", change: "+180 in the last hour" },
                    { title: "Active Contacts", value: "12,234", change: "+19 new leads today" }
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                {stat.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Chart / Graph Placeholder
                    </div>
                </div>
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                            Create New Automation
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                            Import Contacts
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                            View Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
