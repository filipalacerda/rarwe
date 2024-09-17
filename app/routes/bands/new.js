import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { dasherize } from '@ember/string';
import { tracked } from '@glimmer/tracking';
import { Band } from 'rarwe/routes/bands';

export default class BandsNewRoute extends Route {
  @tracked name;

  get hasNoName() {
    return !this.name;
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  saveBand() {
    new Band({ name: this.name, id: dasherize(this.name) });
  }
}
