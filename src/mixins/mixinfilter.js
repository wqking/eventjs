if(eventjs === undefined) { var eventjs = {}; }

;(function(ns) {
'use strict';

var _callbacklist = ns;
if(typeof require === 'function') { _callbacklist = require('../callbacklist.js'); }

function MixinFilter(params)
{
	this._filterList = new _callbacklist.CallbackList(params);
}

var proto = MixinFilter.prototype;

proto.appendFilter = function(filter)
{
	this._filterList.append(filter);
}

proto.removeFilter = function(handle)
{
	this._filterList.remove(handle);
}

proto.mixinBeforeDispatch = function(args)
{
	if(! this._filterList.empty()) {
		if(! this._filterList.forEachIf(function(callback) {
			return callback.call(callback, args);
		})) {
			return false;
		}
	}
	
	return true;
}

ns.MixinFilter = MixinFilter;

if (typeof define === 'function' && define.amd) {
	define(function () { return ns;	});
}
else if (typeof module === 'object' && module.exports){
	module.exports = ns;
}
else {
}

})(eventjs);
