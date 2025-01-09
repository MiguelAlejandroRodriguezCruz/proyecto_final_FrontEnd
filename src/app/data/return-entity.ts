export interface Return {
    estado: number,
    msg: string,
    return: {
        id?: number,
        user: string,
        order_id: number,
        product_id: number,
        return_date: Date,
        reason: string
    },
    links: [
        {
            rel: string,
            href: string
        }
    ]
}