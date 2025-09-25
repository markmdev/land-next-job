import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      // Override the turbo rule if needed
      "turbo/no-undeclared-env-vars": "off",
    },
  },
];