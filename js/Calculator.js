export class Calculator {

    #currentValue = '0';
    #previousValue = null;
    #operator = null;
    #shouldReset = false;
    #hasError = false;
    #history = '';

    static SYMBOLS = {'+': '+', '-': '−', '*': '×', '/': '÷'};
    static MAX_LENGTH = 15;

    get value() {
        return this.#hasError ? 'Error' : this.#currentValue
    }

    get history() {
        return this.#history;
    }

    get hasError() {
        return this.#hasError;
    }

    get activeOperator() {
        return this.#shouldReset ? this.#operator : null;
    }

    inputNumber(digit) {
        this.#recoverFromError();

        if (this.#shouldReset || this.#currentValue === '0') {
            this.#currentValue = digit;
            this.#shouldReset = false;
        } else if (this.#currentValue.length < Calculator.MAX_LENGTH) {
            this.#currentValue += digit;
        }
    }

    inputDecimal() {
        this.#recoverFromError();

        if (this.#shouldReset) {
            this.#currentValue = '0.';
            this.#shouldReset = false;
        } else if (!this.#currentValue.includes('.')) {
            this.#currentValue += '.';
        }
    }

    chooseOperator(op) {
        this.#recoverFromError();

        if (this.#operator !== null && !this.#shouldReset) {
            if (this.evaluate()) return;
        }

        this.#previousValue = parseFloat(this.#currentValue);
        this.#operator = op;
        this.#shouldReset = true;
        this.#history = `${this.#previousValue} ${Calculator.SYMBOLS[op]}`
    }

    evaluate() {
        if (this.#operator === null || this.#shouldReset)
            return false;

        const a = this.#previousValue;
        const b = parseFloat(this.#currentValue);
        const result = Calculator.#calculate(a, b, this.#operator);

        if (result === null) {
            this.clear();
            this.hasError = true;
            return false;
        }

        this.#history = `${Calculator.SYMBOLS[this.#operator]} ${b} =`;
        this.#currentValue = String(Calculator.#round(result));
        this.#previousValue = null;
        this.#operator = null;
        this.#shouldReset = true;
        return true;
    }

    clear() {
        this.#currentValue = '0';
        this.#previousValue = null;
        this.#operator = null;
        this.#shouldReset = false;
        this.#hasError = false;
        this.#history = '';
    }

    delete() {
        this.#recoverFromError();

        if (this.#shouldReset)
            return;

        this.#currentValue = this.#currentValue.length > 1
            ? this.#currentValue.slice(0, -1)
            : '0';

        if (this.#currentValue === '-')
            this.#currentValue = '0';
    }

    percent() {
        this.#recoverFromError();

        this.#currentValue = String(Calculator.#round(parseFloat(this.#currentValue) / 100));
    }

    toggleSign() {
        this.#recoverFromError();

        if (this.#currentValue === '0')
            return;

        this.#currentValue = this.#currentValue.startsWith('-')
            ? this.#currentValue.slice(1)
            : '-' + this.#currentValue;
    }

    #recoverFromError() {
        if (this.#hasError) this.clear();
    }

    static #calculate(a, b, op) {
        switch (op) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                return b === 0 ? null : a / b;
        }
    }

    static #round(number) {
        return parseFloat(number.toFixed(10));
    }
}