import { ClientFunction, Selector } from "testcafe";
import HomePage from "../pages/home-page";
import SearchPage from "../pages/search-page";

// Helper to get the current URL from the browser
const getCurrentUrl = ClientFunction(() => window.location.href);

fixture("TV OS - Open Category from Search Page").disablePageCaching; // Best practice for speed and stability

test("Navigate to Search page and open a random category", async (t) => {
    // Wait for the #search element to exist and be visible before navigating to the search page
    await HomePage.waitForMenuSearchVisible();
    // Navigate to the search page from the home page
    await HomePage.navigateToSearch();

    // Assert we are on the search page by checking the URL
    await t.expect(getCurrentUrl()).contains("/search", "Should be on the search page", { timeout: 5000 });

    // Wait for the genres grid to be visible before interacting
    await SearchPage.waitForGenresGridVisible();

    // Select a random genre and get its name
    const selectedGenre = await SearchPage.selectRandomGenre();

    // Get the genre from the URL after selection
    const finalGenreInUrl = await SearchPage.getSelectedGenreFromURL();

    // Assert that the URL contains the selected genre as a query parameter
    await t.expect(finalGenreInUrl.toLowerCase()).eql(
        selectedGenre.toLowerCase(),
        `URL should contain the selected genre "${selectedGenre}"`
    );
});
