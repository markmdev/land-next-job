import { Agent, run } from "@openai/agents";
import { readFile } from "../utils/files";
import * as Path from "path";

export function createATSAgent() {
  const atsSystemPrompt = readFile(Path.join(process.cwd(), "src", "prompts", "ats-agent.txt"));
  const agent = new Agent({
    name: "ATS Agent",
    instructions: atsSystemPrompt,
  });

  return agent;
}

export function runATSAgent(agent: Agent, resume: string, jobPosting: string) {
  return run(
    agent,
    JSON.stringify({
      resume,
      jobPosting,
    })
  );
}
