import db from "../models";
import { Menu } from "../models/menu";

async function resetDB() {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sequelize.sync({ force: true });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    //allow automatically set order number
    const globalConfig = await db.Config.create({
        data: {
            orderNumber: 1
        }
    });

    //create a main menu with a test button
    await db.Menu.create({
        id: 1,
        menuName: "Main Menu"
    });
    await db.Menu.create({
        id: 2,
        menuName: "Side Menu"
    });

    await db.Script.create({
        scriptName: "Order Item",
        data: {
            parameters: {
                itemData: "Order an item"
            },
            script: `
                orderItem(%itemData%);
            `
        }
    });

    await db.Script.create({
        scriptName: "Order modifier",
        data: {
            parameters: {
                itemData: "Order the item as a modifier"
            },
            script: `
                orderModifier(%itemData%);
            `
        }
    });

    //user
    const user = await db.User.create({
        fullName: "Boss",
        accessCode: "0",
        username:"thebestboss",
        password:"thebestboss"
    });

    const table = await db.Table.create({
        tableName: "T1",
        x: 10,
        y: 10
    });

    const tableArea = await db.TableArea.create({
        tableAreaName: "Dine in",
    });

    await tableArea.addTable(table);
}

resetDB();



