module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',     // New feature
      'fix',      // Bug fix
      'docs',     // Documentation only
      'style',    // Code style (formatting, whitespace)
      'refactor', // Code refactoring
      'perf',     // Performance improvement
      'test',     // Adding/fixing tests
      'build',    // Build system / dependencies
      'ci',       // CI config changes
      'chore',    // Maintenance tasks
      'revert',   // Revert a commit
    ]],
    'subject-case': [0], // Allow any case in subject
  },
};
