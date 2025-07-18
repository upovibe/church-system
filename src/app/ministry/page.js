import App from '@/core/App.js';
import '@/components/layout/ministry/MinistrySection.js';
import '@/components/layout/events/RecentEventsSection.js';

class MinistryPage extends App {
  async connectedCallback() {
    super.connectedCallback();
    document.title = 'Ministry | UPO UI';

    // Ensure custom element is defined before rendering
    await customElements.whenDefined('ministry-section');
    this.innerHTML = this.render();
  }

  render() {
    return `
            <div >         
                <ministry-section></ministry-section> 
                <recent-section></recent-section>                       
            </div>
        `;
  }
}

customElements.define('ministry-page', MinistryPage);
export default MinistryPage;
