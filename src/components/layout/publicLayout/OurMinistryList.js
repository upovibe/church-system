import App from '@/core/App.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';

/**
 * Our Ministry List Component
 * 
 * Displays a list of ministry titles as clickable tags that navigate to their respective pages
 */
class OurMinistryList extends App {
    constructor() {
        super();
        this.set('ministries', []);
        this.set('loading', true);
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadColorsFromSettings();
        this.loadMinistriesData();
    }

    async loadColorsFromSettings() {
        try {
            // Fetch colors from API
            const colors = await fetchColorSettings();
            
            // Set colors in component state
            Object.entries(colors).forEach(([key, value]) => {
                this.set(key, value);
            });
        } catch (error) {
            console.error('Error loading color settings:', error);
        }
    }

    async loadMinistriesData() {
        try {
            const response = await fetch('/api/news/active');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.set('ministries', data.data);
                } else {
                    this.set('ministries', []);
                }
            } else {
                console.error('Failed to fetch ministries:', response.statusText);
                this.set('ministries', []);
            }
        } catch (error) {
            console.error('Error fetching ministries:', error);
            this.set('ministries', []);
        }
        
        // Set loading to false
        this.set('loading', false);
        
        // Render with the loaded data
        this.render();
    }

    openMinistryPage(slugOrId) {
        // Navigate to the ministry page using SPA router
        const ministryUrl = `/public/ministries/${slugOrId}`;
        if (window.router) {
            window.router.navigate(ministryUrl);
        } else {
            // Fallback to regular navigation if router is not available
            window.location.href = ministryUrl;
        }
    }

    render() {
        const loading = this.get('loading');
        const ministries = this.get('ministries') || [];
        
        // Get colors from state
        const textColor = this.get('text_color');

        return `
            <div class="flex flex-wrap gap-3 max-w-lg gap-y-3">
                ${loading ? `
                    <!-- Loading Skeleton -->
                    <div class="inline-block bg-gray-300/20 backdrop-blur-sm text-gray-300 text-md font-semibold px-4 py-2 rounded-full border border-gray-300/30 animate-pulse">
                        Loading...
                    </div>
                ` : ministries.length > 0 ? ministries.map(ministry => `
                    <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30 cursor-pointer hover:bg-[${textColor}]/30 transition-all duration-200" 
                          onclick="this.closest('our-ministry-list').openMinistryPage('${ministry.slug || ministry.id}')"
                          title="Click to view ${ministry.title}">
                        ${ministry.title || 'Untitled Ministry'}
                    </span>
                `).join('') : `
                    <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Youth & Kids</span>
                    <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Outreach & Mission</span>
                    <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Women's Group</span>
                    <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Men's Group</span>
                    <span class="inline-block bg-[${textColor}]/20 backdrop-blur-sm text-[${textColor}] text-md font-semibold px-4 py-2 rounded-full border border-[${textColor}]/30">Prayer Group</span>
                `}
            </div>
        `;
    }
}

customElements.define('our-ministry-list', OurMinistryList);
export default OurMinistryList;
