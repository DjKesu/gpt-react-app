import fs from "fs-extra";

export default async function modifyFiles(projectName, componentName, generatedContent) {
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

