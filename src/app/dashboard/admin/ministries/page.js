import App from '@/core/App.js';
import '@/components/ui/Table.js';
import '@/components/ui/Button.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Skeleton.js';
import '@/components/layout/adminLayout/MinistryAddModal.js';
import api from '@/services/api.js';

/**
 * Ministries Management Page
 * 
 * Simple display page for managing ministries
 */
class MinistriesPage extends App {
    constructor() {
        super();
        this.ministries = null;
        this.loading = true;
        this.showAddModal = false;
        
        // Initialize state properly
        this.set('ministries', null);
        this.set('loading', true);
        this.set('showAddModal', false);
    }

    getHeaderCounts() {
        const ministries = this.get('ministries') || [];
        const total = ministries.length;
        return { total };
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'Ministries Management | Church System';
        this.loadData();
        
        // Add event listeners for table events
        this.addEventListener('table-add', this.onAdd.bind(this));
        this.addEventListener('table-refresh', this.onRefresh.bind(this));
        
        // Listen for success events to refresh data
        this.addEventListener('ministry-saved', (event) => {
            // Add the new ministry to the existing data
            const newMinistry = event.detail.ministry;
            if (newMinistry) {
                const currentMinistries = this.get('ministries') || [];
                this.set('ministries', [...currentMinistries, newMinistry]);
                this.updateTableData();
                // Close the add modal
                this.set('showAddModal', false);
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

            // Load ministries data
            const ministriesResponse = await api.withToken(token).get('/ministries');
            this.set('ministries', ministriesResponse.data.data);
            
        } catch (error) {
            console.error('❌ Error loading ministries:', error);
            
            Toast.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to load ministries',
                variant: 'error',
                duration: 3000
            });
        } finally {
            this.set('loading', false);
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
    }

    // Update table data without full page reload
    updateTableData() {
        const ministries = this.get('ministries');
        
        if (ministries) {
            // Prepare ministries table data
            const ministriesTableData = ministries.map((ministry, index) => ({
                id: ministry.id,
                index: index + 1,
                name: ministry.name,
                created: new Date(ministry.created_at).toLocaleString(),
                updated: new Date(ministry.updated_at).toLocaleString(),
            }));

            // Find the ministries table component and update its data
            const ministriesTableComponent = this.querySelector('ui-table');
            if (ministriesTableComponent) {
                ministriesTableComponent.setAttribute('data', JSON.stringify(ministriesTableData));
            }
        }
    }

    renderHeader() {
        const c = this.getHeaderCounts();
        return `
            <div class="space-y-8 mb-4">
                <div class="bg-slate-700 rounded-xl shadow-lg p-5 text-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                        <div>
                            <div class="flex items-center gap-2">
                                <h1 class="text-2xl sm:text-3xl font-bold">Ministries</h1>
                                <button 
                                    onclick="this.closest('app-ministries-page').loadData()"
                                    class="size-8 mt-2 flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg group"
                                    title="Refresh data">
                                    <i class="fas fa-sync-alt text-lg ${this.get('loading') ? 'animate-spin' : ''} group-hover:scale-110 transition-transform duration-200"></i>
                                </button>
                            </div>
                            <p class="text-purple-100 text-base sm:text-lg">Manage church ministries</p>
                        </div>
                        <div class="mt-4 sm:mt-0">
                            <div class="text-right">
                                <div class="text-xl sm:text-2xl font-bold">${c.total}</div>
                                <div class="text-purple-100 text-xs sm:text-sm">Ministries</div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-green-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-church text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.total}</div>
                                    <div class="text-purple-100 text-xs sm:text-sm">Total</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        const ministries = this.get('ministries');
        const loading = this.get('loading');
        const showAddModal = this.get('showAddModal');
        
        const ministriesTableData = ministries ? ministries.map((ministry, index) => ({
            id: ministry.id,
            index: index + 1,
            name: ministry.name,
            created: new Date(ministry.created_at).toLocaleString(),
            updated: new Date(ministry.updated_at).toLocaleString(),
        })) : [];

        const ministriesTableColumns = [
            { key: 'index', label: 'No.' },
            { key: 'name', label: 'Ministry Name' },
            { key: 'created', label: 'Created' },
            { key: 'updated', label: 'Updated' }
        ];
        
        return `
            ${this.renderHeader()}
            
            <div class="bg-white rounded-lg shadow-lg p-4">
                ${loading ? `
                    <!-- Ministries Skeleton Loading -->
                    <div class="space-y-4">
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                        <ui-skeleton class="h-24 w-full"></ui-skeleton>
                    </div>
                ` : `
                    <!-- Ministries Table Section -->
                    <div class="mb-8">
                        <ui-table 
                            title="Ministries Management"
                            data='${JSON.stringify(ministriesTableData)}'
                            columns='${JSON.stringify(ministriesTableColumns)}'
                            sortable
                            searchable
                            search-placeholder="Search ministries..."
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
            
            <!-- Ministry Add Modal -->
            <ministry-add-modal ${showAddModal ? 'open' : ''}></ministry-add-modal>
        `;
    }
}

customElements.define('app-ministries-page', MinistriesPage);
export default MinistriesPage;
