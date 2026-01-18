export interface Resume {
    id: string;
    name: string;
    lastEdited: string;
    score: number;
    personalDetails: PersonalDetails;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    projects: Project[];
    targetJobRole?: string;
    targetJobDescription?: string;
    suggestions?: Array<{ type: 'keyword' | 'improvement'; text: string }>;
    detailedScores?: Array<{ name: string; score: number; status: 'excellent' | 'good' | 'warning' }>;
}

export interface PersonalDetails {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
}

export interface Experience {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Education {
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    url?: string;
}
