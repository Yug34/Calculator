const PRECEDENCE = [["÷", "%", "x"], ["+", "-"]];
const OPERATORS = ["÷", "%", "x", "+", "-"];
const operands = document.querySelectorAll(".operands");
const displayInput = document.querySelector("#display-input");
const operators = document.querySelectorAll(".operators");
const decimalButton = document.querySelector(".decimal");
const allClearButton = document.querySelector("#all-clear");
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");
const displayResult = document.querySelector("#display-result");

let isPrevOp = false;  // if the operator has already been pressed 
let isOperand = false;  // if the operand is clicked after equals button is clicked

operands.forEach((operand) => operand.addEventListener("click", function () {    
    if ((displayInput.textContent === "0")) {
        displayInput.innerHTML = "";
    }
    if (!isOperand) {
        displayInput.innerHTML = displayInput.textContent + this.textContent;
        isPrevOp = false;
    }
}));

operators.forEach((operator) => operator.addEventListener("click", function () {
    if (displayInput.textContent === "0" && this.textContent === "-") {
        displayInput.innerHTML = displayInput.textContent + " " + "-" + " ";
        isPrevOp = true;
    }
    else if (displayInput.textContent !== "0" && !isPrevOp) {
        displayInput.innerHTML = displayInput.textContent + " " + this.textContent + " ";
        isPrevOp = true;
    }
}));

decimalButton.addEventListener("click", function () {
    if (!isDecimal()) {
        displayInput.innerHTML = displayInput.textContent + ".";
    }
}); 

allClearButton.addEventListener("click", function () {
    displayInput.innerHTML = "0";
    displayResult.innerHTML = "";
    displayInput.style.height = "40px";
    isPrevOp = false;
    isOperand = false;
});

clearButton.addEventListener("click", function () {

    let text = displayInput.textContent.trim();
    
    if (OPERATORS.includes(text.slice(-1))) {
        isPrevOp = false;
        displayInput.innerHTML = text.slice(0, -2);
    }
    else {
        displayInput.innerHTML = text.slice(0, -1);
    }
     
    if (displayInput.innerHTML === "") {
        displayInput.innerHTML = "0";
        displayResult.innerHTML = "";
        displayInput.style.height = "40px";
    }
});

equalsButton.addEventListener("click", () => {
    calculate();
});

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const modulo = (a, b) => a % b;

function operate(a, b, operator) {
    return (operator === "+") ? add(a, b) :
        (operator === "-") ? subtract(a, b) : 
        (operator === "x") ? multiply(a, b) :
        (operator === "÷") ? divide(a, b) : 
        (operator === "%") ? modulo(a, b) : null; 
}

function calculate() {
    const eqn = displayInput.textContent;
    const pieces = eqn.split(" ");
    if (pieces[0] !== "0" || pieces.length !== 1) {
        let filteredPieces = pieces.filter((piece) => piece !== "");

        // Using BODMAS rule for computation
        
        for (let i = 0; i < PRECEDENCE.length; i++) {

            let j = filteredPieces.length - 1;
            while (j >= 0) {
                let index = filteredPieces.length - 1 - j;
                if (PRECEDENCE[i].includes(filteredPieces[index])) {
                    let a = +filteredPieces[index - 1];
                    let b = +filteredPieces[index + 1];
                    let op = filteredPieces[index];
                    let result = operate(a, b, op);
                    filteredPieces.splice(index - 1, 3, result);
                }
                j--;
            }
        }
        if ((filteredPieces[0] === NaN) || (filteredPieces[0] === Infinity) || 
            (filteredPieces[0] === -Infinity)) {
            displayResult.innerHTML = "BRUH!";
        }
        else {
            const rounded = (Math.round(filteredPieces[0] * 100) / 100);
            if (rounded.toString().length >= 8) {
                displayResult.innerHTML = rounded.toExponential(2);
            }
            else {
                displayResult.innerHTML = rounded;
            }
        }

    }
    if (displayResult.innerHTML === "NaN") {
        displayResult.innerHTML = "BRUH!";
    }
}

function isDecimal() {
    let text = displayInput.textContent;
    let i = text.length - 1;
    let decimal = true;
    outer:
    while (i >= 0) {
        if (OPERATORS.includes(text[i])) {
            if (!text.slice(i).split("").includes(".")) {
                decimal = false;
                break outer;
            }
        }
        i--;
    }
    if (!OPERATORS.includes(text.slice(0))) {
        if (!text.split("").includes(".")) {
            decimal = false;
        }
    }
    return decimal;
}
