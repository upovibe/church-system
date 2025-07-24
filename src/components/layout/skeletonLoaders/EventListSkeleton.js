import "@/components/ui/Skeleton.js";

/**
 * Event List Skeleton Loader Component
 *
 * A skeleton loader that replicates the exact design of the EventList component.
 * Used to show loading state while events data is being fetched.
 */
class EventListSkeleton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <!-- Grid Event Card Skeletons -->
                        <ui-skeleton type="card" width="100%" height="200px"></ui-skeleton>
                        <ui-skeleton type="card" width="100%" height="200px"></ui-skeleton>
                        <ui-skeleton type="card" width="100%" height="200px"></ui-skeleton>
                        <ui-skeleton type="card" width="100%" height="200px"></ui-skeleton>
                        <ui-skeleton type="card" width="100%" height="200px"></ui-skeleton>
                        <ui-skeleton type="card" width="100%" height="200px"></ui-skeleton>
            </div>
        `;
  }
}

customElements.define("event-list-skeleton", EventListSkeleton);
export default EventListSkeleton;
