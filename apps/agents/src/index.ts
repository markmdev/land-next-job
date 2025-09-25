import { createATSAgent, runATSAgent as runATSAgentFn } from "./agents/ats-agent";

const atsAgent = createATSAgent();

export const runATSAgent = (resume: string, jobPosting: string) => {
  return runATSAgentFn(atsAgent, resume, jobPosting);
};
