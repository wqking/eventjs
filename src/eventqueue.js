if(eventjs === undefined) { var eventjs = {}; }

;(function(ns) {
'use strict';

var eventdispatcher = ns;
if(typeof require === 'function') { eventdispatcher = require('./eventdispatcher.js'); }

function _EventQueue(params)
{
	eventdispatcher.EventDispatcher.call(this, params);
	
	this._queueList = [];
}

_EventQueue.prototype = Object.create(eventdispatcher.EventDispatcher.prototype);

_EventQueue.prototype.enqueue = function()
{
	if(this._getEvent) {
		var args = Array.prototype.slice.call(arguments, 0);
		this._queueList.push({
			event: this._getEvent.apply(this, arguments),
			arguments: args
		});
	}
	else {
		var args = Array.prototype.slice.call(arguments, 1);
		this._queueList.push({
			event: arguments[0],
			arguments: args
		});
	}
}

_EventQueue.prototype.process = function()
{
	var list = this._queueList;
	this._queueList = [];
	
	var count = list.length;
	for(var i = 0; i < count; ++i) {
		this.dispatchQueuedEvent(list[i]);
	}
}

_EventQueue.prototype.processOne = function()
{
	if(this._queueList.length > 0) {
		this.dispatchQueuedEvent(this._queueList.shift());
	}
}

_EventQueue.prototype.processIf = function(func)
{
	var list = this._queueList;
	this._queueList = [];
	
	var unprocessedList = [];
	
	var count = list.length;
	for(var i; i < count; ++i) {
		var item = list[i];
		if(func(item)) {
			this.dispatchQueuedEvent(item);
		}
		else {
			unprocessedList.push(item);
		}
	}
	
	if(unprocessedList.length > 0) {
		this._queueList = this._queueList.concat(unprocessedList);
	}
}

_EventQueue.prototype.empty = function()
{
	return this._queueList.length === 0;
}

_EventQueue.prototype.clearEvents = function()
{
	this._queueList.length = 0;
}

_EventQueue.prototype.peekEvent = function()
{
	return this._queueList[0];
}

_EventQueue.prototype.takeEvent = function()
{
	if(this._queueList.length > 0) {
		return this._queueList.shift();
	}
	
	return null;
}

_EventQueue.prototype.dispatchQueuedEvent = function(item)
{
	if(item) {
		var cbList = this._doGetCallbackList(item.event, false);
		if(cbList) {
			cbList.dispatch.apply(cbList, item.arguments);
		}
	}
}

ns.EventQueue = _EventQueue;

if (typeof define === 'function' && define.amd) {
	define(function () { return ns;	});
}
else if (typeof module === 'object' && module.exports){
	module.exports = ns;
}
else {
}

})(eventjs);
