import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/app/(admin)/admin/components/**/*.{ts,tsx}"],
    rules: {
      // Admin uses the "async fetchData inside useCallback called from useEffect" pattern.
      // The rule fires as a false positive here: setState only runs after an await,
      // never synchronously inside the effect body, and deps are [].
      // These are client-only CRUD components that don't benefit from RSC migration.
      // Revisit when admin is migrated to Server Actions.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
