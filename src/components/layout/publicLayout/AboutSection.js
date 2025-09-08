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
    const serviceTimesAttr = this.getAttribute('service-times');

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

    if (serviceTimesAttr) {
      const serviceTimes = unescapeJsonFromAttribute(serviceTimesAttr);
      if (serviceTimes) {
        this.set('serviceTimes', serviceTimes);
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
    const serviceTimes = this.get('serviceTimes');

    // Only render if there's content
    if (!pageData?.content || pageData.content.trim() === '') {
      return '';
    }

    // Render service times section
    const renderServiceTimes = () => {
      if (!serviceTimes || !Array.isArray(serviceTimes) || serviceTimes.length === 0) {
        return '';
      }

      return `
        <div class="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <h3 class="text-3xl font-semibold text-[${secondaryColor}] mb-3 flex items-center">
            Service Times
          </h3>
          <div class="space-y-2">
            ${serviceTimes.map(time => `
              <div class="flex items-center text-[${secondaryColor}]/90">
                <i class="fas fa-church mr-3 text-[${accentColor}]"></i>
                <span class="text-sm">${time}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    };

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
            <div class="container mx-auto w-full flex flex-col md:flex-row items-center gap-8">
                <!-- Left: Title and Subtitle -->
                <div class="w-full md:w-1/2 flex flex-col gap-3 justify-center items-start text-[${secondaryColor}] lg:pl-8 self-start p-5">
                    <h2 class="text-4xl md:text-5xl lg:text-6xl tracking-wide font-black drop-shadow-lg" style="line-height: 1.2;">
                        ${pageData.title || ''}
                    </h2>
                    <p class="text-lg lg:text-xl leading-8 text-gray-500 mt-4"  >
                        ${pageData.meta_description || ''}
                    </p>
                    ${renderServiceTimes()}
                </div>
                <!-- Right: Octagon Banner Image -->
                <div class="w-full md:w-1/2 flex justify-center items-center">
                    <div class="octagon-container w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] xl:w-[35rem] xl:h-[35rem] flex items-center justify-center">
                        <div class="octagon-mask">
                            <img src="/api/${(() => {
                              let img = pageData.banner_image;
                              if (typeof img === 'string') {
                                try {
                                  const arr = JSON.parse(img);
                                  if (Array.isArray(arr) && arr.length > 0)
                                    return arr[0];
                                } catch (e) {
                                  if (img.includes(','))
                                    return img.split(',')[0].trim();
                                  return img;
                                }
                              } else if (Array.isArray(img) && img.length > 0) {
                                return img[0];
                              }
                              return img || '';
                            })()}"
                                 alt="About Our Church"
                                 class="octagon-image"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="absolute inset-0 hidden items-center justify-center bg-gray-100">
                                <div class="text-center">
                                    <i class="fas fa-image text-gray-400 text-2xl sm:text-3xl md:text-4xl mb-2"></i>
                                    <p class="text-gray-500 font-medium text-sm sm:text-base md:text-lg">About banner image</p>
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
