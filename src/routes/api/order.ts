import { Router } from "express";
import { createOrder, editItems, getOrder, updateOrderMeta } from "../../controllers/order-controller";

const router = Router();

router.post('/create', createOrder);
router.post('/edit-items', editItems);
router.post('/get', getOrder);
router.post('/update-meta', updateOrderMeta);

module.exports = router;