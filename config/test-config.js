// Test configuration and constants
export const TestConfig = {
    // Application URL - Replace with your target URL when running locally
    baseUrl: 'https://app.titanos.tv/',
    
    // Timeouts in milliseconds
    timeouts: {
        short: 2000,
        medium: 5000,
        long: 10000,
        navigation: 15000
    },
    
    // Remote control simulation settings
    remoteControl: {
        keyPressDelay: 100,        // Delay between key presses
        longPressDelay: 1000,      // Delay for long press simulation
        navigationDelay: 300       // Delay after navigation actions
    },
    
    // Test data
    testData: {
        nonDeletableApps: ['watch-tv', 'watch tv'], // Apps that cannot be deleted
        maxRetryAttempts: 3
    },
    
    // Selectors (based on actual DOM structure investigation)
    selectors: {
        // Home page selectors (from DOM investigation)
        homePage: {
            favoriteAppsRow: '._favAppsList_tcq1v_712, .favorite-apps, .apps-row',
            favoriteApp: '._itemTitle_10v6y_138, .app-title, .item-title',
            favoriteAppContainer: '._favAppItem_10v6y_173, ._listItem_10v6y_73, .favorite-app, .app-item',
            deleteButton: '[data-testid="delete-button"], .delete-button, .remove-button',
            watchTvApp: '[data-testid="watch-tv-app"], .watch-tv-app, [data-app="watch-tv"]',
            featuredAppsTitle: '._listTitle_tcq1v_725'
        },
        
        // Apps page selectors
        appsPage: {
            appGrid: '[data-testid="app-grid"], .app-grid, .apps-container',
            appItem: '[data-testid="app-item"], .app-item, .application',
            addToFavoritesButton: '[data-testid="add-to-favorites"], .add-favorite, .favorite-button'
        },
        
        // Search page selectors
        searchPage: {
            categoryList: '[data-testid="category-list"], .category-list, .categories',
            categoryItem: '[data-testid="category"], .category, .category-item'
        },
        
        // Channels page selectors
        channelsPage: {
            channelGrid: '[data-testid="channel-grid"], .channel-grid, .channels',
            channelItem: '[data-testid="channel"], .channel, .channel-item'
        },
        
        // Navigation selectors (based on DOM investigation)
        navigation: {
            homeButton: '[data-testid="main-menu-item-1"], [aria-label="Home"]',
            appsButton: '[data-testid*="apps"], [aria-label*="Apps"]',
            searchButton: '[data-testid="main-menu-item-0"], [aria-label="Search"]',
            channelsButton: '[data-testid*="channel"], [aria-label*="Channel"]',
            tvGuideButton: '[data-testid="main-menu-item-2"], [aria-label="TV Guide"]'
        },
        
        // Common UI elements
        common: {
            focused: '[data-is-focused="true"], [data-focused="true"], .focused, :focus, .selected, .active',
            focusable: '[data-focusable="true"]',
            loading: '.loading, .spinner, [data-loading]',
            modal: '.modal, .dialog, .popup',
            confirmButton: '.confirm, .ok, .yes',
            cancelButton: '.cancel, .no, .close'
        }
    }
};
