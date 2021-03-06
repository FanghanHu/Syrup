import { Request, Response } from "express";
import db from "../models";
import { getNextOrderNumber } from "./config-controller";
import { confirmToken } from "./login-controller";

export async function createOrder(req:Request, res:Response) {
    const token = {
        userId: req.body.userId,
        hash: req.body.hash
    };
    const type = req.body.type;
    
    if(confirmToken(token.userId, token.hash)) {
        try {
            let orderNumber = "#" + await getNextOrderNumber();

            const order = await db.Order.create({
                orderNumber,
                status: "NEW",
                type
            });
            return res.status(200).json(order);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}