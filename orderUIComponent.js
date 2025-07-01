/**
 * สร้าง Flex Message สำหรับเลือกจำนวน
 */
function createQuantitySelector(menuId, menuData) {
    return {
        type: "flex",
        altText: `เลือกจำนวน ${menuData.name}`,
        contents: {
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "🛒 เลือกจำนวน",
                        weight: "bold",
                        size: "xl",
                        color: "#4A2F27",
                        align: "center"
                    },
                    {
                        type: "text",
                        text: "จำนวนที่ต้องการสั่ง หรือพิมพ์ 'จำนวน X แก้ว' ",
                        size: "sm",
                        color: "#8B5E3C",
                        align: "center",
                        margin: "sm"
                    }
                ],
                backgroundColor: "#FFF8E7",
                paddingAll: "lg"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    // รูปภาพและข้อมูลเมนู
                    {
                        type: "box",
                        layout: "horizontal",
                        spacing: "md",
                        contents: [
                            {
                                type: "image",
                                url: menuData.image_url,
                                size: "sm",
                                aspectRatio: "1:1",
                                aspectMode: "cover",
                                flex: 2
                            },
                            {
                                type: "box",
                                layout: "vertical",
                                contents: [
                                    {
                                        type: "text",
                                        text: menuData.name,
                                        weight: "bold",
                                        size: "lg",
                                        color: "#4A2F27",
                                        wrap: true
                                    },
                                    {
                                        type: "text",
                                        text: `฿${Number(menuData.price).toFixed(2)}`,
                                        size: "md",
                                        color: "#E8B923",
                                        weight: "bold",
                                        margin: "sm"
                                    }
                                ],
                                flex: 3
                            }
                        ],
                        backgroundColor: "#F5E6CC",
                        paddingAll: "md",
                        cornerRadius: "md"
                    },
                    {
                        type: "separator",
                        margin: "lg",
                        color: "#D9C2A6"
                    },
                    // ปุ่มเลือกจำนวน
                    {
                        type: "text",
                        text: "เลือกจำนวน (1-6):",
                        weight: "bold",
                        size: "md",
                        color: "#4A2F27",
                        margin: "lg"
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        spacing: "sm",
                        margin: "md",
                        contents: [
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "1",
                                    text: "จำนวน 1 เเก้ว"
                                },
                                style: "primary",
                                color: "#E8B923",
                                flex: 1
                            },
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "2",
                                    text: "จำนวน 2 เเก้ว"
                                },
                                style: "primary",
                                color: "#E8B923",
                                flex: 1
                            },
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "3",
                                    text: "จำนวน 3 เเก้ว"
                                },
                                style: "primary",
                                color: "#E8B923",
                                flex: 1
                            }
                        ]
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        spacing: "sm",
                        margin: "sm",
                        contents: [
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "4",
                                    text: "จำนวน 4 เเก้ว"
                                },
                                style: "primary",
                                color: "#E8B923",
                                flex: 1
                            },
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "5",
                                    text: "จำนวน 5 เเก้ว"
                                },
                                style: "primary",
                                color: "#E8B923",
                                flex: 1
                            },
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "6",
                                    text: "จำนวน 6 เเก้ว"
                                },
                                style: "primary",
                                color: "#E8B923",
                                flex: 1
                            }
                        ]
                    }
                ],
                backgroundColor: "#F8F1E9",
                paddingAll: "lg",
                spacing: "sm"
            },
            footer: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "button",
                        action: {
                            type: "message",
                            label: "❌ ยกเลิก",
                            text: "ยกเลิกออเดอร์"
                        },
                        style: "secondary",
                        color: "#999999"
                    }
                ],
                backgroundColor: "#F8F1E9",
                paddingAll: "md"
            }
        }
    };
}

/**
 * สร้าง Flex Message สำหรับเลือกระดับความหวาน
 */
function createSweetnessSelector(menuId, quantity, menuData) {
    const totalPrice = menuData.price * quantity;

    return {
        type: "flex",
        altText: `เลือกความหวาน ${menuData.name}`,
        contents: {
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "🍯 เลือกความหวาน",
                        weight: "bold",
                        size: "xl",
                        color: "#4A2F27",
                        align: "center"
                    },
                    {
                        type: "text",
                        text: "กรุณาเลือกระดับความหวานที่ต้องการ",
                        size: "sm",
                        color: "#8B5E3C",
                        align: "center",
                        margin: "sm"
                    }
                ],
                backgroundColor: "#FFF8E7",
                paddingAll: "lg"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    // ข้อมูลที่เลือกแล้ว
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "text",
                                text: "รายการที่เลือก:",
                                weight: "bold",
                                size: "md",
                                color: "#4A2F27"
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: `🍵 ${menuData.name}`,
                                        size: "sm",
                                        color: "#8B5E3C",
                                        flex: 3
                                    },
                                    {
                                        type: "text",
                                        text: `${quantity} แก้ว`,
                                        size: "sm",
                                        color: "#E8B923",
                                        align: "end",
                                        flex: 1
                                    }
                                ],
                                margin: "sm"
                            },
                            {
                                type: "text",
                                text: `💰 ราคารวม: ฿${totalPrice.toFixed(2)}`,
                                size: "sm",
                                color: "#E8B923",
                                weight: "bold",
                                margin: "sm"
                            }
                        ],
                        backgroundColor: "#F5E6CC",
                        paddingAll: "md",
                        cornerRadius: "md"
                    },
                    {
                        type: "separator",
                        margin: "lg",
                        color: "#D9C2A6"
                    },
                    // ปุ่มเลือกความหวาน
                    {
                        type: "text",
                        text: "เลือกความหวาน:",
                        weight: "bold",
                        size: "md",
                        color: "#4A2F27",
                        margin: "lg"
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        spacing: "sm",
                        margin: "md",
                        contents: [
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "🧊 ไม่หวาน (0%)",
                                    text: "ไม่หวาน"
                                },
                                style: "secondary",
                                color: "#B8860B"
                            },
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "🍯 หวานน้อย (25%)",
                                    text: "หวานน้อย"
                                },
                                style: "secondary",
                                color: "#DAA520"
                            },
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "🍯🍯 หวานปกติ (50%)",
                                    text: "หวานปกติ"
                                },
                                style: "primary",
                                color: "#E8B923"
                            },
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "🍯🍯🍯 หวานมาก (75%)",
                                    text: "หวานมาก"
                                },
                                style: "secondary",
                                color: "#FF8C00"
                            },
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "🍯🍯🍯🍯 หวานจัด (100%)",
                                    text: "หวานจัด"
                                },
                                style: "secondary",
                                color: "#FF6347"
                            }
                        ]
                    }
                ],
                backgroundColor: "#F8F1E9",
                paddingAll: "lg",
                spacing: "sm"
            },
            footer: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "button",
                        action: {
                            type: "message",
                            label: "❌ ยกเลิก",
                            text: "ยกเลิกออเดอร์"
                        },
                        style: "secondary",
                        color: "#999999"
                    }
                ],
                backgroundColor: "#F8F1E9",
                paddingAll: "md"
            }
        }
    };
}

/**
 * สร้าง Flex Message สำหรับยืนยันคำสั่งซื้อ
 */
async function createOrderConfirmation(orderData, db) {
    const [userRows] = await db.query('SELECT points FROM users WHERE line_id = ?', [orderData.userId]);
    const availablePoints = userRows.length ? userRows[0].points : 0;

    return {
        type: "flex",
        altText: `ยืนยันคำสั่งซื้อ ${orderData.menuName}`,
        contents: {
            type: "bubble",
            size: "kilo",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "✅ ยืนยันคำสั่งซื้อ",
                        weight: "bold",
                        size: "lg",
                        color: "#4A2F27",
                        align: "center"
                    }
                ],
                backgroundColor: "#FFF8E7",
                paddingAll: "md"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "image",
                        url: orderData.menuImage,
                        size: "full",
                        aspectRatio: "4:3",
                        aspectMode: "cover"
                    },
                    {
                        type: "separator",
                        margin: "md",
                        color: "#D9C2A6"
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "text",
                                text: `🍵 ${orderData.menuName}`,
                                size: "md",
                                color: "#4A2F27",
                                weight: "bold"
                            },
                            {
                                type: "text",
                                text: `📦 ${orderData.quantity} แก้ว`,
                                size: "sm",
                                color: "#4A2F27"
                            },
                            {
                                type: "text",
                                text: `🍯 ความหวาน: ${orderData.sweetness}`,
                                size: "sm",
                                color: "#4A2F27"
                            },
                            {
                                type: "text",
                                text: `💰 ราคารวม: ฿${orderData.totalPrice.toFixed(2)}`,
                                size: "md",
                                color: "#E8B923",
                                weight: "bold"
                            },
                            {
                                type: "text",
                                text: `🎯 แต้มที่มี: ${availablePoints} แต้ม`,
                                size: "sm",
                                color: "#4A2F27",
                                margin: "sm"
                            }
                        ],
                        paddingAll: "md"
                    }
                ],
                backgroundColor: "#F8F1E9"
            },
            footer: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "button",
                        action: {
                            type: "message",
                            label: "✅ ยืนยัน (ไม่ใช้แต้ม)",
                            text: "ยืนยันออเดอร์"
                        },
                        style: "primary",
                        color: "#E8B923",
                        margin: "md"
                    },
                    ...(availablePoints > 0 ? [
                        {
                            type: "button",
                            action: {
                                type: "message",
                                label: `🎯 ใช้แต้ม (${Math.min(availablePoints, orderData.totalPrice)} แต้ม)`,
                                text: `ใช้แต้ม ${Math.min(availablePoints, orderData.totalPrice)}`
                            },
                            style: "primary",
                            color: "#32CD32",
                            margin: "sm"
                        }
                    ] : []),
                    {
                        type: "button",
                        action: {
                            type: "message",
                            label: "❌ ยกเลิก",
                            text: "ยกเลิกออเดอร์"
                        },
                        style: "secondary",
                        color: "#999999",
                        margin: "sm"
                    }
                ],
                spacing: "lg",
                backgroundColor: "#F8F1E9",
                paddingAll: "md"
            }
        }
    };
}

module.exports = {
    createQuantitySelector,
    createSweetnessSelector,
    createOrderConfirmation
};