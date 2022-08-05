import { tokenize } from '../src/tokenize_charwise';
import { basic_tests } from './test-expressions';

describe('charwise tokenizer', () => {
  basic_tests.forEach(t => {
    // no skip for token tests. Should work for all
    test.only(t.description, () => {
      const result = tokenize(t.expression)
      expect(result.length).toBe(t.tokens.length)
      result.forEach((_,i) => {
          expect(result[i].text).toBe(t.tokens[i].text);
          expect(result[i].kind).toBe(t.tokens[i].kind);
      })
    })
  })
});

