import { ClientFunction } from "testcafe";
import HomePage from "../pages/home-page";
import ChannelPage from "../pages/channels-page";

// Helper to get the current URL from the browser
const getCurrentUrl = ClientFunction(() => window.location.href);

fixture("TV OS - Channel Page Available").disablePageCaching;

test("Verify Channels page is available to use", async (t) => {
    // Get the URL before navigation for debugging purposes
    const urlBefore = await getCurrentUrl();
    await t.expect(true).ok(`URL before navigating to Channels: ${urlBefore}`);

    // Navigate to the Channels page from the home page
    await HomePage.navigateToChannels();

    // Wait until the Channels page is fully loaded (checks for visible data-testid elements)
    await ChannelPage.isLoaded();

    // Get the URL after navigation
    const urlAfter = await getCurrentUrl();

    // Assert that the URL contains 'channels', indicating the correct page is loaded
    await t.expect(urlAfter).contains("channels", "URL should indicate the channels page");
});
