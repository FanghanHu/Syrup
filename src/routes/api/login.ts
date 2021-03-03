import loginController from "../../controllers/loginController";

const router = require("express").Router();

router.route("/accesscode").post(loginController.loginWithAccessCode);
router.route("/password").post(loginController.loginWithPassword);

module.exports = router;