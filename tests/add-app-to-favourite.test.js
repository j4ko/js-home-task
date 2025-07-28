import { t, ClientFunction } from 'testcafe';
import HomePage from '../pages/home-page.js';
import AppsPage from '../pages/apps-page.js';

const getCurrentUrl = ClientFunction(() => window.location.href);

fixture('TV OS - Add App to Favorites');

test('Add an app to home page favourites from apps page', async t => {
    // ARRANGE: Get the initial state
    const initialFavorites = await HomePage.getFavoriteApps();

    // ACT: Navigate and add a new app
    await HomePage.navigateToApps();
    
    // Assert we are on the apps page
    await t.expect(getCurrentUrl()).contains('/page/499', 'Should navigate to the Apps page');
    

    const appToAdd = await AppsPage.findNonFavoriteApp(initialFavorites);
    await t.expect(appToAdd).ok(`Should find a non-favorite app to add. Found: ${appToAdd}`);

    await AppsPage.waitForBanner();
    await AppsPage.navigateToAndSelectApp(appToAdd);
    
    // The "Add to Favourites" button is focused by default. Press Enter to add.
    await t.pressKey('enter');

    // After adding, the app should automatically return to the home screen.
    await t.expect(HomePage.favoritesSection.favoriteAppsContainer.exists).ok('Should return to Home page automatically', { timeout: 10000 });
    await t.wait(2000); // Add a small wait for UI to settle after navigation

    // ASSERT: Verify the new state
    const finalFavorites = await HomePage.getFavoriteApps();

    await t.expect(finalFavorites.length).gt(initialFavorites.length, 'The number of favorite apps should increase.');
    
    // Use `some` to check if any final favorite contains the added app's name as a substring.
    // This is more robust against potential DOM issues like duplicated text nodes.
    const isAppAdded = finalFavorites.some(fav => fav.includes(appToAdd));
    await t.expect(isAppAdded).ok(`The new app "${appToAdd}" should be in the favorites list.`);
});

