import '@/components/ui/Dialog.js';
import '@/components/ui/Toast.js';
import api from '@/services/api.js';

/**
 * Ministry Delete Dialog Component
 * 
 * A dialog component for confirming ministry deletion in the admin panel
 */
class MinistryDeleteDialog extends HTMLElement {
    constructor() {
        super();
        this.deleteMinistry = this.deleteMinistry.bind(this);
        this.ministryData = null;
    }

    static get observedAttributes() {
        return ['open'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        // Clean up event listeners to prevent duplicates
        this.removeEventListener('confirm', this.deleteMinistry);
        this.removeEventListener('cancel', this.close);
    }

    setupEventListeners() {
        // Remove existing listeners first to prevent duplicates
        this.removeEventListener('confirm', this.deleteMinistry);
        this.removeEventListener('cancel', this.close);

        this.addEventListener('confirm', this.deleteMinistry);
        this.addEventListener('cancel', () => this.close());
    }

    open() {
        this.setAttribute('open', '');
    }

    close() {
        this.removeAttribute('open');
        this.ministryData = null;
    }

    setMinistryData(ministry) {
        this.ministryData = ministry;
        this.render(); // Re-render to update the ministry name
    }

    async deleteMinistry() {
        try {
            if (!this.ministryData || !this.ministryData.id) {
                Toast.show({ 
                    title: 'Error', 
                    message: 'No ministry selected for deletion', 
                    variant: 'error' 
                });
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                Toast.show({ 
                    title: 'Authentication Error', 
                    message: 'Please log in', 
                    variant: 'error' 
                });
                return;
            }

            await api.withToken(token).delete(`/ministries/${this.ministryData.id}`);
            
            Toast.show({ 
                title: 'Success', 
                message: 'Ministry deleted successfully', 
                variant: 'success' 
            });

            this.dispatchEvent(new CustomEvent('ministry-deleted', {
                detail: { ministryId: this.ministryData.id },
                bubbles: true,
                composed: true
            }));
            this.close();

        } catch (error) {
            console.error('❌ Error deleting ministry:', error);
            Toast.show({ 
                title: 'Error', 
                message: error.response?.data?.message || 'Failed to delete ministry', 
                variant: 'error' 
            });
        }
    }

    render() {
        const ministryName = this.ministryData ? this.ministryData.name : '';
        
        this.innerHTML = `
            <ui-dialog 
                ${this.hasAttribute('open') ? 'open' : ''} 
                title="Delete Ministry" 
                position="center"
                variant="danger">
                <div slot="content">
                    <div class="space-y-4">
                        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div class="flex items-start">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-exclamation-triangle text-red-400 text-xl"></i>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-red-800">
                                        Are you sure you want to delete this ministry?
                                    </h3>
                                    <div class="mt-2 text-sm text-red-700">
                                        <p>This action cannot be undone. The ministry will be permanently removed from the system.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-church text-gray-400 text-lg"></i>
                                </div>
                                <div class="ml-3">
                                    <h4 class="text-sm font-medium text-gray-900">Ministry to be deleted:</h4>
                                    <p class="text-sm text-gray-600 font-semibold">${ministryName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-dialog>
        `;
    }
}

customElements.define('ministry-delete-dialog', MinistryDeleteDialog);
export default MinistryDeleteDialog;
