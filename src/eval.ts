// The simplest (and probably best) solution.  Given that the expressions are
// stated to all be valid, we can simply and safely use the language's built-in
// expression evaluator
//
// How to handle non-integer division is unspecified in the original instructions,
// so this more correct/powerful evaluator can give slightly different answers to
// implementations that assume integer division as we evaluate.
export function evaluate(expr: string):number {
    const result = eval(expr);
    // One "simulation" of integer division - floor at the end.  This gives
    // slightly different results for some tests! (and fails)
    return Math.floor(parseInt(result, 10));
}