import App from '@/core/App.js';
import { unescapeJsonFromAttribute } from '@/utils/jsonUtils.js';
import '@/components/ui/ContentDisplay.js';
import '@/components/ui/Avatar.js';

/**
 * Our Team Section Component
 * 
 * Displays team content with a unique design layout
 */
class OurTeamSection extends App {
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

        // Get team members from props
        const teamMembersAttr = this.getAttribute('team-members');
        if (teamMembersAttr) {
            const teamMembers = unescapeJsonFromAttribute(teamMembersAttr);
            if (teamMembers) {
                this.set('teamMembers', teamMembers);
            }
        }

        // Render immediately with the data
        this.render();
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
        const teamMembers = this.get('teamMembers') || [];
        
        // Get colors from state
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');
        const accentColor = this.get('accent_color');
        const textColor = this.get('text_color');

        // Only render if there's content
        if (!pageData?.content || pageData.content.trim() === '') {
            return `
                <div class="text-center py-16">
                    <div class="bg-white rounded-3xl shadow-lg p-8">
                        <i class="fas fa-users text-gray-400 text-6xl mb-4"></i>
                        <h2 class="text-2xl font-semibold text-gray-600 mb-2">Our Team</h2>
                        <p class="text-gray-500">Our team information is being prepared.</p>
                    </div>
                </div>
            `;
        }

        return `
            <!-- Our Team Section -->
            <section class="container mx-auto px-4">
                <!-- Main Content Section (No Banner, No BG) -->
                ${pageData.content ? `
                <div class="mx-auto mt-10 bg-[#898989]/90 rounded-2xl shadow p-8">
                    <content-display 
                        content="${pageData.content.replace(/"/g, '&quot;')}"
                        no-styles>
                    </content-display>
                </div>
                ` : ''}
                <!-- Team Members Grid -->
                ${teamMembers.length > 0 ? `
                    <div class="mt-16">
                        <div class="text-center mb-12">
                            <h3 class="text-2xl lg:text-3xl font-bold text-[${secondaryColor}] mb-4">Leadership</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            ${teamMembers.map(member => `
                                <div class="flex flex-col items-center justify-start py-8">
                                    <ui-avatar 
                                        name="${member.name}"
                                        size="3xl"
                                        color="${primaryColor}"
                                        alt="${member.name}"
                                        ${member.profile_image ? `src="${this.getImageUrl(member.profile_image)}"` : ''}
                                    ></ui-avatar>
                                    <h4 class="mt-4 text-lg font-semibold text-[${secondaryColor}]">${member.name}</h4>
                                    ${member.position ? `<p class="text-sm text-gray-600 mt-1">${member.position}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </section>
        `;
    }
}

customElements.define('our-team-section', OurTeamSection);
export default OurTeamSection; 