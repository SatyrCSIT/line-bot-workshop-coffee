const { createQuantitySelector, createSweetnessSelector, createOrderConfirmation } = require('./orderUIComponent');
const { usePoints, logPointUsage } = require('./pointComponent');
const db = require('./db');

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
async function createOrderConfirmationMessage(orderData, db) {
    return createOrderConfirmation(orderData, db);
}

/**
 * จัดการคำสั่งซื้อเมนู
 */
async function handleOrderRequest(menuId, db, userId) {
    try {
        const [menuRows] = await db.query('SELECT * FROM menu WHERE id = ?', [menuId]);

        if (menuRows.length === 0) {
            return {
                type: 'text',
                text: 'ไม่พบเมนูที่ระบุ'
            };
        }

        const menuData = menuRows[0];

        const orderSession = {
            menuId: menuId,
            menuData: menuData,
            userId: userId,
            step: 'quantity',
            timestamp: Date.now()
        };

        pendingOrders.set(userId, orderSession);

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

        // ตรวจสอบว่า quantity เป็นตัวเลขและมากกว่า 0
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return {
                type: 'text',
                text: 'กรุณากรอกจำนวนเป็นตัวเลขมากกว่า 0'
            };
        }

        orderSession.quantity = quantity;
        orderSession.step = 'sweetness';
        pendingOrders.set(userId, orderSession);

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
async function handleSweetnessSelection(userId, sweetness, db) {
    try {
        const orderSession = pendingOrders.get(userId);

        if (!orderSession || orderSession.step !== 'sweetness') {
            return {
                type: 'text',
                text: 'เซสชันหมดอายุ กรุณาเลือกเมนูใหม่'
            };
        }

        const orderData = {
            menuId: orderSession.menuId,
            menuName: orderSession.menuData.name,
            menuPrice: Number(orderSession.menuData.price),
            menuImage: orderSession.menuData.image_url,
            quantity: orderSession.quantity,
            sweetness: sweetness,
            totalPrice: Number(orderSession.menuData.price) * orderSession.quantity,
            userId: userId
        };

        orderSession.orderData = orderData;
        orderSession.step = 'confirmation';
        pendingOrders.set(userId, orderSession);

        return await createOrderConfirmationMessage(orderData, db);

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
async function handleOrderConfirmation(userId, db, pointsToUse = 0) {
    try {
        const orderSession = pendingOrders.get(userId);

        if (!orderSession || orderSession.step !== 'confirmation') {
            return {
                type: 'text',
                text: 'เซสชันหมดอายุ กรุณาเลือกเมนูใหม่'
            };
        }

        const orderData = orderSession.orderData;

        const [userRows] = await db.query('SELECT * FROM users WHERE line_id = ?', [userId]);
        if (!userRows.length) {
            return {
                type: 'text',
                text: 'ไม่พบข้อมูลผู้ใช้ กรุณาสมัครสมาชิกก่อนสั่งซื้อ'
            };
        }

        let finalPrice = orderData.totalPrice;
        let pointsUsed = 0;
        let remainingPoints = userRows[0].points;

        // จัดการการใช้แต้ม
        if (pointsToUse > 0) {
            const pointResult = await usePoints(userId, orderData.totalPrice, pointsToUse);
            if (!pointResult.success) {
                return {
                    type: 'text',
                    text: pointResult.message
                };
            }
            pointsUsed = pointResult.pointsUsed;
            finalPrice = pointResult.finalPrice;
            remainingPoints = pointResult.remainingPoints;
        }

        const [result] = await db.query(
            'INSERT INTO orders (user_id, menu_id, quantity, sweetness_level, total_price, points_used, status, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [userId, orderData.menuId, orderData.quantity, orderData.sweetness, finalPrice, pointsUsed, 'pending']
        );

        // คำนวณแต้มที่ได้รับ (1 แต้มต่อ 50 บาทของราคาที่ต้องชำระจริง)
        const pointsEarned = Math.floor(finalPrice / 50);

        // อัพเดทแต้มในตาราง users
        await db.query(
            'UPDATE users SET points = points + ? WHERE line_id = ?',
            [pointsEarned, userId]
        );

        // บันทึกประวัติแต้ม (แต้มที่ได้รับ)
        await db.query(
            'INSERT INTO point_history (user_id, order_id, points_earned, description, created_at) VALUES (?, ?, ?, ?, NOW())',
            [userId, result.insertId, pointsEarned, `ได้รับ ${pointsEarned} แต้มจากการสั่งซื้อ ${orderData.menuName} (${orderData.quantity} แก้ว)`]
        );

        // บันทึกประวัติการใช้แต้ม (ถ้ามี)
        if (pointsUsed > 0) {
            await logPointUsage(
                userId,
                result.insertId,
                pointsUsed,
                `ใช้ ${pointsUsed} แต้มสำหรับการสั่งซื้อ ${orderData.menuName} (${orderData.quantity} แก้ว)`
            );
        }

        pendingOrders.delete(userId);

        // สร้างข้อความตอบกลับพร้อมแจ้งแต้ม
        const replyText = `✅ สั่งซื้อสำเร็จ!\n\n` +
            `🍵 ${orderData.menuName}\n` +
            `📦 จำนวน: ${orderData.quantity} แก้ว\n` +
            `🍯 ความหวาน: ${orderData.sweetness}\n` +
            `${pointsUsed > 0 ? `🎯 ใช้แต้ม: ${pointsUsed} แต้ม\n` : ''}` +
            `💰 ราคารวม: ฿${finalPrice.toFixed(2)}\n` +
            `🎉 ได้รับ ${pointsEarned} แต้ม!\n` +
            `🎯 แต้มคงเหลือ: ${remainingPoints + pointsEarned} แต้ม\n\n` +
            `📞 รอชำระเงินและรอรับสินค้า`;

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
    return text.toLowerCase().startsWith('จำนวน');
}

/**
 * ดึงจำนวนจากข้อความ
 */
function extractQuantity(text) {
    const match = text.match(/จำนวน\s*(\d+)\s*เเก้ว/i);
    return match ? parseInt(match[1]) : null;
}

/**
 * ตรวจสอบว่าข้อความเป็นการเลือกความหวานหรือไม่
 */
function isSweetnessSelection(text) {
    return text.toLowerCase().startsWith('หวาน');
}

/**
 * ดึงระดับความหวานจากข้อความ
 */
function extractSweetness(text) {
    const match = text.match(/หวาน(.+)/i);
    return match ? match[1] : null;
}

/**
 * ตรวจสอบว่าข้อความเป็นการยืนยันคำสั่งซื้อหรือการใช้แต้ม
 */
function isOrderConfirm(text) {
    return text.toLowerCase() === 'ยืนยันออเดอร์' || text.toLowerCase().startsWith('ใช้แต้ม');
}

/**
 * ดึงจำนวนแต้มที่ต้องการใช้จากข้อความ
 */
function extractPointsToUse(text) {
    const match = text.match(/ใช้แต้ม\s*(\d+)/i);
    return match ? parseInt(match[1]) : 0;
}

/**
 * ตรวจสอบว่าข้อความเป็นการยกเลิกคำสั่งซื้อหรือไม่
 */
function isOrderCancel(text) {
    return text.toLowerCase() === 'ยกเลิกออเดอร์';
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
    extractPointsToUse,
    isOrderCancel
};