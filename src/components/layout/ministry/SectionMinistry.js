import App from '@/core/App.js';

class SectionMinistry extends App {
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
      <section class="relative bg-black bg-cover bg-[center_top_35%] brightness-125 py-20 px-6 sm:px-10 lg:px-20 "
               style="background-image: url('/src/public/assets/worshippers.png');">
        
        <!-- Overlay for better text readability on top of the background image -->
        <div class="absolute inset-0 bg-black opacity-50"></div> 
        
        <!-- Content container, positioned relatively and above the overlay -->
        <div class="relative z-10 text-white text-left max-w-2xl space-y-4 pt-20">
          <!-- Main heading with responsive font sizes and a highlighted span -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-inter">
            <span class="text-yellow-400">Ministries</span> at<br/>Living Word
          </h1>
          <!-- Paragraph with responsive font sizes and improved line spacing -->
          <p class="text-lg sm:text-xl leading-relaxed font-inter max-w-[60%]">
            Whether you're looking to deepen your faith, serve others, or build community, we have a ministry for you! Explore our diverse ministries below to find your perfect place to connect and get involved.
          </p>
        </div>
      </section>
    `;
  }
}

customElements.define('section-ministry', SectionMinistry);

export default SectionMinistry;
