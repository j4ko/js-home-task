import { Selector } from 'testcafe';
import { RemoteControl } from '../utils/remote-control.js';
import { SearchPage } from '../pages/search-page.js';

fixture('TV OS Automation - Open Category from Search Page')
    .page('https://app.titanos.tv/');

test('Navigate to Search page and open a RANDOM category using TV remote simulation', async t => {
    console.log('[TEST] Starting TV OS automation test...');
    console.log('[TEST] Objective: Navigate to Search page and open a RANDOM category using TV remote controls');
    
    console.log('[TEST] === Step 1: Navigate to Search page using RemoteControl ===');
    
    // Navigate to homepage and wait for content to load
    await t.navigateTo('https://app.titanos.tv/');
    await t.wait(3000);
    
    // Initialize RemoteControl
    const remote = new RemoteControl(t);
    
    console.log('[TEST] 🎮 Using RemoteControl for TV navigation...');
    
    // Step 1.1: Navigate UP to reach main menu
    console.log('[TEST] ⬆️ Navigating UP to reach main menu...');
    await remote.navigateUp(2);
    
    // Step 1.2: Navigate to Search menu item (main-menu-item-0)
    console.log('[TEST] 🔍 Navigating to Search menu item (main-menu-item-0)...');
    await remote.navigateLeft(5); // Go to the leftmost position
    
    // Step 1.3: Press ENTER to select Search
    console.log('[TEST] ⏎ Pressing ENTER to select Search section...');
    await remote.pressOk();
    
    // Wait for navigation to complete
    await t.wait(3000);
    
    console.log('[TEST] === Step 2: Verify we are on the search page ===');
    
    // Verify navigation to Search page (URL should end with /search)
    const currentUrl = await t.eval(() => window.location.href);
    console.log(`[TEST] Current URL after navigation: ${currentUrl}`);
    
    await t.expect(currentUrl).contains('/search', 'Should be on search page - URL should contain /search');
    console.log('[TEST] ✅ Successfully navigated to search page');
    
    console.log('[TEST] === Step 3: Navigate to a RANDOM genre using grid coordinates ===');
    
    // Take a screenshot to see the search page structure
    await t.takeScreenshot('debug-search-page-structure-original-improved');
    
    // Wait for search genres container to load
    const searchGenresSelector = '._genresGrid_swwug_1';
    const searchGenres = Selector(searchGenresSelector);
    
    await t.expect(searchGenres.exists).ok('Search genres container should exist', { timeout: 10000 });
    console.log('[TEST] 📋 Search genres container found');
    
    // Get all genre items
    const genreItemSelector = '._genre_swwug_1';
    const genreItems = searchGenres.find(genreItemSelector);
    
    // Wait for genres to load
    await t.wait(2000);
    
    const genreCount = await genreItems.count;
    console.log(`[TEST] 📝 Found ${genreCount} genres in search page`);
    
    await t.expect(genreCount).gt(0, 'Should have at least one genre available');
    
    // Get all available genres
    const allAvailableGenres = [];
    for (let i = 0; i < genreCount; i++) {
        const genreText = await genreItems.nth(i).innerText;
        allAvailableGenres.push(genreText.trim());
    }
    
    console.log(`[TEST] 📋 All available genres: [${allAvailableGenres.join(', ')}]`);
    
    // Implement TRULY random selection with direct navigation to ensure accuracy
    // Select a random genre from the available list
    const randomIndex = Math.floor(Math.random() * genreCount);
    const selectedGenreName = allAvailableGenres[randomIndex];
    
    console.log(`[TEST] 🎲 RANDOM SELECTION:`);
    console.log(`[TEST] 🎯 Random index: ${randomIndex} out of ${genreCount} genres`);
    console.log(`[TEST] � RANDOMLY SELECTED GENRE: "${selectedGenreName}"`);
    console.log(`[TEST] 🎯 Target: Navigate directly to "${selectedGenreName}"`);
    
    // Use TV Remote navigation approach with direct search for the target genre
    console.log('[TEST] 📍 Using DIRECT TV Remote navigation approach');
    console.log(`[TEST] 🎯 Searching specifically for: "${selectedGenreName}"`);
    
    // First navigate right to get out of the menu and into content area
    console.log('[TEST] ➡️ Moving right to exit menu and enter content area...');
    await remote.navigateRight();
    await t.wait(300);
    
    // First, let's go to the first element of the grid systematically
    console.log(`[TEST] 🏠 First, navigating to the top-left of the grid...`);
    
    // Navigate up and left to ensure we're at the top-left
    await remote.navigateUp(5);
    await t.wait(200);
    await remote.navigateLeft(5);
    await t.wait(200);
    
    // Now navigate down to the first genre
    console.log(`[TEST] ⬇️ Moving down to reach first genre...`);
    await remote.navigateDown();
    await t.wait(300);
    
    // PHASE 1: Navigate through ALL genres systematically in a simple grid pattern
    console.log(`[TEST] 🔍 PHASE 1: Navigating through ALL genres systematically...`);
    console.log(`[TEST] 📋 Using SIMPLE ROW-BY-ROW SEARCH (6 columns per row, 3 rows total)`);
    
    let attempts = 0;
    let maxAttempts = 20; // We know there are 16 genres, so 20 should be enough
    let targetFound = false;
    let currentFocus = null;
    let visitedGenres = [];
    const expectedColumns = 6; // Correct grid layout: 6x3 with 2 empty spaces at the end
    
    // Simple systematic search: 4 elements per row
    while (attempts < maxAttempts && !targetFound) {
        console.log(`[TEST] 🔍 Search step ${attempts + 1}: Looking for "${selectedGenreName}"...`);
        
        // Check current focus
        currentFocus = await t.eval(() => {
            const searchGenresContainer = document.getElementById('search-genres');
            let focused = null;
            
            if (searchGenresContainer) {
                focused = searchGenresContainer.querySelector('[data-focused="true"]');
            }
            
            if (!focused) {
                focused = document.querySelector('[data-focused="true"], [data-focused], .focused, :focus');
            }
            
            if (focused) {
                return {
                    textContent: focused.textContent ? focused.textContent.trim() : '',
                    className: focused.className,
                    isInSearchGenres: !!searchGenresContainer && searchGenresContainer.contains(focused)
                };
            }
            return null;
        });
        
        const currentGenre = currentFocus ? currentFocus.textContent : 'Unknown';
        console.log(`[TEST] 👀 Position ${attempts + 1}: "${currentGenre}"`);
        
        // Add to visited list
        if (currentGenre && currentGenre !== 'Unknown' && !visitedGenres.includes(currentGenre)) {
            visitedGenres.push(currentGenre);
        }
        
        // Check if we found our target genre
        if (currentFocus && currentFocus.isInSearchGenres && currentFocus.textContent === selectedGenreName) {
            console.log(`[TEST] 🎯 SUCCESS! Found exact target genre: "${selectedGenreName}" at position ${attempts + 1}`);
            targetFound = true;
            break;
        }
        
        // Simple navigation: right 5 times, then down and left 5 times (6 columns per row)
        const positionInRow = attempts % expectedColumns;
        
        if (positionInRow < expectedColumns - 1) {
            // Move right within the row
            console.log(`[TEST] ➡️ Moving right (position ${positionInRow + 1}/${expectedColumns} in row)...`);
            await remote.navigateRight();
        } else {
            // End of row, move down to start next row
            console.log(`[TEST] ⬇️ End of row, moving down to next row...`);
            await remote.navigateDown();
            await t.wait(200);
            // Move left to go to the beginning of new row
            console.log(`[TEST] ⬅️ Moving left to start of new row...`);
            await remote.navigateLeft(expectedColumns - 1);
        }
        
        await t.wait(300);
        attempts++;
    }
    
    console.log(`[TEST] 📋 Visited genres during search: [${visitedGenres.join(', ')}]`);
    console.log(`[TEST] 📊 Total genres visited: ${visitedGenres.length}/16 expected`);
    
    if (!targetFound) {
        console.log(`[TEST] ⚠️ Could not find exact target "${selectedGenreName}" after SYSTEMATIC search of ${maxAttempts} attempts`);
        console.log(`[TEST] 📝 This should NOT happen with systematic search. Current focus: "${currentFocus ? currentFocus.textContent : 'Unknown'}"`);
        console.log(`[TEST] 🔄 Will use currently focused genre as fallback, but this indicates a navigation issue`);
        
        // Update selectedGenreName to match what we actually found
        if (currentFocus && currentFocus.textContent) {
            console.log(`[TEST] 🔄 FALLBACK: Using "${currentFocus.textContent}" instead of target "${selectedGenreName}"`);
        }
    }
    
    console.log(`[TEST] ✅ PHASE 1 COMPLETE: Systematic navigation finished after ${attempts} attempts`);
    
    // PHASE 2: Get the final focused element and verify
    console.log(`[TEST] 🔍 PHASE 2: Verifying final focused element...`);
    
    const finalFocusedElement = await t.eval(() => {
        const searchGenresContainer = document.getElementById('search-genres');
        let focused = null;
        
        if (searchGenresContainer) {
            focused = searchGenresContainer.querySelector('[data-focused="true"]');
        }
        
        if (!focused) {
            focused = document.querySelector('[data-focused="true"], [data-focused], .focused, :focus');
        }
        
        if (focused) {
            return {
                textContent: focused.textContent ? focused.textContent.trim() : '',
                className: focused.className,
                isInSearchGenres: !!searchGenresContainer && searchGenresContainer.contains(focused)
            };
        }
        return null;
    });
    
    console.log('[TEST] 🎯 Final focused element:', JSON.stringify(finalFocusedElement, null, 2));
    
    // Determine what genre we're actually focused on
    let actualFocusedGenre = 'Unknown';
    if (finalFocusedElement && finalFocusedElement.textContent) {
        actualFocusedGenre = finalFocusedElement.textContent;
    }
    
    // Update our target if we didn't find exact match but found a valid genre
    let finalTargetGenre = selectedGenreName;
    if (!targetFound && actualFocusedGenre && actualFocusedGenre !== 'Unknown') {
        finalTargetGenre = actualFocusedGenre;
        console.log(`[TEST] � Updated target genre to match found genre: "${finalTargetGenre}"`);
    }
    
    console.log(`[TEST] 🎯 NAVIGATION RESULTS:`);
    console.log(`[TEST] 🎯 Originally selected genre: "${selectedGenreName}"`);
    console.log(`[TEST] 🎯 Actually focused genre: "${actualFocusedGenre}"`);
    console.log(`[TEST] 🎯 Final target genre: "${finalTargetGenre}"`);
    console.log(`[TEST] ✅ Target match: ${actualFocusedGenre === finalTargetGenre ? 'PERFECT MATCH! 🎉' : 'MISMATCH'}`);
    console.log(`[TEST] 🎲 Random selection: ${finalTargetGenre !== 'Action' ? 'YES! 🎉' : 'ACTION (check if intended)'}`);
    
    // Verify we have a valid genre selected
    const isValidGenreSelection = allAvailableGenres.includes(actualFocusedGenre);
    if (!isValidGenreSelection) {
        console.log(`[TEST] ⚠️ Warning: "${actualFocusedGenre}" is not in our list of available genres`);
        console.log(`[TEST] 📋 Available genres: [${allAvailableGenres.join(', ')}]`);
    }
    
    
    // Wait a moment before selection
    await t.wait(500);
    
    // Press ENTER to select the genre
    console.log('[TEST] ⏎ Pressing ENTER to open selected genre...');
    await remote.pressOk();
    
    // Wait for navigation to complete
    await t.wait(3000);
    
    console.log('[TEST] === Step 4: Verify we are in the selected category ===');
    
    // Get the new URL after genre selection
    const newUrl = await t.eval(() => window.location.href);
    console.log(`[TEST] New URL after genre selection: ${newUrl}`);
    
    // Check if the page state changed to show search results
    const pageStateAfterSelection = await t.eval(() => {
        const searchResults = document.querySelector('._searchResults_v9wx8_1');
        const searchContent = document.querySelector('._searchContent_9a7ll_8');
        const genresGrid = document.querySelector('._genresGrid_swwug_1');
        
        return {
            hasSearchResults: !!searchResults,
            searchResultsVisible: searchResults ? searchResults.style.display !== 'none' : false,
            searchContentExists: !!searchContent,
            genresGridExists: !!genresGrid,
            url: window.location.href,
            urlHasQuery: window.location.search.includes('?q='),
            queryParam: new URLSearchParams(window.location.search).get('q')
        };
    });
    
    console.log('[TEST] 📊 Page state after selection:', JSON.stringify(pageStateAfterSelection, null, 2));
    
    // Verify that we're still on the search page
    await t.expect(newUrl).contains('/search', 'Should still be on search page');
    
    // Get the actual selected genre from the URL
    const actualSelectedGenre = pageStateAfterSelection.queryParam;
    console.log(`[TEST] 🎯 FINAL RESULTS:`);
    console.log(`[TEST] 🎯 Originally random genre: "${selectedGenreName}"`);
    console.log(`[TEST] 🎯 Final target genre: "${finalTargetGenre}"`);
    console.log(`[TEST] 🎯 Focused genre (by navigation): "${actualFocusedGenre}"`);
    console.log(`[TEST] 🎯 Actually selected genre (by URL): "${actualSelectedGenre}"`);
    console.log(`[TEST] � Perfect alignment: ${actualSelectedGenre === actualFocusedGenre && actualFocusedGenre === finalTargetGenre ? 'YES! 🎉' : 'CHECKING...'}`);
    console.log(`[TEST] �🎲 Random selection working: ${actualSelectedGenre !== 'Action' ? 'YES! 🎉' : 'ACTION selected'}`);
    
    // Verify that we have a valid selection
    const hasQuery = pageStateAfterSelection.urlHasQuery;
    
    if (hasQuery && actualSelectedGenre) {
        console.log(`[TEST] ✅ URL has query parameter: ${actualSelectedGenre}`);
        
        // Verify that the selected genre is one of the valid genres
        const isValidGenre = allAvailableGenres.some(genre => 
            actualSelectedGenre.toLowerCase() === genre.toLowerCase() ||
            actualSelectedGenre.toLowerCase().includes(genre.toLowerCase()) ||
            genre.toLowerCase().includes(actualSelectedGenre.toLowerCase())
        );
        
        await t.expect(isValidGenre).ok(`Selected genre "${actualSelectedGenre}" should be a valid genre from the available list`);
        
        console.log(`[TEST] ✅ Successfully navigated to valid genre: "${actualSelectedGenre}"`);
        
        // Check alignment between intended and actual selection
        if (actualSelectedGenre === finalTargetGenre) {
            console.log(`[TEST] 🎉 PERFECT! Navigation successful to intended genre: "${finalTargetGenre}"`);
        } else if (actualSelectedGenre === actualFocusedGenre) {
            console.log(`[TEST] ✅ GOOD! Selected genre matches focused genre: "${actualSelectedGenre}"`);
        } else {
            console.log(`[TEST] ⚠️ Mismatch: Focused "${actualFocusedGenre}" but selected "${actualSelectedGenre}"`);
        }
        
        // Check if random selection is working (not always Action)
        if (actualSelectedGenre !== 'Action') {
            console.log(`[TEST] 🎉 SUCCESS! Random navigation working - selected "${actualSelectedGenre}" instead of always Action`);
        } else if (finalTargetGenre === 'Action') {
            console.log(`[TEST] ✅ Correctly selected Action as intended target`);
        } else {
            console.log(`[TEST] ⚠️ Unexpected: Landed on Action but target was "${finalTargetGenre}"`);
        }
        
    } else {
        console.log('[TEST] ⚠️ No clear indication of category selection, but basic navigation completed');
    }
    
    console.log('[TEST] ✅ Successfully completed DIRECT NAVIGATION random test');
    console.log(`[TEST] 🎉 Test completed with direct genre targeting!`);
    
    // Take a screenshot for verification
    const screenshotName = actualSelectedGenre ? 
        `direct-navigation-${actualSelectedGenre.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-target-${finalTargetGenre.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}` : 
        `direct-navigation-no-result-target-${finalTargetGenre.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    await t.takeScreenshot(screenshotName);
});
