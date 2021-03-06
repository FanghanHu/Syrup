const router = require("express").Router();

router.use("/login", require("./login"));
router.use("/order", require('./order'));

export default router;
