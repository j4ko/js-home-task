import { Selector } from 'testcafe';
import { BasePage } from './base-page.js';

/**
 * Search Page Object Model
 * Handles interactions with the search page and category browsing
 */
export class SearchPage extends BasePage {
    constructor(testController) {
        super(testController);
        
        // Page-specific selectors
        this.categoryList = Selector(this.selectors.searchPage.categoryList);
        this.categoryItems = this.categoryList.find(this.selectors.searchPage.categoryItem);
    }

    /**
     * Navigate to search page
     */
    async goToSearchPage() {
        await this.navigateToSearch();
        await this.waitForSearchPageToLoad();
        return this;
    }

    /**
     * Wait for search page to load
     */
    async waitForSearchPageToLoad() {
        await this.waitForElement(this.selectors.searchPage.categoryList);
        await this.waitForAnimationsToComplete();
        return this;
    }

    /**
     * Get categories count
     */
    async getCategoriesCount() {
        await this.waitForElement(this.selectors.searchPage.categoryList);
        return await this.categoryItems.count;
    }

    /**
     * Open a category by index
     */
    async openCategory(categoryIndex) {
        const totalCategories = await this.getCategoriesCount();
        
        if (categoryIndex >= totalCategories) {
            throw new Error(`Category index ${categoryIndex} exceeds available categories (${totalCategories})`);
        }
        
        // Navigate to category
        for (let i = 0; i < categoryIndex; i++) {
            await this.remoteControl.navigateDown();
        }
        
        const categoryName = await this.getCategoryName(categoryIndex);
        console.log(`[INFO] Opening category: ${categoryName}`);
        
        await this.remoteControl.pressOk();
        await this.waitForAnimationsToComplete();
        
        return { success: true, categoryName };
    }

    /**
     * Get category name by index
     */
    async getCategoryName(categoryIndex) {
        const category = this.categoryItems.nth(categoryIndex);
        await this.t.expect(category.exists).ok(`Category at index ${categoryIndex} should exist`);
        
        return (await category.innerText).trim();
    }
}
