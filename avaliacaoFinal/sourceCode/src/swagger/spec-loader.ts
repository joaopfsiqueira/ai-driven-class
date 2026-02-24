import fs from "fs";
import path from "path";
import yaml from "yaml";

const specPath = path.join(__dirname, "openapi.yaml");
const specYaml = fs.readFileSync(specPath, "utf8");
export const openApiSpec = yaml.parse(specYaml) as Record<string, unknown>;
