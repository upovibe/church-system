import App from '@/core/App.js';
import { unescapeJsonFromAttribute } from '@/utils/jsonUtils.js';

/**
 * Hero Section Component
 * 
 * Displays the hero banner with title, subtitle, buttons, and scroll indicator
 */
class HeroSection extends App {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.currentImageIndex = 0;
        this.slideshowInterval = null;
        this.loadDataFromProps();
        // Event delegation for nav buttons
        this.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-hero-nav-idx]');
            if (btn) {
                const idx = parseInt(btn.getAttribute('data-hero-nav-idx'));
                this.goToImage(idx);
            }
        });
    }

    disconnectedCallback() {
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
        }
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
                if (settings.hero_title) this.set('heroTitle', settings.hero_title);
                if (settings.hero_subtitle) this.set('heroSubtitle', settings.hero_subtitle);
            }
        }

        // Render immediately with the data
        this.render();
        this.startSlideshow();
    }

    startSlideshow() {
        const bannerImages = this.getBannerImages(this.get('pageData')) || [];
        if (this.slideshowInterval) clearInterval(this.slideshowInterval);
        if (bannerImages.length <= 1) return;
        this.slideshowInterval = setInterval(() => {
            this.currentImageIndex = (this.currentImageIndex + 1) % bannerImages.length;
            window.requestAnimationFrame(() => this.render());
        }, 4000); // 4 seconds per image
    }



    // Helper method to get proper image URL
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

    // Helper method to parse banner images from various formats
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

        // Filter out empty/null values
        return bannerImages.filter(img => img && img.trim() !== '');
    }

    render() {
        const pageData = this.get('pageData');
        const error = this.get('error');
        const heroTitle = this.get('heroTitle') || 'Welcome to Our School';
        const heroSubtitle = this.get('heroSubtitle') || 'Excellence in Education, Character, and Leadership';
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');
        const accentColor = this.get('accent_color');
        const textColor = this.get('text_color');
        const hoverPrimary = this.get('hover_primary');
        const hoverSecondary = this.get('hover_secondary');
        const hoverAccent = this.get('hover_accent');

        if (error) {
            this.innerHTML = `
                <div class="container mx-auto flex items-center justify-center p-8">
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        ${error}
                    </div>
                </div>
            `;
            return;
        }

        const bannerImages = this.getBannerImages(pageData) || [];
        const currentIdx = this.currentImageIndex;
        const showImages = bannerImages.length > 0;

        // Navigation dots/numbers for images
        const navNumbers = bannerImages.length > 1 ? `
            <div class="absolute bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
                ${bannerImages.map((img, idx) => `
                    <button type="button"
                        class="flex items-start justify-start gap-3 font-bold text-3xl border-0 transition-all duration-200 w-fit h-fit px-0 py-1 bg-transparent shadow-none group"
                        aria-label="Go to image ${idx + 1}"
                        data-hero-nav-idx="${idx}"
                    >
                        <span class="inline-block w-12 mr-2 border-t-2 border-b-transparent border-l-transparent border-r-transparent align-top
                            ${currentIdx === idx ? `border-t-[${textColor}]` : `border-t-transparent`} 
                            transition-colors duration-200"></span>
                        <span class="font-light inline-block align-top leading-none -mt-2 ${currentIdx === idx ? `text-[${textColor}]` : `text-[${textColor}]/50`} transition-colors duration-200">
                            ${String(idx + 1).padStart(2, '0')}
                        </span>
                    </button>
                `).join('')}
            </div>
        ` : '';

        this.innerHTML = `
            <!-- Hero Banner Section with Slideshow Background -->
            <div class="mb-8">
                <div class="relative w-full h-[500px] lg:h-[70vh] overflow-hidden">
                    ${showImages ? bannerImages.map((img, idx) => `
                        <div
                             class="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${idx === this.currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
                             style="background-image: url('${this.getImageUrl(img)}'); transition-property: opacity;">
                        </div>
                    `).join('') : ''}
                    <!-- Dark gradient overlay from bottom to top -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20"></div>
                    <!-- Hero Content Overlay -->
                    <div class="absolute inset-0 flex items-center justify-start z-30 container mx-auto">
                        <div class="text-left text-white px-4 lg:px-8 max-w-4xl">
                            <h1 class="text-4xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                                ${heroTitle}
                            </h1>
                            <p class="text-lg lg:text-xl mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
                                ${heroSubtitle}
                            </p>
                            <div class="flex flex-row gap-2 sm:gap-4 justify-center w-fit">
                                <a href="/public/about-us" 
                                   class="inline-flex items-center justify-center px-3 py-2 sm:px-6 sm:py-3 bg-[${primaryColor}] text-[${textColor}] font-semibold rounded-lg hover:bg-[${accentColor}] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap text-sm sm:text-base">
                                    <i class="fas fa-info-circle mr-1 sm:mr-2 text-sm sm:text-base"></i>
                                    Learn More
                                </a>
                                <a href="/public/admissions" 
                                   class="inline-flex items-center justify-center px-3 py-2 sm:px-6 sm:py-3 border-2 border-[${textColor}] text-[${textColor}] font-semibold rounded-lg hover:bg-[${textColor}] hover:text-[${secondaryColor}] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap text-sm sm:text-base">
                                    <i class="fas fa-graduation-cap mr-1 sm:mr-2 text-sm sm:text-base"></i>
                                    Apply Now
                                </a>
                            </div>
                        </div>
                    </div>
                    ${navNumbers}
                </div>
            </div>
        `;
    }
}

customElements.define('hero-section', HeroSection);