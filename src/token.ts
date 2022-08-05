export type TokenKind = 'operand' | 'operator';

export const TokenKindOperand:TokenKind = 'operand';
export const TokenKindOperator:TokenKind = 'operator';

export interface Token {
    text: string;
    kind: TokenKind;
}
