import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Song from 'rarwe/models/song';
import { service } from '@ember/service';
import fetch from 'fetch';

export default class BandsBandSongsController extends Controller {
  @service catalog;

  @tracked showAddSong = true;
  @tracked title = '';

  get hasNoTitle() {
    return !this.title;
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  async saveSong() {
    const payload = {
      data: {
        type: 'songs',
        attributes: { title: this.title },
        relationships: {
          band: {
            data: {
              id: this.model.id,
              type: 'bands',
            },
          },
        },
      },
    };

    const response = await fetch('/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify(payload),
    });

    const json = await response.json();

    const { id, attributes, relationships } = json.data;
    const rels = {};
    for (let relationshipName in relationships) {
      rels[relationshipName] = relationships[relationshipName].links.related;
    }

    const song = new Song({ id, ...attributes }, rels);
    this.catalog.add('songs', song);
    this.model.songs = [...this.model.songs, song];
    this.title = '';
    this.showAddSong = true;
  }

  @action
  cancel() {
    this.title = '';
    this.showAddSong = true;
  }
}
