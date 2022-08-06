
/*
Create a list of operators in precedence order: ["/", "*", "-", "+"]

Loop through the operators, and for each:
Comb the string expression for number, current operator, number
evaluate each match to a single number and replace it back into original expression.

Continue until we're done.

For example:

"3+10*6-23/4"

For op in operators
First loop, op="/"
current regex = "[0-9]+" + currentOp + "[0-9]+"

for m in matches against "3+10*6-23/4":
one match: "23/4"
Eval to get answer of 5 (int division)
Replace "23/4" with "5" in original expression

3+10*6-5

Repeat for * (3+60-5)
Repeat for - (3+55)
Repeat for + (58)
*/

const numericRE = "([0-9]+)"
const divRE = "/"
const multRE = "\\*"
const subRE = "\\-"
const addRE = "\\+"
const wsRE = "\\s*" // optional match of whitespace between numerics and operators

const opsByPrecedence = [divRE, multRE, subRE, addRE];

interface calculation {
    (a: number, b: number): number,
}

const splitters = new Map<string, string>();
splitters.set(divRE, '/');
splitters.set(multRE, '*');
splitters.set(subRE, '-');
splitters.set(addRE, '+');

const calcs = new Map<string, calculation>();
calcs.set(divRE, function(a:number , b:number):number { return Math.floor(a/b)});
calcs.set(multRE, function(a:number , b:number):number { return a*b; });
calcs.set(subRE, function(a:number , b:number):number { return a-b; });
calcs.set(addRE, function(a:number , b:number):number { return a+b; });

function calc(expr: string, opRE: string): number {
    if (!calcs.has(opRE)) {
        throw "Unexpected opRE";
    }
    const calcFN = calcs.get(opRE) as Function;
    const splitter = splitters.get(opRE) as string;
    const operands = expr.split(splitter);
    const result = calcFN(parseInt(operands[0], 10), parseInt(operands[1], 10));
    return result;
}

export function evaluate(expr: string): number {
    let workingExpr = expr;
    opsByPrecedence.forEach(opRE => {
        const fullRE = new RegExp(numericRE + wsRE + opRE + wsRE + numericRE, 'g');  // i.e. /[0-9]+/[0-9]+/ - matches something like "23/4"
        let matches = workingExpr.match(fullRE) || [];
        while (matches.length) {
            matches.forEach(m => {
                const result = calc(m, opRE);
                workingExpr = workingExpr.replace(m, result.toString());
            })
            matches = workingExpr.match(fullRE) || [];
        }
    })

    return parseInt(workingExpr, 10);
}