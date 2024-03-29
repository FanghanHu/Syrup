import generateSimpleCrudRouter from "../../controllers/simple-crud-controller";
import db from "../../models";

const router = require("express").Router();
const env = process.env.NODE_ENV || 'development';

router.use("/login", require("./login"));
router.use("/order", require("./order"));
router.use("/report", require("./report"));
router.use("/user", require("./user"));
router.use('/print', require("./print"));
router.use('/config', require("./config"));

router.use("/item", generateSimpleCrudRouter(db.Item));
router.use("/menu", generateSimpleCrudRouter(db.Menu));
router.use("/button", generateSimpleCrudRouter(db.Button));
router.use("/script", generateSimpleCrudRouter(db.Script));
router.use('/table', generateSimpleCrudRouter(db.Table));
router.use('/table-area', generateSimpleCrudRouter(db.TableArea));
router.use('/customer', generateSimpleCrudRouter(db.Customer));
router.use("/payment", generateSimpleCrudRouter(db.Payment));

//Handles all uncaught error by sending them to client
router.use((error: Error, req, res, next) => {
    if(env === 'development') {
        //devs get a stack trace
        return res.status(500).json(error.stack);
    } else {
        //clients get plain error message
        return res.status(500).json(error.toString());
    }
})

export default router;
