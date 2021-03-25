import { Request, Response } from "express";
import db from "../models";
import { catchError, isIdValid } from "../utils/helpers";
import { isTokeninvalid } from "../utils/login-token";

export const listUser = catchError(async (req: Request, res: Response) => {
    const options = req.body.options;
    const users = await db.User.findAll(options);
    //redact password before sending it to the client
    const result = users.map(user => {
        const userJson:any = user.toJSON();
        if(userJson.password) {
            userJson.password = "REDACTED";
        }
        return userJson;
    });
    return res.status(200).json(result);
});

export const getUser = catchError(async (req: Request, res: Response) => {
    if(!isIdValid(req, res)) return;
    const id = req.body.data.id;
    const options = req.body.options;
    const user = await db.User.findByPk(id, options);
    if(user) {
        const userJson:any = user.toJSON();
        //redact password before sending it to the client
        if(userJson.password) {
            userJson.password = "REDACTED";
        }
        return res.status(200).json(userJson);
    } else {
        return res.status(404).send(`user with id ${id} not found.`);
    }
});

export const createUser = catchError(async (req: Request, res: Response) => {
    if(isTokeninvalid(req, res)) return;
    const options = req.body.options;
    const itemData = req.body.data;
    const item = await db.User.create(itemData, options);
    return res.status(200).json(item);
});

export const deleteUser = catchError(async (req: Request, res: Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;

    if(!isIdValid(req, res)) return;
    const id = req.body.data.id;
    const options = req.body.options;

    await db.User.destroy({where: {id}, ...options});
    return res.status(200).send("Done.");
});

export const updateUser = catchError(async (req: Request, res: Response) => {
    //check client token
    if(isTokeninvalid(req, res)) return;

    if(!isIdValid(req, res)) return;
    const item = req.body.data;
    const options = req.body.options;

    await db.User.update({...item, id: undefined},{where: {id: item.id}, ...options});
    return res.status(200).send("Done.");
});