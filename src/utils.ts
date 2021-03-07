export {};
import crypto from "crypto";
import { Request, Response } from "express";
import { confirmToken } from "./controllers/login-controller"

crypto.Hash

declare global {
    interface String {
      /**
       * Generate a hashcode in hexadecimal, using sha256.
       */
        sha256(): string;
    }
}

String.prototype.sha256 = function sha256() {
  return crypto.createHmac("SHA256", "userDefinedSecret").update(this as string).digest("hex");
}

/**
 * expect the request to contain userId and hash, check it with login-controller and see if the user is
 * already logged in, if not, send a 401 response.
 * @returns true if the user isn't logged in or the hash is invalid.
 */
export function isTokeninvalid(req: Request, res: Response) {
  const token = {
      userId: req.body.userId,
      hash: req.body.hash
  };
  if(!confirmToken(token.userId, token.hash)) {
      res.status(401).send("Access denied, Please login first.")
      return true;
  }
  return false;
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
    const id = req.body.id;
    if(id === undefined || id === null) {
        res.status(400).send("You must provide an id.");
        return false;
    }
    if(parseInt(id) != req.body.id) {
        res.status(400).send("Id must be an integer.");
        return false;
    }

    return true;
}

/**
 * accepts an async route handling method, wraps it and make it to pass error to next middleware
 */
export function catchError(cb:(req: Request, res: Response) => any) {
  return (req, res, next) => {
    cb(req, res).catch(next);
  };
}