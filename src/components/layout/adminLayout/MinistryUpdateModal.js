import '@/components/ui/Modal.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Input.js';
import '@/components/ui/Button.js';
import api from '@/services/api.js';

/**
 * Ministry Update Modal Component
 * 
 * A modal component for updating existing ministries in the admin panel
 */
class MinistryUpdateModal extends HTMLElement {
    constructor() {
        super();
        this.updateMinistry = this.updateMinistry.bind(this);
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
        this.removeEventListener('confirm', this.updateMinistry);
        this.removeEventListener('cancel', this.close);
    }

    setupEventListeners() {
        // Remove existing listeners first to prevent duplicates
        this.removeEventListener('confirm', this.updateMinistry);
        this.removeEventListener('cancel', this.close);

        this.addEventListener('confirm', this.updateMinistry);
        this.addEventListener('cancel', () => this.close());
    }

    open() {
        this.setAttribute('open', '');
    }

    close() {
        this.removeAttribute('open');
        this.clearForm();
    }

    setMinistryData(ministry) {
        this.ministryData = ministry;
        this.populateForm();
    }

    populateForm() {
        if (!this.ministryData) return;

        const nameInput = this.querySelector('ui-input[data-field="name"]');
        if (nameInput) {
            nameInput.value = this.ministryData.name || '';
        }
    }

    clearForm() {
        const nameInput = this.querySelector('ui-input[data-field="name"]');
        if (nameInput) {
            nameInput.value = '';
        }
        this.ministryData = null;
    }

    async updateMinistry() {
        try {
            if (!this.ministryData || !this.ministryData.id) {
                Toast.show({ 
                    title: 'Error', 
                    message: 'No ministry selected for update', 
                    variant: 'error' 
                });
                return;
            }

            const nameInput = this.querySelector('ui-input[data-field="name"]');

            const ministryData = {
                name: nameInput ? nameInput.value.trim() : ''
            };

            // Validate required fields
            if (!ministryData.name) {
                Toast.show({ 
                    title: 'Validation Error', 
                    message: 'Please enter a ministry name', 
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

            const response = await api.withToken(token).put(`/ministries/${this.ministryData.id}`, ministryData);
            
            Toast.show({ 
                title: 'Success', 
                message: 'Ministry updated successfully', 
                variant: 'success' 
            });

            const updatedMinistry = response.data.data;

            this.dispatchEvent(new CustomEvent('ministry-updated', {
                detail: { ministry: updatedMinistry },
                bubbles: true,
                composed: true
            }));
            this.close();

        } catch (error) {
            console.error('❌ Error updating ministry:', error);
            Toast.show({ 
                title: 'Error', 
                message: error.response?.data?.message || 'Failed to update ministry', 
                variant: 'error' 
            });
        }
    }

    render() {
        this.innerHTML = `
            <ui-modal 
                ${this.hasAttribute('open') ? 'open' : ''} 
                position="right" 
                close-button="true">
                <div slot="title">Update Ministry</div>
                <form id="ministry-update-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Ministry Name</label>
                        <ui-input 
                            data-field="name"
                            type="text" 
                            placeholder="Enter ministry name (e.g., Youth Ministry, Women's Ministry)"
                            class="w-full"
                            required>
                        </ui-input>
                        <p class="text-xs text-gray-500 mt-1">Enter the name of the ministry</p>
                    </div>
                </form>
            </ui-modal>
        `;
    }
}

customElements.define('ministry-update-modal', MinistryUpdateModal);
export default MinistryUpdateModal;
