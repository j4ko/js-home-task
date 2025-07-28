import { Selector, t } from 'testcafe';

class AppDetailsPage {
    constructor() {
        // Use the specific ID for the "Add to Favourites" button.
        this.addToFavoritesButton = Selector('#app-fav-button');
        this.backButton = Selector('._backButton_10v6y_1'); // A potential selector for the back button
    }

    /**
     * Clicks the "Add to Favorites" button.
     */
    async addToFavorites() {
        await t
            .expect(this.addToFavoritesButton.exists).ok('The "Add to Favorites" button should exist', { timeout: 10000 })
            .click(this.addToFavoritesButton);
    }

    /**
     * Navigates back to the previous page, presumably the Apps page.
     */
    async goBack() {
        // The most reliable way to go back is often pressing the 'backspace' or 'escape' key in TV interfaces
        await t.pressKey('backspace');
    }
}

export default new AppDetailsPage();
