const db = require('./db');

/**
 * ตรวจสอบและใช้แต้มสำหรับคำสั่งซื้อ
 * @param {string} userId - LINE ID ของผู้ใช้
 * @param {number} totalPrice - ราคารวมของคำสั่งซื้อ
 * @param {number} pointsToUse - จำนวนแต้มที่ต้องการใช้
 * @returns {Object} - ผลลัพธ์การใช้แต้ม
 */
async function usePoints(userId, totalPrice, pointsToUse) {
    try {
        // ดึงข้อมูลแต้มของผู้ใช้
        const [userRows] = await db.query('SELECT points FROM users WHERE line_id = ?', [userId]);
        if (!userRows.length) {
            return { success: false, message: 'ไม่พบข้อมูลผู้ใช้' };
        }

        const availablePoints = userRows[0].points;

        // ตรวจสอบว่าแต้มเพียงพอหรือไม่
        if (pointsToUse > availablePoints) {
            return { success: false, message: `แต้มไม่เพียงพอ คุณมี ${availablePoints} แต้ม` };
        }

        // ตรวจสอบว่าแต้มที่ใช้ไม่เกินราคารวม
        if (pointsToUse > totalPrice) {
            return { success: false, message: `ไม่สามารถใช้แต้มมากกว่าราคารวม (฿${totalPrice.toFixed(2)})` };
        }

        // อัพเดทแต้มในตาราง users
        await db.query('UPDATE users SET points = points - ? WHERE line_id = ?', [pointsToUse, userId]);

        // คำนวณราคาที่ต้องชำระหลังใช้แต้ม
        const finalPrice = totalPrice - pointsToUse;

        return {
            success: true,
            pointsUsed: pointsToUse,
            finalPrice: finalPrice,
            remainingPoints: availablePoints - pointsToUse
        };
    } catch (error) {
        console.error('Error using points:', error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการใช้แต้ม' };
    }
}

/**
 * บันทึกประวัติการใช้แต้ม
 * @param {string} userId - LINE ID ของผู้ใช้
 * @param {number} orderId - ID ของคำสั่งซื้อ
 * @param {number} pointsUsed - จำนวนแต้มที่ใช้
 * @param {string} description - รายละเอียดการใช้แต้ม
 */
async function logPointUsage(userId, orderId, pointsUsed, description) {
    try {
        await db.query(
            'INSERT INTO point_history (user_id, order_id, points_earned, points_used, description, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [userId, orderId, 0, pointsUsed, description]
        );
    } catch (error) {
        console.error('Error logging point usage:', error);
    }
}

module.exports = {
    usePoints,
    logPointUsage
};