import MenuForm from './MenuForm';
import PromotionForm from './PromotionForm';

function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-32 h-32 bg-orange-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
            </div>

            <div className="relative container mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                            <span className="text-3xl">☕</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                            Satyr Cafe
                        </h1>
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                            <span className="text-3xl">🎁</span>
                        </div>
                    </div>
                    <p className="text-xl text-gray-600 font-medium">Admin Dashboard</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Forms Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    <MenuForm />
                    <PromotionForm />
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <p className="text-gray-500">
                        Made with ❤️ for modern cafes
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;