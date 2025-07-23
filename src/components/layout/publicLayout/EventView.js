import App from '@/core/App.js';

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
    }

    connectedCallback() {
        super.connectedCallback();
        
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
        const error = this.get('error');
        const event = this.get('event');
        
        if (loading) {
            return `
                <div class="min-h-screen flex items-center justify-center">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p class="text-gray-600">Loading event...</p>
                    </div>
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
                           class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-arrow-left"></i>
                            Back to Events
                        </a>
                    </div>
                </div>
            `;
        }

        // Get banner images from event
        const bannerImages = this.getBannerImages(event) || [];
        const showImages = bannerImages.length > 0;

        // Get event details
        const eventTitle = event.title || 'Event Details';
        const eventDescription = event.description || 'No description available';
        const eventCategory = event.category || 'Church Event';
        const eventLocation = event.location || 'TBD';
        const eventStatus = event.status || 'upcoming';
        
        // Format dates
        const startDate = this.formatDate(event.start_date);
        const startTime = this.formatTime(event.start_date);
        const endTime = this.formatTime(event.end_date);

        return `
            <div class="min-h-screen">
                <!-- Banner Section with Event Image -->
                <div class="relative w-full h-[500px] lg:h-[45vh] overflow-hidden">
                    ${showImages ? bannerImages.map((img, idx) => `
                        <div
                             class="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
                             style="background-image: url('${this.getImageUrl(img)}'); transition-property: opacity;">
                        </div>
                    `).join('') : `
                        <div class="absolute inset-0 bg-gray-300"></div>
                    `}
                    
                    <!-- Dark gradient overlay from bottom to top -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20"></div>
                    
                    <!-- Content Overlay -->
                    <div class="absolute inset-0 flex items-center justify-start z-30 container mx-auto">
                        <div class="text-left text-white px-4 lg:px-8 max-w-4xl space-y-6">
                            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg pb-2 border-b-4 border-blue-400 w-fit" style="line-height: 1.1">
                                ${eventTitle}
                            </h1>
                            <p class="text-lg md:text-xl lg:text-2xl opacity-95 leading-relaxed drop-shadow-md">
                                ${eventDescription}
                            </p>
                            <div class="flex flex-row gap-2 sm:gap-4 justify-start w-fit">
                                <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                                    <i class="fas fa-calendar mr-2"></i>
                                    ${eventCategory}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Event Details Section -->
                <div class="container mx-auto px-4 py-8">
                    <div class="max-w-4xl mx-auto">
                        <!-- Event Info Cards -->
                        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                                <div class="flex items-center">
                                    <i class="fas fa-calendar-alt text-blue-500 text-2xl mr-4"></i>
                                    <div>
                                        <h3 class="font-semibold text-gray-800">Date</h3>
                                        <p class="text-gray-600">${startDate}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                                <div class="flex items-center">
                                    <i class="fas fa-clock text-green-500 text-2xl mr-4"></i>
                                    <div>
                                        <h3 class="font-semibold text-gray-800">Time</h3>
                                        <p class="text-gray-600">${startTime} - ${endTime}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                                <div class="flex items-center">
                                    <i class="fas fa-map-marker-alt text-purple-500 text-2xl mr-4"></i>
                                    <div>
                                        <h3 class="font-semibold text-gray-800">Location</h3>
                                        <p class="text-gray-600">${eventLocation}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                                <div class="flex items-center">
                                    <i class="fas fa-info-circle text-orange-500 text-2xl mr-4"></i>
                                    <div>
                                        <h3 class="font-semibold text-gray-800">Status</h3>
                                        <p class="text-gray-600 capitalize">${eventStatus}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Event Description -->
                        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
                            <div class="prose max-w-none">
                                <p class="text-gray-700 leading-relaxed">${eventDescription}</p>
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