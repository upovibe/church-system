import '@/components/ui/Dialog.js';
import '@/components/ui/Toast.js';
import api from '@/services/api.js';

/**
 * Life Group Delete Dialog Component
 * 
 * A dialog component for confirming life group deletion in the admin panel
 * 
 * Attributes:
 * - open: boolean - controls dialog visibility
 * 
 * Events:
 * - life-group-deleted: Fired when a life group is successfully deleted
 * - modal-closed: Fired when dialog is closed
 */
class LifeGroupDeleteDialog extends HTMLElement {
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
        // Listen for confirm button click (Delete Life Group)
        this.addEventListener('confirm', () => {
            this.deleteLifeGroup();
        });

        // Listen for cancel button click
        this.addEventListener('cancel', () => {
            this.close();
        });
    }

    open() {
        this.setAttribute('open', '');
    }

    close() {
        this.removeAttribute('open');
    }

    // Set life group data for deletion
    setLifeGroupData(lifeGroupData) {
        this.lifeGroupData = lifeGroupData;
        this.populateDialog();
    }

    // Populate dialog with life group data
    populateDialog() {
        if (!this.lifeGroupData) return;

        const lifeGroupTitleElement = this.querySelector('#life-group-title');
        const lifeGroupSlugElement = this.querySelector('#life-group-slug');
        const lifeGroupStatusElement = this.querySelector('#life-group-status');

        if (lifeGroupTitleElement) lifeGroupTitleElement.textContent = this.lifeGroupData.title || 'Unknown Life Group';
        if (lifeGroupSlugElement) lifeGroupSlugElement.textContent = this.lifeGroupData.slug || 'N/A';
        if (lifeGroupStatusElement) {
            const status = this.lifeGroupData.is_active ? 'Active' : 'Inactive';
            lifeGroupStatusElement.textContent = status;
        }
    }

    // Delete the life group
    async deleteLifeGroup() {
        try {
            if (!this.lifeGroupData) {
                Toast.show({
                    title: 'Error',
                    message: 'No life group data available for deletion',
                    variant: 'error',
                    duration: 3000
                });
                return;
            }

            // Get the auth token
            const token = localStorage.getItem('token');
            if (!token) {
                Toast.show({
                    title: 'Authentication Error',
                    message: 'Please log in to delete life groups',
                    variant: 'error',
                    duration: 3000
                });
                return;
            }

            // Delete the life group
            const response = await api.withToken(token).delete(`/life-groups/${this.lifeGroupData.id}`);

            if (response.data.success) {
                Toast.show({
                    title: 'Success',
                    message: 'Life group deleted successfully',
                    variant: 'success',
                    duration: 3000
                });

                // Dispatch event with the deleted life group ID
                this.dispatchEvent(new CustomEvent('life-group-deleted', {
                    detail: { lifeGroupId: this.lifeGroupData.id },
                    bubbles: true
                }));

                // Close the dialog
                this.close();
            } else {
                Toast.show({
                    title: 'Error',
                    message: response.data.message || 'Failed to delete life group',
                    variant: 'error',
                    duration: 3000
                });
            }

        } catch (error) {
            console.error('❌ Error deleting life group:', error);
            
            Toast.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to delete life group',
                variant: 'error',
                duration: 3000
            });
        }
    }

    render() {
        this.innerHTML = `
            <ui-dialog 
                title="Delete Life Group"
                variant="danger"
                ${this.hasAttribute('open') ? 'open' : ''}>
                
                <div class="space-y-4">
                    <div class="text-center">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">
                            Are you sure you want to delete this life group?
                        </h3>
                        <p class="text-sm text-gray-500 mb-4">
                            This action cannot be undone. This will permanently delete the life group and remove all associated data.
                        </p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-700">Title:</span>
                            <span id="life-group-title" class="text-sm text-gray-900">-</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-700">Slug:</span>
                            <span id="life-group-slug" class="text-sm text-gray-900">-</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-700">Status:</span>
                            <span id="life-group-status" class="text-sm text-gray-900">-</span>
                        </div>
                    </div>
                </div>

                <div slot="footer" class="flex justify-end space-x-3">
                    <button type="button" data-action="cancel" class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
                    <button type="button" data-action="confirm" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400">Delete Life Group</button>
                </div>
            </ui-dialog>
        `;
    }
}

customElements.define('life-group-delete-dialog', LifeGroupDeleteDialog);
export default LifeGroupDeleteDialog; 