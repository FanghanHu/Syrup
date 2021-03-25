import { Router } from "express";
import { createUser, deleteUser, getUser, listUser, updateUser } from "../../controllers/user-controller";

const router = Router();

router.post('/list', listUser);
router.post('/get', getUser);
router.post('/create', createUser);
router.post('/update', updateUser);
router.post('/delete', deleteUser);

module.exports = router;