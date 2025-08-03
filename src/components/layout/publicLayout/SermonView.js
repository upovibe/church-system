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
        this.set('activeMediaTab', 'watch'); // Default to watch tab
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

    getFileUrl(path) {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        if (path.startsWith('/')) return window.location.origin + path;
        return window.location.origin + '/api/' + path;
    }

    getBannerImages(sermon) {
        if (!sermon || !sermon.images) {
            return [];
        }

        let images = sermon.images;

        // If it's a string, try to parse as JSON
        if (typeof images === 'string') {
            try {
                const parsed = JSON.parse(images);
                if (Array.isArray(parsed)) {
                    images = parsed;
                } else {
                    images = [images];
                }
            } catch (e) {
                // If parsing fails, treat as single path
                images = [images];
            }
        } else if (!Array.isArray(images)) {
            // If it's not an array, wrap in array
            images = [images];
        }

        // Filter out empty/null values
        return images.filter(img => img && img.trim() !== '');
    }

    parseLinks(linksString) {
        if (!linksString) {
            return [];
        }
        
        // If it's already an array, return it directly
        if (Array.isArray(linksString)) {
            return linksString;
        }
        
        // If it's a string, try to parse as JSON
        if (typeof linksString === 'string') {
            try {
                const parsed = JSON.parse(linksString);
                return Array.isArray(parsed) ? parsed : [linksString];
            } catch (e) {
                return [linksString];
            }
        }
        
        // Fallback: wrap in array
        return [linksString];
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

    switchMediaTab(tab) {
        this.set('activeMediaTab', tab);
        this.render();
    }

    // Helper function to get video platform and ID from URL
    getVideoInfo(videoUrl) {
        if (!videoUrl) {
            return { platform: 'unknown', id: null, embedUrl: null };
        }
        
        // YouTube
        if (videoUrl.includes('youtube.com/watch') || videoUrl.includes('youtu.be/')) {
            let videoId = null;
            if (videoUrl.includes('youtube.com/watch')) {
                const urlParams = new URLSearchParams(videoUrl.split('?')[1]);
                videoId = urlParams.get('v');
            } else if (videoUrl.includes('youtu.be/')) {
                videoId = videoUrl.split('youtu.be/')[1];
            }
            return {
                platform: 'youtube',
                id: videoId,
                embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null
            };
        }
        
        // Facebook
        if (videoUrl.includes('facebook.com/') && videoUrl.includes('/videos/')) {
            const videoId = videoUrl.match(/\/videos\/(\d+)/)?.[1];
            return {
                platform: 'facebook',
                id: videoId,
                embedUrl: videoId ? `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/videos/${videoId}` : null
            };
        }
        
        // Vimeo
        if (videoUrl.includes('vimeo.com/')) {
            const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
            return {
                platform: 'vimeo',
                id: videoId,
                embedUrl: videoId ? `https://player.vimeo.com/video/${videoId}` : null
            };
        }
        
        // Dailymotion
        if (videoUrl.includes('dailymotion.com/video/')) {
            const videoId = videoUrl.match(/dailymotion\.com\/video\/([^_]+)/)?.[1];
            return {
                platform: 'dailymotion',
                id: videoId,
                embedUrl: videoId ? `https://www.dailymotion.com/embed/video/${videoId}` : null
            };
        }
        
        // Default fallback
        return {
            platform: 'unknown',
            id: videoUrl,
            embedUrl: videoUrl
        };
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
            <!-- Sermon Banner - Always show (placeholder if no image) -->
            <div class="relative w-full h-[600px] lg:h-[55vh] overflow-hidden">
                ${bannerImage ? `
                    <img src="${bannerImage}" 
                         alt="${sermon.title}" 
                         class="w-full h-full object-cover"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                ` : ''}
                <div class="absolute inset-0 ${bannerImage ? 'hidden' : 'flex'} items-center justify-center bg-gray-100">
                    <div class="text-center">
                        <i class="fas fa-microphone text-gray-400 text-6xl mb-4"></i>
                        <h2 class="text-2xl font-bold text-gray-700 mb-2">${sermon.title ? sermon.title.charAt(0).toUpperCase() + sermon.title.slice(1) : 'Sermon'}</h2>
                        <p class="text-lg text-gray-600">${sermon.speaker || 'Unknown Speaker'} • ${this.formatDate(sermon.date_preached)}</p>
                    </div>
                </div>
                
                <!-- Dark gradient overlay from bottom to top -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20"></div>
                
                <!-- Content Overlay -->
                <div class="absolute inset-0 flex items-center justify-start z-30 container mx-auto">
                    <div class="text-left text-white px-4 lg:px-8 max-w-4xl space-y-4">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg pb-2 border-b-4 border-[${accentColor}] w-fit" style="line-height: 1.1">
                            ${sermon.title ? sermon.title.charAt(0).toUpperCase() + sermon.title.slice(1) : 'Sermon'}
                        </h1>
                        
                        <!-- Date and Speaker - Flex row layout -->
                        <div class="flex flex-row flex-wrap gap-4 items-center">
                            <div class="bg-[${darkColor}] bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2 text-[${textColor}] whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-calendar-alt text-[${accentColor}]"></i>
                                    <span class="text-sm font-medium">${this.formatDate(sermon.date_preached)}</span>
                                </div>
                            </div>
                            
                            <div class="bg-[${darkColor}] bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2 text-[${textColor}] whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-user text-[${accentColor}]"></i>
                                    <span class="text-sm font-medium">${sermon.speaker || 'Unknown Speaker'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Status Badge - Absolute positioned at bottom-right corner -->
                <div class="absolute bottom-4 right-4 z-10">
                    <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[${primaryColor}] text-[${textColor}] shadow-lg">
                        <i class="fas fa-play mr-2"></i>
                        Sermon
                    </span>
                </div>
            </div>

            <!-- Content Section -->
            <div class="container mx-auto p-4 py-8 space-y-4">
                <!-- Share/Copy buttons -->
                <div class="flex items-center justify-end">
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

                <!-- Sermon Content -->
                ${sermon.content ? `
                    <div class="rounded-lg shadow-md p-4 bg-white/80 backdrop-blur-sm border border-gray-200">
                        <content-display 
                            content="${sermon.content.replace(/"/g, '&quot;')}"
                            no-styles>
                        </content-display>
                    </div>
                ` : ''}

                <!-- Media Links with Tabs -->
                ${(videoLinks.length > 0 || audioLinks.length > 0) ? `
                    <div class="rounded-lg shadow-md bg-white/80 backdrop-blur-sm border border-gray-200">
                        <!-- Tab Headers -->
                        <div class="flex border-b border-gray-200">
                            ${videoLinks.length > 0 ? `
                                <button 
                                    onclick="this.closest('sermon-view').switchMediaTab('watch')"
                                    class="flex-1 px-6 py-4 text-center font-medium transition-colors ${this.get('activeMediaTab') === 'watch' ? 'text-[${primaryColor}] border-b-2 border-[${primaryColor}] bg-[${primaryColor}]/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}">
                                    <i class="fas fa-video mr-2"></i>
                                    Watch (${videoLinks.length})
                                </button>
                            ` : ''}
                            ${audioLinks.length > 0 ? `
                                <button 
                                    onclick="this.closest('sermon-view').switchMediaTab('listen')"
                                    class="flex-1 px-6 py-4 text-center font-medium transition-colors ${this.get('activeMediaTab') === 'listen' ? 'text-[${primaryColor}] border-b-2 border-[${primaryColor}] bg-[${primaryColor}]/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}">
                                    <i class="fas fa-headphones mr-2"></i>
                                    Listen (${audioLinks.length})
                                </button>
                            ` : ''}
                        </div>
                        
                        <!-- Tab Content -->
                        <div class="p-6">
                            ${this.get('activeMediaTab') === 'watch' && videoLinks.length > 0 ? `
                                <!-- Video Content -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    ${videoLinks.map((videoUrl, index) => {
                                        // If videoUrl is an array, take the first element
                                        const actualVideoUrl = Array.isArray(videoUrl) ? videoUrl[0] : videoUrl;
                                        
                                        const videoInfo = this.getVideoInfo(actualVideoUrl);
                                        return `
                                            <div class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                                <div class="relative aspect-video">
                                                    ${videoInfo.embedUrl ? `
                                                        <iframe 
                                                            src="${videoInfo.embedUrl}" 
                                                            title="${sermon.title} - Video ${index + 1}"
                                                            class="w-full h-full rounded-xl"
                                                            frameborder="0" 
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                            allowfullscreen>
                                                        </iframe>
                                                    ` : `
                                                        <div class="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                                                            <div class="text-center">
                                                                <i class="fas fa-video text-gray-400 text-4xl mb-2"></i>
                                                                <p class="text-gray-500">Video not available</p>
                                                                <a href="${actualVideoUrl}" target="_blank" class="text-blue-500 hover:underline mt-2 inline-block">
                                                                    View on ${videoInfo.platform}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    `}
                                                    
                                                    <!-- Video Number Badge -->
                                                    <div class="absolute top-3 left-3">
                                                        <span class="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                                                            ${index + 1}
                                                        </span>
                                                    </div>
                                                    
                                                    <!-- Platform Badge -->
                                                    <div class="absolute top-3 right-3">
                                                        <span class="bg-[${primaryColor}] text-white text-xs px-2 py-1 rounded-full capitalize">
                                                            ${videoInfo.platform}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <!-- Video Link -->
                                                <div class="p-3">
                                                    <a href="${actualVideoUrl}" target="_blank" 
                                                       class="inline-flex items-center gap-2 text-[${primaryColor}] hover:text-[${accentColor}] transition-colors">
                                                        <i class="fas fa-external-link-alt"></i>
                                                        <span class="text-sm">View on ${videoInfo.platform}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : ''}
                            
                            ${this.get('activeMediaTab') === 'listen' && audioLinks.length > 0 ? `
                                <!-- Audio Content -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    ${audioLinks.map((audioFile, index) => {
                                        // Handle different audio file formats
                                        let fileName, fileExtension, filePath;
                                        
                                        if (typeof audioFile === 'string') {
                                            fileName = audioFile.split('/').pop() || `Audio ${index + 1}`;
                                            fileExtension = fileName.split('.').pop()?.toUpperCase() || 'AUDIO';
                                            filePath = audioFile;
                                        } else if (audioFile && typeof audioFile === 'object') {
                                            // If it's an object, try to extract path
                                            filePath = audioFile.path || audioFile.url || audioFile.src || `Audio ${index + 1}`;
                                            fileName = filePath.split('/').pop() || `Audio ${index + 1}`;
                                            fileExtension = fileName.split('.').pop()?.toUpperCase() || 'AUDIO';
                                        } else {
                                            // Fallback
                                            fileName = `Audio ${index + 1}`;
                                            fileExtension = 'AUDIO';
                                            filePath = `sermons/audio-${index + 1}.mp3`;
                                        }
                                        
                                        // Get proper file URL using the same logic as the modal
                                        const audioUrl = this.getFileUrl(filePath);
                                        
                                        return `
                                            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div class="w-12 h-12 bg-[${primaryColor}] rounded-lg flex items-center justify-center">
                                                    <i class="fas fa-music text-white text-lg"></i>
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <h4 class="font-medium text-gray-800 truncate" title="${fileName}">${fileName}</h4>
                                                    <p class="text-sm text-gray-500 truncate">Sermon audio file (${fileExtension})</p>
                                                </div>
                                                <div class="flex gap-2 flex-shrink-0">
                                                    <audio controls class="h-10">
                                                        <source src="${audioUrl}" type="audio/${fileExtension.toLowerCase()}">
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : ''}
                        </div>
                                    </div>
            ` : ''}

                <!-- Sermon Images Gallery -->
                ${bannerImages.length > 1 ? `
                    <div class="rounded-lg shadow-md p-6 bg-white/80 backdrop-blur-sm border border-gray-200">
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Sermon Images</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${bannerImages.map((image, index) => {
                                const imageUrl = this.getImageUrl(image);
                                return imageUrl ? `
                                    <div class="relative group overflow-hidden rounded-lg">
                                        <img src="${imageUrl}" 
                                             alt="Sermon image ${index + 1}" 
                                             class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                             onerror="this.style.display='none'">
                                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                                    </div>
                                ` : '';
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('sermon-view', SermonView);
export default SermonView; 