import App from '@/core/App.js';
import '@/components/layout/publicLayout/SermonView.js';

/**
 * Individual Sermon Page
 * 
 * Displays detailed information for a specific sermon based on slug
 */
class SermonPage extends App {
    constructor() {
        super();
        this.slug = null;
    }

    connectedCallback() {
        super.connectedCallback();
        
        // Get slug from URL path
        const pathSegments = window.location.pathname.split('/');
        this.slug = pathSegments[pathSegments.length - 1];
    }

    render() {
        return `
            <div class="min-h-screen">
                <sermon-view slug="${this.slug || ''}"></sermon-view>
            </div>
        `;
    }
}

customElements.define('app-sermon-page', SermonPage);
export default SermonPage; 