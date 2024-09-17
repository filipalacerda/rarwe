import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Band from 'rarwe/models/band';
import { service } from '@ember/service';
import fetch from 'fetch';

export default class BandsNewController extends Controller {
  @service catalog;
  @service router;

  @tracked name;

  get hasNoName() {
    return !this.name;
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  async saveBand() {
    const response = await fetch('/bands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        type: 'bands',
        attributes: {
          name: this.name,
        },
      }),
    });

    const json = await response.json();

    const { id, attributes } = json.data;

    const record = new Band({ id, ...attributes });

    this.catalog.add('band', record);
    this.router.transitionTo('bands.band.songs', id);
  }
}
