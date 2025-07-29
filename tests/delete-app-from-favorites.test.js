import HomePage from "../pages/home-page.js";

fixture("TV OS Automation - Delete Favorite App").beforeEach(async (t) => {
    // This will run before each test in this fixture
    // You can add setup steps here if needed, like logging in.
});

test("Verify we can delete apps in the home page favourite apps row", async (t) => {
    // Get the initial number and list of favorite apps
    const initialAppsCount = await HomePage.getFavoriteAppsCount();
    const initialApps = await HomePage.getFavoriteApps();

    // There should be at least two apps to perform this test
    await t.expect(initialAppsCount).gte(2, "There should be at least two apps to perform this test.");

    // Select the second app to delete
    const appToDelete = initialApps[1];

    // Navigate to the second app
    await t.pressKey("right");

    // Activate delete mode and verify it is active
    await HomePage.activateDeleteMode();
    await t.expect(await HomePage.isDeleteModeActive()).ok("Delete mode should be activated.");

    // Navigate to the delete button and confirm deletion
    await HomePage.confirmDeleteFavoriteApp();

    // Get the updated list and count of favorite apps
    const finalApps = await HomePage.getFavoriteApps();
    const finalAppsCount = await HomePage.getFavoriteAppsCount();

    // The number of visible favorite apps should decrease by one
    await t.expect(finalAppsCount).eql(initialAppsCount - 1, "The number of visible favorite apps should decrease by one.");

    // The deleted app should no longer be in the favorites list
    await t.expect(finalApps.includes(appToDelete)).notOk(`The app "${appToDelete}" should have been deleted.`);
});
