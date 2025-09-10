import App from '@/core/App.js';
import '@/components/ui/Table.js';
import '@/components/ui/Button.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Skeleton.js';
import '@/components/layout/adminLayout/SermonSettingsModal.js';
import '@/components/layout/adminLayout/SermonUpdateModal.js';
import '@/components/layout/adminLayout/SermonViewModal.js';
import '@/components/layout/adminLayout/SermonDeleteDialog.js';
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

    getHeaderCounts() {
        const sermons = this.get('sermons') || [];
        const total = sermons.length;
        let active = 0;
        let inactive = 0;
        let withAudio = 0;
        let withVideo = 0;
        sermons.forEach((sermon) => {
            const isActive = Number(sermon.is_active) === 1;
            if (isActive) active += 1; else inactive += 1;
            if (sermon.audio_file) withAudio += 1;
            if (sermon.video_url) withVideo += 1;
        });
        return { total, active, inactive, withAudio, withVideo };
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'Sermon Management';
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
            setTimeout(() => {
                const viewModal = this.querySelector('sermon-view-modal');
                if (viewModal) {
                    viewModal.setSermonData(viewSermon);
                    viewModal.open();
                }
            }, 0);
        }
    }

    onEdit(event) {
        const { detail } = event;
        const editSermon = this.get('sermons').find(sermon => sermon.id === detail.row.id);
        if (editSermon) {
            this.closeAllModals();
            this.set('updateSermonData', editSermon);
            this.set('showUpdateModal', true);
            setTimeout(() => {
                const updateModal = this.querySelector('sermon-update-modal');
                if (updateModal) {
                    updateModal.setSermonData(editSermon);
                    updateModal.open();
                }
            }, 0);
        }
    }

    onDelete(event) {
        const { detail } = event;
        const deleteSermon = this.get('sermons').find(sermon => sermon.id === detail.row.id);
        if (deleteSermon) {
            this.closeAllModals();
            this.set('deleteSermonData', deleteSermon);
            this.set('showDeleteDialog', true);
            setTimeout(() => {
                const deleteDialog = this.querySelector('sermon-delete-dialog');
                if (deleteDialog) {
                    deleteDialog.setSermonData(deleteSermon);
                    deleteDialog.open();
                }
            }, 0);
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

    renderHeader() {
        const c = this.getHeaderCounts();
        return `
            <div class="space-y-8 mb-4">
                <div class="bg-slate-700 rounded-xl shadow-lg p-5 text-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                        <div>
                            <div class="flex items-center gap-2">
                                <h1 class="text-2xl sm:text-3xl font-bold">Sermons</h1>
                                <button 
                                    onclick="this.closest('app-sermons-page').loadData()"
                                    class="size-8 mt-2 flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg group"
                                    title="Refresh data">
                                    <i class="fas fa-sync-alt text-lg ${this.get('loading') ? 'animate-spin' : ''} group-hover:scale-110 transition-transform duration-200"></i>
                                </button>
                            </div>
                            <p class="text-blue-100 text-base sm:text-lg">Manage sermons and preaching content</p>
                        </div>
                        <div class="mt-4 sm:mt-0">
                            <div class="text-right">
                                <div class="text-xl sm:text-2xl font-bold">${c.total}</div>
                                <div class="text-blue-100 text-xs sm:text-sm">Total Sermons</div>
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
                                    <i class="fas fa-volume-up text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.withAudio}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">With Audio</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-purple-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-video text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.withVideo}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">With Video</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-orange-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-bible text-white text-lg sm:text-xl"></i>
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
            ${this.renderHeader()}
            
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
                        <ui-table 
                            title="Sermon Management"
                            data='${JSON.stringify(tableData)}'
                            columns='${JSON.stringify(tableColumns)}'
                            sortable
                            searchable
                            search-placeholder="Search sermons..."
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
            <sermon-settings-modal ${showAddModal ? 'open' : ''}></sermon-settings-modal>
            <sermon-update-modal ${showUpdateModal ? 'open' : ''}></sermon-update-modal>
            <sermon-view-modal id="view-modal" ${showViewModal ? 'open' : ''}></sermon-view-modal>
            <sermon-delete-dialog ${showDeleteDialog ? 'open' : ''}></sermon-delete-dialog>
        `;
    }
}

customElements.define('app-sermons-page', SermonsPage);
export default SermonsPage; 