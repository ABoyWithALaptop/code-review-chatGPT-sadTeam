module.exports = {
  codeReview: {
    output: {
      mode: 'tags-split',
      target: 'src/api',
      schemas: 'src/api/model',
      client: 'swr',
      mock: true,
    },
    input: {
      target: 'https://openrouter-api.dwarvesf.com/api/v1/openapi.json',
    },
    hooks: {
      afterAllFilesWrite: 'eslint ./src/api --ext .ts,.tsx,.js --fix', // run lint fix after all files are written
    },
  },
};