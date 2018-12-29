# eventjs -- JavaScript library for event dispatcher and callback list

eventjs is a JavaScript event library that provides tools that enable your application components to communicate with each other by dispatching events and listening for them. With eventjs you can easily implement signal/slot mechanism, or observer pattern.

## Facts and features

- **Powerful**
  - Supports synchronous event dispatching and asynchronous event queue.
  - Supports event filter via mixins.
  - Configurable and extensible.
- **Robust**
  - Supports nested event. During the process of handling an event, a listener can safely dispatch event and append/prepend/insert/remove other listeners.
  - Doesn't depend on HTML DOM. eventjs works for non-browser environment.
  - Well tested. Backed by unit tests.
- **Fast**
  - Much faster than HTML DOM event listener system.
  - The EventQueue can process 5M events in 1 second (5K events per millisecond, when there are 100 event in the queue).
  - The CallbackList can invoke 1M callbacks in 1 second (1000 callbacks per millisecond).

## License

Apache License, Version 2.0  

## Version 0.0.1

## Source code

[https://github.com/wqking/eventjs](https://github.com/wqking/eventjs)

## Quick start

### Install

#### Install with NPM

```
npm install --save wqking-eventjs
```

Import the module,

```javascript
let eventjs = require('wqking-eventjs');
```

#### Or link to the source code directly

```html
<script src="dist/eventjs.min.js"></script>
```

Name `eventjs` is ready to use and no need to import.

#### Or CDN

```html
<script src="https://unpkg.com/wqking-eventjs/dist/eventjs.min.js"></script>
```

Name `eventjs` is ready to use and no need to import.

### Using CallbackList
```javascript
let callbackList = new eventjs.CallbackList();
callbackList.append(function() {
	console.log("Got callback 1.");
});
callbackList.append(() => {
	console.log("Got callback 2.");
});
callbackList.dispatch();
```

### Using EventDispatcher
```javascript
let dispatcher = new eventjs.EventDispatcher();
// Add an event 3 which is integer. The event
// can be any type such as a string.
dispatcher.appendListener(3, function() {
	console.log("Got event 3.");
});
dispatcher.appendListener(5, () => {
	console.log("Got event 5.");
});
dispatcher.appendListener(5, function() {
	console.log("Got another event 5.");
});
dispatcher.dispatch(3);
dispatcher.dispatch(5);
```

### Using EventQueue
```javascript
let queue = new eventjs.EventQueue();
queue.appendListener(3, function(s, n) {
	console.log("Got event 3, s is", s, "n is", n);
});
queue.appendListener(5, (s, n) => {
	console.log("Got event 5, s is", s, "n is", n);
});
queue.appendListener(5, function(s, n) {
	console.log("Got another event 5, s is", s, "n is", n);
});

// Enqueue the events, the first argument is always the event type.
// The listeners are not triggered during enqueue.
queue.enqueue(3, "Hello", 38);
queue.enqueue(5, "World", 58);

// Process the event queue, dispatch all queued events.
queue.process();
```

## Documentations

* [Introductions](doc/introduction.md)
* [Tutorials of CallbackList](doc/tutorial_callbacklist.md)
* [Tutorials of EventDispatcher](doc/tutorial_eventdispatcher.md)
* [Tutorials of EventQueue](doc/tutorial_eventqueue.md)
* [Class CallbackList](doc/callbacklist.md)
* [Class EventDispatcher](doc/eventdispatcher.md)
* [Class EventQueue](doc/eventqueue.md)
* [Parameters object -- configure eventjs](doc/parameters.md)
* [Mixins -- extend eventjs](doc/mixins.md)
* There are source code of tutorials in the unit tests.

## Run the unit tests

```
npm test
```
