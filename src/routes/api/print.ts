import { Router } from "express";
import { printReceipt, testPrint } from "../../controllers/print-controller";

const router = Router();

router.post('/test', testPrint);
router.post('/receipt', printReceipt);

module.exports = router;