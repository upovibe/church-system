import App from '@/core/App.js';

/**
 * Reusable Life Card Component for displaying individual life group details.
 * It takes attributes for image source, description text, and button text.
 */
class LifeCard extends App {
  constructor() {
    super();
    // Set default values for attributes
    this.imageSrc =
      this.getAttribute('image-src') ||
      'https://placehold.co/400x250/a0a0a0/ffffff?text=Life+Group+Image';
    this.description =
      this.getAttribute('description') ||
      'Discover a community where you can grow, share, and connect with others who share your interests and faith journey.';
    this.buttonText = this.getAttribute('button-text') || 'Join Group';
    this.link = this.getAttribute('link') || '#';
  }

  connectedCallback() {
    super.connectedCallback();
    this.render(); // Call render to set innerHTML
  }

  // Observe attribute changes to re-render the component
  static get observedAttributes() {
    return ['image-src', 'description', 'button-text', 'link'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = newValue; // Convert kebab-case to camelCase
      this.render(); // Re-render when attributes change
    }
  }

  render() {
    this.innerHTML = `
      <div class="flex flex-col items-center bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] h-full">
        <!-- Image section -->
        <div class="w-full h-48 sm:h-56 overflow-hidden">
          <img src="${this.imageSrc}" alt="Life Group Image" class="w-full h-full object-cover rounded-t-lg" 
               onerror="this.onerror=null;this.src='https://placehold.co/400x250/a0a0a0/ffffff?text=Image+Not+Found&fontsize=24';" />
        </div>
        
        <!-- Text content and button section -->
        <div class="flex flex-col justify-between p-6 text-gray-800 flex-grow w-full">
          <p class="text-base leading-relaxed text-center mb-6 font-inter">${this.description}</p>
          <button onclick="window.location.href='${this.link}'"
                  class=" w-full sm:w-[40%] py-3 mx-auto bg-yellow-500 text-white font-semibold rounded-full shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition duration-300 ease-in-out font-inter">
            ${this.buttonText}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('life-card', LifeCard);

/**
 * Life Cards Section Component to display a grid of LifeGroup cards.
 */
class LifeCards extends App {
  constructor() {
    super();
    this.lifeGroups = [
      {
        id: 'group-1',
        image: 'https://placehold.co/400x250/4CAF50/ffffff?text=Bible+Study',
        description:
          'Dive deeper into the Word of God with our engaging Bible study groups. Explore scriptures, discuss insights, and grow in your faith together.',
        buttonText: 'Join Study Group',
        link: '#group-1',
      },
      {
        id: 'group-2',
        image: 'https://placehold.co/400x250/2196F3/ffffff?text=Evangelism',
        description:
          'Serve our local community through various outreach initiatives. Make a tangible difference by helping those in need and spreading love.',
        buttonText: 'Volunteer Now',
        link: '#group-2',
      },
      {
        id: 'group-3',
        image:
          'https://placehold.co/400x250/FFC107/ffffff?text=Youth+Fellowship',
        description:
          "A vibrant fellowship for young adults to connect, share experiences, and navigate life's challenges with faith and support.",
        buttonText: 'Connect with Youth',
        link: '#group-3',
      },
      {
        id: 'group-4',
        image:
          'https://placehold.co/400x250/9C27B0/ffffff?text=Prayer+Warriors',
        description:
          'Join our dedicated prayer warriors as we intercede for our church, community, and global needs. Experience the power of collective prayer.',
        buttonText: 'Join Prayer Group',
        link: '#group-4',
      },
    ];
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
      <section class="bg-gray-800 py-16 px-6 sm:px-10 lg:px-20">
        <div class="max-w-[70%] mx-auto grid grid-cols-1 sm:grid-cols-2  gap-8">
          ${this.lifeGroups
            .map(
              (group) => `
            <life-card 
              image-src="${group.image}" 
              description="${group.description}" 
              button-text="${group.buttonText}"
              link="${group.link}">
            </life-card>
          `,
            )
            .join('')}
        </div>
      </section>
    `;
  }
}

customElements.define('life-cards', LifeCards);

export default LifeCards;
