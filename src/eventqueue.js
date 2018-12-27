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

function EventQueue(params)
{
	ns.EventDispatcher.call(this, params);
	
	this._queueList = [];
}

EventQueue.prototype = Object.create(ns.EventDispatcher.prototype);

var proto = EventQueue.prototype;

proto.enqueue = function()
{
	this._queueList.push(arguments);
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
		if(this._argumentsAsArray) {
			var ok = func.call(this, item);
		}
		else {
			var ok = func.apply(this, item);
		}
		if(ok) {
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

})(eventjs);
