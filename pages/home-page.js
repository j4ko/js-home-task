
import { Selector, t } from 'testcafe';
import ChannelsPage from './channels-page.js';


class HomePage {
    constructor() {
        this.favoriteAppsContainer = Selector('[data-testid="user-apps"]');
        this.favoriteAppItems = this.favoriteAppsContainer.find('#favourite-apps').child('div');
        this.deleteButtons = Selector('[data-testid="editmode-remove-app"]');
        this.editOverlay = Selector('._overlay_15ypj_1');
    }

    /**
     * Navigates to the "Apps" section from the home page's main menu.
     * This sequence is based on the navigation flow observed in the application.
     */
    async navigateToApps() {
        // Reverting to a more direct navigation sequence with generous waits
        // to ensure the UI keeps up with the automation.
        await t
            .pressKey('up')
            .wait(500)
            .pressKey('up')
            .wait(500)
            .pressKey('right') // Move to "Search"
            .wait(500)
            .pressKey('right') // Move to "Home"
            .wait(500)
            .pressKey('right') // Move to "TV Guide"
            .wait(500)
            .pressKey('right') // Move to "Channels"
            .wait(500)
            .pressKey('right') // Move to "Apps"
            .wait(500)
            .pressKey('enter');
        
        // Verify that the navigation was successful.
        await t.expect(Selector('[data-testid="lists-container"]').exists).ok('Should navigate to the Apps page', { timeout: 10000 });
    }

    /**
     * Navigates to the "Channels" page from the home page's main menu.
     */
    async navigateToChannels() {
        await t
            .pressKey('up')
            .wait(500)
            .pressKey('up')
            .wait(500)
            .pressKey('right') // Move to "TV Guide"
            .wait(500)
            .pressKey('right') // Move to "Channels"
            .wait(500)
            .pressKey('enter');
        
        // Wait for the new window to open
        await t.wait(3000);
    }

    /**
     * Navigates to the "Search" page from the home page's main menu.
     */
    async navigateToSearch() {
        await t
            .pressKey('up')
            .wait(500)
            .pressKey('up')
            .wait(500)
            .pressKey('left') // Move to "Search"
            .wait(500)
            .pressKey('enter');
        
        await t.expect(Selector('#search-genres').exists).ok('Should navigate to the Search page', { timeout: 10000 });
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
     * Verifica si el modo de borrado está activo.
     * @returns {Promise<boolean>}
     */
    async isDeleteModeActive() {
        const deleteButtonsVisible = (await this.deleteButtons.count) > 0;
        const overlayVisible = await this.editOverlay.visible;
        return deleteButtonsVisible && overlayVisible;
    }
}

export default new HomePage();
