import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Resume, PersonalDetails, Experience, Education, Project } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';

interface ResumeContextType {
    resumes: Resume[];
    activeResume: Resume | null;
    createNewResume: () => string;
    loadResume: (id: string) => void;
    updatePersonalDetails: (details: PersonalDetails) => void;
    updateSummary: (summary: string) => void;
    addExperience: (experience: Omit<Experience, 'id'>) => void;
    updateExperience: (id: string, experience: Partial<Experience>) => void;
    deleteExperience: (id: string) => void;
    addEducation: (education: Omit<Education, 'id'>) => void;
    updateEducation: (id: string, education: Partial<Education>) => void;
    deleteEducation: (id: string) => void;
    updateSkills: (skills: string[]) => void;
    addProject: (project: Omit<Project, 'id'>) => void;
    updateProject: (id: string, project: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    updateTargetJobRole: (role: string) => void;
    updateTargetJobDescription: (jd: string) => void;
    optimizeWithAI: () => Promise<any>;
    saveResume: () => void;
    deleteResume: (id: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const initialResume: Resume = {
    id: '',
    name: 'Untitled Resume',
    lastEdited: new Date().toISOString(),
    score: 0,
    personalDetails: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    targetJobRole: '',
    targetJobDescription: '',
    suggestions: [],
    detailedScores: [],
};

export function ResumeProvider({ children }: { children: ReactNode }) {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [activeResume, setActiveResume] = useState<Resume | null>(null);

    useEffect(() => {
        const savedResumes = localStorage.getItem('resumes');
        if (savedResumes) {
            setResumes(JSON.parse(savedResumes));
        }
    }, []);

    const saveToLocalStorage = (updatedResumes: Resume[]) => {
        localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    };

    const createNewResume = () => {
        const newResume = { ...initialResume, id: uuidv4(), lastEdited: new Date().toISOString() };
        setActiveResume(newResume);
        return newResume.id;
    };

    const loadResume = (id: string) => {
        const resume = resumes.find((r) => r.id === id);
        if (resume) {
            setActiveResume(resume);
        }
    };

    const updateActiveResume = (updater: (prev: Resume) => Resume) => {
        setActiveResume((prev) => {
            if (!prev) return null;
            return updater(prev);
        });
    };

    const updatePersonalDetails = (details: PersonalDetails) => {
        updateActiveResume((prev) => ({ ...prev, personalDetails: details }));
    };

    const updateSummary = (summary: string) => {
        updateActiveResume((prev) => ({ ...prev, summary }));
    };

    const addExperience = (experience: Omit<Experience, 'id'>) => {
        updateActiveResume((prev) => ({
            ...prev,
            experience: [...prev.experience, { ...experience, id: uuidv4() }],
        }));
    };

    const updateExperience = (id: string, experience: Partial<Experience>) => {
        updateActiveResume((prev) => ({
            ...prev,
            experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, ...experience } : exp)),
        }));
    };

    const deleteExperience = (id: string) => {
        updateActiveResume((prev) => ({
            ...prev,
            experience: prev.experience.filter((exp) => exp.id !== id),
        }));
    };

    const addEducation = (education: Omit<Education, 'id'>) => {
        updateActiveResume((prev) => ({
            ...prev,
            education: [...prev.education, { ...education, id: uuidv4() }],
        }));
    };

    const updateEducation = (id: string, education: Partial<Education>) => {
        updateActiveResume((prev) => ({
            ...prev,
            education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...education } : edu)),
        }));
    };

    const deleteEducation = (id: string) => {
        updateActiveResume((prev) => ({
            ...prev,
            education: prev.education.filter((edu) => edu.id !== id),
        }));
    };

    const updateSkills = (skills: string[]) => {
        updateActiveResume((prev) => ({ ...prev, skills }));
    };

    const addProject = (project: Omit<Project, 'id'>) => {
        updateActiveResume((prev) => ({
            ...prev,
            projects: [...prev.projects, { ...project, id: uuidv4() }],
        }));
    };

    const updateProject = (id: string, project: Partial<Project>) => {
        updateActiveResume((prev) => ({
            ...prev,
            projects: prev.projects.map((proj) => (proj.id === id ? { ...proj, ...project } : proj)),
        }));
    };

    const deleteProject = (id: string) => {
        updateActiveResume((prev) => ({
            ...prev,
            projects: prev.projects.filter((proj) => proj.id !== id),
        }));
    };

    const updateTargetJobRole = (role: string) => {
        updateActiveResume((prev) => ({ ...prev, targetJobRole: role }));
    };

    const updateTargetJobDescription = (jd: string) => {
        updateActiveResume((prev) => ({ ...prev, targetJobDescription: jd }));
    };

    const optimizeWithAI = async () => {
        if (!activeResume) return;

        const { calculateLocalATSScore } = await import('@/services/localAIEngine');

        try {
            // Simulate a small delay for "processing" feel
            await new Promise(resolve => setTimeout(resolve, 800));

            const analysis = calculateLocalATSScore(activeResume, activeResume.targetJobDescription);

            updateActiveResume((prev) => ({
                ...prev,
                score: analysis.score,
                detailedScores: analysis.detailedScores,
                suggestions: analysis.suggestions
            }));

            return analysis;
        } catch (error) {
            console.error("Local optimization failed:", error);
            throw error;
        }
    };

    const saveResume = () => {
        if (!activeResume) return;
        const updatedResume = { ...activeResume, lastEdited: new Date().toISOString() };

        // Simple mock score calculation
        let score = 0;
        if (updatedResume.personalDetails.fullName) score += 20;
        if (updatedResume.experience.length > 0) score += 30;
        if (updatedResume.education.length > 0) score += 20;
        if (updatedResume.skills.length > 0) score += 20;
        if (updatedResume.summary) score += 10;
        updatedResume.score = score;

        let updatedResumes;
        if (resumes.some((r) => r.id === updatedResume.id)) {
            updatedResumes = resumes.map((r) => (r.id === updatedResume.id ? updatedResume : r));
        } else {
            updatedResumes = [...resumes, updatedResume];
        }
        setResumes(updatedResumes);
        saveToLocalStorage(updatedResumes);
        setActiveResume(updatedResume);
    };

    const deleteResume = (id: string) => {
        const updatedResumes = resumes.filter((r) => r.id !== id);
        setResumes(updatedResumes);
        saveToLocalStorage(updatedResumes);
        if (activeResume?.id === id) {
            setActiveResume(null);
        }
    };

    return (
        <ResumeContext.Provider
            value={{
                resumes,
                activeResume,
                createNewResume,
                loadResume,
                updatePersonalDetails,
                updateSummary,
                addExperience,
                updateExperience,
                deleteExperience,
                addEducation,
                updateEducation,
                deleteEducation,
                updateSkills,
                addProject,
                updateProject,
                deleteProject,
                updateTargetJobRole,
                updateTargetJobDescription,
                optimizeWithAI,
                saveResume,
                deleteResume
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
}
