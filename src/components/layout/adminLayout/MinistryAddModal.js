import '@/components/ui/Modal.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Input.js';
import '@/components/ui/Button.js';
import api from '@/services/api.js';

/**
 * Ministry Add Modal Component
 * 
 * A modal component for adding new ministries in the admin panel
 */
class MinistryAddModal extends HTMLElement {
    constructor() {
        super();
        this.saveMinistry = this.saveMinistry.bind(this);
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
        this.removeEventListener('confirm', this.saveMinistry);
        this.removeEventListener('cancel', this.close);
    }

    setupEventListeners() {
        // Remove existing listeners first to prevent duplicates
        this.removeEventListener('confirm', this.saveMinistry);
        this.removeEventListener('cancel', this.close);

        this.addEventListener('confirm', this.saveMinistry);
        this.addEventListener('cancel', () => this.close());
    }

    open() {
        this.setAttribute('open', '');
    }

    close() {
        this.removeAttribute('open');
        this.clearForm();
    }

    clearForm() {
        const nameInput = this.querySelector('ui-input[data-field="name"]');
        if (nameInput) {
            nameInput.value = '';
        }
    }

    async saveMinistry() {
        try {
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

            const response = await api.withToken(token).post('/ministries', ministryData);
            
            Toast.show({ 
                title: 'Success', 
                message: 'Ministry created successfully', 
                variant: 'success' 
            });

            const newMinistry = response.data.data;
            console.log('Ministry created successfully:', newMinistry);

            this.dispatchEvent(new CustomEvent('ministry-saved', {
                detail: { ministry: newMinistry },
                bubbles: true,
                composed: true
            }));
            console.log('Ministry saved event dispatched');
            this.close();

        } catch (error) {
            console.error('❌ Error saving ministry:', error);
            Toast.show({ 
                title: 'Error', 
                message: error.response?.data?.message || 'Failed to create ministry', 
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
                <div slot="title">Add New Ministry</div>
                <form id="ministry-form" class="space-y-4">
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

customElements.define('ministry-add-modal', MinistryAddModal);
export default MinistryAddModal;
