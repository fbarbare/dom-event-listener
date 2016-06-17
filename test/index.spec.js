var assert = require('chai').assert;
var expect = require('chai').expect;
var sinon = require('sinon');
var simulant = require('simulant');
var domEventListener = require('../lib/index');

describe('index', function () {
  it('adds an event', function () {
    var onClick = sinon.spy();

    domEventListener.add(document, 'click', onClick);
    simulant.fire(document, 'click');

    assert.equal(onClick.callCount, 1);
  });

  it('removes an event', function () {
    var onClick = sinon.spy();

    domEventListener.add(document, 'click', onClick);
    simulant.fire(document, 'click');
    domEventListener.remove(document, 'click', onClick);
    simulant.fire(document, 'click');

    assert.equal(onClick.callCount, 1);
  });

  it('handles adding and removing events multiple times', function () {
    var onClick = sinon.spy();

    domEventListener.add(document, 'click', onClick);
    simulant.fire(document, 'click');
    domEventListener.remove(document, 'click', onClick);
    simulant.fire(document, 'click');
    domEventListener.add(document, 'click', onClick);
    simulant.fire(document, 'click');
    domEventListener.remove(document, 'click', onClick);
    simulant.fire(document, 'click');

    assert.equal(onClick.callCount, 2);
  });

  it('removes all handlers that have the same reference at once', function () {
    var onClick = sinon.spy();

    domEventListener.add(document, 'click', onClick);
    domEventListener.add(document, 'click', onClick);
    simulant.fire(document, 'click');
    domEventListener.remove(document, 'click', onClick);
    simulant.fire(document, 'click');

    assert.equal(onClick.callCount, 2);
  });

  it('handles multiple events on the same element', function () {
    var onClick = sinon.spy();

    domEventListener.add(document, 'click', onClick);
    domEventListener.add(document, 'click', onClick);
    simulant.fire(document, 'click');

    assert.equal(onClick.callCount, 2);
  });

  it('handles multiple events on the same element with different callbacks', function () {
    var onClick1 = sinon.spy();
    var onClick2 = sinon.spy();

    domEventListener.add(document, 'click', onClick1);
    domEventListener.add(document, 'click', onClick2);
    simulant.fire(document, 'click');

    assert.equal(onClick1.callCount, 1);
    assert.equal(onClick2.callCount, 1);
  });

  it('handles multiple events on the same element', function () {
    var onClick = sinon.spy();
    var onKeydown = sinon.spy();

    domEventListener.add(document, 'click', onClick);
    domEventListener.add(document, 'keydown', onKeydown);
    simulant.fire(document, 'click');
    simulant.fire(document, 'keydown');

    assert.equal(onClick.callCount, 1);
    assert.equal(onKeydown.callCount, 1);
  });

  it('takes an object as handler and runs its handleEvent function', function () {
    var object = {
      handleEvent: sinon.spy()
    };

    domEventListener.add(document, 'click', object);
    simulant.fire(document, 'click');

    assert.equal(object.handleEvent.callCount, 1);
  });

  it('the given object can create its handleEvent function after creating the event', function () {
    var object = {};

    domEventListener.add(document, 'click', object);
    object.handleEvent = sinon.spy();
    simulant.fire(document, 'click');

    assert.equal(object.handleEvent.callCount, 1);
  });

  describe('the event object', function () {
    it('has the currentTarget', function () {
      var onClick = sinon.spy();
      var div = document.createElement('div');

      document.body.appendChild(div);
      domEventListener.add(document, 'click', onClick);
      simulant.fire(div, 'click');

      assert.equal(onClick.firstCall.args[0].currentTarget, document);
    });

    it('has the target', function () {
      var onClick = sinon.spy();
      var div = document.createElement('div');

      document.body.appendChild(div);
      domEventListener.add(document, 'click', onClick);
      simulant.fire(div, 'click');

      assert.equal(onClick.firstCall.args[0].target, div);
    });

    it('has the preventDefault function', function () {
      var onClick = sinon.spy();
      var div = document.createElement('div');

      document.body.appendChild(div);
      domEventListener.add(document, 'click', onClick);
      simulant.fire(div, 'click');

      assert.isFunction(onClick.firstCall.args[0].preventDefault);
    });
  });
});
