import App from '@/core/App.js';
import '@/components/ui/Box.js';
import '@/components/layout/home/Hero.js';
import '@/components/layout/home/MessageSection.js';
import '@/components/layout/home/ProgramSection.js';
import '@/components/layout/home/MinistrySection.js';
import '@/components/layout/home/AddressSection.js';

/**
 * Root Page Component (/)
 *
 * This is the home page of the application.
 * It now renders within the global RootLayout.
 */
class RootPage extends App {
  connectedCallback() {
    super.connectedCallback();
    document.title = 'Home | UPO UI';
  }

  render() {
    return `
            <div class="">         
                    <hero-section></hero-section>  
                    <message-section></message-section>
                    <program-section></program-section>  
                    <ministry-section></ministry-section>
                    <address-section></address-section>     
            </div>
        `;
  }
}

customElements.define('app-root-page', RootPage);
export default RootPage;
