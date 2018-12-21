let assert = require('assert');
let eventjs = require('../../src/callbacklist.js');

function checkArraysEqual(a, b)
{
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;

	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

describe('CallbackList', () => {
	it('nested callbacks, new callbacks should not be triggered', () => {
		let callbackList = new eventjs.CallbackList();
		let a = 0, b = 0;
		callbackList.append(function() {
			a = 1;
			
			let h1 = callbackList.append(function() {
				++b;
			
				callbackList.append(function() {
					++b;
				});
				let h2 = callbackList.prepend(function() {
					++b;
					callbackList.append(function() {
						++b;
					});
				});

				callbackList.append(function() {
					++b;
				});

				callbackList.insert(function() {
					++b;
				}, h2);

				callbackList.prepend(function() {
					++b;
				});
			});
			callbackList.prepend(function() {
				++b;
			});

			callbackList.insert(function() {
				++b;
			}, h1);
		});
		
		assert.strictEqual(a, 0);
		assert.strictEqual(b, 0);
		
		callbackList.dispatch();
		assert.strictEqual(a, 1);
		assert.strictEqual(b, 0);
		
		callbackList.dispatch();
		assert.strictEqual(a, 1);
		assert.strictEqual(b, 3); // there are 3 new top level callback

		b = 0;
		callbackList.dispatch();
		assert.strictEqual(a, 1);
		assert.ok(b > 3);
	});

	function removalTester(callbackCount, removerIndex, indexesToBeRemoved) {
		let callbackList = new eventjs.CallbackList();
		let handleList = new Array(callbackCount);
		let dataList = new Array(callbackCount);
		
		for(let i = 0; i < callbackCount; ++i) {
			if(i === removerIndex) {
				handleList[i] = callbackList.append(function() {
					dataList[i] = i + 1;
					
					for(let index of indexesToBeRemoved) {
						callbackList.remove(handleList[index]);
					}
				});
			}
			else {
				handleList[i] = callbackList.append(function() {
					dataList[i] = i + 1;
				});
			}
		}

		callbackList.dispatch();

		let compareList = new Array(callbackCount);
		for(let i = 0; i < compareList.length; ++i) {
			compareList[i] = i + 1;
		}

		for(let index of indexesToBeRemoved) {
			if(index > removerIndex) {
				compareList[index] = 0;
			}
		}

		return checkArraysEqual(dataList, compareList);
	}

	it('remove inside callback', () => {
		assert.ok(removalTester(7, 3, [ 0 ]));
	});
});
