import { Selector } from 'testcafe';
import { BasePage } from './base-page.js';

/**
 * Channels Page Object Model
 * Handles interactions with the channels page
 */
export class ChannelsPage extends BasePage {
    constructor(testController) {
        super(testController);
        
        // Page-specific selectors
        this.channelGrid = Selector(this.selectors.channelsPage.channelGrid);
        this.channelItems = this.channelGrid.find(this.selectors.channelsPage.channelItem);
    }

    /**
     * Navigate to channels page
     */
    async goToChannelsPage() {
        await this.navigateToChannels();
        await this.waitForChannelsPageToLoad();
        return this;
    }

    /**
     * Wait for channels page to load
     */
    async waitForChannelsPageToLoad() {
        await this.waitForElement(this.selectors.channelsPage.channelGrid);
        await this.waitForAnimationsToComplete();
        return this;
    }

    /**
     * Verify channels page is accessible and functional
     */
    async verifyChannelsPageAccessibility() {
        // Check if channel grid exists
        await this.t.expect(this.channelGrid.exists).ok('Channel grid should exist');
        
        // Check if channels are loaded
        const channelCount = await this.channelItems.count;
        await this.t.expect(channelCount).gte(1, 'At least one channel should be available');
        
        // Test navigation within channels
        if (channelCount > 0) {
            await this.remoteControl.navigateRight();
            await this.remoteControl.navigateLeft();
        }
        
        return { accessible: true, channelCount };
    }
}
