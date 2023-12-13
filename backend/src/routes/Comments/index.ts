

import express from "express"; 
import { authDriver, authUser } from "../../middlewares/auth";
import { comment_on_driver, delete_comment_on_driver, get_driver_comments, like_comment, unlike_comment } from "./controllers/comments";

require("express-async-errors")


const router = express.Router();

router.get("/driver/:driverId",authUser,get_driver_comments); //?
router.post("/new/driver/:driverId",authUser,comment_on_driver)//?
router.delete("/delete/:id",authUser,delete_comment_on_driver)//?
router.put("/like/:id",authUser,like_comment)
router.delete("/like/:id",authUser,unlike_comment)

export default router; 