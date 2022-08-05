interface IExpressionTest {
    description: string;
    expression: string;
    answer: number;
    skipFor: Array<string>;
}

// A handful of basic tests which are all valid, non-empty expressions, and only
// include positive, integer operands and the four simple binary operators: 
// [ +, -, *, / ]
export const basic_tests: Array<IExpressionTest> = [
    { description: "simple addition, two operands", expression: "1+2", answer: 3, skipFor: [] },
    { description: "simple addition, three operands, multiple numeric digits", expression: "23+2+473", answer: 498, skipFor: [] },
    { description: "simple subtraction", expression: "12-7", answer: 5, skipFor: [] },
    { description: "simple multiplication", expression: "3*2", answer: 6, skipFor: [] },
    { description: "simple division", expression: "12/6", answer: 2, skipFor: [] },
    { description: "simple integer division", expression: "12/5", answer: 2, skipFor: [] }, // Remainder is ignored.
    { description: "mult before add", expression: "3+10*6", answer: 63, skipFor: [] }, // without order of operations, incorrect answer would be 78 (left-to-right)
    { description: "divide before subtract", expression: "100-12/3", answer: 96, skipFor: [] }, // without order of operations, incorrect answer would be 29 (left-to-right)
    { description: "instructions example", expression: "3+10*6-23/4", answer: 58, skipFor: ['eval'] }, // Assumes integer division, remainders ignored! (fails with eval())
]