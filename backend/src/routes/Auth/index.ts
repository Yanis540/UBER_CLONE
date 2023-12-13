import express from "express"; 
import { login_controller } from "./controllers/login-controller";
import { register_driver_controller, register_user_controller } from "./controllers/register-controller";
import { authAdmin, authGoogle, authUser } from "../../middlewares/auth";
import { login_google_controller } from "./controllers/login-google";
require("express-async-errors")


const router = express.Router();

router.post("/login",login_controller)
router.post("/login/provider/google",authGoogle,login_google_controller)
router.post("/register",register_user_controller)
router.post("/register/driver",authUser,authAdmin,register_driver_controller)



export default router; 