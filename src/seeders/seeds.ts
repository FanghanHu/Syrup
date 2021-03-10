import db from "../models";

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
    const mainMenu = await db.Menu.create({
        id: 1,
        menuName: "Main Menu"
    });
    await db.Menu.create({
        id: 2,
        menuName: "Side Menu"
    });

    const button = await db.Button.create({
        buttonName: "Test"
    });
    await button.setMenu(mainMenu);

    const script = await db.Script.create({
        scriptName: "order item",
        data: {
            script: "test();"
        }
    })

    await button.setScript(script);

    const admin = await db.Role.create({
        roleName: "Admin",
    })

    //user
    const user = await db.User.create({
        fullName: "Default User",
        accessCode: "0",
        username:"admin",
        password:"admin"
    });

    await user.addRole(admin);

    //mock customers
    const johnDoe = await db.Customer.create({
        firstName: "John",
        lastName: "Doe",
        phone: "8321422567",
        address: "12345 westview dr",
        city: "Houston",
        state: "TX",
        zip: "77036",
        note: "Allergic to peanuts"
    });
    await db.Customer.create({
        firstName: "Jean",
        lastName: "Doe",
        note: "A regular"
    });

    //mock item
    const item = await db.Item.create({
        itemName: "Edamame",
        price: "4.25",
        tax: 0.0825,
        translation: {
            cn: "毛豆"
        }
    });
    await db.Item.create({
        itemName: "Ramen",
        price: "9.75",
        tax: 0.0825,
    });

    //mock Log
    await db.Log.create({
        type: "LOGIN",
        data: {
            timestamp: Date.now()
        },
        UserId: 1
    });

    //mock order
    const order = await db.Order.create({
        orderNumber: "Example",
        status: "OPEN",
        type: "To Go",
        ServerId: user.id,
    });

    await order.setCustomers([johnDoe]);

    const orderItem = await db.OrderItem.create({
        amount: 1,
        itemData: {
            itemName: "Edamame",
            price: "4.25",
            tax: 0.0825,
            translation: {
                cn: "毛豆"
            }
        },
        status: "ORDERED",
        ItemId: item.id
    });
    await order.addOrderItem(orderItem);

    const payment = await db.Payment.create({
        type: "CASH",
        amount: 10,
        status: "OPEN",
        ServerId: user.id
    })

    await order.addPayment(payment);

    const table = await db.Table.create({
        tableName: "T1",
        x: 10,
        y: 200
    });

    const tableArea = await db.TableArea.create({
        tableAreaName: "Dine in",
    });

    await tableArea.addTable(table);
}

resetDB();



