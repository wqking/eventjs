if(eventjs === undefined) { var eventjs = {}; }

;(function(ns) {
'use strict';

var callbacklist = ns;
if(typeof require === 'function') { callbacklist = require('./callbacklist.js'); }

function EventDispatcher()
{
	this._eventCallbackListMap = {};
}

EventDispatcher.prototype.appendListener = function(event, callback)
{
	return this._doGetCallbackList(event, true).append(callback);
}

EventDispatcher.prototype.prependListener = function(event, callback)
{
	return this._doGetCallbackList(event, true).prepend(callback);
}

EventDispatcher.prototype.insertListener = function(event, callback, before)
{
	return this._doGetCallbackList(event, true).insert(callback, before);
}

EventDispatcher.prototype.removeListener = function(event, handle)
{
	var cbList = this._doGetCallbackList(event, false);
	if(cbList) {
		return cbList.remove(handle);
	}
	
	return false;
}

EventDispatcher.prototype.dispatch = function(event)
{
	var cbList = this._doGetCallbackList(event, false);
	if(cbList) {
		//return cbList.remove(handle);
	}
}

EventDispatcher.prototype._doGetCallbackList = function(event, createOnNotFound)
{
	if(this._eventCallbackListMap.hasOwnProperty(event)) {
		return this._eventCallbackListMap[event];
	}
	
	if(createOnNotFound) {
		var cbList = new callbacklist.CallbackList();
		this._eventCallbackListMap[event] = cbList;
		return cbList;
	}
	
	return null;
}

ns.EventDispatcher = EventDispatcher;

if (typeof define === 'function' && define.amd) {
	define(function () { return ns;	});
}
else if (typeof module === 'object' && module.exports){
	module.exports = ns;
}
else {
}

})(eventjs);
