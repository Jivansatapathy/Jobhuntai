import { GoogleGenAI, Type } from "@google/genai";
import { Resume, ATSAnalysis } from "../types/resume";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === "your_api_key_here" || API_KEY.length < 10) {
    console.error("Gemini API key is missing or invalid. Please check your .env file.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

const RESUME_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        personalDetails: {
            type: Type.OBJECT,
            properties: {
                fullName: { type: Type.STRING, description: "Full name of the individual" },
                email: { type: Type.STRING, description: "Contact email address" },
                phone: { type: Type.STRING, description: "Contact phone number" },
                location: { type: Type.STRING, description: "Current city and state/country" },
                linkedinUrl: { type: Type.STRING },
                portfolioUrl: { type: Type.STRING },
            },
        },
        summary: { type: Type.STRING, description: "A brief professional summary or objective statement only. DO NOT include experience or skills here." },
        skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of technical, hard, or tool-specific skills" },
        softSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of interpersonal, soft, or character-based skills" },
        experience: {
            type: Type.ARRAY,
            description: "Detailed work history",
            items: {
                type: Type.OBJECT,
                properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    duration: { type: Type.STRING, description: "Dates of employment (e.g., Jan 2020 - Present)" },
                    description: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Bullet points of achievements and responsibilities" },
                },
            },
        },
        education: {
            type: Type.ARRAY,
            description: "Academic history",
            items: {
                type: Type.OBJECT,
                properties: {
                    school: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    year: { type: Type.STRING },
                },
            },
        },
        projects: {
            type: Type.ARRAY,
            description: "Specific professional or personal projects",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    link: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
            },
        },
        certifications: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    year: { type: Type.STRING },
                },
            },
        },
        extracurricularActivities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING },
                    organization: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
            },
        },
    },
    required: ["personalDetails", "summary", "skills", "experience"],
};

import api from "@/services/api";

export const analyzeResumeATS = async (file: File): Promise<ATSAnalysis> => {
    console.log("analyzeResumeATS: Starting analysis for file:", file.name);
    const formData = new FormData();
    formData.append("resume", file);

    try {
        const response = await api.post("/api/resumes/ats/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        console.log("analyzeResumeATS: API response received:", response.status);
        const data = response.data;



        // Map the external API response to our ATSAnalysis interface
        return {
            score: data.score,
            formattingScore: 100, // External API doesn't provide this, defaulting
            matchingKeywords: data.keywords_matched || [],
            missingKeywords: data.missing_keywords || [],
            recommendations: data.suggestions || [],
            path90Plus: [],
            sectionFeedback: []
        };
    } catch (error: any) {
        console.error("analyzeResumeATS: Error during analysis:", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
        }
        throw error;
    }
};


export const parseResumeFromFile = async (file: File): Promise<Partial<Resume>> => {
    const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type,
                    },
                },
                {
                    text: `You are a high-precision Resume Parser. Your goal is to extract information from the provided document into a structured JSON format.
          
          STRICT RULES FOR EXTRACTION:
          1. 'summary': Extract ONLY the brief 2-4 sentence introduction/objective. DO NOT put skills, projects, or work history in this field.
          2. 'experience': Each job must be a separate object. Descriptions MUST be an array of short bullet points.
          3. 'skills': This is for Hard Skills (e.g., Python, React, AWS).
          4. 'softSkills': This is for Interpersonal Skills (e.g., Leadership, Communication).
          5. 'projects': Separate specific projects from general work experience.
          6. 'education': List schools, degrees, and years.
          7. If a section is not present in the document, return an empty array or empty string.
          8. Do not make up information. Only extract what is visible.`,
                }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: RESUME_SCHEMA,
        },
    });

    try {
        const data = JSON.parse(response.text || '{}');
        return data;
    } catch (error) {
        console.error("Failed to parse AI response:", error);
        throw new Error("Failed to parse resume data from AI.");
    }
};

export const analyzeResume = async (resume: Resume, jobDescription?: string): Promise<ATSAnalysis> => {
    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `You are an expert ATS (Applicant Tracking System) Auditor. Analyze the provided resume against the job details. 
    
    Resume: ${JSON.stringify(resume)}
    Job Description: ${jobDescription || "No job description provided."}
    
    CRITICAL OBJECTIVE: Provide extremely granular feedback. For every section (Experience, Skills, Projects, etc.), tell the user exactly what to change, add, or remove to hit a 90+ score.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.NUMBER, description: "Overall ATS matching score (0-100)" },
                    formattingScore: { type: Type.NUMBER, description: "Structural/Formatting quality (0-100)" },
                    matchingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords present in both resume and JD" },
                    missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "CRITICAL keywords found in JD but missing in resume" },
                    recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "General professional advice" },
                    path90Plus: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step checklist to reach 90+ score" },
                    sectionFeedback: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                sectionName: { type: Type.STRING, description: "e.g. 'Work Experience' or 'Skills'" },
                                issue: { type: Type.STRING, description: "What is currently wrong or missing in this section" },
                                improvement: { type: Type.STRING, description: "Exactly what text or detail to add/change" },
                                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                            },
                            required: ["sectionName", "issue", "improvement", "priority"]
                        }
                    }
                },
                required: ["score", "formattingScore", "matchingKeywords", "missingKeywords", "path90Plus", "sectionFeedback"],
            },
        },
    });

    try {
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Failed to parse ATS analysis:", error);
        throw new Error("Failed to generate ATS analysis.");
    }
};

export const suggestSummary = async (data: Partial<Resume>): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `Write a compelling, 3-sentence professional summary for a resume based on these details: ${JSON.stringify(data)}`,
    });
    return response.text || "";
};
