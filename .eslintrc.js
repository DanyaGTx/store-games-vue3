module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
    "sort-imports-es6-autofix",
  ],
  rules: {
    "prettier/prettier": ["error", { singleQuote: true }],
    "sort-imports-es6-autofix/sort-imports-es6": [
      "warn",
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
  },
};
