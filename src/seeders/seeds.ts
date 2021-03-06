import db from "../models";
import '../utils';

async function resetDB() {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sequelize.sync({ force: true });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    const mainMenu = await db.Menu.create({
        menuName: "Main Menu",
        Buttons: [
            {buttonName: "TestButton"}
        ]
    }, {
        include: ["Buttons"]
    });

    const user = await db.User.create({
        fullName: "testUser",
        accessCode: "0",
        username:"test",
        password:"test"
    });

    const globalConfig = await db.Config.create({
        data: {
            orderNumber: 1
        }
    });
}

resetDB();



