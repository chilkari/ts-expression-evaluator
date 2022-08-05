type expressionTest = {
    description: string;
    expression: string;
    answer: number;
}

// Tests which are all valid, non-empty expressions, and
// only include positive, integer operands and the four
// simple binary operators: [ +, -, *, / ]
export const basic_tests: Array<expressionTest> = [
    { description: "simple addition, two operands", expression: "1+2", answer: 3},
    { description: "simple addition, three operands, multiple numeric digits", expression: "23+2+473", answer: 498},
    { description: "simple subtraction", expression: "12-7", answer: 5},
    { description: "simple multiplication", expression: "3*2", answer: 6},
    { description: "simple division", expression: "12/6", answer: 2},
    { description: "simple integer division", expression: "12/5", answer: 2}, // integer division. Any remainder is ignored.
    { description: "mult before add", expression: "3+10*6", answer: 63}, // without order of operations, incorrect answer would be 78 (left-to-right)
    { description: "divide before subtract", expression: "100-12/3", answer: 96}, // without order of operations, incorrect answer would be 29 (left-to-right)
    { description: "instructions example", expression: "3+10*6-23/4", answer: 58},
]

3+10*6-23/4
3+60-5
63-5

// Tests which include more advanced expressions, including
// parentheses, the "^" power of binary operator, a
// "sqrt" square root operator and unary operators: [ +, - ]
export const advanced_tests: Array<expressionTest> = [
    { description: "empty string", expression: "", answer: 0},
]

// Tests which include various invalid expressions
export const error_tests: Array<expressionTest> = [
]