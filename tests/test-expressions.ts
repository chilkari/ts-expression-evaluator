import { Token } from '../src/token';


interface IExpressionTest {
    description: string;
    expression: string;
    answer: number;
    tokens: Token[];
    skipFor: string[];
}

// A handful of basic tests which are all valid, non-empty expressions, and only
// include positive, integer operands and the four simple binary operators:
// [ +, -, *, / ]
export const basic_tests: Array<IExpressionTest> = [
    {
        description: "1+2. simple addition, two operands",
        expression: "1+2",
        answer: 3,
        tokens: [
            { text: '1', kind: 'operand' },
            { text: '+', kind: 'operator' },
            { text: '2', kind: 'operand' },
        ],
        skipFor: []
    },
    {
        description: "1 + 2 . two operands and whitespace",
        expression: "1 + 2 ",
        answer: 3,
        tokens: [
            { text: '1', kind: 'operand' },
            { text: '+', kind: 'operator' },
            { text: '2', kind: 'operand' },
        ],
        skipFor: []
    },
    {
        description: "23+2+473. simple addition, three operands, multiple numeric digits",
        expression: "23+2+473",
        answer: 498,
        tokens: [
            { text: '23', kind: 'operand' },
            { text: '+', kind: 'operator' },
            { text: '2', kind: 'operand' },
            { text: '+', kind: 'operator' },
            { text: '473', kind: 'operand' },
        ],
        skipFor: []
    },
    {
        description: "12-7. simple subtraction",
        expression: "12-7",
        answer: 5,
        tokens: [
            { text: '12', kind: 'operand' },
            { text: '-', kind: 'operator' },
            { text: '7', kind: 'operand' },
        ],
        skipFor: []
    },
    {
        description: "3*2. simple multiplication",
        expression: "3*2",
        answer: 6,
        tokens: [
            { text: '3', kind: 'operand' },
            { text: '*', kind: 'operator' },
            { text: '2', kind: 'operand' },
        ],
        skipFor: []
    },
    {
        description: "12/6. simple division",
        expression: "12/6",
        answer: 2,
        tokens: [
            { text: '12', kind: 'operand' },
            { text: '/', kind: 'operator' },
            { text: '6', kind: 'operand' },
        ],
        skipFor: []
    },
    {
        description: "12/5. simple integer division",
        expression: "12/5",
        answer: 2,
        tokens: [
            { text: '12', kind: 'operand' },
            { text: '/', kind: 'operator' },
            { text: '5', kind: 'operand' },
        ],
        skipFor: []
    },
    {
        description: "3+10*6. mult before add",
        expression: "3+10*6",
        answer: 63, // without order of operations, incorrect answer would be 78 (left-to-right)
        tokens: [
            { text: '3', kind: 'operand' },
            { text: '+', kind: 'operator' },
            { text: '10', kind: 'operand' },
            { text: '*', kind: 'operator' },
            { text: '6', kind: 'operand' },
        ],
        skipFor: []
    },
    {
        description: "1+2*5+2*3+4*6). multiple sections of interleaved precedence",
        expression: "1+2*5+2*3+4*6",
        answer: 41,
        tokens: [
            { text: '1', kind: 'operand' },
            { text: '+', kind: 'operator' },
            { text: '2', kind: 'operand' },
            { text: '*', kind: 'operator' },
            { text: '5', kind: 'operand' },
            { text: '+', kind: 'operator' },
            { text: '2', kind: 'operand' },
            { text: '*', kind: 'operator' },
            { text: '3', kind: 'operand' },
            { text: '+', kind: 'operator' },
            { text: '4', kind: 'operand' },
            { text: '*', kind: 'operator' },
            { text: '6', kind: 'operand' },
        ],
        skipFor: []
    },
    {
        description: "100-12/3. divide before subtract",
        expression: "100-12/3",
        answer: 96, // without order of operations, incorrect answer would be 29 (left-to-right)
        tokens: [
            { text: '100', kind: 'operand' },
            { text: '-', kind: 'operator' },
            { text: '12', kind: 'operand' },
            { text: '/', kind: 'operator' },
            { text: '3', kind: 'operand' },

        ],
        skipFor: []
    },
    {
        description: "3+10*6-23/4. instructions example",
        expression: "3+10*6-23/4",
        answer: 58, // Assumes integer division, remainders ignored! (fails with eval())
        tokens: [
            { text: '3', kind: 'operand' },
            { text: '+', kind: 'operator' },
            { text: '10', kind: 'operand' },
            { text: '*', kind: 'operator' },
            { text: '6', kind: 'operand' },
            { text: '-', kind: 'operator' },
            { text: '23', kind: 'operand' },
            { text: '/', kind: 'operator' },
            { text: '4', kind: 'operand' },
        ],
        skipFor: ['eval']
    },
]
