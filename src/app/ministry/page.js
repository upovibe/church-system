import App from '@/core/App.js';
import '@/components/layout/ministry/SectionMinistry.js';
import '@/components/layout/ministry/SectionCards.js';
import '@/components/layout/home/AddressSection.js';

class MinistryPage extends App {
  async connectedCallback() {
    super.connectedCallback();
    document.title = 'Ministry | UPO UI';

    // Ensure custom element is defined before rendering
    await customElements.whenDefined('section-ministry');
    this.innerHTML = this.render();
  }

  render() {
    return `
            <div>         
                <section-ministry></section-ministry> 
                <section-cards></section-cards> 
                <address-section></address-section>                                  
            </div>
        `;
  }
}

customElements.define('app-ministry-page', MinistryPage);
export default MinistryPage;
