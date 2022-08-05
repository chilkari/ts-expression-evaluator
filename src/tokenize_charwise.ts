// A character-by-character tokenizer (that still uses regular expressions for
// individual character classification)

import { Token, TokenKindOperand, TokenKindOperator } from './token';

export function tokenize(expression: string):Array<Token> {
    const tokens: Token[] = [];

    let currentText = '';
    let currentKind = TokenKindOperator;

    for (let i=0; i<expression.length; i++) {
        const ch = expression[i];
        if (/[0-9]/.test(ch)) {
            // We have an operand (or another character on the current operand)
            if (currentKind != TokenKindOperand) { // switching tokens
                if (currentText) {
                    tokens.push({ text: currentText, kind: currentKind });
                }
                currentText = '';
            }
            currentKind = TokenKindOperand;
            currentText += ch;
        } else if (/[\+\-*/]/.test(ch)) {
            // We have an operator
            if (currentKind != TokenKindOperator) { // switching tokens
                if (currentText) {
                    tokens.push({ text: currentText, kind: currentKind });
                }
                currentText = '';
            }
            currentKind = TokenKindOperator;
            currentText += ch;
        }
        // By not adding currentText here, we avoid non-operand/operator chars (whitespace, etc.)
    };
    // push the last token
    tokens.push({ text: currentText, kind: currentKind });
    return tokens;
}
