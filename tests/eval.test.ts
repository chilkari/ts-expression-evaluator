import { evaluate } from '../src/eval';
import { basic_tests } from './test-expressions';

// These tests cover the original instructions:
// * Assumptions:
// * - The string given is always a valid expression
// * - You should respect the presedence of the mathematical operations
// * - The string will only contain numbers and the characters '+-/*'

describe('eval-based expression evaluator', () => {
  basic_tests.forEach(t => {
    test(t.description, () => {
      const result = evaluate(t.expression)
      expect(result).toBe(t.answer)
    })
  })
});
