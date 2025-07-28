import { Selector, t } from 'testcafe';

class ChannelsPage {
    constructor() {
        // Selector for the body, to check if the page has any content at all
        this.pageBody = Selector('body');
        // The specific selector for the channels content
        this.channelContent = Selector('div[class*="channelList"]');
    }

    /**
     * Verifies that the channels page is visible by first checking if the page
     * has any content, and then looking for the specific channel container.
     */
    async isLoaded() {
        // 1. Wait for the body to have at least one element, indicating the page is not blank.
        await t.expect(this.pageBody.childElementCount).gt(0, 'The page body should not be empty.', { timeout: 15000 });
        
        // 2. Now, look for the specific content of the channels page.
        await t.expect(this.channelContent.exists).ok('The channels page content should exist.', { timeout: 10000 });
    }
}

export default new ChannelsPage();
