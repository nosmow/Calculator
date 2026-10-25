export class CalculatorUI {
    #calculator;
    #displayEl;
    #historyEl;
    #keys;

    static KEYBOARD_ACTIONS = {
        '.': 'decimal', ',': 'decimal',
        'Enter': 'equals', '=': 'equals',
        'Backspace': 'delete', 'Escape': 'clear', '%': 'percent',
    };

    constructor(calculator) {
        this.#calculator = calculator;
        this.#displayEl = document.getElementById('display');
        this.#historyEl = document.getElementById('history');
        this.#keys = document.querySelectorAll('.key');

        this.#bindEvents();
        this.#render();
    }

    #bindEvents() {
        this.#keys.forEach(key => {
            key.addEventListener('click', () => this.#handle(key.dataset.action, key.dataset.value));
        });

        document.addEventListener('keydown', (event) => this.#handleKeyboard(event));
    }

    #handle(action, value) {
        const calc = this.#calculator;

        const actions = {
            number: () => calc.inputNumber(value),
            decimal: () => calc.inputDecimal(),
            operator: () => calc.chooseOperator(value),
            equals: () => calc.evaluate(),
            clear: () => calc.clear(),
            delete: () => calc.delete(),
            percent: () => calc.percent(),
            sign: () => calc.toggleSign(),
        }

        actions[action]?.();
        this.#render();
    }

    #handleKeyboard(event) {
        const button = this.#findButton(event.key);
        if (!button)
            return;

        event.preventDefault();
        button.click();
        this.#animatePress(button);
    }

    #findButton(key) {
        if (/^[0-9]$/.test(key)) {
            return document.querySelector(`[data-action="number"][data-value="${key}"]`);
        }

        if (['+', '-', '*', '/'].includes(key)) {
            return document.querySelector(`[data-action="operator"][data-value="${key}"]`);
        }

        const action = CalculatorUI.KEYBOARD_ACTIONS[key];
        return action ? document.querySelector(`[data-action="${action}"]`) : null;
    }

    #animatePress(button) {
        button.classList.add('key--pressed');
        setTimeout(() => button.classList.remove('key--pressed'), 100);
    }

    #render() {
        const calc = this.#calculator;

        this.#displayEl.textContent = calc.value;
        this.#historyEl.textContent = calc.history;

        this.#displayEl.classList.toggle('display__current--error', calc.hasError);
        this.#displayEl.classList.toggle('display__current--small', calc.value.length > 9);

        this.#keys.forEach(key => {
            const isActive = key.dataset.action === 'operator'
                && key.dataset.value === calc.activeOperator;
            key.classList.toggle('key--active', isActive);
        });
    }
}