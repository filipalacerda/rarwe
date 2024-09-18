import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class BandNavigation extends Component {
  @service router;

  get isActive() {
    return {
      details: this.router.isActive('bands.band.details'),
      songs: this.router.isActive('bands.band.songs', this.args.band),
    };
  }
}
