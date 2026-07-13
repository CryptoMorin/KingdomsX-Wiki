export const PAGE_TRANSITION_READY_EVENT = 'kingdomsx:page-transition-ready';

export function onRouteDidUpdate({location, previousLocation}) {
  // Docusaurus keeps the previous route mounted while it loads the next one
  // We should signal only after the new document has actually been committed
  if (previousLocation && location.pathname !== previousLocation.pathname) {
    window.dispatchEvent(new Event(PAGE_TRANSITION_READY_EVENT));
  }
}
