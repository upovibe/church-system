import App from '@/core/App.js';

/**
 * Life Group List Component
 *
 * Simple component to display life group list.
 */
class LifeGroupList extends App {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    render() {
        return `
            <div class="text-center py-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">Life Group List</h2>
                <p class="text-gray-600">Life group list component loaded successfully.</p>
            </div>
        `;
    }
}

customElements.define('life-group-list', LifeGroupList);
export default LifeGroupList; 