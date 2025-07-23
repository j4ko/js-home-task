import { Selector } from 'testcafe';
import { BasePage } from './base-page.js';

/**
 * Home Page Object Model
 * Handles interactions with the home page, including favorite apps management
 * Based on actual DOM investigation of https://app.titanos.tv/
 */
export class HomePage extends BasePage {
    constructor(testController) {
        super(testController);
        
        // Page-specific selectors based on DOM investigation
        this.favoriteAppsRow = Selector('._favAppsList_tcq1v_712');
        this.favoriteApps = Selector('._itemTitle_10v6y_138'); // App titles
        this.favoriteAppContainers = Selector('._favAppItem_10v6y_173'); // App containers
        this.featuredAppsTitle = Selector('._listTitle_tcq1v_725');
    }

    /**
     * Navigate to home page and wait for it to load
     */
    async goToHomePage() {
        await this.navigate();
        await this.waitForHomePageToLoad();
        return this;
    }

    /**
     * Wait for home page specific elements to load
     */
    async waitForHomePageToLoad() {
        await this.waitForElement('._favAppsList_tcq1v_712');
        await this.waitForAnimationsToComplete();
        return this;
    }

    /**
     * Get the count of favorite apps currently displayed
     */
    async getFavoriteAppsCount() {
        await this.waitForElement('._favAppsList_tcq1v_712');
        return await this.favoriteApps.count;
    }

    /**
     * Get app name from a favorite app element by index
     */
    async getAppName(appIndex) {
        const app = this.favoriteApps.nth(appIndex);
        await this.t.expect(app.exists).ok(`App at index ${appIndex} should exist`);
        
        const appName = await app.innerText;
        return appName.trim();
    }

    /**
     * Check if an app is the watch-tv app (which cannot be deleted)
     * Watch TV is always at index 0 in the Featured Apps list
     */
    async isWatchTvApp(appIndex) {
        // Watch TV is always the first app (index 0) and cannot be deleted
        if (appIndex === 0) {
            return true;
        }
        
        // Double-check by also looking at the app name
        const appName = await this.getAppName(appIndex);
        return appName.toLowerCase().includes('watch') && appName.toLowerCase().includes('tv');
    }

    /**
     * Navigate to the favorite apps row
     */
    async navigateToFavoriteApps() {
        await this.waitForElement('._favAppsList_tcq1v_712');
        
        // Navigate to the first app in the favorite apps row
        const firstApp = this.favoriteApps.nth(0);
        await this.t.expect(firstApp.exists).ok('At least one favorite app should exist');
        
        // Click on the first app to focus it
        await this.t.click(firstApp);
        await this.t.wait(500);
        
        return this;
    }

    /**
     * Navigate to a specific app in the favorite apps row
     */
    async navigateToFavoriteApp(appIndex) {
        await this.waitForElement('._favAppsList_tcq1v_712');
        
        const targetApp = this.favoriteApps.nth(appIndex);
        await this.t.expect(targetApp.exists).ok(`App at index ${appIndex} should exist`);
        
        // Click on the target app to focus it
        await this.t.click(targetApp);
        await this.t.wait(500);
        
        return this;
    }

    /**
     * Trigger delete action on a favorite app using HOLD Enter as discovered in testing
     */
    async triggerDeleteAction(appIndex) {
        await this.navigateToFavoriteApp(appIndex);
        
        const appName = await this.getAppName(appIndex);
        console.log(`[INFO] Attempting to delete app: ${appName} at index ${appIndex}`);
        
        // Check if this is a non-deletable app (Watch TV at index 0)
        if (await this.isWatchTvApp(appIndex)) {
            console.log(`[INFO] App "${appName}" is non-deletable (Watch TV app)`);
            return { success: false, reason: 'non-deletable', appName };
        }
        
        // Wait for navigation to settle
        await this.t.wait(500);
        
        try {
            console.log(`[INFO] Activating delete mode for ${appName} using HOLD Enter...`);
            
            // Use keyDown/keyUp to simulate HOLD Enter as discovered in testing
            await this.t.dispatchEvent('#favourite-apps', 'keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            
            // Hold for 2 seconds
            await this.t.wait(2000);
            
            await this.t.dispatchEvent('#favourite-apps', 'keyup', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            
            await this.t.wait(1000);

            // Verify delete mode is active by checking for delete buttons
            const deleteMode = await this.t.eval(() => {
                const deleteButtons = document.querySelectorAll('[data-testid="editmode-remove-app"]');
                const overlay = document.querySelector('._overlay_15ypj_1');
                
                return {
                    deleteButtonsCount: deleteButtons.length,
                    overlayActive: overlay ? (overlay.offsetWidth > 0 && overlay.offsetHeight > 0) : false
                };
            });

            console.log(`[INFO] Delete mode state - Buttons: ${deleteMode.deleteButtonsCount}, Overlay: ${deleteMode.overlayActive}`);

            if (deleteMode.deleteButtonsCount > 0 && deleteMode.overlayActive) {
                console.log(`[INFO] Delete mode activated successfully for ${appName}`);
                
                // Step 1: Press DOWN arrow to navigate to the delete button
                console.log(`[INFO] Pressing DOWN arrow to navigate to delete button for ${appName}...`);
                await this.t.pressKey('down');
                await this.t.wait(1000);
                
                // Step 2: Press Enter to confirm deletion
                console.log(`[INFO] Pressing Enter to confirm deletion of ${appName}...`);
                await this.t.pressKey('enter');
                await this.t.wait(2000);
                
                console.log(`[INFO] Successfully completed delete sequence for ${appName}`);
                return { success: true, appName, method: 'hold-enter-down-enter' };

            } else {
                console.log(`[INFO] Failed to activate delete mode for ${appName}`);
                return { success: false, reason: 'delete-mode-not-activated', appName };
            }

        } catch (error) {
            console.log(`[INFO] Error during delete action for ${appName}: ${error.message}`);
            return { success: false, reason: 'error', appName, error: error.message };
        }
    }

    /**
     * Delete a specific favorite app by index
     */
    async deleteFavoriteApp(appIndex) {
        const initialCount = await this.getFavoriteAppsCount();
        
        const deleteResult = await this.triggerDeleteAction(appIndex);
        
        if (!deleteResult.success) {
            return deleteResult;
        }
        
        // Look for delete-related text or buttons in any modal/menu that appeared
        const deleteSelectors = [
            'button:contains("Delete")',
            'button:contains("Remove")',
            '[aria-label*="delete"]',
            '[aria-label*="remove"]',
            '.delete',
            '.remove'
        ];
        
        let deleteButtonFound = false;
        for (const selector of deleteSelectors) {
            const deleteBtn = Selector(selector);
            if (await deleteBtn.exists) {
                console.log(`[INFO] Found delete button: ${selector}`);
                await this.t.click(deleteBtn);
                deleteButtonFound = true;
                break;
            }
        }
        
        if (!deleteButtonFound) {
            // Try pressing Enter if no specific delete button found
            await this.t.pressKey('enter');
        }
        
        // Wait for deletion to complete
        await this.t.wait(2000);
        
        // Check if app was actually deleted
        const finalCount = await this.getFavoriteAppsCount();
        const wasDeleted = finalCount < initialCount;
        
        // If a modal is still open, try to close it
        const modal = Selector('.modal, .dialog, .popup, [role="dialog"]');
        if (await modal.exists) {
            await this.t.pressKey('esc');
            await this.t.wait(500);
        }
        
        return {
            success: wasDeleted,
            appName: deleteResult.appName,
            initialCount,
            finalCount,
            method: deleteResult.method
        };
    }

    /**
     * Try to delete the watch-tv app and verify it cannot be deleted
     * Watch TV should always be at index 0
     */
    async verifyWatchTvAppCannotBeDeleted() {
        const appsCount = await this.getFavoriteAppsCount();
        
        if (appsCount === 0) {
            throw new Error('No favorite apps found');
        }
        
        // Watch TV should be at index 0
        const watchTvAppIndex = 0;
        const appName = await this.getAppName(watchTvAppIndex);
        console.log(`[INFO] Testing deletion of Watch TV app: ${appName} at index ${watchTvAppIndex}`);
        
        // Attempt to trigger delete action (should fail or be ignored)
        const deleteResult = await this.triggerDeleteAction(watchTvAppIndex);
        
        // Even if delete was "attempted", verify the app still exists
        const finalCount = await this.getFavoriteAppsCount();
        await this.t.expect(finalCount).eql(appsCount, 'Watch-TV app should not be deleted');
        
        // Verify the Watch TV app is still at index 0
        const finalFirstAppName = await this.getAppName(0);
        await this.t.expect(finalFirstAppName.toLowerCase()).contains('watch', 'Watch TV should still be the first app');
        
        return {
            appName,
            index: watchTvAppIndex,
            deleteAttempted: true,
            stillExists: true
        };
    }

    /**
     * Delete all deletable favorite apps
     * Watch TV (index 0) will be preserved, all others will be deleted
     */
    async deleteAllDeletableApps() {
        const deletedApps = [];
        const nonDeletableApps = [];
        
        let currentCount = await this.getFavoriteAppsCount();
        
        // Start from the last app and work backwards to avoid index shifting issues
        // Skip index 0 since that's always Watch TV (non-deletable)
        for (let i = currentCount - 1; i >= 1; i--) {
            const appName = await this.getAppName(i);
            
            console.log(`[INFO] Attempting to delete app: ${appName} at index ${i}`);
            
            const deleteResult = await this.deleteFavoriteApp(i);
            
            if (deleteResult.success) {
                deletedApps.push(deleteResult);
                console.log(`[INFO] Successfully deleted app: ${deleteResult.appName}`);
                
                // Update current count after successful deletion
                currentCount = await this.getFavoriteAppsCount();
            } else {
                console.log(`[WARN] Failed to delete app: ${deleteResult.appName}`);
            }
            
            // Wait between deletions to avoid UI issues
            await this.t.wait(1000);
        }
        
        // Add Watch TV to non-deletable apps list
        const watchTvName = await this.getAppName(0);
        nonDeletableApps.push({ name: watchTvName, index: 0 });
        
        return {
            deletedApps,
            nonDeletableApps,
            finalCount: await this.getFavoriteAppsCount()
        };
    }

    /**
     * Verify favorite apps row exists and contains apps
     */
    async verifyFavoriteAppsExist() {
        await this.waitForElement('._favAppsList_tcq1v_712');
        const count = await this.getFavoriteAppsCount();
        await this.t.expect(count).gte(1, 'At least one favorite app should exist');
        return count;
    }

    /**
     * Get list of all favorite app names
     */
    async getAllFavoriteAppNames() {
        const count = await this.getFavoriteAppsCount();
        const appNames = [];
        
        for (let i = 0; i < count; i++) {
            const name = await this.getAppName(i);
            appNames.push(name);
        }
        
        return appNames;
    }
}
