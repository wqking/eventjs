if(eventjs === undefined) { var eventjs = {}; }

;(function(ns) {
'use strict';

var eventdispatcher = ns;
if(typeof require === 'function') { eventdispatcher = require('./eventdispatcher.js'); }

function EventQueue(params)
{
	eventdispatcher.EventDispatcher.call(this, params);
	
	this._queueList = [];
}

EventQueue.prototype = Object.create(eventdispatcher.EventDispatcher.prototype);

var proto = EventQueue.prototype;

proto.enqueue = function()
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

proto.process = function()
{
	var list = this._queueList;
	this._queueList = [];
	
	var count = list.length;
	for(var i = 0; i < count; ++i) {
		this.dispatchQueuedEvent(list[i]);
	}
}

proto.processOne = function()
{
	if(this._queueList.length > 0) {
		this.dispatchQueuedEvent(this._queueList.shift());
	}
}

proto.processIf = function(func)
{
	var list = this._queueList;
	this._queueList = [];
	
	var unprocessedList = [];
	
	var count = list.length;
	for(var i = 0; i < count; ++i) {
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

proto.empty = function()
{
	return this._queueList.length === 0;
}

proto.clearEvents = function()
{
	this._queueList.length = 0;
}

proto.peekEvent = function()
{
	return this._queueList[0];
}

proto.takeEvent = function()
{
	if(this._queueList.length > 0) {
		return this._queueList.shift();
	}
	
	return null;
}

proto.dispatchQueuedEvent = function(item)
{
	if(item) {
		var cbList = this._doGetCallbackList(item.event, false);
		if(cbList) {
			cbList.dispatch.apply(cbList, item.arguments);
		}
	}
}

ns.EventQueue = EventQueue;

if (typeof define === 'function' && define.amd) {
	define(function () { return ns;	});
}
else if (typeof module === 'object' && module.exports){
	module.exports = ns;
}
else {
}

})(eventjs);
