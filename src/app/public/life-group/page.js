import App from '@/core/App.js';
import api from '@/services/api.js';
import '@/components/common/PageLoader.js';
import store from '@/core/store.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';
import { escapeJsonForAttribute } from '@/utils/jsonUtils.js';
import { setDocumentTitle } from '@/utils/appSettings.js';
import '@/components/layout/publicLayout/LifeGroupSection.js';

/**
 * Life Group Page Component (/life-group)
 * 
 * This is the life group page of the application.
 * It uses the same centralized data loading approach as other pages.
 * File-based routing: /life-group → app/public/life-group/page.js
 */
class LifeGroupPage extends App {
    async connectedCallback() {
        super.connectedCallback();
        await this.loadAllData();
        await setDocumentTitle('Life Group');
    }

    async loadAllData() {
        try {
            // Load colors first
            const colors = await fetchColorSettings();
            
            // Load life-group page data
            const lifeGroupPageData = await this.fetchPageData('life-group');

            // Combine all data
            const allData = {
                colors,
                page: lifeGroupPageData
            };
                
            // Cache in global store
            store.setState({ lifeGroupPageData: allData });
                
            // Set local state and render
            this.set('allData', allData);
            this.render();

        } catch (error) {
            console.error('Error loading life group data:', error);
            this.set('error', 'Failed to load life group page data');
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
            <div class="mx-auto">
                <!-- Life Group Section Component -->
                <life-group-section 
                    colors='${colorsData}'
                    page-data='${escapeJsonForAttribute(allData.page)}'>
                </life-group-section>
            </div>
        `;
    }
}

customElements.define('app-life-group-page', LifeGroupPage);
export default LifeGroupPage; 