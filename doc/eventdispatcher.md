# Class EventDispatcher reference

## Table Of Contents

- [API reference](#apis)
- [Nested listener safety](#nested-listener-safety)
- [Time complexities](#time-complexities)
- [Internal data structure](#internal-data-structure)

## Description

EventDispatcher is something like a map between the `EventType` and `CallbackList`.

EventDispatcher holds a map of `<EventType, CallbackList>` pairs. On dispatching, EventDispatcher finds the CallbackList of the event type, then invoke the callback list. The invocation is always synchronous. The listeners are triggered when `EventDispatcher.dispatch` is called.  

<a name="apis"></a>
## API reference

### Member functions

```javascript
EventDispatcher.prototype.appendListener(event, callback);
```  
Add the *callback* to the dispatcher to listen to *event*.  
The listener is added to the end of the listener list.  
Return a handle object which represents the listener. The handle can be used to remove this listener or insert other listener before this listener.  
If `appendListener` is called in another listener during a dispatching, the new listener is guaranteed not triggered during the same dispatching.  
If the same callback is added twice, it results duplicated listeners.  
The time complexity is O(1).

```javascript
EventDispatcher.prototype.prependListener(event, callback);
```  
Add the *callback* to the dispatcher to listen to *event*.  
The listener is added to the beginning of the listener list.  
Return a handle object which represents the listener. The handle can be used to remove this listener or insert other listener before this listener.  
If `prependListener` is called in another listener during a dispatching, the new listener is guaranteed not triggered during the same dispatching.  
The time complexity is O(1).

```javascript
EventDispatcher.prototype.insertListener(event, callback, before);
```  
Insert the *callback* to the dispatcher to listen to *event* before the listener handle *before*. If *before* is not found, *callback* is added at the end of the listener list.  
*before* can be a callback function, or a handle object.  
Return a handle object which represents the listener. The handle can be used to remove this listener or insert other listener before this listener.  
If `insertListener` is called in another listener during a dispatching, the new listener is guaranteed not triggered during the same dispatching.  
The time complexity is O(1).  

```javascript
EventDispatcher.prototype.removeListener(event, callback);
```  
Remove the listener *callback* which listens to *event* from the dispatcher.  
*callback* can be a callback function, or a handle object.  
Return true if the listener is removed successfully, false if the listener is not found.  
The time complexity is O(1).  

```javascript
EventDispatcher.prototype.hasListener(callback);
```  
Return true if the dispatcher contains *callback*.  
*callback* can be a callback function, or a handle object.  

```javascript
EventDispatcher.prototype.hasAnyListener();
```  
Return true if the dispatcher contains any callback.  

```javascript
EventDispatcher.prototype.dispatch(event, arg1, arg2, ...);  
```  
Dispatch an event.  
The listeners are called with arguments `arg1`, `arg2`, etc.  

```javascript
EventDispatcher.prototype.applyDispatch([ event, arg1, arg2, ... ]);  
```  
Dispatch an event.  
The listeners are called with arguments `arg1`, `arg2`, etc.  
Note the arguments are passed in an array, similar to Function.prototype.apply.

```javascript
EventDispatcher.prototype.forEach(event, func);
```  
Apply `func` to all listeners of `event`.  
The `func` receives one parameter which is the callback.  
**Note**: the `func` can remove any listeners, or add other listeners, safely.

```javascript
EventDispatcher.prototype.forEachIf(event, func);
```  
Apply `func` to all listeners of `event`. `func` must return a boolean value, and if the return value is false, forEachIf stops the looping immediately.  
Return `true` if all listeners are invoked, or `event` is not found, `false` if `func` returns `false`.

<a name="nested-listener-safety"></a>
## Nested listener safety
1. If a listener adds another listener of the same event to the dispatcher during a dispatching, the new listener is guaranteed not to be triggered within the same dispatching. This is guaranteed by an unsigned 64 bits integer counter. This rule will be broken is the counter is overflowed to zero in a dispatching, but this rule will continue working on the subsequence dispatching.  
2. Any listeners that are removed during a dispatching are guaranteed not triggered.  

<a name="time-complexities"></a>
## Time complexities
The time complexities being discussed here is about when operating on the listener in the underlying list, and `n` is the number of listeners. It doesn't include the event searching in the underlying `std::map` which is always O(log n).
- `appendListener`: O(1)
- `prependListener`: O(1)
- `insertListener`: O(1)
- `removeListener`: O(1)
- `enqueue`: O(1)

