const pdfParse=require("pdf-parse")
const generateInterviewReport= require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model")
/**
 * @description generate interview report on the basis of user self description , resume pdf and job description
 */

async function generateInterViewController(req,res){
    const resumeContent= await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription, jobDescription} = req.body

    const interViewReportByAi= await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
    })
    const interviewReport= await interviewReportModel.create({
        user:req.user.id,
        resume:resumeContent,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })
    res.status(201).json({
        message:"Interview report generated successfully",
        interviewReport
    })
}

/**
 * @description get a specific interview report by its ID
 */
async function getInterviewReportByIdController(req,res){
    const {interviewId}=req.params
    const interviewReport= await interviewReportModel.findOne({
        _id:interviewId,
        user:req.user.id
    })
    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }
    res.status(200).json({
        message:"Interview report found",
        interviewReport
    })
}

module.exports={generateInterViewController}