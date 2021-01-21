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

var _callbacklist = ns;

function MixinFilter(params)
{
	this._filterList = new _callbacklist.CallbackList(params);
}

var proto = MixinFilter.prototype;

proto.appendFilter = function(filter)
{
	return this._filterList.append(filter);
}

proto.removeFilter = function(handle)
{
	return this._filterList.remove(handle);
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

})(eventjs);
