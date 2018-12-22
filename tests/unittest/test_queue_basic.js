let assert = require('assert');
let eventjs = require('../../src/eventqueue.js');

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

	
});

