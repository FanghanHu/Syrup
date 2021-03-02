import db from "../models";

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

    const btn = await db.Button.create(
        {
            buttonName: "reverseCreate",
            Menu: {
                menuName: "test Menu"
            }
        },
        {
            include: ["Menu"]
        }
    )
}

resetDB();