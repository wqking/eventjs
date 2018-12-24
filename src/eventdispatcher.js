if(eventjs === undefined) { var eventjs = {}; }

;(function(ns) {
'use strict';

var _callbacklist = ns;
if(typeof require === 'function') { _callbacklist = require('./callbacklist.js'); }

function _extend(destination, source)
{
	for(var k in source) {
		destination[k] = source[k];
	}
	return destination;
}

function EventDispatcher(params)
{
	this._eventCallbackListMap = {};

	params = params || {};
	this._params = params;
	this._getEvent = typeof params.getEvent === 'function' ? params.getEvent : null;
	this._argumentPassingMode = params.hasOwnProperty('argumentPassingMode') ? params.argumentPassingMode : EventDispatcher._defaultArgumentPassingMode;
	this._argumentsAsArray = params.hasOwnProperty('argumentsAsArray') ? !! params.argumentsAsArray : false;
	this._mixins = params.mixins;
	this._hasMixins = this._mixins && this._mixins.length > 0;
	if(this._hasMixins) {
		for(var i = 0; i < this._mixins.length; ++i) {
			_extend(this, this._mixins[i]);
		}
	}
}

EventDispatcher.argumentPassingIncludeEvent = 1;
EventDispatcher.argumentPassingExcludeEvent = 2;
EventDispatcher._defaultArgumentPassingMode = 2;

EventDispatcher.setDefaultArgumentPassingMode = function(value)
{
	EventDispatcher._defaultArgumentPassingMode = value;
}

EventDispatcher.getDefaultArgumentPassingMode = function()
{
	return EventDispatcher._defaultArgumentPassingMode;
}

var proto = EventDispatcher.prototype;

proto.appendListener = function(event, callback)
{
	return this._doGetCallbackList(event, true).append(callback);
}

proto.prependListener = function(event, callback)
{
	return this._doGetCallbackList(event, true).prepend(callback);
}

proto.insertListener = function(event, callback, before)
{
	return this._doGetCallbackList(event, true).insert(callback, before);
}

proto.removeListener = function(event, handle)
{
	var cbList = this._doGetCallbackList(event, false);
	if(cbList) {
		return cbList.remove(handle);
	}
	
	return false;
}

proto.hasListener = function(event, handle)
{
	var cbList = this._doGetCallbackList(event, false);
	if(cbList) {
		return cbList.has(handle);
	}
	
	return false;
}

proto.hasAnyListener = function(event)
{
	var cbList = this._doGetCallbackList(event, false);
	if(cbList) {
		return cbList.hasAny();
	}
	
	return false;
}

proto.dispatch = function()
{
	this.applyDispatch(arguments);
}

proto.applyDispatch = function(args)
{
	if(this._hasMixins) {
		for(var i = 0; i < this._mixins.length; ++i) {
			var mixin = this._mixins[i];
			if(mixin.mixinBeforeDispatch && ! mixin.mixinBeforeDispatch.call(this, args)) {
				return;
			}
		}
	}

	if(this._getEvent) {
		if(this._argumentsAsArray) {
			var event = this._getEvent.call(this, args);
		}
		else {
			var event = this._getEvent.apply(this, args);
		}
		var cbList = this._doGetCallbackList(event, false);
		if(cbList) {
			if(this._argumentPassingMode === EventDispatcher.argumentPassingIncludeEvent) {
				args = [ event ].concat(args);
			}
			cbList.dispatch.apply(cbList, args);
		}
	}
	else {
		var cbList = this._doGetCallbackList(args[0], false);
		if(cbList) {
			if(this._argumentPassingMode === EventDispatcher.argumentPassingExcludeEvent) {
				args = Array.prototype.slice.call(args, 1);
			}
			cbList.dispatch.apply(cbList, args);
		}
	}
}

proto._doGetCallbackList = function(event, createOnNotFound)
{
	if(this._eventCallbackListMap.hasOwnProperty(event)) {
		return this._eventCallbackListMap[event];
	}
	
	if(createOnNotFound) {
		var cbList = new _callbacklist.CallbackList(this._params);
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
