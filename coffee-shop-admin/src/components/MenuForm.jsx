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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/menu', formData);
            setMessage(response.data.message);
            setFormData({ name: '', price: '', image_url: '', category: 'Coffee' });
        } catch (error) {
            setMessage(error.response?.data?.error || 'เกิดข้อผิดพลาด');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">เพิ่มเมนูใหม่</h2>
            {message && (
                <p className={`mb-4 ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
            <div
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label className="block text-gray-700">ชื่อเมนู</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">ราคา (บาท)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
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
                    <label className="block text-gray-700">หมวดหมู่</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="Coffee">Coffee</option>
                        <option value="Tea">Tea</option>
                        <option value="Milk">Milk</option>
                    </select>
                </div>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-700"
                >
                    เพิ่มเมนู
                </button>
            </div>
        </div>
    );
}

export default MenuForm;