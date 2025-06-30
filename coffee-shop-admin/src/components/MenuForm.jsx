import { useState } from 'react';
import axios from 'axios';

function MenuForm() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image_url: '',
        category: 'Coffee',
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:3000/api/menu', formData);
            setMessage(response.data.message + ' ☕');
            setFormData({ name: '', price: '', image_url: '', category: 'Coffee' });
        } catch (error) {
            setMessage(error.response?.data?.error || 'เกิดข้อผิดพลาด');
        } finally {
            setIsSubmitting(false);
            // Auto hide message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-amber-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">☕</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    เพิ่มเมนูใหม่
                </h2>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl border ${message.includes('สำเร็จ') || message.includes('☕')
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700'
                    }`}>
                    <p className="font-medium text-center animate-pulse">
                        {message}
                    </p>
                </div>
            )}

            <div className="space-y-6">
                <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 group-hover:text-amber-600 transition-colors">
                        ชื่อเมนู
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                        placeholder="เช่น Cappuccino Supreme"
                        required
                    />
                </div>

                <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 group-hover:text-amber-600 transition-colors">
                        ราคา (บาท)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                            placeholder="99"
                            required
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 font-bold">
                            ฿
                        </span>
                    </div>
                </div>

                <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 group-hover:text-amber-600 transition-colors">
                        URL รูปภาพ
                    </label>
                    <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                        placeholder="https://example.com/coffee.jpg"
                        required
                    />
                </div>

                <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 group-hover:text-amber-600 transition-colors">
                        หมวดหมู่
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                    >
                        <option value="Coffee">☕ Coffee</option>
                        <option value="Tea">🍵 Tea</option>
                        <option value="Milk">🥛 Milk</option>
                        <option value="Dessert">🧁 Dessert</option>
                        <option value="Snack">🥐 Snack</option>
                    </select>
                </div>

                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            กำลังเพิ่ม...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span>✨</span>
                            เพิ่มเมนู
                            <span>✨</span>
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default MenuForm;