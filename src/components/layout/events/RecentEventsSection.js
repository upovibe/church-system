import App from '@/core/App.js';
// Assuming arrow-left and arrow-right are custom components or will be defined elsewhere
// import '@/components/common/arrow-left.js';
// import '@/components/common/arrow-right.js';

class RecentEventsSection extends App {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = this.render();
    // Log message changed to reflect the correct component name
    console.log('RecentEventsSection connected to the DOM!');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Log message changed to reflect the correct component name
    console.log('RecentEventsSection disconnected from the DOM!');
  }

  render() {
    return `
      <section class="bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-24">
        <div class="max-w-7xl  mb-12">
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-4">
            Recent <span class="text-yellow-400">Events</span>
          </h1>
          
        </div>

        <div class=" mx-auto grid grid-cols-1 sm:grid-cols-2  gap-8">
          <!-- Event Item 1 -->
          <div class="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <img 
              src="https://placehold.co/600x400/3B82F6/FFFFFF?text=Monthly+Prayer" 
              alt="Monthly Prayer Event" 
              class="w-full h-full object-cover"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400/3B82F6/FFFFFF?text=Image+Load+Error';"
            />
            <!-- Text Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4">
              <p class="text-white text-xl font-semibold text-center">Monthly Prayer</p>
            </div>
          </div>

          <!-- Event Item 2 -->
          <div class="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <img 
              src="https://placehold.co/600x400/10B981/FFFFFF?text=Community+Service" 
              alt="Community Service Event" 
              class="w-full h-full object-cover"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400/10B981/FFFFFF?text=Image+Load+Error';"
            />
            <!-- Text Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4">
              <p class="text-white text-xl font-semibold text-center">Community Service</p>
            </div>
          </div>

          <!-- Event Item 3 -->
          <div class="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <img 
              src="https://placehold.co/600x400/F59E0B/FFFFFF?text=Youth+Gathering" 
              alt="Youth Gathering Event" 
              class="w-full h-full object-cover"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400/F59E0B/FFFFFF?text=Image+Load+Error';"
            />
            <!-- Text Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4">
              <p class="text-white text-xl font-semibold text-center">Youth Gathering</p>
            </div>
          </div>

          <!-- Event Item 4 -->
          <div class="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <img 
              src="https://placehold.co/600x400/6B7280/FFFFFF?text=Worship+Night" 
              alt="Worship Night Event" 
              class="w-full h-full object-cover"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400/6B7280/FFFFFF?text=Image+Load+Error';"
            />
            <!-- Text Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4">
              <p class="text-white text-xl font-semibold text-center">Worship Night</p>
            </div>
          </div>
        </div>
        
        <!-- Navigation Arrows -->
        <div class="flex justify-center items-center gap-8 mt-12">
          <!-- Using Font Awesome icons as placeholders if arrow-left/right are not custom elements -->
          <button class="p-4 bg-gray-800 rounded-full text-yellow-400 text-2xl shadow-md hover:bg-gray-700 transition-colors duration-200">
            <i class="fas fa-arrow-left"></i>
          </button>
          <button class="p-4 bg-gray-800 rounded-full text-yellow-400 text-2xl shadow-md hover:bg-gray-700 transition-colors duration-200">
            <i class="fas fa-arrow-right"></i>
          </button>
          
          <!-- If you have custom elements for arrows, you can uncomment these and remove the buttons above -->
          <!-- <arrow-left class="text-yellow-400 text-4xl cursor-pointer hover:opacity-80 transition-opacity"></arrow-left>
          <arrow-right class="text-yellow-400 text-4xl cursor-pointer hover:opacity-80 transition-opacity"></arrow-right> -->
        </div>
      </section>
    `;
  }
}

customElements.define('recent-section', RecentEventsSection);

export default RecentEventsSection;
