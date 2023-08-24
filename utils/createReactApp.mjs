import { execa } from "execa";
import ora from "ora";

export default async function createReactApp(projectName) {
  try {
    // const spinner = ora("Creating React app\n").start();
    const { stdout } = await execa("npx", ["create-react-app", projectName]);
    return stdout;
  } catch (error) {
    return error.shortMessage;
  }
}
