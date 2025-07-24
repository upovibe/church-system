import App from '@/core/App.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';
import '@/components/layout/skeletonLoaders/EventListSkeleton.js';

/**
 * Life Group List Component
 *
 * Displays a list of life groups with banner images on the left and content on the right
 */
class LifeGroupList extends App {
    constructor() {
        super();
        this.set('lifeGroups', []);
        this.set('loading', true);
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadColorsFromSettings();
        this.loadLifeGroupsData();
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

    async loadLifeGroupsData() {
        try {
            const response = await fetch('/api/life-groups/active');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.set('lifeGroups', data.data);
                } else {
                    this.set('lifeGroups', []);
                }
            } else {
                console.error('Failed to fetch life groups:', response.statusText);
                this.set('lifeGroups', []);
            }
        } catch (error) {
            console.error('Error fetching life groups:', error);
            this.set('lifeGroups', []);
        }
        
        // Set loading to false
        this.set('loading', false);
        
        // Render with the loaded data
        this.render();
    }

    searchLifeGroups(query) {
        const searchTerm = query.toLowerCase().trim();
        const lifeGroupCards = this.querySelectorAll('.life-group-card');
        let visibleCount = 0;
        
        lifeGroupCards.forEach(card => {
            const lifeGroupTitle = card.getAttribute('data-title') || '';
            const titleLower = lifeGroupTitle.toLowerCase();
            
            if (searchTerm === '') {
                card.style.display = 'block';
                visibleCount++;
            } else {
                // Split title into words and check if any word starts with the search term
                const titleWords = titleLower.split(/\s+/);
                const hasMatch = titleWords.some(word => word.startsWith(searchTerm));
                
                if (hasMatch) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            }
        });
        
        this.showNoResultsMessage(visibleCount === 0, `No life groups found for "${query}"`);
    }

    showNoResultsMessage(show, message) {
        let noResultsDiv = this.querySelector('.no-results-message');
        
        if (show) {
            if (!noResultsDiv) {
                noResultsDiv = document.createElement('div');
                noResultsDiv.className = 'no-results-message text-center py-8 text-gray-500';
                noResultsDiv.innerHTML = `
                    <i class="fas fa-search text-2xl mb-2"></i>
                    <p>${message}</p>
                `;
                this.querySelector('#life-groups-list').appendChild(noResultsDiv);
            } else {
                noResultsDiv.innerHTML = `
                    <i class="fas fa-search text-2xl mb-2"></i>
                    <p>${message}</p>
                `;
                noResultsDiv.style.display = 'block';
            }
        } else if (noResultsDiv) {
            noResultsDiv.style.display = 'none';
        }
    }

    clearFilters() {
        // Clear search input
        const searchInput = this.querySelector('#life-group-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Show all life groups
        const lifeGroupCards = this.querySelectorAll('.life-group-card');
        lifeGroupCards.forEach(card => {
            card.style.display = 'block';
        });
        
        // Hide no results message
        this.showNoResultsMessage(false);
    }

    openLifeGroupPage(slugOrId) {
        // Navigate to the life group page using SPA router
        const lifeGroupUrl = `/public/life-groups/${slugOrId}`;
        if (window.router) {
            window.router.navigate(lifeGroupUrl);
        } else {
            // Fallback to regular navigation if router is not available
            window.location.href = lifeGroupUrl;
        }
    }

    // Helper method to get proper image URL
    getImageUrl(imagePath) {
        if (!imagePath || typeof imagePath !== 'string') return null;
        
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

    // Helper function to strip HTML tags for preview
    stripHtml(html) {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    // Helper function to truncate text
    truncateText(text, maxLength = 150) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    render() {
        const loading = this.get('loading');
        const lifeGroups = this.get('lifeGroups') || [];
        
        // Get colors from state
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');
        const textColor = this.get('text_color');

        return `
            <!-- Search Bar -->
            <div class="mb-10">
                <div class="max-w-4xl mx-auto">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fas fa-search text-white/70"></i>
                        </div>
                        <input 
                            type="text" 
                            id="life-group-search"
                            placeholder="Search life groups..." 
                            class="block w-full pl-10 pr-10 py-2 bg-transparent border border-gray-300 rounded-xl text-white placeholder-white/70 text-sm"
                            oninput="this.closest('life-group-list').searchLifeGroups(this.value)"
                        >
                    </div>
                </div>
            </div>
            
            <!-- Life Groups Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="life-groups-list">
                ${loading ? `
                    <div class="col-span-full">
                        <event-list-skeleton></event-list-skeleton>
                    </div>
                ` : lifeGroups.length > 0 ? lifeGroups.map(lifeGroup => {
                    // Get banner image from life group
                    const bannerImage = lifeGroup.banner || '';

                    // Strip HTML from content for preview
                    const contentPreview = this.stripHtml(lifeGroup.description || '');
                    const truncatedContent = this.truncateText(contentPreview, 120);

                    return `
                        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-5">
                                <!-- Image -->
                                <div class="relative h-48 bg-gray-200 overflow-hidden">
                                    <img src="${this.getImageUrl(lifeGroup.banner)}" alt="${lifeGroup.title}" class="w-full h-full object-cover">
                                </div>
                                
                                <!-- Content -->
                                <div class="p-4">
                                    <!-- Title -->
                                    <h3 class="text-xl font-semibold text-gray-800 mb-2 italic">${lifeGroup.title}</h3>
                                    
                                    <!-- Description -->
                                    <p class="text-gray-600 text-sm leading-relaxed mb-3">${this.truncateText(this.stripHtml(lifeGroup.description), 120)}</p>
                                    
                                    <!-- Date -->
                                    <div class="text-xs text-gray-500 mb-3">
                                        <i class="fas fa-calendar-alt mr-1"></i>
                                        ${this.formatDate(lifeGroup.created_at)}
                                    </div>
                                    
                                    <!-- Footer -->
                                    <div class="mt-4 pt-4 border-t border-gray-600">
                                        <div class="flex items-center justify-center">
                                            ${lifeGroup.link ? `
                                                <a href="${lifeGroup.link}" target="_blank" class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors" onclick="event.stopPropagation();">
                                                    <i class="fas fa-external-link-alt mr-2"></i>
                                                    Join Life Group
                                                </a>
                                            ` : `
                                                <span class="text-gray-400 text-sm">No link available</span>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            </div>
                    `;
                }).join('') : `
                    <div class="col-span-full text-center py-8 text-gray-500">
                        <i class="fas fa-users text-2xl mb-2"></i>
                        <p>No life groups available</p>
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('life-group-list', LifeGroupList);
export default LifeGroupList; 