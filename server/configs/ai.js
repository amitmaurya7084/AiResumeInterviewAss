import OpenAI from "openai";

const config = {
    apiKey: process.env.OPENAI_API_KEY
};

// Only set baseURL if it's provided (for custom OpenAI-compatible APIs)
if (process.env.OPENAI_BASE_URL) {
    config.baseURL = process.env.OPENAI_BASE_URL;
}

const ai = new OpenAI(config);

export default ai