import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    rules: {
      // Override the turbo rule since DATABASE_URL is properly declared in turbo.json
      "turbo/no-undeclared-env-vars": "off",
    },
  },
];
