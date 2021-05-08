module.exports = {
  parserOptions: {
    project: "./tsconfig.json",
  },
  globals: {
    __dirname: true,
  },
  extends: ["@sondr3/eslint-config/typescript", "@sondr3/eslint-config/node"],
  rules: {
    "import/no-default-export": "off",
    "unicorn/prefer-module": "off",
    "unicorn/prefer-node-protocol": "off",
  },
};
