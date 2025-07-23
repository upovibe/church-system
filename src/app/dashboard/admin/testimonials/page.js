import App from '@/core/App.js';
import '@/components/ui/Card.js';
import '@/components/ui/Button.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Table.js';
import '@/components/ui/Skeleton.js';
import '@/components/ui/Dialog.js';
// You would create these modal components similar to the user role modals
import '@/components/layout/adminLayout/TestimonialSettingsModal.js';
import '@/components/layout/adminLayout/TestimonialUpdateModal.js';
import '@/components/layout/adminLayout/TestimonialViewModal.js';
import '@/components/layout/adminLayout/TestimonialDeleteDialog.js';
import api from '@/services/api.js';

/**
 * Admin Testimonials Page
 *
 * Displays testimonials data using Table component
 */
class TestimonialsPage extends App {
    constructor() {
        super();
        this.testimonials = null;
        this.loading = false;
        this.showAddModal = false;
        this.showUpdateModal = false;
        this.showViewModal = false;
        this.showDeleteDialog = false;
        this.updateTestimonialData = null;
        this.viewTestimonialData = null;
        this.deleteTestimonialData = null;
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'Testimonials | Admin';
        this.loadData();

        this.addEventListener('table-view', this.onView.bind(this));
        this.addEventListener('table-edit', this.onEdit.bind(this));
        this.addEventListener('table-delete', this.onDelete.bind(this));
        this.addEventListener('table-add', this.onAdd.bind(this));

        this.addEventListener('testimonial-deleted', (event) => {
            const deletedId = event.detail.testimonialId;
            const current = this.get('testimonials') || [];
            const updated = current.filter(t => t.id !== deletedId);
            this.set('testimonials', updated);
            this.updateTableData();
            this.set('showDeleteDialog', false);
        });

        this.addEventListener('testimonial-saved', (event) => {
            const newTestimonial = event.detail.testimonial;
            if (newTestimonial) {
                const current = this.get('testimonials') || [];
                this.set('testimonials', [...current, newTestimonial]);
                this.updateTableData();
                this.set('showAddModal', false);
            } else {
                this.loadData();
            }
        });

        this.addEventListener('testimonial-updated', (event) => {
            const updatedTestimonial = event.detail.testimonial;
            if (updatedTestimonial) {
                const current = this.get('testimonials') || [];
                const updated = current.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t);
                this.set('testimonials', updated);
                this.updateTableData();
                this.set('showUpdateModal', false);
            } else {
                this.loadData();
            }
        });

        this.addEventListener('modal-opened', (event) => {
            const modal = event.target;
            if (modal.tagName === 'TESTIMONIAL-UPDATE-MODAL') {
                const updateData = this.get('updateTestimonialData');
                if (updateData) modal.setTestimonialData(updateData);
            } else if (modal.tagName === 'TESTIMONIAL-VIEW-MODAL') {
                const viewData = this.get('viewTestimonialData');
                if (viewData) modal.setTestimonialData(viewData);
            }
        });
    }

    async loadData() {
        try {
            this.set('loading', true);
            const token = localStorage.getItem('token');
            if (!token) {
                Toast.show({ title: 'Authentication Error', message: 'Please log in to view data', variant: 'error', duration: 3000 });
                return;
            }
            const response = await api.withToken(token).get('/testimonials');
            this.set('testimonials', response.data.data);
            this.set('loading', false);
        } catch (error) {
            console.error('❌ Error loading testimonials:', error);
            this.set('loading', false);
            Toast.show({ title: 'Error', message: error.response?.data?.message || 'Failed to load testimonials', variant: 'error', duration: 3000 });
        }
    }

    onView(event) {
        const { detail } = event;
        const viewData = this.get('testimonials').find(t => t.id === detail.row.id);
        if (viewData) {
            this.closeAllModals();
            this.set('viewTestimonialData', viewData);
            this.set('showViewModal', true);
            setTimeout(() => {
                const viewModal = this.querySelector('testimonial-view-modal');
                if (viewModal) viewModal.setTestimonialData(viewData);
            }, 0);
        }
    }

    onEdit(event) {
        const { detail } = event;
        const editData = this.get('testimonials').find(t => t.id === detail.row.id);
        if (editData) {
            this.closeAllModals();
            this.set('updateTestimonialData', editData);
            this.set('showUpdateModal', true);
            setTimeout(() => {
                const updateModal = this.querySelector('testimonial-update-modal');
                if (updateModal) updateModal.setTestimonialData(editData);
            }, 0);
        }
    }

    onDelete(event) {
        const { detail } = event;
        const deleteData = this.get('testimonials').find(t => t.id === detail.row.id);
        if (deleteData) {
            this.closeAllModals();
            this.set('deleteTestimonialData', deleteData);
            this.set('showDeleteDialog', true);
            setTimeout(() => {
                const deleteDialog = this.querySelector('testimonial-delete-dialog');
                if (deleteDialog) deleteDialog.setTestimonialData(deleteData);
            }, 0);
        }
    }

    onAdd(event) {
        this.closeAllModals();
        this.set('showAddModal', true);
    }

    updateTableData() {
        const testimonials = this.get('testimonials');
        if (!testimonials) return;
        const tableData = testimonials.map((t, index) => ({
            id: t.id,
            index: index + 1,
            title: t.title,
            description: t.description,
            created: new Date(t.created_at).toLocaleString(),
            updated: new Date(t.updated_at).toLocaleString(),
        }));
        const tableComponent = this.querySelector('ui-table');
        if (tableComponent) {
            tableComponent.setAttribute('data', JSON.stringify(tableData));
        }
    }

    closeAllModals() {
        this.set('showAddModal', false);
        this.set('showUpdateModal', false);
        this.set('showViewModal', false);
        this.set('showDeleteDialog', false);
        this.set('updateTestimonialData', null);
        this.set('viewTestimonialData', null);
        this.set('deleteTestimonialData', null);
    }

    render() {
        const testimonials = this.get('testimonials');
        const loading = this.get('loading');
        const showAddModal = this.get('showAddModal');
        const showUpdateModal = this.get('showUpdateModal');
        const showViewModal = this.get('showViewModal');
        const showDeleteDialog = this.get('showDeleteDialog');

        const tableData = testimonials ? testimonials.map((t, index) => ({
            id: t.id,
            index: index + 1,
            title: t.title,
            description: t.description,
            created: new Date(t.created_at).toLocaleString(),
            updated: new Date(t.updated_at).toLocaleString(),
        })) : [];

        const tableColumns = [
            { key: 'index', label: 'No.', html: false },
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description' },
            { key: 'created', label: 'Created' },
            { key: 'updated', label: 'Updated' }
        ];

        return `
            <div class="bg-white rounded-lg shadow-lg p-4">
                ${loading ? `
                    <div class="space-y-4">
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                    </div>
                ` : `
                    <div class="mb-8">
                        ${testimonials && testimonials.length > 0 ? `
                            <ui-table 
                                title="Testimonials"
                                data='${JSON.stringify(tableData)}'
                                columns='${JSON.stringify(tableColumns)}'
                                sortable
                                searchable
                                search-placeholder="Search testimonials..."
                                pagination
                                page-size="10"
                                action
                                addable
                                refresh
                                print
                                bordered
                                striped
                                class="w-full">
                            </ui-table>
                        ` : `
                            <div class="text-center py-8 text-gray-500">
                                <p>No testimonials found in database</p>
                            </div>
                        `}
                    </div>
                `}
            </div>
            <!-- Modals and Dialogs -->
            <testimonial-settings-modal ${showAddModal ? 'open' : ''}></testimonial-settings-modal>
            <testimonial-update-modal ${showUpdateModal ? 'open' : ''}></testimonial-update-modal>
            <testimonial-view-modal id="view-modal" ${showViewModal ? 'open' : ''}></testimonial-view-modal>
            <testimonial-delete-dialog ${showDeleteDialog ? 'open' : ''}></testimonial-delete-dialog>
        `;
    }
}

customElements.define('app-testimonials-page', TestimonialsPage);
export default TestimonialsPage; 