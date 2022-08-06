import { Token, TokenKindOperand } from './token'
import { tokenize } from './tokenize_regex';

/*
Given an expression in infix notation (1+3*5), hold values and operators in a
pair of stacks so that we can evaluate individual expressions at the appropriate
time. Once evaluated, a given answer is placed back on the stack allowing
continued evaluation.

Simplified logic:

opStack = []
valueStack = []

process tokens in order:
  if token is number, push on value stack
  if token is operator, see if the -previous- operator should be evaluated.
    if so, pop two operands and previous operator. Evaluate, and push result back onto values stack
    push operator on operator stack.
After all tokens processed, evaluate anything remaining in the stacks.
We should be left with a single value in the value stack.
*/
// Technically this is a "binaryOperator" as it requires two operands
interface operator {
    precedence: number; // Higher precedence evaluates first
    text: string; // e.g. "+", "-", "*", etc.
    op(a: number, b: number): number;
}

const opAdd: operator = { precedence: 10, text: "+", op: function(a,b) { return a+b; } };
const opSubtract: operator = { precedence: 10, text: "-", op: function(a,b) { return a-b; } };
const opMultiply: operator = { precedence: 20, text: "*", op: function(a,b) { return a*b; } };
const opDivide: operator = { precedence: 20, text: "/", op: function(a,b) { if (b != 0) { return Math.floor(a/b); } else { throw "b cannot be 0"; }} };

function processTokens(tokens: Token[]): number {
    // Stack of numeric values
    const vStack: number[] = [];
    // Stack of operators
    const opStack: operator[] = [];

    tokens.forEach((t,i) => {
        if (isValue(t)) {
            vStack.push(parseInt(t.text, 10))
        } else if (isOperator(t)) {
            if (opStack.length && operatorCausesEvaluation(opFromString(t.text), opStack[opStack.length-1])) {
                executeOperator(vStack, opStack); // Executes _previous_ operator (not current)
            }
            opStack.push(opFromString(t.text))
        }
    })
    // Now, we need to process anything remaining in the stack
    while (opStack.length) {
        executeOperator(vStack, opStack);
    }
    if (vStack.length == 0) {
        throw ("Unable to evaluate. No final value available.");
    }
    return (vStack.pop() as number);
}

function executeOperator(vStack: number[], opStack: operator[]) {
    if (vStack.length < 2) {
        throw "To execute, vStack must have at least two members"
    }
    if (opStack.length < 1) {
        throw "To execute, opStack must have at least one member"
    }

    const rightOperand = vStack.pop() as number;
    const leftOperand = vStack.pop() as number;
    const currentOperator = opStack.pop() as operator;
    const evaluated = currentOperator.op(leftOperand, rightOperand);
    vStack.push(evaluated as number);
}

function opFromString(s: string): operator {
    switch(s) {
        case '+':
            return opAdd;
        case "-":
            return opSubtract;
        case "*":
            return opMultiply;
        case "/":
            return opDivide;
        default:
            throw("Unrecognized operator");
    }
}

function operatorCausesEvaluation(currentOp: operator, previousOperator: operator): boolean {
    return previousOperator.precedence >= currentOp.precedence;
}

function isValue(token: Token): boolean {
    return /[0-9]+/.test(token.text);
}

function isOperator(token: Token): boolean {
    return /[\+\-*/]{1}/.test(token.text);
}

export function evaluate(expr: string):number {
    const tokens = tokenize(expr);
    return processTokens(tokens);
}