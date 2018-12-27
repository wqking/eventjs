# Class CallbackList reference

## Table Of Contents

- [API reference](#apis)
- [Nested callback safety](#nested-callback-safety)
- [Time complexities](#time-complexities)

## Description

CallbackList is the fundamental class in eventjs. The other classes EventDispatcher and EventQueue are built on CallbackList.  

CallbackList holds a list of callbacks. At the time of the call, CallbackList simply invokes each callback one by one. Consider CallbackList as the signal/slot system in Qt, or the callback function pointer in some Windows APIs (such as lpCompletionRoutine in `ReadFileEx`).  
The *callback* can be any functions.  

<a name="apis"></a>
## API reference

### Member functions

```javascript
CallbackList.prototype.append(callback);
```  
Add the *callback* to the callback list.  
The callback is added to the end of the callback list.  
Return a handle object that represents the callback. The handle can be used to remove this callback or to insert additional callbacks before this callback.  
If `append` is called in another callback during the invoking of the callback list, the new callback is guaranteed not to be triggered during the same callback list invoking.  
The time complexity is O(1).

```javascript
CallbackList.prototype.prepend(callback);
```  
Add the *callback* to the callback list.  
The callback is added to the beginning of the callback list.  
Return a handle object that represents the callback. The handle can be used to remove this callback or to insert additional callbacks before this callback.  
If `prepend` is called in another callback during the invoking of the callback list, the new callback is guaranteed not to be triggered during the same callback list invoking.  
The time complexity is O(1).

```javascript
CallbackList.prototype.insert(callback, before);
```  
Insert the *callback* to the callback list before the callback *before*. If *before* is not found, *callback* is added at the end of the callback list.  
*before* can be a callback function, or a handle object.  
Return a handle object that represents the callback. The handle can be used to remove this callback or to insert additional callbacks before this callback.  
If `insert` is called in another callback during the invoking of the callback list, the new callback is guaranteed not to be triggered during the same callback list invoking.  
The time complexity is O(1).  

```javascript
CallbackList.prototype.remove(callback);
```  
Remove the callback from the callback list.  
*callback* can be a callback function, or a handle object.  
Return true if the callback is removed successfully, false if the callback is not found.  
The time complexity is O(1).  

```javascript
CallbackList.prototype.empty();
```
Return true if the callback list is empty.  

```javascript
CallbackList.prototype.has(callback);
```  
Return true if the callback list contains *callback*.  
*callback* can be a callback function, or a handle object.  

```javascript
CallbackList.prototype.hasAny();
```  
Return true if the callback list contains any callback.  

```javascript
CallbackList.prototype.dispatch(arg1, args2, ...);
```  
Invoke each callbacks in the callback list.  
The callbacks are called with arguments `arg1`, `arg2`, etc.  

```javascript
CallbackList.prototype.applyDispatch([ arg1, args2, ... ]);
```  
Invoke each callbacks in the callback list.  
The callbacks are called with arguments `arg1`, `arg2`, etc.  
Note the arguments are passed in an array, similar to Function.prototype.apply.

```javascript
CallbackList.prototype.forEach(func);
```  
Apply `func` to all callbacks.  
The `func` receives one parameter which is the callback.  
**Note**: the `func` can remove any callbacks, or add other callbacks, safely.

```javascript
CallbackList.prototype.forEachIf(func);
```  
Apply `func` to all callbacks. `func` must return a boolean value, and if the return value is false, forEachIf stops the looping immediately.  
Return `true` if all callbacks are invoked, or `event` is not found, `false` if `func` returns `false`.

<a name="nested-callback-safety"></a>
## Nested callback safety
1. If a callback adds another callback to the callback list during a invoking, the new callback is guaranteed not to be triggered within the same invoking. This is guaranteed by an integer counter. This rule will be broken is the counter is overflowed to zero in a invoking, but this rule will continue working on the subsequence invoking.  
2. Any callbacks that are removed during a invoking are guaranteed not triggered.  


<a name="time-complexities"></a>
## Time complexities
- `append`: O(1)
- `prepend`: O(1)
- `insert`: O(1)
- `remove`: O(1)

