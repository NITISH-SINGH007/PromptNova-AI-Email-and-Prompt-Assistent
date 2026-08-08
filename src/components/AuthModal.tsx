import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Successfully logged in!");
        setIsOpen(false);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Check your email for the confirmation link!");
        setIsOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full bg-transparent border border-hairline px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground">
          Login / Sign Up
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-card border-hairline">
        <DialogHeader>
          <DialogTitle className="font-display text-lg uppercase tracking-[0.15em] text-foreground">
            {isLogin ? "Sign In" : "Create Account"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="mb-2 block font-display text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              required
              className={fieldClass}
              placeholder="nova@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block font-display text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              className={fieldClass}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-primary bg-primary px-6 py-4 font-display text-[0.7rem] uppercase tracking-[0.3em] text-primary-foreground transition-all hover:bg-transparent hover:text-foreground disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-display text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
