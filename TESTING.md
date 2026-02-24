# Testing

This project uses Jest for unit testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- `tests/setup.ts` - Jest setup file with DOM mocks
- `tests/sheet-utils.test.ts` - Tests for utility functions in `src/sheet/utils.ts`
- `tests/sparsegrid.test.ts` - Tests for the SparseGrid class
- `tests/expressionparser.test.ts` - Tests for the ExpressionParser class

## Configuration

Jest is configured in `jest.config.js` with:
- TypeScript support via `ts-jest`
- jsdom environment for DOM testing
- Setup file for mocking browser APIs
- Coverage collection from source files
