import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { askAi } from "../services/openRouter.services.js";
import AtsReport from "../models/ats.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeAts = async (req, res) => {

    try {

        // Check Resume File
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file required"
            });
        }

        // Check Job Description
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description required"
            });
        }

        const filepath = req.file.path;

        // Read PDF File
        const fileBuffer = await fs.promises.readFile(filepath);

        const uint8Array = new Uint8Array(fileBuffer);

        // Load PDF
        const pdf = await pdfjsLib.getDocument({

            data: uint8Array,

            standardFontDataUrl:
                path.join(
                    __dirname,
                    "../../node_modules/pdfjs-dist/standard_fonts/"
                ) + "/"

        }).promise;

        // Extract Resume Text
        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

            const page = await pdf.getPage(pageNum);

            const content = await page.getTextContent();

            const pageText = content.items
                .map(item => item.str)
                .join(" ");

            resumeText += pageText + "\n";
        }

        // Clean Resume Text
        resumeText = resumeText
            .replace(/\s+/g, " ")
            .trim();

        // AI Messages
        const messages = [

            {
                role: "system",

                content: `
You are an expert ATS (Applicant Tracking System) analyzer and resume reviewer.

Analyze the candidate's resume against the provided Job Description.

IMPORTANT:
Return ONLY valid JSON.
Do not use markdown.
Do not use \`\`\`json.
Do not add explanations.

Format:
{
  "score": number,
  "toolsTechnologies": ["string"],
  "structureSuggestions": "string",
  "suggestions": "string",
  "missingKeywords": ["string"]
}
`
            },

            {
                role: "user",

                content: `
Job Description:
${jobDescription}

Resume:
${resumeText}
`
            }
        ];

        // Ask AI
        const aiResponse = await askAi(messages);

        // Clean AI Response
        let cleanedResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let parsed;

        try {

            parsed = JSON.parse(cleanedResponse);

        } catch (error) {

            console.log("========== AI RAW RESPONSE ==========");
            console.log(aiResponse);
            console.log("=====================================");

            throw new Error("Invalid JSON received from AI");
        }

        // Delete Uploaded File
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        // Save ATS Report
        const newReport = await AtsReport.create({

            userId: req.userId,

            jobDescription,

            resumeName: req.file.originalname,

            score: parsed.score || 0,

            toolsTechnologies:
                parsed.toolsTechnologies || [],

            structureSuggestions:
                parsed.structureSuggestions || "",

            suggestions:
                parsed.suggestions || "",

            missingKeywords:
                parsed.missingKeywords || []
        });

        return res.status(200).json(newReport);

    } catch (error) {

        console.error("ATS Analysis error:", error);

        // Delete Uploaded File if Exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({

            message: "Error analyzing resume for ATS compatibility",

            error: error.message
        });
    }
};

export const getAtsHistory = async (req, res) => {

    try {

        const history = await AtsReport
            .find({ userId: req.userId })
            .sort({ createdAt: -1 });

        return res.status(200).json(history);

    } catch (error) {

        console.error("ATS History error:", error);

        return res.status(500).json({
            message: "Failed to fetch ATS history"
        });
    }
};