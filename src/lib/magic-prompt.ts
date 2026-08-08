export type MagicPromptInput = {
  role: string;
  goal: string;
  audience: string;
  tone: string;
  details: string;
  format: string;
};

export type MagicPrompt = {
  context: string;
  task: string;
  instruction: string;
  data: string;
  notes: string[];
};

const fallback = (value: string, placeholder: string) =>
  value.trim().length > 0 ? value.trim() : placeholder;

export function buildMagicPrompt(input: MagicPromptInput): MagicPrompt {
  const notes: string[] = [];

  const role = fallback(input.role, "an expert generalist assistant");
  if (!input.role.trim()) notes.push("Context role was empty — defaulted to a generalist expert.");

  const goal = fallback(input.goal, "produce the deliverable described in the Data section");
  if (!input.goal.trim()) notes.push("Task was empty — inferred from the supplied data.");

  const audience = fallback(input.audience, "a general professional audience");
  const tone = fallback(input.tone, "clear, professional and confident");
  const format = fallback(input.format, "a clean, well-structured written response");

  const details = fallback(
    input.details,
    "No specific facts supplied — ask the user for missing inputs before producing the final answer.",
  );
  if (!input.details.trim()) notes.push("Data was empty — added an explicit clarification fallback.");

  const context = `You are ${role}. You are working on behalf of the user and are accountable for the quality, accuracy and usefulness of your output for ${audience}.`;

  const task = `${goal.charAt(0).toUpperCase()}${goal.slice(1)}.`;

  const instruction = [
    `Use a ${tone} tone throughout.`,
    `Deliver the result as ${format}.`,
    `Lead with the single most valuable point, then support it with concrete specifics drawn only from the Data section.`,
    `Avoid filler, hedging and generic claims; prefer precise nouns and verifiable statements.`,
    `If a required fact is missing from the Data section, state the assumption explicitly instead of inventing details.`,
  ].join(" ");

  const data = details;

  return { context, task, instruction, data, notes };
}

export function formatMagicPrompt(prompt: MagicPrompt): string {
  return [
    `Context: ${prompt.context}`,
    ``,
    `Task: ${prompt.task}`,
    ``,
    `Instruction: ${prompt.instruction}`,
    ``,
    `Data: ${prompt.data}`,
  ].join("\n");
}

export const EXAMPLE: MagicPromptInput = {
  role: "a marketing assistant at a consumer electronics company responsible for online store copy",
  goal: "write a product description for a new Bluetooth speaker",
  audience: "outdoor-minded online shoppers",
  tone: "friendly and inviting",
  details:
    "The Bluetooth speaker is waterproof, has a 12-hour battery life, and is compact enough to fit in a backpack. Perfect for hiking, picnics and beach trips.",
  format: "a short, scannable product description focused on customer benefits",
};
