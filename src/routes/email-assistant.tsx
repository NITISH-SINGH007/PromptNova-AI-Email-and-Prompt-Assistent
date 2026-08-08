import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { analyzeEmail, type EmailAnalysisResult } from "@/lib/ai-assistant";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/email-assistant")({
  head: () => ({
    meta: [
      { title: "Email Assistant — Prompt Nova" },
      { name: "description", content: "AI-powered email summarization and task extraction." },
    ],
  }),
  component: EmailAssistantPage,
});

function EmailAssistantPage() {
  const [emailContent, setEmailContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmailAnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useAuth();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailContent.trim()) {
      toast.error("Please paste an email to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    try {
      const analysis = await analyzeEmail(emailContent);
      setResult(analysis);
      toast.success("Analysis complete!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save your email analysis.");
      return;
    }
    if (!result || !emailContent) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from("email_analyses").insert({
        user_id: user.id,
        raw_email: emailContent,
        summary: result.summary,
        priority: result.priority,
        tasks: result.tasks,
        is_spam: result.isSpam,
        smart_replies: result.smartReplies,
      });

      if (error) throw error;
      toast.success("Analysis saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save analysis.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-100px)] py-12 px-6 sm:px-10 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-light tracking-[0.1em] uppercase">Email Assistant</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Paste an email below. Nova will summarize the content, identify tasks, determine priority, and suggest smart replies.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left Side: Input */}
        <form className="glass-card p-6 sm:p-8 flex flex-col h-full min-h-[500px]" onSubmit={handleAnalyze}>
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-lg tracking-[0.15em] uppercase">Raw Email</h3>
          </div>
          
          <textarea
            className="flex-1 w-full bg-transparent border border-hairline p-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary resize-none"
            placeholder="Paste the full email text here (Subject, Sender, Body)..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />

          <button
            type="submit"
            disabled={isAnalyzing || !emailContent.trim()}
            className="mt-6 w-full border border-primary bg-primary px-6 py-4 font-display text-[0.7rem] uppercase tracking-[0.3em] text-primary-foreground transition-all hover:bg-transparent hover:text-foreground disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Email"}
          </button>
        </form>

        {/* Right Side: Output */}
        <div className="glass-card p-6 sm:p-8 flex flex-col h-full min-h-[500px]">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-lg tracking-[0.15em] uppercase">Analysis</h3>
            {result && (
              <button
                type="button"
                className="font-display text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Analysis"}
              </button>
            )}
          </div>

          {!result && !isAnalyzing && (
             <div className="flex flex-1 flex-col justify-center items-center gap-4 text-sm text-muted-foreground text-center">
               <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-primary">
                 Awaiting Input
               </p>
               <p className="leading-relaxed max-w-xs">
                 Ready to parse incoming data.
               </p>
             </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-1 flex-col justify-center items-center gap-4 text-sm text-muted-foreground text-center animate-pulse">
              <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-primary">
                Processing Data
              </p>
              <div className="flex gap-2">
                <span className="size-[4px] bg-primary rounded-full animate-bounce" />
                <span className="size-[4px] bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="size-[4px] bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-8 flex-1 overflow-auto pr-2">
              {/* Priority & Spam Tags */}
              <div className="flex gap-4 items-center">
                <div className={`px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] border ${
                  result.priority === 'High' ? 'border-red-500/50 text-red-400 bg-red-950/20' :
                  result.priority === 'Medium' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-950/20' :
                  'border-green-500/50 text-green-400 bg-green-950/20'
                }`}>
                  Priority: {result.priority}
                </div>
                {result.isSpam && (
                  <div className="px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] border border-orange-500/50 text-orange-400 bg-orange-950/20">
                    Spam/Phishing Detected
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="border-l border-primary/60 pl-4">
                <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-primary">Summary</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{result.summary}</p>
              </div>

              {/* Tasks */}
              <div className="border-l border-primary/60 pl-4">
                <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-primary">Tasks & Deadlines</p>
                {result.tasks.length > 0 ? (
                  <ul className="mt-3 space-y-3">
                    {result.tasks.map((task, i) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground/85 items-start">
                        <span className="text-primary mt-0.5">■</span>
                        <div className="flex flex-col gap-1">
                          <span>{task.task}</span>
                          {task.deadline && (
                            <span className="text-[0.65rem] text-muted-foreground uppercase tracking-[0.1em]">Due: {task.deadline}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">No explicit tasks detected.</p>
                )}
              </div>

              {/* Smart Replies */}
              <div className="border-l border-primary/60 pl-4">
                <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-primary">Smart Replies</p>
                <div className="mt-3 space-y-2 flex flex-col">
                  {result.smartReplies.map((reply, i) => (
                    <button
                      key={i}
                      className="text-left text-sm p-3 border border-hairline hover:border-primary/50 transition-colors text-foreground/85"
                      onClick={async () => {
                        await navigator.clipboard.writeText(reply);
                        toast.success("Reply copied to clipboard!");
                      }}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}
