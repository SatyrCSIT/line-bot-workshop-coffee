const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const { createMenuFlexMessage, createPromotionFlexMessage } = require('./menuComponent');
const {
    handleOrderRequest,
    handleQuantitySelection,
    handleSweetnessSelection,
    handleOrderConfirmation,
    handleOrderCancel,
    isOrderCommand,
    extractMenuId,
    isQuantitySelection,
    extractQuantity,
    isSweetnessSelection,
    extractSweetness,
    isOrderConfirm,
    isOrderCancel
} = require('./orderComponent');
const db = require('./db');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);
const app = express();

app.use(cors());

// Webhook สำหรับ LINE
app.post('/webhook', middleware(config), async (req, res) => {
    try {
        const events = req.body.events;
        const results = await Promise.all(events.map(handleEvent));
        res.json(results);
    } catch (error) {
        console.error('❌ Error handling webhook:', error);
        res.status(500).end();
    }
});

// ใช้ express.json() เฉพาะกับ API ภายนอก
app.use('/api', express.json());

// Endpoint เพิ่มเมนู
app.post('/api/menu', async (req, res) => {
    const { name, price, image_url, category } = req.body;
    if (!name || !price || !image_url || !category) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    try {
        await db.query(
            'INSERT INTO menu (name, price, image_url, category) VALUES (?, ?, ?, ?)',
            [name, price, image_url, category]
        );
        res.status(201).json({ message: 'เพิ่มเมนูสำเร็จ' });
    } catch (error) {
        console.error('Error adding menu:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มเมนู' });
    }
});

// Endpoint เพิ่มโปรโมชัน
app.post('/api/promotions', async (req, res) => {
    const { title, description, start_date, end_date, image_url, active } = req.body;
    if (!title || !description || !start_date || !end_date || !image_url) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    try {
        await db.query(
            'INSERT INTO promotions (title, description, start_date, end_date, image_url, active) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, start_date, end_date, image_url, active ? 1 : 0]
        );
        res.status(201).json({ message: 'เพิ่มโปรโมชันสำเร็จ' });
    } catch (error) {
        console.error('Error adding promotion:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มโปรโมชัน' });
    }
});

// Endpoint ดูประวัติการสั่งซื้อ
app.get('/api/orders/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT o.*, m.name as menu_name, m.image_url 
            FROM orders o 
            JOIN menu m ON o.menu_id = m.id 
            WHERE o.user_id = ? 
            ORDER BY o.order_date DESC 
            LIMIT 10
        `, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ' });
    }
});

// จัดการข้อความที่ส่งเข้ามา
async function handleEvent(event) {
    try {
        if (event.type !== 'message' || event.message.type !== 'text') return null;

        const { text } = event.message;
        const userId = event.source.userId;

        // ระบบสมัครสมาชิก
        if (text === 'สมัครสมาชิก' || text === 'register') {
            const [rows] = await db.query('SELECT * FROM users WHERE line_id = ?', [userId]);

            if (rows.length === 0) {
                const profile = await client.getProfile(userId);
                const displayName = profile.displayName;

                await db.query(
                    'INSERT INTO users (line_id, name, points) VALUES (?, ?, ?)',
                    [userId, displayName, 0]
                );

                const telegramToken = 'bottoken';
                const telegramChatId = 'chatid';
                const telegramMessage = `👤 สมาชิกใหม่สมัครสมาชิก:\nชื่อ: ${displayName}\nLINE ID: ${userId}`;

                const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

                axios.post(telegramUrl, {
                    chat_id: telegramChatId,
                    text: telegramMessage,
                    parse_mode: 'HTML',
                }).catch(() => { });

                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: `ยินดีต้อนรับคุณ ${displayName} สมัครสมาชิกเรียบร้อยแล้ว 🎉\nแต้มปัจจุบัน: 0 แต้ม`
                });
            } else {
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: `คุณได้สมัครสมาชิกแล้วครับ 🎯\nชื่อ: ${rows[0].name}\nแต้มปัจจุบัน: ${rows[0].points} แต้ม`
                });
            }
        }

        // ระบบสั่งซื้อ - เริ่มต้นสั่งซื้อ
        if (isOrderCommand(text)) {
            const menuId = extractMenuId(text);
            if (menuId) {
                const flexMessage = await handleOrderRequest(menuId, db, userId);
                return client.replyMessage(event.replyToken, flexMessage);
            }
        }

        // ระบบสั่งซื้อ - เลือกจำนวน
        if (isQuantitySelection(text)) {
            const quantity = extractQuantity(text);
            if (quantity) {
                const flexMessage = await handleQuantitySelection(userId, quantity);
                return client.replyMessage(event.replyToken, flexMessage);
            }
        }

        // ระบบสั่งซื้อ - เลือกความหวาน
        if (isSweetnessSelection(text)) {
            const sweetness = extractSweetness(text);
            if (sweetness) {
                const flexMessage = await handleSweetnessSelection(userId, sweetness);
                return client.replyMessage(event.replyToken, flexMessage);
            }
        }

        // ระบบสั่งซื้อ - ยืนยันคำสั่งซื้อ
        if (isOrderConfirm(text)) {
            const response = await handleOrderConfirmation(userId, db);
            return client.replyMessage(event.replyToken, response);
        }

        // ระบบสั่งซื้อ - ยกเลิกคำสั่งซื้อ
        if (isOrderCancel(text)) {
            const response = await handleOrderCancel(userId);
            return client.replyMessage(event.replyToken, response);
        }

        // แสดงเมนู
        if (text.trim().toLowerCase() === 'รายการเครื่องดื่ม' || text.trim().toLowerCase() === 'รายการเครื่องดื่มทั้งหมด') {
            const flexMessage = await createMenuFlexMessage(text, db, event);
            return client.replyMessage(event.replyToken, flexMessage);
        }

        // แสดงโปรโมชัน
        if (text.trim().toLowerCase() === 'โปรโมชั่น' || text.trim().toLowerCase() === 'promotion') {
            const flexMessage = await createPromotionFlexMessage(db, event);
            return client.replyMessage(event.replyToken, flexMessage);
        }

        // แสดงแผนที่ร้าน
        if (text.trim().toLowerCase() === 'แผนที่ร้าน' || text.trim().toLowerCase() === 'เเผนที่ร้าน') {
            const [rows] = await db.query('SELECT name, address, latitude, longitude FROM shop LIMIT 1');

            if (rows.length === 0) {
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'ไม่พบข้อมูลที่ตั้งร้านในระบบ',
                });
            }

            const shop = rows[0];

            return client.replyMessage(event.replyToken, {
                type: 'location',
                title: shop.name,
                address: shop.address,
                latitude: parseFloat(shop.latitude),
                longitude: parseFloat(shop.longitude),
            });
        }

        // ดูประวัติการสั่งซื้อ
        if (text.trim().toLowerCase() === 'ประวัติสั่งซื้อ' || text.trim().toLowerCase() === 'order history') {
            const [orderRows] = await db.query(`
            SELECT o.*, m.name as menu_name 
            FROM orders o 
            JOIN menu m ON o.menu_id = m.id 
            WHERE o.user_id = ? 
            ORDER BY o.order_date DESC 
            LIMIT 5
                `, [userId]);

            const [userRows] = await db.query('SELECT points FROM users WHERE line_id = ?', [userId]);

            if (orderRows.length === 0) {
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: `คุณยังไม่มีประวัติการสั่งซื้อ\n🎯 แต้มปัจจุบัน: ${userRows[0]?.points || 0} แต้ม`
                });
            }

            let historyText = `📋 ประวัติการสั่งซื้อ 5 รายการล่าสุด:\n\n`;
            orderRows.forEach((order, index) => {
                const orderDate = new Date(order.order_date).toLocaleDateString('th-TH');
                historyText += `${index + 1}. ${order.menu_name}\n`;
                historyText += `   จำนวน: ${order.quantity} แก้ว\n`;
                historyText += `   ความหวาน: ${order.sweetness_level}\n`;
                historyText += `   ราคา: ฿${order.total_price.toFixed(2)}\n`;
                historyText += `   วันที่: ${orderDate}\n`;
                historyText += `   สถานะ: ${order.status === 'pending' ? 'รอดำเนินการ' : 'สำเร็จ'}\n\n`;
            });
            historyText += `🎯 แต้มปัจจุบัน: ${userRows[0]?.points || 0} แต้ม`;

            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: historyText
            });
        }

        // ข้อความช่วยเหลือ
        if (text.trim().toLowerCase() === 'help' || text.trim().toLowerCase() === 'ช่วยเหลือ') {
            const helpText = `🤖 คำสั่งที่ใช้ได้:\n\n` +
                `📋 "รายการเครื่องดื่ม" - ดูเมนูทั้งหมด\n` +
                `🎉 "โปรโมชั่น" - ดูโปรโมชันปัจจุบัน\n` +
                `🗺️ "แผนที่ร้าน" - ดูที่ตั้งร้าน\n` +
                `👤 "สมัครสมาชิก" - สมัครสมาชิกรับแต้ม\n` +
                `📜 "ประวัติสั่งซื้อ" - ดูประวัติการสั่งซื้อและแต้ม\n` +
                `🛒 กดปุ่ม "Order Now" ในเมนูเพื่อสั่งซื้อ\n\n` +
                `🎯 ระบบแต้ม: รับ 1 แต้มทุก ๆ 50 บาทที่ใช้จ่าย\n` +
                `💡 เคล็ดลับ: คุณสามารถเลือกจำนวนและความหวานได้เมื่อสั่งซื้อ!`;

            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: helpText
            });
        }

        return null;

    } catch (err) {
        console.error('❌ Error in handleEvent:', err);
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'เกิดข้อผิดพลาดภายในระบบ 😢',
        });
    }
}

app.listen(3000, () => {
    console.log('☕ Coffee LINE Bot is running on port 3000');
});