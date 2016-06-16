# dom-event-listener
Cross browser event listener

# ON GOING DEVELOPMENT, AVAILABLE IN A FEW DAYS

> Cross-browser event listeners made out of the box.

## Install

Just get it from the npm.

```
npm i dom-event-listener --save
```

## Setup:

###### Browserify

```js
var domEventListener = require('dom-event-listener');
```

###### ES6

```js
import domEventListener from 'dom-event-listener';
```

## Usage

### Adding an event listener

```js
import domEventListener from 'dom-event-listener';

let element = document.getElementById('my-element');

domEventListener.add(element, 'click', function(event) {
    console.log(event);
});
```

### Removing an event listener

```js
import domEventListener from 'dom-event-listener';

let element = document.getElementById('my-element');

function onClick(event) {
  console.log(event);
}

domEventListener.add(element, 'click', onClick);
domEventListener.remove(element, 'click', onClick);
```

## Fancy keeping your scope?

Pass an object with the handleEvent function

```js
import domEventListener from 'dom-event-listener';

let element = document.getElementById('my-element');

let object = {
  value: 'some random value',
  handleEvent: function (event) {
    console.log(this.value);
    console.log(event);
  }
};

domEventListener.add(element, 'click', object);
domEventListener.remove(element, 'click', object);
```

## Browser Support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_64x64.png" width="48px" height="48px" alt="Chrome logo"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_64x64.png" width="48px" height="48px" alt="Firefox logo"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_64x64.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_64x64.png" width="48px" height="48px" alt="Opera logo"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_64x64.png" width="48px" height="48px" alt="Safari logo"> |
|:---:|:---:|:---:|:---:|:---:|
| Latest ✔ | Latest ✔ | IE 8+ ✔ | Latest ✔ | Latest ✔ |
