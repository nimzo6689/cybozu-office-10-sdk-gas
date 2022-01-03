module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
  coverageProvider: 'v8',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],

  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },

  moduleDirectories: ['node_modules'],

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
};
