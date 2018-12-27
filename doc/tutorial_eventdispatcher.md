# Tutorials of EventDispatcher

## Table Of Contents

- [Tutorial 1 -- Basic usage](#tutorial1)
- [Tutorial 2 -- Listener with parameters](#tutorial2)
- [Tutorial 3 -- Customized event struct](#tutorial3)

<a name="tutorials"></a>
## Tutorials

<a name="tutorial1"></a>
### Tutorial 1 -- Basic usage

**Code**  
```javascript
// Create an object of EventDispatcher
let dispatcher = new eventjs.EventDispatcher();

// Add a listener.
// Here 3 and 5 is the event type,
// function() {} is the listener.
// anonymous is not required, any function is fine.
dispatcher.appendListener(3, function() {
	console.log("Got event 3.");
});
// Another listener, arrow function in ES6
dispatcher.appendListener(5, () => {
	console.log("Got event 5.");
});
// Another listener
dispatcher.appendListener(5, function() {
	console.log("Got another event 5.");
});

// Dispatch the events, the first argument is always the event type.
dispatcher.dispatch(3);
dispatcher.dispatch(5);
```

**Output**  
> Got event 3.  
> Got event 5.  
> Got another event 5.  

**Remarks**  
First let's create a dispatcher.
```javascript
let dispatcher = new eventjs.EventDispatcher();
```

Now let's add a listener.  
```javascript
dispatcher.appendListener(3, function() {
	console.log("Got event 3.");
});
```
Function `appendListener` takes two arguments. The first argument is the *event*. The second is the *callback*.  
The *callback* can be any functions..  
In the tutorial, we also add two listeners for event 5.  

Now let's dispatch some event.
```javascript
dispatcher.dispatch(3);
dispatcher.dispatch(5);
```
Here we dispatched two events, one is event 3, the other is event 5.  
During the dispatching, all listeners of that event will be invoked one by one in the order of they were added.

<a name="tutorial2"></a>
### Tutorial 2 -- Listener with parameters

**Code**  
```javascript
// Create an object of EventDispatcher
let dispatcher = new eventjs.EventDispatcher();

dispatcher.appendListener(3, function(s, b) {
	console.log("Got event 3, s is", s, "b is", b);
});
dispatcher.appendListener(5, (s, b) => {
	console.log("Got event 5, s is", s, "b is", b);
});
dispatcher.appendListener(5, function(s, b) {
	console.log("Got another event 5, s is", s, "b is", b);
});

// Dispatch the events, the first argument is always the event type.
dispatcher.dispatch(3, "Hello", true);
dispatcher.dispatch(5, "World", false);
```

**Output**  
> Got event 3, s is Hello b is true  
> Got event 5, s is World b is false  
> Got another event 5, s is World b is false  

**Remarks**  

<a name="tutorial3"></a>
### Tutorial 3 -- Customized event struct

**Code**  
```javascript
// The event object we will dispatch looks like,
// MyEvent = {
//	type: int,
//	message: string,
//	param: int
//};

// When construct the dispatcher, pass the parameter
// getEvent to indicate how to get the event type.
let dispatcher = new eventjs.EventDispatcher({
	getEvent: function(e) {
		return e.type;
	}
});

// Add a listener.
// Note: the first argument is the event type of type int (same as the return type of getEvent), not MyEvent.
// e is the main event object.
// b is an extra parameter.
dispatcher.appendListener(3, function(e, b) {
	console.log("Got event 3");
	console.log("Event::type is", e.type);
	console.log("Event::message is", e.message);
	console.log("Event::param is", e.param);
	console.log("b is", b);
});

// Dispatch the event.
// The first argument is MyEvent.
dispatcher.dispatch({ type: 3, message: "Hello world", param: 38 }, true);
```

**Output**  

> Got event 3  
> Event::type is 3  
> Event::message is Hello world  
> Event::param is 38  
> b is true  

**Remarks**  

A common situation is an Event class is defined as the base class, all other events derive from Event, and the actual event type is a data member of Event (think QEvent in Qt). To let EventDispatcher knows how to get the event type from class Event, parameter `getEvent` is used.  

