const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the candidate and the job , it is a number between 0 and 100, where 100 means a perfect match and 0 means no match at all"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer asking this question"),
        answer: z.string().describe("How to answer this question, What points to cover,what approach to take etc.")
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer asking this question"),
        answer: z.string().describe("How to answer this question, What points to cover,what approach to take etc.")
    })).describe("Behavioral questions are asked to understand how you have handled situations in the past and how you might handle them in the future."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which candidate is lacking and is important for the job"),
        severity: z.enum(["low", "medium", "high"]).describe("How severe is the skill gap, low means its not a big issue and can be easily covered, high means its a critical issue and needs to be covered as soon as possible")
    })).describe("Skill gaps are the areas where the candidate lacks the necessary skills for the job"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day of preparation, starting from 1"),
        topic: z.string().describe("The topic to be covered on that day"),
        task: z.array(z.string()).describe("The tasks to be done on that day to cover the topic")
    })).describe("Preparation plan is a day-wise plan for the candidate to prepare for the interview, it is based on the skill gaps and the questions asked in the interview")
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt=`Generate an interview report for a candidate with the following details:
    Resume:${resume}
    Self Description:${selfDescription}
    Job Decription : ${jobDescription}`
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "",
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),

        },
    })
    
    return JSON.parse(response.text)
}


async function invokeGeminiAi() {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "Hello gemini! Explain what is Interview?"
            })
            console.log(response.text)
        }

module.exports = {invokeGeminiAi,generateInterviewReport}