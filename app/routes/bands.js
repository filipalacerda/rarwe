import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Band from '../models/band';
//import Band from 'rarwe/models/band';
import Song from '../models/song';

export default class BandsRoute extends Route {
  @service catalog;

  model() {
    const blackDog = new Song({
      title: 'Black Dog',
      rating: 3,
    });

    const yellowLedbetter = new Song({
      title: 'Yellow Ledbetter',
      rating: 4,
    });

    const pretender = new Song({
      title: 'The Pretender',
      rating: 2,
    });

    const daughter = new Song({
      title: 'Daughter',
      band: 'Pearl Jam',
      rating: 5,
    });

    const ledZeppelin = new Band({
      id: 'led-zeppelin',
      name: 'Led Zeppelin',
      songs: [blackDog],
    });

    const pearlJam = new Band({
      id: 'pearl-jam',
      name: 'Pearl Jam',
      songs: [yellowLedbetter, daughter],
    });

    const fooFighters = new Band({
      id: 'foo-fighters',
      name: 'Foo Fighters',
      songs: [pretender],
    });

    blackDog.band = ledZeppelin;
    yellowLedbetter.band = pearlJam;
    daughter.band = pearlJam;
    pretender.band = fooFighters;

    this.catalog.add('song', blackDog);
    this.catalog.add('song', yellowLedbetter);
    this.catalog.add('song', daughter);
    this.catalog.add('song', pretender);

    this.catalog.add('band', ledZeppelin);
    this.catalog.add('band', pearlJam);
    this.catalog.add('band', fooFighters);

    return this.catalog.bands;
  }
}
