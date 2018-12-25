# Tutorials of CallbackList

## Table Of Contents

- [Tutorial 1 -- Basic usage](#tutorial1)
- [Tutorial 2 -- Callback with parameters](#tutorial2)
- [Tutorial 3 -- Remove](#tutorial3)
- [Tutorial 4 -- For each](#tutorial4)

<a name="tutorials"></a>
## Tutorials

<a name="tutorial1"></a>
### CallbackList tutorial 1, basic

**Code**  
```javascript
// Create an object of CallbackList
let callbackList = new eventjs.CallbackList();

// Add a callback.
// function() {} is the callback.
// anonymous is not required, any function is fine.
callbackList.append(function() {
	console.log("Got callback 1.");
});
// Another callback, arrow function in ES6
callbackList.append(() => {
	console.log("Got callback 2.");
});

// Invoke the callback list
callbackList.dispatch();
```

**Output**  
> Got callback 1.  
> Got callback 2.  

**Remarks**  
First let's create a callback list.
```javascript
let callbackList = new eventjs.CallbackList();
```

Now let's add a callback.  
```javascript
callbackList.append(function() {
	console.log("Got callback 1.");
});
```
Function `append` takes one arguments, the *callback*.  
The *callback* can be any function..  
In the tutorial, we also add another callback.  

Now let's invoke the callbackList.
```javascript
callbackList.dispatch();
```
During the invoking, all callbacks will be invoked one by one in the order of they were added.

<a name="tutorial2"></a>
### CallbackList tutorial 2, callback with parameters

**Code**  
```javascript
// Create an object of CallbackList
let callbackList = new eventjs.CallbackList();

callbackList.append(function(s, b) {
	console.log("Got callback 1, s is", s, "b is", b);
});
// Another callback, arrow function in ES6
callbackList.append((s, b) => {
	console.log("Got callback 2, s is", s, "b is", b);
});

// Invoke the callback list
callbackList.dispatch("Hello world", true);
```

**Output**  
> Got callback 1, s is Hello world b is true  
> Got callback 2, s is Hello world b is 1  

**Remarks**  

<a name="tutorial3"></a>
### CallbackList tutorial 3, remove

**Code**  
```javascript
let callbackList = new eventjs.CallbackList();

// Add some callbacks
callbackList.append(function() {
	console.log("Got callback 1.");
});
let handle = callbackList.append(() => {
	console.log("Got callback 2.");
});
let f = function() {
	console.log("Got callback 3.");
};
callbackList.append(f);

// Remove the second callback by handle
callbackList.remove(handle);
// Remove the third callback by function
callbackList.remove(f);

// Invoke the callback list
// The "Got callback 2" and "Got callback 3" callback should not be triggered.
callbackList.dispatch();
```

**Output**  
> Got callback 1.  

**Remarks**  

<a name="tutorial4"></a>
### CallbackList tutorial 4, for each

**Code**  
```javascript
let callbackList = new eventjs.CallbackList();

// Add some callbacks
callbackList.append(function() {
	console.log("Got callback 1.");
});
callbackList.append(() => {
	console.log("Got callback 2.");
});
callbackList.append(function() {
	console.log("Got callback 3.");
});

// Now call forEach to remove the second callback
// The forEach callback prototype is function(callback)
let index = 0;
callbackList.forEach(function(callback) {
	console.log("forEach(Callback), invoked");
	if(index == 1) {
		callbackList.remove(callback);
		console.log("forEach(Callback), removed second callback");
	}
	++index;
});

// Invoke the callback list
// The "Got callback 2" callback should not be triggered.
callbackList.dispatch();
```

**Output**  
> Got callback 1.  
> Got callback 3.  

**Remarks**  

