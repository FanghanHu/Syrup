import { Router } from "express";
import { createOrder, editItems, getOrder } from "../../controllers/order-controller";

const router = Router();

router.post('/create', createOrder);
router.post('/edit-items', editItems);
router.post('/get', getOrder);

module.exports = router;