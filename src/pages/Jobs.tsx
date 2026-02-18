import { useState, useEffect } from "react";
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
  Sparkles,
  Briefcase,
  TrendingUp,
  Loader2
} from "lucide-react";
import { searchJobs, Job } from "@/services/jobService";
import { toast } from "sonner";

const filters = {};

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sortBy, setSortBy] = useState("Best Match");

  const sortJobs = (jobList: Job[], criteria: string) => {
    const list = [...jobList];
    switch (criteria) {
      case "Most Recent":
        return list.sort((a, b) => b.posted.localeCompare(a.posted));
      case "Highest Salary":
        const getSalaryValue = (s?: string) => {
          if (!s) return 0;
          const match = s.match(/\d+/g);
          return match ? parseInt(match[match.length - 1]) : 0;
        };
        return list.sort((a, b) => getSalaryValue(b.salary) - getSalaryValue(a.salary));
      case "Best Match":
      default:
        return list.sort((a, b) => b.match - a.match);
    }
  };

  const fetchJobs = async (query: string = "", page: number = 1, append: boolean = false) => {
    if (page === 1) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const { jobs: newJobs, hasNext } = await searchJobs(query, page);

      setJobs(prev => {
        const combined = append ? [...prev, ...newJobs] : newJobs;
        return sortJobs(combined, sortBy);
      });
      setHasNextPage(hasNext);
      setCurrentPage(page);
    } catch (error: any) {
      toast.error("Failed to fetch jobs: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs(searchQuery, 1, false);
  }, [sortBy]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    fetchJobs(searchQuery, 1, false);
  };

  const handleLoadMore = () => {
    fetchJobs(searchQuery, currentPage + 1, true);
  };

  const toggleSave = (jobId: number) => {
    setSavedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
    toast.success(savedJobs.includes(jobId) ? "Job unsaved" : "Job saved to your profile");
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
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
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
                <Button variant="hero" type="submit" className="gap-2 min-w-[120px]" disabled={isRefreshing}>
                  {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search
                </Button>
              </div>
            </form>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between"
            >
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                {isRefreshing ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Finding best matches...
                  </>
                ) : (
                  <>
                    <span className="text-foreground font-medium">{jobs.length}</span> jobs found matching your profile
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option>Best Match</option>
                  <option>Most Recent</option>
                  <option>Highest Salary</option>
                </select>
              </div>
            </motion.div>

            {/* Job Listings */}
            <div className="space-y-4">
              {/* Job Cards */}
              {isRefreshing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-t-2 border-accent animate-spin"></div>
                    <Sparkles className="h-6 w-6 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground text-sm animate-pulse">Analyzing thousands of opportunities...</p>
                </div>
              ) : jobs.length > 0 ? (
                <>
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * (index % 10) }}
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
                        <Button variant="outline" size="sm" onClick={() => job.url && window.open(job.url, '_blank')}>
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Load More */}
                  {hasNextPage && (
                    <div className="text-center pt-8 pb-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 px-8"
                        onClick={handleLoadMore}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrendingUp className="h-4 w-4" />
                        )}
                        {isLoading ? "Fetching more jobs..." : "Load More Jobs"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 glass-card">
                  <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                  <p className="text-muted-foreground italic text-sm">Try adjusting your search to see more results.</p>
                  <Button variant="outline" className="mt-6" onClick={() => fetchJobs("", 1, false)}>
                    Show All Jobs
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
