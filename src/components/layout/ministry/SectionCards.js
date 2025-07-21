import App from '@/core/App.js';

/**
 * Reusable Card Component for displaying ministry information.
 * It takes attributes for image source, title, description, and a link.
 * Now includes functionality to expand/collapse the description text.
 */
class CardComponent extends App {
  constructor() {
    super();
    // Set default values for attributes
    this.imageSrc =
      this.getAttribute('image-src') ||
      'https://placehold.co/400x300/e0e0e0/333333?text=Ministry+Image';
    this.title = this.getAttribute('title') || 'Ministry Title';
    this.description =
      this.getAttribute('description') ||
      'A brief description of the ministry, highlighting its purpose and activities. This is a longer example to demonstrate the expand/collapse functionality. When the "Show More" button is clicked, this text will fully reveal itself, and the card will expand vertically to accommodate it.';
    this.isExpanded = false; // Internal state to track if the description is expanded
  }

  connectedCallback() {
    super.connectedCallback();
    this.render(); // Initial render
    this.addEventListeners(); // Add event listener for the button
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListeners();
  }

  // Observe attribute changes to re-render the component
  static get observedAttributes() {
    return ['image-src', 'title', 'description']; // 'link' is no longer directly used for navigation
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = newValue; // Convert kebab-case to camelCase
      this.render(); // Re-render when attributes change
      this.addEventListeners(); // Re-add event listeners after re-render
    }
  }

  addEventListeners() {
    const toggleButton = this.querySelector('.toggle-description-btn');
    if (toggleButton) {
      toggleButton.removeEventListener(
        'click',
        this.toggleDescription.bind(this),
      ); // Prevent duplicate listeners
      toggleButton.addEventListener('click', this.toggleDescription.bind(this));
    }
  }

  removeEventListeners() {
    const toggleButton = this.querySelector('.toggle-description-btn');
    if (toggleButton) {
      toggleButton.removeEventListener(
        'click',
        this.toggleDescription.bind(this),
      );
    }
  }

  toggleDescription() {
    this.isExpanded = !this.isExpanded; // Toggle the state
    this.render(); // Re-render to apply new classes and button text
    this.addEventListeners(); // Re-add event listeners after re-render
  }

  render() {
    // Determine classes for description based on expanded state
    const descriptionClasses = this.isExpanded
      ? 'max-h-full overflow-visible' // Show full text
      : 'max-h-24 overflow-hidden'; // Truncate text, adjust max-h as needed for initial view

    // Determine button text based on expanded state
    const buttonText = this.isExpanded ? 'Show Less' : 'Show More';

    this.innerHTML = `
      <div class="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-lg w-full max-w-[90%] mx-auto transform transition-all duration-300 ease-in-out hover:scale-[1.02]">
        <!-- Image section, occupying 40% on larger screens -->
        <div class="w-full sm:w-2/5 sm:h-60 m-4 overflow-hidden">
          <img src="${this.imageSrc}" alt="${this.title}" class="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none" 
               onerror="this.onerror=null;this.src='https://placehold.co/400x300/e0e0e0/333333?text=Image+Not+Found';" />
        </div>
        
        <!-- Text content section, occupying 60% on larger screens -->
        <div class="w-full sm:w-3/5 p-6 space-y-3 text-gray-800">
          <h3 class="text-2xl font-bold text-blue-700 font-inter">${this.title}</h3>
          <!-- Description container with dynamic height based on expanded state -->
          <div class="relative transition-all duration-300 ease-in-out ${descriptionClasses}">
            <p class="text-base leading-relaxed font-inter ">${this.description}</p>
            <!-- Optional fade effect for truncated text -->
            ${!this.isExpanded ? `<div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>` : ''}
          </div>
          
          <!-- Toggle button -->
          <button class="toggle-description-btn mt-4 px-6 py-3  text-yellow-400 font-semibold   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out">
            ${buttonText}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('card-component', CardComponent);

/**
 * Section Cards Component to display a list of ministry cards.
 * Includes a search input and dynamically rendered ministry cards.
 */
class SectionCards extends App {
  constructor() {
    super();
    this.ministries = [
      {
        id: 'youth-ministry',
        image: 'https://placehold.co/400x300/60a5fa/ffffff?text=Youth+Ministry',
        title: 'Youth Ministry',
        description:
          'PiYouth is a place for Middle and High Schoolers to experience authentic community and step into the purpose God has for them! This is a longer description to demonstrate the expand/collapse functionality. It covers various aspects like weekly meetings, special events, mission trips, and how it aims to foster spiritual growth and leadership skills among young people.',
      },
      {
        id: 'childrens-ministry',
        image:
          'https://placehold.co/400x300/34d399/ffffff?text=Children%27s+Ministry',
        title: "Children's Ministry",
        description:
          "Our Children's Ministry provides a safe and fun environment for kids to learn about God through engaging lessons and activities. We focus on age-appropriate Bible stories, creative crafts, and interactive games to make learning about faith an exciting adventure for every child, from toddlers to pre-teens.",
      },
      {
        id: 'womens-ministry',
        image:
          'https://placehold.co/400x300/fcd34d/ffffff?text=Women%27s+Ministry',
        title: "Women's Ministry",
        description:
          'Connecting women through fellowship, Bible study, and service to grow in faith and support one another. Our ministry offers various groups and events, including book clubs, prayer circles, and outreach programs, designed to empower women in their spiritual journey and daily lives.',
      },
      {
        id: 'mens-ministry',
        image:
          'https://placehold.co/400x300/fb923c/ffffff?text=Men%27s+Ministry',
        title: "Men's Ministry",
        description:
          'Building strong men of faith through discipleship, accountability, and service to their families and community. We organize regular gatherings, including breakfast fellowships, sports events, and service projects, providing opportunities for men to connect, share experiences, and grow in their walk with God.',
      },
    ];
    this.filteredMinistries = this.ministries; // Initialize filtered list
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
    this.addEventListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListeners();
  }

  addEventListeners() {
    const searchInput = this.querySelector('#ministry-search');
    if (searchInput) {
      searchInput.addEventListener('input', this.handleSearch.bind(this));
    }
  }

  removeEventListeners() {
    const searchInput = this.querySelector('#ministry-search');
    if (searchInput) {
      searchInput.removeEventListener('input', this.handleSearch.bind(this));
    }
  }

  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredMinistries = this.ministries.filter(
      (ministry) =>
        ministry.title.toLowerCase().includes(searchTerm) ||
        ministry.description.toLowerCase().includes(searchTerm),
    );
    this.updateCards(); // Re-render only the cards section
  }

  updateCards() {
    const cardsContainer = this.querySelector('#ministry-cards-container');
    if (cardsContainer) {
      cardsContainer.innerHTML = this.filteredMinistries
        .map(
          (ministry) => `
        <card-component 
          image-src="${ministry.image}" 
          title="${ministry.title}" 
          description="${ministry.description}">
        </card-component>
      `,
        )
        .join('');
    }
  }

  render() {
    this.innerHTML = `
      <section class="bg-black py-16 px-6 sm:px-10 lg:px-20 min-h-screen flex flex-col items-center">
        <div class="w-full max-w-[70%] mb-10 text-center relative">
          <input type="search" id="ministry-search" 
                 class="w-full p-4 pl-12 pr-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 shadow-md font-inter" 
                 placeholder="Search ministries..." />
          <!-- Search icon using inline SVG (Lucide-react equivalent) -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>

        <!-- Grid container for ministry cards -->
        <div id="ministry-cards-container" class="grid grid-cols-1 gap-8 w-full ">
          ${this.filteredMinistries
            .map(
              (ministry) => `
            <card-component 
              image-src="${ministry.image}" 
              title="${ministry.title}" 
              description="${ministry.description}">
            </card-component>
          `,
            )
            .join('')}
        </div>
      </section>
    `;
  }
}

customElements.define('section-cards', SectionCards);

export default SectionCards;
