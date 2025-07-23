/**
 * Remote Control Navigation Utilities
 * Simulates TV remote control behavior using keyboard events
 */

export class RemoteControl {
    constructor(testController) {
        this.t = testController;
        this.keyPressDelay = 100;
        this.longPressDelay = 1000;
        this.navigationDelay = 300;
    }

    /**
     * Navigate up using arrow key
     */
    async navigateUp(steps = 1) {
        for (let i = 0; i < steps; i++) {
            await this.t.pressKey('up');
            await this.t.wait(this.keyPressDelay);
        }
        await this.t.wait(this.navigationDelay);
        return this;
    }

    /**
     * Navigate down using arrow key
     */
    async navigateDown(steps = 1) {
        for (let i = 0; i < steps; i++) {
            await this.t.pressKey('down');
            await this.t.wait(this.keyPressDelay);
        }
        await this.t.wait(this.navigationDelay);
        return this;
    }

    /**
     * Navigate left using arrow key
     */
    async navigateLeft(steps = 1) {
        for (let i = 0; i < steps; i++) {
            await this.t.pressKey('left');
            await this.t.wait(this.keyPressDelay);
        }
        await this.t.wait(this.navigationDelay);
        return this;
    }

    /**
     * Navigate right using arrow key
     */
    async navigateRight(steps = 1) {
        for (let i = 0; i < steps; i++) {
            await this.t.pressKey('right');
            await this.t.wait(this.keyPressDelay);
        }
        await this.t.wait(this.navigationDelay);
        return this;
    }

    /**
     * Press OK button (Enter key)
     */
    async pressOk() {
        await this.t.pressKey('enter');
        await this.t.wait(this.navigationDelay);
        return this;
    }

    /**
     * Long press simulation (for context menus, delete options)
     */
    async longPress(key = 'enter') {
        // Simulate long press by holding the key for extended duration
        await this.t.pressKey(key + ' ' + key + ' ' + key);
        await this.t.wait(this.longPressDelay);
        return this;
    }

    /**
     * Navigate to a specific position in a grid
     * @param {number} row - Target row (0-based)
     * @param {number} col - Target column (0-based)
     * @param {number} currentRow - Current row position
     * @param {number} currentCol - Current column position
     */
    async navigateToGridPosition(row, col, currentRow = 0, currentCol = 0) {
        // Calculate required movements
        const verticalSteps = row - currentRow;
        const horizontalSteps = col - currentCol;

        // Navigate vertically
        if (verticalSteps > 0) {
            await this.navigateDown(verticalSteps);
        } else if (verticalSteps < 0) {
            await this.navigateUp(Math.abs(verticalSteps));
        }

        // Navigate horizontally
        if (horizontalSteps > 0) {
            await this.navigateRight(horizontalSteps);
        } else if (horizontalSteps < 0) {
            await this.navigateLeft(Math.abs(horizontalSteps));
        }

        return this;
    }

    /**
     * Navigate back (ESC key or back button)
     */
    async navigateBack() {
        await this.t.pressKey('esc');
        await this.t.wait(this.navigationDelay);
        return this;
    }

    /**
     * Set custom delays for different operations
     */
    setDelays({ keyPress, longPress, navigation }) {
        if (keyPress !== undefined) this.keyPressDelay = keyPress;
        if (longPress !== undefined) this.longPressDelay = longPress;
        if (navigation !== undefined) this.navigationDelay = navigation;
        return this;
    }

    /**
     * Wait for element to be focused (useful for TV UI navigation)
     */
    async waitForFocus(selector, timeout = 5000) {
        await this.t.expect(this.t.$(selector).focused).ok('Element should be focused', { timeout });
        return this;
    }

    /**
     * Navigate through a list of items until target is found
     * @param {string} containerSelector - Container holding the items
     * @param {string} itemSelector - Individual item selector
     * @param {string} targetIdentifier - Text or attribute to identify target
     * @param {string} direction - 'horizontal' or 'vertical'
     */
    async navigateToItem(containerSelector, itemSelector, targetIdentifier, direction = 'horizontal') {
        const container = this.t.$(containerSelector);
        await this.t.expect(container.exists).ok('Container should exist');

        const items = container.find(itemSelector);
        const itemCount = await items.count;

        for (let i = 0; i < itemCount; i++) {
            const currentItem = items.nth(i);
            const itemText = await currentItem.innerText;
            
            if (itemText.includes(targetIdentifier)) {
                // Found target item, it should be focused now
                await this.t.expect(currentItem.focused).ok(`Target item "${targetIdentifier}" should be focused`);
                return this;
            }

            // Navigate to next item based on direction
            if (direction === 'horizontal') {
                await this.navigateRight();
            } else {
                await this.navigateDown();
            }
        }

        throw new Error(`Target item "${targetIdentifier}" not found in container`);
    }

    /**
     * Smart navigation that waits for UI responses
     */
    async smartNavigate(direction, steps = 1, waitForStability = true) {
        const initialFocusedElement = await this.t.$('.focused, :focus').exists;
        
        // Perform navigation
        switch (direction.toLowerCase()) {
            case 'up':
                await this.navigateUp(steps);
                break;
            case 'down':
                await this.navigateDown(steps);
                break;
            case 'left':
                await this.navigateLeft(steps);
                break;
            case 'right':
                await this.navigateRight(steps);
                break;
            default:
                throw new Error(`Invalid direction: ${direction}`);
        }

        // Wait for UI to stabilize if requested
        if (waitForStability) {
            await this.t.wait(this.navigationDelay * 2);
        }

        return this;
    }
}
