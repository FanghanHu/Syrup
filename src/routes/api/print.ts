import { Router } from "express";
import { testPrint } from "../../controllers/print-controller";

const router = Router();

router.post('/test', testPrint);

module.exports = router;