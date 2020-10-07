module.exports = {
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: ["@sondr3/typescript"],
  rules: {
    "import/no-default-export": "off",
  },
};
