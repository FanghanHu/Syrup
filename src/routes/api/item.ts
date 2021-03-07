import { createItem, deleteItem, getItem, listItems, updateItem } from "../../controllers/item-controller";

const router = require("express").Router();
router.get('/list', listItems);
router.get('/get', getItem);
router.post('/create', createItem);
router.post('/delete', deleteItem);
router.post('/update', updateItem);
module.exports = router;