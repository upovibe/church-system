import App from '@/core/App.js';

class ContactSection extends App {
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
      <section class="bg-gradient-to-br from-gray-900 to-gray-700 py-16 px-6 sm:px-10   font-inter">
        <div class=" mx-auto flex flex-col lg:flex-row gap-12 items-center pt-16">
          <!-- Left Section: Contact Info -->
          <div class="text-white text-center lg:text-left space-y-6 lg:w-1/2 w-full md:max-w-4xl px-16 pb-[8rem]">
            <h3 class="text-4xl sm:text-5xl font-bold leading-tight drop-shadow-md">Contact <span class='text-yellow-400'>Us</span></h3>
            <p class="text-lg sm:text-xl leading-relaxed">
              Our team is here to help with questions, prayer<br/> requests, or next steps.
            </p>
            
            <!-- Avatar Image -->
            <img src="https://placehold.co/128x128/FFD700/000000?text=Avatar" 
                 alt="Team Avatar" 
                 class="w-32 h-32 rounded-full object-cover mx-auto lg:mx-0 border-4 border-yellow-400 shadow-lg" />
            
            <!-- Phone and Email -->
            <div class="flex flex-col items-center sm:flex-row justify-center lg:justify-start text-center gap-6 mt-8">
              <span class="flex items-center space-x-3">
                <!-- Phone Icon (Lucide-react equivalent: Phone) -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <p class="text-lg">0344 567 0890</p>
              </span>
              <span class="flex items-center space-x-3">
                <!-- Email Icon (Lucide-react equivalent: Mail) -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <p class="text-lg">ntubed@gmail.com</p>
              </span>
            </div>
            
            <!-- Social Media Icons -->
            <div class="flex justify-center lg:justify-start gap-4">
              <!-- Instagram Icon (Lucide-react equivalent: Instagram) -->
              <a href="#" class="text-white hover:text-yellow-400 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.5" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <!-- Facebook Icon (Lucide-react equivalent: Facebook) -->
              <a href="#" class="text-white hover:text-yellow-400 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <!-- Twitter Icon (Lucide-react equivalent: Twitter) -->
              <a href="#" class="text-white hover:text-yellow-400 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17-17 12 2.7 1.8 5.6 2.4 8.7 2 4.4 0 7.9-2.9 10.2-7.5C20.9 9.4 22 4 22 4z"></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Right Section: Contact Form -->
          <div class="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl lg:w-1/2 w-full space-y-6 sm:max-w-[50%] lg:max-w-[30%]">
            <div class="flex flex-col sm:flex-row gap-4">
              <input type="text" placeholder="First Name" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Last Name" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="email" placeholder="Email Address" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="tel" placeholder="Phone Number (Optional)" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Write your message here..." class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-y"></textarea>
            <button type="submit" class="w-full py-3 bg-black text-white font-semibold rounded-3xl  transition duration-300 focus:outline-none focus:ring-2  focus:ring-opacity-75">
              Submit Message
            </button>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('contact-section', ContactSection);

export default ContactSection;
