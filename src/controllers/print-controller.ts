import e, { Request, Response } from 'express';
import { closeBrowser, CreateNetworkPrinter } from 'htmltoescpos';
import { catchError } from '../utils/helpers';

export const testPrint = catchError(async (req: Request, res: Response) => {
    const {printerIp, targetUrl} = req.body;

    const printer = CreateNetworkPrinter(printerIp);
    printer.printUrl(targetUrl);
    closeBrowser();
    
    res.status(200).send("success")
});

export const printReceipt = catchError(async (req: Request, res: Response) => {
    const { orderId } = req.body;

    if(orderId) {
        const printer = CreateNetworkPrinter("192.168.0.151");
        printer.printUrl("http://localhost:3000/receipt/" + orderId, {selector:"#receipt", waitForFunction:"window.receiptLoaded !== undefined && receiptLoaded"});
        res.status(200).send("success")
    } else {
        res.status(400).send("You must provide an orderId");
    }
});