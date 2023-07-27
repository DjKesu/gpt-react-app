import fs from "fs-extra";

export default async function createFoldersAndFiles(projectFolder, content) {
  const codeSegments = content.split("In");
  const directoryStructure = codeSegments.shift().trim();

  // Create the projectFolder if it doesn't exist
  if (!(await fs.pathExists(projectFolder))) {
    await fs.mkdir(projectFolder);
  }

  // Function to create directories and files recursively
  async function createDirectoriesAndFiles(directory, currentPath = "") {
    for (const line of directory.split("\n")) {
      if (line.trim() === "") continue;

      const [, folderName, fileName] = line.match(/-\s([\w-.]+)(?:\.(\w+))?$/);

      const fullPath = path.join(projectFolder, currentPath, folderName);
      const isFile = !!fileName;

      if (isFile) {
        const codeContent = codeSegments.shift().trim();

        await fs.writeFile(path.join(fullPath, fileName), codeContent);
      } else {
        await fs.mkdir(fullPath);

        const subdirectory = codeSegments.shift().trim();
        await createDirectoriesAndFiles(
          subdirectory,
          path.join(currentPath, folderName)
        );
      }
    }
  }

  await createDirectoriesAndFiles(directoryStructure);
}
