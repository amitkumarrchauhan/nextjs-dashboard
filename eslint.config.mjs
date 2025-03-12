/** working for purely TypeScript but no nextjs flavour */
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
);

// BELOW ONE NOT WORKING AT ALL
/* import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: {
    ...eslint.configs.recommended,
    ...tseslint.configs.recommended,
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
});

const eslintConfig = [
  ...compat.config({
    extends: ['tslint:recommended', 'next'],
  }),
];

export default eslintConfig;
 */

/*  NOT WORKING AS EXPECTED
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [...compat.extends("next/core-web-vitals", "next/typescript"), {
    rules: {
        "@typescript-eslint/no-unused-vars": "warn",
    },
}]; */
