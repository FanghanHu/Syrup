import { listItems } from "../../controllers/item-controller";

const router = require("express").Router();
router.get('/list', listItems);

module.exports = router;