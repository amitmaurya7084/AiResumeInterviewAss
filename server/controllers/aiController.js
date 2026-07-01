// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for uploading a resume to the database
// POST : /api/ai/upload-resume

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The description should be 1-2 sentences also highlighting key responsibilities and achievements,Use action verb and quantofiable result where posible. Make it ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for uploading a resume to the database
//POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please login again." });
    }

    if (!resumeText || resumeText.trim() === '') {
      return res.status(400).json({ message: "Resume text is required. Please upload a valid PDF file." });
    }
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Resume title is required." });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume.";
    const userPrompt = ` extract data from this resume: ${resumeText}
  Provide data in the following JSON format with no additional text before text before of after:
  professional_summary: { type: String, default: '' },
    skills: [{ type: String }],
    personal_info: {
        image: { type: String, default: '' },
        full_name: { type: String, default: '' },
        profession: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
    },
    experience: [
  {
    company: { type: String },
    position: { type: String },
    start_date: { type: String },
    end_date: { type: String },
    description: { type: String },
    is_current: { type: Boolean },
  }
],
project: [
  {
    name: { type: String },
    type: { type: String },
    description: { type: String },
  }
],
education: [
  {
    institution: { type: String },
    degree: { type: String },
    field: { type: String },
    graduation_date: { type: String },
    gpa: { type: String },
  }
],

  `;

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) {
      return res.status(500).json({ message: "AI service is not configured. Please contact administrator." });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });
    
    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
      return res.status(500).json({ message: "Failed to extract data from resume. Please try again." });
    }
    
    const extractedData = response.choices[0].message.content;
    let parsedData;
    try {
      parsedData = JSON.parse(extractedData);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return res.status(500).json({ message: "Failed to parse resume data. Please try again." });
    }
    
    const newResume = await Resume.create({ userId, title, ...parsedData });
    res.json({ resumeId: newResume._id });
  } catch (error) {
    console.error('Upload resume error:', error);
    if (error.status === 401) {
      return res.status(401).json({ message: "AI service authentication failed." });
    }
    res.status(400).json({ message: error.message || "Failed to upload resume. Please try again." });
  }
};
