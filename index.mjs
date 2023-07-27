import inquirer from "inquirer";
import { exit } from "process";
import ora, { spinners } from "ora";

import createReactApp from "./utils/createReactApp.mjs";
import { generateContent } from "./utils/contentGeneration.mjs";
import { createInstance } from "./utils/contentGeneration.mjs";
import modifyFiles from "./utils/modifyFiles.mjs";
import installDependencies from "./utils/installDependencies.mjs";
import createFoldersAndFiles from "./utils/createFoldersAndFiles.mjs";


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
  // console.log(projectName, prompt, apiKey, orgId);
  let openAiApi;
  try {
    // Create OpenAI API instance
    const spinner = ora("Creating OpenAI instance").start();
    openAiApi = await createInstance(apiKey, orgId);
    spinner.succeed("Instance created successfully!");
    // console.log(openAiApi);
  } catch (error) {
    console.error("Error creating OpenAI API instance:", error.message);
    exit(1);
  }

  //Create React app
  try {
    const createReactAppResult = await createReactApp(projectName);
  } catch (error) {
    console.error("Error creating React app:", error.message);
  }

  let finalPrompt = `Based on the directory structure of a create-react-app generated folder, give me code to ${prompt}. For all files and the code you give make sure to specify a directory structure in the format of ${projectName}/{foldername}, if the file belongs to a folder, at the top of each code. If a new folder is being created other than src and public, specify the name of the folders and their directory at the top of the response. Generate a maximum of 2000 tokens`;
  spinner = ora("Wielding AI powers").start();
  const content = await generateContent(openAiApi, finalPrompt);
  spinner.succeed("Returned Content is as follows:");
  console.log(content);
  // await createFoldersAndFiles(projectName, content);
}

promptUser();