import App from '@/core/App.js';
import '@/components/layout/events/EventsSection.js';
import '@/components/layout/events/RecentEventsSection.js';

class EventsPage extends App {
  async connectedCallback() {
    super.connectedCallback();
    document.title = 'Events | UPO UI';

    // Ensure custom element is defined before rendering
    await customElements.whenDefined('events-section');
    this.innerHTML = this.render();
  }

  render() {
    return `
            <div >         
               <events-section></events-section> 
                <recent-section></recent-section>                       
            </div>
        `;
  }
}

customElements.define('app-events-page', EventsPage);
export default EventsPage;
