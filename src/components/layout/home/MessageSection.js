import App from '@/core/App.js';

class MessageSection extends App {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = this.render();
    console.log('MessageSection connected to the DOM!');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('MessageSection disconnected from the DOM!');
  }

  render() {
    return `
      <section class="bg-black text-white pt-10 px-4 sm:px-8 md:px-16 lg:px-24">
        <div class=" grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-start">
          <!-- Left Content Area -->
          <div class="flex flex-col gap-4">
            <h2 class="text-4xl font-extrabold leading-tight sm:text-6xl ">
              Grow your <br/><span class="text-yellow-400">faith</span> with us
            </h2>
            <p class="text-lg leading-relaxed text-gray-300 sm:text-xl">
              We are a vibrant community of believers <br/>dedicated to worship, fellowship, and service.<br/>
              Our mission is to share God's love, grow in<br/> faith, and make a positive impact in the<br/> world
              through compassionate outreach and meaningful connections.
            </p>
            <dl class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
  <!-- Item 1 -->
  <div class="flex items-start">
    <dt class="flex-shrink-0 text-yellow-400 text-3xl mr-4">
      <i class="fas fa-heart"></i> 
    </dt>
    <dd class="flex-grow">
      <h3 class="text-2xl font-semibold text-white mb-1">Our Core Values</h3>
    </dd>
  </div>

  <!-- Item 2 -->
  <div class="flex items-start">
    <dt class="flex-shrink-0 text-yellow-400 text-3xl mr-4">
      <i class="fas fa-hand-holding-heart"></i> 
    </dt>
    <dd class="flex-grow">
      <h3 class="text-2xl font-semibold text-white mb-1">Community Outreach</h3>
    </dd>
  </div>

  <!-- Item 3 -->
  <div class="flex items-start">
    <dt class="flex-shrink-0 text-yellow-400 text-3xl mr-4">
      <i class="fas fa-church"></i> 
    </dt>
    <dd class="flex-grow">
      <h3 class="text-2xl font-semibold text-white mb-1">Worship Services</h3>
    </dd>
  </div>

  <!-- Item 4 -->
  <div class="flex items-start">
    <dt class="flex-shrink-0 text-yellow-400 text-3xl mr-4">
      <i class="fas fa-church"></i> 
    </dt>
    <dd class="flex-grow">
      <h3 class="text-2xl font-semibold text-white mb-1">Worship Services</h3>
    </dd> 
  </div>
</dl>

          </div>
          
          <!-- Right Image Area -->
          <div class="flex justify-center items-center">
            <img
              src="/src/public/assets/heptagonImage.png"
              alt="Community Image"
              
              
            />
          </div>
        </div>
        
        
        
      </section>
    `;
  }
}

customElements.define('message-section', MessageSection);

export default MessageSection;
