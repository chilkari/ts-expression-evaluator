# Coding a String Expression Evaluator

*Problem:*
Build a string calculator. Given a string input:

    "3+10*6-23/4"

You should write a piece of code that will:

- parse the string
- compute the result
- return the result

*Assumptions:*

- The string given is always a valid expression
- You should respect the presedence of the mathematical operations
- The string will only contain numbers and the characters '+-/*'

## Overview

I've seen this exercise used in technical coding interviews, and after my own recent and somewhat lackluster performance (having not seen the problem before), I wanted to do some studying and find better solutions than what I unsuccessfully stumbled into on my own.

This repo contains a set of tests and several solutions to the problem along with some discussion of the overall problem and the different solutions.

I'm new to Typescript and this problem, so comments and improvements are welcome and encouraged to help me learn!

## Discussion

In a nutshell, (ignoring the `eval()` solution), the high level solution is described explicitly in the instructions:

* We need to parse the input. All non-trivial solutions must _tokenize_ the solution into _operators_ and _operands_. Other terms for this are _scanner_, _lexical parser_ or just _lexer_. In this step, we have to turn the full string expression into the important operable parts.
* We need to organize the tokens into a structure that allows for correct evaluation, _which honors the order of operations_. This is where things get interesting, as there are a number of approaches to this!
* We need to return the result.

## Solutions

### Using eval()

* [source]('./src/eval.ts')
* [tests]('./tests/eval.test.ts')

This is a "gimme" but still counts! Given the assumption: "The string given is always a valid expression" we can safely just use the built-in `eval()` function, and let numerous brilliant language developers do our work for us! If this were the real-world, this would probably be the best answer.

But it doesn't make for a very long or informative technical interview! :)

One interesting note: When evaluating the test expression given in the instructions, "3+10*6-23/4" - `eval()` doesn't necessarily give the expected answer! The instructions don't make it clear what to do with division that results in a non-integer result. Many of the referenced articles add the assumption that we should use integer division, _ignoring any remainder_. 

If we follow that guide, the instruction example "3+10*6-23/4" evaluates as follows:

* 3+10*6-23/4
* 3+60-5.75 (which we truncate to 5!)
* 3+60-5 = 58

The built-in `eval()` function doesn't do integer division along the way, so it evaluates to:

* 3+10*6-23/4
* 3+60-5.75=57.25

Even if we take a Math.floor() of the final result to simulate integer division, we end up with 57. A different integer answer!

When running the unit tests for this solution, this test fails!