import { Sequelize } from "sequelize/types";
import db from "../models";


export async function getGlobalConfig(config?: any) {
    const results = await db.Config.findOne({where: {
        UserId: null,
    }, ...config});

    return results;
}

export async function getNextOrderNumber() {
    const t = await db.sequelize.transaction();
    let orderNumber;

    try {
        const globalConfig = await getGlobalConfig({
            transaction: t,
            lock: true
        });

        orderNumber = globalConfig.data?.orderNumber;
        console.log(`orderNumber ${orderNumber}`);
        

        if(orderNumber) {
            //update order number
            let nextOrderNumber = parseInt(orderNumber) + 1;
            console.log(nextOrderNumber);
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