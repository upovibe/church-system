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
                title="Confirm Delete" 
                position="center"
                variant="danger">
                <div slot="content">
                    <p class="text-gray-700 mb-4">
                        Are you sure you want to delete the ministry "<strong>${ministryName}</strong>"?
                    </p>
                    <p class="text-sm text-gray-500">
                        This action cannot be undone. The ministry will be permanently deleted from the system.
                    </p>
                </div>
            </ui-dialog>
        `;
    }
}

customElements.define('ministry-delete-dialog', MinistryDeleteDialog);
export default MinistryDeleteDialog;
