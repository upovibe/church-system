import App from '@/core/App.js';
import { unescapeJsonFromAttribute } from '@/utils/jsonUtils.js';
import '@/components/ui/ContentDisplay.js';

/**
 * About Section Component
 * 
 * Displays information about the school with content from the home page
 */
class AboutSection extends App {
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
        const settingsAttr = this.getAttribute('settings');

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

        if (settingsAttr) {
            const settings = unescapeJsonFromAttribute(settingsAttr);
            if (settings) {
                if (settings.about_title) this.set('aboutTitle', settings.about_title);
                if (settings.about_subtitle) this.set('aboutSubtitle', settings.about_subtitle);
            }
        }

        // Render immediately with the data
        this.render();
    }

    render() {
        const pageData = this.get('pageData');
        
        // Get colors from state
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');
        const accentColor = this.get('accent_color');
        const textColor = this.get('text_color');
        const hoverPrimary = this.get('hover_primary');
        const hoverSecondary = this.get('hover_secondary');
        const hoverAccent = this.get('hover_accent');

        // Only render if there's content
        if (!pageData?.content || pageData.content.trim() === '') {
            return '';
        }

        return `
        
        
        <style>
            .octagon-container {
                position: relative;
            }
            
            .octagon-mask {
                width: 100%;
                height: 100%;
                overflow: hidden;
                position: relative;
                clip-path: polygon(
                    30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%
                );
                -webkit-clip-path: polygon(
                    30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%
                );
            }
            
            .octagon-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        </style>


        <!-- About Section -->
        <section class="py-10 bg-[${primaryColor}]">
            <div class="container mx-auto w-full flex flex-col lg:flex-row items-center gap-8 px-4">
                <!-- Left: Title and Subtitle -->
                <div class="flex-1 flex flex-col justify-center items-start text-[${secondaryColor}] max-w-xl lg:pl-8">
                    <h2 class="text-3xl lg:text-4xl font-bold mb-3">
                        ${pageData.title || ''}
                    </h2>
                    <p class="text-lg opacity-80 mb-2">
                        ${pageData.meta_description || ''}
                    </p>
                </div>
                <!-- Right: Octagon Banner Image -->
                <div class="flex-1 flex justify-center items-center">
                    <div class="octagon-container size-[30rem]">
                        <div class="octagon-mask">
                            <img src="/api/${pageData.banner_image}"
                                 alt="About Our School"
                                 class="octagon-image"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="absolute inset-0 hidden items-center justify-center bg-gray-100">
                                <div class="text-center">
                                    <i class="fas fa-image text-gray-400 text-4xl mb-2"></i>
                                    <p class="text-gray-500 font-medium">About banner image</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    }
}

customElements.define('about-section', AboutSection);
export default AboutSection; 