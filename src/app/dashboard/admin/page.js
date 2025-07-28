import App from '@/core/App.js';
import api from '@/services/api.js';

/**
 * Admin Dashboard Page Component (/dashboard/admin)
 * 
 * Comprehensive admin dashboard with statistics cards.
 */
class AdminDashboardPage extends App {
    constructor() {
        super();
        this.stats = {
            users: 0,
            teams: 0,
            sermons: 0,
            events: 0,
            lifeGroups: 0,
            testimonials: 0,
            ministries: 0,
            galleries: 0,
            videoGalleries: 0
        };
        this.loading = true;
        this.currentUser = null;
        
        // Initialize state properly
        this.set('stats', this.stats);
        this.set('loading', true);
        this.set('currentUser', null);
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'Admin Dashboard | Church System';
        this.loadUserData();
        this.loadStats();
    }

    async loadStats() {
        try {
            this.set('loading', true);
            
            const token = localStorage.getItem('token');
            if (!token) {
                Toast.show({
                    title: 'Authentication Error',
                    message: 'Please log in to view dashboard',
                    variant: 'error',
                    duration: 3000
                });
                return;
            }

            // Load all statistics in parallel
            const [
                usersResponse,
                teamsResponse,
                sermonsResponse,
                eventsResponse,
                lifeGroupsResponse,
                testimonialsResponse,
                ministriesResponse,
                galleriesResponse,
                videoGalleriesResponse
            ] = await Promise.all([
                api.withToken(token).get('/users'),
                api.withToken(token).get('/teams'),
                api.withToken(token).get('/sermons'),
                api.withToken(token).get('/events'),
                api.withToken(token).get('/life-groups'),
                api.withToken(token).get('/testimonials'),
                api.withToken(token).get('/news'),
                api.withToken(token).get('/galleries'),
                api.withToken(token).get('/video-galleries')
            ]);

            this.set('stats', {
                users: usersResponse.data?.length || usersResponse.data.data?.length || 0,
                teams: teamsResponse.data.data?.length || 0,
                sermons: sermonsResponse.data.data?.length || 0,
                events: eventsResponse.data.data?.length || 0,
                lifeGroups: lifeGroupsResponse.data.data?.length || 0,
                testimonials: testimonialsResponse.data.data?.length || 0,
                ministries: ministriesResponse.data.data?.length || 0,
                galleries: galleriesResponse.data.data?.length || 0,
                videoGalleries: videoGalleriesResponse.data.data?.length || 0
            });
            
        } catch (error) {
            console.error('❌ Error loading dashboard stats:', error);
            
            Toast.show({
                title: 'Error',
                message: 'Failed to load dashboard statistics',
                variant: 'error',
                duration: 3000
            });
        } finally {
            this.set('loading', false);
        }
    }

    async loadUserData() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            // Get current user data
            const userResponse = await api.withToken(token).get('/auth/me');
            this.set('currentUser', userResponse.data);
            
        } catch (error) {
            console.error('❌ Error loading user data:', error);
        }
    }

    render() {
        const stats = this.get('stats') || {
            users: 0,
            teams: 0,
            sermons: 0,
            events: 0,
            lifeGroups: 0,
            testimonials: 0,
            ministries: 0,
            galleries: 0,
            videoGalleries: 0
        };
        const loading = this.get('loading');
        const currentUser = this.get('currentUser');
        const userName = currentUser?.name || 'Admin';
        
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="bg-white shadow rounded-lg p-6">
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">
                        Admin Dashboard
                    </h1>
                    <p class="text-gray-600">
                        Welcome <span class="font-semibold text-blue-600">${userName}</span> as an Admin. Here you can manage all aspects of the church.
                    </p>
                </div>

                ${loading ? `
                    <!-- Loading Skeleton -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div class="bg-white shadow rounded-lg p-6 animate-pulse">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div class="ml-4 flex-1">
                                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div class="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white shadow rounded-lg p-6 animate-pulse">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div class="ml-4 flex-1">
                                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div class="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white shadow rounded-lg p-6 animate-pulse">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div class="ml-4 flex-1">
                                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div class="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white shadow rounded-lg p-6 animate-pulse">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div class="ml-4 flex-1">
                                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div class="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : `
                    <!-- Statistics Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <!-- Users Card -->
                        <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-users text-blue-600 text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Total Users</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.users}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Teams/Leaders Card -->
                        <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-user-tie text-green-600 text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Team Leaders</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.teams}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Sermons Card -->
                        <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-bible text-purple-600 text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Sermons</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.sermons}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Events Card -->
                        <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-calendar-alt text-red-600 text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Events</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.events}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Life Groups Card -->
                        <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-hands-helping text-indigo-600 text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Life Groups</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.lifeGroups}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Testimonials Card -->
                        <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-quote-left text-yellow-600 text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Testimonials</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.testimonials}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Ministries Card -->
                        <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-church text-teal-600 text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Ministries</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.ministries}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Photo Gallery Card -->
                        <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-images text-pink-600 text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Photo Galleries</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.galleries}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Video Gallery Card -->
                        <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-video text-orange-600 text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Video Galleries</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.videoGalleries}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            <a href="/dashboard/admin/users" class="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <i class="fas fa-users text-blue-600 text-xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Users</span>
                            </a>
                            <a href="/dashboard/admin/leaders" class="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                <i class="fas fa-user-tie text-green-600 text-xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Leaders</span>
                            </a>
                            <a href="/dashboard/admin/sermons" class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                <i class="fas fa-bible text-purple-600 text-xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Sermons</span>
                            </a>
                            <a href="/dashboard/admin/events" class="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                <i class="fas fa-calendar-alt text-red-600 text-xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Events</span>
                            </a>
                            <a href="/dashboard/admin/life-groups" class="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                                <i class="fas fa-hands-helping text-indigo-600 text-xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Life Groups</span>
                            </a>
                            <a href="/dashboard/admin/galleries" class="flex flex-col items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                                <i class="fas fa-images text-pink-600 text-xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Galleries</span>
                            </a>
                            <a href="/dashboard/admin/video-galleries" class="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                                <i class="fas fa-video text-orange-600 text-xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Video</span>
                            </a>
                        </div>
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('app-admin-dashboard-page', AdminDashboardPage);
export default AdminDashboardPage; 