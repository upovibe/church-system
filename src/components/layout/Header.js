import App from '@/core/App.js';
import store from '@/core/store.js';
import '@/components/ui/Link.js';
import '@/components/ui/Button.js';

/**
 * 📌 App Header Component
 *
 * Displays the main site header with the UPO UI logo and navigation links.
 * Includes a glassmorphic background and responsive icon-to-text behavior.
 */
class Header extends App {
  unsubscribe = null;

  connectedCallback() {
  super.connectedCallback();

  this.unsubscribe = store.subscribe((newState) => {
    this.set('isAuthenticated', newState.isAuthenticated);
  });

  setTimeout(() => {
    const navItems = this.querySelectorAll('.nav-item');

    const activate = (el) => {
      navItems.forEach((item) => {
        item.classList.remove('text-yellow-400');
        item.querySelector('.indicator')?.classList.add('hidden');
      });

      el.classList.add('text-yellow-400');
      el.querySelector('.indicator')?.classList.remove('hidden');
    };

    // Initialize first item
    activate(navItems[0]);

    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        activate(item);
      });
    });
  }, 0);
}

 

  disconnectedCallback() {
    // Prevent memory leaks
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return `
        <header class="fixed top-0 left-0 right-0 z-50 py-10 px-[10ch] bg-white/70 backdrop-blur">
      <nav class='flex justify-between items-center'>
        <ul class="flex space-x-[10ch] text-lg font-medium text-gray-700" id="nav-list">
  <li class="nav-item cursor-pointer relative flex flex-col items-center">
    <span>Home</span>
    <div class="indicator hidden h-[2px] w-full bg-yellow-400 transition-all duration-300 ease-in-out"></div>
  </li>
  <li class="nav-item cursor-pointer relative flex flex-col items-center">
    <span>Services & Events</span>
    <div class="indicator hidden h-[2px] w-full bg-yellow-400 transition-all duration-300 ease-in-out"></div>
  </li>
  <li class="nav-item cursor-pointer relative flex flex-col items-center">
    <span>Ministries</span>
    <div class="indicator hidden h-[2px] w-full bg-yellow-400 transition-all duration-300 ease-in-out"></div>
  </li>
  <li class="nav-item cursor-pointer relative flex flex-col items-center">
    <span>Life Groups</span>
    <div class="indicator hidden h-[2px] w-full bg-yellow-400 transition-all duration-300 ease-in-out"></div>
  </li>
  <li class="nav-item cursor-pointer relative flex flex-col items-center">
    <span>Give</span>
    <div class="indicator hidden h-[2px] w-full bg-yellow-400 transition-all duration-300 ease-in-out"></div>
  </li>
</ul>

        <div>
          <button class='rounded-full px-4 py-2 border border-black'>Contact Us</button>
        </div>
      </nav>
    </header>
    `;
  }
}

customElements.define('app-header', Header);
export default Header;
