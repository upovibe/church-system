import App from '@/core/App.js';
import { unescapeJsonFromAttribute } from '@/utils/jsonUtils.js';

/**
 * Give Section Component
 *
 * Displays give content with simple text.
 * Accepts color theming via 'colors' attribute and page data.
 */
class GiveSection extends App {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadDataFromProps();
    }

    loadDataFromProps() {
        // Get data from props/attributes
        const colorsAttr = this.getAttribute('colors');
        const pageDataAttr = this.getAttribute('page-data');

        if (colorsAttr) {
            try {
                const colors = JSON.parse(colorsAttr);
                Object.entries(colors).forEach(([key, value]) => {
                    this.set(key, value);
                });
            } catch (error) {
                console.error('Error parsing colors:', error);
            }
        }

        if (pageDataAttr) {
            const pageData = unescapeJsonFromAttribute(pageDataAttr);
            if (pageData) {
                this.set('pageData', pageData);
            }
        }

        // Render immediately with the data
        this.render();
    }

    render() {
        // Get page data from state
        const pageData = this.get('pageData') || {};

        return `
        <section class="py-16 bg-green-600">
            <div class="container mx-auto px-4">
                <div class="text-center">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Give
                    </h1>
                    <p class="text-xl text-white/80 mb-8">
                        Welcome to our give page
                    </p>
                    <div class="max-w-4xl mx-auto">
                        <p class="text-lg text-white/90 leading-relaxed mb-6">
                            This is a simple test give page. Your generous contributions help us continue our mission and serve our community.
                        </p>
                        <div class="bg-white/10 rounded-lg p-6 inline-block">
                            <p class="text-white font-semibold">
                                Thank you for your support!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `;
    }
}

customElements.define('give-section', GiveSection);
export default GiveSection; 