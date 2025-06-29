async function createPromotionFlexMessage(db, event) {
    const today = new Date().toLocaleString('en-CA', { timeZone: 'Asia/Bangkok' }).slice(0, 10);
    const [rows] = await db.query(
        'SELECT title, description, image_url FROM promotions WHERE active = 1 AND start_date <= ? AND end_date >= ?',
        [today, today]
    );

    if (rows.length === 0) {
        return {
            type: 'text',
            text: 'ขณะนี้ไม่มีโปรโมชั่นพิเศษ',
        };
    }

    const bubbles = rows.map(promo => ({
        type: 'bubble',
        size: 'mega',
        header: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: '🎉 โปรโมชันพิเศษ',
                    weight: 'bold',
                    size: 'xl',
                    color: '#4A2F27',
                    align: 'center'
                },
                {
                    type: 'text',
                    text: promo.title,
                    size: 'md',
                    color: '#8B5E3C',
                    align: 'center',
                    margin: 'sm',
                    wrap: true
                }
            ],
            backgroundColor: '#FFF8E7',
            paddingAll: 'lg',
            paddingTop: 'xl'
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'image',
                    url: promo.image_url,
                    size: 'full',
                    aspectRatio: '4:3',
                    aspectMode: 'cover'
                },
                {
                    type: 'separator',
                    margin: 'md',
                    color: '#D9C2A6'
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'md',
                    paddingAll: 'md',
                    contents: [
                        {
                            type: 'text',
                            text: promo.description,
                            size: 'sm',
                            color: '#4A2F27',
                            wrap: true
                        }
                    ]
                }
            ],
            backgroundColor: '#F8F1E9',
            paddingAll: 'lg'
        },
        styles: {
            header: {
                separator: true,
                separatorColor: '#D9C2A6'
            },
            body: {
                separator: true,
                separatorColor: '#D9C2A6'
            }
        }
    }));

    return {
        type: 'flex',
        altText: '📢 โปรโมชันร้าน Satyr Cafe',
        contents: {
            type: 'carousel',
            contents: bubbles
        }
    };
}

module.exports = { createPromotionFlexMessage, createMenuFlexMessage };