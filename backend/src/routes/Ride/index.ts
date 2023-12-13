import express from "express"; 
import {  authDriver, authUser } from "../../middlewares/auth";
import { get_ride_controller, get_rides_controller, get_vicinity_rides_for_driver } from "./controllers/get-rides";
import { accept_ride_controller, cancel_ride_controller, start_ride_controller, end_ride_controller } from "./controllers/ride-status";
import { add_ride_controller } from "./controllers/add-ride";
import {  validate_stripe_payment_intent } from "./controllers/validate-ride-payment-intent";
import { change_ride_payment_method } from "./controllers/change-ride-payment-method";
import { get_ride_costs } from "./controllers/ride-costs";
import { refund_ride } from "./controllers/refund-ride";
require("express-async-errors")


const router = express.Router();

router.put("/",authUser,get_rides_controller)//?
router.get("/ride/costs",get_ride_costs)//?
router.put("/nearby",authUser,authDriver,get_vicinity_rides_for_driver)//!
router.get("/:id",authUser,get_ride_controller)//?
router.post("/new",authUser,add_ride_controller)//!
router.put("/ride/payment/validate/payment-intent/:id",authUser,validate_stripe_payment_intent)//?
router.put("/ride/payment/method/change/:id",authUser,change_ride_payment_method)//?
router.put("/ride/cancel/:id",authUser,cancel_ride_controller)//?
router.put("/ride/refund/:id",authUser,refund_ride)//?
//!Driver 
router.put("/ride/accept/:id",authUser,authDriver,accept_ride_controller)
router.put("/ride/start/:id",authUser,authDriver,start_ride_controller)
router.put("/ride/end/:id",authUser,authDriver,end_ride_controller)

export default router; 