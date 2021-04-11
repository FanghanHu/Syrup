import { Request, Response } from 'express';
import { closeBrowser, CreateNetworkPrinter } from 'htmltoescpos';
import { catchError } from '../utils/helpers';

export const testPrint = catchError(async (req: Request, res: Response) => {
    const {printerIp, targetUrl} = req.body;

    const printer = CreateNetworkPrinter(printerIp);
    printer.printUrl(targetUrl);
    closeBrowser();
    
    res.status(200).send("success")
});