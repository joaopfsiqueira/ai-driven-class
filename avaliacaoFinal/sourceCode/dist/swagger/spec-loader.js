"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiSpec = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const specPath = path_1.default.join(__dirname, "openapi.yaml");
const specYaml = fs_1.default.readFileSync(specPath, "utf8");
exports.openApiSpec = yaml_1.default.parse(specYaml);
//# sourceMappingURL=spec-loader.js.map