import { ClientFunction } from 'testcafe';
import HomePage from '../pages/home-page';
import ChannelsPage from '../pages/channels-page';

const getCurrentUrl = ClientFunction(() => window.location.href);

fixture('TV OS Automation - Channel Page Available')
    .page('https://app.titanos.tv/')
    .disablePageCaching;

test('Navigate to Channels section and verify page is available', async t => {
    // ACT: Navigate to the Channels page.
    await HomePage.navigateToChannels();

    // ASSERT: Verify the content of the page.
    await t.expect(getCurrentUrl()).contains('channel', 'URL should indicate the channels page');
});
