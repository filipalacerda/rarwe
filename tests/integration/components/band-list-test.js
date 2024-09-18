import { module, test } from 'qunit';
import { setupRenderingTest } from 'rarwe/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Band from 'rarwe/models/band';

module('Integration | Component | band-list', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.owner.lookup('service:router');
    this.owner.setupRouter();

    this.set('bands', [
      new Band({ id: 1, name: 'Led Zeppelin' }),
      new Band({ id: 2, name: 'Foo Fighters' }),
    ]);

    await render(hbs`<BandList @bands={{this.bands}}/>`);

    assert.dom('[data-test-rr="band-link"]').exists({ count: 2 });
  });
});
