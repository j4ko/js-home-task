import { Selector } from 'testcafe';
import { RemoteControl } from '../utils/remote-control.js';
import { TestConfig } from '../config/test-config.js';

/**
 * Base Page Object Model class containing common functionality
 * All page objects should extend this class
 */
export class BasePage {
    constructor(testController) {
        this.t = testController;
        this.remoteControl = new RemoteControl(testController);
        this.config = TestConfig;
        this.timeouts = TestConfig.timeouts;
        this.selectors = TestConfig.selectors;
    }

    /**
     * Navigate to the application URL
     */
    async navigate() {
        await this.t.navigateTo(this.config.baseUrl);
        await this.waitForPageLoad();
        return this;
    }

    /**
     * Wait for page to fully load
     */
    async waitForPageLoad() {
        // Wait for any loading indicators to disappear
        const loadingSelector = this.selectors.common.loading;
        await this.t.expect(Selector(loadingSelector).exists).notOk('Page should finish loading', {
            timeout: this.timeouts.navigation
        });
        
        // Additional wait for TV UI to stabilize
        await this.t.wait(1000);
        return this;
    }

    /**
     * Get currently focused element
     */
    getFocusedElement() {
        return Selector(this.selectors.common.focused);
    }

    /**
     * Wait for an element to be focused
     */
    async waitForElementFocus(selector, timeout = this.timeouts.medium) {
        await this.t.expect(Selector(selector).focused).ok('Element should be focused', { timeout });
        return this;
    }

    /**
     * Wait for element to exist and be visible
     */
    async waitForElement(selector, timeout = this.timeouts.medium) {
        const element = Selector(selector);
        await this.t.expect(element.exists).ok('Element should exist', { timeout });
        await this.t.expect(element.visible).ok('Element should be visible', { timeout });
        return element;
    }

    /**
     * Navigate to home page using remote control
     */
    async navigateToHome() {
        await this.remoteControl.navigateToItem(
            'body', 
            this.selectors.navigation.homeButton, 
            'home', 
            'horizontal'
        );
        await this.remoteControl.pressOk();
        await this.waitForPageLoad();
        return this;
    }

    /**
     * Navigate to apps page using remote control
     */
    async navigateToApps() {
        await this.remoteControl.navigateToItem(
            'body', 
            this.selectors.navigation.appsButton, 
            'apps', 
            'horizontal'
        );
        await this.remoteControl.pressOk();
        await this.waitForPageLoad();
        return this;
    }

    /**
     * Navigate to search page using remote control
     */
    async navigateToSearch() {
        await this.remoteControl.navigateToItem(
            'body', 
            this.selectors.navigation.searchButton, 
            'search', 
            'horizontal'
        );
        await this.remoteControl.pressOk();
        await this.waitForPageLoad();
        return this;
    }

    /**
     * Navigate to channels page using remote control
     */
    async navigateToChannels() {
        await this.remoteControl.navigateToItem(
            'body', 
            this.selectors.navigation.channelsButton, 
            'channels', 
            'horizontal'
        );
        await this.remoteControl.pressOk();
        await this.waitForPageLoad();
        return this;
    }

    /**
     * Handle confirmation dialogs
     */
    async confirmAction() {
        const confirmButton = Selector(this.selectors.common.confirmButton);
        if (await confirmButton.exists) {
            await this.remoteControl.pressOk();
            await this.t.wait(500);
        }
        return this;
    }

    /**
     * Cancel action in dialog
     */
    async cancelAction() {
        const cancelButton = Selector(this.selectors.common.cancelButton);
        if (await cancelButton.exists) {
            await this.remoteControl.navigateRight(); // Navigate to cancel if needed
            await this.remoteControl.pressOk();
            await this.t.wait(500);
        }
        return this;
    }

    /**
     * Log debug information for troubleshooting
     */
    async logDebugInfo(message) {
        console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
        
        // Log current focused element if available
        const focusedElement = this.getFocusedElement();
        if (await focusedElement.exists) {
            const elementInfo = {
                tagName: await focusedElement.tagName,
                className: await focusedElement.className,
                id: await focusedElement.id,
                innerText: await focusedElement.innerText
            };
            console.log(`[DEBUG] Currently focused element:`, elementInfo);
        }
        
        return this;
    }

    /**
     * Take screenshot for debugging
     */
    async takeDebugScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await this.t.takeScreenshot(`debug-${name}-${timestamp}`);
        return this;
    }

    /**
     * Retry an action with exponential backoff
     */
    async retryAction(action, maxRetries = 3, description = 'action') {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await action();
                return; // Success
            } catch (error) {
                lastError = error;
                console.log(`[RETRY] Attempt ${attempt}/${maxRetries} failed for ${description}: ${error.message}`);
                
                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                    await this.t.wait(delay);
                }
            }
        }
        
        throw lastError; // All retries failed
    }

    /**
     * Wait for any animations or transitions to complete
     */
    async waitForAnimationsToComplete() {
        await this.t.wait(500); // Standard wait for CSS animations
        return this;
    }

    /**
     * Verify page title or heading
     */
    async verifyPageTitle(expectedTitle) {
        const title = await this.t.eval(() => document.title);
        await this.t.expect(title).contains(expectedTitle, `Page title should contain "${expectedTitle}"`);
        return this;
    }

    /**
     * Get element count in a container
     */
    async getElementCount(containerSelector, itemSelector) {
        const container = Selector(containerSelector);
        await this.t.expect(container.exists).ok('Container should exist');
        
        const items = container.find(itemSelector);
        return await items.count;
    }

    /**
     * Check if element contains specific text
     */
    async elementContainsText(selector, expectedText) {
        const element = Selector(selector);
        const elementText = await element.innerText;
        return elementText.toLowerCase().includes(expectedText.toLowerCase());
    }
}
