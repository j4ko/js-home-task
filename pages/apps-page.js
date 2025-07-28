import { Selector, t } from 'testcafe';

class AppsPage {
    constructor() {
        this.appsContainer = Selector('[data-testid="lists-container"]');
        this.appItems = this.appsContainer.find('[role="listitem"]');
    }

    /**
     * Finds the first application that is not in the provided list of favorite apps.
     * @param {string[]} favoriteApps - A list of favorite application names.
     * @returns {Promise<string|null>} The name of the non-favorite app, or null if none is found.
     */
    async findNonFavoriteApp(favoriteApps) {
        await t.expect(this.appsContainer.exists).ok('Apps container should exist', { timeout: 10000 });
        const count = await this.appItems.count;

        for (let i = 0; i < count; i++) {
            const appItem = this.appItems.nth(i);
            const appName = await appItem.getAttribute('data-testid');
            
            if (appName) {
                const appNameTrimmed = appName.trim();
                // Check if any favorite string contains the current app's name.
                // This handles the "AppNameAppName" issue.
                const isFavorite = favoriteApps.some(fav => fav.includes(appNameTrimmed));
                
                if (!isFavorite) {
                    return appNameTrimmed;
                }
            }
        }
        return null;
    }

    /**
     * Navigates to a specific application on the Apps page and selects it.
     * @param {string} appName - The name of the application to navigate to.
     */
    async navigateToAndSelectApp(appName) {
        // Navigate into the grid. The first 'down' focuses the banner, the second focuses the app grid.
        await t.pressKey('down');
        await t.wait(250);
        await t.pressKey('down');
        await t.wait(250);

        const maxAttempts = 100; // Increased attempts for more complex grid
        let lastFocusedAppName = '';

        for (let i = 0; i < maxAttempts; i++) {
            const focusedItem = Selector('[role="listitem"][data-focused="focused"]');
            await t.expect(focusedItem.exists).ok(`No list item has data-focused="focused" on attempt ${i + 1}.`, { timeout: 5000 });
            
            const focusedAppName = await focusedItem.getAttribute('data-testid');

            if (focusedAppName && focusedAppName.trim() === appName) {
                await t.pressKey('enter');
                return;
            }

            lastFocusedAppName = focusedAppName;
            
            await t.pressKey('right');
            await t.wait(200);

            const newFocusedItem = Selector('[role="listitem"][data-focused="focused"]');
            const newFocusedAppName = await newFocusedItem.getAttribute('data-testid');

            // If the focused app didn't change, we've likely hit the end of a row.
            if (lastFocusedAppName === newFocusedAppName) {
                await t.pressKey('down');
                await t.wait(200);
                // Move far left to ensure we are at the start of the new row.
                for (let j = 0; j < 15; j++) {
                    await t.pressKey('left');
                    await t.wait(100);
                }
            }
        }

        throw new Error(`Could not find or navigate to the app "${appName}" after ${maxAttempts} attempts.`);
    }

    /**
     * Waits for the mini-banner to be visible on the Apps page.
     */
    async waitForBanner() {
        const banner = Selector('[data-testid="mini-banner"]');
        await t.expect(banner.exists).ok('The mini-banner should exist', { timeout: 10000 });
        await t.expect(banner.visible).ok('The mini-banner should be visible', { timeout: 10000 });
    }
}

export default new AppsPage();
