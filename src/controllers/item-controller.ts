import { Request, Response } from "express";
import db from "../models";
import { catchError, isIdValid } from "../utils/helpers";
import { isTokeninvalid } from "../utils/login-token";



export const listItems = catchError(async (req:Request, res:Response) => {
    const items = await db.Item.findAll();
    return res.status(200).json(items);
});

export const getItem = catchError(async (req:Request, res:Response) => {
    if(!isIdValid(req, res)) return;
    const id = req.body.id;

    const item = await db.Item.findByPk(id);
    if(item) {
        return res.status(200).json(item);
    } else {
        return res.status(404).send(`Item with id ${id} not found.`);
    }
});

export const createItem = catchError(async (req:Request, res:Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;
    
    const itemData = req.body;
    const item = await db.Item.create(itemData);
    return res.status(200).json(item);
});

export const deleteItem = catchError(async (req:Request, res:Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;

    if(!isIdValid(req, res)) return;
    const id = req.body.id;

    await db.Item.destroy({where: {id}});
    return res.status(200).send("Done.");
});

export const updateItem = catchError(async (req: Request, res: Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;

    if(!isIdValid(req, res)) return;
    const item = req.body;
    await db.Item.update({...item, id: undefined},{where: {id: item.id}});
    return res.status(200).send("Done.");
});