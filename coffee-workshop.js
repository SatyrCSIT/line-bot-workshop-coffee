const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const { createMenuFlexMessage } = require('./menuComponent');
const db = require('./db');
require('dotenv').config();

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);
const app = express();

app.post('/webhook', middleware(config), async (req, res) => {
    const events = req.body.events;
    const results = await Promise.all(events.map(handleEvent));
    res.json(results);
});

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') return null;

    const { text } = event.message;
    const userId = event.source.userId;

    const axios = require('axios');

    if (text === 'สมัครสมาชิก' || text === 'register') {
        const [rows] = await db.query('SELECT * FROM users WHERE line_id = ?', [userId]);

        if (rows.length === 0) {
            // 🔍 ดึงชื่อผู้ใช้จาก LINE
            const profile = await client.getProfile(userId);
            const displayName = profile.displayName;

            // 💾 บันทึกลง DB
            await db.query('INSERT INTO users (line_id, name, points) VALUES (?, ?, ?)', [userId, displayName, 0]);

            // 🚀 แจ้งเตือนไป Telegram
            const telegramToken = 'bottoken';
            const telegramChatId = 'chatid';
            const telegramMessage = `👤 สมาชิกใหม่สมัครสมาชิก:\nชื่อ: ${displayName}\nLINE ID: ${userId}`;

            const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

            axios.post(telegramUrl, {
                chat_id: telegramChatId,
                text: telegramMessage,
                parse_mode: 'HTML'
            }).then(() => {
                console.log('✅ แจ้งเตือนไปยัง Telegram เรียบร้อย');
            }).catch(err => {
                console.error('❌ ส่งแจ้งเตือน Telegram ล้มเหลว:', err.response?.data || err.message);
            });

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
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const [rows] = await db.query(
            'SELECT * FROM promotions WHERE active = 1 AND start_date <= ? AND end_date >= ?',
            [today, today]
        );

        if (rows.length === 0) {
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'ขณะนี้ไม่มีโปรโมชั่นพิเศษ',
            });
        }

        // สร้างข้อความแสดงโปรโมชั่นแบบง่าย
        const promoList = rows.map(promo => `🎉 ${promo.title}\n${promo.description}`).join('\n\n');

        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `📢 โปรโมชั่นร้านตอนนี้:\n\n${promoList}`,
        });
    }
    if (text.trim().toLowerCase() === 'เเผนที่ร้าน') {
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


}

app.listen(3000, () => {
    console.log('☕ Coffee LINE Bot is running on port 3000');
});