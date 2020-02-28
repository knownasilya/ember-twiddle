import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | gist footer', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.setupRouter();
  });

  test('it renders with author and fork', async function(assert) {

    this.set('model', EmberObject.create({
      owner: {
        login: 'octocat',
        avatarUrl16: 'fake16.png',
        htmlUrl: 'https://github.com/octocat'
      },
      forkOf: {
        id: 'fakegistid',
        owner: {
          login: 'romgere',
          avatarUrl16: 'fake16.png',
          htmlUrl: 'https://github.com/romgere'
        }
      }
    }));

    await render(hbs`{{gist-footer owner=model.owner originalGist=model.forkOf}}`);

    assert.equal(find('footer').textContent.trim().replace(/[\t\n\s]+/g, " "), 'Author: octocat | Fork from: romgere \'s gist | Open original gist');

    assert.dom('footer .user-link').exists({ count: 2 });

    assert.equal(find('footer a:last-child').getAttribute('href'), '/fakegistid');

  });

  test('it renders with author and no fork', async function(assert) {

    this.set('model', EmberObject.create({
      owner: {
        login: 'octocat',
        avatarUrl16: 'fake16.png',
        htmlUrl: 'https://github.com/octocat'
      },
      forkOf: null
    }));

    await render(hbs`{{gist-footer owner=model.owner originalGist=model.forkOf}}`);

    assert.equal(find('footer').textContent.trim().replace(/[\t\n\s]+/g, " "), 'Author: octocat');
    assert.dom('footer .user-link').exists({ count: 1 });
    assert.dom('footer a').exists({ count: 1 });

  });

  test('it renders without author (new twiddle)', async function(assert) {

    this.set('model', EmberObject.create({
      owner: null,
      forkOf: null
    }));

    await render(hbs`{{gist-footer owner=model.owner originalGist=model.forkOf}}`);

    assert.equal(find('footer').textContent.trim().replace(/[\t\n\s]+/g, " "), 'No author (new twiddle)');

    assert.dom('footer a').doesNotExist();
  });
});
