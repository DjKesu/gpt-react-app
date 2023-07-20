// __mocks__/inquirer.js

const inquirer = jest.createMockFromModule('inquirer');

// Mock the prompt function to return a resolved promise with the provided answers
inquirer.prompt = jest.fn().mockResolvedValue((userInput) => {
//   const answers = {};
//   for (const question of questions) {
//     answers[question.name] = `MockedAnswer_${question.name}`;
//   }
  return userInput;
});

module.exports = inquirer;
