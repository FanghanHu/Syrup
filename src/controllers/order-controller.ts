import e, { Request, Response } from "express";
import { Server } from "node:http";
import { FindOptions, Includeable, Model, Transaction } from "sequelize/types";
import db from "../models";
import { OrderAttributes } from "../models/order";
import { OrderItem } from "../models/order-item";
import { catchError } from "../utils/helpers";
import { isTokeninvalid } from "../utils/login-token";
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
 * recursively find all modifiers
 * 
 * Return a simple array of objects without sequelize functions,
 * objects are generated with toJSON from sequelize
 * @param orderItems 
 */
async function getParsedOrderItems(orderItems: OrderItem[]) {
    let parsedOrderItems:any[] = [];

    for(let i=0; i<orderItems.length; i++) {
        const orderItem = orderItems[i];
        //parse current item as a simple object and add it to the array
        let parsedOrderItem:any = orderItem.toJSON();
        parsedOrderItems.push(parsedOrderItem);

        let modifiers = await orderItem.getModifiers();
        if(modifiers && modifiers.length) {
            //found modifiers
            if(modifiers) {
                let parsedModfieirs = await getParsedOrderItems(modifiers);
                parsedOrderItem.Modifiers = parsedModfieirs;
            }
        }
    }

    return parsedOrderItems;
}

/**
 * return a parsed order object with all the orderitems and modifers
 * 
 * the returned order is parsed to a simple object, does not contain sequelize functions
 */
async function getParsedOrder(req:Request, res:Response, options:Omit<FindOptions<OrderAttributes>, "where"> = {}) {
    const order = await getOrderFromOrderId(req, res, {include: [{
        model: db.OrderItem as typeof Model
    }], ...options});

    let parsedOrder:any;
    if(order) {
        //parse the order so we can change the fields
        parsedOrder = order.toJSON();
        if(order.OrderItems) {
            //recursively get all modifier information filled in for the orderItems.
            const parsedOrderItems = await getParsedOrderItems(order.OrderItems);
            parsedOrder.OrderItems = parsedOrderItems;
        }
    }

    return parsedOrder;
}

/**
 * create a new order
 * client can optionally provide an order number, if not provided, server will assign one from config.
 */
export const createOrder = catchError(async (req:Request, res:Response) => {
    if(isTokeninvalid(req, res)) return;
    const userId = req.body.userId;

    //client provided order type
    const type = req.body.type;
    
    //check for optional orderNumber
    let orderNumber = req.body.orderNumber;
    if(!orderNumber) {
        orderNumber = "#" + await getNextOrderNumber();
    }

    //create a NEW order
    const order = await db.Order.create({
        orderNumber,
        status: "OPEN",
        type,
        ServerId: userId
    });
    return res.status(200).json(order);
});

export const getOrder = catchError(async (req: Request, res: Response) => {
    const options = req.body.options;
    const order = await getParsedOrder(req, res, options);
    if(order) {
        return res.status(200).json(order);
    }
});

export const listOrders = catchError(async (req: Request, res: Response) => {
    if(isTokeninvalid(req, res)) return;
    const options = req.body.options;
    const orders = await db.Order.findAll(options);
    return res.status(200).json(orders);
});

const updateItems = async (orderItems: any[], t: Transaction, serverId: number,  ParentId?: number) => {
    for(let orderItem of orderItems) {
        //loop through every item
        let id;
        if(orderItem.id) {
            //existing item
            await db.OrderItem.update({...orderItem, id: undefined, status: orderItem.status==="NEW"?"ORDERED":orderItem.status}, {where: {id: orderItem.id}, transaction: t});
            id = orderItem.id;
        } else {
            //new item
            const newItem = await db.OrderItem.create({...orderItem, ParentId: ParentId, ServerId: serverId, status: orderItem.status==="NEW"?"ORDERED":orderItem.status}, {transaction: t});
            id = newItem.id;
        }

        if(orderItem.Modifiers) {
            //if the new item have Modifiers
            await updateItems(orderItem.Modifiers, t, serverId, id);
        }
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
 * TODO: add logs
 * TODO: add server side validation:
 * 1. client may send wrong orderItem Id, or wrong orderModifier Id, and it will modify wrong order.
 */
export const editItems = catchError(async (req: Request, res: Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;

    //find and lock the order before edit is done.
    const t = await db.sequelize.transaction();
    let order = await getOrderFromOrderId(req, res, {include: [{
        model: db.OrderItem as typeof Model,
        include: [{
            association: "Modifiers"
        }]
    }], transaction: t, lock: true});
    if(!order) return;

    //check if client provided an OrderItems Array
    const orderItems = req.body.OrderItems;
    if(!orderItems || !(orderItems instanceof Array)){
        return res.status(400).send("You need to provide an array of orderItems");
    }
    try{
        await updateItems(orderItems, t, ServerId);
        await t.commit();

        let parsedOrder = await getParsedOrder(req, res);
        return res.status(200).json(parsedOrder);
    } catch (err) {
        await t.rollback();
        throw err;
    }
});

/**
 * updates table information and customers information related to an order.
 */
export const updateOrderMeta = catchError(async (req: Request, res:Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    
    const customers = req.body.customers;
    const table = req.body.table;
    const orderId = req.body.orderId;
    const cache = req.body.cache;
    const status = req.body.status;

    const t = await db.sequelize.transaction();
    try {
        //find and lock the order before edit is done.
        let order = await getOrderFromOrderId(req, res, {transaction: t, lock: true});
        if(!order) return;

        //update customers
        if(customers && customers.length) {
            for(const customer of customers) {
                if(customer.id) {
                    //customers in a order are expected to have an id
                    await order.addCustomer(customer.id, {transaction: t});
                }
            }
        }

        //update table
        if(table && table.id) {
            await order.setTable(table.id, {transaction: t});
        }

        if(cache) {
            order.cache = cache;
            await order.save({transaction: t});
        }

        if(status) {
            order.status = status;
            await order.save({transaction: t});
        }

        //commit
        await t.commit();

        //respond to client
        res.status(200).send("done");
    } catch (err) {
        await t.rollback();
        throw err;
    }
});