'use strict';

var _ = require('lodash'),

    /*
     [
        {
          element: my DOM element
          events: {
            load: {
              bubbling: []
              nonbubbling: []
            }
          }
        }
     ]
     */
    events = [];

function add(element, eventType, handler, bubbling) {
  var eventCategory = bubbling? 'bubbling': 'nonbubbling',
      event = _.find(events, event => event.element === element)[0];

  if (!event) { // When at least 1 event has been added to that element
    event = {
      element: element,
      events: {}
    };
    events.push(event);
  }

  if (!event.events[eventType]) { // First time we add this event to this element
    event.events[eventType] = {};
  }

  if (!event.events[eventType][eventCategory]) {
    event.events[eventType][eventCategory] = {
      handlers: [],
      onEvent: null
    };
  }
  event = event.events[eventType][eventCategory];
  event.handlers.push(handler);

  if (event.handlers.length === 1) {
    event.onEvent = addEventListener(element, eventType, handler, bubbling);
  }
}

function preventDefault() {
  this.returnValue = false;
}

function addEventListener(element, eventType, bubbling, ) {
  function onEvent(event) {
    event.currentTarget = element;
    event.target = event.target || event.srcElement;
    event.preventDefault = event.preventDefault || preventDefault;

    handleEvent(event, bubbling);
  }

  if (element.addEventListener) {
    element.addEventListener(eventType, onEvent, bubbling);
  } else {
    element.attachEvent(eventType, onEvent);
  }

  return onEvent;
}

function handleEvent(event, bubbling) {
  var eventCategory = bubbling? 'bubbling': 'nonbubbling',
      element = _.find(events, item => item.element === event.currentTarget)[0];

  _(element.events[event.type][eventCategory])
    .forEach(function (handler) {
      if (typeof handler === 'function') {
        handler(event);
      } else if (typeof handler === 'object' && typeof handler.handleEvent === 'function') {
        handler.handleEvent(event);
      }
    });
}

function remove(element, eventType, handler, bubbling) {
  var eventCategory = bubbling? 'bubbling': 'nonbubbling',
      event = _.find(events, event => event.element === element)[0];

  if (!event || !event.events[eventType] || !event.events[eventType][eventCategory]) {
    return;
  }

  event = event.events[eventType][eventCategory];
  event.handlers = _.filter(event.handlers, item => item !== handler);

  if (event.length === 0) {
    removeEventListener(element, eventType, event.onEvent, bubbling);
  }
}

function removeEventListener(element, eventType, handler, bubbling) {
  if (element.removeEventListener) {
    element.removeEventListener(eventType, handler, bubbling);
  } else {
    element.detachEvent(eventType, handler);
  }
}

module.exports = {
  add: function () {
    add.apply(null, arguments);
  },
  remove: function () {
    remove.apply(null, arguments);
  }
};
