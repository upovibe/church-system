class Indicator extends HTMLElement {
  constructor() {
    super();
    this.classList.add(
      'hidden',
      'h-[4px]',
      'bg-gradient-to-r',
      'from-yellow-400',
      'to-white',
      'transition-all',
      'duration-300',
      'ease-in-out',
    );
  }
}

customElements.define('app-indicator', Indicator);
export default Indicator;
