import inquirer from "inquirer";
import { Configuration, OpenAIApi } from "openai";
import execa from "execa";
import fs from "fs-extra";
import { exit } from "process";
import ora from "ora";

async function createReactApp(projectName) {
  try {
    const spinner = ora("Creating React app").start();
    const { stdout } = await execa("npx", ["create-react-app", projectName]);
    spinner.succeed("React app created successfully.");
    return stdout;
  } catch (error) {
    if (error.stdout.includes("conflict")) {
      return "React app already exists. Can't overwrite. Retry with a different name.";
    }
    return error.shortMessage;
  }
}

async function modifyComponentFile(
  projectName,
  componentName,
  generatedContent
) {
  const componentFilePath = `./${projectName}/src/${componentName}.js`;
  try {
    // Read the existing component file
    let componentFileContent = await fs.readFile(componentFilePath, "utf8");

    // Modify the content (replace a placeholder with the generated content)
    const placeholder = "// GPT_GENERATED_CONTENT";
    componentFileContent = componentFileContent.replace(
      placeholder,
      generatedContent
    );

    // Write the modified content back to the file
    await fs.writeFile(componentFilePath, componentFileContent, "utf8");

    console.log(`Modified ${componentName}.js with generated content.`);
  } catch (error) {
    console.error("Error modifying component file:", error.message);
  }
}

async function installDependencies(projectName) {
  try {
    // Change the working directory to the React app project
    process.chdir(projectName);

    // Install dependencies using npm
    await execa("npm", ["install"]);
    console.log("Dependencies installed successfully.");
  } catch (error) {
    console.error("Error installing dependencies:", error.message);
  }
}

async function generateContent(instance, prompt){
  const completion = await instance.createChatCompletion({
    model:"gpt-3.5-turbo",
    messages:[{'role':'user','content':prompt}],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1
  });
  return completion.data.choices[0].message.content;
}

async function createInstance(apiKey, orgId) {
  const openAiConfig = new Configuration({
    organization: orgId,
    apiKey: apiKey,
  });

  const openAiApi = new OpenAIApi(openAiConfig);
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

  // Create React app
  // try {
  //   const createReactAppResult = await createReactApp(projectName);
  // } catch (error) {
  //   console.error("Error creating React app:", error.message);
  // }

  let finalPrompt = `Based on the directory structure of a create-react-app generated folder, give me code to ${prompt}. For all files and the code you give make sure to specify a directory structure in the format of ${projectName}/{foldername}, if the file belongs to a folder, at the top of each code. If a new folder is being created other than src and public, specify the name of the folders and their directory at the top of the response. Generate a maximum of 2000 tokens`;
  const content = await generateContent(openAiApi, finalPrompt);
  console.log('Returned Content', content);
}

function run() {
  promptUser();
}

run();
