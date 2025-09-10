import App from '@/core/App.js';
import '@/components/ui/Card.js';
import '@/components/ui/Button.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Table.js';
import '@/components/ui/Skeleton.js';
import '@/components/ui/Dialog.js';
import '@/components/layout/adminLayout/LifeGroupSettingsModal.js';
import '@/components/layout/adminLayout/LifeGroupUpdateModal.js';
import '@/components/layout/adminLayout/LifeGroupViewModal.js';
import '@/components/layout/adminLayout/LifeGroupDeleteDialog.js';
import api from '@/services/api.js';

/**
 * Life Groups Management Page
 * 
 * Displays life groups data using Table component
 */
class LifeGroupsPage extends App {
    constructor() {
        super();
        this.lifeGroups = null;
        this.loading = false;
        this.showAddModal = false;
        this.showUpdateModal = false;
        this.showViewModal = false;
        this.showDeleteDialog = false;
        this.updateLifeGroupData = null;
        this.viewLifeGroupData = null;
        this.deleteLifeGroupData = null;
    }

    getHeaderCounts() {
        const lifeGroups = this.get('lifeGroups') || [];
        const total = lifeGroups.length;
        let active = 0;
        let inactive = 0;
        let withLinks = 0;
        let withImages = 0;
        lifeGroups.forEach((group) => {
            const isActive = Number(group.is_active) === 1;
            if (isActive) active += 1; else inactive += 1;
            if (group.link && group.link !== 'N/A') withLinks += 1;
            if (group.image) withImages += 1;
        });
        return { total, active, inactive, withLinks, withImages };
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'Life Groups Management';
        this.loadData();
        
        // Add event listeners for table events
        this.addEventListener('table-view', this.onView.bind(this));
        this.addEventListener('table-edit', this.onEdit.bind(this));
        this.addEventListener('table-delete', this.onDelete.bind(this));
        this.addEventListener('table-add', this.onAdd.bind(this));
        
        // Listen for success events to refresh data
        this.addEventListener('life-group-deleted', (event) => {
            // Remove the deleted life group from the current data
            const deletedLifeGroupId = event.detail.lifeGroupId;
            const currentLifeGroups = this.get('lifeGroups') || [];
            const updatedLifeGroups = currentLifeGroups.filter(lifeGroup => lifeGroup.id !== deletedLifeGroupId);
            this.set('lifeGroups', updatedLifeGroups);
            this.updateTableData();
            
            // Close the delete dialog
            this.set('showDeleteDialog', false);
        });
        
        this.addEventListener('life-group-saved', (event) => {
            // Add the new life group to the existing data
            const newLifeGroup = event.detail.lifeGroup;
            if (newLifeGroup) {
                const currentLifeGroups = this.get('lifeGroups') || [];
                this.set('lifeGroups', [...currentLifeGroups, newLifeGroup]);
                this.updateTableData();
                // Close the add modal
                this.set('showAddModal', false);
            } else {
                this.loadData();
            }
        });
        
        this.addEventListener('life-group-updated', (event) => {
            // Update the existing life group in the data
            const updatedLifeGroup = event.detail.lifeGroup;
            if (updatedLifeGroup) {
                const currentLifeGroups = this.get('lifeGroups') || [];
                const updatedLifeGroups = currentLifeGroups.map(lifeGroup => 
                    lifeGroup.id === updatedLifeGroup.id ? updatedLifeGroup : lifeGroup
                );
                this.set('lifeGroups', updatedLifeGroups);
                this.updateTableData();
                // Close the update modal
                this.set('showUpdateModal', false);
            } else {
                this.loadData();
            }
        });
        
        // Listen for modal opened event to pass data
        this.addEventListener('modal-opened', (event) => {
            const modal = event.target;
            if (modal.tagName === 'LIFE-GROUP-UPDATE-MODAL') {
                const updateLifeGroupData = this.get('updateLifeGroupData');
                if (updateLifeGroupData) {
                    modal.setLifeGroupData(updateLifeGroupData);
                }
            } else if (modal.tagName === 'LIFE-GROUP-VIEW-MODAL') {
                const viewLifeGroupData = this.get('viewLifeGroupData');
                if (viewLifeGroupData) {
                    modal.setLifeGroupData(viewLifeGroupData);
                }
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
            
            const response = await api.withToken(token).get('/life-groups');
            const lifeGroupsData = response.data?.data || [];
            
            this.set('lifeGroups', lifeGroupsData);
            this.set('loading', false);
        } catch (error) {
            console.error('❌ Error loading life groups:', error);
            this.set('loading', false);
            Toast.show({ title: 'Error', message: error.response?.data?.message || 'Failed to load life groups', variant: 'error', duration: 3000 });
        }
    }

    // Action handlers
    onView(event) {
        const { detail } = event;
        const viewLifeGroup = this.get('lifeGroups').find(lifeGroup => lifeGroup.id === detail.row.id);
        if (viewLifeGroup) {
            this.closeAllModals();
            this.set('viewLifeGroupData', viewLifeGroup);
            this.set('showViewModal', true);
            setTimeout(() => {
                const viewModal = this.querySelector('life-group-view-modal');
                if (viewModal) {
                    viewModal.setLifeGroupData(viewLifeGroup);
                }
            }, 0);
        }
    }

    onEdit(event) {
        const { detail } = event;
        const editLifeGroup = this.get('lifeGroups').find(lifeGroup => lifeGroup.id === detail.row.id);
        if (editLifeGroup) {
            this.closeAllModals();
            this.set('updateLifeGroupData', editLifeGroup);
            this.set('showUpdateModal', true);
            setTimeout(() => {
                const updateModal = this.querySelector('life-group-update-modal');
                if (updateModal) {
                    updateModal.setLifeGroupData(editLifeGroup);
                }
            }, 0);
        }
    }

    onDelete(event) {
        const { detail } = event;
        const deleteLifeGroup = this.get('lifeGroups').find(lifeGroup => lifeGroup.id === detail.row.id);
        if (deleteLifeGroup) {
            this.closeAllModals();
            this.set('deleteLifeGroupData', deleteLifeGroup);
            this.set('showDeleteDialog', true);
            setTimeout(() => {
                const deleteDialog = this.querySelector('life-group-delete-dialog');
                if (deleteDialog) {
                    deleteDialog.setLifeGroupData(deleteLifeGroup);
                }
            }, 0);
        }
    }

    onAdd(event) {
        console.log('➕ Add button clicked');
        this.closeAllModals();
        this.set('showAddModal', true);
        
        // Check if modal exists after render
        setTimeout(() => {
            const modal = this.querySelector('life-group-settings-modal');
            console.log('🔍 Modal in DOM:', modal);
            if (modal) {
                console.log('✅ Modal found, checking if it has open attribute');
                console.log('🔍 Modal open attribute:', modal.hasAttribute('open'));
            } else {
                console.log('❌ Modal not found in DOM');
            }
        }, 50);
    }

    onRefresh(event) {
        this.loadData();
    }

    updateTableData() {
        const lifeGroups = this.get('lifeGroups');
        if (!lifeGroups) return;
        
        const tableData = lifeGroups.map((lg, index) => {
            // Clean and escape the description to prevent JSON issues
            let cleanDescription = lg.description || 'No description';
            if (cleanDescription) {
                cleanDescription = cleanDescription
                    .replace(/<[^>]*>/g, '') // Remove HTML tags
                    .replace(/"/g, '&quot;') // Escape quotes
                    .replace(/'/g, '&#39;') // Escape single quotes
                    .replace(/\n/g, ' ') // Replace newlines with spaces
                    .trim();
                
                // Truncate if too long
                if (cleanDescription.length > 100) {
                    cleanDescription = cleanDescription.substring(0, 100) + '...';
                }
            }
            
            return {
                id: lg.id || 0,
                index: index + 1,
                title: (lg.title || 'Untitled').replace(/"/g, '&quot;').replace(/'/g, '&#39;'),
                slug: lg.slug || 'no-slug',
                description: cleanDescription,
                link: lg.link || 'N/A',
                status: lg.is_active ? 'Active' : 'Inactive',
                created: lg.created_at ? new Date(lg.created_at).toLocaleString() : 'N/A',
                updated: lg.updated_at ? new Date(lg.updated_at).toLocaleString() : 'N/A',
            };
        });
        
        const tableComponent = this.querySelector('ui-table');
        if (tableComponent) {
            try {
                tableComponent.setAttribute('data', JSON.stringify(tableData));
            } catch (error) {
                console.error('❌ Error updating table data:', error);
            }
        }
    }

    // Close all modals and dialogs
    closeAllModals() {
        this.set('showAddModal', false);
        this.set('showUpdateModal', false);
        this.set('showViewModal', false);
        this.set('showDeleteDialog', false);
        this.set('updateLifeGroupData', null);
        this.set('viewLifeGroupData', null);
        this.set('deleteLifeGroupData', null);
    }

    renderHeader() {
        const c = this.getHeaderCounts();
        return `
            <div class="space-y-8 mb-4">
                <div class="bg-slate-700 rounded-xl shadow-lg p-5 text-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                        <div>
                            <div class="flex items-center gap-2">
                                <h1 class="text-2xl sm:text-3xl font-bold">Life Groups</h1>
                                <button 
                                    onclick="this.closest('app-life-groups-page').loadData()"
                                    class="size-8 mt-2 flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg group"
                                    title="Refresh data">
                                    <i class="fas fa-sync-alt text-lg ${this.get('loading') ? 'animate-spin' : ''} group-hover:scale-110 transition-transform duration-200"></i>
                                </button>
                            </div>
                            <p class="text-blue-100 text-base sm:text-lg">Manage small groups and fellowship activities</p>
                        </div>
                        <div class="mt-4 sm:mt-0">
                            <div class="text-right">
                                <div class="text-xl sm:text-2xl font-bold">${c.total}</div>
                                <div class="text-blue-100 text-xs sm:text-sm">Total Groups</div>
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
                                    <i class="fas fa-link text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.withLinks}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">With Links</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-purple-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
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
                                <div class="size-10 flex items-center justify-center bg-orange-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-users text-white text-lg sm:text-xl"></i>
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
        const lifeGroups = this.get('lifeGroups');
        const loading = this.get('loading');
        const showAddModal = this.get('showAddModal');
        const showUpdateModal = this.get('showUpdateModal');
        const showViewModal = this.get('showViewModal');
        const showDeleteDialog = this.get('showDeleteDialog');
        


        const tableData = lifeGroups ? lifeGroups.map((lg, index) => {
            
            // Clean and escape the description to prevent JSON issues
            let cleanDescription = lg.description || 'No description';
            if (cleanDescription) {
                // Remove any HTML tags and escape special characters
                cleanDescription = cleanDescription
                    .replace(/<[^>]*>/g, '') // Remove HTML tags
                    .replace(/"/g, '&quot;') // Escape quotes
                    .replace(/'/g, '&#39;') // Escape single quotes
                    .replace(/\n/g, ' ') // Replace newlines with spaces
                    .trim();
                
                // Truncate if too long
                if (cleanDescription.length > 100) {
                    cleanDescription = cleanDescription.substring(0, 100) + '...';
                }
            }
            
            return {
                id: lg.id || 0,
                index: index + 1,
                title: (lg.title || 'Untitled').replace(/"/g, '&quot;').replace(/'/g, '&#39;'),
                slug: lg.slug || 'no-slug',
                description: cleanDescription,
                link: lg.link || 'N/A',
                status: lg.is_active ? 'Active' : 'Inactive',
                created: lg.created_at ? new Date(lg.created_at).toLocaleString() : 'N/A',
                updated: lg.updated_at ? new Date(lg.updated_at).toLocaleString() : 'N/A',
            };
        }) : [];

        const tableColumns = [
            { key: 'index', label: 'No.', html: false },
            { key: 'title', label: 'Title' },
            // { key: 'slug', label: 'Slug' },
            { key: 'description', label: 'Description' },
            { key: 'link', label: 'Link' },
            { key: 'status', label: 'Status' },
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
                            title="Life Groups"
                            data='${JSON.stringify(tableData)}'
                            columns='${JSON.stringify(tableColumns)}'
                            sortable
                            searchable
                            search-placeholder="Search life groups..."
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
            <life-group-settings-modal ${showAddModal ? 'open' : ''}></life-group-settings-modal>
            <life-group-update-modal ${showUpdateModal ? 'open' : ''}></life-group-update-modal>
            <life-group-view-modal id="view-modal" ${showViewModal ? 'open' : ''}></life-group-view-modal>
            <life-group-delete-dialog ${showDeleteDialog ? 'open' : ''}></life-group-delete-dialog>
        `;
    }
}

customElements.define('app-life-groups-page', LifeGroupsPage);
export default LifeGroupsPage; 