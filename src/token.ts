export type TokenKind = 'operand' | 'operator';

export interface Token {
    text: string;
    kind: TokenKind;
}
