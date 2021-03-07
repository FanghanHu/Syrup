import { Request, Response } from "express";
import { ModelCtor } from "sequelize/types";
import { catchError, isIdValid } from "../utils/helpers";
import { isTokeninvalid } from "../utils/login-token";

/**
 * Creates a router and a controller, where the client provide information to do simple CRUD operations
 * 
 * Errors are handled by next middleware.
 * 
 * This function takes a model, returns the router.
 */
export default function generateSimpleCrudRouter(model: any) {
    const router = require("express").Router();

    const controller = {
        list: catchError(async (req:Request, res:Response) => {
            const items = await model.findAll();
            return res.status(200).json(items);
        }),
        
        get: catchError(async (req:Request, res:Response) => {
            if(!isIdValid(req, res)) return;
            const id = req.body.id;
        
            const item = await model.findByPk(id);
            if(item) {
                return res.status(200).json(item);
            } else {
                return res.status(404).send(` with id ${id} not found.`);
            }
        }),
        
        create: catchError(async (req:Request, res:Response) => {
            //check client token
            if(isTokeninvalid(req, res)) return;
            const ServerId = req.body.userId;
            
            const itemData = req.body;
            const item = await model.create(itemData);
            return res.status(200).json(item);
        }),
        
        delete: catchError(async (req:Request, res:Response) => {
            //check client token
            if(isTokeninvalid(req, res)) return;
        
            if(!isIdValid(req, res)) return;
            const id = req.body.id;
        
            await model.destroy({where: {id}});
            return res.status(200).send("Done.");
        }),
        
        update: catchError(async (req: Request, res: Response) => {
            //check client token
            if(isTokeninvalid(req, res)) return;
        
            if(!isIdValid(req, res)) return;
            const item = req.body;
            await model.update({...item, id: undefined},{where: {id: item.id}});
            return res.status(200).send("Done.");
        })
    }

    router.get('/list', controller.list);
    router.get('/get', controller.get);
    router.post('/create', controller.create);
    router.post('/delete', controller.delete);
    router.post('/update', controller.update);

    return router;
}