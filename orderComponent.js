// orderComponent.js - จัดการคำสั่งซื้อและการเลือกออปชัน

const { createQuantitySelector, createSweetnessSelector, createOrderConfirmation } = require('./orderUIComponent');

// เก็บข้อมูลคำสั่งซื้อชั่วคราว
const pendingOrders = new Map();

/**
 * สร้าง Flex Message สำหรับเลือกจำนวน
 */
async function createQuantitySelection(menuId, menuData) {
    return createQuantitySelector(menuId, menuData);
}

/**
 * สร้าง Flex Message สำหรับเลือกระดับความหวาน
 */
async function createSweetnessSelection(menuId, quantity, menuData) {
    return createSweetnessSelector(menuId, quantity, menuData);
}

/**
 * สร้าง Flex Message สำหรับยืนยันคำสั่งซื้อ
 */
async function createOrderConfirmationMessage(orderData) {
    return createOrderConfirmation(orderData);
}

/**
 * จัดการคำสั่งซื้อเมนู
 */
async function handleOrderRequest(menuId, db, userId) {
    try {
        // ดึงข้อมูลเมนู
        const [menuRows] = await db.query('SELECT * FROM menu WHERE id = ?', [menuId]);

        if (menuRows.length === 0) {
            return {
                type: 'text',
                text: 'ไม่พบเมนูที่ระบุ'
            };
        }

        const menuData = menuRows[0];

        // สร้าง order session
        const orderSession = {
            menuId: menuId,
            menuData: menuData,
            userId: userId,
            step: 'quantity',
            timestamp: Date.now()
        };

        pendingOrders.set(userId, orderSession);

        // ส่งหน้าเลือกจำนวน
        return await createQuantitySelection(menuId, menuData);

    } catch (error) {
        console.error('Error handling order request:', error);
        return {
            type: 'text',
            text: 'เกิดข้อผิดพลาดในการประมวลผลคำสั่งซื้อ'
        };
    }
}

/**
 * จัดการการเลือกจำนวน
 */
async function handleQuantitySelection(userId, quantity) {
    try {
        const orderSession = pendingOrders.get(userId);

        if (!orderSession || orderSession.step !== 'quantity') {
            return {
                type: 'text',
                text: 'เซสชันหมดอายุ กรุณาเลือกเมนูใหม่'
            };
        }

        // อัพเดทข้อมูลคำสั่งซื้อ
        orderSession.quantity = quantity;
        orderSession.step = 'sweetness';
        pendingOrders.set(userId, orderSession);

        // ส่งหน้าเลือกความหวาน
        return await createSweetnessSelection(
            orderSession.menuId,
            quantity,
            orderSession.menuData
        );

    } catch (error) {
        console.error('Error handling quantity selection:', error);
        return {
            type: 'text',
            text: 'เกิดข้อผิดพลาดในการเลือกจำนวน'
        };
    }
}

/**
 * จัดการการเลือกความหวาน
 */
async function handleSweetnessSelection(userId, sweetness) {
    try {
        const orderSession = pendingOrders.get(userId);

        if (!orderSession || orderSession.step !== 'sweetness') {
            return {
                type: 'text',
                text: 'เซสชันหมดอายุ กรุณาเลือกเมนูใหม่'
            };
        }

        // เตรียมข้อมูลสำหรับยืนยันคำสั่งซื้อ
        const orderData = {
            menuId: orderSession.menuId,
            menuName: orderSession.menuData.name,
            menuPrice: Number(orderSession.menuData.price), // 🔧 แปลงเป็น number
            menuImage: orderSession.menuData.image_url,
            quantity: orderSession.quantity,
            sweetness: sweetness,
            totalPrice: Number(orderSession.menuData.price) * orderSession.quantity,
            userId: userId
        };


        // อัพเดทเซสชัน
        orderSession.orderData = orderData;
        orderSession.step = 'confirmation';
        pendingOrders.set(userId, orderSession);

        // ส่งหน้ายืนยันคำสั่งซื้อ
        return await createOrderConfirmationMessage(orderData);

    } catch (error) {
        console.error('Error handling sweetness selection:', error);
        return {
            type: 'text',
            text: 'เกิดข้อผิดพลาดในการเลือกความหวาน'
        };
    }
}

/**
 * จัดการการยืนยันคำสั่งซื้อ
 */
async function handleOrderConfirmation(userId, db) {
    try {
        const orderSession = pendingOrders.get(userId);

        if (!orderSession || orderSession.step !== 'confirmation') {
            return {
                type: 'text',
                text: 'เซสชันหมดอายุ กรุณาเลือกเมนูใหม่'
            };
        }

        const orderData = orderSession.orderData;

        // ตรวจสอบว่าผู้ใช้มีอยู่ในตาราง users หรือไม่
        const [userRows] = await db.query('SELECT * FROM users WHERE line_id = ?', [userId]);
        if (!userRows.length) {
            console.error(`User not found: ${userId}`);
            return {
                type: 'text',
                text: 'ไม่พบข้อมูลผู้ใช้ กรุณาสมัครสมาชิกก่อนสั่งซื้อ'
            };
        }

        // บันทึกคำสั่งซื้อลงฐานข้อมูล
        const [result] = await db.query(
            'INSERT INTO orders (user_id, menu_id, quantity, sweetness_level, total_price, status, order_date) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [userId, orderData.menuId, orderData.quantity, orderData.sweetness, orderData.totalPrice, 'pending']
        );

        // คำนวณแต้ม (สมมติว่า 1 แต้มต่อ 50 บาท)
        const pointsEarned = Math.floor(orderData.totalPrice / 50);

        // อัพเดทแต้มในตาราง users
        await db.query(
            'UPDATE users SET points = points + ? WHERE line_id = ?',
            [pointsEarned, userId]
        );

        // บันทึกประวัติแต้มในตาราง point_history
        await db.query(
            'INSERT INTO point_history (user_id, order_id, points_earned, description, created_at) VALUES (?, ?, ?, ?, NOW())',
            [userId, result.insertId, pointsEarned, `ได้รับ ${pointsEarned} แต้มจากการสั่งซื้อ ${orderData.menuName} (${orderData.quantity} แก้ว)`]
        );

        // ลบเซสชัน
        pendingOrders.delete(userId);

        // สร้างข้อความตอบกลับพร้อมแจ้งแต้ม
        const replyText = `✅ สั่งซื้อสำเร็จ!\n\n🍵 ${orderData.menuName}\n📦 จำนวน: ${orderData.quantity} แก้ว\n🍯 ความหวาน: ${orderData.sweetness}\n💰 ราคารวม: ฿${orderData.totalPrice.toFixed(2)}\n🎉 ได้รับ ${pointsEarned} แต้ม!\n\n📞 ติดต่อร้านเพื่อชำระเงินและรับสินค้า`;

        return {
            type: 'text',
            text: replyText
        };

    } catch (error) {
        console.error('Error confirming order:', error);
        return {
            type: 'text',
            text: 'เกิดข้อผิดพลาดในการยืนยันคำสั่งซื้อ'
        };
    }
}

/**
 * จัดการการยกเลิกคำสั่งซื้อ
 */
async function handleOrderCancel(userId) {
    pendingOrders.delete(userId);
    return {
        type: 'text',
        text: 'ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว'
    };
}

/**
 * ตรวจสอบว่าข้อความเป็นคำสั่งซื้อหรือไม่
 */
function isOrderCommand(text) {
    return text.toLowerCase().startsWith('order ');
}

/**
 * ดึง menu ID จากข้อความ
 */
function extractMenuId(text) {
    const match = text.match(/order (\d+)/i);
    return match ? parseInt(match[1]) : null;
}

/**
 * ตรวจสอบว่าข้อความเป็นการเลือกจำนวนหรือไม่
 */
function isQuantitySelection(text) {
    return text.toLowerCase().startsWith('qty_');
}

/**
 * ดึงจำนวนจากข้อความ
 */
function extractQuantity(text) {
    const match = text.match(/qty_(\d+)/i);
    return match ? parseInt(match[1]) : null;
}

/**
 * ตรวจสอบว่าข้อความเป็นการเลือกความหวานหรือไม่
 */
function isSweetnessSelection(text) {
    return text.toLowerCase().startsWith('sweet_');
}

/**
 * ดึงระดับความหวานจากข้อความ
 */
function extractSweetness(text) {
    const match = text.match(/sweet_(.+)/i);
    return match ? match[1] : null;
}

/**
 * ตรวจสอบว่าข้อความเป็นการยืนยันคำสั่งซื้อหรือไม่
 */
function isOrderConfirm(text) {
    return text.toLowerCase() === 'confirm_order';
}

/**
 * ตรวจสอบว่าข้อความเป็นการยกเลิกคำสั่งซื้อหรือไม่
 */
function isOrderCancel(text) {
    return text.toLowerCase() === 'cancel_order';
}

/**
 * ทำความสะอาดเซสชันที่หมดอายุ (เรียกทุก 30 นาที)
 */
function cleanExpiredSessions() {
    const now = Date.now();
    const expirationTime = 30 * 60 * 1000; // 30 นาที

    for (const [userId, session] of pendingOrders.entries()) {
        if (now - session.timestamp > expirationTime) {
            pendingOrders.delete(userId);
        }
    }
}

// ทำความสะอาดเซสชันทุก 30 นาที
setInterval(cleanExpiredSessions, 30 * 60 * 1000);

module.exports = {
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
};