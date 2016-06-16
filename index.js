'use strict';

var find = require('lodash/find'),
    filter = require('lodash/filter'),
    forEach = require('lodash/forEach'),
    clone = require('lodash/clone'),

    /*
     [
        {
          element: node
          events: {
            load: {
              bubbling: {
                onEvent: function,
                handlers: [function, object]
              }
              nonbubbling: {
                onEvent: function,
                handlers: [function, object]
              }
            },
            click: {...},
            keydown: {...},
            ...
          }
        }
     ]
     */
    events = [];

function add(element, eventType, handler, bubbling) {
  var eventCategory = bubbling? 'bubbling': 'nonbubbling',
      event = find(events, event => event.element === element)[0];

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
      element = find(events, item => item.element === event.currentTarget)[0],
      handlers = clone(element.events[event.type][eventCategory].handlers); // Cloning them so event can be removed while running all the handlers

    forEach(handlers, function (handler) {
      if (typeof handler === 'function') {
        handler(event);
      } else if (typeof handler === 'object' && typeof handler.handleEvent === 'function') {
        handler.handleEvent(event);
      }
    });
}

function remove(element, eventType, handler, bubbling) {
  var eventCategory = bubbling? 'bubbling': 'nonbubbling',
      event = find(events, event => event.element === element)[0];

  if (!event || !event.events[eventType] || !event.events[eventType][eventCategory]) {
    return;
  }

  event = event.events[eventType][eventCategory];
  event.handlers = filter(event.handlers, item => item !== handler);

  if (event.length === 0) {
    removeEventListener(element, eventType, event.onEvent, bubbling);
    delete event.onEvent;
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
