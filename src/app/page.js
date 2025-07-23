import App from '@/core/App.js';
import api from '@/services/api.js';
import store from '@/core/store.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';
import { escapeJsonForAttribute } from '@/utils/jsonUtils.js';
import '@/components/layout/publicLayout/HeroSection.js';
import '@/components/layout/publicLayout/AboutSection.js';
import '@/components/layout/publicLayout/AcademicsSection.js';
import '@/components/layout/publicLayout/CommunitySection.js';
import '@/components/layout/publicLayout/ContactSection.js';
import '@/components/layout/publicLayout/HighlightsSection.js';
import '@/components/layout/DbSetupDialog.js';

/**
 * Root Page Component (/)
 * 
 * This is the home page of the application.
 * It now renders within the global RootLayout.
 */
class RootPage extends App {
    async connectedCallback() {
        super.connectedCallback();
        document.title = 'Home';
        // 1. Check DB connection first
        try {
            const dbCheck = await fetch('/api/db/check').then(r => r.json());
            if (!dbCheck.success) {
                this.set('dbNotConnected', true);
                this.render();
                return;
            }
        } catch (e) {
            this.set('dbNotConnected', true);
            this.render();
            return;
        }
        // 2. If connected, load data as usual
        this.loadAllData();
    }

    async loadAllData() {
        try {
            // Load colors first
            const colors = await fetchColorSettings();
            
            // Load home, about, testimonials, sermons, and events page data in parallel
            const [homePageData, aboutPageData, testimonialsPageData, sermonsPageData, eventsPageData, testimonialsData] = await Promise.all([
                this.fetchPageData('home'),
                this.fetchPageData('about-us'),
                this.fetchPageData('testimonials'),
                this.fetchPageData('sermons'),
                this.fetchPageData('events'),
                this.fetchTestimonials()
            ]);

            // Load only relevant settings
            const settingsData = await this.loadAllSettings();

            // Combine all data
            const allData = {
                colors,
                pages: {
                    home: homePageData,
                    about: aboutPageData,
                    testimonials: testimonialsPageData,
                    sermons: sermonsPageData,
                    events: eventsPageData
                },
                testimonials: testimonialsData,
                settings: settingsData
            };

            // Cache in global store
            store.setState({ homePageData: allData });
            
            // Set local state and render
            this.set('allData', allData);
            this.render();

        } catch (error) {
            console.error('Error loading all data:', error);
            this.set('error', 'Failed to load page data');
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

    async fetchTestimonials() {
        try {
            const response = await api.get('/public/testimonials');
            return response.data.success ? response.data.data : [];
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            return [];
        }
    }

    async loadAllSettings() {
        try {
            const settingsKeys = [
                'application_logo', 'contact_email', 'contact_phone',
                'facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url', 'youtube_url'
            ];

            const settingsPromises = settingsKeys.map(async (key) => {
                try {
                    const response = await api.get(`/settings/key/${key}`);
                    return response.data.success ? { key, value: response.data.data.setting_value } : null;
                } catch (error) {
                    console.error(`Error fetching setting ${key}:`, error);
                    return null;
                }
            });

            const settingsResults = await Promise.all(settingsPromises);
            
            // Convert to object
            const settingsObject = {};
            settingsResults.forEach(result => {
                if (result) {
                    settingsObject[result.key] = result.value;
                }
            });

            return settingsObject;
        } catch (error) {
            console.error('Error loading settings:', error);
            return {};
        }
    }

    render() {
        if (this.get('dbNotConnected')) {
            return `<db-setup-dialog></db-setup-dialog>`;
        }
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
                <!-- Hero Section Component -->
                <hero-section 
                    colors='${colorsData}'
                    page-data='${escapeJsonForAttribute(allData.pages.home)}'>
                </hero-section>
                
                <!-- About Section Component -->
                <about-section 
                    colors='${colorsData}'
                    page-data='${escapeJsonForAttribute(allData.pages.about)}'>
                </about-section>

                <!-- Highlights Section Component -->
                <highlights-section 
                    colors='${colorsData}'
                    pages='${escapeJsonForAttribute({ testimonials: allData.pages.testimonials, sermons: allData.pages.sermons, events: allData.pages.events })}'
                    testimonials-data='${escapeJsonForAttribute(allData.testimonials)}'>
                </highlights-section>
            </div>
        `;
    }
}

customElements.define('app-root-page', RootPage);
export default RootPage; 