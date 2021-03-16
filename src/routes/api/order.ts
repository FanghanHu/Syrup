import { Router } from "express";
import { createOrder, editItems, getOrder, listOrders, updateOrderMeta } from "../../controllers/order-controller";

const router = Router();

router.post('/create', createOrder);
router.post('/edit-items', editItems);
router.post('/get', getOrder);
router.post('/update-meta', updateOrderMeta);
router.post('/list', listOrders);

module.exports = router;