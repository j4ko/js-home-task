import { Selector, t } from 'testcafe';

class FavoritesPage {
    constructor() {
        this.favoriteAppsContainer = Selector('#favourite-apps');
        this.favoriteAppItems = this.favoriteAppsContainer.find('._itemTitle_10v6y_138');
        this.deleteButtons = Selector('[data-testid="editmode-remove-app"]');
        this.editOverlay = Selector('._overlay_15ypj_1');
    }

    async getFavoriteAppsCount() {
        if (await this.favoriteAppsContainer.exists) {
            return this.favoriteAppItems.count;
        }
        return 0; // If the container doesn't exist, there are no favorites.
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
            const appText = await this.favoriteAppItems.nth(i).textContent;
            apps.push(appText.trim());
        }
        return apps;
    }

    async activateDeleteMode() {
        // Using dispatchEvent for a more reliable long press simulation
        await t.dispatchEvent(this.favoriteAppsContainer, 'keydown', { key: 'Enter', keyCode: 13 });
        await t.wait(2000); // Hold duration
        await t.dispatchEvent(this.favoriteAppsContainer, 'keyup', { key: 'Enter', keyCode: 13 });
    }

    async isDeleteModeActive() {
        const deleteButtonsVisible = (await this.deleteButtons.count) > 0;
        const overlayVisible = await this.editOverlay.visible;
        return deleteButtonsVisible && overlayVisible;
    }

}
export default new FavoritesPage();

