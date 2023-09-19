module.exports = {
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'chore', hidden: true },
    { type: 'docs', hidden: true },
    { type: 'style', hidden: true },
    { type: 'refactor', section: 'Refactor' },
    { type: 'perf', section: 'Performance Improvements' },
    { type: 'test', hidden: true },
  ],
  bumpFiles: [
    {
      filename: 'package.json',
      type: 'json',
    },
    {
      filename: 'package-lock.json',
      type: 'json',
    },
    {
      filename: 'npm-shrinkwrap.json',
      type: 'json',
    },
  ],
  header: '',
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  skip: {
    commit: true,
    tag: true,
  },
  releaseCommitMessageFormat: 'chore(release): {{currentTag}} [skip ci]',
  preset: 'angular',
};