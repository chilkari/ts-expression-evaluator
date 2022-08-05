// The simplest (and probably best) solution.
// Given that the expressions are stated to all
// be valid, we can simply and safely use the 
// language's built-in expression evaluator
export function evaluate(expr: string):number {
    const result = eval(expr);
    return Math.floor(parseInt(result, 10));
}