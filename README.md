# ts-expression-evaluator

A survey of solutions to the "String Expression Evaluator" problem sometimes
used in technical coding interviews.

## Overview

It's been many (15?) years since I've done technical coding interviews as a
candidate. After attempting this problem, and delivering a pretty lackluster
performance, it turns out that I'm rusty! A nice way to brush up those skills is
to use this problem as a study tool and identify better solutions than what I
stumbled through in my recent attempt.

I'm new to both Typescript and this problem, so comments and improvements are
welcome and encouraged!

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

* **Parse**: First, the expression must be parsed. A solution should _tokenize_
  the string expression into the important bits (_operands_ and _operators_)
  which make up the expression.
* **Evaluate**: Next those tokens should be organized into some structure that
  allows solving which honors proper order of operations. This is where it gets
  interesting! There are several ways to approach the solution.
* **Return**: Finally, return the result.

## Solutions Overview

### Tokenizing

* Regular Expression tokenizer ( [source](./src/tokenize_regex.ts) | [tests](./tests/tokenize_regex.test.ts) )
* Character-wise iteration tokenizer ( [source](.src/tokenize_charwise.ts) | [tests](./tests/tokenize_charwise.test.ts) )

### Evaluating

* Using the built-in `eval()` ( [source](./src/eval.ts) |
  [tests](./tests/eval.test.ts) )
* Tokens in infix notation order. Examine left-to-right, using stacks to decide when to evaulate. ( [source](./src/infix-stacks.ts) | [tests](./tests/eval.test.ts) )
* Converting to RPN notation, using stacks (**TO DO**)
* Brute-force evaluation (no separate tokenization) of sub expressions, using a list of operators in precedence order. ( [source](./src/eval-by-precedence.ts) | [tests](./tests/eval-by-precedence.test.ts))
* A 'split' solution separating operators and operands into two arrays, then evaluating. This was where I was heading in my incomplete attempt, and I'd like to see if it actually works. ( [source](./src/array-split.ts) | [tests](./tests/array-split.test.ts) )

## Discussion of Different Implementations

### Tokenizing

#### Regular Expression Tokenizer

[Source](./src/tokenize_regex.ts)

With a single regular expression we can match one of two operator types:

* `[0-9]+` - any number of digits (an operand)
* `[\+\-*/]{1}` - one of the four one-character operators

Using the global regex flag, we'll get a match for each individual token in the
entire string. At the time we detect an individual token, we can also classify
that token as either operand or operator and set a `kind` property on our custom
`Token` interface so that future consumers can easily determine which it is.

The regular expressions here nicely grab entire tokens as individual matches.
Developers have varying familiarity with regular expressions. If the regex
itself can be easily understood then the remaining code is shorter and easier to
understand than the character-wise tokenizer, and would be much easier to extend
for additional cases.

#### Character-wise Expression Tokenizer

[Source](./src/tokenize_charwise.ts)

This tokenizer iterates over every character in the expression keeping track of
a current token (with `text` and `kind` properties). When it switches token
kinds, it pushes the previous token onto a built-up list of tokens. As the loop
exits, it pushes the final token to the list and returns.

While this tokenizer works, it's slightly longer with some duplication. It's
also more fragile than the pure regular expression tokenizer. Should we need to
extend to cover other cases, that fragility could make it more difficult to
extend.

### Evaluating

### Using the built-in eval()

[Source](./src/eval.ts)

This approach is a "gimme" but shouldn't be ignored. An assumption is, "The
string given is always a valid expression" - which means we can safely use the
language's built-in `eval()` function. If this were the real world, this would
likely be the best solution. Even without that assumption, it might be easier to
_validate_ the input for safety versus write our own evaluator.

One interesting artifact is that the built-in `eval()` function is more powerful
than our simplifed rules need. Our problem is limited to only integers and the
four basic binary operators. So... the example problem given: `3+10*6-23/4` can
actually return different answers, depending on the rules.

Let's look at how this expression would be evaluated by `eval()`:

* `3+10*6-23/4` - multiplication and division happen before addition and subtraction:
* `3+60-5.75` - _AH! Note the non-integer result from the division_
* `57.25` - **a floating-point-enabled evaluator gives this answer**

How should we handle non-integer results? Is that processing done during
individual operation evaluation or at the end?

At least one of the referenced articles describing this solution adds a rule for
_integer division: remainders are ignored_. If this rule is in place, it changes
the answer:

* `3+10*6-23/4` - Again, multiplication/division first:
* `3+60-5` - _ignore remainder in the division (5.75 becomes 5)_
* `58` - **58 != 57 :)**

### Using a pair of stacks to hold operands and operators until appropriate evaluation time

[Source](./src/infix-stacks.ts)

When evaluating a simple expression like `2+3*7`, seeing the individual
tokens from left to right, we need some sort of "memory" to wait to evaluate the
"+" until after the "*" has been evaluated.

In this solution, we create a pair of stacks: One for values and one for
operators. Anytime we encounter an operator, if its precedence is greater than
or equal to the previous operator, the _previous_ operator can be evaluated. So we
can pop two values and the previous operator and evaluate them. The resulting
single number is then pushed back onto the value stack. We also still have the
_current_ operator handy which goes onto the operators stack.

Once we've seen all tokens, we have to take one final step to go through
anything left in the stacks.

Let's walk the simple example above step by step:

* Token = "2", vStack=[], opStack=[].
  * **Push "2" onto value stack**
* Token = "+", vStack=[`2`], opStack=[].
  * **No 'previous' op. Push "+" onto opStack**
* Token = "3", vStack=[`2`], opStack=[+].
  * **Push "3" onto value stack**
* Token = "*", vStack=[`2,3`], opStack=[`+`].
  * **Prev op = "+". * >= + in precedence. Pop 2 vals (2 and 3) and eval prev op "+". Push result "5" to vStack.**
* Token = "7", vStack=[`5`], opStack=[`*`].
  * **Push "7" onto value stack**
* Done with tokens. Final processing of anything remaining. vStack=[`5,7`], opStack=[`*`].
  * **Pop two operands (5,7) and op (*). Eval to "35" push result to vStack.**
* No operators left. Pop single value "35" from vStack which is the final answer and return.

### Brute Force Multiple Passes over expression, evaluating in precedence order

[Source](./src/eval-by-precedence.ts)

In this approach, we build a list of operators in precedence order, `\, *, -, +`. Then we repeatedly examine the expression for sub-expressions containing the current operator. We evaluate that sub-expression, substituting the answer for the original part, simplifying the overall expression down to the point where it only contains a single number. Using the instructions example:

* `3+10*6-23/4` - First search for "number / number" sub-expressions (division) and evaluate each. Specifically, replace "23/4" with 5 (integer division)
* `3+10*6-5` - Search resulting expression for multiplication sub-expressions. In our case, replace "10*6" with "60"
* `3+60-5` - Search resulting expression for subtraction sub-expressions. In this case, replace "60-5" with "55"
* `3+55` - Search resulting expression for addition sub-expressions. In this case, replace "3+55" with "58"
* `58` - nothing left to do. Return this result.

**Some gotchas**
* We need to continuously loop each operator until there is nothing left. We can't just use the initial set of matches and must _re-match_ each modified expression for the current operator until none remain.
* If we want to support whitespace between things, we need to include that as part of our search regular expression.
* As this makes heavy use of dynamic regular expressions, it's all a bit unwieldy because of escaping.

### Split input into pair of arrays for operators and ordinals

[Source](./src/array-split.ts)

I included this one because it was originally the approach I took in my recent attempt. To be clear, my first cut at this wasn't complete and had several issues. The example shown here is what that approach _could_ look like if taken to its conclusion.

It's extremely similar to the "Brute Force Multiple Passes" example shown above. But instead of using dynamic regular expressions for substitution of evaluated expressions, it initially splits the input expression into two arrays: One containing operators and the other containing operands.

By looping over the operators with an index, we can use that index to grab the two (binary) operands from the other array which correspond to this operator. We can evaluate, then `splice()` both arrays, removing the operators as it has been dealt with, and replacing the two operands with the single result. By looping over these pairs of arrays repeatedly, we can reduce the original expression down to a single result value.

The other thing I added was a simple whitespace trimmer before splitting to allow expressions like "1 + 2" to succeed.

### References

* "[Simple Arithmetic Expression Evaluator](https://codinghelmet.com/exercises/expression-evaluator)", Zoran Horvat
* "[Building an Expression Evaluator](https://chidiwilliams.com/post/evaluator/)", Chidi Williams
* "[Writing a Simple Expression Evaluator](https://www.strchr.com/expression_evaluator)", Peter Kankowski
* "[Create Your Own Expression Parser](https://levelup.gitconnected.com/create-your-own-expression-parser-d1f622077796)", Don Cross
* "[7.9: Example: Expression Evaluator](https://www.oreilly.com/library/view/the-go-programming/9780134190570/ebook_split_068.html)", _The Go Programming Language_, Alan A. A. Donovan, Brian W. Kernighan
* [How to Write a Math Expression Parser (in Javascript)](https://medium.com/@stoopidguy1992/how-to-write-a-math-expression-parser-in-javascript-b5147bc9466b), Is2PidGuy