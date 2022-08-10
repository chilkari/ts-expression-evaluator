/*
This was the original (and very odd) solution I ended up going for in my recent
live attempt at this problem. It's a strange solution .... but does work.

We create a regex that identifies the numeric parts of the expression
(ordinals). Then use that to _split_ the original string, which should leave only
the operators (at least in the simple case laid out in the instructions).

We take the same approach to split the original string using a regex which only
matches operators (leaving only the ordinals).

We now have two arrays: operators and ordinals in expression order. We loop over
the operators and keep track of where we are in the other array.

Each time we find an operator we can work with, we evaluate the operation, and
update the corresponding arrays in place using `splice()` with the result. This
is quite similar to the eval-by-precedence solution here, but modifies arrays
instead of string expressions.

My original attempt was pretty rough: It had repeated loops for the *, / pair of
operators and a second loop for +,- operators.

This has been revised to have a single list of `operation` functions which are
keyed by their string operator and kept in precedence order. This allows a set
of loops:

1. Loop over each operator in predence order
2. For each operator, loop the original input arrays repeatedly until that
   operator has been completely evaluated
3. Within this multiple repetitions per operator, look at each operator from the
   input, and if it matches the current operator by precedence, evaluate and
   replace.

One other bug/improvement to the original was to trim out any whitespace within
the original input before splitting into arrays.

*/

type operation = {
    (a:number, b:number): number,
}

const operationAdd: operation = function(a: number, b: number) { return a+b; }
const operationSubtract: operation = function(a: number, b: number) { return a-b; }
const operationMultiply: operation = function(a: number, b: number) { return a*b; }
const operationDivide: operation = function(a: number, b: number) {
    if (b == 0) {
        throw "Cannot divide by zero"
    }
    return Math.floor(a/b);  // integer division
}

// Precedence order
const operations = new Map([
    ["*", operationMultiply],
    ["/", operationDivide],
    ["+", operationAdd],
    ["-", operationSubtract],
]);


export function evaluate(input: string): number {
  // First, eliminate any whitespace from the input
  const cleaned = input.replace(/\s+/g, "");
  const numRE = /\d+/;
  const opRE = /[+\-/*/]/;
  const operators = cleaned.split(numRE).filter(e => (e)) // in order
  let numerics:Array<number> = input.split(opRE).map(e => parseInt(e, 10))

  operations.forEach((opFN, currentOp) => {
    // Continuously loop over the operators until the currentOp no longer matches (process all "*" before moving onto "+", for example)
    for(;;) {
        let currentOperationComplete = true; // We'll unset this if we find a match
        // Loop over operators with an index that can be used against numerics as well.
        for (let i=0; i<operators.length; i++) {
            // i becomes an aligned counter for both operators/numerics arrays
            const o = operators[i];
            const n1 = numerics[i];
            const n2 = numerics[i+1];
            if (o == currentOp) {
                currentOperationComplete = false;
                const res = opFN(n1, n2);
                numerics.splice(i, 2, res);
                operators.splice(i, 1);
            }
        }
        if (currentOperationComplete) {
            break;
        }
    }
  });

  if (numerics.length > 1) {
    throw "Unable to evaluate. Not left with a single result!"
  }

  return numerics[0];
}
