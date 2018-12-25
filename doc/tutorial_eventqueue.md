# Tutorials of EventQueue

## Table Of Contents

- [Tutorial 1 -- Basic usage](#tutorial1)

<a name="tutorial1"></a>
### Tutorial 1 -- Basic usage

**Code**  
```javascript
// Create an object of EventQueue
let queue = new eventjs.EventQueue();

queue.appendListener(3, function(s, n) {
	console.log("Got event 3, s is", s, "n is", n);
});
// Another listener, arrow function in ES6
queue.appendListener(5, (s, n) => {
	console.log("Got event 5, s is", s, "n is", n);
});
// Another listener
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

**Output**  
> Got event 3, s is Hello n is 38  
> Got event 5, s is World n is 58  
> Got another event 5, s is World n is 58  

**Remarks**  
`EventDispatcher.dispatch()` invokes the listeners synchronously. Sometimes an asynchronous event queue is more useful (think about Windows message queue, or an event queue in a game). EventQueue supports such kind of event queue.  
`EventQueue.enqueue()` puts an event to the queue. Its parameters are exactly same as `dispatch`.  
`EventQueue.process()` must be called to dispatch the queued events.  
A typical use case is in a GUI application, each components call `EventQueue.enqueue()` to post the events, then the main event loop calls `EventQueue.process()` to dispatch the events.  
