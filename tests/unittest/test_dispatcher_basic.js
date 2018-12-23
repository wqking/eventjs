let assert = require('assert');
let eventjs = require('../../src/eventdispatcher.js');

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

});
