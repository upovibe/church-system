import App from '@/core/App.js';
import api from '@/services/api.js';
import store from '@/core/store.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';
import { escapeJsonForAttribute } from '@/utils/jsonUtils.js';
import '@/components/layout/publicLayout/GiveSection.js';

/**
 * Give Page Component (/give)
 * 
 * This is the give page of the application.
 * It loads page data and displays the GiveSection component.
 * File-based routing: /give → app/public/give/page.js
 */
class GivePage extends App {
    connectedCallback() {
        super.connectedCallback();
        document.title = 'Give | Church System';
        this.loadAllData();
    }

    async loadAllData() {
        try {
            // Show loading state
            this.set('loading', true);
            this.set('error', null);

            // Load color settings
            const colors = await fetchColorSettings();
            this.set('colors', colors);

            // Load page data for give
            const pageResponse = await api.get('/pages/give');
            const pageData = pageResponse.data;

            // Load settings
            const settingsResponse = await api.get('/settings');
            const settings = settingsResponse.data;

            // Combine all data
            const allData = {
                colors,
                page: pageData,
                settings
            };

            this.set('allData', allData);
            this.set('loading', false);

        } catch (error) {
            console.error('Error loading give page data:', error);
            this.set('error', 'Failed to load page data. Please try again later.');
            this.set('loading', false);
        }
    }

    render() {
        const allData = this.get('allData');
        const error = this.get('error');
        const loading = this.get('loading');

        if (error) {
            return `
                <div class="container mx-auto flex items-center justify-center p-8">
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        ${error}
                    </div>
                </div>
            `;
        }

        if (loading || !allData) {
            return `
                <div class="container flex items-center justify-center mx-auto p-8">
                    <page-loader></page-loader>
                </div>
            `;
        }

        // Convert data to JSON strings for attributes with proper escaping
        const colorsData = escapeJsonForAttribute(allData.colors);

        return `
            <div class="mx-auto">
                <!-- Give Section Component -->
                <give-section 
                    colors='${colorsData}'
                    page-data='${escapeJsonForAttribute(allData.page)}'>
                </give-section>
            </div>
        `;
    }
}

customElements.define('give-page', GivePage);
export default GivePage; 