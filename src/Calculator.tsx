import { useEffect, useRef, useState } from "react";
import styles from "./Calculator.module.css";
import { evaluate } from "./lib";

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
          if (prev[prev.length - 1] === ".") {
            return prev + "0" + buttonValue;
          }
          return prev + buttonValue;
        });
        return;
      case ".":
        setInput((prev) => {
          if (prev[prev.length - 1] === ".") return prev;
          if (!"1234567890".includes(prev[prev.length - 1])) {
            if (prev[prev.length - 1] === ")") {
              return prev + "*0" + buttonValue;
            }
            return prev + "0" + buttonValue;
          }
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
          if (prev[prev.length - 1] === ".") {
            return prev + "0" + buttonValue;
          }
          return prev;
        });
        return;
      case "(":
        setInput((prev) => {
          if ("1234567890".includes(prev[prev.length - 1])) {
            return prev + "*" + buttonValue;
          }
          if (prev[prev.length - 1] === ".") {
            return prev + "0*" + buttonValue;
          }
          return prev + buttonValue;
        });
        return;
      case ")":
        setInput((prev) => {
          if (getMissingBrackets(prev) === 0) return prev;
          if ("1234567890".includes(prev[prev.length - 1])) {
            return prev + buttonValue;
          }
          if (prev[prev.length - 1] === ".") {
            return prev + "0" + buttonValue;
          }
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
          if (prev[prev.length - 1] === ".") {
            return evaluate(
              prev + "0" + ")".repeat(getMissingBrackets(prev)),
            ).toString();
          }
          return prev;
        });
        return;
    }
  };

  const displayRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    displayRef.current.scrollLeft =
      displayRef.current?.scrollWidth - displayRef.current?.clientWidth;
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
