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

describe('Tutorial: CallbackList', () => {
	it('tutorial 1, basic', () => {
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
	});

	it('tutorial 2, callback with parameters', () => {
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
	});

	it('tutorial 3, remove', () => {
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
	});

	it('tutorial 4, for each', () => {
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
	});
});
