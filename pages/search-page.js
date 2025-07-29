
import { Selector, t } from 'testcafe';

class SearchPage {
    constructor() {
        this.genresGrid = Selector('#search-genres');
        this.genreItems = this.genresGrid.find('[role="listitem"]');
        this.focusedGenre = Selector('[data-focused="true"]');
    }

    /**
     * Ensures the genres grid exists and is visible before interaction.
     */
    async waitForGenresGridVisible() {
        await t.expect(this.genresGrid.exists).ok('The genres grid should exist', { timeout: 10000 });
        await t.expect(this.genresGrid.visible).ok('The genres grid should be visible', { timeout: 10000 });
    }

    /**
     * Returns a list of all available genre names from the search page.
     * @returns {Promise<string[]>} An array of genre names.
     */
    async getAvailableGenres() {
        await t.expect(this.genresGrid.exists).ok('The genres grid should exist.', { timeout: 10000 });
        await t.expect(this.genresGrid.visible).ok('The genres grid should be visible.', { timeout: 10000 });
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
    async ensureGenresGridVisible() {
        await t.expect(this.genresGrid.exists).ok('The genres grid should exist.', { timeout: 10000 });
        await t.expect(this.genresGrid.visible).ok('The genres grid should be visible.', { timeout: 10000 });
    }

    async selectRandomGenre() {
        await this.ensureGenresGridVisible();

        // Navigate down into the genre grid
        await t.pressKey('down');
        await t.wait(250);

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
