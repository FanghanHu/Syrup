import { createModifier, deleteModifier, getModifier, listModifiers, updateModifier } from "../../controllers/modifier-controller";

const router = require("express").Router();
router.get('/list', listModifiers);
router.get('/get', getModifier);
router.post('/create', createModifier);
router.post('/delete', deleteModifier);
router.post('/update', updateModifier);

module.exports = router;