import { Resume } from "@/types/resume";

export const calculateLocalATSScore = (resume: Resume, jobDescription?: string) => {
    let score = 0;
    const detailedScores: Array<{ name: string; score: number; status: "excellent" | "good" | "warning" }> = [];
    const suggestions: Array<{ type: "keyword" | "improvement"; text: string }> = [];

    // 1. Keyword Matching (40%)
    let keywordScore = 0;
    if (jobDescription) {
        const jdWords = new Set(jobDescription.toLowerCase().match(/\b\w{3,}\b/g) || []);
        const resumeText = JSON.stringify(resume).toLowerCase();

        // Count matches of JD words in Resume
        let matchCount = 0;
        const importantKeywords = Array.from(jdWords).filter(word =>
            ["react", "typescript", "node", "javascript", "python", "aws", "docker", "sql", "git", "agile", "frontend", "backend"].includes(word)
        );

        importantKeywords.forEach(word => {
            if (resumeText.includes(word)) matchCount++;
            else suggestions.push({ type: "keyword", text: `Consider adding '${word}' if you have experience with it.` });
        });

        keywordScore = importantKeywords.length > 0 ? (matchCount / importantKeywords.length) * 100 : 80;
    } else {
        keywordScore = resume.skills.length > 5 ? 90 : 60;
        if (resume.skills.length <= 5) suggestions.push({ type: "keyword", text: "Add more relevant skills to improve keyword matching." });
    }
    detailedScores.push({ name: "Keyword Match", score: Math.round(keywordScore), status: getStatus(keywordScore) });

    // 2. Section Structure (30%)
    let structureScore = 0;
    const sections = [
        { name: "Summary", present: !!resume.summary },
        { name: "Experience", present: resume.experience.length > 0 },
        { name: "Education", present: resume.education.length > 0 },
        { name: "Skills", present: resume.skills.length > 0 }
    ];
    const presentCount = sections.filter(s => s.present).length;
    structureScore = (presentCount / sections.length) * 100;

    sections.forEach(s => {
        if (!s.present) suggestions.push({ type: "improvement", text: `Missing section: ${s.name}.` });
    });
    detailedScores.push({ name: "Section Structure", score: Math.round(structureScore), status: getStatus(structureScore) });

    // 3. Experience & Quantification (30%)
    let expScore = 0;
    const allDescriptions = resume.experience.map(e => e.description).join(" ");
    const hasMetrics = /\b(\d+|first|second|increased|decreased|reduced|saved|managed|led)\b/i.test(allDescriptions);

    expScore = (resume.experience.length > 2 ? 70 : 40) + (hasMetrics ? 30 : 0);
    if (!hasMetrics) suggestions.push({ type: "improvement", text: "Quantify your achievements with numbers or metrics (e.g., 'Increased efficiency by 20%')." });

    detailedScores.push({ name: "Content Quality", score: Math.round(expScore), status: getStatus(expScore) });

    // Calculate Final Score
    score = Math.round((keywordScore * 0.4) + (structureScore * 0.3) + (expScore * 0.3));

    return {
        score,
        detailedScores,
        suggestions: suggestions.slice(0, 5) // Limit to top 5
    };
};

export const localParseResume = (text: string) => {
    const resumeData: any = {
        personalDetails: {
            fullName: "",
            email: "",
            phone: "",
            location: "",
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        projects: []
    };

    // Heuristic parsing
    // 1. Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) resumeData.personalDetails.email = emailMatch[0];

    // 2. Phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) resumeData.personalDetails.phone = phoneMatch[0];

    // 3. Name (Usually the first line or first few words)
    const lines = text.split(/\n/).filter(line => line.trim().length > 0);
    if (lines.length > 0) {
        resumeData.personalDetails.fullName = lines[0].trim();
    }

    // 4. Skills (Common tech keywords)
    const commonSkills = ["react", "node", "javascript", "typescript", "python", "java", "sql", "aws", "docker"];
    commonSkills.forEach(skill => {
        if (text.toLowerCase().includes(skill)) {
            resumeData.skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
        }
    });

    // 5. Summary (Assume the first paragraph after contact info)
    if (lines.length > 2) {
        resumeData.summary = lines.slice(1, 4).join(" ").trim();
    }

    return resumeData;
};

const getStatus = (score: number): "excellent" | "good" | "warning" => {
    if (score >= 85) return "excellent";
    if (score >= 60) return "good";
    return "warning";
};
