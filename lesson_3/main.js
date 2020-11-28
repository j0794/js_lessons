class Calc {
    constructor(selector) {
        this.parent = document.querySelector(selector);
        this.leftOperand = "0";
        this.rightOperand = "0";
        this.result = 0;
        this.state = new WaitingForLeftOperandState(this);
        this.mathOperation = null;
        this.resultBar = this.parent.querySelector('.calc-result');
        this.buttons = this.parent.querySelectorAll('.calc-button');
        this.history = this.parent.querySelector('.calc-history');
    }

    init() {
        this.buttons.forEach((button) => {
            if (button.dataset.digit) {
                let digit = button.dataset.digit;

                button.addEventListener('click', () => {
                    this.addDigit(digit);
                });
                document.addEventListener('keyup', (e) => {
                    if (e.key === digit) {
                        this.addDigit(digit);
                    }
                });
            } else {
                switch (button.dataset.operation) {
                    case 'float':
                        button.addEventListener('click', () => {
                            this.addPoint();
                        });
                        document.addEventListener('keyup', (e) => {
                            if (e.key === '.') {
                                this.addPoint();
                            }
                        });
                        break;
                    case 'sign_change':
                        button.addEventListener('click', () => {
                            this.changeSign();
                        });
                        break;
                    case 'erase_last':
                        button.addEventListener('click', () => {
                            this.eraseLast();
                        });
                        document.addEventListener('keyup', (e) => {
                            if (e.key === 'Backspace') {
                                this.eraseLast();
                            }
                        });
                        break;
                    case 'reset':
                        button.addEventListener('click', () => {
                            this.reset();
                        });
                        document.addEventListener('keyup', (e) => {
                            if (e.key === 'Escape') {
                                this.reset();
                            }
                        });
                        break;
                    case 'addition':
                        button.addEventListener('click', () => {
                            this.mathOperationHandler(new Addition(this));
                        });
                        document.addEventListener('keyup', (e) => {
                            if (e.key === '+') {
                                this.mathOperationHandler(new Addition(this));
                            }
                        });
                        break;
                    case 'subtraction':
                        button.addEventListener('click', () => {
                            this.mathOperationHandler(new Subtraction(this));
                        });
                        document.addEventListener('keyup', (e) => {
                            if (e.key === '-') {
                                this.mathOperationHandler(new Subtraction(this));
                            }
                        });
                        break;
                    case 'multiplication':
                        button.addEventListener('click', () => {
                            this.mathOperationHandler(new Multiplication(this));
                        });
                        document.addEventListener('keyup', (e) => {
                            if (e.key === '*') {
                                this.mathOperationHandler(new Multiplication(this));
                            }
                        });
                        break;
                    case 'division':
                        button.addEventListener('click', () => {
                            this.mathOperationHandler(new Division(this));
                        });
                        document.addEventListener('keyup', (e) => {
                            if (e.key === '/') {
                                this.mathOperationHandler(new Division(this));
                            }
                        });
                        break;
                    case 'equal':
                        button.addEventListener('click', () => {
                            this.equal();
                        });
                        document.addEventListener('keyup', (e) => {
                            if (e.key === 'Enter' && !e.target.classList.contains('calc-button')) {
                                this.equal();
                            }
                        });
                        break;
                }
            }
        });
    }

    getCurrentOperand() {
        return this.state.getCurrentOperand();
    }

    setCurrentOperand(value) {
        this.state.setCurrentOperand(value);
    }

    addDigit(digit) {
        let operand = this.getCurrentOperand().toString();

        digit = digit.toString();

        if (operand === "0") {
            this.setCurrentOperand(digit);
        } else {
            this.setCurrentOperand(operand + digit);
        }

        this.printOperand();
    }

    addPoint() {
        let operand = this.getCurrentOperand().toString();

        if (operand.includes('.')) {
            return;
        } else {
            this.setCurrentOperand(operand + '.');
        }

        this.printOperand();
    }

    changeSign() {
        let operand = this.getCurrentOperand().toString();

        if (operand === "0") {
            return;
        }
        if (operand.includes('-')) {
            this.setCurrentOperand(operand.slice(1));
        } else {
            this.setCurrentOperand('-' + operand);
        }

        this.printOperand();
    }

    eraseLast() {
        let operand = this.getCurrentOperand().toString();

        if ( (operand.length > 1 && !operand.includes('-')) || (operand.length > 2 && operand.includes('-'))) {
            this.setCurrentOperand(operand.slice(0, -1));
        } else {
            this.setCurrentOperand('0');
        }

        this.printOperand();
    }

    reset() {
        this.leftOperand = "0";
        this.rightOperand = "0";
        this.result = 0;
        this.state = new WaitingForLeftOperandState(this);
        this.mathOperation = null;

        this.printOperand();
    }

    printOperand() {
        this.resultBar.textContent = this.getCurrentOperand().toString();
    }

    equal() {
        if (this.mathOperation) {
            let result = this.mathOperation.equal();

            if (!result.error) {
                this.result = this.removeFloatZero(result.toFixed(4)).toString();
            } else {
                this.result = result.error;
            }

            this.addToHistory();
            this.rightOperand = '0';
            this.state = new WaitingForLeftOperandState(this);
            if (!result.error) {
                this.setCurrentOperand(this.result);
            } else {
                this.setCurrentOperand('0');
            }

            this.printOperand();
        }
    }

    removeFloatZero(value) {
        while (value.includes('.') && value.charAt(value.length - 1) === '0') {
            value = value.slice(0, -1);
            if (value.charAt(value.length - 1) === '.') {
                value = value.slice(0, -1);
            }
        }
        return value;
    }

    addToHistory() {
        let historyElement = document.createElement('div');

        historyElement.classList.add('calc-history-item');
        historyElement.innerHTML = this.leftOperand + ' ' + this.mathOperation.sign + ' ' + this.rightOperand + ' = ' + this.result;

        this.history.append(historyElement);
        historyElement.scrollIntoView();

    }

    mathOperationHandler(mathOperationObject) {
        if (this.mathOperation && this.rightOperand !== "0") {
            this.equal();
        }
        this.mathOperation = mathOperationObject;
        this.state = new WaitingForRightOperandState(this);
    }
}

class State {
    constructor(calc) {
        this.calc = calc;
    }

    getCurrentOperand() {
        return;
    }

    setCurrentOperand() {
        return;
    }
}

class WaitingForLeftOperandState extends State {
    getCurrentOperand() {
        return this.calc.leftOperand;
    }

    setCurrentOperand(value) {
        this.calc.leftOperand = value;
    }
}

class WaitingForRightOperandState extends State {
    getCurrentOperand() {
        return this.calc.rightOperand;
    }

    setCurrentOperand(value) {
        this.calc.rightOperand = value;
    }
}

class MathOperation {
    constructor(calc) {
        this.calc = calc;
        this.sign = null;
    }

    equal() {
        return;
    }
}

class Addition extends MathOperation {
    constructor(calc) {
        super(calc);
        this.sign = "+";
    }
    equal() {
        return parseFloat(this.calc.leftOperand) + parseFloat(this.calc.rightOperand);
    }
}

class Subtraction extends MathOperation {
    constructor(calc) {
        super(calc);
        this.sign = "-";
    }
    equal() {
        return parseFloat(this.calc.leftOperand) - parseFloat(this.calc.rightOperand);
    }
}

class Multiplication extends MathOperation {
    constructor(calc) {
        super(calc);
        this.sign = "&#215;";
    }
    equal() {
        return parseFloat(this.calc.leftOperand) * parseFloat(this.calc.rightOperand);
    }
}

class Division extends MathOperation {
    constructor(calc) {
        super(calc);
        this.sign = "&#247;";
    }
    equal() {
        if (this.calc.rightOperand === "0") {
            return {
                error: "Деление на ноль не определено"
            }
        }
        return parseFloat(this.calc.leftOperand) / parseFloat(this.calc.rightOperand);
    }
}

document.addEventListener('DOMContentLoaded', function() {
   let myCalc = new Calc('.calc');
   myCalc.init();
});