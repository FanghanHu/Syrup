import db from "../models";


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