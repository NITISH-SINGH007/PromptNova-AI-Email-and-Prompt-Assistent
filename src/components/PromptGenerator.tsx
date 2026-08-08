import { useState } from "react";
import { toast } from "sonner";
import {
  buildMagicPrompt,
  formatMagicPrompt,
  EXAMPLE,
  type MagicPromptInput,
  type MagicPrompt,
} from "@/lib/magic-prompt";

const EMPTY: MagicPromptInput = {
  role: "",
  goal: "",
  audience: "",
  tone: "",
  details: "",
  format: "",
};

const fieldClass =
  "w-full bg-transparent border border-hairline px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary";

const labelClass =
  "mb-2 block font-display text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground";

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l border-primary/60 pl-4">
      <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-primary">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/85">{body}</p>
    </div>
  );
}

export function PromptGenerator() {
  const [input, setInput] = useState<MagicPromptInput>(EMPTY);
  const [output, setOutput] = useState<MagicPrompt | null>(null);

  const set = (key: keyof MagicPromptInput) => (value: string) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form
        className="glass-card p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          setOutput(buildMagicPrompt(input));
        }}
      >
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg tracking-[0.15em]">INPUT</h3>
          <button
            type="button"
            className="font-display text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
            onClick={() => {
              setInput(EXAMPLE);
              setOutput(buildMagicPrompt(EXAMPLE));
            }}
          >
            Load example
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className={labelClass} htmlFor="role">
              Who should the AI be
            </label>
            <input
              id="role"
              className={fieldClass}
              placeholder="a senior brand strategist at a fintech startup"
              value={input.role}
              onChange={(e) => set("role")(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="goal">
              What must it deliver
            </label>
            <input
              id="goal"
              className={fieldClass}
              placeholder="write a launch announcement email"
              value={input.goal}
              onChange={(e) => set("goal")(e.target.value)}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="audience">
                Audience
              </label>
              <input
                id="audience"
                className={fieldClass}
                placeholder="enterprise buyers"
                value={input.audience}
                onChange={(e) => set("audience")(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="tone">
                Tone
              </label>
              <input
                id="tone"
                className={fieldClass}
                placeholder="direct and technical"
                value={input.tone}
                onChange={(e) => set("tone")(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="format">
              Output format
            </label>
            <input
              id="format"
              className={fieldClass}
              placeholder="a 150-word email with a single CTA"
              value={input.format}
              onChange={(e) => set("format")(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="details">
              Facts, inputs and examples
            </label>
            <textarea
              id="details"
              rows={5}
              className={fieldClass}
              placeholder="Product specs, numbers, constraints, links, sample copy…"
              value={input.details}
              onChange={(e) => set("details")(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full border border-primary bg-primary px-6 py-4 font-display text-[0.7rem] uppercase tracking-[0.3em] text-primary-foreground transition-all hover:bg-transparent hover:text-foreground"
        >
          Generate Magic Prompt
        </button>
      </form>

      <div className="glass-card flex flex-col p-6 sm:p-8">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg tracking-[0.15em]">OUTPUT</h3>
          {output ? (
            <button
              type="button"
              className="font-display text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              onClick={async () => {
                await navigator.clipboard.writeText(formatMagicPrompt(output));
                toast.success("Prompt copied to clipboard");
              }}
            >
              Copy
            </button>
          ) : null}
        </div>

        {output ? (
          <div className="mt-6 space-y-6">
            <Section title="Context" body={output.context} />
            <Section title="Task" body={output.task} />
            <Section title="Instruction" body={output.instruction} />
            <Section title="Data" body={output.data} />
            {output.notes.length > 0 ? (
              <div className="border border-hairline p-4">
                <p className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                  Validation adjustments
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {output.notes.map((note) => (
                    <li key={note}>— {note}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Validation passed — all four sections present and explicit.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-6 flex flex-1 flex-col justify-center gap-4 text-sm text-muted-foreground">
            <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-primary">
              Awaiting input
            </p>
            <p className="leading-relaxed">
              Your prompt will be assembled into four explicit sections — Context, Task, Instruction
              and Data — ready to paste into any model.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
