import { evaluate } from '../src/tree'
import { basic_tests } from './test-expressions';

describe('tree evaluator', () => {
  basic_tests.forEach(t => {
    if (t.skipFor.includes('tree')) {
      test.skip(t.description, () => {})
      return true;
    }
    test(t.description, () => {
      const result = evaluate(t.expression)
      expect(result).toBe(t.answer)
    })
  })
});
