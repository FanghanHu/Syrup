import e, { Request, Response } from "express";
import { FindOptions, Includeable, Model } from "sequelize/types";
import db from "../models";
import { OrderAttributes } from "../models/order";
import { isTokeninvalid } from "../utils";
import { getNextOrderNumber } from "./config-controller";

/**
 * Get the order from database, respond to client when failed, and return null,
 * @returns the order or null.
 */
async function getOrderFromOrderId(req: Request, res: Response, options:Omit<FindOptions<OrderAttributes>, "where"> = {}) {
    const orderId = req.body.orderId;
    if(orderId === undefined || orderId === null) {
        res.status(400).send("You must provide an order id.");
        return null;
    }
    const order = await db.Order.findByPk(orderId, options);
    if(!order) {
        res.status(404).send(`Can not find order with id ${orderId} .`);
        return null;
    } else {
        return order;
    }
} 

/**
 * create a new order
 * client can optionally provide an order number, if not provided, server will assign one from config.
 */
export async function createOrder(req:Request, res:Response) {
    if(isTokeninvalid(req, res)) return;

    //client provided order type
    const type = req.body.type;
    
    try {
        //check for optional orderNumber
        let orderNumber = req.body.orderNumber;
        if(!orderNumber) {
            orderNumber = "#" + await getNextOrderNumber();
        }

        //create a NEW order
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

/**
 * This function handles creating and editing of orderItems and orderModifiers
 * 
 * Client request should include a login token, the orderId, an array of orderItems.
 * In the array, existing orderItem should have an id, while new orderItem have no id.
 * OrderItem can contains orderModifiers, and orderModifiers are treated similarly as orderItems.
 * Upon success, an updated order is returned.
 * 
 * TODO: update order cache
 * 
 * TODO: add server side validation:
 * 1. client may send wrong orderItem Id, or wrong orderModifier Id, and it will modify wrong order.
 */
export async function editItems(req: Request, res: Response) {
    if(isTokeninvalid(req, res)) return;
    const t = await db.sequelize.transaction();
    //find and lock the order before edit is done.
    let order = await getOrderFromOrderId(req, res, {include: [{
        model: db.OrderItem as typeof Model,
        include: [{model:db.OrderModifier as typeof Model}]
    }], transaction: t, lock: true});
    if(!order) return;
    const orderItems = req.body.orderItems;
    if(!orderItems || !(orderItems instanceof Array)){
        return res.status(400).send("You need to provide an array of orderItems");
    }
    try{
        for(const orderItem of orderItems) {
            if(orderItem.id) {
                //update existing orderItem
                await db.OrderItem.update({...orderItem, id: undefined}, {where: {id: orderItem.id}, transaction: t});
                if(orderItem.orderModifiers){
                    for(const orderModifer of orderItem.OrderModifiers) {
                        //update modifiers
                        if(orderModifer.id) {
                            await db.OrderModifier.update({...orderModifer, id: undefined}, {where: {id: orderModifer.id}, transaction: t});
                        } else {
                            await db.OrderModifier.create(orderModifer, {transaction: t});
                        }
                    }
                }
            } else {
                //create a new orderItem
                await order.createOrderItem(orderItem, {include: ["OrderModifiers"], transaction: t});
            }
        }

        await t.commit();
        order = await getOrderFromOrderId(req, res, {include: [{
            model: db.OrderItem as typeof Model,
            include: [{model:db.OrderModifier as typeof Model}]
        }]});
        return res.status(200).json(order);
    } catch (err) {
        t.rollback();
        console.error(err);
        res.status(500).json(err);
    }
}