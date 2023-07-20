export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^inquirer$': '<rootDir>/__mocks__/inquirer.js',
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
