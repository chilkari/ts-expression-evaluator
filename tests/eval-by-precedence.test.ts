import { evaluate } from '../src/eval-by-precedence';
import { basic_tests } from './test-expressions';

describe('eval-based expression evaluator', () => {
  basic_tests.forEach(t => {
    if (t.skipFor.includes('eval-by-precedence')) {
      test.skip(t.description, () => {})
      return true;
    }
    test(t.description, () => {
      const result = evaluate(t.expression)
      expect(result).toBe(t.answer)
    })
  })
});
