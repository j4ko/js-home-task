import { Selector, t } from 'testcafe';

class SearchPage {
    constructor() {
        this.genresGrid = Selector('._genresGrid_swwug_1');
        this.genreItems = this.genresGrid.find('._genre_swwug_1');
        this.focusedGenre = Selector('[data-focused="true"]');
    }

    /**
     * Returns a list of all available genre names from the search page.
     * @returns {Promise<string[]>} An array of genre names.
     */
    async getAvailableGenres() {
        await t.expect(this.genresGrid.exists).ok('The genres grid should exist.', { timeout: 10000 });
        const genreCount = await this.genreItems.count;
        const genres = [];
        for (let i = 0; i < genreCount; i++) {
            const genreText = await this.genreItems.nth(i).innerText;
            genres.push(genreText.trim());
        }
        return genres;
    }

    /**
     * Selects a random genre from the grid.
     * @returns {Promise<string>} The name of the selected genre.
     */
    async selectRandomGenre() {
        await t.expect(this.genresGrid.exists).ok('The genres grid should exist.', { timeout: 10000 });
        
        // Navigate down into the genre grid
        await t.pressKey('down');
        await t.wait(500);

        const availableGenres = await this.getAvailableGenres();
        const randomIndex = Math.floor(Math.random() * availableGenres.length);
        const targetGenreName = availableGenres[randomIndex];

        const maxAttempts = 20; // Max movements in one direction
        let currentRow = 0;
        const maxRows = 5; // Assume a max of 5 rows

        while (currentRow < maxRows) {
            for (let i = 0; i < maxAttempts; i++) {
                const focusedElementText = await this.focusedGenre.innerText;
                if (focusedElementText.trim().toLowerCase() === targetGenreName.toLowerCase()) {
                    await t.pressKey('enter');
                    return targetGenreName;
                }
                await t.pressKey('right');
                await t.wait(100);
            }
            // Reset to left and move to next row
            for (let i = 0; i < maxAttempts; i++) {
                await t.pressKey('left');
            }
            await t.pressKey('down');
            await t.wait(100);
            currentRow++;
        }

        throw new Error(`Could not find the genre "${targetGenreName}" after extensive searching.`);
    }

    /**
     * Gets the currently selected genre from the URL query parameter.
     * @returns {Promise<string>} The value of the 'q' query parameter.
     */
    async getSelectedGenreFromURL() {
        const currentUrl = await t.eval(() => window.location.href);
        const url = new URL(currentUrl);
        return url.searchParams.get('q');
    }
}

export default new SearchPage();
