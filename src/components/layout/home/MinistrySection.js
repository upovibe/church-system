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
        class="relative pt-10 px-4 sm:px-8  rounded-2xl text-white "
        
      >
        <!-- Overlay for better text readability -->
        <div class="absolute inset-0 bg-black  z-0"></div>

        <div class="relative z-10 mx-auto px-10 py-10 text-left  bg-cover bg-center " style="background-image: url('/src/public/assets/ministryImage.png');" >
          <h3 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-12">
            Join our ministries for every <br/> season of life
          </h3>

        <div class="flex flex-wrap gap-2  w-full lg:w-[30%]">
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
