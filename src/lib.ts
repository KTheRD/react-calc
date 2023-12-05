const precedence = {
  "^": 4,
  "*": 3,
  "/": 3,
  "+": 2,
  "-": 2,
  "(": 1,
};

const applyOperator = (operand: string, a: number, b: number) => {
  switch (operand) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) return "Error";
      return a / b;
    case "^":
      if (a < 0 && b !== Math.floor(b)) return "Error";
      return a ** b;
  }
};

const tokenize = (s: string) => s.match(/\d+(\.\d+)?|[+\-^/*()]/g);

const shuntingYard = (tokens: string[]) => {
  const stack: (number | string)[] = [];
  const output: (number | string)[] = [];

  tokens.forEach((token) => {
    if (!isNaN(parseFloat(token))) {
      output.push(parseFloat(token));
      return;
    }

    if ("^*/+-".includes(token)) {
      while (
        stack.length &&
        precedence[token as keyof typeof precedence] <=
          precedence[stack[stack.length - 1] as keyof typeof precedence]
      ) {
        output.push(stack.pop()!);
      }
      stack.push(token);
      return;
    }

    if (token === "(") {
      stack.push(token);
      return;
    }

    if (token === ")") {
      while (stack.length && stack[stack.length - 1] !== "(") {
        output.push(stack.pop()!);
      }
      stack.pop();
      return;
    }
  });

  while (stack.length) {
    output.push(stack.pop()!);
  }

  return output;
};

export const evaluate = (s: string) => {
  s = s.replace(
    /[+-]+[\d(]/g,
    (s) =>
      s
        .split("")
        .reduce(
          (acc, c) => (c === "-" ? (acc === "+" ? "-" : "+") : acc),
          "+",
        ) + s[s.length - 1],
  );

  s = s.replace(/[(*/^]-\d+(\.\d+)?|^-\d+(\.\d+)?/g, (s) =>
    s[0] === "-" ? "(0" + s + ")" : s[0] + "(0" + s.slice(1) + ")",
  );

  const tokens = tokenize(s)!;
  const postfixExpression = shuntingYard(tokens);
  const evaluationStack: (string | number)[] = [];


  postfixExpression.forEach((token) => {
    if (typeof token === "number") {
      evaluationStack.push(token);
    } else {
      const operand2 = evaluationStack.pop();
      const operand1 = evaluationStack.pop();
      const result = applyOperator(
        token,
        operand1 as number,
        operand2 as number,
      );

      if (result === "Error") {
        evaluationStack[0] = "Error"
        return
      }

      evaluationStack.push(result!);
    }
  });
  return evaluationStack[0];
};
