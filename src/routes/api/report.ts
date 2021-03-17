import { Router } from "express";
import { settlement } from "../../controllers/report-controller";

const router = Router();

router.post('/settlement', settlement);

module.exports = router;