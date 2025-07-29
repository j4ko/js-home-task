
import { Selector, t } from 'testcafe';
import ChannelsPage from './channels-page.js';


class HomePage {
    constructor() {
        this.favoriteAppsContainer = Selector('[data-testid="user-apps"]');
        this.favoriteAppItems = this.favoriteAppsContainer.find('#favourite-apps').child('div');
        this.deleteButtons = Selector('[data-testid="editmode-remove-app"]');
    }

    /**
     * Navigates to the "Apps" section from the home page's main menu.
     * This sequence is based on the navigation flow observed in the application.
     */
    async navigateToApps() {
        // Navigate to the Apps button in the main menu
        await t.pressKey('up').wait(250);
        await t.pressKey('up').wait(250);
        // Move right until #menu-item-6 is focused
        let maxAttempts = 10;
        let focusedMenuItem = Selector('#menu-item-6[data-focused="focused"]');
        for (let i = 0; i < maxAttempts; i++) {
            if (await focusedMenuItem.exists) {
                break;
            }
            await t.pressKey('right').wait(250);
        }
        // Ensure we are on the correct button
        await t.expect(focusedMenuItem.exists).ok('Focus should be on the Apps button (#menu-item-6)');
        await t.pressKey('enter');
        // Verify that the navigation was successful.
        await t.expect(Selector('[data-testid="lists-container"]').exists).ok('Should navigate to the Apps page', { timeout: 10000 });
    }

    /**
     * Navigates to the "Channels" page by clicking the corresponding button,
     * asegurando que el elemento existe y es visible antes del click.
     */
    async navigateToChannels() {
        await t.pressKey('up').wait(250);
        await t.pressKey('up').wait(250);
        // IDs of the top menu items
        const targetIndex = 3; // Channels
        const menuItemSelector = (idx) => Selector(`#menu-item-${idx}`);
        // Find the currently focused index
        let focusedIndex = -1;
        for (let i = 0; i <= 6; i++) {
            const el = menuItemSelector(i);
            if (await el.getAttribute('data-focused') === 'true') {
                focusedIndex = i;
                break;
            }
        }
        // Si no se encuentra, fallback a Home (1)
        if (focusedIndex === -1) focusedIndex = 1;

        // Calcula desplazamiento
        let direction = targetIndex > focusedIndex ? 'right' : 'left';
        let steps = Math.abs(targetIndex - focusedIndex);
        for (let i = 0; i < steps; i++) {
            await t.pressKey(direction).wait(250);
        }
        // Verify that the focus is on Channels
        const focusedMenuItem = menuItemSelector(targetIndex).withAttribute('data-is-focused', 'true');
        await t.expect(focusedMenuItem.exists).ok('Focus must be on the Channels button (#menu-item-3)');
        await t.pressKey('enter');
        // Espera breve para permitir la apertura de la nueva ventana
        await t.wait(1000);
    }

    /**
     * Navigates to the "Search" page from the home page's main menu.
     */
    async navigateToSearch() {
        await t.pressKey('up').wait(250);
        await t.pressKey('up').wait(250);
        // Move left until #menu-item-0 is focused
        let maxAttempts = 10;
        let focusedMenuItem = Selector('#menu-item-0[data-focused="focused"]');
        for (let i = 0; i < maxAttempts; i++) {
            if (await focusedMenuItem.exists) {
                break;
            }
            await t.pressKey('left').wait(250);
        }
        // Ensure we are on the correct button
        await t.pressKey('enter');
        await t.wait(3000);
    }


    /**
     * Gets the list of favorite apps from the home screen.
     * @returns {Promise<string[]>} A list of favorite application names.
     */
    async getFavoriteApps() {
        await t.expect(this.favoriteAppsContainer.visible).ok('Favorites container should be visible', { timeout: 10000 });

        const apps = [];
        const count = await this.favoriteAppItems.count;
        if (count === 0) {
            return apps;
        }

        for (let i = 0; i < count; i++) {
            const appItem = this.favoriteAppItems.nth(i);
            const opacity = await appItem.getStyleProperty('opacity');
            if (opacity !== '0') {
                const appName = await appItem.getAttribute('data-testid');
                apps.push(appName.trim());
            }
        }
        return apps;
    }

    /**
     * Gets the count of visible favorite apps.
     * @returns {Promise<number>} The number of visible favorite apps.
     */
    async getFavoriteAppsCount() {
        await t.expect(this.favoriteAppsContainer.visible).ok('Favorites container should be visible', { timeout: 10000 });
        let visibleCount = 0;
        const count = await this.favoriteAppItems.count;
        for (let i = 0; i < count; i++) {
            const appItem = this.favoriteAppItems.nth(i);
            const opacity = await appItem.getStyleProperty('opacity');
            if (opacity !== '0') {
                visibleCount++;
            }
        }
        return visibleCount;
    }

    /**
     * Activa el modo de borrado de favoritos (long press Enter).
     */
    async activateDeleteMode() {
        const focusableContainer = Selector('#favourite-apps');
        await t.dispatchEvent(focusableContainer, 'keydown', { key: 'Enter', keyCode: 13 });
        await t.wait(2000); // Hold duration
        await t.dispatchEvent(focusableContainer, 'keyup', { key: 'Enter', keyCode: 13 });
    }

    /**
     * Checks if the delete mode is active.
     * @returns {Promise<boolean>}
     */
    async isDeleteModeActive() {
        const deleteButtonsVisible = (await this.deleteButtons.count) > 0;
        return deleteButtonsVisible;
    }
}

export default new HomePage();
