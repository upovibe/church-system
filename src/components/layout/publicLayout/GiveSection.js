import App from '@/core/App.js';

/**
 * Give Section Component
 *
 * Displays give content with simple text.
 * Accepts color theming via 'colors' attribute and page data.
 */
class GiveSection extends App {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        // Parse colors attribute and set state, like HeroSection
        const colorsAttr = this.getAttribute('colors');
        if (colorsAttr) {
            try {
                const colors = JSON.parse(colorsAttr);
                Object.entries(colors).forEach(([key, value]) => {
                    this.set(key, value);
                });
            } catch {}
        }
        this.render();
    }

    render() {
        // Use color settings from state (set in connectedCallback)
        const primaryColor = this.get('primary_color');
        const accentColor = this.get('accent_color');
        const textColor = this.get('text_color');
        const darkColor = this.get('dark_color');
        const hoverPrimary = this.get('hover_primary');
        const hoverSecondary = this.get('hover_secondary');
        const hoverAccent = this.get('hover_accent');

        return `
            <section class="w-full max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 md:p-12 mt-[20rem] mb-12 flex flex-col items-center">
                <div class="w-full text-center mb-8">
                    <h1 class="text-3xl md:text-4xl font-bold mb-2" style="color: ${primaryColor}">Support Our Mission</h1>
                    <p class="text-lg text-gray-700 mb-4">Your generosity helps us make a difference in our community and beyond. Every gift, no matter the size, is a blessing!</p>
                </div>
                <div class="w-full flex flex-col md:flex-row gap-8 items-center justify-center mb-8">
                    <div class="flex-1 flex flex-col items-center">
                        <div class="rounded-full" style="background: ${accentColor}1A; padding: 1.5rem; margin-bottom: 1rem;">
                            <i class="fas fa-hand-holding-heart text-4xl" style="color: ${accentColor}"></i>
                        </div>
                        <h2 class="text-xl font-semibold mb-2" style="color: ${accentColor}">Why Give?</h2>
                        <p class="text-gray-600 text-center">Your giving supports outreach, ministry, and the daily work of our church. Thank you for partnering with us!</p>
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <div class="rounded-full" style="background: ${primaryColor}1A; padding: 1.5rem; margin-bottom: 1rem;">
                            <i class="fas fa-church text-4xl" style="color: ${primaryColor}"></i>
                        </div>
                        <h2 class="text-xl font-semibold mb-2" style="color: ${primaryColor}">Ways to Give</h2>
                        <ul class="text-gray-600 text-center space-y-1">
                            <li>• Online (coming soon)</li>
                            <li>• Bank Transfer (details below)</li>
                            <li>• In-person at any service</li>
                        </ul>
                    </div>
                </div>
                <div class="w-full flex flex-col items-center mt-4">
                    <button class="px-8 py-3 rounded-xl text-lg font-bold shadow-lg text-white mb-4" style="background: ${primaryColor}; color: #fff;" disabled>
                        <i class="fas fa-donate mr-2"></i> Give Now (Coming Soon)
                    </button>
                    <div class="w-full max-w-md bg-gray-50 rounded-lg p-4 text-center text-gray-700 border border-gray-200">
                        <div class="font-semibold mb-1">Bank Transfer Details</div>
                        <div class="text-sm">Account Name: <span class="font-medium">Your Church Name</span></div>
                        <div class="text-sm">Account Number: <span class="font-medium">0001234567</span></div>
                        <div class="text-sm">Bank: <span class="font-medium">Sample Bank</span></div>
                        <div class="text-xs text-gray-400 mt-2">Please use your name as reference. Thank you!</div>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('give-section', GiveSection);
export default GiveSection;