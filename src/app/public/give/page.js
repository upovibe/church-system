import App from '@/core/App.js';
import api from '@/services/api.js';
import '@/components/common/PageLoader.js';
import store from '@/core/store.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';
import { fetchPaymentSettings } from '@/utils/paymentSettings.js';
import { escapeJsonForAttribute } from '@/utils/jsonUtils.js';
import '@/components/layout/publicLayout/GiveSection.js';

class GivePage extends App {
    connectedCallback() {
        super.connectedCallback();
        document.title = 'Give | Church System';
        this.loadAllData();
    }

    async loadAllData() {
        try {
            const colors = await fetchColorSettings();
            const paymentSettings = await fetchPaymentSettings();
            const givePageData = await this.fetchPageData('give');

            const allData = {
                colors,
                paymentSettings,
                page: givePageData
            };

            store.setState({ givePageData: allData });
                
            this.set('allData', allData);
            this.render();

        } catch (error) {
            console.error('Error loading give data:', error);
            this.set('error', 'Failed to load give page data');
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

        const colorsData = escapeJsonForAttribute(allData.colors);
        const paymentData = escapeJsonForAttribute(allData.paymentSettings);

        return `
            <div class="mx-auto">
                <give-section 
                    colors='${colorsData}'
                    payment-settings='${paymentData}'
                    page-data='${escapeJsonForAttribute(allData.page)}'>
                </give-section>
            </div>
        `;
    }
}

customElements.define('app-give-page', GivePage);
export default GivePage; 