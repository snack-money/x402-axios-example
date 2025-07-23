/**
 * @type {import('semantic-release').GlobalConfig}
 */

export default {
  branches: ["main", { name: "pre-release", prerelease: true }],
  repositoryUrl: "https://github.com/snack-money/x402-axios-example.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    "@semantic-release/npm",
    "@semantic-release/github",
  ],
};
