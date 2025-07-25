import App from '@/core/App.js';

/**
 * Pastor Dashboard Page Component (/dashboard/pastor)
 * 
 * Pastor dashboard with church management features.
 */
class PastorDashboardPage extends App {
    connectedCallback() {
        super.connectedCallback();
        document.title = 'Pastor Dashboard | Church System';
    }

    render() {
        return `
            <div class="space-y-6">
                <div class="bg-white shadow rounded-lg p-6">
                    <h1 class="text-2xl font-bold text-gray-900 mb-4">
                        Pastor Dashboard
                    </h1>
                    <p class="text-gray-600">
                        Welcome to your pastor dashboard. Here you can manage church activities, members, and spiritual oversight.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Sermons & Messages</h3>
                        <p class="text-gray-600">Manage your sermons, messages, and spiritual content.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Church Members</h3>
                        <p class="text-gray-600">View and manage church membership and pastoral care.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Events & Services</h3>
                        <p class="text-gray-600">Schedule and manage church events and services.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Ministry Teams</h3>
                        <p class="text-gray-600">Oversee ministry teams and volunteer coordination.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Prayer Requests</h3>
                        <p class="text-gray-600">Manage prayer requests and intercessory prayer.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Church Finances</h3>
                        <p class="text-gray-600">Oversee church finances and stewardship.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('app-pastor-dashboard-page', PastorDashboardPage);
export default PastorDashboardPage; 