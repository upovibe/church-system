import App from '@/core/App.js';

class MapSection extends App {
  constructor() {
    super();
    // Default location coordinates for the map (Kwame Nkrumah Memorial Park, Accra, Ghana)
    this.latitude = 5.556;
    this.longitude = -0.201;
    this.map = null; // To store the Leaflet map instance
  }

  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = this.render();
    this.loadLeaflet(); // Load Leaflet CSS and JS dynamically
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up Leaflet map instance to prevent memory leaks
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    // Remove dynamically added Leaflet CSS and JS
    const leafletCss = document.getElementById('leaflet-css');
    if (leafletCss) leafletCss.remove();
    const leafletJs = document.getElementById('leaflet-js');
    if (leafletJs) leafletJs.remove();
  }

  /**
   * Dynamically loads Leaflet CSS and JavaScript libraries.
   * Initializes the map once Leaflet is loaded.
   */
  loadLeaflet() {
    // Check if Leaflet CSS is already loaded
    if (!document.getElementById('leaflet-css')) {
      const leafletCss = document.createElement('link');
      leafletCss.id = 'leaflet-css';
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCss);
    }

    // Check if Leaflet JS is already loaded
    if (typeof L === 'undefined') {
      // Check if Leaflet global object exists
      const leafletJs = document.createElement('script');
      leafletJs.id = 'leaflet-js';
      leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletJs.onload = () => {
        this.initMap(); // Initialize map after Leaflet is fully loaded
      };
      document.head.appendChild(leafletJs);
    } else {
      // If Leaflet is already loaded (e.g., from another component), initialize map directly
      this.initMap();
    }
  }

  /**
   * Initializes the Leaflet map and adds OpenStreetMap tiles and a custom marker.
   */
  initMap() {
    // Ensure the map container exists and Leaflet is loaded
    const mapContainer = this.querySelector('#map-container');
    if (!mapContainer || typeof L === 'undefined') {
      console.error('Map container not found or Leaflet not loaded.');
      return;
    }

    // If a map instance already exists, remove it before creating a new one
    if (this.map) {
      this.map.remove();
    }

    // Initialize the map with the specified view
    this.map = L.map(mapContainer).setView([this.latitude, this.longitude], 15); // Zoom level 15

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Create a custom red icon for the marker
    const redIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41], // Size of the icon
      iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
      popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
      shadowSize: [41, 41], // Size of the shadow
    });

    // Add a marker to the map with the custom red icon
    L.marker([this.latitude, this.longitude], { icon: redIcon })
      .addTo(this.map)
      .bindPopup(
        '<b>Living Word Church</b><br>Kwame Nkrumah Memorial Park Area',
      ) // Popup content
      .openPopup(); // Open the popup by default
  }

  render() {
    return `
      <section class="bg-black py-16 px-6 sm:px-10 lg:px-20 font-inter">
        <div class=" mx-auto text-center space-y-8">
          
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            Visit us at Living Word. Our doors are open, and we'd love to welcome you!
          </p>

          <div class="relative w-full h-96 sm:h-[500px] rounded-lg overflow-hidden shadow-xl border-2 border-gray-300">
            <!-- Map container where Leaflet will render the map -->
            <div id="map-container" class="w-full h-full"></div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('map-section', MapSection);

export default MapSection;
