import { createFileRoute, Link } from "@tanstack/react-router";
import android from "@/assets/android-hero.jpg";
import { PromptGenerator } from "@/components/PromptGenerator";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PromptNova-AI Email And Prompt Assistent" },
      {
        name: "description",
        content:
          "Prompt Nova turns rough ideas into structured Magic Prompt Formula prompts: Context, Task, Instruction, Data. Built for developers, freelancers and teams.",
      },
      { property: "og:title", content: "PromptNova-AI Email And Prompt Assistent" },
      {
        property: "og:description",
        content:
          "Generate four-part Magic Prompt Formula prompts — Context, Task, Instruction, Data — in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = ["Home", "About", "Formula", "Services", "Contacts"];

const CARDS = [
  {
    title: "TECHNOLOGY",
    body: "A deterministic formula engine maps your inputs into four explicit sections, so every prompt lands the same way twice.",
  },
  {
    title: "INNOVATION",
    body: "Secure accounts, saved formulas and an interface stripped to what matters — for developers, freelancers and enterprise teams.",
  },
];

function Index() {
  const { user, signOut } = useAuth();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <header className="flex items-center justify-between border-b border-hairline py-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PromptNova Logo" className="w-8 h-8 rounded-md" />
            <span className="font-display text-lg tracking-[0.1em] uppercase hidden sm:block">
              PromptNova
            </span>
          </div>
          <nav className="hidden gap-10 md:flex items-center">
            {NAV.map((item) => (
              <a
                key={item}
                href="#formula"
                className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
            <Link
              to="/email-assistant"
              className="inline-flex border border-primary px-4 py-2 font-display text-[0.65rem] uppercase tracking-[0.25em] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Email Assistant
            </Link>
          </nav>
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-display text-[0.65rem] tracking-[0.2em] text-primary">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Logout
                </button>
              </div>
            ) : (
              <AuthModal />
            )}
            <div className="h-4 w-px bg-hairline hidden md:block" />
            <span className="font-display text-[0.65rem] tracking-[0.2em] text-muted-foreground">
              ENG
            </span>
            <div className="grid grid-cols-3 gap-[3px] border border-hairline p-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="size-[3px] bg-foreground/70" />
              ))}
            </div>
          </div>
        </header>

        <section className="relative grid-lines">
          <div className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
            <div className="relative">
              <div className="absolute -left-6 top-1 hidden h-16 w-16 bg-primary lg:block" />
              <p className="relative font-display text-sm uppercase tracking-[0.45em] text-foreground/80">
                Here and now
              </p>
              <h1 className="relative mt-3 font-display text-6xl font-light tracking-[0.12em] sm:text-7xl lg:text-8xl">
                FORMULA
              </h1>
              <p className="mt-8 max-w-sm border-l border-primary/70 pl-5 text-sm leading-relaxed text-muted-foreground">
                Prompt Nova rewrites your rough idea into the Magic Prompt Formula — Context, Task,
                Instruction, Data. Four sections, no ambiguity, model-ready output.
              </p>
              <a
                href="#formula"
                className="mt-12 inline-flex border border-foreground/40 px-10 py-4 font-display text-[0.7rem] uppercase tracking-[0.35em] transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                Let's go
              </a>
            </div>

            <div className="relative">
              <img
                src={android}
                width={1280}
                height={1600}
                alt="Dark futuristic android bust representing the Prompt Nova formula engine"
                className="mx-auto max-h-[620px] w-auto object-contain"
              />
              <span className="absolute right-0 top-16 hidden items-center gap-3 font-display text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground lg:flex">
                <span className="h-px w-16 bg-hairline" />
                Artificial intelligence
              </span>
              <span className="absolute bottom-24 left-0 hidden items-center gap-3 font-display text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground lg:flex">
                No emotion
                <span className="h-px w-12 bg-hairline" />
              </span>
            </div>
          </div>

          <div className="grid gap-px border-t border-hairline sm:grid-cols-2 lg:ml-auto lg:w-2/3">
            {CARDS.map((card) => (
              <div key={card.title} className="glass-card p-6">
                <h2 className="font-display text-xs uppercase tracking-[0.3em]">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="formula" className="border-t border-hairline py-20">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-primary">
                Generator
              </p>
              <h2 className="mt-3 text-4xl font-light tracking-[0.1em]">MAGIC PROMPT FORMULA</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Fill the fields on the left. Nova assembles a validated four-part prompt on the right,
              flagging anything it had to infer.
            </p>
          </div>
          <PromptGenerator />
        </section>

        <footer className="flex flex-col gap-6 border-t border-hairline py-12 md:flex-row md:items-center md:justify-between font-display text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
          <div className="flex flex-col gap-2">
            <span className="text-foreground">Made with love ❤️ by Nitish Singh</span>
            <span>Organisation: NEX TECHNOLOGOIES</span>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <a
              href="https://github.com/NITISH-SINGH007"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/nitish-kumar-singh-08952b315?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
