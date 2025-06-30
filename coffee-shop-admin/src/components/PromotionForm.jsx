import { useState } from 'react';
import axios from 'axios';

function PromotionForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        image_url: '',
        active: true,
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:3000/api/promotions', formData);
            setMessage(response.data.message + ' 🎉');
            setFormData({
                title: '',
                description: '',
                start_date: '',
                end_date: '',
                image_url: '',
                active: true,
            });
        } catch (error) {
            setMessage(error.response?.data?.error || 'เกิดข้อผิดพลาด');
        } finally {
            setIsSubmitting(false);
            // Auto hide message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-purple-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🎁</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    เพิ่มโปรโมชันใหม่
                </h2>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl border ${message.includes('สำเร็จ') || message.includes('🎉')
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
                    <label className="block text-gray-700 font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                        ชื่อโปรโมชัน
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                        placeholder="เช่น Happy Hour ลด 20%"
                        required
                    />
                </div>

                <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                        คำอธิบาย
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                        rows="4"
                        placeholder="รายละเอียดโปรโมชัน..."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                        <label className="block text-gray-700 font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                            วันที่เริ่ม
                        </label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                            required
                        />
                    </div>

                    <div className="group">
                        <label className="block text-gray-700 font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                            วันที่สิ้นสุด
                        </label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                            required
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                        URL รูปภาพ
                    </label>
                    <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                        placeholder="https://example.com/promotion.jpg"
                        required
                    />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div className={`w-14 h-8 rounded-full shadow-inner transition-colors duration-300 ${formData.active ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 mt-1 ml-1 ${formData.active ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </div>
                        <span className="ml-4 text-gray-700 font-semibold group-hover:text-purple-600 transition-colors">
                            ใช้งานโปรโมชัน
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            กำลังเพิ่ม...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span>🎉</span>
                            เพิ่มโปรโมชัน
                            <span>🎉</span>
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default PromotionForm;