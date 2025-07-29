import { t, ClientFunction } from "testcafe";
import HomePage from "../pages/home-page.js";
import AppsPage from "../pages/apps-page.js";

// Helper to get the current URL from the browser
const getCurrentUrl = ClientFunction(() => window.location.href);

fixture("TV OS - Add App to Favorites").disablePageCaching;

test("Add an app to home page favourites from apps page", async (t) => {
    // Get the initial list of favorite apps
    const initialFavorites = await HomePage.getFavoriteApps();

    // Navigate to the Apps page from the home page
    await HomePage.navigateToApps();

    // Assert we are on the Apps page by checking the URL
    await t.expect(getCurrentUrl()).contains("/page/499", "Should navigate to the Apps page");
    await AppsPage.waitForBanner();

    // Find an app that is not already a favorite
    const appToAdd = await AppsPage.findNonFavoriteApp(initialFavorites);
    await t.expect(appToAdd).ok(`Should find a non-favorite app to add. Found: ${appToAdd}`);

    // Navigate to and select the app to add it to favorites
    await AppsPage.navigateToAndSelectApp(appToAdd);

    // The "Add to Favourites" button is focused by default. Press Enter to confirm
    await t.pressKey("enter");

    // Get the updated list of favorite apps
    const finalFavorites = await HomePage.getFavoriteApps();

    // Assert that the number of favorite apps increased
    await t.expect(finalFavorites.length).gt(initialFavorites.length, "The number of favorite apps should increase.");

    // Check that the new app is in the favorites list
    const isAppAdded = finalFavorites.some((fav) => fav.includes(appToAdd));
    await t.expect(isAppAdded).ok(`The new app "${appToAdd}" should be in the favorites list.`);
});

