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
	this._queueList.push(Array.prototype.slice.call(arguments, 0));
}

proto.process = function()
{
	var list = this._queueList;
	this._queueList = [];
	
	var count = list.length;
	for(var i = 0; i < count; ++i) {
		this.applyDispatch(list[i]);
	}
}

proto.processOne = function()
{
	if(this._queueList.length > 0) {
		this.applyDispatch(this._queueList.shift());
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
			this.applyDispatch(item);
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
