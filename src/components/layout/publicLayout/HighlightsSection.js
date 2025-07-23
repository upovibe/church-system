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
        // Get data from props/attributes
        const colorsAttr = this.getAttribute('colors');
        const pagesAttr = this.getAttribute('pages');

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

        if (pagesAttr) {
            const pages = unescapeJsonFromAttribute(pagesAttr);
            if (pages) {
                this.set('pages', pages);
            }
        }

        // Render immediately with the data
        this.render();
    }

    render() {
        // Get colors from state
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');
        const accentColor = this.get('accent_color');
        const textColor = this.get('text_color');
        const hoverPrimary = this.get('hover_primary');
        const hoverSecondary = this.get('hover_secondary');
        const hoverAccent = this.get('hover_accent');

        // Get pages from state
        const pages = this.get('pages') || {};
        const sermon = pages.sermons || {};
        let bannerImg = '';
        if (sermon.banner_image) {
            try {
                const banners = typeof sermon.banner_image === 'string' ? JSON.parse(sermon.banner_image) : sermon.banner_image;
                if (Array.isArray(banners) && banners.length > 0) {
                    bannerImg = banners[0];
                }
            } catch {}
        }

        const event = pages.events || {};
        let eventBanner = '';
        if (event.banner_image) {
            try {
                const banners = typeof event.banner_image === 'string' ? JSON.parse(event.banner_image) : event.banner_image;
                if (Array.isArray(banners) && banners.length > 0) {
                    eventBanner = banners[0];
                }
            } catch {}
        }

        return `
        <section class="py-10 bg-[${primaryColor}]">
            <div class="container mx-auto w-full flex flex-col items-center gap-8 px-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    <!-- Sermon Card -->
                    <div class="bg-white rounded-xl shadow relative flex-1 flex items-center justify-center h-[20rem] min-h-[20rem] overflow-hidden p-0">
                        ${bannerImg ? `<img src="/api/${bannerImg}" alt="Sermon Banner" class="absolute inset-0 w-full h-full object-cover opacity-70">` : ''}
                        <div class="absolute bottom-0 left-0 w-full flex flex-col items-start p-4 z-10">
                            <h2 class="text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg mb-1 flex items-center gap-2">
                            <i class="fas fa-circle-play text-[${accentColor}] text-2xl"></i>
                                ${sermon.title || 'Sermon'}
                            </h2>
                            <span class="inline-block bg-[${primaryColor}] bg-opacity-80 text-white text-xs font-semibold px-3 py-1 rounded shadow">Watch now</span>
                        </div>
                    </div>
                    <!-- Event Card -->
                    <div class="bg-white rounded-xl shadow relative flex-1 flex items-center justify-center h-[20rem] min-h-[20rem] overflow-hidden p-0">
                        ${eventBanner ? `<img src="/api/${eventBanner}" alt="Event Banner" class="absolute inset-0 w-full h-full object-cover opacity-70">` : ''}
                        <div class="absolute bottom-0 left-0 w-full flex flex-col items-start p-4 z-10">
                            <h2 class="text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg mb-1">
                                <span class="flex items-center gap-2">
                                <i class="fas fa-calendar-alt text-[${accentColor}] text-2xl"></i>
                                    ${event.title || 'Event'}
                                </span>
                            </h2>
                            <span class="inline-block bg-[${primaryColor}] bg-opacity-80 text-white text-xs font-semibold px-3 py-1 rounded shadow">See events</span>
                        </div>
                    </div>
                    <!-- Placeholder/Testimonial/Other -->
                    <div class="bg-white rounded-xl shadow flex-1 flex items-center justify-center h-[20rem] min-h-[20rem] text-3xl font-bold text-[${primaryColor}]">3</div>
                    <div class="bg-white rounded-xl shadow flex-1 flex items-center justify-center h-[20rem] min-h-[20rem] text-3xl font-bold text-[${primaryColor}]">4</div>
                </div>
            </div>
        </section>
        `;
    }
}

customElements.define('highlights-section', HighlightsSection);
export default HighlightsSection; 