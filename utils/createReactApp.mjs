import { execa } from "execa";
import ora from "ora";

export default async function createReactApp(projectName) {
  try {
    const spinner = ora("Creating React app").start();
    const { stdout } = await execa("npx", ["create-react-app", projectName]);
    spinner.succeed("React app created successfully.");
    return stdout;
  } catch (error) {
    return error.shortMessage;
  }
}
