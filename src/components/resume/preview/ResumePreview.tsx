import { Resume } from "@/types/resume";

interface ResumePreviewProps {
    data: Resume;
}

export function ResumePreview({ data }: ResumePreviewProps) {
    return (
        <div className="h-full p-8 md:p-12 text-gray-900 font-sans text-sm leading-normal">
            {/* Header */}
            <header className="border-b-2 border-gray-900 pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.personalDetails.fullName}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    {data.personalDetails.email && (
                        <span>{data.personalDetails.email}</span>
                    )}
                    {data.personalDetails.phone && (
                        <span>• {data.personalDetails.phone}</span>
                    )}
                    {data.personalDetails.location && (
                        <span>• {data.personalDetails.location}</span>
                    )}
                    {data.personalDetails.linkedinUrl && (
                        <span>• {data.personalDetails.linkedinUrl}</span>
                    )}
                    {data.personalDetails.portfolioUrl && (
                        <span>• {data.personalDetails.portfolioUrl}</span>
                    )}
                </div>
            </header>

            {/* Summary */}
            {data.summary && (
                <section className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">
                        Professional Summary
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                                    <span className="text-sm text-gray-600">
                                        {exp.startDate} – {exp.endDate || "Present"}
                                    </span>
                                </div>
                                <div className="text-gray-800 font-medium mb-1">{exp.company}</div>
                                <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">
                        Education
                    </h2>
                    <div className="space-y-4">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                    <span className="text-sm text-gray-600">
                                        {edu.startDate} – {edu.endDate}
                                    </span>
                                </div>
                                <div className="text-gray-700">{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.join(" • ")}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">
                        Projects
                    </h2>
                    <div className="space-y-4">
                        {data.projects.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900">
                                        {proj.name}
                                        {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline text-sm font-normal">Link</a>}
                                    </h3>
                                </div>
                                <p className="text-gray-700 whitespace-pre-line">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
