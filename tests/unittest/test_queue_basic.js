let assert = require('assert');
let eventjs = require('../../src/eventqueue.js');
let testutil = require('./testutil.js');

describe('EventQueue', () => {
	it('string event', () => {
		let queue = new eventjs.EventQueue();

		let a = 1;
		let b = 5;

		queue.appendListener("event1", function() {
			a = 2;
		});
		queue.appendListener("event1", function() {
			b = 8;
		});

		assert.notStrictEqual(a, 2);
		assert.notStrictEqual(b, 8);

		queue.enqueue("event1");
		queue.process()
		
		assert.strictEqual(a, 2);
		assert.strictEqual(b, 8);
	});

	it('int event', () => {
		let queue = new eventjs.EventQueue();

		let a = 1;
		let b = 5;

		queue.appendListener(3, function() {
			a = 2;
		});
		queue.appendListener(3, function() {
			b = 8;
		});

		assert.notStrictEqual(a, 2);
		assert.notStrictEqual(b, 8);

		queue.enqueue(3);
		queue.process()
		
		assert.strictEqual(a, 2);
		assert.strictEqual(b, 8);
	});
	
	it('processOne, int event', () => {
		let queue = new eventjs.EventQueue();

		let a = 1;
		let b = 5;

		queue.appendListener(3, function() {
			a += 1;
		});
		queue.appendListener(5, function() {
			b += 3;
		});

		assert.strictEqual(a, 1);
		assert.strictEqual(b, 5);

		queue.enqueue(3);
		queue.enqueue(5);
		
		queue.processOne()
		assert.strictEqual(a, 2);
		assert.strictEqual(b, 5);
		
		queue.processOne()
		assert.strictEqual(a, 2);
		assert.strictEqual(b, 8);
	});
	
	it('int event, params (string, int)', () => {
		let queue = new eventjs.EventQueue();
		const event = 3;

		let sList = new Array(2);
		let iList = new Array(sList.length);

		queue.appendListener(event, function(s, n) {
			sList[0] = s;
			iList[0] = n;
		});
		queue.appendListener(event, function(s, n) {
			sList[1] = s + "2";
			iList[1] = n + 5;
		});

		assert.notStrictEqual(sList[0], "first");
		assert.notStrictEqual(sList[1], "first2");
		assert.notStrictEqual(iList[0], 3);
		assert.notStrictEqual(iList[1], 8);

		queue.enqueue(event, "first", 3);
		queue.process();

		assert.strictEqual(sList[0], "first");
		assert.strictEqual(sList[1], "first2");
		assert.strictEqual(iList[0], 3);
		assert.strictEqual(iList[1], 8);
	});
	
	it('customized event', () => {
		let getEvent = function(e) {
			return e.type;
		};

		let queue = new eventjs.EventQueue({
			getEvent: getEvent
		});

		let a = "Hello ";
		let b = "World ";

		queue.appendListener(3, function(e, s) {
			a += e.message + s + e.param;
		});
		queue.appendListener(3, function(e, s) {
			b += e.message + s + e.param;
		});

		assert.strictEqual(a, "Hello ");
		assert.strictEqual(b, "World ");

		queue.enqueue({ type: 3, message: "very ", param: 38 }, "good");
		queue.process();

		assert.strictEqual(a, "Hello very good38");
		assert.strictEqual(b, "World very good38");
	});

	context('peekEvent/takeEvent/dispatchQueuedEvent', () => {
		let queue;
		const itemCount = 3;
		let dataList;

		let add = function(e, n) {
			queue.enqueue(e, n);
		};

		let reset = function() {
			queue = new eventjs.EventQueue();
			dataList = new Array(itemCount);
			dataList.fill(0);

			queue.appendListener(3, function(n) {
				++dataList[n];
			});

			add(3, 0);
			add(3, 1);
			add(3, 2);
		};

		it("peek", () => {
			reset();

			let event = queue.peekEvent();
			assert.ok(event);
			assert.strictEqual(event.event, 3);
			assert.strictEqual(event.arguments[0], 0);
		});

		it("peek/peek", () => {
			reset();

			let event = queue.peekEvent();
			assert.ok(event);
			assert.strictEqual(event.event, 3);
			assert.strictEqual(event.arguments[0], 0);

			let event2 = queue.peekEvent();
			assert.ok(event2);
			assert.strictEqual(event2.event, 3);
			assert.strictEqual(event2.arguments[0], 0);
		});

		it("peek/take", () => {
			reset();

			let event = queue.peekEvent();
			assert.ok(event);
			assert.strictEqual(event.event, 3);
			assert.strictEqual(event.arguments[0], 0);

			let event2 = queue.takeEvent();
			assert.ok(event2);
			assert.strictEqual(event2.event, 3);
			assert.strictEqual(event2.arguments[0], 0);
		});

		it("peek/take/peek", () => {
			reset();

			let event = queue.peekEvent();
			assert.ok(event);
			assert.strictEqual(event.event, 3);
			assert.strictEqual(event.arguments[0], 0);

			let event2 = queue.takeEvent();
			assert.ok(event2);
			assert.strictEqual(event2.event, 3);
			assert.strictEqual(event2.arguments[0], 0);

			let event3 = queue.peekEvent();
			assert.ok(event3);
			assert.strictEqual(event3.event, 3);
			assert.strictEqual(event3.arguments[0], 1);
		});

		it("peek/dispatch/peek/dispatch again", () => {
			reset();

			let event = queue.peekEvent();
			assert.ok(event);
			assert.strictEqual(event.event, 3);
			assert.strictEqual(event.arguments[0], 0);

			queue.dispatchQueuedEvent(event);

			let event2 = queue.takeEvent();
			assert.ok(event2);
			assert.strictEqual(event2.event, 3);
			assert.strictEqual(event2.arguments[0], 0);
			
			assert.ok(testutil.checkArraysEqual(dataList, [ 1, 0, 0 ]));

			queue.dispatchQueuedEvent(event);

			assert.ok(testutil.checkArraysEqual(dataList, [ 2, 0, 0 ]));
		});

		it("process", () => {
			reset();

			// test the queue works with simple process(), ensure the process()
			// in the next "take all/process" works correctly.
			assert.ok(testutil.checkArraysEqual(dataList, [ 0, 0, 0 ]));
			queue.process();
			assert.ok(testutil.checkArraysEqual(dataList, [ 1, 1, 1 ]));
		});

		it("take all/process", () => {
			reset();

			for(let i = 0; i < itemCount; ++i) {
				assert.ok(queue.takeEvent());
			}

			assert.ok(! queue.peekEvent());
			assert.ok(! queue.takeEvent());

			assert.ok(testutil.checkArraysEqual(dataList, [ 0, 0, 0 ]));
			queue.process();
			assert.ok(testutil.checkArraysEqual(dataList, [ 0, 0, 0 ]));
		});
	});

});
