import { Selector } from 'testcafe';
import { BasePage } from './base-page.js';

/**
 * Apps Page Object Model
 * Handles interactions with the apps page for browsing and managing applications
 */
export class AppsPage extends BasePage {
    constructor(testController) {
        super(testController);
        
        // Page-specific selectors
        this.appGrid = Selector(this.selectors.appsPage.appGrid);
        this.appItems = this.appGrid.find(this.selectors.appsPage.appItem);
        this.addToFavoritesButton = Selector(this.selectors.appsPage.addToFavoritesButton);
    }

    /**
     * Navigate to apps page
     */
    async goToAppsPage() {
        await this.navigateToApps();
        await this.waitForAppsPageToLoad();
        return this;
    }

    /**
     * Wait for apps page to load
     */
    async waitForAppsPageToLoad() {
        await this.waitForElement(this.selectors.appsPage.appGrid);
        await this.waitForAnimationsToComplete();
        return this;
    }

    /**
     * Get total number of apps available
     */
    async getAppsCount() {
        await this.waitForElement(this.selectors.appsPage.appGrid);
        return await this.appItems.count;
    }

    /**
     * Navigate to a specific app in the grid
     */
    async navigateToApp(appIndex) {
        const totalApps = await this.getAppsCount();
        
        if (appIndex >= totalApps) {
            throw new Error(`App index ${appIndex} exceeds available apps count (${totalApps})`);
        }
        
        // Calculate grid position (assuming a grid layout)
        const appsPerRow = 5; // This may need adjustment based on actual layout
        const targetRow = Math.floor(appIndex / appsPerRow);
        const targetCol = appIndex % appsPerRow;
        
        // Navigate to apps grid first
        await this.remoteControl.navigateToGridPosition(targetRow, targetCol);
        
        // Verify correct app is focused
        const targetApp = this.appItems.nth(appIndex);
        await this.waitForElementFocus(targetApp);
        
        return this;
    }

    /**
     * Add an app to favorites
     */
    async addAppToFavorites(appIndex) {
        await this.navigateToApp(appIndex);
        
        const appName = await this.getAppName(appIndex);
        console.log(`[INFO] Adding app to favorites: ${appName}`);
        
        // Long press or specific action to add to favorites
        await this.remoteControl.longPress();
        
        // Look for add to favorites option
        if (await this.addToFavoritesButton.exists) {
            await this.remoteControl.pressOk();
        } else {
            // Navigate to add to favorites option in context menu
            await this.remoteControl.navigateDown();
            await this.remoteControl.pressOk();
        }
        
        await this.confirmAction();
        await this.t.wait(1000);
        
        return { success: true, appName };
    }

    /**
     * Get app name by index
     */
    async getAppName(appIndex) {
        const app = this.appItems.nth(appIndex);
        await this.t.expect(app.exists).ok(`App at index ${appIndex} should exist`);
        
        // Try different text selectors
        const possibleTextSelectors = ['.app-name', '.title', '.label', 'span', 'div'];
        
        for (const selector of possibleTextSelectors) {
            const textElement = app.find(selector);
            if (await textElement.exists) {
                const text = await textElement.innerText;
                if (text && text.trim()) {
                    return text.trim();
                }
            }
        }
        
        return (await app.innerText).trim();
    }
}
