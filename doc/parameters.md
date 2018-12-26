# Parameters

## Introduction

All classes CallbackList, EventDispatcher and EventQueue in eventjs accepts a parameters object in constructor to configure and extend each components' behavior. The parameters object is `null` by default.  
All parameters are optional. If any parameter is omitted, the default value is used.  
The same parameter mechanism applies to all three classes, EventDispatcher, EventQueue, and CallbackList, though not all classes requires the same parameter.

A typical parameters object is

```javascript
let params = {
	getEvent: function(arg1, arg2, arg3) {
		return arg1;
	},
	
	canContinueInvoking: function(arg1, arg2, arg3) {
		return true;
	},
	
	argumentPassingMode: eventjs.EventDispatcher.argumentPassingExcludeEvent,
	
	argumentsAsArray: false,
	
	mixins: [],
};

new eventjs.CallbackList(params);
new eventjs.EventDispatcher(params);
new eventjs.EventQueue(params);
```

## Parameters

### Function getEvent

**Prototype**: `getEvent(arg1, arg2, ...)`. The function receives same arguments as `EventDispatcher.dispatch` and `EventQueue.enqueue`, and must return an event type.  
**Default value**: the default implementation returns the first argument of `getEvent`.  
**Apply**: EventDispatcher, EventQueue.

eventjs forwards all arguments of `EventDispatcher.dispatch` and `EventQueue.enqueue` (both has same arguments) to `getEvent` to get the event type, then invokes the callback list of the event type.  

Sample code

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

Output  

> Got event 3  
> Event::type is 3  
> Event::message is Hello world  
> Event::param is 38  
> b is true  

### Function canContinueInvoking

**Prototype**: `canContinueInvoking(arg1, arg2, ...)`. The function receives same arguments as `EventDispatcher.dispatch` and `EventQueue.enqueue`, and must return true if the event dispatching or callback list invoking can continue, false if the dispatching should stop.  
**Default value**: the default implementation always returns true.  
**Apply**: CallbackList, EventDispatcher, EventQueue.

Sample code

```javascript
// The event object we will dispatch looks like,
// MyEvent = {
//	type: int,
//	canceled: boolean
//};

// When construct the dispatcher, pass the parameter
// getEvent to indicate how to get the event type.
// Parameter canContinueInvoking checks if the dispatching can continue.
let dispatcher = new eventjs.EventDispatcher({
	getEvent: function(e) {
		return e.type;
	},
	
	canContinueInvoking: function(e) {
		return ! e.canceled;
	}
});

dispatcher.appendListener(3, function(e) {
	console.log("Got event 3");
	e.canceled = true;
});
dispatcher.appendListener(3, function(e) {
	console.log("Should not get this event 3");
});

// Dispatch the event.
// The first argument is MyEvent.
dispatcher.dispatch({ type: 3, canceled: false });
```

### Object mixins

**Default value**: `mixins = null`. No mixins are enabled.  
**Apply**: EventDispatcher, EventQueue.  

A mixin is used to inject code in the EventDispatcher/EventQueue inheritance hierarchy to extend the functionalities. For more details, please read the [document of mixins](mixins.md).

## Integer argumentPassingMode

**Default value**: `argumentPassingMode = EventDispatcher.argumentPassingExcludeEvent`.  
**Apply**: EventDispatcher, EventQueue.

`ArgumentPassingMode` is the argument passing mode.  

The possible values,

```javascript
EventDispatcher.argumentPassingIncludeEvent = 1;
EventDispatcher.argumentPassingExcludeEvent = 2;
```

The global default value,

```javascript
EventDispatcher.defaultArgumentPassingMode = 2;
```

Let's see some examples. Assume we have the dispatcher  
```javascript
let dispatcher = new eventjs.EventDispatcher();
// same as 
let dispatcher = new eventjs.EventDispatcher({ argumentPassingMode: EventDispatcher.argumentPassingExcludeEvent });
dispatcher.dispatch(3, "hello");
```
The listener will be invoked with the argument `("hello")`, the event type is omitted since it's argumentPassingExcludeEvent.

### Boolean argumentsAsArray

**Default value**: `argumentsAsArray = false`.  
**Apply**: CallbackList, EventDispatcher, EventQueue.  

`argumentsAsArray` affects how the listeners and `getEvent` receive the arguments.  

When `argumentsAsArray` is false, the listeners and `getEvent` receive the arguments as individual parameters. For example,  

```javascript
let dispatcher = new eventjs.EventDispatcher();
// same as
let dispatcher = new eventjs.EventDispatcher({ argumentsAsArray: false });
dispatcher.dispatch(a, b, c);
// The listener will be called as
myListener(a, b, c);
```

When `argumentsAsArray` is true, the listeners and `getEvent` receive the arguments as an array of which each elements are the arguments. For example,  

```javascript
let dispatcher = new eventjs.EventDispatcher({ argumentsAsArray: true });
dispatcher.dispatch(a, b, c);
// The listener will be called as
myListener([ a, b, c ]);
```

Setting `argumentsAsArray` to true will slightly improve the performance.  
