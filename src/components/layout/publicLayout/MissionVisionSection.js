import App from '@/core/App.js';
import { unescapeJsonFromAttribute } from '@/utils/jsonUtils.js';

/**
 * Mission Vision Section Component
 *
 * Displays mission and vision content with modern design.
 * Accepts color theming via 'colors' attribute and page data.
 */
class MissionVisionSection extends App {
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
    // Get colors from state
    const primaryColor = this.get('primary_color');
    const secondaryColor = this.get('secondary_color');
    const accentColor = this.get('accent_color');
    const textColor = this.get('text_color');

    // Get page data from state
    const pageData = this.get('pageData') || {};

    // Get banner image
    let bannerImage = '';
    if (pageData.banner_image) {
      try {
        const banners =
          typeof pageData.banner_image === 'string'
            ? JSON.parse(pageData.banner_image)
            : pageData.banner_image;
        if (Array.isArray(banners) && banners.length > 0) {
          bannerImage = banners[0];
        }
      } catch {}
    }

    return `
        <section class="py-4">
            <div class="container mx-auto px-4">
                <!-- Banner and Title -->
                <div class="relative w-full h-[30rem] overflow-hidden rounded-2xl mb-8">
                    ${
                      bannerImage
                        ? `
                    <img src="/api/${bannerImage}" alt="Mission Vision Banner" class="w-full h-full object-cover object-center">
                    `
                        : `
                    <div class="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600s flex items-center justify-center">
                        <div class="text-center text-gray-400">
                            <i class="fas fa-image text-6xl mb-4 opacity-50"></i>
                            <p class="text-xl opacity-75">Banner Image</p>
                        </div>
                    </div>
                    `
                    }
                    <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                    <div class="absolute top-0 left-0 w-full p-8">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-wide text-[${textColor}] mb-3 drop-shadow-lg">${
      pageData.title || 'Mission & Vision'
    }</h1>
                        <p class="text-xl text-[${textColor}]/90 drop-shadow-lg mb-4">${
      pageData.subtitle || 'Our guiding principles and future aspirations'
    }</p>
                        <div class="flex flex-wrap gap-3 max-w-lg gap-y-3">
                            <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Youth & Kids</span>
                            <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Outreach & Mission</span>
                            <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Women's Group</span>
                            <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Men's Group</span>
                            <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Prayer Group</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `;
  }
}

customElements.define('mission-vision-section', MissionVisionSection);
export default MissionVisionSection;
