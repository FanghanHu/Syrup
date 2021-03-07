import { Request, Response } from "express";
import db from "../models";
import { catchError, isIdValid } from "../utils/helpers";
import { isTokeninvalid } from "../utils/login-token";

export const listModifiers = catchError(async (req: Request, res: Response) => {
    const modifiers = await db.Modifier.findAll();
    return res.status(200).json(modifiers);
});

export const getModifier = catchError(async (req:Request, res:Response) => {
    if(!isIdValid(req, res)) return;
    const id = req.body.id;

    const modifier = await db.Modifier.findByPk(id);
    if(modifier) {
        return res.status(200).json(modifier);
    } else {
        return res.status(404).send(`Modifier with id ${id} not found.`);
    }
});

export const createModifier = catchError(async (req:Request, res:Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;
    
    const modifierData = req.body;
    const modifier = await db.Modifier.create(modifierData);
    return res.status(200).json(modifier);
});

export const deleteModifier = catchError(async (req:Request, res:Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;

    if(!isIdValid(req, res)) return;
    const id = req.body.id;

    await db.Modifier.destroy({where: {id}});
    return res.status(200).send("Done.");
});

export const updateModifier = catchError(async (req: Request, res: Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;
    const ServerId = req.body.userId;

    if(!isIdValid(req, res)) return;
    const modifier = req.body;
    await db.Modifier.update({...modifier, id: undefined},{where: {id: modifier.id}});
    return res.status(200).send("Done.");
});