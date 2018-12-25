// eventjs library
// Copyright (C) 2019 Wang Qi (wqking)
// Github: https://github.com/wqking/eventjs
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// import eventjs
let eventjs = require('../../dist/eventjs.js');

describe('Tutorial: EventDispatcher', () => {
	it('tutorial 1, basic', () => {
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
	});

	it('tutorial 2, listener with parameters', () => {
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
	});

	it('tutorial 3, customized Event object', () => {
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
	});

	it('tutorial 4, event canceling', () => {
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
	});
});
