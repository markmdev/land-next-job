import * as fs from "fs";
import * as Path from "path";

export function readFile(pathString: string) {
  console.log("Reading file", pathString);
  const path = Path.resolve(pathString);
  if (!fs.existsSync(path)) {
    throw new Error(`File ${path} does not exist`);
  }
  return fs.readFileSync(path, "utf8");
}
