import App from '@/core/App.js';
import '@/components/common/PageLoader.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';

/**
 * Event View Component
 * 
 * Displays detailed event information with banner and content sections.
 * Accepts slug via 'slug' attribute and fetches event data.
 */
class EventView extends App {
    constructor() {
        super();
        this.set('event', null);
        this.set('loading', true);
        this.set('error', null);
        this.set('colorsLoaded', false);
    }

    async connectedCallback() {
        super.connectedCallback();
        
        // Load colors from settings
        await this.loadColorsFromSettings();
        
        // Check if slug attribute is provided and load data
        const slug = this.getAttribute('slug');
        if (slug) {
            this.loadEventData(slug);
        }
    }

    // Watch for slug attribute changes
    static get observedAttributes() {
        return ['slug'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'slug' && newValue && newValue !== oldValue) {
            this.loadEventData(newValue);
        }
    }

    async loadColorsFromSettings() {
        try {
            // Fetch colors from API
            const colors = await fetchColorSettings();
            
            // Set colors in component state
            Object.entries(colors).forEach(([key, value]) => {
                this.set(key, value);
            });
            
            // Mark colors as loaded
            this.set('colorsLoaded', true);
        } catch (error) {
            this.set('colorsLoaded', true);
        }
    }

    // Method to load event data
    async loadEventData(slug) {
        try {
            if (!slug) {
                this.set('error', 'Event not found');
                this.set('loading', false);
                return;
            }

            console.log('Fetching event data for slug:', slug);
            
            // Fetch event data by slug
            const apiUrl = `/api/events/slug/${slug}`;
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Event API Response:', data);
                
                if (data.success && data.data) {
                    console.log('Event Data:', data.data);
                    console.log('Event Banner Image:', data.data.banner_image);
                    this.set('event', data.data);
                } else {
                    console.log('No event data found for slug:', slug);
                    this.set('error', 'Event not found');
                }
            } else {
                this.set('error', 'Failed to load event');
            }
        } catch (error) {
            console.error('Error loading event:', error);
            this.set('error', 'Error loading event');
        }
        
        this.set('loading', false);
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
    getBannerImages(event) {
        if (!event || !event.banner_image) {
            return [];
        }

        let bannerImages = event.banner_image;

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

    // Helper method to format date
    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Helper method to format time
    formatTime(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    render() {
        const loading = this.get('loading');
        const colorsLoaded = this.get('colorsLoaded');
        const error = this.get('error');
        const event = this.get('event');
        
        // Get colors from state
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');
        const accentColor = this.get('accent_color');
        const textColor = this.get('text_color');
        const darkColor = this.get('dark_color');
        
        // Show loading if either colors or event data is still loading
        if (loading || !colorsLoaded) {
            return `
                <div class="container flex items-center justify-center mx-auto p-8">
                    <page-loader></page-loader>
                </div>
            `;
        }
        


        if (!loading && (error || !event)) {
            return `
                <div class="flex items-center justify-center min-h-96">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                        <h1 class="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h1>
                        <p class="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
                        <a href="/public/service-events" 
                           class="inline-flex items-center gap-2 px-6 py-3 bg-[${primaryColor}] text-[${textColor}] font-semibold rounded-lg hover:bg-[${accentColor}] transition-colors">
                            <i class="fas fa-arrow-left"></i>
                            Back to Events
                        </a>
                    </div>
                </div>
            `;
        }

        // Format dates
        const startDate = this.formatDate(event.start_date);
        const startTime = this.formatTime(event.start_date);
        const endTime = this.formatTime(event.end_date);

        return `
            <div class="min-h-screen">
                <!-- Event Banner - Always show (placeholder if no image) -->
                <div class="relative w-full h-[500px] lg:h-[45vh] overflow-hidden">
                    ${event.banner_image ? `
                        <img src="/api/${event.banner_image}" 
                             alt="${event.title}" 
                             class="w-full h-full object-cover"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    ` : ''}
                    <div class="absolute inset-0 ${event.banner_image ? 'hidden' : 'flex'} items-center justify-center bg-gray-100">
                        <div class="text-center">
                            <i class="fas fa-calendar-alt text-gray-400 text-6xl mb-4"></i>
                            <h2 class="text-2xl font-bold text-gray-700 mb-2">${event.title ? event.title.charAt(0).toUpperCase() + event.title.slice(1) : 'Event'}</h2>
                            <p class="text-lg text-gray-600">${event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'Event'} • ${this.formatDate(event.start_date)}</p>
                        </div>
                    </div>
                    
                    <!-- Dark gradient overlay from bottom to top -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20"></div>
                    
                    <!-- Content Overlay -->
                    <div class="absolute inset-0 flex items-center justify-start z-30 container mx-auto">
                        <div class="text-left text-white px-4 lg:px-8 max-w-4xl space-y-4">
                            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg pb-2 border-b-4 border-[${accentColor}] w-fit" style="line-height: 1.1">
                                ${event.title ? event.title.charAt(0).toUpperCase() + event.title.slice(1) : 'Event'}
                            </h1>
                            
                            <!-- Date/Time and Location - Flex row layout -->
                            <div class="flex flex-row gap-4 items-center">
                                <div class="bg-[${darkColor}] bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2 text-[${textColor}]">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-calendar-alt text-[${accentColor}]"></i>
                                        <span class="text-sm font-medium">${startDate} • ${startTime}</span>
                                    </div>
                                </div>
                                
                                ${event.location ? `
                                    <div class="bg-[${darkColor}] bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2 text-[${textColor}]">
                                        <div class="flex items-center gap-2">
                                            <i class="fas fa-map-marker-alt text-[${accentColor}]"></i>
                                            <span class="text-sm font-medium">${event.location}</span>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Event Details Section -->
                <div class="container px-4 py-8">
                    <div class="max-w-4xl mx-auto">
                        <!-- Event Description -->
                        <div class="rounded-lg shadow-md p-4">
                            <div class="prose max-w-none">
                                <p class="text-[${textColor}] leading-relaxed">${event.description || 'No description available'}</p>
                            </div>
                        </div>

                        <!-- Event Info Cards -->
                        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div class="bg-[${textColor}] rounded-lg shadow-md p-6 border-l-4 border-[${primaryColor}]">
                                <div class="flex items-center">
                                    <i class="fas fa-calendar-alt text-[${primaryColor}] text-2xl mr-4"></i>
                                    <div>
                                        <h3 class="font-semibold text-[${darkColor}]">Date</h3>
                                        <p class="text-[${secondaryColor}]">${startDate}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-[${textColor}] rounded-lg shadow-md p-6 border-l-4 border-[${accentColor}]">
                                <div class="flex items-center">
                                    <i class="fas fa-clock text-[${accentColor}] text-2xl mr-4"></i>
                                    <div>
                                        <h3 class="font-semibold text-[${darkColor}]">Time</h3>
                                        <p class="text-[${secondaryColor}]">${startTime} - ${endTime}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-[${textColor}] rounded-lg shadow-md p-6 border-l-4 border-[${secondaryColor}]">
                                <div class="flex items-center">
                                    <i class="fas fa-map-marker-alt text-[${secondaryColor}] text-2xl mr-4"></i>
                                    <div>
                                        <h3 class="font-semibold text-[${darkColor}]">Location</h3>
                                        <p class="text-[${secondaryColor}]">${event.location || 'TBD'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-[${textColor}] rounded-lg shadow-md p-6 border-l-4 border-[${darkColor}]">
                                <div class="flex items-center">
                                    <i class="fas fa-info-circle text-[${darkColor}] text-2xl mr-4"></i>
                                    <div>
                                        <h3 class="font-semibold text-[${darkColor}]">Status</h3>
                                        <p class="text-[${secondaryColor}] capitalize">${event.status || 'upcoming'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Back Button -->
                        <div class="text-center">
                            <a href="/public/service-events" 
                               class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                <i class="fas fa-arrow-left"></i>
                                Back to Events
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('event-view', EventView);
export default EventView; 