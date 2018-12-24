# eventjs -- JavaScript library for event dispatcher and callback list

eventjs is a JavaScript event library that provides tools that enable your application components to communicate with each other by dispatching events and listening for them. With eventjs you can easily implement signal/slot mechanism, or observer pattern.

## Facts and features

- **Powerful**
  - Supports synchronous event dispatching and asynchronous event queue.
  - Configurable and extensible.
  - Supports event filter via mixins.
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

npm install --save wq-eventjs

In code,

```javascript
```

### Namespace

`eventjs`

### Using CallbackList
```c++
#include "eventjs/callbacklist.h"
eventjs::CallbackList<void (const std::string &, const bool)> callbackList;
callbackList.append([](const std::string & s, const bool b) {
	std::cout << std::boolalpha << "Got callback 1, s is " << s << " b is " << b << std::endl;
});
callbackList.append([](std::string s, int b) {
	std::cout << std::boolalpha << "Got callback 2, s is " << s << " b is " << b << std::endl;
});
callbackList("Hello world", true);
```

### Using EventDispatcher
```c++
#include "eventjs/eventdispatcher.h"
eventjs::EventDispatcher<int, void ()> dispatcher;
dispatcher.appendListener(3, []() {
	std::cout << "Got event 3." << std::endl;
});
dispatcher.appendListener(5, []() {
	std::cout << "Got event 5." << std::endl;
});
dispatcher.appendListener(5, []() {
	std::cout << "Got another event 5." << std::endl;
});
// dispatch event 3
dispatcher.dispatch(3);
// dispatch event 5
dispatcher.dispatch(5);
```

### Using EventQueue
```c++
eventjs::EventQueue<int, void (const std::string &, const bool)> queue;

dispatcher.appendListener(3, [](const std::string s, bool b) {
	std::cout << std::boolalpha << "Got event 3, s is " << s << " b is " << b << std::endl;
});
dispatcher.appendListener(5, [](const std::string s, bool b) {
	std::cout << std::boolalpha << "Got event 5, s is " << s << " b is " << b << std::endl;
});

// The listeners are not triggered during enqueue.
queue.enqueue(3, "Hello", true);
queue.enqueue(5, "World", false);

// Process the event queue, dispatch all queued events.
queue.process();
```

## Documentations

* [Overview, thread and exception safety](doc/introduction.md)
* [Tutorials of CallbackList](doc/tutorial_callbacklist.md)
* [Tutorials of EventDispatcher](doc/tutorial_eventdispatcher.md)
* [Tutorials of EventQueue](doc/tutorial_eventqueue.md)
* [Class CallbackList](doc/callbacklist.md)
* [Class EventDispatcher](doc/eventdispatcher.md)
* [Class EventQueue](doc/eventqueue.md)
* [Utility class CounterRemover -- auto remove listeners after triggered certain times](doc/counterremover.md)
* [Utility class ConditionalRemover -- auto remove listeners when certain condition is satisfied](doc/conditionalremover.md)
* [Utility class ScopedRemover -- auto remove listeners when out of scope](doc/scopedremover.md)
* [Document of utilities](doc/eventutil.md)
* [Policies -- configure eventjs](doc/policies.md)
* [Mixins -- extend eventjs](doc/mixins.md)
* [Performance benchmarks](doc/benchmark.md)
* [FAQs, tricks, and tips](doc/faq.md)
* There are compilable tutorials in the unit tests.

## Build the unit tests

The library itself is header only and doesn't need building.  
The unit test requires CMake to build, and there is a makefile to ease the building.  
Go to folder `tests/build`, then run `make` with different target.
- `make vc17` #generate solution files for Microsoft Visual Studio 2017, then open eventpptest.sln in folder project_vc17
- `make vc15` #generate solution files for Microsoft Visual Studio 2015, then open eventpptest.sln in folder project_vc15
- `make mingw` #build using MinGW
- `make linux` #build on Linux

## Motivations

I (wqking) am a big fan of observer pattern (publish/subscribe pattern), and I used this pattern extensively in my code. I either used GCallbackList in my [cpgf library](https://github.com/cpgf/cpgf) which is too simple and unsafe (not support multi-threading or nested events), or repeated coding event dispatching mechanism such as I did in my [Gincu game engine](https://github.com/wqking/gincu) (the latest version has be rewritten to use eventjs). Both or these methods are neither fun nor robust.  
Thanking to C++11, now it's quite easy to write a reusable event library with beautiful syntax (it's a nightmare to simulate the variadic template in C++03), so here is `eventjs`.

