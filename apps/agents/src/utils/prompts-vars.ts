export function insertPromptsVars(prompts: string, vars: Record<string, string>) {
  return prompts.replace(/{{(.*?)}}/g, (match, p1) => vars[p1] || match);
}
