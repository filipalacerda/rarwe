import Service from '@ember/service';
import { tracked } from 'tracked-built-ins';
import Band from 'rarwe/models/band';

function extractRelationships(object) {
  const relationships = {};

  for (let relationshipName in object) {
    relationships[relationshipName] = object[relationshipName].links.related;
  }

  return relationships;
}

export default class CatalogService extends Service {
  storage = {};

  constructor() {
    super(...arguments);
    this.storage.bands = tracked([]);
    this.storage.songs = tracked([]);
  }

  async fetchAll() {
    const response = await fetch('/bands');
    const json = await response.json();

    for (let item of json.data) {
      let { id, attributes, relationships } = item;
      let rels = extractRelationships(relationships);
      let record = new Band({ id, ...attributes }, rels);
      this.add('band', record);
    }

    return this.bands;
  }

  add(type, record) {
    const collection =
      type === 'band' ? this.storage.bands : this.storage.songs;

    collection.push(record);
  }

  get bands() {
    return this.storage.bands;
  }

  get songs() {
    return this.storage.songs;
  }

  find(type, filterFn) {
    const collection =
      type === 'band' ? this.storage.bands : this.storage.songs;

    return collection.find(filterFn);
  }
}
