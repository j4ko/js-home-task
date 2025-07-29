import { Selector, t } from 'testcafe';

class ChannelsPage {
    constructor() {
        // Selector for the body, to check if the page has any content at all
        this.pageBody = Selector('body');
        // The specific selector for the channels content
        this.channelContent = Selector('div[class*="channelList"]');
    }

    /**
     * Verifies that the channels page is visible by checking for at least one visible element with a data-testid attribute.
     */
    async isLoaded() {
        // Wait for the body to have at least one element, indicating the page is not blank.
        await t.expect(this.pageBody.childElementCount).gt(0, 'The page body should not be empty.', { timeout: 15000 });

        // Wait for at least one visible element with a data-testid attribute
        const dataTestIdSelector = Selector('[data-testid]').filterVisible();
        await t.expect(dataTestIdSelector.count).gt(0, 'There should be at least one visible element with a data-testid attribute.', { timeout: 10000 });
    }
}

export default new ChannelsPage();
