import { execa } from "execa";

export default async function installDependencies(projectName) {
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
