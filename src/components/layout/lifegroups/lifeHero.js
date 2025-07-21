import App from '@/core/App.js';

class LifeHero extends App {
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
      <section class="relative bg-black bg-cover bg-center py-24 px-24 min-h-[50vh] flex items-center justify-start text-left"
               style="background-image: url('/src/public/assets/LifegroupsImage.png');">
        
        <!-- Overlay for better text readability on top of the background image -->
        <div class="absolute inset-0 bg-black opacity-60"></div> 
        
        <!-- Content container, positioned relatively and above the overlay -->
        <div class="relative z-10 text-white max-w-3xl space-y-4 text-left">
          <!-- Main heading with responsive font sizes and bold styling -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight font-inter drop-shadow-lg">
            Life Groups
          </h1>
          <!-- Paragraph with responsive font sizes and improved line spacing -->
          <p class="text-xl text-white sm:text-2xl leading-relaxed font-inter drop-shadow-md">
            Join our Life Groups and stay <br/>connected and discover what’s <br/> happening at Living Word.
          </p>
        </div>
      </section>
    `;
  }
}

customElements.define('life-hero', LifeHero);

export default LifeHero;
