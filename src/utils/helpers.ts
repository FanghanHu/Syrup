import { Request, Response } from "express";

/**
 * accepts an async route handling method, wraps it and make it to pass error to next middleware
 */
export function catchError(cb:(req: Request, res: Response) => any) {
  return (req, res, next) => {
    cb(req, res).catch(next);
  };
}

export function requestPermission(res: Response, permission: string) {
  return res.status(401).send("Access denied, You need permission to " + permission + " .");
}

/**
 * check if client provided an valid id,
 * respond if not, return true if id is valid.
 * Does not query the id, so row may not exist.
 */
export function isIdValid(req:Request, res:Response) {
    const id = req.body.data.id;
    if(id === undefined || id === null) {
        res.status(400).send("You must provide an id.");
        return false;
    }
    if(parseInt(id) != req.body.data.id) {
        res.status(400).send("Id must be an integer.");
        return false;
    }

    return true;
}