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

if(testutil === undefined) { var testutil = {}; }

;(function(ns) {
'use strict';

let assert = require('assert');

ns.checkArraysEqual = function(a, b)
{
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;

	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

ns.verifyLinkedList = function(callbackList, dataList)
{
	const count = dataList.length;
	if(count == 0) {
		assert.ok(! callbackList._head);
		assert.ok(! callbackList._tail);
		return;
	}

	assert.ok(! callbackList._head._previous);
	assert.ok(! callbackList._tail._next);

	if(count == 1) {
		assert.ok(callbackList._head);
		assert.strictEqual(callbackList._head, callbackList._tail);
	}

	let node = callbackList._head;
	for(let i = 0; i < count; ++i) {
		assert.ok(node);
		
		if(i == 0) {
			assert.ok(! node._previous);
			assert.strictEqual(node, callbackList._head);
		}
		if(i == count - 1) {
			assert.ok(! node._next);
			assert.strictEqual(node, callbackList._tail);
		}
		
		assert.strictEqual(node._callback, dataList[i]);

		node = node._next;
	}
}

if (typeof define === 'function' && define.amd) {
	define(function () { return ns;	});
}
else if (typeof module === 'object' && module.exports){
	module.exports = ns;
}
else {
}

})(testutil);
