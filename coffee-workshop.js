const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const { createMenuFlexMessage, createPromotionFlexMessage } = require('./menuComponent');
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

// จัดการข้อความที่ส่งเข้ามา
async function handleEvent(event) {
    try {
        if (event.type !== 'message' || event.message.type !== 'text') return null;

        const { text } = event.message;
        const userId = event.source.userId;

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
                    text: `ยินดีต้อนรับคุณ ${displayName} สมัครสมาชิกเรียบร้อยแล้ว 🎉`,
                });
            } else {
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: `คุณได้สมัครสมาชิกแล้วครับ มีแต้ม ${rows[0].points} แต้ม 🎯`,
                });
            }
        }

        if (text.trim().toLowerCase() === 'รายการเครื่องดื่ม' || text.trim().toLowerCase() === 'รายการเครื่องดื่มทั้งหมด') {
            const flexMessage = await createMenuFlexMessage(text, db, event);
            return client.replyMessage(event.replyToken, flexMessage);
        }

        if (text.trim().toLowerCase() === 'โปรโมชั่น' || text.trim().toLowerCase() === 'promotion') {
            const flexMessage = await createPromotionFlexMessage(db, event);
            return client.replyMessage(event.replyToken, flexMessage);
        }

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