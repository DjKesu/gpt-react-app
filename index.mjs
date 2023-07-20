import inquirer from "inquirer";
import { Configuration, OpenAIApi } from "openai";

async function createInstance(apiKey, orgId) {
  // Input checks
  if (typeof apiKey !== "string" || apiKey.length !== 64) {
    throw new Error(
      "Invalid API key format. Please provide a valid OpenAI API key."
    );
  }

  if (typeof orgId !== "string" || orgId.length === 0) {
    throw new Error(
      "Invalid organization ID format. Please provide a valid OpenAI organization ID."
    );
  }
  console.log("Input checks passed");
  console.log("Creating OpenAI API instance");
  const openAiConfig = new Configuration({
    organization: orgId,
    apiKey: apiKey,
  });

  const openAiApi = new OpenAIApi(openAiConfig);
  console.log("OpenAI API instance created");
  return openAiApi;
}

async function promptUser() {
  // Get user's project name, prompt, openAI key, and openAI orgId
  const { projectName, prompt, apiKey, orgId } = await inquirer.prompt([
    {
      name: "projectName",
      message: "Enter the name of the project you intend on building today",
      type: "input",
    },
    {
      name: "prompt",
      message: "What are we building today?",
      type: "input",
    },
    {
      name: "apiKey",
      message:
        "Enter your OpenAI API key (We never store this information and delete it right after execution)",
      type: "input",
    },
    {
      name: "orgId",
      message: "What is your OpenAI organization ID?",
      type: "input",
    },
  ]);
  console.log(projectName, prompt, apiKey, orgId);

  // Create OpenAI API instance
  try {
    // Create OpenAI API instance
    const openAiApi = await createInstance(apiKey, orgId);
    console.log(openAiApi);
  } catch (error) {
    console.error("Error creating OpenAI API instance:", error.message);
  }
}

function run() {
  promptUser();
}

run();
