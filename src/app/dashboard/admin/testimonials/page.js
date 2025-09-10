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

    getHeaderCounts() {
        const testimonials = this.get('testimonials') || [];
        const total = testimonials.length;
        let active = 0;
        let inactive = 0;
        let withImages = 0;
        let featured = 0;
        testimonials.forEach((testimonial) => {
            const isActive = Number(testimonial.is_active) === 1;
            if (isActive) active += 1; else inactive += 1;
            if (testimonial.image) withImages += 1;
            if (Number(testimonial.is_featured) === 1) featured += 1;
        });
        return { total, active, inactive, withImages, featured };
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'Testimonials';
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

    renderHeader() {
        const c = this.getHeaderCounts();
        return `
            <div class="space-y-8 mb-4">
                <div class="bg-slate-700 rounded-xl shadow-lg p-5 text-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                        <div>
                            <div class="flex items-center gap-2">
                                <h1 class="text-2xl sm:text-3xl font-bold">Testimonials</h1>
                                <button 
                                    onclick="this.closest('app-testimonials-page').loadData()"
                                    class="size-8 mt-2 flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg group"
                                    title="Refresh data">
                                    <i class="fas fa-sync-alt text-lg ${this.get('loading') ? 'animate-spin' : ''} group-hover:scale-110 transition-transform duration-200"></i>
                                </button>
                            </div>
                            <p class="text-blue-100 text-base sm:text-lg">Manage member testimonials and stories</p>
                        </div>
                        <div class="mt-4 sm:mt-0">
                            <div class="text-right">
                                <div class="text-xl sm:text-2xl font-bold">${c.total}</div>
                                <div class="text-blue-100 text-xs sm:text-sm">Total Testimonials</div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-green-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-check text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.active}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">Active</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-yellow-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-pause-circle text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.inactive}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">Inactive</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-blue-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-image text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.withImages}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">With Images</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-purple-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-star text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.featured}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">Featured</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-orange-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-quote-left text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.total}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">Total</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
            ${this.renderHeader()}
            
            <div class="bg-white rounded-lg shadow-lg p-4">
                ${loading ? `
                    <div class="space-y-4">
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                    </div>
                ` : `
                    <div class="mb-8">
                        <ui-table 
                            title="Testimonials"
                            data='${JSON.stringify(tableData)}'
                            columns='${JSON.stringify(tableColumns)}'
                            sortable
                            searchable
                            search-placeholder="Search testimonials..."
                            pagination
                            page-size="50"
                            action
                            addable
                            refresh
                            print
                            bordered
                            striped
                            class="w-full">
                        </ui-table>
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