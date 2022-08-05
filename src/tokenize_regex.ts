// A tokenizer that uses a regex to split a string into tokens
// then a classifier to determine whether each token is an
// operator or an operand.

import { Token, TokenKind } from './token';

function classifyToken(input:string):Token {
    const text = input;
    let kind: TokenKind;
    // Classify the token.
    if (/^[0-9]/.test(text)) {
        kind = 'operand';
    } else {
        kind = 'operator';
    }
    return {
        text,
        kind: kind,
    }
}

export function tokenize(expression: string):Array<Token> {
    const tokenList: Token[] = [];
    // The following regex will match individual tokens globally across a full
    // expression string (returning multiple individual token matches):
    // Let's break it down:
    // ([0-9]+) -- Any number of digits.
    // | (OR)
    // ([\+\-*/]{1}) -- One operator ('+', '-', '*', '/') character
    const reToken = /([0-9]+)|([\+\-*/]{1})/g;
    for(;;) {
        const match = reToken.exec(expression);
        if (match === null) {
            break;
        }
        tokenList.push(classifyToken(match[0]));
    }
    return tokenList;
}