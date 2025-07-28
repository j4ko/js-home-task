import { ClientFunction } from 'testcafe';
import HomePage from '../pages/home-page';
import SearchPage from '../pages/search-page';

const getCurrentUrl = ClientFunction(() => window.location.href);

fixture('TV OS Automation - Open Category from Search Page')
    .disablePageCaching; // Best practice for speed and stability

test('Navigate to Search page and open a random category', async t => {
    // ARRANGE: Navigate to the search page
    await HomePage.navigateToSearch();
    await t.expect(getCurrentUrl()).contains('/search', 'Should be on the search page');

    // ACT: Select a random genre and get its name
    const selectedGenre = await SearchPage.selectRandomGenre();
    
    // ASSERT: Verify the URL contains the selected genre as a query parameter
    const finalGenreInUrl = await SearchPage.getSelectedGenreFromURL();
    
    await t.expect(finalGenreInUrl.toLowerCase()).eql(selectedGenre.toLowerCase(), `URL should contain the selected genre "${selectedGenre}"`);
});
