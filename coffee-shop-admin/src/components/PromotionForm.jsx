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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/promotions', formData);
            setMessage(response.data.message);
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
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">เพิ่มโปรโมชันใหม่</h2>
            {message && (
                <p className={`mb-4 ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">ชื่อโปรโมชัน</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">คำอธิบาย</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">วันที่เริ่ม</label>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">วันที่สิ้นสุด</label>
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">URL รูปภาพ</label>
                    <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span className="text-gray-700">ใช้งานโปรโมชัน</span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-700"
                >
                    เพิ่มโปรโมชัน
                </button>
            </form>
        </div>
    );
}

export default PromotionForm;