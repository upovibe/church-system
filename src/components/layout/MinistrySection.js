import App from '@/core/App.js';

class MinistrySection extends App {
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
      <section 
        class="relative py-20 px-4 sm:px-8 md:px-16 lg:px-24 text-white bg-cover bg-center"
        style="background-image: url('/src/public/assets/ministryImage.png');"
      >
        <!-- Overlay for better text readability -->
        <div class="absolute inset-0 bg-black opacity-70 z-0"></div>

        <div class="relative z-10 max-w-4xl  text-left">
          <h3 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-12">
            Join our ministries for every season of life
          </h3>

    <div class="flex flex-wrap gap-2 w-[50%]">
  <!-- Ministry Items -->
  <div class="w-fit bg-yellow-400 text-gray-900 py-4 px-6 rounded-full shadow-lg flex items-center justify-center text-center transition-transform duration-300 hover:scale-105 cursor-pointer">  
    <h4 class="text-xl font-bold">Youth & Kids</h4>  
  </div>
  
  <div class="w-fit bg-white text-gray-900 py-4 px-6 rounded-full shadow-lg flex items-center justify-center text-center transition-transform duration-300 hover:scale-105 cursor-pointer">
    <h4 class="text-xl font-bold">Adults & Families</h4>
  </div>

  <div class="w-fit bg-white text-gray-900 py-4 px-6 rounded-full shadow-lg flex items-center justify-center text-center transition-transform duration-300 hover:scale-105 cursor-pointer">
    <h4 class="text-xl font-bold">Worship & Arts</h4>
  </div>

  <div class="w-fit bg-white text-gray-900 py-4 px-6 rounded-full shadow-lg flex items-center justify-center text-center transition-transform duration-300 hover:scale-105 cursor-pointer">
    <h4 class="text-xl font-bold">Outreach & Missions</h4>
  </div>
</div>


</div>


        </div>
      </section>
    `;
  }
}

customElements.define('ministry-section', MinistrySection);

export default MinistrySection;
