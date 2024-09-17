import Route from '@ember/routing/route';

export default class BandsNewRoute extends Route {
  constructor() {
    super(...arguments);

    this.router.on('routeWillChange', (transition) => {
      if (transition.isAborted) {
        return;
      }
      if (this.confirmedLeave) {
        return;
      }
      if (transition.from.name === 'bands.new') {
        if (this.name) {
          const leave = window.confirm(
            'You have unsaved changes. Are you sure?',
          );

          if (leave) {
            this.confirmedLeave = true;
          } else {
            transition.abort();
          }
        }
      }
    });
  }
  resetController(controller) {
    controller.name = '';
    controller.confirmedLeave = false;
  }
}
