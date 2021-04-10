import { Request, Response } from 'express';
import escpos from 'htmltoescpos';
import { catchError } from '../utils/helpers';

export const testPrint = catchError(async (req: Request, res: Response) => {
    const {printerUrl, targetUrl} = req.body;

    const printer = new escpos.NetworkPrinter(printerUrl);
    await escpos.print(printer, targetUrl);
    await escpos.closeBrowser();
    res.status(200).send("success")
});