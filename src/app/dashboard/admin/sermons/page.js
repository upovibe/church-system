import App from '@/core/App.js';
import '@/components/ui/Table.js';
import '@/components/ui/Button.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Skeleton.js';
// Placeholders for modals/dialogs (to be implemented)
// import '@/components/layout/adminLayout/SermonSettingsModal.js';
// import '@/components/layout/adminLayout/SermonUpdateModal.js';
// import '@/components/layout/adminLayout/SermonViewModal.js';
// import '@/components/layout/adminLayout/SermonDeleteDialog.js';
import api from '@/services/api.js';

/**
 * Sermons Management Page
 *
 * Displays sermon data using Table component
 */
class SermonsPage extends App {
    constructor() {
        super();
        this.sermons = null;
        this.loading = true;
        this.showAddModal = false;
        this.showUpdateModal = false;
        this.showViewModal = false;
        this.showDeleteDialog = false;
        this.updateSermonData = null;
        this.viewSermonData = null;
        this.deleteSermonData = null;

        // Initialize state
        this.set('sermons', null);
        this.set('loading', true);
        this.set('showAddModal', false);
        this.set('showUpdateModal', false);
        this.set('showViewModal', false);
        this.set('showDeleteDialog', false);
        this.set('updateSermonData', null);
        this.set('viewSermonData', null);
        this.set('deleteSermonData', null);
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'Sermon Management | School System';
        this.loadData();

        // Add event listeners for table actions
        this.addEventListener('table-view', this.onView.bind(this));
        this.addEventListener('table-edit', this.onEdit.bind(this));
        this.addEventListener('table-delete', this.onDelete.bind(this));
        this.addEventListener('table-add', this.onAdd.bind(this));

        // Listen for success events to refresh data
        this.addEventListener('sermon-deleted', (event) => {
            const deletedSermonId = event.detail.sermonId;
            const currentSermons = this.get('sermons') || [];
            const updatedSermons = currentSermons.filter(sermon => sermon.id !== deletedSermonId);
            this.set('sermons', updatedSermons);
            this.updateTableData();
            this.set('showDeleteDialog', false);
        });
        this.addEventListener('sermon-saved', (event) => {
            const newSermon = event.detail.sermon;
            if (newSermon) {
                const currentSermons = this.get('sermons') || [];
                this.set('sermons', [...currentSermons, newSermon]);
                this.updateTableData();
                this.set('showAddModal', false);
            } else {
                this.loadData();
            }
        });
        this.addEventListener('sermon-updated', (event) => {
            const updatedSermon = event.detail.sermon;
            if (updatedSermon) {
                const currentSermons = this.get('sermons') || [];
                const updatedSermonsList = currentSermons.map(sermon => sermon.id === updatedSermon.id ? updatedSermon : sermon);
                this.set('sermons', updatedSermonsList);
                this.updateTableData();
                this.set('showUpdateModal', false);
            } else {
                this.loadData();
            }
        });
        this.addEventListener('sermon-image-deleted', (event) => {
            const updatedSermon = event.detail.sermon;
            if (updatedSermon) {
                const currentSermons = this.get('sermons') || [];
                const updatedSermonsList = currentSermons.map(sermon => sermon.id === updatedSermon.id ? updatedSermon : sermon);
                this.set('sermons', updatedSermonsList);
                this.updateTableData();
                if (this.get('showViewModal')) {
                    this.set('viewSermonData', updatedSermon);
                    // Update modal if needed
                }
            } else {
                this.loadData();
            }
        });
        this.addEventListener('sermon-audio-deleted', (event) => {
            const updatedSermon = event.detail.sermon;
            if (updatedSermon) {
                const currentSermons = this.get('sermons') || [];
                const updatedSermonsList = currentSermons.map(sermon => sermon.id === updatedSermon.id ? updatedSermon : sermon);
                this.set('sermons', updatedSermonsList);
                this.updateTableData();
                if (this.get('showViewModal')) {
                    this.set('viewSermonData', updatedSermon);
                }
            } else {
                this.loadData();
            }
        });
        this.addEventListener('sermon-video-deleted', (event) => {
            const updatedSermon = event.detail.sermon;
            if (updatedSermon) {
                const currentSermons = this.get('sermons') || [];
                const updatedSermonsList = currentSermons.map(sermon => sermon.id === updatedSermon.id ? updatedSermon : sermon);
                this.set('sermons', updatedSermonsList);
                this.updateTableData();
                if (this.get('showViewModal')) {
                    this.set('viewSermonData', updatedSermon);
                }
            } else {
                this.loadData();
            }
        });
    }

    async loadData() {
        try {
            this.set('loading', true);
            const token = localStorage.getItem('token');
            if (!token) {
                Toast.show({
                    title: 'Authentication Error',
                    message: 'Please log in to view data',
                    variant: 'error',
                    duration: 3000
                });
                return;
            }
            const sermonsResponse = await api.withToken(token).get('/sermons');
            this.set('sermons', sermonsResponse.data.data);
        } catch (error) {
            console.error('❌ Error loading sermons:', error);
            Toast.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to load sermons data',
                variant: 'error',
                duration: 3000
            });
        } finally {
            this.set('loading', false);
        }
    }

    onView(event) {
        const { detail } = event;
        const viewSermon = this.get('sermons').find(sermon => sermon.id === detail.row.id);
        if (viewSermon) {
            this.closeAllModals();
            this.set('viewSermonData', viewSermon);
            this.set('showViewModal', true);
            // setTimeout for modal data if needed
        }
    }

    onEdit(event) {
        const { detail } = event;
        const editSermon = this.get('sermons').find(sermon => sermon.id === detail.row.id);
        if (editSermon) {
            this.closeAllModals();
            this.set('updateSermonData', editSermon);
            this.set('showUpdateModal', true);
            // setTimeout for modal data if needed
        }
    }

    onDelete(event) {
        const { detail } = event;
        const deleteSermon = this.get('sermons').find(sermon => sermon.id === detail.row.id);
        if (deleteSermon) {
            this.closeAllModals();
            this.set('deleteSermonData', deleteSermon);
            this.set('showDeleteDialog', true);
            // setTimeout for modal data if needed
        }
    }

    onAdd(event) {
        this.closeAllModals();
        this.set('showAddModal', true);
    }

    onRefresh(event) {
        this.loadData();
    }

    updateTableData() {
        const sermons = this.get('sermons');
        if (sermons) {
            const tableData = sermons.map((sermon, index) => ({
                id: sermon.id,
                index: index + 1,
                title: sermon.title,
                speaker: sermon.speaker,
                date_preached: sermon.date_preached,
                images_count: sermon.images ? sermon.images.length : 0,
                audio_count: sermon.audio_links ? sermon.audio_links.length : 0,
                videos_count: sermon.video_links ? sermon.video_links.length : 0,
                status: sermon.is_active ? 'Active' : 'Inactive',
                updated: new Date(sermon.updated_at).toLocaleString(),
            }));
            const tableComponent = this.querySelector('ui-table');
            if (tableComponent) {
                tableComponent.setAttribute('data', JSON.stringify(tableData));
            }
        }
    }

    closeAllModals() {
        this.set('showAddModal', false);
        this.set('showUpdateModal', false);
        this.set('showViewModal', false);
        this.set('showDeleteDialog', false);
        this.set('updateSermonData', null);
        this.set('viewSermonData', null);
        this.set('deleteSermonData', null);
    }

    render() {
        const sermons = this.get('sermons');
        const loading = this.get('loading');
        const showAddModal = this.get('showAddModal');
        const showUpdateModal = this.get('showUpdateModal');
        const showViewModal = this.get('showViewModal');
        const showDeleteDialog = this.get('showDeleteDialog');

        const tableData = sermons ? sermons.map((sermon, index) => ({
            id: sermon.id,
            index: index + 1,
            title: sermon.title,
            speaker: sermon.speaker,
            date_preached: sermon.date_preached,
            images_count: sermon.images ? sermon.images.length : 0,
            audio_count: sermon.audio_links ? sermon.audio_links.length : 0,
            videos_count: sermon.video_links ? sermon.video_links.length : 0,
            status: sermon.is_active ? 'Active' : 'Inactive',
            updated: new Date(sermon.updated_at).toLocaleString(),
        })) : [];

        const tableColumns = [
            { key: 'index', label: 'No.' },
            { key: 'title', label: 'Title' },
            { key: 'speaker', label: 'Speaker' },
            { key: 'date_preached', label: 'Date Preached' },
            { key: 'images_count', label: 'Images' },
            { key: 'audio_count', label: 'Audio' },
            { key: 'videos_count', label: 'Videos' },
            { key: 'status', label: 'Status' },
            { key: 'updated', label: 'Updated' }
        ];

        return `
            <div class="bg-white rounded-lg shadow-lg p-4">
                ${loading ? `
                    <!-- Sermons Skeleton Loading -->
                    <div class="space-y-4">
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                    </div>
                ` : `
                    <!-- Sermons Table Section -->
                    <div class="mb-8">
                        ${sermons && sermons.length > 0 ? `
                            <ui-table 
                                title="Sermon Management"
                                data='${JSON.stringify(tableData)}'
                                columns='${JSON.stringify(tableColumns)}'
                                sortable
                                searchable
                                search-placeholder="Search sermons..."
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
                                <p>No sermons found in database</p>
                            </div>
                        `}
                    </div>
                `}
            </div>
            <!-- Modals and Dialogs (to be implemented) -->
            <!--
            <sermon-settings-modal ${showAddModal ? 'open' : ''}></sermon-settings-modal>
            <sermon-update-modal ${showUpdateModal ? 'open' : ''}></sermon-update-modal>
            <sermon-view-modal id="view-modal" ${showViewModal ? 'open' : ''}></sermon-view-modal>
            <sermon-delete-dialog ${showDeleteDialog ? 'open' : ''}></sermon-delete-dialog>
            -->
        `;
    }
}

customElements.define('app-sermons-page', SermonsPage);
export default SermonsPage; 