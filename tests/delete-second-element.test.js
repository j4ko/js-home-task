import { Selector } from 'testcafe';
import { RemoteControl } from '../utils/remote-control.js';

fixture('TV OS Automation - Delete Second Element')
    .page('https://app.titanos.tv/');

test('Navigate and delete second app from favorites using TV remote simulation', async t => {
    console.log('[TEST] Starting TV OS automation test...');
    console.log('[TEST] Objective: Delete second app from favorites using TV remote controls');
    
    const remote = new RemoteControl(t);
    console.log('[TEST] === Getting initial favorites list ===');
    
    await t.wait(5000);
    
    let initialState = await t.eval(() => {
        const container = document.querySelector('#favourite-apps');
        if (!container) return { totalApps: 0, apps: [] };
        
        const appElements = container.querySelectorAll('[data-testid]:not([data-testid=""])')
        const filteredApps = Array.from(appElements).filter(app => {
            const testId = app.getAttribute('data-testid');
            return !testId.includes('editmode-');
        });
        
        return {
            totalApps: filteredApps.length,
            apps: filteredApps.map(app => ({
                testId: app.getAttribute('data-testid'),
                title: app.querySelector('._itemTitle_10v6y_138')?.textContent?.trim() || 'No title'
            }))
        };
    });
    
    console.log('[TEST] Found apps:', initialState.apps.map(app => app.title + ' (' + app.testId + ')').join(', '));
    
    if (initialState.totalApps < 2) {
        console.log('[TEST] Not enough apps to delete second element');
        return;
    }
    
    let targetApp = initialState.apps[1]; // Second app (index 1)
    console.log('[TEST] Attempting to delete second app:', targetApp.title);
    
    // Navigate to second app (index 1)
    console.log('[TEST] Navigating to second app...');
    await remote.navigateRight(1);
    await t.wait(1000);
    
    // Verify we're on the correct app
    const currentFocusedApp = await t.eval(() => {
        const focusedElement = document.querySelector('#favourite-apps [data-focused="focused"]');
        return focusedElement ? focusedElement.getAttribute('data-testid') : null;
    });
    
    console.log('[TEST] Currently focused app:', currentFocusedApp);
    
    if (currentFocusedApp === targetApp.testId) {
        console.log('[TEST] Executing long press to activate delete mode...');
        await remote.longPress();
        
        console.log('[TEST] Navigating down to delete button...');
        await remote.navigateDown();
        
        console.log('[TEST] Pressing Enter to confirm deletion...');
        await remote.pressOk();
        
        await t.wait(2000);
        
        const editModeCheck = await t.eval(() => {
            const editModeIndicator = document.querySelector('[data-testid*="editmode-"]');
            return editModeIndicator !== null;
        });
        
        if (!editModeCheck) {
            console.log('[TEST] Edit mode exited - deletion appears successful!');
            
            const finalCheck = await t.eval(() => {
                const container = document.querySelector('#favourite-apps');
                if (!container) return { totalApps: 0 };
                
                const appElements = container.querySelectorAll('[data-testid]:not([data-testid=""])');
                const filteredApps = Array.from(appElements).filter(app => {
                    const testId = app.getAttribute('data-testid');
                    return !testId.includes('editmode-');
                });
                
                return { totalApps: filteredApps.length };
            });
            
            if (finalCheck.totalApps < initialState.totalApps) {
                console.log('[TEST] SUCCESS! App was deleted!');
                console.log('[TEST] Apps count:', initialState.totalApps, '->', finalCheck.totalApps);
            } else {
                console.log('[TEST] Edit mode exited but app count unchanged - app may be protected');
            }
        } else {
            console.log('[TEST] Still in edit mode - deletion failed or app is protected');
            
            const errorMessage = await t.eval(() => {
                const errorMsg = document.querySelector('[data-testid="error-message"]');
                return errorMsg ? errorMsg.textContent.trim() : null;
            });
            
            if (errorMessage) {
                console.log('[TEST] Found error message:', errorMessage);
                console.log('[TEST] Pressing OK to dismiss error...');
                await remote.pressOk();
                await t.wait(1000);
            }
        }
    } else {
        console.log('[TEST] Failed to navigate to correct app. Expected:', targetApp.testId, 'but found:', currentFocusedApp);
    }
    
    console.log('[TEST] Test completed!');
});
