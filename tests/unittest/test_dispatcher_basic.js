let assert = require('assert');
let eventjs = require('../../src/eventdispatcher.js');

describe('CallbackList', () => {
	it('nested callbacks, new callbacks should not be triggered', () => {
		let callbackList = new eventjs.EventDispatcher();
	});
});
