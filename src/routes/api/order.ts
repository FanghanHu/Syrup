import { Router } from "express";
import { createOrder, editItems } from "../../controllers/order-controller";

const router = Router();

router.post('/create', createOrder);
router.post('/edit-items', editItems);

module.exports = router;