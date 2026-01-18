import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign,
  Bookmark,
  Send,
  Filter,
  Sparkles,
  Briefcase,
  TrendingUp
} from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    company: "Meta",
    location: "Remote",
    salary: "$180K - $250K",
    posted: "2 hours ago",
    match: 94,
    tags: ["React", "Node.js", "TypeScript", "GraphQL"],
    saved: false,
  },
  {
    id: 2,
    title: "Staff Software Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    salary: "$200K - $280K",
    posted: "1 day ago",
    match: 91,
    tags: ["Ruby", "Go", "PostgreSQL", "AWS"],
    saved: true,
  },
  {
    id: 3,
    title: "Principal Engineer",
    company: "Vercel",
    location: "Remote",
    salary: "$220K - $300K",
    posted: "3 days ago",
    match: 89,
    tags: ["Next.js", "Rust", "Edge Computing"],
    saved: false,
  },
  {
    id: 4,
    title: "Engineering Manager",
    company: "Figma",
    location: "New York, NY",
    salary: "$190K - $260K",
    posted: "1 week ago",
    match: 85,
    tags: ["Leadership", "TypeScript", "WebGL"],
    saved: false,
  },
  {
    id: 5,
    title: "Senior Backend Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    salary: "$250K - $350K",
    posted: "5 days ago",
    match: 87,
    tags: ["Python", "ML/AI", "Distributed Systems"],
    saved: true,
  },
];

const filters = {
  experience: ["Entry Level", "Mid Level", "Senior", "Lead", "Principal"],
  type: ["Full-time", "Part-time", "Contract", "Freelance"],
  remote: ["Remote Only", "Hybrid", "On-site"],
  salary: ["$0-$100K", "$100K-$150K", "$150K-$200K", "$200K+"],
};

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState<number[]>([2, 5]);

  const toggleSave = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Job Discovery</h1>
            <p className="text-muted-foreground">AI-matched opportunities tailored to your profile</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Button>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button variant="hero" className="gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Smart Filters
                </h3>
                
                {Object.entries(filters).map(([category, options]) => (
                  <div key={category} className="mb-6 last:mb-0">
                    <h4 className="text-sm font-medium capitalize mb-3">{category}</h4>
                    <div className="space-y-2">
                      {options.map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-border bg-secondary text-accent focus:ring-accent/50"
                          />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Auto-Apply Card */}
              <div className="glass-card p-6 border-accent/30">
                <div className="flex items-center gap-2 mb-3">
                  <Send className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">Auto-Apply</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Let AI send personalized applications to matching jobs automatically.
                </p>
                <Button variant="hero" size="sm" className="w-full">
                  Enable Auto-Apply
                </Button>
              </div>
            </motion.div>

            {/* Job Listings */}
            <div className="lg:col-span-3 space-y-4">
              {/* Results Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{jobs.length}</span> jobs found matching your profile
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                    <option>Best Match</option>
                    <option>Most Recent</option>
                    <option>Highest Salary</option>
                  </select>
                </div>
              </motion.div>

              {/* Job Cards */}
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 4) }}
                  className="glass-card-hover p-6 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                        {job.match}% match
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(job.id)}
                        className={savedJobs.includes(job.id) ? "text-accent" : "text-muted-foreground"}
                      >
                        <Bookmark className={`h-5 w-5 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="hero" size="sm" className="gap-2">
                      <Send className="h-4 w-4" />
                      Quick Apply
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}

              {/* Load More */}
              <div className="text-center pt-4">
                <Button variant="outline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Load More Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
