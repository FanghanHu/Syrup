import { Request, Response } from "express";
import db from "../models";
import { catchError } from "../utils/helpers";

/**
 * 
 * @param config 
 * @returns 
 */
export async function getGlobalConfig(config?: any) {
    const results = await db.Config.findOne({where: {
        UserId: null,
    }, ...config});

    return results;
}

/**
 * This function reads from global config -> data -> orderNumber.
 * If a number is found, it is returned and updated to the next number.
 * @returns the next order number or undefined
 */
export async function getNextOrderNumber() {
    const t = await db.sequelize.transaction();
    let orderNumber;

    try {
        const globalConfig = await getGlobalConfig({
            transaction: t,
            lock: true
        });
        orderNumber = globalConfig.data?.orderNumber;
        if(orderNumber) {
            //update order number
            let nextOrderNumber = parseInt(orderNumber) + 1;
            await db.sequelize.query('UPDATE configs SET data = JSON_SET(data, "$.orderNumber", ?) WHERE UserId is NULL', 
            {
                replacements: [nextOrderNumber],
                transaction: t
            })
        }
        await t.commit();
        return orderNumber;
    } catch (err) {
        await t.rollback();
        throw err;
    }
}


/**
 * set comanyInfo field in the global config
 */
export const setCompanyInfo = catchError(async (req: Request, res: Response) => {
    //only allow these fields in companyInfo
    const {name, address, city, state, zip, phone} = req.body;
    const companyInfo = {name, address, city, state, zip, phone};

    await db.sequelize.query(`UPDATE configs SET data = JSON_SET(data, "$.companyInfo", CAST(? AS JSON)) WHERE UserId is NULL`, {
        replacements: [JSON.stringify(companyInfo)]
    });

    return res.status(200).send("success");
});

export const getCompanyInfo = catchError(async (req: Request, res: Response) => {
    const globalConfig = await getGlobalConfig();
    return res.status(200).json(globalConfig.data.companyInfo);
});