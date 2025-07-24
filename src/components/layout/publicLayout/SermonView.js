import App from '@/core/App.js';
import { fetchColorSettings } from '@/utils/colorSettings.js';
import '@/components/common/PageLoader.js';
import '@/components/ui/Breadcrumb.js';
import '@/components/ui/ContentDisplay.js';
import '@/components/ui/Toast.js';

/**
 * Sermon View Component
 * 
 * Displays detailed information for a specific sermon
 */
class SermonView extends App {
    constructor() {
        super();
        this.set('sermon', null);
        this.set('loading', true);
        this.set('error', null);
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadColorsFromSettings();
        this.loadSermonData();
    }

    async loadColorsFromSettings() {
        try {
            const colors = await fetchColorSettings();
            Object.entries(colors).forEach(([key, value]) => {
                this.set(key, value);
            });
        } catch (error) {
            console.error('Error loading color settings:', error);
        }
    }

    async loadSermonData() {
        const slug = this.getAttribute('slug');
        if (!slug) {
            this.set('error', 'No sermon slug provided');
            this.set('loading', false);
            return;
        }

        try {
            const response = await fetch(`/api/sermons/slug/${slug}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.set('sermon', data.data);
                } else {
                    this.set('error', 'Sermon not found');
                }
            } else {
                this.set('error', 'Failed to load sermon');
            }
        } catch (error) {
            console.error('Error fetching sermon:', error);
            this.set('error', 'Error loading sermon');
        }

        this.set('loading', false);
    }

    getImageUrl(imagePath) {
        if (!imagePath || typeof imagePath !== 'string') return null;
        
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        if (imagePath.startsWith('/')) {
            const baseUrl = window.location.origin;
            return baseUrl + imagePath;
        }
        
        const baseUrl = window.location.origin;
        const apiPath = '/api';
        return baseUrl + apiPath + '/' + imagePath;
    }

    getBannerImages(sermon) {
        if (!sermon || !sermon.images) {
            return [];
        }

        let images = sermon.images;

        if (typeof images === 'string') {
            try {
                const parsed = JSON.parse(images);
                if (Array.isArray(parsed)) {
                    images = parsed;
                } else {
                    images = [images];
                }
            } catch (e) {
                images = [images];
            }
        } else if (!Array.isArray(images)) {
            images = [images];
        }

        return images.filter(img => img && img.trim() !== '');
    }

    parseLinks(linksString) {
        if (!linksString) return [];
        
        try {
            const parsed = JSON.parse(linksString);
            return Array.isArray(parsed) ? parsed : [linksString];
        } catch (e) {
            return [linksString];
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'TBD';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    copySermonUrl() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            this.showToast('Sermon URL copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy URL', 'error');
        });
    }

    shareSermon() {
        const sermon = this.get('sermon');
        if (!sermon) return;

        if (navigator.share) {
            navigator.share({
                title: sermon.title,
                text: sermon.description,
                url: window.location.href
            }).catch(() => {
                this.showToast('Sharing cancelled', 'info');
            });
        } else {
            this.copySermonUrl();
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('toast-notification');
        toast.setAttribute('message', message);
        toast.setAttribute('type', type);
        document.body.appendChild(toast);
    }

    render() {
        const loading = this.get('loading');
        const error = this.get('error');
        const sermon = this.get('sermon');

        if (loading) {
            return `
                <div class="container flex items-center justify-center mx-auto p-8">
                    <page-loader></page-loader>
                </div>
            `;
        }

        if (error || !sermon) {
            return `
                <div class="container mx-auto flex items-center justify-center p-8">
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        ${error || 'Sermon not found'}
                    </div>
                </div>
            `;
        }

        // Get colors from state
        const primaryColor = this.get('primary_color');
        const secondaryColor = this.get('secondary_color');
        const accentColor = this.get('accent_color');
        const textColor = this.get('text_color');
        const darkColor = this.get('dark_color');

        // Get banner images
        const bannerImages = this.getBannerImages(sermon);
        const bannerImage = bannerImages.length > 0 ? this.getImageUrl(bannerImages[0]) : null;

        // Parse links
        const videoLinks = this.parseLinks(sermon.video_links);
        const audioLinks = this.parseLinks(sermon.audio_links);

        return `
            <!-- Banner Section -->
            <div class="relative w-full h-[500px] lg:h-[45vh] overflow-hidden">
                ${bannerImage ? `
                    <div class="absolute inset-0 w-full h-full bg-cover bg-center"
                         style="background-image: url('${bannerImage}');">
                    </div>
                ` : `
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                        <div class="text-center text-white">
                            <i class="fas fa-microphone text-6xl mb-4 opacity-50"></i>
                            <h1 class="text-3xl font-bold mb-2">${sermon.title}</h1>
                            <p class="text-lg opacity-75">${sermon.speaker || 'Unknown Speaker'}</p>
                            <p class="text-sm opacity-60">${this.formatDate(sermon.date_preached)}</p>
                        </div>
                    </div>
                `}
                
                <!-- Dark gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <!-- Content Overlay -->
                <div class="absolute inset-0 flex items-center justify-start z-10 container mx-auto">
                    <div class="text-left text-white px-4 lg:px-8 max-w-4xl space-y-4">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg pb-2 border-b-4 border-[${accentColor}] w-fit" style="line-height: 1.1">
                            ${sermon.title}
                        </h1>
                        
                        <div class="flex flex-row flex-wrap gap-4 items-center">
                            <span class="flex items-center gap-2 whitespace-nowrap">
                                <i class="fas fa-calendar text-[${accentColor}]"></i>
                                <span class="text-lg">${this.formatDate(sermon.date_preached)}</span>
                            </span>
                            <span class="flex items-center gap-2 whitespace-nowrap">
                                <i class="fas fa-user text-[${accentColor}]"></i>
                                <span class="text-lg">${sermon.speaker || 'Unknown Speaker'}</span>
                            </span>
                        </div>
                        
                        <!-- Status Badge -->
                        <div class="absolute bottom-4 right-4 z-10">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[${primaryColor}] text-[${textColor}]">
                                <i class="fas fa-play mr-1"></i>
                                Sermon
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Section -->
            <div class="container mx-auto p-4 py-8 space-y-4">
                <!-- Title with Share/Copy buttons -->
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">${sermon.title}</h1>
                        <p class="text-lg text-gray-600">by ${sermon.speaker || 'Unknown Speaker'}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="this.closest('sermon-view').shareSermon()" 
                                class="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-lg hover:bg-white transition-colors">
                            <i class="fas fa-share-alt text-gray-600"></i>
                        </button>
                        <button onclick="this.closest('sermon-view').copySermonUrl()" 
                                class="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-lg hover:bg-white transition-colors">
                            <i class="fas fa-copy text-gray-600"></i>
                        </button>
                    </div>
                </div>

                <!-- Sermon Description -->
                <div class="rounded-lg shadow-md p-4 bg-white/80 backdrop-blur-sm border border-gray-200">
                    <div class="prose max-w-none">
                        <p class="leading-relaxed">${sermon.description || 'No description available'}</p>
                    </div>
                </div>

                <!-- Media Links -->
                ${(videoLinks.length > 0 || audioLinks.length > 0) ? `
                    <div class="rounded-lg shadow-md p-6 bg-white/80 backdrop-blur-sm border border-gray-200">
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Listen & Watch</h3>
                        
                        ${videoLinks.length > 0 ? `
                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-3 text-gray-700 flex items-center gap-2">
                                    <i class="fas fa-video text-[${primaryColor}]"></i>
                                    Video
                                </h4>
                                <div class="space-y-3">
                                    ${videoLinks.map((link, index) => `
                                        <a href="${link}" target="_blank" rel="noopener noreferrer"
                                           class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <i class="fas fa-play-circle text-[${primaryColor}] text-xl"></i>
                                            <span class="text-gray-700">Watch Video ${videoLinks.length > 1 ? index + 1 : ''}</span>
                                            <i class="fas fa-external-link-alt text-gray-400 ml-auto"></i>
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${audioLinks.length > 0 ? `
                            <div>
                                <h4 class="text-lg font-medium mb-3 text-gray-700 flex items-center gap-2">
                                    <i class="fas fa-headphones text-[${primaryColor}]"></i>
                                    Audio
                                </h4>
                                <div class="space-y-3">
                                    ${audioLinks.map((link, index) => `
                                        <a href="${link}" target="_blank" rel="noopener noreferrer"
                                           class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <i class="fas fa-play-circle text-[${primaryColor}] text-xl"></i>
                                            <span class="text-gray-700">Listen to Audio ${audioLinks.length > 1 ? index + 1 : ''}</span>
                                            <i class="fas fa-external-link-alt text-gray-400 ml-auto"></i>
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Sermon Content -->
                ${sermon.content ? `
                    <div class="rounded-lg shadow-md p-6 bg-white/80 backdrop-blur-sm border border-gray-200">
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Sermon Content</h3>
                        <div class="prose max-w-none">
                            <p class="leading-relaxed text-gray-700">${sermon.content}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('sermon-view', SermonView);
export default SermonView; 