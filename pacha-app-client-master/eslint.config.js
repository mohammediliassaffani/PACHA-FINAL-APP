const path = require("path");

module.exports = {
	// Define the environments your code is designed to run in
	env: {
		browser: true, // Enable browser global variables
		es2021: true, // Enable ES2021 globals and syntax
		node: true, // Enable Node.js global variables and Node.js scoping
	},
	// Specify the parser and parser options
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true, // Enable JSX
		},
		ecmaVersion: 12, // Use the latest ECMAScript standard
		sourceType: "module", // Allow the use of imports
		project: "./tsconfig.json", // Specify your TypeScript configuration
	},
	// Extend recommended configurations and plugins
	extends: [
		"eslint:recommended",
		"plugin:react/recommended", // React specific linting rules
		"plugin:@typescript-eslint/recommended", // TypeScript specific linting rules
		"plugin:tailwindcss/recommended", // Tailwind CSS specific linting rules
		"prettier", // Integrate Prettier for code formatting
	],
	// Specify plugins used
	plugins: [
		"unicorn",
		"@typescript-eslint",
		"unused-imports",
		"tailwindcss",
		"simple-import-sort",
		"react", // React plugin for ESLint
		"react-hooks", // React hooks plugin for ESLint
	],
	// Define global variables
	globals: {
		React: "writable", // React must be in scope when using JSX
	},
	// Custom rules
	rules: {
		// Enforce kebab-case for filenames, excluding specific directories
		"unicorn/filename-case": [
			"error",
			{
				case: "kebabCase",
				ignore: ["/node_modules/", "/public/", "/src/assets/"],
			},
		],
		// Limit the number of parameters in functions to encourage using objects
		"max-params": ["error", 3],
		// Limit the number of lines per function
		"max-lines-per-function": ["error", 70],
		// Disable rules that are not relevant or cause friction
		"react/display-name": "off",
		"react/no-unknown-property": ["error", { ignore: ["className"] }],
		"react/destructuring-assignment": "off",
		"react/require-default-props": "off",
		// TypeScript specific rules
		"@typescript-eslint/comma-dangle": "off",
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports",
				disallowTypeAnnotations: true,
			},
		],
		"@typescript-eslint/no-unused-vars": "off",
		// Import related rules
		"import/prefer-default-export": "off",
		"import/no-cycle": ["error", { maxDepth: Infinity }],
		// Tailwind CSS specific rules
		"tailwindcss/classnames-order": [
			"warn",
			{
				officialSorting: true,
			},
		],
		"tailwindcss/no-custom-classname": "off",
		// Simple Import Sort rules
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
		// Unused imports rules
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"error",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			},
		],
		// Additional rules for better React Hooks usage
		"react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
		"react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
	},
	// Settings for React
	settings: {
		react: {
			version: "detect", // Automatically detect the React version
		},
	},
	// Overrides for specific file patterns
	overrides: [
		// Configuration for translation files (i18next)
		{
			files: ["src/translations/*.json"],
			extends: ["plugin:i18n-json/recommended"],
			rules: {
				"i18n-json/valid-message-syntax": [
					"error",
					{
						syntax: path.resolve("./scripts/i18next-syntax-validation.js"),
					},
				],
				"i18n-json/valid-json": "error",
				"i18n-json/sorted-keys": [
					"error",
					{
						order: "asc",
						indentSpaces: 2,
					},
				],
				"i18n-json/identical-keys": [
					"error",
					{
						filePath: path.resolve("./src/translations/en.json"),
					},
				],
				"prettier/prettier": [
					"off",
					{
						singleQuote: true,
						endOfLine: "auto",
					},
				],
			},
		},
		// Configuration for testing files
		{
			files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
			extends: ["plugin:testing-library/react", "plugin:jest/recommended"],
			rules: {
				// You can add or override rules specific to testing files here
			},
		},
	],
};
