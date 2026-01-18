import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjs from 'pdfjs-dist';
// @ts-ignore - pdf.worker.mjs?url is a Vite-specific feature
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Configure PDF.js worker using Vite's asset handling
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
        console.log("Starting PDF extraction for:", file.name);
        const arrayBuffer = await file.arrayBuffer();

        // Load the PDF document
        const loadingTask = pdfjs.getDocument({
            data: arrayBuffer,
            useWorkerFetch: true,
            isEvalSupported: false
        });

        const pdf = await loadingTask.promise;
        console.log(`PDF loaded. Pages: ${pdf.numPages}`);

        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items
                .map((item: any) => item.str)
                .join(" ");
            text += pageText + "\n";
        }

        if (!text.trim()) {
            throw new Error("No text content found in the PDF. It might be a scanned image or empty.");
        }

        return text;
    } catch (error: any) {
        console.error("PDF Extraction Detail Error:", error);
        // Provide more specific feedback if it's a known error type
        if (error.name === 'PasswordException') {
            throw new Error("This PDF is password protected and cannot be parsed.");
        }
        if (error.name === 'InvalidPDFException') {
            throw new Error("The file is not a valid PDF or is corrupted.");
        }
        throw new Error(`Failed to extract text: ${error.message || "Unknown error"}. Please ensure it's a valid PDF file.`);
    }
};

export const analyzeResume = async (resumeData: any, jobDescription?: string) => {
    if (!API_KEY || API_KEY === "your_api_key_here") {
        throw new Error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are an expert ATS (Applicant Tracking System) optimizer. 
        Analyze the following resume data and optional job description.
        
        Resume Data:
        ${JSON.stringify(resumeData, null, 2)}
        
        Target Job Description:
        ${jobDescription || "Not provided"}
        
        Provide your analysis in the following JSON format ONLY. Do not include any other text:
        {
            "score": number (0-100),
            "detailedScores": [
                { "name": "Keyword Match", "score": number, "status": "excellent" | "good" | "warning" },
                { "name": "Formatting", "score": number, "status": "excellent" | "good" | "warning" },
                { "name": "Section Structure", "score": number, "status": "excellent" | "good" | "warning" },
                { "name": "Skills Alignment", "score": number, "status": "excellent" | "good" | "warning" }
            ],
            "suggestions": [
                { "type": "keyword" | "improvement", "text": "string" }
            ],
            "parsedData": {
                "summary": "string",
                "skills": ["string"]
            }
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response (handling potential markdown blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse AI response: No JSON found");

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new Error("Failed to analyze resume with AI. Please check your API key and internet connection.");
    }
};

export const parseResumeFromText = async (text: string) => {
    if (!API_KEY || API_KEY === "your_api_key_here") {
        throw new Error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are a resume parser. Extract information from the following text and return it in a structured JSON format.
        
        Resume Text:
        ${text}
        
        Return JSON in this format ONLY:
        {
            "personalDetails": {
                "fullName": "string",
                "email": "string",
                "phone": "string",
                "location": "string",
                "linkedinUrl": "string",
                "portfolioUrl": "string"
            },
            "summary": "string",
            "experience": [
                { "jobTitle": "string", "company": "string", "location": "string", "startDate": "string", "endDate": "string", "current": boolean, "description": "string" }
            ],
            "education": [
                { "degree": "string", "school": "string", "location": "string", "startDate": "string", "endDate": "string", "current": boolean }
            ],
            "skills": ["string"],
            "projects": [
                { "name": "string", "description": "string", "url": "string" }
            ]
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const resultText = response.text();

        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse AI response: No JSON found");

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("AI Parsing Error:", error);
        throw new Error("Failed to parse resume with AI.");
    }
};
