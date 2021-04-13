import { Router } from "express";
import { getCompanyInfo, setCompanyInfo } from "../../controllers/config-controller";

const router = Router();

router.post('/set-company-info', setCompanyInfo);
router.post('/get-company-info', getCompanyInfo);

module.exports = router;