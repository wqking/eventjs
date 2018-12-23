let assert = require('assert');
let eventjs = require('../../src/callbacklist.js');
let testutil = require('./testutil.js');

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
		dataList.fill(0);
		
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

		return testutil.checkArraysEqual(dataList, compareList);
	}

	it('remove inside callback', () => {
		assert.ok(removalTester(7, 3, [ 0 ]));
		assert.ok(removalTester(7, 3, [ 1 ]));
		assert.ok(removalTester(7, 3, [ 2 ]));
		assert.ok(removalTester(7, 3, [ 3 ]));
		assert.ok(removalTester(7, 3, [ 4 ]));
		assert.ok(removalTester(7, 3, [ 5 ]));
		assert.ok(removalTester(7, 3, [ 6 ]));

		assert.ok(removalTester(7, 3, [ 0, 3 ]));
		assert.ok(removalTester(7, 3, [ 3, 0 ]));
		assert.ok(removalTester(7, 3, [ 1, 3 ]));
		assert.ok(removalTester(7, 3, [ 3, 1 ]));
		assert.ok(removalTester(7, 3, [ 2, 3 ]));
		assert.ok(removalTester(7, 3, [ 3, 2 ]));
		assert.ok(removalTester(7, 3, [ 3, 4 ]));
		assert.ok(removalTester(7, 3, [ 4, 3 ]));
		assert.ok(removalTester(7, 3, [ 3, 5 ]));
		assert.ok(removalTester(7, 3, [ 5, 3 ]));
		assert.ok(removalTester(7, 3, [ 3, 6 ]));
		assert.ok(removalTester(7, 3, [ 6, 3 ]));

		assert.ok(removalTester(7, 3, [ 2, 4 ]));
		assert.ok(removalTester(7, 3, [ 4, 2 ]));
		assert.ok(removalTester(7, 3, [ 0, 6 ]));
		assert.ok(removalTester(7, 3, [ 0, 0 ]));

		assert.ok(removalTester(7, 3, [ 4, 5 ]));
		assert.ok(removalTester(7, 3, [ 5, 4 ]));

		assert.ok(removalTester(7, 3, [ 3, 4, 5 ]));
		assert.ok(removalTester(7, 3, [ 3, 5, 4 ]));

		assert.ok(removalTester(7, 3, [ 0, 1, 2, 3, 4, 5, 6 ]));
		assert.ok(removalTester(7, 3, [ 6, 5, 4, 3, 2, 1, 0 ]));
		assert.ok(removalTester(7, 3, [ 0, 2, 1, 3, 5, 4, 6 ]));
		assert.ok(removalTester(7, 3, [ 6, 4, 5, 3, 1, 2, 0 ]));
	});

	context('forEach and forEachIf', () => {
		let callbackList = new eventjs.CallbackList();
		const itemCount = 5;
		let dataList = new Array(itemCount);
		for(let i = 0; i < itemCount; ++i) {
			callbackList.append(function() {
				dataList[i] = i + 1;
			});
		}

		it('forEach', () => {
			dataList.fill(0);
			callbackList.forEach(function(callback) {
				callback();
			});

			assert.ok(testutil.checkArraysEqual(dataList, [ 1, 2, 3, 4, 5 ]));
		});
		it('forEachIf', () => {
			dataList.fill(0);
			const result = callbackList.forEachIf(function(callback) {
				const index = 2;
				const isZero = (dataList[index] == 0);
				callback();
				if(isZero && dataList[index] != 0) {
					return false;
				}
				return true;
			});

			assert.ok(! result);
			assert.ok(testutil.checkArraysEqual(dataList, [ 1, 2, 3, 0, 0 ]));
		});
	});

	it('append/remove/insert', () => {
		let callbackList = new eventjs.CallbackList();
		let h100, h101, h102, h103, h104, h105, h106, h107;

		{
			let handle = callbackList.append(100);
			h100 = handle;
			testutil.verifyLinkedList(callbackList, [ 100 ]);
		}

		{
			let handle = callbackList.append(101);
			h101 = handle;
			testutil.verifyLinkedList(callbackList, [ 100, 101 ]);
		}

		{
			let handle = callbackList.append(102);
			h102 = handle;
			testutil.verifyLinkedList(callbackList, [ 100, 101, 102 ]);
		}

		{
			let handle = callbackList.append(103);
			h103 = handle;
			testutil.verifyLinkedList(callbackList, [ 100, 101, 102, 103 ]);
		}

		{
			let handle = callbackList.append(104);
			h104 = handle;
			testutil.verifyLinkedList(callbackList, [ 100, 101, 102, 103, 104 ]);
		}

		{
			let handle = callbackList.insert(105, h103); // before 103
			h105 = handle;
			testutil.verifyLinkedList(callbackList, [ 100, 101, 102, 105, 103, 104 ]);
			
			h107 = callbackList.insert(107, h100); // before 100
			testutil.verifyLinkedList(callbackList, [ 107, 100, 101, 102, 105, 103, 104 ]);

			h106 = callbackList.insert(106, handle); // before 105
			testutil.verifyLinkedList(callbackList, [ 107, 100, 101, 102, 106, 105, 103, 104 ]);
		}

		callbackList.remove(h100);
		testutil.verifyLinkedList(callbackList, [ 107, 101, 102, 106, 105, 103, 104 ]);

		callbackList.remove(h103);
		callbackList.remove(h102);
		testutil.verifyLinkedList(callbackList, [ 107, 101, 106, 105, 104 ]);

		callbackList.remove(h105);
		callbackList.remove(h104);
		callbackList.remove(h106);
		callbackList.remove(h101);
		callbackList.remove(h107);
		testutil.verifyLinkedList(callbackList, []);
	});

	context('insert', () => {
		let callbackList;
		let h100, h101, h102, h103, h104;
		
		let reset = ()=> {
			callbackList = new eventjs.CallbackList();
			h100 = callbackList.append(100);
			h101 = callbackList.append(101);
			h102 = callbackList.append(102);
			h103 = callbackList.append(103);
			h104 = callbackList.append(104);
		};

		it('before front', () => {
			reset();
			
			callbackList.insert(105, h100);
			testutil.verifyLinkedList(callbackList, [ 105, 100, 101, 102, 103, 104 ]);
		});

		it('before second', () => {
			reset();
			
			callbackList.insert(105, h101);
			testutil.verifyLinkedList(callbackList, [ 100, 105, 101, 102, 103, 104 ]);
		});

		it('before nonexist', () => {
			reset();
			
			callbackList.insert(105, null);
			testutil.verifyLinkedList(callbackList, [ 100, 101, 102, 103, 104, 105 ]);
		});
	});

	context('remove', () => {
		let callbackList;
		let h100, h101, h102, h103, h104;
		
		let reset = ()=> {
			callbackList = new eventjs.CallbackList();
			h100 = callbackList.append(100);
			h101 = callbackList.append(101);
			h102 = callbackList.append(102);
			h103 = callbackList.append(103);
			h104 = callbackList.append(104);
		};

		it('remove front', () => {
			reset();
			
			callbackList.remove(h100);
			testutil.verifyLinkedList(callbackList, [ 101, 102, 103, 104 ]);

			callbackList.remove(h100);
			testutil.verifyLinkedList(callbackList, [ 101, 102, 103, 104 ]);
		});

		it('remove second', () => {
			reset();
			
			callbackList.remove(h101);
			testutil.verifyLinkedList(callbackList, [ 100, 102, 103, 104 ]);

			callbackList.remove(h101);
			testutil.verifyLinkedList(callbackList, [ 100, 102, 103, 104 ]);
		});

		it('remove end', () => {
			reset();
			
			callbackList.remove(h104);
			testutil.verifyLinkedList(callbackList, [ 100, 101, 102, 103 ]);

			callbackList.remove(h104);
			testutil.verifyLinkedList(callbackList, [ 100, 101, 102, 103 ]);
		});

		it('remove nonexist', () => {
			reset();
			
			callbackList.remove(null);
			testutil.verifyLinkedList(callbackList, [ 100, 101, 102, 103, 104 ]);

			callbackList.remove(null);
			testutil.verifyLinkedList(callbackList, [ 100, 101, 102, 103, 104 ]);
		});

		it('remove all', () => {
			reset();
			
			callbackList.remove(h102);
			callbackList.remove(h104);
			callbackList.remove(h103);
			callbackList.remove(h101);
			callbackList.remove(h100);
			testutil.verifyLinkedList(callbackList, []);
		});
	});

	it('has', () => {
		let callbackList = new eventjs.CallbackList();
		let h100, h101;
	
		assert.ok(! callbackList.has(100));
		assert.ok(! callbackList.has(h100));
		assert.ok(! callbackList.has(101));
		assert.ok(! callbackList.has(h101));
		
		h100 = callbackList.append(100);
		assert.ok(callbackList.has(100));
		assert.ok(callbackList.has(h100));
		assert.ok(! callbackList.has(101));
		assert.ok(! callbackList.has(h101));
		
		h101 = callbackList.append(101);
		assert.ok(callbackList.has(100));
		assert.ok(callbackList.has(h100));
		assert.ok(callbackList.has(101));
		assert.ok(callbackList.has(h101));
		
		callbackList.remove(100);
		assert.ok(! callbackList.has(100));
		assert.ok(! callbackList.has(h100));
		assert.ok(callbackList.has(101));
		assert.ok(callbackList.has(h101));
		
		callbackList.remove(h101);
		assert.ok(! callbackList.has(100));
		assert.ok(! callbackList.has(h100));
		assert.ok(! callbackList.has(101));
		assert.ok(! callbackList.has(h101));
	});

	it('hasAny', () => {
		let callbackList = new eventjs.CallbackList();

		assert.ok(! callbackList.hasAny());
	
		callbackList.append(100);
		assert.ok(callbackList.hasAny());
		
		callbackList.append(101);
		assert.ok(callbackList.hasAny());
		
		callbackList.remove(100);
		assert.ok(callbackList.hasAny());
		
		callbackList.remove(101);
		assert.ok(! callbackList.hasAny());
	});

});
