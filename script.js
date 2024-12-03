"use strict";
console.log("connected");

const ui = {
  digitBtns: document.getElementsByClassName("digit-btns"),
  operatorBtns: document.getElementsByClassName("operator-btns"),
  equalsBtn: document.getElementById("equals-div"),
  decimalBtn: document.getElementById("decimal-btn"),
  clearSlide: document.getElementById("clear-slide"),
  clearSlideSlot: document.getElementById("clear-slide-slot-container"),
  display: document.getElementById("display"),
};

let firstNumber = "";
let secondNumber = "";
let currentOperator = "";
let result = "";
let previousOperator = "";
let xPosition = 0;
let negativeNumberLock = false;

let currentOperatorLock = true;
let firstNumberLock = false;
let equalsPressed = false;

//* --------------------------------------------------
//* -------------   Computational logic  -------------
//* --------------------------------------------------

const displayResult = function () {
  ui.display.textContent = result;
  equalsPressed = true; //Allows first number to be entered which locks again after entered 
  currentOperatorLock = false; // Unlocks the operator button
  currentOperator = "";
  secondNumber = "";
  firstNumber = result;
  firstNumberLock = false; //Ensures the first number is unlocked to be entered 
  result = "";
};
const addition = function (a, b) {
  return (result = `${a + b}`);
};
const subtraction = function (a, b) {
  return (result = `${a - b}`);
};
const multiplication = function (a, b) {
  return (result = `${a * b}`);
};
const division = function (a, b) {
  return (result = `${a / b}`);
};
const handleFloatPointNumbers = function () {};

const operate = function () {
  switch (currentOperator) {
    case "+":
      addition(Number(firstNumber), Number(secondNumber));
      break;
    case "−":
      subtraction(Number(firstNumber), Number(secondNumber));
      break;
    case "×":
      multiplication(Number(firstNumber), Number(secondNumber));
      break;
    case "÷":
      division(Number(firstNumber), Number(secondNumber));
      break;
  }
  ui.equalsBtn.addEventListener("mouseup", displayResult);
};

//* --------------------------------------------------
//* -------------        UI logic        -------------
//* --------------------------------------------------

const populateDisplay = function () {
  ui.display.textContent = `${firstNumber}${currentOperator}${secondNumber}`;
};
const clearDisplay = function () {
  if (xPosition > 80) {
    ui.display.textContent = "";
    firstNumber = "";
    currentOperator = "";
    secondNumber = "";
    xPosition = 80;
  }
};
const clearSwitchAction = function () { // Clears all inputs including the display when user slides switch to the right
  const onSlide = function (event) {
    clearDisplay();
    xPosition += 5;
    ui.clearSlide.style.left = `${xPosition + 10}%`;
  };
  ui.clearSlide.addEventListener("mousedown", function () {
    ui.clearSlide.style.transition = "none";
    ui.clearSlideSlot.addEventListener("mousemove", onSlide);
    document.addEventListener("mouseup", function onMouseUp() {
      xPosition = 0;
      ui.clearSlideSlot.removeEventListener("mousemove", onSlide);
      ui.clearSlide.style.transition = "left 0.3s ease"; 
      ui.clearSlide.style.left = `0%`;
      document.removeEventListener("mouseup", onMouseUp);
    });
  });
};
const clearSwitchActionTouch = function () {
  let xPosition = 0;

  const onTouchMove = function (event) {
    xPosition += 3; 
    if (xPosition < 80) {
      ui.clearSlide.style.left = `${xPosition + 10}%`;
      if (xPosition > 70){
        ui.display.textContent = "";
        currentOperatorLock = false;
        currentOperator = "";
        secondNumber = "";
        firstNumber = "";
        firstNumberLock = false;
      };
    }
    if (xPosition >= 80) {
          ui.clearSlide.removeEventListener("touchmove", onTouchMove);
    }
  };

  const onTouchEnd = function () {
    xPosition = 0;
    ui.clearSlide.style.left = "0%";
    ui.clearSlide.removeEventListener("touchmove", onTouchMove);
  };

  const onTouchStart = function () {
    ui.clearSlide.addEventListener("touchmove", onTouchMove);
    ui.clearSlide.addEventListener("touchend", onTouchEnd, { once: true });
  };

  ui.clearSlide.addEventListener("touchstart", onTouchStart);
};


const getFirstNumber = function () {
  for (let button of ui.digitBtns) {
    button.addEventListener("mouseup", function (event) {
      if ( // If the user presses the delete button enough to clear the screen
        ui.display.textContent.length === 1 &&
        ui.display.textContent === "0"
      ) {
        firstNumber = "";
      }
      if (equalsPressed === true) {
        firstNumber = "";
        ui.display.textContent = "";
        equalsPressed = false; // Allows for the second number to be entered with the same digit buttons
      }
      if (firstNumberLock === false) {
        currentOperatorLock = false;
        firstNumber += event.target.textContent;
        populateDisplay();
      }
    });
  }
};
const getSecondNumber = function () {
  for (let button of ui.digitBtns) {
    button.addEventListener("mouseup", function (event) {
      equalsPressed = false;
      if (ui.display.textContent.length > firstNumber.length) {
        secondNumber += event.target.textContent;
        currentOperatorLock = true;
        populateDisplay();
        operate();
      }
    });
  }
};
const getOperator = function () {
  let operator = "";

  for (let button of ui.operatorBtns) {
    button.addEventListener("mouseup", function (event) {
      equalsPressed = false;
      if (currentOperator !== "" && button.textContent === "−") { // Allows calculator to handle negative numbers
        currentOperatorLock = true;
        if (negativeNumberLock === false) {
          secondNumber = "-";
          negativeNumberLock = true;
        }
      }

      if (ui.display.textContent.length === 0 && button.textContent === "−") {// Allows calculator to handle negative numbers
        firstNumber += "-";
        currentOperator = "";
      }
      if (// unlocks the operator buttons 
        ui.display.textContent.length <= firstNumber.length + 1 &&
        currentOperatorLock === false
      ) {
        currentOperator = "";
        firstNumberLock = true;
        operator = event.target.textContent;
        currentOperator = operator;
        previousOperator = currentOperator;
      }
      populateDisplay();
    });
  }
};

const backspace = function () {
  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.addEventListener("mouseup", function () {
    ui.display.textContent = ui.display.textContent.substring(
      0,
      ui.display.textContent.length - 1
    );
    if (ui.display.textContent.length >= firstNumber.length + 1) { // re-assigns a value to second number if it is greater than 1 digit long
      secondNumber = ui.display.textContent.substring(
        firstNumber.length + 1,
        ui.display.textContent.length
      );
    } else if (ui.display.textContent.length < firstNumber.length + 1) { // re-assigns a value to first number and can be edited again
      currentOperator = "";
      firstNumberLock = false;
      firstNumber = ui.display.textContent.substring(
        0,
        ui.display.textContent.length
      );
    } else if ((ui.display.textContent.length = 0)) {
      result = "";
    }
  });
};
const addDecimal = function () {
  ui.decimalBtn.addEventListener("mouseup", function () {
    if (firstNumberLock === false) {
      firstNumber += ".";
    } else if (firstNumberLock === true) {
      secondNumber += ".";
    }
    populateDisplay();
  });
};

clearSwitchActionTouch();
getFirstNumber();
getOperator();
getSecondNumber();
addDecimal();
clearSwitchAction();
backspace();
