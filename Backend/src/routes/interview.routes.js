const express= require("express");
const authMiddleware=require("../middlewares/auth.middleware")
const interviewRouter = express.Router()
const interviewController= require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")
/**
 * @route POST/api/interview/
 * @description generate new interview report on the basis of user self description , resume pdf anf job description 
 * @access private 
 */
interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterViewController)

/**
 * @route GET/api/interview/report/:interviewId
 * @description get a specific interview report by its ID
 * @access private
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportController)   



module.exports= interviewRouter