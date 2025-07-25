import App from '@/core/App.js';

/**
 * Give Section Component
 *
 * Displays give content with dynamic data from payment settings.
 * Accepts color theming and payment settings via attributes.
 */
class GiveSection extends App {
    constructor() {
        super();
        this.state = {
            paymentSettings: null
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.parseAttributes();
        this.render();
    }

    parseAttributes() {
        const colorsAttr = this.getAttribute('colors');
        if (colorsAttr) {
            try {
                const colors = JSON.parse(colorsAttr);
                Object.entries(colors).forEach(([key, value]) => {
                    this.set(key, value);
                });
            } catch (e) {
                console.error('Failed to parse colors attribute:', e);
            }
        }

        const paymentAttr = this.getAttribute('payment-settings');
        if (paymentAttr) {
            try {
                this.state.paymentSettings = JSON.parse(paymentAttr);
            } catch (e) {
                console.error('Failed to parse payment-settings attribute:', e);
            }
        }
    }

    render() {
        // Color settings from state
        const primaryColor = this.get('primary_color', '#000000');
        const accentColor = this.get('accent_color', '#d9d917');

        // Payment settings from state
        const settings = this.state.paymentSettings || {};
        const title = settings.payment_title || 'Support Our Mission';
        const description = settings.payment_description || 'Your generosity helps us make a difference in our community and beyond. Every gift, no matter the size, is a blessing!';
        const paystackLink = settings.paystack_payment_link;
        const stripeLink = settings.stripe_payment_link;
        const bannerImage = settings.payment_banner_image ? `/api/${settings.payment_banner_image}` : '';

        return `
            <section 
                class="w-full bg-cover bg-center bg-no-repeat rounded-2xl shadow-xl mt-[10rem] mb-12 flex flex-col items-center"
                style="background-image: url('${bannerImage}');">
                <div class="w-full max-w-3xl mx-auto bg-white/90 rounded-2xl p-8 md:p-12 my-12">
                    <div class="w-full text-center mb-8">
                        <h1 class="text-3xl md:text-4xl font-bold mb-2" style="color: ${primaryColor}">${title}</h1>
                        <p class="text-lg text-gray-700 mb-4">${description}</p>
                    </div>
                    <div class="w-full flex flex-col items-center mt-4">
                        <div class="flex flex-col sm:flex-row gap-4">
                            ${paystackLink ? `
                                <a href="${paystackLink}" target="_blank" rel="noopener noreferrer" class="px-8 py-3 rounded-xl text-lg font-bold shadow-lg text-white text-center" style="background: ${primaryColor};">
                                    <i class="fas fa-credit-card mr-2"></i> Give with Paystack
                                </a>
                            ` : ''}
                            ${stripeLink ? `
                                <a href="${stripeLink}" target="_blank" rel="noopener noreferrer" class="px-8 py-3 rounded-xl text-lg font-bold shadow-lg text-white text-center" style="background: ${accentColor};">
                                    <i class="fab fa-stripe-s mr-2"></i> Give with Stripe
                                </a>
                            ` : ''}
                        </div>
                        ${!paystackLink && !stripeLink ? `
                            <p class="text-gray-500 mt-4">Online giving is not yet available. Please check back later.</p>
                        ` : ''}
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('give-section', GiveSection);
export default GiveSection;
