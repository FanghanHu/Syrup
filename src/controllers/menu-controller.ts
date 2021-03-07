import { Request, Response } from "express";
import db from "../models";
import { catchError, isIdValid } from "../utils/helpers";
import { isTokeninvalid } from "../utils/login-token";

export const listMenus = catchError(async (req:Request, res:Response) => {
    const menus = await db.Menu.findAll();
    return res.status(200).json(menus);
});

export const getMenu = catchError(async (req:Request, res:Response) => {
    if(!isIdValid(req, res)) return;
    const id = req.body.id;

    const menu = await db.Menu.findByPk(id);
    if(menu) {
        return res.status(200).json(menu);
    } else {
        return res.status(404).send(`Menu with id ${id} not found.`);
    }
});

export const createMenu = catchError(async (req:Request, res:Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;
    
    const menuData = req.body;
    const menu = await db.Menu.create(menuData);
    return res.status(200).json(menu);
});

export const deleteMenu = catchError(async (req:Request, res:Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;

    if(!isIdValid(req, res)) return;
    const id = req.body.id;

    await db.Menu.destroy({where: {id}});
    return res.status(200).send("Done.");
});

export const updateMenu = catchError(async (req: Request, res: Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;

    if(!isIdValid(req, res)) return;
    const menu = req.body;
    await db.Menu.update({...menu, id: undefined},{where: {id: menu.id}});
    return res.status(200).send("Done.");
});