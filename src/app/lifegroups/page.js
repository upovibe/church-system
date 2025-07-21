import App from '@/core/App.js';

import '@/components/layout/home/AddressSection.js';
import '@/components/layout/lifegroups/lifeHero.js';
import '@/components/layout/lifegroups/lifeCards.js';

class LifegroupsPage extends App {
  async connectedCallback() {
    super.connectedCallback();
    document.title = 'Lifegroups | UPO UI';

    // Ensure custom element is defined before rendering

    this.innerHTML = this.render();
  }

  render() {
    return `
            <div>         
                <life-hero></life-hero>
                <life-cards></life-cards>
                <address-section></address-section>                                  
            </div>
        `;
  }
}

customElements.define('app-lifegroups-page', LifegroupsPage);
export default LifegroupsPage;
