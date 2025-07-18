import App from '@/core/App.js';

/**
 * App Footer Component
 *
 * A simple, consistent footer for all pages.
 */
class Footer extends App {
  render() {
    return `
      <footer class="bg-black text-white pt-10 px-4 sm:px-8">
        <div class="mx-auto p-20 flex flex-col gap-12 bg-[#191C19] rounded-xl">
          
          <!-- Top Row: Living Word + Contact Us + Explore Our Success -->
          <div class="flex flex-col lg:flex-row justify-between items-start gap-12">
            
            <!-- Left Group: Living Word and Contact Us -->
            <div class="flex flex-col sm:flex-row gap-12 w-full lg:w-3/4">
              <!-- Living Word / Navigation Section -->
              <div class="flex flex-col items-start text-left">
                <h3 class="text-4xl font-extrabold text-yellow-400 mb-4">Living Word</h3>
                <div class="flex flex-wrap gap-x-4 gap-y-2 text-gray-400 text-lg max-w-[60%]">
                  <a href="#" class="hover:text-white transition-colors duration-200">Home</a> /
                  <a href="#" class="hover:text-white transition-colors duration-200">Services</a> /
                  <a href="#" class="hover:text-white transition-colors duration-200">Ministries</a> /
                  <a href="#" class="hover:text-white transition-colors duration-200">About Us</a> /
                  <a href="#" class="hover:text-white transition-colors duration-200">Contact Us</a>
                </div>
              </div>

              <!-- Contact Us / Address Section -->
              <address class="not-italic text-left">
                <h4 class="text-2xl font-bold text-white mb-4">Contact Us</h4>
                <p class="text-gray-400 mb-4">(9am - 6pm, Monday - Friday)</p>

                <div class="flex flex-col sm:flex-row gap-8 mt-6">
                  <!-- Location -->
                  <div>
                    <p class="text-yellow-400 font-semibold text-lg mb-1">Location</p>
                    <p class="text-gray-400">123 Faith Street, Washington, DC 20001</p>
                  </div>
                  <!-- Email -->
                  <div>
                    <p class="text-yellow-400 font-semibold text-lg mb-1">Email</p>
                    <p class="text-gray-400">info@livingwordchurch.org</p>
                  </div>
                </div>
              </address>
            </div>

            <!-- Right Section: Explore Our Success -->
            <div class="w-full lg:w-1/4 text-center lg:text-right">
              <h4 class="text-2xl font-bold text-white mb-4">Explore Our Success</h4>
              <p class="text-gray-400 leading-relaxed">
                Learn about our impact, testimonials, and how we're growing together as a community.
                Visit our "About Us" page for more details.
              </p>
              <button class="mt-6 px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-300">
                Read Our Story
              </button>
            </div>
          </div>

          <!-- Gradient Card: Positioned below top sections -->
          <div class="w-full mx-auto p-8 rounded-xl bg-gradient-to-r from-gray-900 to-yellow-500 text-white shadow-lg">
            <h5 class="text-xl font-bold mb-2">Stay Connected</h5>
            <p class="text-white/90">
              Sign up for our newsletter and be the first to hear about events, teachings, and community updates.
            </p>
          </div>
        </div>

        <!-- Footer bottom bar -->
        <div class="text-center text-gray-500 text-sm mt-12">
          &copy; ${new Date().getFullYear()} Living Word Church. All rights reserved.
        </div>
      </footer>
    `;
  }
}

customElements.define('app-footer', Footer);
export default Footer;
