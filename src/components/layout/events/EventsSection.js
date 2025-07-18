import App from '@/core/App.js';

class EventsSection extends App {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = this.render();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return `
      <section class="relative bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-24">
        <div class=" mr-auto pt-[10ch] text-left mb-12">
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-4 text-left">
            Upcoming <span class="text-yellow-400">Events</span>
          </h1>
          <!-- Assuming app-indicator is a custom element that renders a visual indicator -->
          
          <p class="text-lg sm:text-xl text-gray-300 max-w-3xl  mb-8 text-left">
            Stay connected and discover what’s happening at Living Word. Join us for fellowship, worship, and community engagement.
          </p>
          <div class="flex flex-col sm:flex-row justify-start gap-4">
            <button class="px-8 py-3 bg-yellow-500 text-gray-900 font-bold rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-300 transform hover:scale-105">
              Join Event
            </button>
            <button class="px-8 py-3 bg-white text-gray-900 font-bold rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
              Webinar Series
            </button>
          </div>
        </div>

        <div class="max-w-[99%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          <!-- Event Image 1 -->
          <div class="rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <img 
              src="https://placehold.co/600x400/3B82F6/FFFFFF?text=Event+1" 
              alt="Event Image 1" 
              class="w-full h-64 object-cover"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400/3B82F6/FFFFFF?text=Image+Load+Error';"
            />
            <div class="p-4 bg-gray-800">
              <h3 class="text-xl font-semibold mb-2">Community Gathering</h3>
              <p class="text-gray-400 text-sm">Join us for a wonderful time of fellowship and food.</p>
              <p class="text-yellow-400 text-sm mt-2">Date: July 20, 2025 | Time: 6:00 PM</p>
            </div>
          </div>

          <!-- Event Image 2 -->
          <div class="rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <img 
              src="https://placehold.co/600x400/10B981/FFFFFF?text=Event+2" 
              alt="Event Image 2" 
              class="w-full h-64 object-cover"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400/10B981/FFFFFF?text=Image+Load+Error';"
            />
            <div class="p-4 bg-gray-800">
              <h3 class="text-xl font-semibold mb-2">Youth Summer Camp</h3>
              <p class="text-gray-400 text-sm">An exciting week of activities, learning, and fun for kids!</p>
              <p class="text-yellow-400 text-sm mt-2">Date: August 5-10, 2025 | Time: All Day</p>
            </div>
          </div>

          <!-- Event Image 3 -->
          <div class="rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <img 
              src="https://placehold.co/600x400/F59E0B/FFFFFF?text=Event+3" 
              alt="Event Image 3" 
              class="w-full h-64 object-cover"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400/F59E0B/FFFFFF?text=Image+Load+Error';"
            />
            <div class="p-4 bg-gray-800">
              <h3 class="text-xl font-semibold mb-2">Bible Study & Fellowship</h3>
              <p class="text-gray-400 text-sm">Deepen your understanding of the Word every Wednesday.</p>
              <p class="text-yellow-400 text-sm mt-2">Date: Every Wednesday | Time: 7:00 PM</p>
            </div>
          </div>
        </div >
      </section>
    `;
  }
}

customElements.define('events-section', EventsSection);

export default EventsSection;
