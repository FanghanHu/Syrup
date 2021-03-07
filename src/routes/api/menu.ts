import { createMenu, deleteMenu, getMenu, listMenus, updateMenu } from "../../controllers/menu-controller";

const router = require("express").Router();
router.get('/list', listMenus);
router.get('/get', getMenu);
router.post('/create', createMenu);
router.post('/delete', deleteMenu);
router.post('/update', updateMenu);
module.exports = router;