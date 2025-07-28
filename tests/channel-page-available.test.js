import { ClientFunction } from 'testcafe';
import HomePage from '../pages/home-page';

const getCurrentUrl = ClientFunction(() => window.location.href);

fixture('TV OS - Channel Page Available')
    .disablePageCaching;

test('Verify Channels page is available to use', async t => {
    // ACT: Navigate to the Channels page.
    await HomePage.navigateToChannels();

    // ASSERT: Verify the content of the page.
    await t.expect(getCurrentUrl()).contains('channel', 'URL should indicate the channels page');
});
