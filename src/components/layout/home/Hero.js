import App from '@/core/App.js';
import store from '@/core/store.js';

class Hero extends App {
  constructor() {
    super();
    this.images = [
      '/src/public/assets/worshippers.png',
      '/src/public/assets/worshippers2.png',
      '/src/public/assets/worshippers3.png'
    ];
    this.currentIndex = 0;
    this.activeBg = 1; // To track which background is active
  }

  connectedCallback() {
    super.connectedCallback();
    this.bg1 = this.querySelector('#hero-bg-1');
    this.bg2 = this.querySelector('#hero-bg-2');
    
    // Preload images
    this.images.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    this.imageInterval = setInterval(() => this.changeImage(), 5000);
  }

  disconnectedCallback() {
    clearInterval(this.imageInterval);
  }

  changeImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    const nextImage = this.images[this.currentIndex];

    if (this.activeBg === 1) {
      // bg2 is hidden, so update it and fade it in
      this.bg2.style.backgroundImage = `url(${nextImage})`;
      this.bg1.style.opacity = 0;
      this.bg2.style.opacity = 1;
      this.activeBg = 2;
    } else {
      // bg1 is hidden, so update it and fade it in
      this.bg1.style.backgroundImage = `url(${nextImage})`;
      this.bg2.style.opacity = 0;
      this.bg1.style.opacity = 1;
      this.activeBg = 1;
    }
  }

  render() {
    return `
      <section class="relative w-screen h-screen flex items-center px-[10ch]">
        <!-- Background Image Containers -->
        <div 
          id="hero-bg-1"
          class="absolute inset-0 bg-cover bg-center"
          style="background-image: url('/src/public/assets/worshippers.png'); transition: opacity 2.5s ease-in-out; opacity: 1;">
        </div>
        <div 
          id="hero-bg-2"
          class="absolute inset-0 bg-cover bg-center"
          style="transition: opacity 2.5s ease-in-out; opacity: 0;">
        </div>

        <!-- Optional overlay -->
        <div class="absolute inset-0 bg-black/50 z-10"></div>

        <!-- Hero content -->
        <div class="relative z-20 bottom-[2ch] sm:bottom-[4ch] text-white leading-tight">
          <h1 class="text-[7ch] md:text-[11ch]">
            A Place to <br />
            Belong, <span class="text-yellow-400">Believe</span>, <br />
            and Become.
          </h1>

          <div class="space-y-2 mt-2 text-gray-500 ">
            <h3 class='text-2xl tracking-wide' >There's a place for you here – come as</h3>
            <h3  class='text-2xl  tracking-wide '>you are and find the next step.</h3>
          </div>
          <button class='bg-white text-black/80 border border-black px-6 py-3 mt-8 rounded-full font-bold text-lg'> Plan Your Visit</button>
        </div>
      </section>
    `;
  }
}

customElements.define('hero-section', Hero);

export default Hero;
