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
        this.innerHTML = `
            <ui-modal 
                title="Life Group Details"
                size="lg"
                ${this.hasAttribute('open') ? 'open' : ''}>
                
                <div class="space-y-6">
                    <!-- Title -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <p class="text-gray-900">${lifeGroup ? lifeGroup.title : 'N/A'}</p>
                        </div>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <p class="text-gray-900 whitespace-pre-wrap">${lifeGroup ? lifeGroup.description || 'No description' : 'N/A'}</p>
                        </div>
                    </div>

                    <!-- Link -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Link</label>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            ${lifeGroup && lifeGroup.link ? `
                                <a href="${lifeGroup.link}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">
                                    ${lifeGroup.link}
                                </a>
                            ` : '<p class="text-gray-500">No link provided</p>'}
                        </div>
                    </div>

                    <!-- Banner -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            ${lifeGroup && lifeGroup.banner ? `
                                <img src="/api/uploads/life-groups/${lifeGroup.banner}" 
                                     alt="Life Group Banner" 
                                     class="max-w-full h-auto rounded-lg">
                            ` : '<p class="text-gray-500">No banner image</p>'}
                        </div>
                    </div>

                    <!-- Status -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <ui-badge variant="${lifeGroup && lifeGroup.is_active ? 'success' : 'secondary'}">
                                ${lifeGroup && lifeGroup.is_active ? 'Active' : 'Inactive'}
                            </ui-badge>
                        </div>
                    </div>

                    <!-- Created Date -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Created</label>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <p class="text-gray-900">${lifeGroup && lifeGroup.created_at ? new Date(lifeGroup.created_at).toLocaleString() : 'N/A'}</p>
                        </div>
                    </div>

                    <!-- Updated Date -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <p class="text-gray-900">${lifeGroup && lifeGroup.updated_at ? new Date(lifeGroup.updated_at).toLocaleString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="flex justify-end">
                    <ui-button variant="outline" color="secondary" modal-action="cancel">Close</ui-button>
                </div>
            </ui-modal>
        `;
    }
}

customElements.define('life-group-view-modal', LifeGroupViewModal);
export default LifeGroupViewModal; 