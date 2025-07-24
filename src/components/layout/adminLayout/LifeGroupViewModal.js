import '@/components/ui/Modal.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Badge.js';
import '@/components/ui/ContentDisplay.js';

/**
 * Life Group View Modal Component
 * 
 * A modal component for viewing life group details in the admin panel
 * 
 * Attributes:
 * - open: boolean - controls modal visibility
 * 
 * Events:
 * - modal-closed: Fired when modal is closed
 */
class LifeGroupViewModal extends HTMLElement {
    constructor() {
        super();
        this.lifeGroupData = null;
    }

    static get observedAttributes() {
        return ['open'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for close button click (cancel)
        this.addEventListener('cancel', () => {
            this.close();
        });

        // Listen for confirm button click (close)
        this.addEventListener('confirm', () => {
            this.close();
        });
    }

    open() {
        this.setAttribute('open', '');
    }

    close() {
        this.removeAttribute('open');
    }

    // Set life group data for viewing
    setLifeGroupData(lifeGroupData) {
        this.lifeGroupData = lifeGroupData;
        // Re-render the modal with the new data
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

    // Helper method to get status badge color
    getStatusBadgeColor(isActive) {
        return isActive ? 'success' : 'error';
    }

    // Helper method to get status icon
    getStatusIcon(isActive) {
        return isActive ? 'fa-check' : 'fa-times';
    }

    render() {
        const lifeGroup = this.lifeGroupData;
        
        if (!lifeGroup) {
            return `
                <ui-modal 
                    title="Life Group Details"
                    size="lg"
                    ${this.hasAttribute('open') ? 'open' : ''}>
                    <div class="text-center py-8 text-gray-500">
                        <p>No life group data available</p>
                    </div>
                    <div slot="footer" class="flex justify-end">
                        <ui-button variant="secondary" data-action="cancel">
                            Close
                        </ui-button>
                    </div>
                </ui-modal>
            `;
        }

        const bannerUrl = this.getImageUrl(lifeGroup.banner);
        const statusColor = this.getStatusBadgeColor(lifeGroup.is_active);
        const statusIcon = this.getStatusIcon(lifeGroup.is_active);
        const statusText = lifeGroup.is_active ? 'Active' : 'Inactive';

        return `
            <ui-modal 
                title="Life Group Details"
                size="lg"
                ${this.hasAttribute('open') ? 'open' : ''}>
                
                <div class="space-y-6">
                    <!-- Banner Image -->
                    ${bannerUrl ? `
                        <div class="text-center">
                            <img src="${bannerUrl}" 
                                 alt="${lifeGroup.title}" 
                                 class="max-w-full h-auto max-h-64 rounded-lg shadow-md mx-auto">
                        </div>
                    ` : ''}

                    <!-- Title and Status -->
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-semibold text-gray-900">${lifeGroup.title}</h3>
                        <ui-badge variant="${statusColor}" class="flex items-center gap-1">
                            <i class="fas ${statusIcon}"></i>
                            ${statusText}
                        </ui-badge>
                    </div>

                    <!-- Slug -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <ui-content-display class="bg-gray-50 p-3 rounded-md">
                            <code class="text-sm text-gray-800">${lifeGroup.slug}</code>
                        </ui-content-display>
                    </div>

                    <!-- Description -->
                    ${lifeGroup.description ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <ui-content-display class="bg-gray-50 p-3 rounded-md">
                                <p class="text-gray-800 whitespace-pre-wrap">${lifeGroup.description}</p>
                            </ui-content-display>
                        </div>
                    ` : ''}

                    <!-- Link -->
                    ${lifeGroup.link ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Link</label>
                            <ui-content-display class="bg-gray-50 p-3 rounded-md">
                                <a href="${lifeGroup.link}" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   class="text-blue-600 hover:text-blue-800 underline">
                                    ${lifeGroup.link}
                                </a>
                            </ui-content-display>
                        </div>
                    ` : ''}

                    <!-- Timestamps -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Created</label>
                            <ui-content-display class="bg-gray-50 p-3 rounded-md">
                                <p class="text-gray-800">${new Date(lifeGroup.created_at).toLocaleString()}</p>
                            </ui-content-display>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                            <ui-content-display class="bg-gray-50 p-3 rounded-md">
                                <p class="text-gray-800">${new Date(lifeGroup.updated_at).toLocaleString()}</p>
                            </ui-content-display>
                        </div>
                    </div>

                    <!-- ID -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ID</label>
                        <ui-content-display class="bg-gray-50 p-3 rounded-md">
                            <code class="text-sm text-gray-800">${lifeGroup.id}</code>
                        </ui-content-display>
                    </div>
                </div>

                <div slot="footer" class="flex justify-end">
                    <ui-button variant="secondary" data-action="cancel">
                        Close
                    </ui-button>
                </div>
            </ui-modal>
        `;
    }
}

customElements.define('life-group-view-modal', LifeGroupViewModal);
export default LifeGroupViewModal; 