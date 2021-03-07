const router = require("express").Router();
const env = process.env.NODE_ENV || 'development';

router.use("/login", require("./login"));
router.use("/order", require("./order"));
router.use("/item", require("./item"));
router.use("/modifier", require("./modifier"));

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
