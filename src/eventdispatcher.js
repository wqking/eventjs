// eventjs library
// Copyright (C) 2019 Wang Qi (wqking)
// Github: https://github.com/wqking/eventjs
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

;(function(ns) {
'use strict';

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
	this._argumentPassingMode = params.hasOwnProperty('argumentPassingMode') ? params.argumentPassingMode : EventDispatcher.defaultArgumentPassingMode;
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
EventDispatcher.defaultArgumentPassingMode = 2;

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

proto.forEach = function(event, func)
{
	var cbList = this._doGetCallbackList(event, false);
	if(cbList) {
		cbList.forEach(event, func);
	}
}

proto.forEachIf = function(event, func)
{
	var cbList = this._doGetCallbackList(event, false);
	if(cbList) {
		return cbList.forEachIf(event, func);
	}
	
	return true;
}

proto._doGetCallbackList = function(event, createOnNotFound)
{
	if(this._eventCallbackListMap.hasOwnProperty(event)) {
		return this._eventCallbackListMap[event];
	}
	
	if(createOnNotFound) {
		var cbList = new ns.CallbackList(this._params);
		this._eventCallbackListMap[event] = cbList;
		return cbList;
	}
	
	return null;
}

ns.EventDispatcher = EventDispatcher;

})(eventjs);
