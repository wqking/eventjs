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
/*eventjs v0.0.1, by wqking, https://github.com/wqking/eventjs @preserve*/
if (eventjs === undefined) {
    var eventjs = {};
}

if (typeof define === "function" && define.amd) {
    define(function() {
        return eventjs;
    });
} else if (typeof module === "object" && module.exports) {
    module.exports = eventjs;
}

(function(ns) {
    "use strict";
    function Node(callback, counter) {
        this._previous = null;
        this._next = null;
        this._callback = callback;
        this._counter = counter;
    }
    function CallbackList(params) {
        this._head = null;
        this._tail = null;
        this._currentCounter = 0;
        params = params || {};
        this._canContinueInvoking = params.hasOwnProperty("canContinueInvoking") ? params.canContinueInvoking : null;
        this._argumentsAsArray = params.hasOwnProperty("argumentsAsArray") ? !!params.argumentsAsArray : false;
        if (this._argumentsAsArray) {
            this.dispatch = this._dispatchArgumentsAsArray;
            this.applyDispatch = this._applyDispatchArgumentsAsArray;
        } else {
            this.dispatch = this._dispatchNotArgumentsAsArray;
            this.applyDispatch = this._applyDispatchNotArgumentsAsArray;
        }
    }
    var proto = CallbackList.prototype;
    proto.append = function(callback) {
        var node = new Node(callback, this._getNextCounter());
        if (this._head) {
            node._previous = this._tail;
            this._tail._next = node;
            this._tail = node;
        } else {
            this._head = node;
            this._tail = node;
        }
        return node;
    };
    proto.prepend = function(callback) {
        var node = new Node(callback, this._getNextCounter());
        if (this._head) {
            node._next = this._head;
            this._head._previous = node;
            this._head = node;
        } else {
            this._head = node;
            this._tail = node;
        }
        return node;
    };
    proto.insert = function(callback, before) {
        var beforeNode = this._doFindNode(before);
        if (!beforeNode) {
            return this.append(callback);
        }
        var node = new Node(callback, this._getNextCounter());
        node._previous = beforeNode._previous;
        node._next = beforeNode;
        if (beforeNode._previous) {
            beforeNode._previous._next = node;
        }
        beforeNode._previous = node;
        if (beforeNode == this._head) {
            this._head = node;
        }
        return node;
    };
    proto.remove = function(handle) {
        var node = this._doFindNode(handle);
        if (!node) {
            return false;
        }
        if (node._next) {
            node._next._previous = node._previous;
        }
        if (node._previous) {
            node._previous._next = node._next;
        }
        if (this._head == node) {
            this._head = node._next;
        }
        if (this._tail == node) {
            this._tail = node._previous;
        }
        // Mark it as deleted
                node._counter = 0;
        return true;
    };
    proto.empty = function() {
        return !this._head;
    };
    proto.has = function(handle) {
        return !!this._doFindNode(handle);
    };
    proto.hasAny = function() {
        return !!this._head;
    }
    // duplicated code for performance reason
    ;
    proto._dispatchArgumentsAsArray = function() {
        var counter = this._currentCounter;
        var node = this._head;
        var canContinueInvoking = this._canContinueInvoking;
        while (node) {
            if (node._counter != 0 && counter >= node._counter) {
                node._callback.call(this, arguments);
                if (canContinueInvoking && !canContinueInvoking.call(this, arguments)) {
                    break;
                }
            }
            node = node._next;
        }
    };
    proto._dispatchNotArgumentsAsArray = function() {
        var counter = this._currentCounter;
        var node = this._head;
        var canContinueInvoking = this._canContinueInvoking;
        while (node) {
            if (node._counter != 0 && counter >= node._counter) {
                node._callback.apply(this, arguments);
                if (canContinueInvoking && !canContinueInvoking.apply(this, arguments)) {
                    break;
                }
            }
            node = node._next;
        }
    };
    proto._applyDispatchArgumentsAsArray = function(args) {
        var counter = this._currentCounter;
        var node = this._head;
        var canContinueInvoking = this._canContinueInvoking;
        while (node) {
            if (node._counter != 0 && counter >= node._counter) {
                node._callback.call(this, args);
                if (canContinueInvoking && !canContinueInvoking.call(this, args)) {
                    break;
                }
            }
            node = node._next;
        }
    };
    proto._applyDispatchNotArgumentsAsArray = function(args) {
        var counter = this._currentCounter;
        var node = this._head;
        var canContinueInvoking = this._canContinueInvoking;
        while (node) {
            if (node._counter != 0 && counter >= node._counter) {
                node._callback.apply(this, args);
                if (canContinueInvoking && !canContinueInvoking.apply(this, args)) {
                    break;
                }
            }
            node = node._next;
        }
    };
    proto.forEach = function(func) {
        var node = this._head;
        var counter = this._currentCounter;
        while (node) {
            if (node._counter != 0 && counter >= node._counter) {
                func(node._callback);
            }
            node = node._next;
        }
    };
    proto.forEachIf = function(func) {
        var node = this._head;
        var counter = this._currentCounter;
        while (node) {
            if (node._counter != 0 && counter >= node._counter) {
                if (!func(node._callback)) {
                    return false;
                }
            }
            node = node._next;
        }
        return true;
    };
    proto._doFindNode = function(handle) {
        var node = this._head;
        while (node) {
            if (node === handle || node._callback === handle) {
                return node;
            }
            node = node._next;
        }
        return null;
    };
    proto._getNextCounter = function() {
        var result = ++this._currentCounter;
        if (result == 0) {
            // overflow, let's reset all nodes' counters.
            var node = this._head;
            while (node) {
                node._counter = 1;
                node = node._next;
            }
            result = ++this._currentCounter;
        }
        return result;
    };
    ns.CallbackList = CallbackList;
})(eventjs);

(function(ns) {
    "use strict";
    function _extend(destination, source) {
        for (var k in source) {
            destination[k] = source[k];
        }
        return destination;
    }
    function EventDispatcher(params) {
        this._eventCallbackListMap = {};
        params = params || {};
        this._params = params;
        this._getEvent = typeof params.getEvent === "function" ? params.getEvent : null;
        this._argumentPassingMode = params.hasOwnProperty("argumentPassingMode") ? params.argumentPassingMode : EventDispatcher.defaultArgumentPassingMode;
        this._argumentsAsArray = params.hasOwnProperty("argumentsAsArray") ? !!params.argumentsAsArray : false;
        this._mixins = params.mixins;
        this._hasMixins = this._mixins && this._mixins.length > 0;
        if (this._hasMixins) {
            for (var i = 0; i < this._mixins.length; ++i) {
                _extend(this, this._mixins[i]);
            }
        }
    }
    EventDispatcher.argumentPassingIncludeEvent = 1;
    EventDispatcher.argumentPassingExcludeEvent = 2;
    EventDispatcher.defaultArgumentPassingMode = 2;
    var proto = EventDispatcher.prototype;
    proto.appendListener = function(event, callback) {
        return this._doGetCallbackList(event, true).append(callback);
    };
    proto.prependListener = function(event, callback) {
        return this._doGetCallbackList(event, true).prepend(callback);
    };
    proto.insertListener = function(event, callback, before) {
        return this._doGetCallbackList(event, true).insert(callback, before);
    };
    proto.removeListener = function(event, handle) {
        var cbList = this._doGetCallbackList(event, false);
        if (cbList) {
            return cbList.remove(handle);
        }
        return false;
    };
    proto.hasListener = function(event, handle) {
        var cbList = this._doGetCallbackList(event, false);
        if (cbList) {
            return cbList.has(handle);
        }
        return false;
    };
    proto.hasAnyListener = function(event) {
        var cbList = this._doGetCallbackList(event, false);
        if (cbList) {
            return cbList.hasAny();
        }
        return false;
    };
    proto.dispatch = function() {
        this.applyDispatch(arguments);
    };
    proto.applyDispatch = function(args) {
        if (this._hasMixins) {
            for (var i = 0; i < this._mixins.length; ++i) {
                var mixin = this._mixins[i];
                if (mixin.mixinBeforeDispatch && !mixin.mixinBeforeDispatch.call(this, args)) {
                    return;
                }
            }
        }
        if (this._getEvent) {
            if (this._argumentsAsArray) {
                var event = this._getEvent.call(this, args);
            } else {
                var event = this._getEvent.apply(this, args);
            }
            var cbList = this._doGetCallbackList(event, false);
            if (cbList) {
                if (this._argumentPassingMode === EventDispatcher.argumentPassingIncludeEvent) {
                    args = [ event ].concat(args);
                }
                cbList.dispatch.apply(cbList, args);
            }
        } else {
            var cbList = this._doGetCallbackList(args[0], false);
            if (cbList) {
                if (this._argumentPassingMode === EventDispatcher.argumentPassingExcludeEvent) {
                    args = Array.prototype.slice.call(args, 1);
                }
                cbList.dispatch.apply(cbList, args);
            }
        }
    };
    proto.forEach = function(event, func) {
        var cbList = this._doGetCallbackList(event, false);
        if (cbList) {
            cbList.forEach(event, func);
        }
    };
    proto.forEachIf = function(event, func) {
        var cbList = this._doGetCallbackList(event, false);
        if (cbList) {
            return cbList.forEachIf(event, func);
        }
        return true;
    };
    proto._doGetCallbackList = function(event, createOnNotFound) {
        if (this._eventCallbackListMap.hasOwnProperty(event)) {
            return this._eventCallbackListMap[event];
        }
        if (createOnNotFound) {
            var cbList = new ns.CallbackList(this._params);
            this._eventCallbackListMap[event] = cbList;
            return cbList;
        }
        return null;
    };
    ns.EventDispatcher = EventDispatcher;
})(eventjs);

(function(ns) {
    "use strict";
    function EventQueue(params) {
        ns.EventDispatcher.call(this, params);
        this._queueList = [];
    }
    EventQueue.prototype = Object.create(ns.EventDispatcher.prototype);
    var proto = EventQueue.prototype;
    proto.enqueue = function() {
        this._queueList.push(arguments);
    };
    proto.process = function() {
        var list = this._queueList;
        this._queueList = [];
        var count = list.length;
        for (var i = 0; i < count; ++i) {
            this.applyDispatch(list[i]);
        }
    };
    proto.processOne = function() {
        if (this._queueList.length > 0) {
            this.applyDispatch(this._queueList.shift());
        }
    };
    proto.processIf = function(func) {
        var list = this._queueList;
        this._queueList = [];
        var unprocessedList = [];
        var count = list.length;
        for (var i = 0; i < count; ++i) {
            var item = list[i];
            if (this._argumentsAsArray) {
                var ok = func.call(this, item);
            } else {
                var ok = func.apply(this, item);
            }
            if (ok) {
                this.applyDispatch(item);
            } else {
                unprocessedList.push(item);
            }
        }
        if (unprocessedList.length > 0) {
            this._queueList = this._queueList.concat(unprocessedList);
        }
    };
    proto.empty = function() {
        return this._queueList.length === 0;
    };
    proto.clearEvents = function() {
        this._queueList.length = 0;
    };
    proto.peekEvent = function() {
        return this._queueList[0];
    };
    proto.takeEvent = function() {
        if (this._queueList.length > 0) {
            return this._queueList.shift();
        }
        return null;
    };
    ns.EventQueue = EventQueue;
})(eventjs);

(function(ns) {
    "use strict";
    var _callbacklist = ns;
    function MixinFilter(params) {
        this._filterList = new _callbacklist.CallbackList(params);
    }
    var proto = MixinFilter.prototype;
    proto.appendFilter = function(filter) {
        this._filterList.append(filter);
    };
    proto.removeFilter = function(handle) {
        this._filterList.remove(handle);
    };
    proto.mixinBeforeDispatch = function(args) {
        if (!this._filterList.empty()) {
            if (!this._filterList.forEachIf(function(callback) {
                return callback.call(callback, args);
            })) {
                return false;
            }
        }
        return true;
    };
    ns.MixinFilter = MixinFilter;
})(eventjs);