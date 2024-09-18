import Service from '@ember/service';
import { tracked } from 'tracked-built-ins';
import Band from 'rarwe/models/band';
import Song from 'rarwe/models/song';
import { isArray } from '@ember/array';
import ENV from 'rarwe/config/environment';

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

  get bandsURL() {
    return `${ENV.apiHost || ''}/bands`;
  }

  get songsURL() {
    return `${ENV.apiHost || ''}/songs`;
  }

  async fetchAll(type) {
    if (type === 'bands') {
      const response = await fetch(this.bandsURL);
      const json = await response.json();

      this.loadAll(json);
      return this.bands;
    }

    if (type === 'songs') {
      const response = await fetch(this.songsURL);
      const json = await response.json();

      this.loadAll(json);
      return this.songs;
    }
  }

  loadAll(json) {
    const records = [];
    for (let item of json.data) {
      records.push(this._loadResource(item));
    }
    return records;
  }

  load(response) {
    return this._loadResource(response.data);
  }

  _loadResource(data) {
    let record;
    let { id, type, attributes, relationships } = data;
    if (type === 'bands') {
      let rels = extractRelationships(relationships);
      record = new Band({ id, ...attributes }, rels);
      this.add('band', record);
    }
    if (type === 'songs') {
      let rels = extractRelationships(relationships);
      record = new Song({ id, ...attributes }, rels);
      this.add('song', record);
    }
    return record;
  }

  async fetchRelated(record, relationship) {
    const url = record.relationships[relationship];
    const json = await fetch(url).then((response) => {
      return response.json();
    });

    if (isArray(json.data)) {
      record[relationship] = this.loadAll(json);
    } else {
      record[relationship] = this.load(json);
    }
    return record[relationship];
  }

  async create(type, attributes, relationships = {}) {
    const payload = {
      data: {
        type: type === 'band' ? 'bands' : 'songs',
        attributes,
        relationships,
      },
    };

    const json = await fetch(type === 'band' ? this.bandsURL : this.songsURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());

    return this.load(json);
  }

  async update(type, record, attributes) {
    const payload = {
      data: {
        id: record.id,
        type: type === 'band' ? 'bands' : 'songs',
        attributes,
      },
    };
    const url =
      type === 'band'
        ? `${this.bandsURL}/${record.id}`
        : `${this.songsURL}/${record.id}`;
    await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });
  }

  add(type, record) {
    const collection =
      type === 'band' ? this.storage.bands : this.storage.songs;

    const recordIds = collection.map((record) => record.id);

    if (!recordIds.includes(record.id)) {
      collection.push(record);
    }
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
