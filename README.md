# ts-expression-evaluator

A survey of solutions to the "String Expression Evaluator" problem sometimes used in technical coding interviews.

## Overview

It's been many (15?) years since I've done technical coding interviews as a candidate. After attempting this problem, and delivering a pretty lackluster performance, it turns out that I'm rusty! A nice way to brush up those skills is to use this problem as a study tool and identify better solutions than what I stumbled through in my recent attempt.

I'm new to both Typescript and this problem, so comments and improvements are welcome and encouraged!

## The Problem

Build a string calculator. Given a string input:

    "3+10*6-23/4"

You should write a piece of code that will:

* parse the string
* compute the result
* return the result

**Assumptions:**

* The string given is always a valid expression
* You should respect the presedence of the mathematical operations
* The string will only contain numbers and the characters `+-/*`

## Overview

The instructions hint how this problem can be broken down into sub-problems:

* **Parse**: First, the expression must be parsed. A solution should _tokenize_ the string expression into the important bits (_operands_ and _operators_) which make up the expression.
* **Evaluate**: Next those tokens should be organized into some structure that allows solving which honors proper order or operations. This is where it gets interesting! There are several ways to approach the solution.
* **Return**: Finally, return the result.

## Evaluation

The problem as described is a much-simplified form of a generic expression evaluator. It only supports integers, and only the four basic binary operators. This will bring up _pragmatism_ as an interview dimension. There are solutions to this problem that are shorter and easier to read, but would be more difficult to extend to support more complicated expressions. Does the candidate consider this tradeoff? Is there a solution that is _both_ concise and readable, but also extensible for more complicated requirements?

This problem is also complex enough to break into sub-parts. A strong candidate would ideally separate tokenizing the expression from evaluating the expression. When does the candidate begin to mentally break these apart? It can show how they compartmentalize a problem into its discrete parts.

How does the candidate collaborate? Do they make use of the interviewer and solicit input or feedback? In the real-world, developers get stuck or have tunnel vision. Good signals of a strong _collaborative_ candidate are good verbal descriptions of the thought process. Inviting suggestions or reviews along the way. Evaluating the input and not necessarily simply taking all suggestions as gospel, but also being open to different types of solutions.

## Solutions

### Tokenizing

* Regular Expression splitting
* Character-wise iteration

### Evaluating

* Using the built-in `eval()` ( [source](./src/eval.ts) | [tests](./tests/eval.test.ts) )
* Creating a parse or expression *tree*
* Converting to RPN notation, using stacks
* Simple, brute-force

### Using the built-in eval()

This is a "gimme" but shouldn't be ignored. An assumption is, "The string given is always a valid expression" - which means we can safely use the language's built-in `eval()` function. If this were the real world, this would likely be the best solution. Even without that assumption, it might be easier to _validate_ the input for safety versus write our own evaluator.

One interesting artifact is that the built-in `eval()` function is more powerful than our simplifed rules need. Our problem is limited to only integers and the four basic binary operators. So... the example problem given: `3+10*6-23/4` can actually return different answers, depending on the rules.

Let's look at how this expression would be evaluated by `eval()`:

* `3+10*6-23/4` - multiplication and division happen before addition and subtraction:
* `3+60-5.75` - _AH! Note the non-integer result from the division_
* `57.25` - **a floating-point-enabled evaluator gives this answer**

How should we handle non-integer results? Is that processing done during individual operation evaluation or at the end?

At least one of the referenced articles describing this solution adds a rule for _integer division: remainders are ignored_. If this rule is in place, it changes the answer:

* `3+10*6-23/4` - Again, multiplication/division first:
* `3+60-5` - _ignore remainder in the division (5.75 becomes 5)_
* `58` - **58 != 57 :)**

### References

* "[Simple Arithmetic Expression Evaluator](https://codinghelmet.com/exercises/expression-evaluator)", Zoran Horvat
* "[Building an Expression Evaluator](https://chidiwilliams.com/post/evaluator/)", Chidi Williams
* "[Writing a Simple Expression Evaluator](https://www.strchr.com/expression_evaluator)", Peter Kankowski
* "[Create Your Own Expression Parser](https://levelup.gitconnected.com/create-your-own-expression-parser-d1f622077796)", Don Cross
* "[7.9: Example: Expression Evaluator](https://www.oreilly.com/library/view/the-go-programming/9780134190570/ebook_split_068.html)", _The Go Programming Language_, Alan A. A. Donovan, Brian W. Kernighan

