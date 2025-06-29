import MenuForm from './MenuForm';
import PromotionForm from './PromotionForm';

function AdminDashboard() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Satyr Cafe Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MenuForm />
                <PromotionForm />
            </div>
        </div>
    );
}

export default AdminDashboard;