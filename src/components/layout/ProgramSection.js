import App from '@/core/App.js';

class ProgramSection extends App {
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
      <section class="bg-black text-white py-16 px-4 sm:px-8 ">
        <div class=" mx-auto">
          
          <!-- Top Section: Video and Image Side-by-Side -->
         <div class="flex flex-col sm:flex-row items-center justify-center gap-12 mb-16">
  <!-- Video Container -->
  <div class="w-full sm:w-1/2 aspect-video rounded-xl shadow-lg overflow-hidden border border-gray-700">
    <video 
      src="https://www.w3schools.com/html/mov_bbb.mp4" 
      controls 
      class="w-full h-full "
      poster="https://placehold.co/600x350/1F2937/D1D5DB?text=Video+Thumbnail"
    >
      Your browser does not support the video tag.
    </video>
  </div>

  <!-- Image Container -->
  <div class="w-full sm:w-1/2 aspect-video rounded-xl shadow-lg overflow-hidden">
    <img 
      src="/src/public/assets/highlightImage.png"
      alt="Program Highlight" 
      class="w-full h-full object-cover"
    />
  </div>
</div>

          </div>

          <!-- Bottom Section: Text and Image Side-by-Side (reversed on large screens) -->
          <div class="flex flex-col lg:flex-row items-center gap-12">
            <!-- Text Content -->
           <div class="flex flex-col w-full lg:w-1/2 space-y-[2ch] text-left items-start self-start pt-8">
  <h2 class="text-6xl sm:text-8xl font-extrabold leading-tight text-yellow-400">
    Stories of <br/>Transformation
  </h2>
  <p class="text-lg sm:text-3xl text-gray-500 leading-relaxed tracking-widest px-4 pt-14">
    “When I walked through these doors, <br/>I found hope, family, and purpose.”
  </p>
</div>

            
            <!-- Image Container -->
            <div class="w-full lg:w-1/2 rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/src/public/assets/prayerImage.png" 
                alt="Girl Praying" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>
    `;
  }
}

customElements.define('program-section', ProgramSection);

export default ProgramSection;
