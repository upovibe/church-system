import '@/components/ui/Modal.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Input.js';
import '@/components/ui/Textarea.js';
import '@/components/ui/Switch.js';
import '@/components/ui/FileUpload.js';
import api from '@/services/api.js';

/**
 * Life Group Update Modal Component
 * 
 * A modal component for updating existing life groups in the admin panel
 * 
 * Attributes:
 * - open: boolean - controls modal visibility
 * 
 * Events:
 * - life-group-updated: Fired when a life group is successfully updated
 * - modal-closed: Fired when modal is closed
 */
class LifeGroupUpdateModal extends HTMLElement {
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
        // Listen for confirm button click (Update Life Group)
        this.addEventListener('confirm', () => {
            this.updateLifeGroup();
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

    // Set life group data for editing
    setLifeGroupData(lifeGroupData) {
        this.lifeGroupData = lifeGroupData;
        // Re-render the modal with the new data
        this.render();
        
        // Set the banner value in the file upload component after render
        setTimeout(() => {
            const bannerFileUpload = this.querySelector('ui-file-upload[data-field="banner"]');
            if (bannerFileUpload && lifeGroupData.banner) {
                bannerFileUpload.setValue(lifeGroupData.banner);
            }
        }, 0); // Increased timeout to ensure DOM is ready
    }

    // Update the life group
    async updateLifeGroup() {
        try {
            // Get form data using the data-field attributes for reliable selection
            const titleInput = this.querySelector('ui-input[data-field="title"]');
            const descriptionTextarea = this.querySelector('ui-textarea[data-field="description"]');
            const linkInput = this.querySelector('ui-input[data-field="link"]');
            const isActiveSwitch = this.querySelector('ui-switch[name="is_active"]');
            const bannerFileUpload = this.querySelector('ui-file-upload[data-field="banner"]');

            const lifeGroupData = {
                title: titleInput ? titleInput.value : '',
                description: descriptionTextarea ? descriptionTextarea.value : '',
                link: linkInput ? linkInput.value : '',
                is_active: isActiveSwitch ? (isActiveSwitch.checked ? 1 : 0) : 1
            };

            // Validate required fields
            if (!lifeGroupData.title) {
                Toast.show({
                    title: 'Validation Error',
                    message: 'Please fill in the life group title',
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
                    message: 'Please log in to update life groups',
                    variant: 'error',
                    duration: 3000
                });
                return;
            }

            // Prepare form data for file upload
            const formData = new FormData();
            
            // Add text fields
            Object.keys(lifeGroupData).forEach(key => {
                formData.append(key, lifeGroupData[key]);
            });

            // Add banner file if selected
            if (bannerFileUpload && bannerFileUpload.files && bannerFileUpload.files.length > 0) {
                formData.append('banner', bannerFileUpload.files[0]);
            }

            // Update the life group
            const response = await api.withToken(token).put(`/life-groups/${this.lifeGroupData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                Toast.show({
                    title: 'Success',
                    message: 'Life group updated successfully',
                    variant: 'success',
                    duration: 3000
                });

                // Dispatch event with the updated life group data
                this.dispatchEvent(new CustomEvent('life-group-updated', {
                    detail: { lifeGroup: response.data.data },
                    bubbles: true
                }));

                // Close the modal
                this.close();
            } else {
                Toast.show({
                    title: 'Error',
                    message: response.data.message || 'Failed to update life group',
                    variant: 'error',
                    duration: 3000
                });
            }

        } catch (error) {
            console.error('❌ Error updating life group:', error);
            
            Toast.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update life group',
                variant: 'error',
                duration: 3000
            });
        }
    }

    render() {
        const lifeGroup = this.lifeGroupData;
        
        return `
            <ui-modal 
                title="Update Life Group"
                size="lg"
                ${this.hasAttribute('open') ? 'open' : ''}>
                
                <div class="space-y-6">
                    <!-- Title -->
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                            Title <span class="text-red-500">*</span>
                        </label>
                        <ui-input
                            data-field="title"
                            type="text"
                            placeholder="Enter life group title"
                            value="${lifeGroup ? lifeGroup.title : ''}"
                            required>
                        </ui-input>
                    </div>

                    <!-- Description -->
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <ui-textarea
                            data-field="description"
                            placeholder="Enter life group description"
                            rows="4">${lifeGroup ? lifeGroup.description || '' : ''}</ui-textarea>
                    </div>

                    <!-- Link -->
                    <div>
                        <label for="link" class="block text-sm font-medium text-gray-700 mb-2">
                            Link
                        </label>
                        <ui-input
                            data-field="link"
                            type="url"
                            placeholder="https://example.com"
                            value="${lifeGroup ? lifeGroup.link || '' : ''}">
                        </ui-input>
                    </div>

                    <!-- Banner Upload -->
                    <div>
                        <label for="banner" class="block text-sm font-medium text-gray-700 mb-2">
                            Banner Image
                        </label>
                        <ui-file-upload
                            data-field="banner"
                            accept="image/*"
                            max-size="5MB"
                            placeholder="Upload banner image">
                        </ui-file-upload>
                        ${lifeGroup && lifeGroup.banner ? `
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">Current banner: ${lifeGroup.banner}</p>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Active Status -->
                    <div>
                        <label class="flex items-center">
                            <ui-switch name="is_active" ${lifeGroup && lifeGroup.is_active ? 'checked' : ''}></ui-switch>
                            <span class="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                    </div>
                </div>

                <div slot="footer" class="flex justify-end space-x-3">
                    <ui-button variant="secondary" data-action="cancel">
                        Cancel
                    </ui-button>
                    <ui-button variant="primary" data-action="confirm">
                        Update Life Group
                    </ui-button>
                </div>
            </ui-modal>
        `;
    }
}

customElements.define('life-group-update-modal', LifeGroupUpdateModal);
export default LifeGroupUpdateModal; 