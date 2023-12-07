import { useEffect, useRef, useState } from "react";
import styles from "./Calculator.module.css";
import { evaluate } from "./lib";

//get how many brackets are neede to complete the expression
const getMissingBrackets = (s: string) =>
  s
    .split("")
    .reduce((acc, c) => (c === "(" ? acc + 1 : c === ")" ? acc - 1 : acc), 0);

const Calculator = () => {
  const [input, setInput] = useState<string>("");

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (input === "Error") {
      setInput(() => "");
    }

    const buttonValue = e.currentTarget.textContent!;

    switch (buttonValue) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        setInput((prev) => {
          //if number goes after a bracket, interprete as multiplication
          if (prev[prev.length - 1] === ")") { 
            return prev + "*" + buttonValue;
          }
          return prev + buttonValue;
        });
        return;
      case "C":
        setInput((prev) => prev.slice(0, -1));
        return;
      case "+":
      case "-":
        setInput((prev) => {
          //if not currently entering a number, interprete as 0.
          if (prev[prev.length - 1] === ".") {
            return prev + "0" + buttonValue;
          }
          return prev + buttonValue;
        });
        return;
      case ".":
        setInput((prev) => {
          //can't enter dot after another dot 
          if (prev[prev.length - 1] === ".") return prev;
          //interprete as 0. and as multiplication if needed
          if (!"1234567890".includes(prev[prev.length - 1])) {
            if (prev[prev.length - 1] === ")") {
              return prev + "*0" + buttonValue;
            }
            return prev + "0" + buttonValue;
          }
          //can't enter dot if this number already has one
          for (
            let i = prev.length - 1;
            i >= 0 && "1234567890.".includes(prev[i]);
            i--
          ) {
            if (prev[i] === ".") return prev;
          }
          return prev + ".";
        });
        return;
      case "*":
      case "/":
      case "^":
        setInput((prev) => {
          if ("1234567890)".includes(prev[prev.length - 1])) {
            return prev + buttonValue;
          }
          //autocomplete number if needed
          if (prev[prev.length - 1] === ".") {
            return prev + "0" + buttonValue;
          }
          //can't be after another operator
          return prev;
        });
        return;
      case "(":
        setInput((prev) => {
          //interprete as a multiplication if bracket goes directly after a number
          if ("1234567890)".includes(prev[prev.length - 1])) {
            return prev + "*" + buttonValue;
          }
          //atocomplete a number
          if (prev[prev.length - 1] === ".") {
            return prev + "0*" + buttonValue;
          }
          return prev + buttonValue;
        });
        return;
      case ")":
        setInput((prev) => {
          //no brackets to close
          if (getMissingBrackets(prev) === 0) return prev;
          if ("1234567890)".includes(prev[prev.length - 1])) {
            return prev + buttonValue;
          }
          if (prev[prev.length - 1] === ".") {
            return prev + "0" + buttonValue;
          }
          //bracket can't be closed after an operator
          return prev;
        });
        return;
      case "=":
        setInput((prev) => {
          if (!prev) return prev;
          if ("1234567890)".includes(prev[prev.length - 1])) {
            return evaluate(
              prev + ")".repeat(getMissingBrackets(prev)),
            ).toString();
          }
          //try to autocomplete as well
          if (prev[prev.length - 1] === ".") {
            return evaluate(
              prev + "0" + ")".repeat(getMissingBrackets(prev)),
            ).toString();
          }
          //expression is malformed
          return prev;
        });
        return;
    }
  };

  const displayRef = useRef<null | HTMLDivElement>(null);

  // we need to show the rightmost part of the expression
  useEffect(() => {
    displayRef.current!.scrollLeft =
      displayRef.current!.scrollWidth - displayRef.current!.clientWidth;
  }, [input]);

  return (
    <div className={styles.calculator}>
      <div ref={displayRef} className={styles.display}>
        {(input && input + ")".repeat(getMissingBrackets(input))) || 0}
      </div>
      <div className={styles.buttons}>
        {"()=C789+456-123*0./^".split("").map((c) => (
          <button
            key={c}
            className={styles.button}
            onPointerDown={handleButtonClick}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
