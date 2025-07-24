import App from '@/core/App.js';
import api from '@/services/api.js';
import '@/components/common/PageLoader.js';
import store from '@/core/store.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';
import { escapeJsonForAttribute } from '@/utils/jsonUtils.js';
import '@/components/layout/publicLayout/AboutUsSection.js';
import '@/components/layout/publicLayout/OurTeamSection.js';

/**
 * About Page Component (/about)
 * 
 * This is the about page of the application.
 * It uses the same centralized data loading approach as other pages.
 * File-based routing: /about → app/public/about/page.js
 */
class AboutPage extends App {
    connectedCallback() {
        super.connectedCallback();
        document.title = 'About | Church System';
        this.loadAllData();
    }

    async loadAllData() {
        try {
            // Load colors first
            const colors = await fetchColorSettings();
            // Load about page data
            const aboutPageData = await this.fetchPageData('about-us');
            // Combine all data
            const allData = {
                colors,
                page: aboutPageData
            };
            // Cache in global store
            store.setState({ aboutPageData: allData });
            // Set local state and render
            this.set('allData', allData);
            this.render();
        } catch (error) {
            console.error('Error loading about data:', error);
            this.set('error', 'Failed to load about page data');
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
        const pageData = escapeJsonForAttribute(allData.page);

        return `
            <div class="mx-auto">
                <!-- About Us Section Component -->
                <about-us-section 
                    colors='${colorsData}'
                    page-data='${pageData}'>
                </about-us-section>
                <!-- Our Team Section Component -->
                <our-team-section 
                    colors='${colorsData}'>
                </our-team-section>
            </div>
        `;
    }
}

customElements.define('app-about-page', AboutPage);
export default AboutPage; 