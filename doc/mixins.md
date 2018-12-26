# Mixins

## Introduction

A mixin is used to inject code in the EventDispatcher/EventQueue to extend the functionalities. In this document we will use EventDispatcher as the example, the usage for EventQueue is exactly the same.  
All methods and properties in the mixin are copied to the EventDispatcher/EventQueue and can be used as if they are part of the EventDispatcher/EventQueue.

## Define a mixin

A mixin is a class, or to say, a function object.  
A typical mixin should look like,  
```javascript
function MyMixin
{
	this.propA = 1;
	this.propB = 5;
};

MyMixin.prototype.methodA = function()
{
}
```

## Inject(enable) mixins to EventDispatcher

To enable mixins, add them to the `mixins` property in the parameters object. For example, to enable `MixinFilter`, create the dispatcher as,   
```javascript
let dispatcher = new eventjs.EventDispatcher({
	mixins: [ new eventjs.MixinFilter() ]
});
```

If there are multiple mixins, add them to mixins array.  

## Optional interceptor points

A mixin can have special named functions that are called at certain point.  
Currently there is only one special function,  
```javascript
function mixinBeforeDispatch([ arg1, arg2, ... ]);
```
`mixinBeforeDispatch` is called before any event is dispatched in both EventDispatcher and EventQueue. It receives an array that contains the arguments passed to EventDispatcher.dispatch. So the function can modify the arguments in the array, then the listeners will see the modified values.  
The function returns `true` to continue the dispatch, `false` will stop any further dispatching.  
For multiple mixins, this function is called in the order of they appearing in `mixins` in the parameters object.

## MixinFilter

MixinFilter allows all events are filtered or modified before dispatching.

`MixinFilter.prototype.appendFilter(filter)` adds an event filter to the dispatcher. The `filter` receives an array same as mixinBeforeDispatch receives.  

The event filters are invoked for all events, and invoked before any listeners are invoked.  
The event filters can modify the arguments since the arguments are passed in the array.  

Event filter is a powerful and useful technology, below is some sample use cases, though the real world use cases are unlimited.  

1, Capture and block all interested events. For example, in a GUI window system, all windows can receive mouse events. However, when a window is under mouse dragging, only the window under dragging should receive the mouse events even when the mouse is moving on other window. So when the dragging starts, the window can add a filter. The filter redirects all mouse events to the window and prevent other listeners from the mouse events, and bypass all other events.  

2, Setup catch-all event listener. For example, in a phone book system, the system sends events based on the actions, such as adding a phone number, remove a phone number, look up a phone number, etc. A module may be only interested in special area code of a phone number, not the actions. One approach is the module can listen to all possible events (add, remove, look up), but this is very fragile -- how about a new action event is added and the module forgets to listen on it? The better approach is the module add a filter and check the area code in the filter.

### Functions

```javascript
MixinFilter.prototype.appendFilter(filter);
```
Add the *filter* to the dispatcher.  
Return a handle which can be used in removeFilter.

```javascript
MixinFilter.prototype.removeFilter(filter);
```
Remove a filter from the dispatcher.  
`filter` can be either the filter callback or the handle returned by `appendFilter`.  
Return true if the filter is removed successfully.

### Sample code for MixinFilter

**Code**  
```javascript
let dispatcher = new eventjs.EventDispatcher({
	mixins: [ new eventjs.MixinFilter() ],
	argumentPassingMode: eventjs.EventDispatcher.argumentPassingIncludeEvent
});

dispatcher.appendListener(3, function(e, i, s) {
	console.log("Got event 3, i was 1 but actural is", i, "s was Hello but actural is", s);
});
dispatcher.appendListener(5, function() {
	console.log("Shout not got event 5");
});

// Add three event filters.

// The first filter modifies the input arguments to other values, then the subsequence filters
// and listeners will see the modified values.
dispatcher.appendFilter(function(args) {
	console.log("Filter 1, e is", args[0], "passed in i is", args[1], "s is", args[2]);
	args[1] = 38;
	args[2] = "Hi";
	console.log("Filter 1, changed i is", args[1], "s is", args[2]);
	return true;
});

// The second filter filters out all event of 5. So no listeners on event 5 can be triggered.
// The third filter is not invoked on event 5 also.
dispatcher.appendFilter(function(args) {
	console.log("Filter 2, e is", args[0], "passed in i is", args[1], "s is", args[2]);
	if(args[0] === 5) {
		return false;
	}
	return true;
});

// The third filter just prints the input arguments.
dispatcher.appendFilter(function(args) {
	console.log("Filter 3, e is", args[0], "passed in i is", args[1], "s is", args[2]);
	return true;
});

// Dispatch the events, the first argument is always the event type.
dispatcher.dispatch(3, 1, "Hello");
dispatcher.dispatch(5, 2, "World");
```

**Output**  
> Filter 1, e is 3 passed in i is 1 s is Hello  
> Filter 1, changed i is 38 s is Hi  
> Filter 2, e is 3 passed in i is 38 s is Hi  
> Filter 3, e is 3 passed in i is 38 s is Hi  
> Got event 3, i was 1 but actural is 38 s was Hello but actural is Hi  
> Filter 1, e is 5 passed in i is 2 s is World  
> Filter 1, changed i is 38 s is Hi  
> Filter 2, e is 5 passed in i is 38 s is Hi  

**Remarks**  
