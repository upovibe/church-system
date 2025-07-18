import App from '@/core/App.js';

class AddressSection extends App {
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
      <section class="bg-black text-white pt-10 px-4 sm:px-8 ">
        <div class=" mx-auto flex flex-col items-center justify-center">
          <!-- Combined Section: Stay Connected Form and Image within one card -->
          <div class="w-full p-8 rounded-xl bg-[#272727] shadow-lg flex flex-col lg:flex-row items-center gap-8">
            <!-- Left Sub-Section (Text Content) -->
            <div class="w-full lg:w-1/2 lg:max-w-[30%] text-center lg:text-left lg:mr-auto">
              <h2 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
                Stay <span class="text-yellow-400">Connected</span>
              </h2>
              <p class="text-lg sm:text-xl text-gray-300 mb-8">
                Sign up to receive weekly encouragement, sermon highlights, and event details.
              </p>
              <div class="flex flex-col  gap-4 justify-start">
                <input 
                  type="email" 
                  placeholder="Enter your email here" 
                  class="flex-grow p-3 rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button class="px-8 py-3 bg-white text-[#272727] font-bold rounded-full shadow-md hover:bg-yellow-500 transition-colors duration-300">
                  Join Now
                </button>
              </div>
            </div>
            
            <!-- Right Sub-Section (Image within the card) -->
            <div class="w-full lg:w-1/2 flex justify-center items-center">
              <img 
                src="https://placehold.co/600x400/6B7280/FFFFFF?text=Stay+Connected" 
                alt="Stay Connected Image" 
                class="w-full h-auto max-h-80 object-cover rounded-xl shadow-md"
                onerror="this.onerror=null;this.src='https://placehold.co/600x400/6B7280/FFFFFF?text=Image+Load+Error';"
              />
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('address-section', AddressSection);

export default AddressSection;
