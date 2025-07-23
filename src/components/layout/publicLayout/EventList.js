import App from '@/core/App.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';
import '@/components/layout/skeletonLoaders/EventListSkeleton.js';

/**
 * Event List Component
 * 
 * Displays a list of events with filtering by status
 */
class EventList extends App {
    constructor() {
        super();
        this.set('events', []);
        this.set('loading', true);
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadColorsFromSettings();
        this.loadEventsData();
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

    async loadEventsData() {
        try {
            const response = await fetch('/api/events/active');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.set('events', data.data);
                } else {
                    this.set('events', []);
                }
            } else {
                console.error('Failed to fetch events:', response.statusText);
                this.set('events', []);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            this.set('events', []);
        }
        
        // Set loading to false
        this.set('loading', false);
        
        // Render with the loaded data
        this.render();
        

    }



    openEventPage(slugOrId) {
        // Navigate to the event page using SPA router
        const eventUrl = `/public/community/events/${slugOrId}`;
        if (window.router) {
            window.router.navigate(eventUrl);
        } else {
            // Fallback to regular navigation if router is not available
            window.location.href = eventUrl;
        }
    }

    // Helper function to get status badge styling
    getStatusBadge(status) {
        switch (status?.toLowerCase()) {
            case 'upcoming':
                return {
                    class: 'bg-blue-100 text-blue-800',
                    icon: 'fas fa-clock',
                    text: 'Upcoming'
                };
            case 'ongoing':
                return {
                    class: 'bg-green-100 text-green-800',
                    icon: 'fas fa-play',
                    text: 'Ongoing'
                };
            case 'completed':
                return {
                    class: 'bg-gray-100 text-gray-800',
                    icon: 'fas fa-check',
                    text: 'Completed'
                };
            case 'cancelled':
                return {
                    class: 'bg-red-100 text-red-800',
                    icon: 'fas fa-times',
                    text: 'Cancelled'
                };
            default:
                return {
                    class: 'bg-gray-100 text-gray-800',
                    icon: 'fas fa-circle',
                    text: status || 'Unknown'
                };
        }
    }

    // Helper function to normalize status for filtering
    normalizeStatus(status) {
        if (!status) return 'unknown';
        const normalized = status.toLowerCase().trim();
        
        // Map common variations to standard statuses
        switch (normalized) {
            case 'upcoming':
            case 'scheduled':
            case 'planned':
                return 'upcoming';
            case 'ongoing':
            case 'in progress':
            case 'active':
                return 'ongoing';
            case 'completed':
            case 'finished':
            case 'done':
                return 'completed';
            case 'cancelled':
            case 'canceled':
            case 'cancelled':
                return 'cancelled';
            default:
                return normalized;
        }
    }

    // Helper function to format date
    formatDate(dateString) {
        if (!dateString) return 'TBD';
        try {
            // Handle different date formats from API
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            return date.toLocaleDateString();
        } catch (error) {
            return dateString;
        }
    }

    // Helper function to format time
    formatTime(timeString) {
        if (!timeString) return 'TBD';
        try {
            // If it's a full datetime string, extract time
            if (timeString.includes(' ')) {
                const timePart = timeString.split(' ')[1];
                return timePart.substring(0, 5); // Return HH:MM format
            }
            return timeString;
        } catch (error) {
            return timeString;
        }
    }

    render() {
        const loading = this.get('loading');
        const events = this.get('events') || [];
        
        // Get colors from state
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${loading ? `<event-list-skeleton></event-list-skeleton>` : events.length > 0 ? events.map(event => {
                    const statusBadge = this.getStatusBadge(event.status);
                    
                    // Get banner image from event
                    let bannerImage = '';
                    if (event.banner_image) {
                        try {
                            const bannerImages = JSON.parse(event.banner_image);
                            if (bannerImages && bannerImages.length > 0) {
                                bannerImage = bannerImages[0]; // Use the first image
                            }
                        } catch (error) {
                            // If parsing fails, treat as single path
                            bannerImage = event.banner_image;
                        }
                    }

                    // Create background style with banner image
                    const backgroundStyle = bannerImage 
                        ? `background-image: url('${this.getImageUrl(bannerImage)}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
                        : 'background-color: white;';

                    return `
                        <div class="rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-[${primaryColor}] cursor-pointer h-64 relative overflow-hidden" 
                             style="${backgroundStyle}"
                             onclick="this.closest('event-list').openEventPage('${event.slug || event.id}')">
                            <!-- Dark overlay for better text readability -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            
                            <!-- Status badge at top right -->
                            <div class="absolute top-3 right-3 z-20">
                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.class}">
                                    <i class="${statusBadge.icon} mr-1 text-xs"></i>
                                    ${statusBadge.text}
                                </span>
                            </div>
                            
                            <!-- Category tag at top left -->
                            <div class="absolute top-3 left-3 z-20">
                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                                    <i class="fas fa-tag mr-1"></i>
                                    ${event.category || 'General'}
                                </span>
                            </div>
                            
                            <!-- Content at bottom left -->
                            <div class="absolute bottom-4 left-4 right-4 z-20 text-white">
                                <h4 class="font-bold text-lg line-clamp-2 capitalize mb-2" title="${event.title || 'Untitled Event'}">${event.title || 'Untitled Event'}</h4>
                                <div class="flex items-center gap-4 text-sm text-white/90">
                                    <span class="flex items-center gap-1">
                                        <i class="fas fa-calendar text-white"></i>
                                        ${this.formatDate(event.start_date || event.event_date)}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <i class="fas fa-clock text-white"></i>
                                        ${this.formatTime(event.start_date || event.event_time)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('') : `
                    <div class="col-span-full text-center py-8 text-gray-500">
                        <i class="fas fa-calendar-times text-2xl mb-2"></i>
                        <p>No events available</p>
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('event-list', EventList);
export default EventList; 