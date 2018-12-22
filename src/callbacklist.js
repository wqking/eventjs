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

function CallbackList()
{
	this._head = null;
	this._tail = null;
	this._currentCounter = 0;
}

CallbackList.prototype.append = function(callback)
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

CallbackList.prototype.prepend = function(callback)
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

CallbackList.prototype.insert = function(callback, before)
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

CallbackList.prototype.remove = function(handle)
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

CallbackList.prototype.dispatch = function()
{
	var counter = this._currentCounter;
	var node = this._head;
	while(node) {
		if(node._counter != 0 && counter >= node._counter) {
			node._callback.apply(this, arguments);
		}
		node = node._next;
	}
}

CallbackList.prototype.forEach = function(func)
{
	var node = this._head;
	while(node) {
		if(node._counter != 0 && counter >= node._counter) {
			func(node._callback);
		}
		node = node._next;
	}
}

CallbackList.prototype.forEachIf = function(func)
{
	var node = this._head;
	while(node) {
		if(node._counter != 0 && counter >= node._counter) {
			if(! func(node._callback)) {
				break;
			}
		}

		node = node._next;
	}
}

CallbackList.prototype._doFindNode = function(handle)
{
	if(handle instanceof Node) {
		return handle;
	}

	var node = this._head;
	while(node) {
		if(node._callback === handle) {
			return node;
		}
		node = node._next;
	}
	
	return null;
}

CallbackList.prototype._getNextCounter = function()
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
