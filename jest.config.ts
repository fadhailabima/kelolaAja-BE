import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1"
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"]
};

export default config;
