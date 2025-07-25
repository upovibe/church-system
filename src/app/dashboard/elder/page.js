import App from '@/core/App.js';

/**
 * Elder Dashboard Page Component (/dashboard/elder)
 * 
 * Elder dashboard with church leadership and support features.
 */
class ElderDashboardPage extends App {
    connectedCallback() {
        super.connectedCallback();
        document.title = 'Elder Dashboard | Church System';
    }

    render() {
        return `
            <div class="space-y-6">
                <div class="bg-white shadow rounded-lg p-6">
                    <h1 class="text-2xl font-bold text-gray-900 mb-4">
                        Elder Dashboard
                    </h1>
                    <p class="text-gray-600">
                        Welcome to your elder dashboard. Here you can support church leadership and ministry activities.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Church Council</h3>
                        <p class="text-gray-600">Participate in church council meetings and decisions.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Member Care</h3>
                        <p class="text-gray-600">Provide pastoral care and support to church members.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Ministry Support</h3>
                        <p class="text-gray-600">Support various ministry activities and programs.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Discipleship</h3>
                        <p class="text-gray-600">Mentor and disciple church members in their faith journey.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Church Governance</h3>
                        <p class="text-gray-600">Assist with church governance and policy matters.</p>
                    </div>

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Outreach</h3>
                        <p class="text-gray-600">Support church outreach and evangelism efforts.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('app-elder-dashboard-page', ElderDashboardPage);
export default ElderDashboardPage; 