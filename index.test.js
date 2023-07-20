const { promptUser } = require('./index.mjs');

test("promptUser should return user input object", async () => {
  const userInput = {
    projectName: "MyProject",
    prompt: "Hello, world!",
    openAIKey: "123456789",
    orgId: "my-org-id",
  };

  // Mock the user input using jest.fn() and provide the expected values
  inquirer.prompt = jest.fn().mockResolvedValue(userInput);

  // Call the function being tested
  const result = await promptUser();

  // Assert that the result matches the expected user input
  expect(result).toEqual(userInput);
});
