import App from '@/core/App.js';
import { unescapeJsonFromAttribute } from '@/utils/jsonUtils.js';

/**
 * Highlights Section Component
 *
 * Displays a highlights area for events, sermons, testimonies, etc.
 * Accepts color theming via 'colors' attribute.
 */
class HighlightsSection extends App {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadDataFromProps();
    }

    loadDataFromProps() {
        // Get color settings from attribute
        const colorsAttr = this.getAttribute('colors');
        if (colorsAttr) {
            try {
                const colors = unescapeJsonFromAttribute(colorsAttr);
                if (colors) {
                    Object.entries(colors).forEach(([key, value]) => {
                        this.set(key, value);
                    });
                }
            } catch (error) {
                console.error('Error parsing colors:', error);
            }
        }
        this.render();
    }

    render() {
        // Get colors from state
        // Get colors from state
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');
        const accentColor = this.get('accent_color');
        const textColor = this.get('text_color');
        const hoverPrimary = this.get('hover_primary');
        const hoverSecondary = this.get('hover_secondary');
        const hoverAccent = this.get('hover_accent');

        return `
        <section class="py-10 bg-[${primaryColor}]">
            <div class="container mx-auto w-full flex flex-col items-center gap-8 px-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    <div class="bg-white rounded-xl shadow p-8 flex items-center justify-center text-3xl font-bold text-[${primaryColor}] min-h-[8rem]">1</div>
                    <div class="bg-white rounded-xl shadow p-8 flex items-center justify-center text-3xl font-bold text-[${primaryColor}] min-h-[8rem]">2</div>
                    <div class="bg-white rounded-xl shadow p-8 flex items-center justify-center text-3xl font-bold text-[${primaryColor}] min-h-[8rem]">3</div>
                    <div class="bg-white rounded-xl shadow p-8 flex items-center justify-center text-3xl font-bold text-[${primaryColor}] min-h-[8rem]">4</div>
                </div>
            </div>
        </section>
        `;
    }
}

customElements.define('highlights-section', HighlightsSection);
export default HighlightsSection; 