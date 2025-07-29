import { ClientFunction } from 'testcafe';
import HomePage from '../pages/home-page';

const getCurrentUrl = ClientFunction(() => window.location.href);

fixture('TV OS - Channel Page Available')
    .disablePageCaching;

test('Verify Channels page is available to use', async t => {
    // ACT: Robust navigation to the channels page
   
    // Log inicial
    const urlBefore = await getCurrentUrl();
    console.log('URL antes de navegar a Channels:', urlBefore);
    await t.expect(true).ok(`URL antes de navegar: ${urlBefore}`);
    await HomePage.navigateToChannels();

    const urlAfter = await getCurrentUrl();

    console.log('URL after navigating to Channels:', urlAfter);

    await t.expect(urlAfter).contains('channels', 'URL should indicate the channels page');

});
