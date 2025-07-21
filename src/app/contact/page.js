import App from '@/core/App.js';

import '@/components/layout/contact/ContactSection.js';
import '@/components/layout/contact/MapSection.js';

class ContactPage extends App {
  async connectedCallback() {
    super.connectedCallback();
    document.title = 'Contact | UPO UI';

    // Ensure custom element is defined before rendering

    this.innerHTML = this.render();
  }

  render() {
    return `
            <div>         
                <contact-section></contact-section>
                <map-section></map-section>
                                            
            </div>
        `;
  }
}

customElements.define('app-contact-page', ContactPage);
export default ContactPage;
