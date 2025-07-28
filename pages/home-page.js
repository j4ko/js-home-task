import { Selector, t } from 'testcafe';
import FavoritesPage from './favorites-page.js';
import ChannelsPage from './channels-page.js';

class HomePage {
    constructor() {
        this.favoritesSection = FavoritesPage;
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
        
        await t.expect(Selector('._genresGrid_swwug_1').exists).ok('Should navigate to the Search page', { timeout: 10000 });
    }

    /**
     * Gets the list of favorite apps from the home screen.
     * @returns {Promise<string[]>} A list of favorite application names.
     */
    async getFavoriteApps() {
        // Delegate to the FavoritesPage to get the app names
        return this.favoritesSection.getFavoriteApps();
    }
}

export default new HomePage();
