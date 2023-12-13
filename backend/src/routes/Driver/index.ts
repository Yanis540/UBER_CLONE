import express from "express"; 
import { authUser } from "../../middlewares/auth";
import {  get_driver, get_drivers_nearby, rate_driver, remove_driver_rating } from "./controllers/driver";

require("express-async-errors")


const router = express.Router();

router.put("/nearby",authUser,get_drivers_nearby); 
router.get("/:id",authUser,get_driver); 
router.put("/rate/:id",authUser,rate_driver); 
router.delete("/rate/:id",authUser,remove_driver_rating); 

export default router; 