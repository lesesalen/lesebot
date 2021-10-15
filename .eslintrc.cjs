module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
  },
  globals: {
    __dirname: true,
  },
  plugins: ["simple-import-sort", "node"],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:node/recommended-module",
  ],
  rules: {
    "import/no-default-export": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-imports": "off",
    "import/order": "off",
    "node/no-missing-require": "off",
    "node/no-missing-import": "off",
    "node/no-extraneous-import": "off",
    "node/no-extraneous-require": "off",
    "node/no-unsupported-features/es-syntax": "off",
  },
  overrides: [
    {
      files: "src/**/*.{js,mjs,cjs}",
    },
  ],
};
