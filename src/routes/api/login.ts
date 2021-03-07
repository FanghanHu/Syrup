import { loginWithAccessCode, loginWithPassword } from "../../controllers/login-controller";

const router = require("express").Router();

router.route("/accesscode").post(loginWithAccessCode);
router.route("/password").post(loginWithPassword);

module.exports = router;