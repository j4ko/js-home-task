import { Selector, t } from 'testcafe';

class FavoritesPage {
    constructor() {
        this.favoriteAppsContainer = Selector('[data-testid="user-apps"]');
        // This selector targets each individual app item within the container.
        this.favoriteAppItems = this.favoriteAppsContainer.find('#favourite-apps').child('div');
        this.deleteButtons = Selector('[data-testid="editmode-remove-app"]');
        this.editOverlay = Selector('._overlay_15ypj_1');
    }

    async getFavoriteAppsCount() {
        await t.expect(this.favoriteAppsContainer.visible).ok('Favorites container should be visible', { timeout: 10000 });
        return this.favoriteAppItems.count;
    }

    async getFavoriteApps() {
        // Wait for the container to be visible to ensure it's fully loaded.
        await t.expect(this.favoriteAppsContainer.visible).ok('Favorites container should be visible', { timeout: 10000 });

        const apps = [];
        const count = await this.favoriteAppItems.count;
        if (count === 0) {
            return apps;
        }

        for (let i = 0; i < count; i++) {
            // The app name is stored in the 'data-testid' attribute of each item.
            const appName = await this.favoriteAppItems.nth(i).getAttribute('data-testid');
            apps.push(appName.trim());
        }
        return apps;
    }

    async activateDeleteMode() {
        // Using dispatchEvent for a more reliable long press simulation
        // The event should be dispatched to the focusable container.
        const focusableContainer = Selector('#favourite-apps');
        await t.dispatchEvent(focusableContainer, 'keydown', { key: 'Enter', keyCode: 13 });
        await t.wait(2000); // Hold duration
        await t.dispatchEvent(focusableContainer, 'keyup', { key: 'Enter', keyCode: 13 });
    }

    async isDeleteModeActive() {
        const deleteButtonsVisible = (await this.deleteButtons.count) > 0;
        const overlayVisible = await this.editOverlay.visible;
        return deleteButtonsVisible && overlayVisible;
    }

}
export default new FavoritesPage();

