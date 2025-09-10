import App from '@/core/App.js';
import '@/components/ui/Table.js';
import '@/components/ui/Button.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Skeleton.js';
import '@/components/layout/adminLayout/GiveSettingsModal.js';
import '@/components/layout/adminLayout/GiveUpdateModal.js';
import '@/components/layout/adminLayout/GiveViewModal.js';
import '@/components/layout/adminLayout/GiveDeleteDialog.js';
import api from '@/services/api.js';

/**
 * Give Management Page
 * 
 * Dedicated page for managing give entries (payment methods)
 */
class GivePage extends App {
    constructor() {
        super();
        this.giveEntries = null;
        this.loading = true;
        this.showAddModal = false;
        this.showUpdateModal = false;
        this.showViewModal = false;
        this.showDeleteDialog = false;
        this.updateGiveData = null;
        this.viewGiveData = null;
        this.deleteGiveData = null;
        
        // Initialize state properly
        this.set('giveEntries', null);
        this.set('loading', true);
        this.set('showAddModal', false);
        this.set('showUpdateModal', false);
        this.set('showViewModal', false);
        this.set('showDeleteDialog', false);
        this.set('updateGiveData', null);
        this.set('viewGiveData', null);
        this.set('deleteGiveData', null);
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'Give Management | Church System';
        this.loadData();
        
        // Add event listeners for table events
        this.addEventListener('table-view', this.onView.bind(this));
        this.addEventListener('table-edit', this.onEdit.bind(this));
        this.addEventListener('table-delete', this.onDelete.bind(this));
        this.addEventListener('table-add', this.onAdd.bind(this));
        
        // Listen for success events to refresh data
        this.addEventListener('give-saved', (event) => {
            // Add the new give entry to the existing data
            const newGiveEntry = event.detail.giveEntry;
            if (newGiveEntry) {
                const currentGiveEntries = this.get('giveEntries') || [];
                this.set('giveEntries', [...currentGiveEntries, newGiveEntry]);
                this.updateTableData();
                // Close the add modal
                this.set('showAddModal', false);
            } else {
                this.loadData();
            }
        });
        
        this.addEventListener('give-updated', (event) => {
            // Update the existing give entry in the data
            const updatedGiveEntry = event.detail.giveEntry;
            if (updatedGiveEntry) {
                const currentGiveEntries = this.get('giveEntries') || [];
                const updatedGiveEntriesList = currentGiveEntries.map(giveEntry => 
                    giveEntry.id === updatedGiveEntry.id ? updatedGiveEntry : giveEntry
                );
                this.set('giveEntries', updatedGiveEntriesList);
                this.updateTableData();
                // Close the update modal
                this.set('showUpdateModal', false);
            } else {
                this.loadData();
            }
        });
        
        this.addEventListener('give-deleted', (event) => {
            // Remove the deleted give entry from the current data
            const deletedGiveId = event.detail.giveId;
            const currentGiveEntries = this.get('giveEntries') || [];
            const updatedGiveEntries = currentGiveEntries.filter(giveEntry => giveEntry.id !== deletedGiveId);
            this.set('giveEntries', updatedGiveEntries);
            this.updateTableData();
            
            // Close the delete dialog
            this.set('showDeleteDialog', false);
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

            // Load give entries data
            const giveResponse = await api.withToken(token).get('/give');
            this.set('giveEntries', giveResponse.data.data);
            
        } catch (error) {
            console.error('❌ Error loading give entries:', error);
            
            Toast.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to load give entries',
                variant: 'error',
                duration: 3000
            });
        } finally {
            this.set('loading', false);
        }
    }

    onView(event) {
        const { detail } = event;
        const viewGiveEntry = this.get('giveEntries').find(giveEntry => giveEntry.id === detail.row.id);
        if (viewGiveEntry) {
            this.closeAllModals();
            this.set('viewGiveData', viewGiveEntry);
            this.set('showViewModal', true);
            setTimeout(() => {
                const viewModal = this.querySelector('give-view-modal');
                if (viewModal) {
                    viewModal.setGiveData(viewGiveEntry);
                }
            }, 0);
        }
    }

    onEdit(event) {
        const { detail } = event;
        const editGiveEntry = this.get('giveEntries').find(giveEntry => giveEntry.id === detail.row.id);
        if (editGiveEntry) {
            this.closeAllModals();
            this.set('updateGiveData', editGiveEntry);
            this.set('showUpdateModal', true);
            setTimeout(() => {
                const updateModal = this.querySelector('give-update-modal');
                if (updateModal) {
                    updateModal.setGiveData(editGiveEntry);
                }
            }, 0);
        }
    }

    onDelete(event) {
        const { detail } = event;
        const deleteGiveEntry = this.get('giveEntries').find(giveEntry => giveEntry.id === detail.row.id);
        if (deleteGiveEntry) {
            this.closeAllModals();
            this.set('deleteGiveData', deleteGiveEntry);
            this.set('showDeleteDialog', true);
            setTimeout(() => {
                const deleteDialog = this.querySelector('give-delete-dialog');
                if (deleteDialog) {
                    deleteDialog.setGiveData(deleteGiveEntry);
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


    // Close all modals and dialogs
    closeAllModals() {
        this.set('showAddModal', false);
        this.set('showUpdateModal', false);
        this.set('showViewModal', false);
        this.set('showDeleteDialog', false);
        this.set('updateGiveData', null);
        this.set('viewGiveData', null);
        this.set('deleteGiveData', null);
    }

    // Update table data without full page reload
    updateTableData() {
        const giveEntries = this.get('giveEntries');
        
        if (giveEntries) {
            // Prepare give table data
            const giveTableData = giveEntries.map((giveEntry, index) => ({
                id: giveEntry.id,
                index: index + 1,
                title: giveEntry.title,
                text: giveEntry.text ? (giveEntry.text.length > 50 ? giveEntry.text.substring(0, 50) + '...' : giveEntry.text) : '',
                image: giveEntry.image ? 'Yes' : 'No',
                links_count: giveEntry.links ? (Array.isArray(giveEntry.links) ? giveEntry.links.length : 0) : 0,
                status: giveEntry.is_active ? 'Active' : 'Inactive',
                created: new Date(giveEntry.created_at).toLocaleString(),
                updated: new Date(giveEntry.updated_at).toLocaleString(),
            }));

            // Find the give table component and update its data
            const giveTableComponent = this.querySelector('ui-table');
            if (giveTableComponent) {
                giveTableComponent.setAttribute('data', JSON.stringify(giveTableData));
            }
        }
    }

    render() {
        const giveEntries = this.get('giveEntries');
        const loading = this.get('loading');
        const showAddModal = this.get('showAddModal');
        const showUpdateModal = this.get('showUpdateModal');
        const showViewModal = this.get('showViewModal');
        const showDeleteDialog = this.get('showDeleteDialog');
        
        const giveTableData = giveEntries ? giveEntries.map((giveEntry, index) => ({
            id: giveEntry.id,
            index: index + 1,
            title: giveEntry.title,
            text: giveEntry.text ? (giveEntry.text.length > 50 ? giveEntry.text.substring(0, 50) + '...' : giveEntry.text) : '',
            image: giveEntry.image ? 'Yes' : 'No',
            links_count: giveEntry.links ? (Array.isArray(giveEntry.links) ? giveEntry.links.length : 0) : 0,
            status: giveEntry.is_active ? 'Active' : 'Inactive',
            created: new Date(giveEntry.created_at).toLocaleString(),
            updated: new Date(giveEntry.updated_at).toLocaleString(),
        })) : [];

        const giveTableColumns = [
            { key: 'index', label: 'No.' },
            { key: 'title', label: 'Title' },
            { key: 'text', label: 'Description' },
            { key: 'image', label: 'Has Image' },
            { key: 'links_count', label: 'Links' },
            { key: 'status', label: 'Status' },
            { key: 'updated', label: 'Updated' }
        ];
        
        return `
            <div class="bg-white rounded-lg shadow-lg p-4">
                ${loading ? `
                    <!-- Give Entries Skeleton Loading -->
                    <div class="space-y-4">
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                    </div>
                ` : `
                    <!-- Give Entries Table Section -->
                    <div class="mb-8">
                        <ui-table 
                            title="Give Management"
                            data='${JSON.stringify(giveTableData)}'
                            columns='${JSON.stringify(giveTableColumns)}'
                            sortable
                            searchable
                            search-placeholder="Search give entries..."
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
            
            <!-- Give Modals and Dialogs -->
            <give-settings-modal ${showAddModal ? 'open' : ''}></give-settings-modal>
            <give-update-modal ${showUpdateModal ? 'open' : ''}></give-update-modal>
            <give-view-modal ${showViewModal ? 'open' : ''}></give-view-modal>
            <give-delete-dialog ${showDeleteDialog ? 'open' : ''}></give-delete-dialog>
        `;
    }
}

customElements.define('app-give-page', GivePage);
export default GivePage;
