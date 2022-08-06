import { evaluate } from '../src/infix-stacks'
import { basic_tests } from './test-expressions';

describe('infix stacks evaluator', () => {
  basic_tests.forEach(t => {
    if (t.skipFor.includes('infix-stacks')) {
      test.skip(t.description, () => {})
      return true;
    }
    test(t.description, () => {
      const result = evaluate(t.expression)
      expect(result).toBe(t.answer)
    })
  })
});
