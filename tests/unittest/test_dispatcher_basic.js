let assert = require('assert');
let eventjs = require('../../src/eventdispatcher.js');
let testutil = require('./testutil.js');
let mixinfilter = require('../../src/mixins/mixinfilter.js');

describe('EventDispatcher', () => {
	it('string event', () => {
		let dispatcher = new eventjs.EventDispatcher();

		let a = 1;
		let b = 5;

		dispatcher.appendListener("event1", function() {
			a = 2;
		});
		dispatcher.appendListener("event1", function() {
			b = 8;
		});

		assert.notStrictEqual(a, 2);
		assert.notStrictEqual(b, 8);

		dispatcher.dispatch("event1");
		
		assert.strictEqual(a, 2);
		assert.strictEqual(b, 8);
	});

	it('int event', () => {
		let dispatcher = new eventjs.EventDispatcher();

		let a = 1;
		let b = 5;

		dispatcher.appendListener(3, function() {
			a = 2;
		});
		dispatcher.appendListener(3, function() {
			b = 8;
		});

		assert.notStrictEqual(a, 2);
		assert.notStrictEqual(b, 8);

		dispatcher.dispatch(3);
		
		assert.strictEqual(a, 2);
		assert.strictEqual(b, 8);
	});

	it('add/remove, int event', () => {
		let dispatcher = new eventjs.EventDispatcher();
		const event = 3;

		let a = 1;
		let b = 5;
		
		var ha, hb;

		ha = dispatcher.appendListener(event, function() {
			a = 2;
			dispatcher.removeListener(event, hb);
			dispatcher.removeListener(event, ha);
			ha = null;
			hb = null;
		});
		hb = dispatcher.appendListener(event, function() {
			b = 8;
		});

		assert.ok(ha);
		assert.ok(hb);

		assert.notStrictEqual(a, 2);
		assert.notStrictEqual(b, 8);

		dispatcher.dispatch(event);

		assert.ok(! ha);
		assert.ok(! hb);

		assert.strictEqual(a, 2);
		assert.notStrictEqual(b, 8);

		a = 1;
		assert.notStrictEqual(a, 2);
		assert.notStrictEqual(b, 8);

		dispatcher.dispatch(event);
		assert.notStrictEqual(a, 2);
		assert.notStrictEqual(b, 8);
	});

	it('add another listener inside a listener, int event', () => {
		let dispatcher = new eventjs.EventDispatcher();
		const event = 3;

		let a = 1;
		let b = 5;

		dispatcher.appendListener(event, function() {
			a = 2;
			dispatcher.appendListener(event, function() {
				b = 8;
			});
		});

		assert.notStrictEqual(a, 2);
		assert.notStrictEqual(b, 8);

		dispatcher.dispatch(event);

		assert.strictEqual(a, 2);
		assert.notStrictEqual(b, 8);
	});
	
	it('inside EventDispatcher, int event', () => {
		let dispatcher = new eventjs.EventDispatcher();
		const event1 = 3;
		const event2 = 5;

		let a = 1;
		let b = 5;
		
		var ha, hb;

		ha = dispatcher.appendListener(event1, function() {
			a = 2;
			dispatcher.dispatch(event2);
		});
		hb = dispatcher.appendListener(event2, function() {
			b = 8;
			dispatcher.removeListener(event1, ha);
			dispatcher.removeListener(event2, hb);
			ha = null;
			hb = null;
		});

		assert.ok(ha);
		assert.ok(hb);

		assert.notStrictEqual(a, 2);
		assert.notStrictEqual(b, 8);

		dispatcher.dispatch(event1);

		assert.ok(! ha);
		assert.ok(! hb);

		assert.strictEqual(a, 2);
		assert.strictEqual(b, 8);
	});
	
	it('inside EventDispatcher, int event, params (string, int)', () => {
		let dispatcher = new eventjs.EventDispatcher();
		const event = 3;
		
		let sList = new Array(2);
		let iList = new Array(sList.length);

		dispatcher.appendListener(event, function(s, i) {
			sList[0] = s;
			iList[0] = i;
		});
		dispatcher.appendListener(event, function(s, i) {
			sList[1] = s + "2";
			iList[1] = i + 5;
		});

		assert.notStrictEqual(sList[0], "first");
		assert.notStrictEqual(sList[1], "first2");
		assert.notStrictEqual(iList[0], 3);
		assert.notStrictEqual(iList[1], 8);

		dispatcher.dispatch(event, "first", 3);

		assert.strictEqual(sList[0], "first");
		assert.strictEqual(sList[1], "first2");
		assert.strictEqual(iList[0], 3);
		assert.strictEqual(iList[1], 8);
	});
	
	it('hasListener', () => {
		let dispatcher = new eventjs.EventDispatcher();
		
		assert.ok(! dispatcher.hasListener(3, 103));
		assert.ok(! dispatcher.hasListener(5, 105));

		dispatcher.appendListener(3, 103);
		assert.ok(dispatcher.hasListener(3, 103));
		assert.ok(! dispatcher.hasListener(5, 105));

		dispatcher.appendListener(5, 105);
		assert.ok(dispatcher.hasListener(3, 103));
		assert.ok(dispatcher.hasListener(5, 105));

		dispatcher.removeListener(3, 103);
		assert.ok(! dispatcher.hasListener(3, 103));
		assert.ok(dispatcher.hasListener(5, 105));

		dispatcher.removeListener(5, 105);
		assert.ok(! dispatcher.hasListener(3, 103));
		assert.ok(! dispatcher.hasListener(5, 105));
	});

	it('hasAnyListener', () => {
		let dispatcher = new eventjs.EventDispatcher();
		
		assert.ok(! dispatcher.hasAnyListener(3));
		assert.ok(! dispatcher.hasAnyListener(5));

		dispatcher.appendListener(3, 103);
		assert.ok(dispatcher.hasAnyListener(3));
		assert.ok(! dispatcher.hasAnyListener(5));

		dispatcher.appendListener(5, 105);
		assert.ok(dispatcher.hasAnyListener(3));
		assert.ok(dispatcher.hasAnyListener(5));

		dispatcher.removeListener(3, 103);
		assert.ok(! dispatcher.hasAnyListener(3));
		assert.ok(dispatcher.hasAnyListener(5));

		dispatcher.removeListener(5, 105);
		assert.ok(! dispatcher.hasAnyListener(3));
		assert.ok(! dispatcher.hasAnyListener(5));
	});

	context('event filter', () => {
		let dispatcher;

		const itemCount = 5;
		const filterCount = 2;
		let dataList = new Array(itemCount);
		let filterData = new Array(filterCount);
		
		let reset = function() {
			dataList.fill(0);
			filterData.fill(0);

			dispatcher = new eventjs.EventDispatcher({
				mixins: [ new mixinfilter.MixinFilter() ],
				argumentPassingMode: eventjs.EventDispatcher.argumentPassingIncludeEvent
			});

			for(let i = 0; i < itemCount; ++i) {
				dispatcher.appendListener(i, function(e, index) {
					dataList[e] = index;
				});
			}
		}

		it("Filter invoked count", () => {
			reset();

			dispatcher.appendFilter(function() {
				++filterData[0];
				return true;
			});
			dispatcher.appendFilter(function() {
				++filterData[1];
				return true;
			});

			for(let i = 0; i < itemCount; ++i) {
				dispatcher.dispatch(i, 58);
			}

			assert.ok(testutil.checkArraysEqual(filterData, [ itemCount, itemCount ]));
			assert.ok(testutil.checkArraysEqual(dataList, [ 58, 58, 58, 58, 58 ]));
		});

		it("First filter blocks all other filters and listeners", () => {
			reset();

			dispatcher.appendFilter(function(args) {
				++filterData[0];
				if(args[0] >= 2) {
					return false;
				}
				return true;
			});
			dispatcher.appendFilter(function() {
				++filterData[1];
				return true;
			});

			for(let i = 0; i < itemCount; ++i) {
				dispatcher.dispatch(i, 58);
			}

			assert.ok(testutil.checkArraysEqual(filterData, [ itemCount, 2 ]));
			assert.ok(testutil.checkArraysEqual(dataList, [ 58, 58, 0, 0, 0 ]));
		});

		it("Second filter doesn't block first filter but all listeners", () => {
			reset();

			dispatcher.appendFilter(function() {
				++filterData[0];
				return true;
			});
			dispatcher.appendFilter(function(args) {
				++filterData[1];
				if(args[0] >= 2) {
					return false;
				}
				return true;
			});

			for(let i = 0; i < itemCount; ++i) {
				dispatcher.dispatch(i, 58);
			}

			assert.ok(testutil.checkArraysEqual(filterData, [ itemCount, itemCount ]));
			assert.ok(testutil.checkArraysEqual(dataList, [ 58, 58, 0, 0, 0 ]));
		});

		it("Filter manipulates the parameters", () => {
			reset();

			dispatcher.appendFilter(function(args) {
				++filterData[0];
				if(args[0] >= 2) {
					++args[1];
				}
				return true;
			});
			dispatcher.appendFilter(function() {
				++filterData[1];
				return true;
			});

			for(let i = 0; i < itemCount; ++i) {
				dispatcher.dispatch(i, 58);
			}

			assert.ok(testutil.checkArraysEqual(filterData, [ itemCount, itemCount ]));
			assert.ok(testutil.checkArraysEqual(dataList, [ 58, 58, 59, 59, 59 ]));
		});

	});

});
