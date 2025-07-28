import FavoritesPage from '../pages/favorites-page';

fixture('TV OS Automation - Delete Favorite App')
    .beforeEach(async t => {
        // This will run before each test in this fixture
        // You can add setup steps here if needed, like logging in.
    });

test('Verify we can delete apps in the home page favourite apps row', async t => {
    // 1. Get initial state
    const initialAppsCount = await FavoritesPage.getFavoriteAppsCount();
    const initialApps = await FavoritesPage.getFavoriteApps();

    // console.log(`Initial number of favorite apps: ${initialAppsCount}`);
    // console.log(`Initial apps: ${initialApps.join(', ')}`);
    
    await t.expect(initialAppsCount).gte(2, 'There should be at least two apps to perform this test.');

    const appToDelete = initialApps[1];

    // 2. Navigate to the second app
    await t.pressKey('right');
    
    // 3. Activate delete mode
    await FavoritesPage.activateDeleteMode();
    await t.expect(await FavoritesPage.isDeleteModeActive()).ok('Delete mode should be activated.');
    
    // 4. Navigate to delete button and confirm
    await t.pressKey('down');
    await t.pressKey('enter');
    await t.wait(1000); // wait for confirmation dialog
    await t.pressKey('enter');

    // 5. Verify the app was deleted

    const finalApps = await FavoritesPage.getFavoriteApps();
    const finalAppsCount = await FavoritesPage.getFavoriteAppsCount();
    await t.expect(finalAppsCount).eql(initialAppsCount - 1, 'The number of visible favorite apps should decrease by one.');

    
    // console.log(`Final apps: ${finalApps.join(', ')}`);
    // console.log(`Final number of favorite apps: ${finalAppsCount}`);


    await t.expect(finalApps.includes(appToDelete)).notOk(`The app "${appToDelete}" should have been deleted.`);
});
