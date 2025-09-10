import App from '@/core/App.js';
import '@/components/ui/Card.js';
import '@/components/ui/Button.js';
import '@/components/ui/Toast.js';
import '@/components/ui/Table.js';
import '@/components/ui/Skeleton.js';
import '@/components/ui/Dialog.js';
import '@/components/layout/adminLayout/LogViewDialog.js';
import api from '@/services/api.js';

/**
 * System Report Page
 * 
 * Displays system logs data using Table component
 */
class SystemReportPage extends App {
    constructor() {
        super();
        this.logs = null;
        this.loading = false;
        this.showViewDialog = false;
        this.viewLogData = null;
    }

    getHeaderCounts() {
        const logs = this.get('logs') || [];
        const total = logs.length;
        let today = 0;
        let thisWeek = 0;
        let thisMonth = 0;
        let uniqueUsers = new Set();
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(todayStart.getTime() - (todayStart.getDay() * 24 * 60 * 60 * 1000));
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        logs.forEach((log) => {
            const logDate = new Date(log.created_at);
            if (logDate >= todayStart) today += 1;
            if (logDate >= weekStart) thisWeek += 1;
            if (logDate >= monthStart) thisMonth += 1;
            if (log.user_name) uniqueUsers.add(log.user_name);
        });
        return { total, today, thisWeek, thisMonth, uniqueUsers: uniqueUsers.size };
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'System Reports';
        this.loadData();
        
        // Add event listeners for table events
        this.addEventListener('table-row-click', this.onRowClick.bind(this));
        this.addEventListener('table-refresh', this.onRefresh.bind(this));
        
        // Listen for dialog opened event to pass data
        this.addEventListener('dialog-opened', (event) => {
            const dialog = event.target;
            if (dialog.tagName === 'LOG-VIEW-DIALOG') {
                const viewLogData = this.get('viewLogData');
                if (viewLogData) {
                    dialog.setLogData(viewLogData);
                }
            }
        });
    }

    async loadData() {
        try {
            this.set('loading', true);
            
            // Get the auth token
            const token = localStorage.getItem('token');
            if (!token) {
                Toast.show({
                    title: 'Authentication Error',
                    message: 'Please log in to view logs',
                    variant: 'error',
                    duration: 3000
                });
                return;
            }

            // Load logs data
            const logsResponse = await api.withToken(token).get('/logs');
            
            this.set('logs', logsResponse.data.data);
            this.set('loading', false);
            
        } catch (error) {
            console.error('❌ Error loading logs:', error);
            this.set('loading', false);
            
            Toast.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to load system logs',
                variant: 'error',
                duration: 3000
            });
        }
    }

    // Action handlers
    onRowClick(event) {
        console.log('🔍 Row click event received:', event);
        console.log('🔍 Event detail:', event.detail);
        
        const { detail } = event;
        const viewLog = this.get('logs').find(log => log.id === detail.row.id);
        
        console.log('🔍 Found log:', viewLog);
        
        if (viewLog) {
            console.log('🔍 Closing all dialogs...');
            this.closeAllDialogs();
            
            console.log('🔍 Setting view log data...');
            this.set('viewLogData', viewLog);
            
            console.log('🔍 Setting show view dialog to true...');
            this.set('showViewDialog', true);
            
            console.log('🔍 Current showViewDialog state:', this.get('showViewDialog'));
            
            setTimeout(() => {
                console.log('🔍 Looking for log-view-dialog element...');
                const viewDialog = this.querySelector('log-view-dialog');
                console.log('🔍 Found dialog element:', viewDialog);
                
                if (viewDialog) {
                    console.log('🔍 Setting log data to dialog...');
                    viewDialog.setLogData(viewLog);
                    console.log('🔍 Opening dialog...');
                    viewDialog.open();
                    console.log('🔍 Dialog should now be open');
                } else {
                    console.log('❌ Dialog element not found!');
                }
            }, 0);
        } else {
            console.log('❌ Log not found for ID:', detail.row.id);
        }
    }

    async onViewLogDetails(logId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                Toast.show({
                    title: 'Authentication Error',
                    message: 'Please log in to view log details',
                    variant: 'error',
                    duration: 3000
                });
                return;
            }

            const response = await api.withToken(token).get(`/logs/${logId}`);
            const logData = response.data.data;
            
            this.closeAllDialogs();
            this.set('viewLogData', logData);
            this.set('showViewDialog', true);
            setTimeout(() => {
                const viewDialog = this.querySelector('log-view-dialog');
                if (viewDialog) {
                    viewDialog.setLogData(logData);
                }
            }, 0);
            
        } catch (error) {
            console.error('❌ Error loading log details:', error);
            Toast.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to load log details',
                variant: 'error',
                duration: 3000
            });
        }
    }

    onRefresh(event) {
        this.loadData();
    }

    // Update table data without full page reload
    updateTableData() {
        const logs = this.get('logs');
        if (!logs) return;

        // Prepare table data
        const tableData = logs.map((log, index) => ({
            id: log.id, // Keep ID for internal use
            index: index + 1, // Add index number for display
            user: log.user_name || 'System',
            action: log.action,
            description: log.description,
            ip_address: log.ip_address,
            user_agent: log.user_agent,
            created: new Date(log.created_at).toLocaleString(),
        }));

        // Find the table component and update its data
        const tableComponent = this.querySelector('ui-table');
        if (tableComponent) {
            tableComponent.setAttribute('data', JSON.stringify(tableData));
        }
    }

    // Close all dialogs
    closeAllDialogs() {
        this.set('showViewDialog', false);
        this.set('viewLogData', null);
    }

    renderHeader() {
        const c = this.getHeaderCounts();
        return `
            <div class="space-y-8 mb-4">
                <div class="bg-slate-700 rounded-xl shadow-lg p-5 text-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                        <div>
                            <div class="flex items-center gap-2">
                                <h1 class="text-2xl sm:text-3xl font-bold">System Reports</h1>
                                <button 
                                    onclick="this.closest('app-system-report-page').loadData()"
                                    class="size-8 mt-2 flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg group"
                                    title="Refresh data">
                                    <i class="fas fa-sync-alt text-lg ${this.get('loading') ? 'animate-spin' : ''} group-hover:scale-110 transition-transform duration-200"></i>
                                </button>
                            </div>
                            <p class="text-blue-100 text-base sm:text-lg">Monitor system activity and user logs</p>
                        </div>
                        <div class="mt-4 sm:mt-0">
                            <div class="text-right">
                                <div class="text-xl sm:text-2xl font-bold">${c.total}</div>
                                <div class="text-blue-100 text-xs sm:text-sm">Total Logs</div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-green-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-calendar-day text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.today}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">Today</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-yellow-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-calendar-week text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.thisWeek}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">This Week</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-blue-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-calendar-alt text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.thisMonth}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">This Month</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-purple-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-users text-white text-lg sm:text-xl"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xl sm:text-2xl font-bold">${c.uniqueUsers}</div>
                                    <div class="text-blue-100 text-xs sm:text-sm">Active Users</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white border-opacity-20">
                            <div class="flex items-center">
                                <div class="size-10 flex items-center justify-center bg-orange-500 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                                    <i class="fas fa-chart-line text-white text-lg sm:text-xl"></i>
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
        const logs = this.get('logs');
        const loading = this.get('loading');
        const showViewDialog = this.get('showViewDialog');
        
        // Prepare table data and columns for logs
        const tableData = logs ? logs.map((log, index) => ({
            id: log.id, // Keep ID for internal use
            index: index + 1, // Add index number for display
            user: log.user_name || 'System',
            action: log.action,
            description: log.description,
            ip_address: log.ip_address,
            user_agent: log.user_agent,
            created: new Date(log.created_at).toLocaleString(),
        })) : [];

        const tableColumns = [
            { key: 'index', label: 'No.', html: false },
            { key: 'user', label: 'User' },
            { key: 'action', label: 'Action' },
            { key: 'description', label: 'Description' },
            { key: 'ip_address', label: 'IP Address', html: false },
            { key: 'created', label: 'Timestamp' }
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
                    <!-- System Logs Table Section -->
                    <div class="mb-8">
                        <ui-table 
                            title="System Activity Logs"
                            data='${JSON.stringify(tableData)}'
                            columns='${JSON.stringify(tableColumns)}'
                            sortable
                            searchable
                            search-placeholder="Search logs..."
                            pagination
                            page-size="50"
                            refresh
                            print
                            export
                            bordered
                            striped
                            clickable
                            class="w-full">
                        </ui-table>
                    </div>
                `}
            </div>
            
            <!-- View Log Dialog -->
            <log-view-dialog id="view-dialog" ${showViewDialog ? 'open' : ''}></log-view-dialog>
        `;
    }
}

customElements.define('app-system-report-page', SystemReportPage);
export default SystemReportPage;
