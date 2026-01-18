import { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";

export function ResumeForm() {
    const {
        activeResume,
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
        optimizeWithAI
    } = useResume();

    const [newSkill, setNewSkill] = useState("");
    const [isOptimizing, setIsOptimizing] = useState(false);

    if (!activeResume) return null;

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            await optimizeWithAI();
            // Toast is likely handled where optimizeWithAI is called or inside it
            // but for better UX we might want a toast here
        } catch (error) {
            // Error handling
        } finally {
            setIsOptimizing(false);
        }
    };

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updatePersonalDetails({
            ...activeResume.personalDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            updateSkills([...activeResume.skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        updateSkills(activeResume.skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">Resume Editor</h2>
                    <p className="text-sm text-muted-foreground">Fill in your details to build your resume.</p>
                </div>
                <Button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="gap-2 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-white"
                >
                    <Plus className={`h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                    {isOptimizing ? "Analyzing..." : "Analyze Resume"}
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={["personal", "summary", "experience", "education", "skills", "projects", "jobDescription"]} className="w-full">

                {/* Personal Details */}
                <AccordionItem value="personal">
                    <AccordionTrigger>Personal Details</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={activeResume.personalDetails.fullName}
                                    onChange={handlePersonalChange}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={activeResume.personalDetails.email}
                                    onChange={handlePersonalChange}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={activeResume.personalDetails.phone}
                                    onChange={handlePersonalChange}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={activeResume.personalDetails.location}
                                    onChange={handlePersonalChange}
                                    placeholder="New York, NY"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                                <Input
                                    id="linkedinUrl"
                                    name="linkedinUrl"
                                    value={activeResume.personalDetails.linkedinUrl || ""}
                                    onChange={handlePersonalChange}
                                    placeholder="linkedin.com/in/johndoe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                                <Input
                                    id="portfolioUrl"
                                    name="portfolioUrl"
                                    value={activeResume.personalDetails.portfolioUrl || ""}
                                    onChange={handlePersonalChange}
                                    placeholder="johndoe.com"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Summary */}
                <AccordionItem value="summary">
                    <AccordionTrigger>Professional Summary</AccordionTrigger>
                    <AccordionContent>
                        <Textarea
                            value={activeResume.summary}
                            onChange={(e) => updateSummary(e.target.value)}
                            placeholder="Briefly describe your professional background and goals..."
                            className="h-32"
                        />
                    </AccordionContent>
                </AccordionItem>

                {/* Experience */}
                <AccordionItem value="experience">
                    <AccordionTrigger>Experience</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        {activeResume.experience.map((exp) => (
                            <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative group">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteExperience(exp.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Job Title</Label>
                                        <Input
                                            value={exp.jobTitle}
                                            onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                                            placeholder="Software Engineer"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Company</Label>
                                        <Input
                                            value={exp.company}
                                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                            placeholder="Tech Corp"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            value={exp.startDate}
                                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                            placeholder="MM/YYYY"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                            value={exp.endDate}
                                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                            placeholder="MM/YYYY or Present"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={exp.description}
                                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                                        placeholder="Describe your responsibilities and achievements..."
                                    />
                                </div>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => addExperience({
                                jobTitle: "",
                                company: "",
                                location: "",
                                startDate: "",
                                endDate: "",
                                current: false,
                                description: ""
                            })}
                        >
                            <Plus className="h-4 w-4" /> Add Experience
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Education */}
                <AccordionItem value="education">
                    <AccordionTrigger>Education</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        {activeResume.education.map((edu) => (
                            <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative group">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteEducation(edu.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Degree</Label>
                                        <Input
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                            placeholder="Bachelor of Science"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>School</Label>
                                        <Input
                                            value={edu.school}
                                            onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                                            placeholder="University of Technology"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            value={edu.startDate}
                                            onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                            placeholder="YYYY"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                            value={edu.endDate}
                                            onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                            placeholder="YYYY"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => addEducation({
                                degree: "",
                                school: "",
                                location: "",
                                startDate: "",
                                endDate: "",
                                current: false
                            })}
                        >
                            <Plus className="h-4 w-4" /> Add Education
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Skills */}
                <AccordionItem value="skills">
                    <AccordionTrigger>Skills</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                                    placeholder="Add a skill (e.g. React.js)"
                                />
                                <Button onClick={handleAddSkill}>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {activeResume.skills.map((skill, index) => (
                                    <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Projects */}
                <AccordionItem value="projects">
                    <AccordionTrigger>Projects</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        {activeResume.projects.map((proj) => (
                            <div key={proj.id} className="p-4 border rounded-lg space-y-4 relative group">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteProject(proj.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="space-y-2">
                                    <Label>Project Name</Label>
                                    <Input
                                        value={proj.name}
                                        onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                                        placeholder="Project Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={proj.description}
                                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                                        placeholder="Describe the project..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>URL (Optional)</Label>
                                    <Input
                                        value={proj.url || ""}
                                        onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => addProject({
                                name: "",
                                description: "",
                                url: ""
                            })}
                        >
                            <Plus className="h-4 w-4" /> Add Project
                        </Button>
                    </AccordionContent>
                </AccordionItem>
                {/* Target Job Description */}
                <AccordionItem value="jobDescription">
                    <AccordionTrigger>Target Job Profile</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="targetJobRole">Target Job Role</Label>
                            <Input
                                id="targetJobRole"
                                value={activeResume.targetJobRole || ""}
                                onChange={(e) => updateTargetJobRole(e.target.value)}
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobDescription">Target Job Description</Label>
                            <Textarea
                                id="jobDescription"
                                value={activeResume.targetJobDescription || ""}
                                onChange={(e) => updateTargetJobDescription(e.target.value)}
                                placeholder="Paste the job description here to get tailored improvement suggestions..."
                                className="h-48"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
