module.exports = {
  codeReview: {
    output: {
      mode: 'tags-split',
      target: './api',
      schemas: './api/model',
      client: 'swr',
    },
    input: {
      target: 'https://openrouter-api.dwarvesf.com/api/v1/openapi.json',
    },
    hooks: {
      afterAllFilesWrite: 'eslint src/api --ext .ts,.tsx,.js --fix', // run lint fix after all files are written
    },
  },
};