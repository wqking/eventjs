/*eventjs v0.0.1, by wqking, https://github.com/wqking/eventjs, @preserve*/

if(eventjs === undefined) { var eventjs = {}; }

;(function(ns) {
'use strict';

function Node(callback, counter)
{
	this._previous = null;
	this._next = null;
	this._callback = callback;
	this._counter = counter;
}

function CallbackList(params)
{
	this._head = null;
	this._tail = null;
	this._currentCounter = 0;

	params = params || {};
	this._canContinueInvoking = params.hasOwnProperty('canContinueInvoking') ? !! params.canContinueInvoking : null;
	this._argumentsAsArray = params.hasOwnProperty('argumentsAsArray') ? !! params.argumentsAsArray : false;
	if(this._argumentsAsArray) {
		this.dispatch = this._dispatchArgumentsAsArray;
		this.applyDispatch = this._applyDispatchArgumentsAsArray;
	}
	else {
		this.dispatch = this._dispatchNotArgumentsAsArray;
		this.applyDispatch = this._applyDispatchNotArgumentsAsArray;
	}
}

var proto = CallbackList.prototype;

proto.append = function(callback)
{
	var node = new Node(callback, this._getNextCounter());

	if(this._head) {
		node._previous = this._tail;
		this._tail._next = node;
		this._tail = node;
	}
	else {
		this._head = node;
		this._tail = node;
	}
	
	return node;
}

proto.prepend = function(callback)
{
	var node = new Node(callback, this._getNextCounter());

	if(this._head) {
		node._next = this._head;
		this._head._previous = node;
		this._head = node;
	}
	else {
		this._head = node;
		this._tail = node;
	}
	
	return node;
}

proto.insert = function(callback, before)
{
	var beforeNode = this._doFindNode(before);
	if(! beforeNode) {
		return this.append(callback);
	}

	var node = new Node(callback, this._getNextCounter());

	node._previous = beforeNode._previous;
	node._next = beforeNode;
	if(beforeNode._previous) {
		beforeNode._previous._next = node;
	}
	beforeNode._previous = node;

	if(beforeNode == this._head) {
		this._head = node;
	}
	
	return node;
}

proto.remove = function(handle)
{
	var node = this._doFindNode(handle);
	if(! node) {
		return false;
	}
	
	if(node._next) {
		node._next._previous = node._previous;
	}
	if(node._previous) {
		node._previous._next = node._next;
	}

	if(this._head == node) {
		this._head = node._next;
	}
	if(this._tail == node) {
		this._tail = node._previous;
	}

	// Mark it as deleted
	node._counter = 0;

	return true;
}

proto.empty = function()
{
	return ! this._head;
}

proto.has = function(handle)
{
	return !! this._doFindNode(handle);
}

proto.hasAny = function()
{
	return !! this._head;
}

// duplicated code for performance reason
proto._dispatchArgumentsAsArray = function()
{
	var counter = this._currentCounter;
	var node = this._head;
	while(node) {
		if(node._counter != 0 && counter >= node._counter) {
			node._callback.call(this, arguments);
			if(this._canContinueInvoking && ! this._canContinueInvoking.call(this, arguments)) {
				break;
			}
		}
		node = node._next;
	}
}

proto._dispatchNotArgumentsAsArray = function()
{
	var counter = this._currentCounter;
	var node = this._head;
	while(node) {
		if(node._counter != 0 && counter >= node._counter) {
			node._callback.apply(this, arguments);
			if(this._canContinueInvoking && ! this._canContinueInvoking.apply(this, arguments)) {
				break;
			}
		}
		node = node._next;
	}
}

proto._applyDispatchArgumentsAsArray = function(args)
{
	var counter = this._currentCounter;
	var node = this._head;
	while(node) {
		if(node._counter != 0 && counter >= node._counter) {
			node._callback.call(this, args);
			if(this._canContinueInvoking && ! this._canContinueInvoking.call(this, args)) {
				break;
			}
		}
		node = node._next;
	}
}

proto._applyDispatchNotArgumentsAsArray = function(args)
{
	var counter = this._currentCounter;
	var node = this._head;
	while(node) {
		if(node._counter != 0 && counter >= node._counter) {
			node._callback.apply(this, args);
			if(this._canContinueInvoking && ! this._canContinueInvoking.apply(this, args)) {
				break;
			}
		}
		node = node._next;
	}
}

proto.forEach = function(func)
{
	var node = this._head;
	var counter = this._currentCounter;
	while(node) {
		if(node._counter != 0 && counter >= node._counter) {
			func(node._callback);
		}
		node = node._next;
	}
}

proto.forEachIf = function(func)
{
	var node = this._head;
	var counter = this._currentCounter;
	while(node) {
		if(node._counter != 0 && counter >= node._counter) {
			if(! func(node._callback)) {
				return false;
			}
		}

		node = node._next;
	}
	
	return true;
}

proto._doFindNode = function(handle)
{
	var node = this._head;
	while(node) {
		if(node === handle || node._callback === handle) {
			return node;
		}
		node = node._next;
	}
	
	return null;
}

proto._getNextCounter = function()
{
	var result = ++this._currentCounter;
	if(result == 0) { // overflow, let's reset all nodes' counters.
		var node = this._head;
		while(node) {
			node._counter = 1;
			node = node._next;
		}
		result = ++currentCounter;
	}

	return result;
}

ns.CallbackList = CallbackList;

if (typeof define === 'function' && define.amd) {
	define(function () { return ns;	});
}
else if (typeof module === 'object' && module.exports){
	module.exports = ns;
}
else {
}

})(eventjs);
