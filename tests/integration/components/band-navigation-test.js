import { module, test } from 'qunit';
import { setupRenderingTest } from 'rarwe/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | band-navigation', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders two links', async function (assert) {
    this.owner.lookup('service:router');
    this.owner.setupRouter();

    await render(hbs`<BandNavigation />`);

    assert
      .dom('[data-test-rr="details-nav-item"]')
      .exists('The Details tab exists');

    assert
      .dom('[data-test-rr="songs-nav-item"]')
      .exists('The Songs tab exists');
  });
});
