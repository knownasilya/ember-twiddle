import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';

export default Mixin.create({
  queryParams: ['numColumns', 'fullScreen', 'route', 'openFiles', 'isSidebarOpen'],
  numColumns: 1,
  fullScreen: false,
  openFiles: "",
  isSidebarOpen: true,
  route: undefined,
  applicationUrl: undefined,
  unsaved: true,

  init() {
    this._super(...arguments);
    this.setupWindowUpdate();
  },

  actions: {
    transitionQueryParams(queryParams) {
      return this.transitionToRoute({ queryParams }).then(() => queryParams);
    }
  },

  setupWindowUpdate() {
    // TODO: this in a controller seems suspect, rather this should likely be
    // part of some handshake, to ensure no races exist. This should likley not
    // be something a controller would handle - (SP)
    window.addEventListener('message', (m) => {
      run(() => {
        if(typeof m.data==='object' && 'setAppUrl' in m.data) {
          if (!this.isDestroyed) {
            if (window.messagesWaiting > 0) {
              window.messagesWaiting = 0;
            }
            const newRoute = m.data.setAppUrl || '/';
            this.setProperties({
              applicationUrl: newRoute,
              route: newRoute === "/" ? undefined : newRoute
            });
          }
        }
      });
    });
  }
});
