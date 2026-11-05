
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldReset = false;

function updateDisplay() {
    currentDisplay.textContent = currentInput;
}

function inputNumber(number) {
    if (currentInput === "Error" || shouldReset) {
        currentInput = number;
        shouldReset = false;
    } else {
        currentInput = currentInput === "0"
            ? number
            : currentInput + number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (currentInput === "Error" || shouldReset) {
        currentInput = "0.";
        shouldReset = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (currentInput === "Error") return;

    if (operator !== null && !shouldReset) {
        calculate();
    }

    previousInput = currentInput;
    operator = selectedOperator;
    previousDisplay.textContent =
        `${previousInput} ${getSymbol(operator)}`;

    shouldReset = true;
}

function getSymbol(op) {
    return {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    }[op];
}

function calculate() {
    if (operator === null || previousInput === "") return;

    const first = Number(previousInput);
    const second = Number(currentInput);
    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "*":
            result = first * second;
            break;

        case "/":
            if (second === 0) {
                currentInput = "Error";
                previousInput = "";
                operator = null;
                previousDisplay.textContent = "Cannot divide by zero";
                shouldReset = true;
                updateDisplay();
                return;
            }
            result = first / second;
            break;
    }

    currentInput = String(Number(result.toPrecision(12)));

    previousDisplay.textContent =
        `${previousInput} ${getSymbol(operator)} ${second} =`;

    previousInput = "";
    operator = null;
    shouldReset = true;

    updateDisplay();
}

function clearCalculator() {
    currentInput = "0";
    previousInput = "";
    operator = null;
    shouldReset = false;

    previousDisplay.textContent = "";
    updateDisplay();
}

function deleteNumber() {
    if (currentInput === "Error" || shouldReset) {
        currentInput = "0";
        shouldReset = false;
    } else {
        currentInput = currentInput.length > 1
            ? currentInput.slice(0, -1)
            : "0";
    }

    updateDisplay();
}

document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        inputNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

document.querySelector('[data-action="decimal"]')
    .addEventListener("click", inputDecimal);

document.querySelector('[data-action="calculate"]')
    .addEventListener("click", calculate);

document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document.querySelector('[data-action="delete"]')
    .addEventListener("click", deleteNumber);

// Keyboard support
document.addEventListener("keydown", event => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === ".") {
        inputDecimal();
    }
});

updateDisplay();
