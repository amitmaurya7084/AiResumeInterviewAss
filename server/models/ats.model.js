import mongoose from "mongoose";

const atsReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobDescription: { type: String, required: true },
    resumeName: { type: String },
    score: { type: Number, required: true },
    toolsTechnologies: [{ type: String }],
    structureSuggestions: { type: String },
    suggestions: { type: String },
    missingKeywords: [{ type: String }],
    reportUrl: { type: String }
}, { timestamps: true });

export default mongoose.model("AtsReport", atsReportSchema);
