import App from '@/core/App.js';
import { unescapeJsonFromAttribute } from '@/utils/jsonUtils.js';
import '@/components/layout/publicLayout/LifeGroupList.js';

/**
 * Life Group Section Component
 *
 * Displays life group content with banner, title, and subtitle.
 * Accepts color theming via 'colors' attribute and page data.
 */
class LifeGroupSection extends App {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadDataFromProps();
    }

    // Helper method to get proper image URL (same as MinistrySection)
    getImageUrl(imagePath) {
        if (!imagePath) return null;
        
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        // If it's a relative path starting with /, construct the full URL
        if (imagePath.startsWith('/')) {
            const baseUrl = window.location.origin;
            return baseUrl + imagePath;
        }
        
        // If it's a relative path without /, construct the URL
        const baseUrl = window.location.origin;
        const apiPath = '/api';
        return baseUrl + apiPath + '/' + imagePath;
    }

    // Helper method to parse banner images from various formats (same as MinistrySection)
    getBannerImages(pageData) {
        if (!pageData || !pageData.banner_image) {
            return [];
        }

        let bannerImages = pageData.banner_image;

        // If it's a string, try to parse as JSON
        if (typeof bannerImages === 'string') {
            try {
                const parsed = JSON.parse(bannerImages);
                if (Array.isArray(parsed)) {
                    bannerImages = parsed;
                } else {
                    bannerImages = [bannerImages];
                }
            } catch (e) {
                // If parsing fails, treat as single path
                bannerImages = [bannerImages];
            }
        } else if (!Array.isArray(bannerImages)) {
            // If it's not an array, wrap in array
            bannerImages = [bannerImages];
        }

        // Filter out empty/null values and return only the first image
        const filteredImages = bannerImages.filter(img => img && img.trim() !== '');
        return filteredImages.length > 0 ? [filteredImages[0]] : [];
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
        
        // Get banner images using the same logic as MinistrySection
        const bannerImages = this.getBannerImages(pageData) || [];
        const showImages = bannerImages.length > 0;

        // Get title and subtitle from page data (same as MinistrySection)
        const heroTitle = (pageData && pageData.title) ? pageData.title : 'Life Groups';
        const heroSubtitle = (pageData && pageData.subtitle) ? pageData.subtitle : 'Join our life groups and grow together in faith';

        // Get colors from state (same as MinistrySection)
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');
        const accentColor = this.get('accent_color');
        const textColor = this.get('text_color');
        const darkColor = this.get('dark_color');
        const hoverPrimary = this.get('hover_primary');
        const hoverSecondary = this.get('hover_secondary');
        const hoverAccent = this.get('hover_accent');

        return `
        <!-- Life Group Banner Section with Background -->
        <div class="">
            <div class="relative w-full h-[500px] lg:h-[45vh] overflow-hidden">
                ${showImages ? bannerImages.map((img, idx) => `
                    <div
                         class="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
                         style="background-image: url('${this.getImageUrl(img)}'); transition-property: opacity;">
                    </div>
                `).join('') : ''}
                <!-- Dark gradient overlay from bottom to top -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20"></div>
                <!-- Content Overlay -->
                <div class="absolute inset-0 flex items-center justify-start z-30 container mx-auto">
                    <div class="text-left text-white px-4 lg:px-8 max-w-4xl space-y-6">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg pb-2 border-b-4 border-[${accentColor}] w-fit" style="line-height: 1.1">
                            ${heroTitle}
                        </h1>
                        <p class="text-lg md:text-xl lg:text-2xl opacity-95 leading-relaxed drop-shadow-md">
                            ${heroSubtitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Life Group Content Section -->
        <div class="container mx-auto px-4 py-8">   
            <!-- Life Group List -->
            <life-group-list></life-group-list>
        </div>
        `;
    }
}

customElements.define('life-group-section', LifeGroupSection);
export default LifeGroupSection; 