# Class EventQueue reference

## Table Of Contents

- [API reference](#apis)
- [Internal data structure](#internal-data-structure)

## Description

EventQueue includes all features of EventDispatcher and adds event queue features.  
EventQueue is asynchronous. Events are cached in the queue when `EventQueue.enqueue` is called, and dispatched later when `EventQueue.process` is called.  
EventQueue is equivalent to the event system (QEvent) in Qt, or the message processing in Windows API.  

<a name="apis"></a>
## API reference

### Member functions

```javascript
EventDispatcher.prototype.enqueue(event arg1, arg2, ...);
```  
Put an event into the event queue.  
All arguments are copied to internal data structure.  
The time complexity is O(1).  

```javascript
EventDispatcher.prototype.process();
```  
Process the event queue. All events in the event queue are dispatched once and then removed from the queue.  
The function returns true if any events were processed, false if no event was processed.  
Any new events added to the queue during `process()` are not dispatched during current `process()`.  

```javascript
EventDispatcher.prototype.processOne();
```  
Process one event in the event queue. The first event in the event queue is dispatched once and then removed from the queue.  
The function returns true if one event was processed, false if no event was processed.  
Any new events added to the queue during `processOne()` are not dispatched during current `processOne()`.  

```javascript
EventDispatcher.prototype.processIf(func);
```
Process the event queue. Before processing an event, the event is passed to `func` and the event will be processed only if `func` returns true.  
`func` takes exactly the same arguments as `EventQueue.enqueue`, and returns a boolean value.  
`processIf` returns true if any event was dispatched, false if no event was dispatched.  
`processIf` has some good use scenarios:  
1. Process certain events. For example, in a GUI application, the UI related events may be only desired to processed by one module.  
2. Process the events until certain time. For example, in a game engine, the event process may be limited to only several milliseconds, the remaining events will be process in next game loop.  

```javascript
EventDispatcher.prototype.empty();
```
Return true if there is no any event in the event queue, false if there are any events in the event queue.  

```javascript
EventDispatcher.prototype.clearEvents();
```
Clear all queued events without dispatching them.  

```javascript
EventDispatcher.prototype.peekEvent();
```
Return a queued event from the queue.  
```javascript
A queued event is an array with all arguments passed to `EventQueue.enqueue`.  
If the queue is empty, the function returns null.  
After the function returns, the original even is still in the queue.  

```javascript
EventDispatcher.prototype.takeEvent();
```
Return an event from the queue and remove the original event from the queue.  
If the queue is empty, the function returns null.  
After the function returns, the original even is removed from the queue.  

