import App from '@/core/App.js';
import '@/components/ui/Card.js';
import '@/components/ui/Button.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Table.js';
import '@/components/ui/Skeleton.js';
import '@/components/ui/Dialog.js';
import '@/components/layout/adminLayout/SystemSettingsModal.js';
import '@/components/layout/adminLayout/SystemUpdateModal.js';
import '@/components/layout/adminLayout/SystemViewModal.js';
import '@/components/layout/adminLayout/SystemDeleteDialog.js';
import api from '@/services/api.js';

/**
 * System Settings Page
 * 
 * Displays system settings data using Table component
 */
class SystemSettingsPage extends App {
    constructor() {
        super();
        this.settings = null;
        this.loading = false;
        this.showAddModal = false;
        this.showUpdateModal = false;
        this.showViewModal = false;
        this.showDeleteDialog = false;
        this.updateSettingData = null;
        this.viewSettingData = null;
        this.deleteSettingData = null;
    }

    getHeaderCounts() {
        const settings = this.get('settings') || [];
        const total = settings.length;
        let active = 0;
        let inactive = 0;
        let categories = new Set();
        let types = new Set();
        settings.forEach((setting) => {
            const isActive = Number(setting.is_active) === 1;
            if (isActive) active += 1; else inactive += 1;
            if (setting.category) categories.add(setting.category);
            if (setting.setting_type) types.add(setting.setting_type);
        });
        return { total, active, inactive, categories: categories.size, types: types.size };
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'System Settings';
        this.loadData();
        
        // Add event listeners for table events
        this.addEventListener('table-view', this.onView.bind(this));
        this.addEventListener('table-edit', this.onEdit.bind(this));
        this.addEventListener('table-delete', this.onDelete.bind(this));
        this.addEventListener('table-add', this.onAdd.bind(this));
        

        
        // Listen for success events to refresh data
        this.addEventListener('setting-deleted', (event) => {
            // Remove the deleted setting from the current data
            const deletedSettingId = event.detail.settingId;
            const currentSettings = this.get('settings') || [];
            const updatedSettings = currentSettings.filter(setting => setting.id !== deletedSettingId);
            this.set('settings', updatedSettings);
            this.updateTableData();
            
            // Close the delete dialog
            this.set('showDeleteDialog', false);
        });
        
        this.addEventListener('setting-saved', (event) => {
            // Add the new setting to the existing data
            const newSetting = event.detail.setting;
            if (newSetting) {
                const currentSettings = this.get('settings') || [];
                this.set('settings', [...currentSettings, newSetting]);
                this.updateTableData();
                // Close the add modal
                this.set('showAddModal', false);
            } else {
                this.loadData();
            }
        });
        
        this.addEventListener('setting-updated', (event) => {
            // Update the existing setting in the data
            const updatedSetting = event.detail.setting;
            if (updatedSetting) {
                const currentSettings = this.get('settings') || [];
                const updatedSettings = currentSettings.map(setting => 
                    setting.id === updatedSetting.id ? updatedSetting : setting
                );
                this.set('settings', updatedSettings);
                
                // Close the update modal first
                this.set('showUpdateModal', false);
                this.set('updateSettingData', null);
                
                // Update table data
                this.updateTableData();
            } else {
                this.loadData();
            }
        });
        
        // Listen for general settings refresh event
        this.addEventListener('settings-refreshed', () => {
            // Reload all data to ensure everything is up to date
            this.loadData();
        });
        
        // Listen for modal opened event to pass data
        this.addEventListener('modal-opened', (event) => {
            const modal = event.target;
            if (modal.tagName === 'SYSTEM-UPDATE-MODAL') {
                const updateSettingData = this.get('updateSettingData');
                if (updateSettingData) {
                    modal.setSettingData(updateSettingData);
                }
            } else if (modal.tagName === 'SYSTEM-VIEW-MODAL') {
                const viewSettingData = this.get('viewSettingData');
                if (viewSettingData) {
                    modal.setSettingData(viewSettingData);
                }
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

            // Load settings data
            const settingsResponse = await api.withToken(token).get('/settings');
            
            this.set('settings', settingsResponse.data.data);
            this.set('loading', false);
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.set('loading', false);
            
            Toast.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to load settings data',
                variant: 'error',
                duration: 3000
            });
        }
    }

    // Action handlers
    onView(event) {
        const { detail } = event;
        const viewSetting = this.get('settings').find(s => s.id === detail.row.id);
        if (viewSetting) {
            this.closeAllModals();
            this.set('viewSettingData', viewSetting);
            this.set('showViewModal', true);
            setTimeout(() => {
                const viewModal = this.querySelector('system-view-modal');
                if (viewModal) {
                    viewModal.setSettingData(viewSetting);
                }
            }, 0);
        }
    }

    onEdit(event) {
        const { detail } = event;
        const editSetting = this.get('settings').find(s => s.id === detail.row.id);
        if (editSetting) {
            this.closeAllModals();
            this.set('updateSettingData', editSetting);
            this.set('showUpdateModal', true);
            setTimeout(() => {
                const updateModal = this.querySelector('system-update-modal');
                if (updateModal) {
                    updateModal.setSettingData(editSetting);
                }
            }, 0);
        }
    }

    onDelete(event) {
        const { detail } = event;
        const deleteSetting = this.get('settings').find(s => s.id === detail.row.id);
        if (deleteSetting) {
            this.closeAllModals();
            this.set('deleteSettingData', deleteSetting);
            this.set('showDeleteDialog', true);
            setTimeout(() => {
                const deleteDialog = this.querySelector('system-delete-dialog');
                if (deleteDialog) {
                    deleteDialog.setSettingData(deleteSetting);
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

    // Update table data without full page reload
    updateTableData() {
        const settings = this.get('settings');
        if (!settings) return;

        // Prepare table data
        const tableData = settings.map((setting, index) => {
            let displayValue = setting.setting_value;
            
            // Handle different value types
            if (Array.isArray(setting.setting_value)) {
                displayValue = setting.setting_value.join(', ');
            } else if (typeof setting.setting_value === 'object' && setting.setting_value !== null) {
                // Handle object values (like file uploads that return objects)
                if (setting.setting_value.path || setting.setting_value.url) {
                    displayValue = setting.setting_value.path || setting.setting_value.url;
                } else if (setting.setting_value.name) {
                    displayValue = setting.setting_value.name;
                } else {
                    displayValue = JSON.stringify(setting.setting_value);
                }
            } else if (typeof setting.setting_value === 'string') {
                displayValue = setting.setting_value;
            } else {
                displayValue = String(setting.setting_value || '');
            }
            
            // Truncate long values
            if (displayValue.length > 50) {
                displayValue = displayValue.substring(0, 50) + '...';
            }
            
            return {
                id: setting.id, // Keep ID for internal use
                index: index + 1, // Add index number for display
                setting_key: setting.setting_key,
                setting_value: displayValue,
                setting_type: setting.setting_type,
                category: setting.category,
                status: setting.is_active ? 'Active' : 'Inactive',
                updated: new Date(setting.updated_at).toLocaleString(),
            };
        });

        // Find the table component and update its data
        const tableComponent = this.querySelector('ui-table');
        if (tableComponent) {
            tableComponent.setAttribute('data', JSON.stringify(tableData));
        }
    }

    // Close all modals and dialogs
    closeAllModals() {
        this.set('showAddModal', false);
        this.set('showUpdateModal', false);
        this.set('showViewModal', false);
        this.set('showDeleteDialog', false);
        this.set('updateSettingData', null);
        this.set('viewSettingData', null);
        this.set('deleteSettingData', null);
    }

    renderHeader() {
        const c = this.getHeaderCounts();
        return `
            <div class="space-y-8 mb-4">
                <div class="bg-slate-700 rounded-xl shadow-lg p-5 text-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                        <div>
                            <div class="flex items-center gap-2">
                                <h1 class="text-2xl sm:text-3xl font-bold">System Settings</h1>
                                <button 
                                    onclick="this.closest('app-system-settings-page').loadData()"
                                    class="size-8 mt-2 flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg group"
                                    title="Refresh data">
                                    <i class="fas fa-sync-alt text-lg ${this.get('loading') ? 'animate-spin' : ''} group-hover:scale-110 transition-transform duration-200"></i>
                                </button>
                            </div>
                            <p class="text-blue-100 text-base sm:text-lg">Configure system settings and preferences</p>
                        </div>
                        <div class="mt-4 sm:mt-0">
                            <div class="text-right">
                                <div class="text-xl sm:text-2xl font-bold">${c.total}</div>
                                <div class="text-blue-100 text-xs sm:text-sm">Total Settings</div>
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
                                    <i class="fas fa-tags text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.categories}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">Categories</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-purple-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-cog text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.types}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">Types</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-orange-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-sliders-h text-white text-lg sm:text-xl"></i>
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
        const settings = this.get('settings');
        const loading = this.get('loading');
        const showAddModal = this.get('showAddModal');
        const showUpdateModal = this.get('showUpdateModal');
        const showViewModal = this.get('showViewModal');
        const showDeleteDialog = this.get('showDeleteDialog');
        
        const tableData = settings ? settings.map((setting, index) => {
            let displayValue = setting.setting_value;
            
            // Handle different value types
            if (Array.isArray(setting.setting_value)) {
                displayValue = setting.setting_value.join(', ');
            } else if (typeof setting.setting_value === 'object' && setting.setting_value !== null) {
                // Handle object values (like file uploads that return objects)
                if (setting.setting_value.path || setting.setting_value.url) {
                    displayValue = setting.setting_value.path || setting.setting_value.url;
                } else if (setting.setting_value.name) {
                    displayValue = setting.setting_value.name;
                } else {
                    displayValue = JSON.stringify(setting.setting_value);
                }
            } else if (typeof setting.setting_value === 'string') {
                displayValue = setting.setting_value;
            } else {
                displayValue = String(setting.setting_value || '');
            }
            
            // Truncate long values
            if (displayValue.length > 50) {
                displayValue = displayValue.substring(0, 50) + '...';
            }
            
            return {
                id: setting.id, // Keep ID for internal use
                index: index + 1, // Add index number for display
                setting_key: setting.setting_key || '',
                setting_value: displayValue,
                setting_type: setting.setting_type || '',
                category: setting.category || '',
                status: setting.is_active ? 'Active' : 'Inactive',
                updated: new Date(setting.updated_at || Date.now()).toLocaleString(),
            };
        }) : [];

        const tableColumns = [
            // { key: 'id', label: 'ID' }, // Hidden but kept for reference
            { key: 'index', label: 'No.' },
            { key: 'setting_key', label: 'Key' },
            { key: 'setting_value', label: 'Value' },
            { key: 'setting_type', label: 'Type' },
            { key: 'category', label: 'Category' },
            { key: 'status', label: 'Status' },
            { key: 'updated', label: 'Updated' }
        ];


        
        return `
            ${this.renderHeader()}
            
            <div class="bg-white rounded-lg shadow-lg p-4">
                ${loading ? `
                    <!-- Simple Skeleton Loading -->
                    <div class="space-y-4">
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                    </div>
                ` : `
                    <!-- Settings Table Section -->
                    <div class="mb-8">
                        <ui-table 
                            title="System Settings"
                            data='${JSON.stringify(tableData).replace(/'/g, "&#39;").replace(/"/g, "&quot;")}'
                            columns='${JSON.stringify(tableColumns).replace(/'/g, "&#39;").replace(/"/g, "&quot;")}'
                            sortable
                            searchable
                            search-placeholder="Search settings..."
                            pagination
                            page-size="50"
                            action
                            actions="view,edit"                                
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
            <system-settings-modal ${showAddModal ? 'open' : ''}></system-settings-modal>
            <system-update-modal ${showUpdateModal ? 'open' : ''}></system-update-modal>
            <system-view-modal id="view-modal" ${showViewModal ? 'open' : ''}></system-view-modal>
            <system-delete-dialog ${showDeleteDialog ? 'open' : ''}></system-delete-dialog>
        `;
    }
}

customElements.define('app-system-settings-page', SystemSettingsPage);
export default SystemSettingsPage;
