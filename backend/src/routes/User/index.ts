import express from "express"; 
import { authUser } from "../../middlewares/auth";
import { delete_user_controller, get_user, set_push_notifications, update_payment_method, update_user_controller } from "./controllers/user-crud";
require("express-async-errors")


const router = express.Router();

router.get("/",authUser,get_user)
router.delete("/",authUser, delete_user_controller);
router.put("/push-notifications/token",authUser, set_push_notifications);
router.put("/payment-method",authUser, update_payment_method);
router.put("/",authUser, update_user_controller);



export default router; 