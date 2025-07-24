import App from '@/core/App.js';
import '@/components/layout/publicLayout/MinistryView.js';

/**
 * Individual Ministry Page
 * 
 * Displays detailed information for a specific ministry based on slug
 */
class MinistryPage extends App {
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
                <ministry-view slug="${this.slug || ''}"></ministry-view>
            </div>
        `;
    }
}

customElements.define('app-ministry-page', MinistryPage);
export default MinistryPage; 