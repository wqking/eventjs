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

describe('Tutorial: EventQueue', () => {
	it('tutorial 1, basic', () => {
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
	});

});
