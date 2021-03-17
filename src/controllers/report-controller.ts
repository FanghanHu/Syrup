import { Request, Response } from "express";
import { Op } from "sequelize";
import db from "../models";
import { Payment } from "../models/payment";
import { catchError } from "../utils/helpers";

export const settlement = catchError(async (req: Request, res: Response) => {
    let fromTime = req.body.fromTime?new Date(req.body.fromTime):new Date();
    let toTime = req.body.toTime?new Date(req.body.toTime):new Date();

    if(!req.body.fromTime) {
        fromTime.setHours(0, 0, 0, 0);
    }
    if(!req.body.toTime) {
        toTime.setHours(23, 59, 59, 999);
    }

    console.log(fromTime.toLocaleString());
    console.log(toTime.toLocaleString());

    const dateRange = {
        [Op.and]: [
            {
                createdAt: {[Op.gte]: fromTime}
            },
            {
                createdAt:{[Op.lte]: toTime}
            }
        ]
    }
    const data:any = {};
    const orders = await db.Order.findAll({where: {...dateRange}});
    data.orderCount = orders.length;
    data.dineInCount = 0;
    data.toGoCount = 0;
    data.pickupCount = 0;
    data.deliverCount = 0;
    data.subtotal = 0;
    data.tax = 0;
    data.total = 0;
    data.cash = 0;
    data.card = 0;

    for(const order of orders) {
        if(order.status === "PAID" || order.status === "OPEN") {
            //count orders
            switch(order.type) {
                case "Delivery" :
                    data.deliverCount++;
                break;
                case "Dine in":
                    data.dineInCount++;
                break;
                case "Pick up":
                    data.pickupCount++;
                break;
                case "To Go":
                    data.toGoCount ++;
                break;
            }

            //add total
            if(order?.cache?.subtotal) data.subtotal+=order.cache.subtotal;
            if(order?.cache?.tax) data.tax+=order.cache.tax;
            if(order?.cache?.total) data.total+=order.cache.total;
        }
    }

    const payments = await db.Payment.findAll({where: {...dateRange}});
    for(const payment of payments) {
        if(payment.status === "PAID") {
            switch(payment.type) {
                case "Cash":
                    data.cash += payment.amount;
                break;
                case "Card":
                    data.card += payment.amount;
                break;
            }
        }
    }

    res.json(data);
});