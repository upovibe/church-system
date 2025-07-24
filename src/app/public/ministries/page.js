import App from '@/core/App.js';
import api from '@/services/api.js';
import '@/components/common/PageLoader.js';
import store from '@/core/store.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';
import { escapeJsonForAttribute } from '@/utils/jsonUtils.js';
import '@/components/layout/publicLayout/MinistrySection.js';

/**
 * Ministries Page Component (/ministries)
 * 
 * This is the ministries page of the application.
 * It uses the same centralized data loading approach as other pages.
 * File-based routing: /ministries → app/public/ministries/page.js
 */
class MinistriesPage extends App {
    connectedCallback() {
        super.connectedCallback();
        document.title = 'Ministries | Church System';
        this.loadAllData();
    }

    async loadAllData() {
        try {
            // Load colors first
            const colors = await fetchColorSettings();
            
            // Load ministries page data using 'news' slug
            const ministriesPageData = await this.fetchPageData('news');

            // Combine all data
            const allData = {
                colors,
                page: ministriesPageData
            };
                
            // Cache in global store
            store.setState({ ministriesPageData: allData });
                
            // Set local state and render
            this.set('allData', allData);
            this.render();

        } catch (error) {
            console.error('Error loading ministries data:', error);
            this.set('error', 'Failed to load ministries page data');
        }
    }

    async fetchPageData(slug) {
        try {
            const response = await api.get(`/pages/slug/${slug}`);
            return response.data.success ? response.data.data : null;
        } catch (error) {
            console.error(`Error fetching ${slug} page data:`, error);
            return null;
        }
    }

    render() {
        const allData = this.get('allData');
        const error = this.get('error');

        if (error) {
            return `
                <div class="container mx-auto flex items-center justify-center p-8">
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        ${error}
                    </div>
                </div>
            `;
        }

        if (!allData) {
            return `
                <div class="container flex items-center justify-center mx-auto p-8">
                    <page-loader></page-loader>
                </div>
            `;
        }

        // Convert data to JSON strings for attributes with proper escaping
        const colorsData = escapeJsonForAttribute(allData.colors);

        return `
            <div class="min-h-screen mx-auto">
                <!-- Ministry Section Component -->
                <ministry-section 
                    colors='${colorsData}'
                    page-data='${escapeJsonForAttribute(allData.page)}'>
                </ministry-section>
            </div>
        `;
    }
}

customElements.define('app-ministries-page', MinistriesPage);
export default MinistriesPage; 