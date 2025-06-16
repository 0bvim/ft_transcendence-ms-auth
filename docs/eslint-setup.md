# ESLint Configuration Guide

This document outlines the ESLint configuration used in this project and provides guidance on how to maintain and extend it.

## Overview

Our ESLint setup follows community standards and best practices for TypeScript projects. We use the ESLint configuration format compatible with ESLint v8.x.

## Configuration Details

The main configuration file is `.eslintrc.js` in the project root. It includes:

- JavaScript recommended rules
- TypeScript ESLint recommended rules
- Integration with Prettier
- Custom rule configurations tailored for our project

## Key Features

1. **TypeScript Integration**
   - Static type checking
   - TypeScript-specific rules
   - Return type enforcement

2. **Code Quality Rules**
   - No unused variables (with exceptions for variables prefixed with `_`)
   - No explicit `any` types
   - No non-null assertions
   - Proper Promise handling

3. **Style Guidelines**
   - Consistent formatting with Prettier integration
   - Preference for const over let
   - Modern JavaScript features (template literals, object shorthand)

4. **Special Configurations**
   - Relaxed rules for test files
   - Node.js environment settings

## Using ESLint

### Running Linting

```bash
# Run ESLint on all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### VS Code Integration

For real-time linting in VS Code, install the ESLint extension and add the following to your workspace settings:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "typescript"]
}
```

## Adding or Modifying Rules

To modify the ESLint configuration:

1. Edit `.eslintrc.js`
2. Consider the impact of rule changes on existing code
3. Document significant changes in the PR description

## Common Issues and Solutions

### Working with Third-Party Libraries

When working with libraries that don't have proper TypeScript typings, you might need to temporarily disable certain rules:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const result: any = thirdPartyFunction();
```

### Rule Exceptions in Our Codebase

Our ESLint configuration includes specific rule exceptions for certain files:

1. **Prisma Client Setup** (`src/utils/prisma.ts`):
   - The `no-var` rule is disabled as `var` is required for global declarations in this context.

2. **Config Utility** (`src/utils/config.ts`):
   - Non-null assertions are allowed in this file as we're dealing with environment variables that we've already validated.

3. **Type Definitions** (`src/types/common.types.ts`, `src/types/user.types.ts`):
   - Some TypeScript-specific rules are relaxed for type definition files to allow for more flexible type declarations.

4. **Utility Functions** (`src/utils/bcrypt.ts`):
   - The `require-await` rule is disabled for certain functions that are marked async for API consistency but may not contain await expressions.

### Testing-Specific Patterns

Test files often have different requirements. We've already relaxed some rules for test files, but if you need additional exceptions, consider adding them to the test-specific configuration section.

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [ESLint v8 Configuration Guide](https://eslint.org/docs/user-guide/configuring/)