async function createMenuFlexMessage(text, db, event) {
    const [rows] = await db.query('SELECT id, name, price, image_url, category FROM menu');

    if (rows.length === 0) {
        return {
            type: 'text',
            text: 'No menu is available in the system.',
        };
    }

    const categories = {
        Coffee: { name: 'Coffee', icon: '☕', items: [] },
        Tea: { name: 'Tea', icon: '🍵', items: [] },
        Milk: { name: 'Milk', icon: '🥛', items: [] }
    };

    rows.forEach(item => {
        if (categories[item.category]) {
            categories[item.category].items.push(item);
        }
    });

    const bubbles = Object.entries(categories)
        .filter(([_, cat]) => cat.items.length > 0)
        .map(([category, cat]) => ({
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: `${cat.icon} ${cat.name}`,
                        weight: "bold",
                        size: "xl",
                        color: "#4A2F27",
                        align: "center"
                    },
                    {
                        type: "text",
                        text: `A flavor of ${cat.name.toLowerCase()} crafted just for you.`,
                        size: "xs",
                        color: "#8B5E3C",
                        align: "center",
                        margin: "sm"
                    }
                ],
                backgroundColor: "#FFF8E7",
                paddingAll: "lg",
                paddingTop: "xl"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "separator",
                        margin: "md",
                        color: "#D9C2A6"
                    },
                    ...cat.items.slice(0, 5).map(item => ({
                        type: "box",
                        layout: "vertical",
                        margin: "md",
                        backgroundColor: "#F5E6CC",
                        paddingAll: "md",
                        contents: [
                            {
                                type: "box",
                                layout: "horizontal",
                                spacing: "sm",
                                contents: [
                                    {
                                        type: "image",
                                        url: item.image_url,
                                        size: "md",
                                        aspectRatio: "4:3",
                                        aspectMode: "cover",
                                        flex: 3
                                    },
                                    {
                                        type: "box",
                                        layout: "vertical",
                                        contents: [
                                            {
                                                type: "box",
                                                layout: "horizontal",
                                                contents: [
                                                    {
                                                        type: "text",
                                                        text: item.name,
                                                        weight: "bold",
                                                        size: "md",
                                                        color: "#4A2F27",
                                                        wrap: true,
                                                        flex: 4
                                                    },
                                                    {
                                                        type: "text",
                                                        text: cat.icon,
                                                        size: "sm",
                                                        color: "#E8B923",
                                                        align: "end"
                                                    }
                                                ],
                                                margin: "sm"
                                            },
                                            {
                                                type: "text",
                                                text: `฿${Number(item.price).toFixed(2)}`,
                                                size: "sm",
                                                color: "#8B5E3C",
                                                wrap: true
                                            }
                                        ],
                                        flex: 5
                                    }
                                ]
                            },
                            {
                                type: "button",
                                action: {
                                    type: "message",
                                    label: "Order Now",
                                    text: `order ${item.id}`
                                },
                                style: "primary",
                                color: "#E8B923",
                                height: "sm",
                                margin: "md"
                            }
                        ]
                    }))
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
                            label: "View All Menu",
                            text: "menulist_all"
                        },
                        style: "secondary",
                        color: "#D9C2A6",
                        height: "sm"
                    }
                ],
                backgroundColor: "#F8F1E9",
                paddingAll: "md"
            },
            styles: {
                header: {
                    separator: true,
                    separatorColor: "#D9C2A6"
                },
                body: {
                    separator: true,
                    separatorColor: "#D9C2A6"
                }
            }
        }));

    if (text.trim().toLowerCase() === 'menulist_all') {
        bubbles.length = 0;
        const allItems = rows.slice(0, 10).map(item => ({
            type: "box",
            layout: "vertical",
            margin: "md",
            backgroundColor: "#F5E6CC",
            paddingAll: "md",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    spacing: "sm",
                    contents: [
                        {
                            type: "image",
                            url: item.image_url,
                            size: "md",
                            aspectRatio: "4:3",
                            aspectMode: "cover",
                            flex: 3
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "box",
                                    layout: "horizontal",
                                    contents: [
                                        {
                                            type: "text",
                                            text: `${item.name} (${categories[item.category]?.name || item.category})`,
                                            weight: "bold",
                                            size: "md",
                                            color: "#4A2F27",
                                            wrap: true,
                                            flex: 4
                                        },
                                        {
                                            type: "text",
                                            text: categories[item.category]?.icon || '✨',
                                            size: "sm",
                                            color: "#E8B923",
                                            align: "end"
                                        }
                                    ],
                                    margin: "sm"
                                },
                                {
                                    type: "text",
                                    text: `฿${Number(item.price).toFixed(2)}`,
                                    size: "sm",
                                    color: "#8B5E3C",
                                    wrap: true
                                }
                            ],
                            flex: 5
                        }
                    ]
                },
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "Order Now",
                        text: `order ${item.id}`
                    },
                    style: "primary",
                    color: "#E8B923",
                    height: "sm",
                    margin: "md"
                }
            ]
        }));

        bubbles.push({
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "✨ View All Menu",
                        weight: "bold",
                        size: "xl",
                        color: "#4A2F27",
                        align: "center"
                    },
                    {
                        type: "text",
                        text: "The flavor, specially crafted for you.",
                        size: "xs",
                        color: "#8B5E3C",
                        align: "center",
                        margin: "sm"
                    }
                ],
                backgroundColor: "#FFF8E7",
                paddingAll: "lg",
                paddingTop: "xl"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "separator",
                        margin: "md",
                        color: "#D9C2A6"
                    },
                    ...allItems
                ],
                backgroundColor: "#F8F1E9",
                paddingAll: "lg",
                spacing: "sm"
            },
            styles: {
                header: {
                    separator: true,
                    separatorColor: "#D9C2A6"
                },
                body: {
                    separator: true,
                    separatorColor: "#D9C2A6"
                }
            }
        });
    }

    return {
        type: "flex",
        altText: "✨ Satyr Cafe",
        contents: {
            type: "carousel",
            contents: bubbles
        }
    };
}

module.exports = { createMenuFlexMessage };