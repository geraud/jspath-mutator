/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.toArray = exports.toSet = exports.parseIndexes = exports.Mutator = exports.MutatorNode = undefined;
	
	var _JsonPathCompiler = __webpack_require__(46);
	
	var _lodash = __webpack_require__(49);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MutatorNode = exports.MutatorNode = function () {
	  function MutatorNode(name) {
	    var mutations = arguments.length <= 1 || arguments[1] === undefined ? new Set() : arguments[1];
	    var children = arguments.length <= 2 || arguments[2] === undefined ? new Map() : arguments[2];
	
	    _classCallCheck(this, MutatorNode);
	
	    this.name = name;
	    this.mutations = toSet(mutations);
	    this.children = children;
	  }
	
	  _createClass(MutatorNode, [{
	    key: 'addChild',
	    value: function addChild(node) {
	      if (this.children.has(node.name)) {
	        var child = this.children.get(node.name);
	        var newChild = MutatorNode.merge(child, node);
	        this.children.set(node.name, newChild);
	      } else {
	        this.children.set(node.name, node);
	      }
	      return this;
	    }
	  }, {
	    key: 'key',
	    value: function key() {
	      var context = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	      var key = this.name;
	      if (key.length > 1 && key[0] == '$') {
	        return _lodash2.default.template(key)(context);
	      } else {
	        return key;
	      }
	    }
	  }, {
	    key: 'forEachChild',
	    value: function forEachChild(handler) {
	      this.children.forEach(handler);
	    }
	  }], [{
	    key: 'merge',
	    value: function merge(l, r) {
	      if (l.name != r.name) {
	        throw new Error('cannot merge two nodes with different keys');
	      }
	      var newContext = MutatorNode.mergeMutations(l, r);
	      var newChildren = MutatorNode.mergeChildren(l, r);
	      return new MutatorNode(l.name, newContext, newChildren);
	    }
	  }, {
	    key: 'mergeMutations',
	    value: function mergeMutations(l, r) {
	      return toSet([].concat(_toConsumableArray(l.mutations), _toConsumableArray(r.mutations)));
	    }
	  }, {
	    key: 'mergeChildren',
	    value: function mergeChildren(l, r) {
	      var newChildren = new Map();
	      var allNames = new Set([].concat(_toConsumableArray(l.children.keys()), _toConsumableArray(r.children.keys())));
	      allNames.forEach(function (name) {
	        var l_node = l.children.get(name);
	        var r_node = r.children.get(name);
	        if (!!l_node && !!r_node) {
	          newChildren.set(name, MutatorNode.merge(l_node, r_node));
	        } else if (!!l_node) {
	          newChildren.set(name, l_node);
	        } else if (!!r_node) {
	          newChildren.set(name, r_node);
	        } else {
	          throw new Error('cannot process node. invalid state');
	        }
	      });
	      return newChildren;
	    }
	  }, {
	    key: 'mutate',
	    value: function mutate(state, node, context) {
	      var newState = _lodash2.default.clone(state);
	      node.forEachChild(function (child) {
	        var key = child.key(context);
	        newState[key] = MutatorNode.mutate(state[key], child, context);
	      });
	      return MutatorNode.applyMutations(newState, node.mutations);
	    }
	  }, {
	    key: 'applyMutations',
	    value: function applyMutations(state, mutations) {
	      mutations.forEach(function (commandGroup) {
	        _lodash2.default.forEach(commandGroup, function (args, command) {
	          var handler = MutatorNode.mutators.get(command);
	          if (handler) {
	            state = handler(state, args);
	          } else {
	            throw new Error('unknown mutation command ' + command);
	          }
	        });
	      });
	      return state;
	    }
	  }, {
	    key: 'addHandler',
	    value: function addHandler() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      var handler = args.pop();
	      args.forEach(function (name) {
	        return MutatorNode.mutators.set(name, handler);
	      });
	      return this;
	    }
	  }]);
	
	  return MutatorNode;
	}();
	
	MutatorNode.mutators = new Map();
	
	var Mutator = exports.Mutator = function (_MutatorNode) {
	  _inherits(Mutator, _MutatorNode);
	
	  function Mutator() {
	    _classCallCheck(this, Mutator);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Mutator).call(this, '$'));
	  }
	
	  _createClass(Mutator, [{
	    key: 'add',
	    value: function add(path) {
	      var _parseIndexes = parseIndexes(path);
	
	      var _parseIndexes2 = _toArray(_parseIndexes);
	
	      var head = _parseIndexes2[0];
	
	      var tail = _parseIndexes2.slice(1);
	
	      for (var _len2 = arguments.length, mutations = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        mutations[_key2 - 1] = arguments[_key2];
	      }
	
	      var lastNode = new MutatorNode(head, mutations);
	      tail.forEach(function (index) {
	        var node = new MutatorNode(index);
	        if (lastNode) {
	          node.addChild(lastNode);
	        }
	        lastNode = node;
	      });
	      this.addChild(lastNode);
	      return this;
	    }
	  }, {
	    key: 'execute',
	    value: function execute(state, context) {
	      return MutatorNode.mutate(state, this, context);
	    }
	  }, {
	    key: 'toReducer',
	    value: function toReducer() {
	      var _this2 = this;
	
	      var handleError = arguments.length <= 0 || arguments[0] === undefined ? MutatorNode.defaultHandlerError : arguments[0];
	
	      return function (state, _ref) {
	        var payload = _ref.payload;
	        var error = _ref.error;
	
	        if (error) {
	          return handleError(state, { payload: payload, error: error });
	        } else {
	          return _this2.execute(state, payload);
	        }
	      };
	    }
	  }], [{
	    key: 'addHandler',
	    value: function addHandler() {
	      MutatorNode.addHandler.apply(MutatorNode, arguments);
	      return this;
	    }
	  }]);
	
	  return Mutator;
	}(MutatorNode);
	
	Mutator.defaultHandlerError = function (state, _ref3) {
	  var error = _ref3.error;
	
	  throw error;
	};
	
	var ensureArray = function ensureArray(mutation) {
	  return function (state, arg) {
	    var newState = state;
	    if (!_lodash2.default.isArray(newState)) {
	      newState = [];
	    }
	    return mutation(newState, arg);
	  };
	};
	
	var ensureObject = function ensureObject(mutation) {
	  return function (state, arg) {
	    var newState = state;
	    if (!_lodash2.default.isPlainObject(newState)) {
	      newState = {};
	    }
	    return mutation(newState, arg);
	  };
	};
	
	Mutator.addHandler('$apply', function (state, arg) {
	  return arg(state);
	}).addHandler('$merge', ensureObject(function (state, arg) {
	
	  return _lodash2.default.merge(state, arg);
	})).addHandler('$push', '$append', ensureArray(function () {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	  var arg = arguments[1];
	
	  state.push.apply(state, _toConsumableArray(toArray(arg)));
	  return state;
	})).addHandler('$set', function (_state, arg) {
	  return arg;
	}).addHandler('$unshift', ensureArray(function (state, arg) {
	  state.unshift.apply(state, _toConsumableArray(toArray(arg)));
	  return state;
	})).addHandler('$shift', ensureArray(function (state, count) {
	  _lodash2.default.times(count, function () {
	    return state.shift();
	  });
	  return state;
	})).addHandler('$take', ensureArray(function (state, arg) {
	  return _lodash2.default.take(state, arg);
	})).addHandler('$remove', '$delete', ensureObject(function (state, arg) {
	  return _lodash2.default.omit.apply(_lodash2.default, [state].concat(_toConsumableArray(toArray(arg))));
	}));
	
	var parseIndexes = exports.parseIndexes = function parseIndexes(input) {
	  return (0, _JsonPathCompiler.parse)(input).reverse().map(function (_ref2) {
	    var index = _ref2.index;
	    var interpolation = _ref2.interpolation;
	
	    if (typeof index == 'undefined' && typeof interpolation == 'undefined') {
	      throw new Error('Cannot create a mutator from path ' + path + ' - Only index and interpolation access is supported');
	    }
	    return (index || interpolation).toString();
	  });
	};
	
	var toSet = exports.toSet = function toSet(x) {
	  if (x instanceof Set) {
	    return x;
	  } else if (Array.isArray(x)) {
	    return new Set(x);
	  } else {
	    return new Set([x]);
	  }
	};
	
	var toArray = exports.toArray = function toArray(x) {
	  if (x instanceof Array) {
	    return x;
	  } else if (x instanceof Set) {
	    return [].concat(_toConsumableArray(x));
	  } else {
	    return [x];
	  }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	//[The "BSD license"]
	// Copyright (c) 2012 Terence Parr
	// Copyright (c) 2012 Sam Harwell
	// Copyright (c) 2014 Eric Vergnaud
	// All rights reserved.
	//
	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions
	// are met:
	//
	// 1. Redistributions of source code must retain the above copyright
	//    notice, this list of conditions and the following disclaimer.
	// 2. Redistributions in binary form must reproduce the above copyright
	//    notice, this list of conditions and the following disclaimer in the
	//    documentation and/or other materials provided with the distribution.
	// 3. The name of the author may not be used to endorse or promote products
	//    derived from this software without specific prior written permission.
	//
	// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	// OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	// IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	// NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	
	// A token has properties: text, type, line, character position in the line
	// (so we can ignore tabs), token channel, index, and source from which
	// we obtained this token.
	
	function Token() {
		this.source = null;
		this.type = null; // token type of the token
		this.channel = null; // The parser ignores everything not on DEFAULT_CHANNEL
		this.start = null; // optional; return -1 if not implemented.
		this.stop = null; // optional; return -1 if not implemented.
		this.tokenIndex = null; // from 0..n-1 of the token object in the input stream
		this.line = null; // line=1..n of the 1st character
		this.column = null; // beginning of the line at which it occurs, 0..n-1
		this._text = null; // text of the token.
		return this;
	}
	
	Token.INVALID_TYPE = 0;
	
	// During lookahead operations, this "token" signifies we hit rule end ATN state
	// and did not follow it despite needing to.
	Token.EPSILON = -2;
	
	Token.MIN_USER_TOKEN_TYPE = 1;
	
	Token.EOF = -1;
	
	// All tokens go to the parser (unless skip() is called in that rule)
	// on a particular "channel". The parser tunes to a particular channel
	// so that whitespace etc... can go to the parser on a "hidden" channel.
	
	Token.DEFAULT_CHANNEL = 0;
	
	// Anything on different channel than DEFAULT_CHANNEL is not parsed
	// by parser.
	
	Token.HIDDEN_CHANNEL = 1;
	
	// Explicitly set the text for this token. If {code text} is not
	// {@code null}, then {@link //getText} will return this value rather than
	// extracting the text from the input.
	//
	// @param text The explicit text of the token, or {@code null} if the text
	// should be obtained from the input along with the start and stop indexes
	// of the token.
	
	Object.defineProperty(Token.prototype, "text", {
		get : function() {
			return this._text;
		},
		set : function(text) {
			this._text = text;
		}
	});
	
	Token.prototype.getTokenSource = function() {
		return this.source[0];
	};
	
	Token.prototype.getInputStream = function() {
		return this.source[1];
	};
	
	function CommonToken(source, type, channel, start, stop) {
		Token.call(this);
		this.source = source !== undefined ? source : CommonToken.EMPTY_SOURCE;
		this.type = type !== undefined ? type : null;
		this.channel = channel !== undefined ? channel : Token.DEFAULT_CHANNEL;
		this.start = start !== undefined ? start : -1;
		this.stop = stop !== undefined ? stop : -1;
		this.tokenIndex = -1;
		if (this.source[0] !== null) {
			this.line = source[0].line;
			this.column = source[0].column;
		} else {
			this.column = -1;
		}
		return this;
	}
	
	CommonToken.prototype = Object.create(Token.prototype);
	CommonToken.prototype.constructor = CommonToken;
	
	// An empty {@link Pair} which is used as the default value of
	// {@link //source} for tokens that do not have a source.
	CommonToken.EMPTY_SOURCE = [ null, null ];
	
	// Constructs a new {@link CommonToken} as a copy of another {@link Token}.
	//
	// <p>
	// If {@code oldToken} is also a {@link CommonToken} instance, the newly
	// constructed token will share a reference to the {@link //text} field and
	// the {@link Pair} stored in {@link //source}. Otherwise, {@link //text} will
	// be assigned the result of calling {@link //getText}, and {@link //source}
	// will be constructed from the result of {@link Token//getTokenSource} and
	// {@link Token//getInputStream}.</p>
	//
	// @param oldToken The token to copy.
	//
	CommonToken.prototype.clone = function() {
		var t = new CommonToken(this.source, this.type, this.channel, this.start,
				this.stop);
		t.tokenIndex = this.tokenIndex;
		t.line = this.line;
		t.column = this.column;
		t.text = this.text;
		return t;
	};
	
	Object.defineProperty(CommonToken.prototype, "text", {
		get : function() {
			if (this._text !== null) {
				return this._text;
			}
			var input = this.getInputStream();
			if (input === null) {
				return null;
			}
			var n = input.size;
			if (this.start < n && this.stop < n) {
				return input.getText(this.start, this.stop);
			} else {
				return "<EOF>";
			}
		},
		set : function(text) {
			this._text = text;
		}
	});
	
	CommonToken.prototype.toString = function() {
		var txt = this.text;
		if (txt !== null) {
			txt = txt.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
		} else {
			txt = "<no text>";
		}
		return "[@" + this.tokenIndex + "," + this.start + ":" + this.stop + "='" +
				txt + "',<" + this.type + ">" +
				(this.channel > 0 ? ",channel=" + this.channel : "") + "," +
				this.line + ":" + this.column + "]";
	};
	
	exports.Token = Token;
	exports.CommonToken = CommonToken;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint smarttabs:true */
	
	var Token = __webpack_require__(1).Token;
	
	/* stop is not included! */
	function Interval(start, stop) {
		this.start = start;
		this.stop = stop;
		return this;
	}
	
	Interval.prototype.contains = function(item) {
		return item >= this.start && item < this.stop;
	};
	
	Interval.prototype.toString = function() {
		if(this.start===this.stop-1) {
			return this.start.toString();
		} else {
			return this.start.toString() + ".." + (this.stop-1).toString();
		}
	};
	
	
	Object.defineProperty(Interval.prototype, "length", {
		get : function() {
			return this.stop - this.start;
		}
	});
	
	function IntervalSet() {
		this.intervals = null;
		this.readOnly = false;
	}
	
	IntervalSet.prototype.first = function(v) {
		if (this.intervals === null || this.intervals.length===0) {
			return Token.INVALID_TYPE;
		} else {
			return this.intervals[0].start;
		}
	};
	
	IntervalSet.prototype.addOne = function(v) {
		this.addInterval(new Interval(v, v + 1));
	};
	
	IntervalSet.prototype.addRange = function(l, h) {
		this.addInterval(new Interval(l, h + 1));
	};
	
	IntervalSet.prototype.addInterval = function(v) {
		if (this.intervals === null) {
			this.intervals = [];
			this.intervals.push(v);
		} else {
			// find insert pos
			for (var k = 0; k < this.intervals.length; k++) {
				var i = this.intervals[k];
				// distinct range -> insert
				if (v.stop < i.start) {
					this.intervals.splice(k, 0, v);
					return;
				}
				// contiguous range -> adjust
				else if (v.stop === i.start) {
					this.intervals[k].start = v.start;
					return;
				}
				// overlapping range -> adjust and reduce
				else if (v.start <= i.stop) {
					this.intervals[k] = new Interval(Math.min(i.start, v.start), Math.max(i.stop, v.stop));
					this.reduce(k);
					return;
				}
			}
			// greater than any existing
			this.intervals.push(v);
		}
	};
	
	IntervalSet.prototype.addSet = function(other) {
		if (other.intervals !== null) {
			for (var k = 0; k < other.intervals.length; k++) {
				var i = other.intervals[k];
				this.addInterval(new Interval(i.start, i.stop));
			}
		}
		return this;
	};
	
	IntervalSet.prototype.reduce = function(k) {
		// only need to reduce if k is not the last
		if (k < this.intervalslength - 1) {
			var l = this.intervals[k];
			var r = this.intervals[k + 1];
			// if r contained in l
			if (l.stop >= r.stop) {
				this.intervals.pop(k + 1);
				this.reduce(k);
			} else if (l.stop >= r.start) {
				this.intervals[k] = new Interval(l.start, r.stop);
				this.intervals.pop(k + 1);
			}
		}
	};
	
	IntervalSet.prototype.complement = function(start, stop) {
	    var result = new IntervalSet();
	    result.addInterval(new Interval(start,stop+1));
	    for(var i=0; i<this.intervals.length; i++) {
	        result.removeRange(this.intervals[i]);
	    }
	    return result;
	};
	
	IntervalSet.prototype.contains = function(item) {
		if (this.intervals === null) {
			return false;
		} else {
			for (var k = 0; k < this.intervals.length; k++) {
				if(this.intervals[k].contains(item)) {
					return true;
				}
			}
			return false;
		}
	};
	
	Object.defineProperty(IntervalSet.prototype, "length", {
		get : function() {
			var len = 0;
			this.intervals.map(function(i) {len += i.length;});
			return len;
		}
	});
	
	IntervalSet.prototype.removeRange = function(v) {
	    if(v.start===v.stop-1) {
	        this.removeOne(v.start);
	    } else if (this.intervals!==null) {
	        var k = 0;
	        for(var n=0; n<this.intervals.length; n++) {
	            var i = this.intervals[k];
	            // intervals are ordered
	            if (v.stop<=i.start) {
	                return;
	            }
	            // check for including range, split it
	            else if(v.start>i.start && v.stop<i.stop) {
	                this.intervals[k] = new Interval(i.start, v.start);
	                var x = new Interval(v.stop, i.stop);
	                this.intervals.splice(k, 0, x);
	                return;
	            }
	            // check for included range, remove it
	            else if(v.start<=i.start && v.stop>=i.stop) {
	                this.intervals.splice(k, 1);
	                k = k - 1; // need another pass
	            }
	            // check for lower boundary
	            else if(v.start<i.stop) {
	                this.intervals[k] = new Interval(i.start, v.start);
	            }
	            // check for upper boundary
	            else if(v.stop<i.stop) {
	                this.intervals[k] = new Interval(v.stop, i.stop);
	            }
	            k += 1;
	        }
	    }
	};
	
	IntervalSet.prototype.removeOne = function(v) {
		if (this.intervals !== null) {
			for (var k = 0; k < this.intervals.length; k++) {
				var i = this.intervals[k];
				// intervals is ordered
				if (v < i.start) {
					return;
				}
				// check for single value range
				else if (v === i.start && v === i.stop - 1) {
					this.intervals.splice(k, 1);
					return;
				}
				// check for lower boundary
				else if (v === i.start) {
					this.intervals[k] = new Interval(i.start + 1, i.stop);
					return;
				}
				// check for upper boundary
				else if (v === i.stop - 1) {
					this.intervals[k] = new Interval(i.start, i.stop - 1);
					return;
				}
				// split existing range
				else if (v < i.stop - 1) {
					var x = new Interval(i.start, v);
					i.start = v + 1;
					this.intervals.splice(k, 0, x);
					return;
				}
			}
		}
	};
	
	IntervalSet.prototype.toString = function(literalNames, symbolicNames, elemsAreChar) {
		literalNames = literalNames || null;
		symbolicNames = symbolicNames || null;
		elemsAreChar = elemsAreChar || false;
		if (this.intervals === null) {
			return "{}";
		} else if(literalNames!==null || symbolicNames!==null) {
			return this.toTokenString(literalNames, symbolicNames);
		} else if(elemsAreChar) {
			return this.toCharString();
		} else {
			return this.toIndexString();
		}
	};
	
	IntervalSet.prototype.toCharString = function() {
		var names = [];
		for (var i = 0; i < this.intervals.length; i++) {
			var v = this.intervals[i];
			if(v.stop===v.start+1) {
				if ( v.start===Token.EOF ) {
					names.push("<EOF>");
				} else {
					names.push("'" + String.fromCharCode(v.start) + "'");
				}
			} else {
				names.push("'" + String.fromCharCode(v.start) + "'..'" + String.fromCharCode(v.stop-1) + "'");
			}
		}
		if (names.length > 1) {
			return "{" + names.join(", ") + "}";
		} else {
			return names[0];
		}
	};
	
	
	IntervalSet.prototype.toIndexString = function() {
		var names = [];
		for (var i = 0; i < this.intervals.length; i++) {
			var v = this.intervals[i];
			if(v.stop===v.start+1) {
				if ( v.start===Token.EOF ) {
					names.push("<EOF>");
				} else {
					names.push(v.start.toString());
				}
			} else {
				names.push(v.start.toString() + ".." + (v.stop-1).toString());
			}
		}
		if (names.length > 1) {
			return "{" + names.join(", ") + "}";
		} else {
			return names[0];
		}
	};
	
	
	IntervalSet.prototype.toTokenString = function(literalNames, symbolicNames) {
		var names = [];
		for (var i = 0; i < this.intervals.length; i++) {
			var v = this.intervals[i];
			for (var j = v.start; j < v.stop; j++) {
				names.push(this.elementName(literalNames, symbolicNames, j));
			}
		}
		if (names.length > 1) {
			return "{" + names.join(", ") + "}";
		} else {
			return names[0];
		}
	};
	
	IntervalSet.prototype.elementName = function(literalNames, symbolicNames, a) {
		if (a === Token.EOF) {
			return "<EOF>";
		} else if (a === Token.EPSILON) {
			return "<EPSILON>";
		} else {
			return literalNames[a] || symbolicNames[a];
		}
	};
	
	exports.Interval = Interval;
	exports.IntervalSet = IntervalSet;


/***/ },
/* 3 */
/***/ function(module, exports) {

	function arrayToString(a) {
		return "[" + a.join(", ") + "]";
	}
	
	String.prototype.hashCode = function(s) {
		var hash = 0;
		if (this.length === 0) {
			return hash;
		}
		for (var i = 0; i < this.length; i++) {
			var character = this.charCodeAt(i);
			hash = ((hash << 5) - hash) + character;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	};
	
	function standardEqualsFunction(a,b) {
		return a.equals(b);
	}
	
	function standardHashFunction(a) {
		return a.hashString();
	}
	
	function Set(hashFunction, equalsFunction) {
		this.data = {};
		this.hashFunction = hashFunction || standardHashFunction;
		this.equalsFunction = equalsFunction || standardEqualsFunction;
		return this;
	}
	
	Object.defineProperty(Set.prototype, "length", {
		get : function() {
			return this.values().length;
		}
	});
	
	Set.prototype.add = function(value) {
		var hash = this.hashFunction(value);
		var key = "hash_" + hash.hashCode();
		if(key in this.data) {
			var i;
			var values = this.data[key];
			for(i=0;i<values.length; i++) {
				if(this.equalsFunction(value, values[i])) {
					return values[i];
				}
			}
			values.push(value);
			return value;
		} else {
			this.data[key] = [ value ];
			return value;
		}
	};
	
	Set.prototype.contains = function(value) {
		var hash = this.hashFunction(value);
		var key = hash.hashCode();
		if(key in this.data) {
			var i;
			var values = this.data[key];
			for(i=0;i<values.length; i++) {
				if(this.equalsFunction(value, values[i])) {
					return true;
				}
			}
		}
		return false;
	};
	
	Set.prototype.values = function() {
		var l = [];
		for(var key in this.data) {
			if(key.indexOf("hash_")===0) {
				l = l.concat(this.data[key]);
			}
		}
		return l;
	};
	
	Set.prototype.toString = function() {
		return arrayToString(this.values());
	};
	
	function BitSet() {
		this.data = [];
		return this;
	}
	
	BitSet.prototype.add = function(value) {
		this.data[value] = true;
	};
	
	BitSet.prototype.or = function(set) {
		var bits = this;
		Object.keys(set.data).map( function(alt) { bits.add(alt); });
	};
	
	BitSet.prototype.remove = function(value) {
		delete this.data[value];
	};
	
	BitSet.prototype.contains = function(value) {
		return this.data[value] === true;
	};
	
	BitSet.prototype.values = function() {
		return Object.keys(this.data);
	};
	
	BitSet.prototype.minValue = function() {
		return Math.min.apply(null, this.values());
	};
	
	BitSet.prototype.hashString = function() {
		return this.values().toString();
	};
	
	BitSet.prototype.equals = function(other) {
		if(!(other instanceof BitSet)) {
			return false;
		}
		return this.hashString()===other.hashString();
	};
	
	Object.defineProperty(BitSet.prototype, "length", {
		get : function() {
			return this.values().length;
		}
	});
	
	BitSet.prototype.toString = function() {
		return "{" + this.values().join(", ") + "}";
	};
	
	function AltDict() {
		this.data = {};
		return this;
	}
	
	AltDict.prototype.get = function(key) {
		key = "k-" + key;
		if(key in this.data){
			return this.data[key];
		} else {
			return null;
		}
	};
	
	AltDict.prototype.put = function(key, value) {
		key = "k-" + key;
		this.data[key] = value;
	};
	
	AltDict.prototype.values = function() {
		var data = this.data;
		var keys = Object.keys(this.data);
		return keys.map(function(key) {
			return data[key];
		});
	};
	
	function DoubleDict() {
		return this;
	}
	
	DoubleDict.prototype.get = function(a, b) {
		var d = this[a] || null;
		return d===null ? null : (d[b] || null);
	};
	
	DoubleDict.prototype.set = function(a, b, o) {
		var d = this[a] || null;
		if(d===null) {
			d = {};
			this[a] = d;
		}
		d[b] = o;
	};
	
	
	function escapeWhitespace(s, escapeSpaces) {
		s = s.replace("\t","\\t");
		s = s.replace("\n","\\n");
		s = s.replace("\r","\\r");
		if(escapeSpaces) {
			s = s.replace(" ","\u00B7");
		}
		return s;
	}
	
	
	exports.Set = Set;
	exports.BitSet = BitSet;
	exports.AltDict = AltDict;
	exports.DoubleDict = DoubleDict;
	exports.escapeWhitespace = escapeWhitespace;
	exports.arrayToString = arrayToString;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	var RuleContext = __webpack_require__(18).RuleContext;
	
	function PredictionContext(cachedHashString) {
		this.cachedHashString = cachedHashString;
	}
	
	// Represents {@code $} in local context prediction, which means wildcard.
	// {@code//+x =//}.
	// /
	PredictionContext.EMPTY = null;
	
	// Represents {@code $} in an array in full context mode, when {@code $}
	// doesn't mean wildcard: {@code $ + x = [$,x]}. Here,
	// {@code $} = {@link //EMPTY_RETURN_STATE}.
	// /
	PredictionContext.EMPTY_RETURN_STATE = 0x7FFFFFFF;
	
	PredictionContext.globalNodeCount = 1;
	PredictionContext.id = PredictionContext.globalNodeCount;
	
	// Stores the computed hash code of this {@link PredictionContext}. The hash
	// code is computed in parts to match the following reference algorithm.
	//
	// <pre>
	// private int referenceHashCode() {
	// int hash = {@link MurmurHash//initialize MurmurHash.initialize}({@link
	// //INITIAL_HASH});
	//
	// for (int i = 0; i &lt; {@link //size()}; i++) {
	// hash = {@link MurmurHash//update MurmurHash.update}(hash, {@link //getParent
	// getParent}(i));
	// }
	//
	// for (int i = 0; i &lt; {@link //size()}; i++) {
	// hash = {@link MurmurHash//update MurmurHash.update}(hash, {@link
	// //getReturnState getReturnState}(i));
	// }
	//
	// hash = {@link MurmurHash//finish MurmurHash.finish}(hash, 2// {@link
	// //size()});
	// return hash;
	// }
	// </pre>
	// /
	
	// This means only the {@link //EMPTY} context is in set.
	PredictionContext.prototype.isEmpty = function() {
		return this === PredictionContext.EMPTY;
	};
	
	PredictionContext.prototype.hasEmptyPath = function() {
		return this.getReturnState(this.length - 1) === PredictionContext.EMPTY_RETURN_STATE;
	};
	
	PredictionContext.prototype.hashString = function() {
		return this.cachedHashString;
	};
	
	function calculateHashString(parent, returnState) {
		return "" + parent + returnState;
	}
	
	function calculateEmptyHashString() {
		return "";
	}
	
	// Used to cache {@link PredictionContext} objects. Its used for the shared
	// context cash associated with contexts in DFA states. This cache
	// can be used for both lexers and parsers.
	
	function PredictionContextCache() {
		this.cache = {};
		return this;
	}
	
	// Add a context to the cache and return it. If the context already exists,
	// return that one instead and do not add a new context to the cache.
	// Protect shared cache from unsafe thread access.
	//
	PredictionContextCache.prototype.add = function(ctx) {
		if (ctx === PredictionContext.EMPTY) {
			return PredictionContext.EMPTY;
		}
		var existing = this.cache[ctx];
		if (existing !== null) {
			return existing;
		}
		this.cache[ctx] = ctx;
		return ctx;
	};
	
	PredictionContextCache.prototype.get = function(ctx) {
		return this.cache[ctx] || null;
	};
	
	Object.defineProperty(PredictionContextCache.prototype, "length", {
		get : function() {
			return this.cache.length;
		}
	});
	
	function SingletonPredictionContext(parent, returnState) {
		var hashString = parent !== null ? calculateHashString(parent, returnState)
				: calculateEmptyHashString();
		PredictionContext.call(this, hashString);
		this.parentCtx = parent;
		this.returnState = returnState;
	}
	
	SingletonPredictionContext.prototype = Object.create(PredictionContext.prototype);
	SingletonPredictionContext.prototype.contructor = SingletonPredictionContext;
	
	SingletonPredictionContext.create = function(parent, returnState) {
		if (returnState === PredictionContext.EMPTY_RETURN_STATE && parent === null) {
			// someone can pass in the bits of an array ctx that mean $
			return PredictionContext.EMPTY;
		} else {
			return new SingletonPredictionContext(parent, returnState);
		}
	};
	
	Object.defineProperty(SingletonPredictionContext.prototype, "length", {
		get : function() {
			return 1;
		}
	});
	
	SingletonPredictionContext.prototype.getParent = function(index) {
		return this.parentCtx;
	};
	
	SingletonPredictionContext.prototype.getReturnState = function(index) {
		return this.returnState;
	};
	
	SingletonPredictionContext.prototype.equals = function(other) {
		if (this === other) {
			return true;
		} else if (!(other instanceof SingletonPredictionContext)) {
			return false;
		} else if (this.hashString() !== other.hashString()) {
			return false; // can't be same if hash is different
		} else {
			if(this.returnState !== other.returnState)
	            return false;
	        else if(this.parentCtx==null)
	            return other.parentCtx==null
			else
	            return this.parentCtx.equals(other.parentCtx);
		}
	};
	
	SingletonPredictionContext.prototype.hashString = function() {
		return this.cachedHashString;
	};
	
	SingletonPredictionContext.prototype.toString = function() {
		var up = this.parentCtx === null ? "" : this.parentCtx.toString();
		if (up.length === 0) {
			if (this.returnState === this.EMPTY_RETURN_STATE) {
				return "$";
			} else {
				return "" + this.returnState;
			}
		} else {
			return "" + this.returnState + " " + up;
		}
	};
	
	function EmptyPredictionContext() {
		SingletonPredictionContext.call(this, null, PredictionContext.EMPTY_RETURN_STATE);
		return this;
	}
	
	EmptyPredictionContext.prototype = Object.create(SingletonPredictionContext.prototype);
	EmptyPredictionContext.prototype.constructor = EmptyPredictionContext;
	
	EmptyPredictionContext.prototype.isEmpty = function() {
		return true;
	};
	
	EmptyPredictionContext.prototype.getParent = function(index) {
		return null;
	};
	
	EmptyPredictionContext.prototype.getReturnState = function(index) {
		return this.returnState;
	};
	
	EmptyPredictionContext.prototype.equals = function(other) {
		return this === other;
	};
	
	EmptyPredictionContext.prototype.toString = function() {
		return "$";
	};
	
	PredictionContext.EMPTY = new EmptyPredictionContext();
	
	function ArrayPredictionContext(parents, returnStates) {
		// Parent can be null only if full ctx mode and we make an array
		// from {@link //EMPTY} and non-empty. We merge {@link //EMPTY} by using
		// null parent and
		// returnState == {@link //EMPTY_RETURN_STATE}.
		var hash = calculateHashString(parents, returnStates);
		PredictionContext.call(this, hash);
		this.parents = parents;
		this.returnStates = returnStates;
		return this;
	}
	
	ArrayPredictionContext.prototype = Object.create(PredictionContext.prototype);
	ArrayPredictionContext.prototype.constructor = ArrayPredictionContext;
	
	ArrayPredictionContext.prototype.isEmpty = function() {
		// since EMPTY_RETURN_STATE can only appear in the last position, we
		// don't need to verify that size==1
		return this.returnStates[0] === PredictionContext.EMPTY_RETURN_STATE;
	};
	
	Object.defineProperty(ArrayPredictionContext.prototype, "length", {
		get : function() {
			return this.returnStates.length;
		}
	});
	
	ArrayPredictionContext.prototype.getParent = function(index) {
		return this.parents[index];
	};
	
	ArrayPredictionContext.prototype.getReturnState = function(index) {
		return this.returnStates[index];
	};
	
	ArrayPredictionContext.prototype.equals = function(other) {
		if (this === other) {
			return true;
		} else if (!(other instanceof ArrayPredictionContext)) {
			return false;
		} else if (this.hashString !== other.hashString()) {
			return false; // can't be same if hash is different
		} else {
			return this.returnStates === other.returnStates &&
					this.parents === other.parents;
		}
	};
	
	ArrayPredictionContext.prototype.toString = function() {
		if (this.isEmpty()) {
			return "[]";
		} else {
			var s = "[";
			for (var i = 0; i < this.returnStates.length; i++) {
				if (i > 0) {
					s = s + ", ";
				}
				if (this.returnStates[i] === PredictionContext.EMPTY_RETURN_STATE) {
					s = s + "$";
					continue;
				}
				s = s + this.returnStates[i];
				if (this.parents[i] !== null) {
					s = s + " " + this.parents[i];
				} else {
					s = s + "null";
				}
			}
			return s + "]";
		}
	};
	
	// Convert a {@link RuleContext} tree to a {@link PredictionContext} graph.
	// Return {@link //EMPTY} if {@code outerContext} is empty or null.
	// /
	function predictionContextFromRuleContext(atn, outerContext) {
		if (outerContext === undefined || outerContext === null) {
			outerContext = RuleContext.EMPTY;
		}
		// if we are in RuleContext of start rule, s, then PredictionContext
		// is EMPTY. Nobody called us. (if we are empty, return empty)
		if (outerContext.parentCtx === null || outerContext === RuleContext.EMPTY) {
			return PredictionContext.EMPTY;
		}
		// If we have a parent, convert it to a PredictionContext graph
		var parent = predictionContextFromRuleContext(atn, outerContext.parentCtx);
		var state = atn.states[outerContext.invokingState];
		var transition = state.transitions[0];
		return SingletonPredictionContext.create(parent, transition.followState.stateNumber);
	}
	
	function calculateListsHashString(parents, returnStates) {
		var s = "";
		parents.map(function(p) {
			s = s + p;
		});
		returnStates.map(function(r) {
			s = s + r;
		});
		return s;
	}
	
	function merge(a, b, rootIsWildcard, mergeCache) {
		// share same graph if both same
		if (a === b) {
			return a;
		}
		if (a instanceof SingletonPredictionContext && b instanceof SingletonPredictionContext) {
			return mergeSingletons(a, b, rootIsWildcard, mergeCache);
		}
		// At least one of a or b is array
		// If one is $ and rootIsWildcard, return $ as// wildcard
		if (rootIsWildcard) {
			if (a instanceof EmptyPredictionContext) {
				return a;
			}
			if (b instanceof EmptyPredictionContext) {
				return b;
			}
		}
		// convert singleton so both are arrays to normalize
		if (a instanceof SingletonPredictionContext) {
			a = new ArrayPredictionContext([a.getParent()], [a.returnState]);
		}
		if (b instanceof SingletonPredictionContext) {
			b = new ArrayPredictionContext([b.getParent()], [b.returnState]);
		}
		return mergeArrays(a, b, rootIsWildcard, mergeCache);
	}
	
	//
	// Merge two {@link SingletonPredictionContext} instances.
	//
	// <p>Stack tops equal, parents merge is same; return left graph.<br>
	// <embed src="images/SingletonMerge_SameRootSamePar.svg"
	// type="image/svg+xml"/></p>
	//
	// <p>Same stack top, parents differ; merge parents giving array node, then
	// remainders of those graphs. A new root node is created to point to the
	// merged parents.<br>
	// <embed src="images/SingletonMerge_SameRootDiffPar.svg"
	// type="image/svg+xml"/></p>
	//
	// <p>Different stack tops pointing to same parent. Make array node for the
	// root where both element in the root point to the same (original)
	// parent.<br>
	// <embed src="images/SingletonMerge_DiffRootSamePar.svg"
	// type="image/svg+xml"/></p>
	//
	// <p>Different stack tops pointing to different parents. Make array node for
	// the root where each element points to the corresponding original
	// parent.<br>
	// <embed src="images/SingletonMerge_DiffRootDiffPar.svg"
	// type="image/svg+xml"/></p>
	//
	// @param a the first {@link SingletonPredictionContext}
	// @param b the second {@link SingletonPredictionContext}
	// @param rootIsWildcard {@code true} if this is a local-context merge,
	// otherwise false to indicate a full-context merge
	// @param mergeCache
	// /
	function mergeSingletons(a, b, rootIsWildcard, mergeCache) {
		if (mergeCache !== null) {
			var previous = mergeCache.get(a, b);
			if (previous !== null) {
				return previous;
			}
			previous = mergeCache.get(b, a);
			if (previous !== null) {
				return previous;
			}
		}
	
		var rootMerge = mergeRoot(a, b, rootIsWildcard);
		if (rootMerge !== null) {
			if (mergeCache !== null) {
				mergeCache.set(a, b, rootMerge);
			}
			return rootMerge;
		}
		if (a.returnState === b.returnState) {
			var parent = merge(a.parentCtx, b.parentCtx, rootIsWildcard, mergeCache);
			// if parent is same as existing a or b parent or reduced to a parent,
			// return it
			if (parent === a.parentCtx) {
				return a; // ax + bx = ax, if a=b
			}
			if (parent === b.parentCtx) {
				return b; // ax + bx = bx, if a=b
			}
			// else: ax + ay = a'[x,y]
			// merge parents x and y, giving array node with x,y then remainders
			// of those graphs. dup a, a' points at merged array
			// new joined parent so create new singleton pointing to it, a'
			var spc = SingletonPredictionContext.create(parent, a.returnState);
			if (mergeCache !== null) {
				mergeCache.set(a, b, spc);
			}
			return spc;
		} else { // a != b payloads differ
			// see if we can collapse parents due to $+x parents if local ctx
			var singleParent = null;
			if (a === b || (a.parentCtx !== null && a.parentCtx === b.parentCtx)) { // ax +
																					// bx =
																					// [a,b]x
				singleParent = a.parentCtx;
			}
			if (singleParent !== null) { // parents are same
				// sort payloads and use same parent
				var payloads = [ a.returnState, b.returnState ];
				if (a.returnState > b.returnState) {
					payloads[0] = b.returnState;
					payloads[1] = a.returnState;
				}
				var parents = [ singleParent, singleParent ];
				var apc = new ArrayPredictionContext(parents, payloads);
				if (mergeCache !== null) {
					mergeCache.set(a, b, apc);
				}
				return apc;
			}
			// parents differ and can't merge them. Just pack together
			// into array; can't merge.
			// ax + by = [ax,by]
			var payloads = [ a.returnState, b.returnState ];
			var parents = [ a.parentCtx, b.parentCtx ];
			if (a.returnState > b.returnState) { // sort by payload
				payloads[0] = b.returnState;
				payloads[1] = a.returnState;
				parents = [ b.parentCtx, a.parentCtx ];
			}
			var a_ = new ArrayPredictionContext(parents, payloads);
			if (mergeCache !== null) {
				mergeCache.set(a, b, a_);
			}
			return a_;
		}
	}
	
	//
	// Handle case where at least one of {@code a} or {@code b} is
	// {@link //EMPTY}. In the following diagrams, the symbol {@code $} is used
	// to represent {@link //EMPTY}.
	//
	// <h2>Local-Context Merges</h2>
	//
	// <p>These local-context merge operations are used when {@code rootIsWildcard}
	// is true.</p>
	//
	// <p>{@link //EMPTY} is superset of any graph; return {@link //EMPTY}.<br>
	// <embed src="images/LocalMerge_EmptyRoot.svg" type="image/svg+xml"/></p>
	//
	// <p>{@link //EMPTY} and anything is {@code //EMPTY}, so merged parent is
	// {@code //EMPTY}; return left graph.<br>
	// <embed src="images/LocalMerge_EmptyParent.svg" type="image/svg+xml"/></p>
	//
	// <p>Special case of last merge if local context.<br>
	// <embed src="images/LocalMerge_DiffRoots.svg" type="image/svg+xml"/></p>
	//
	// <h2>Full-Context Merges</h2>
	//
	// <p>These full-context merge operations are used when {@code rootIsWildcard}
	// is false.</p>
	//
	// <p><embed src="images/FullMerge_EmptyRoots.svg" type="image/svg+xml"/></p>
	//
	// <p>Must keep all contexts; {@link //EMPTY} in array is a special value (and
	// null parent).<br>
	// <embed src="images/FullMerge_EmptyRoot.svg" type="image/svg+xml"/></p>
	//
	// <p><embed src="images/FullMerge_SameRoot.svg" type="image/svg+xml"/></p>
	//
	// @param a the first {@link SingletonPredictionContext}
	// @param b the second {@link SingletonPredictionContext}
	// @param rootIsWildcard {@code true} if this is a local-context merge,
	// otherwise false to indicate a full-context merge
	// /
	function mergeRoot(a, b, rootIsWildcard) {
		if (rootIsWildcard) {
			if (a === PredictionContext.EMPTY) {
				return PredictionContext.EMPTY; // // + b =//
			}
			if (b === PredictionContext.EMPTY) {
				return PredictionContext.EMPTY; // a +// =//
			}
		} else {
			if (a === PredictionContext.EMPTY && b === PredictionContext.EMPTY) {
				return PredictionContext.EMPTY; // $ + $ = $
			} else if (a === PredictionContext.EMPTY) { // $ + x = [$,x]
				var payloads = [ b.returnState,
						PredictionContext.EMPTY_RETURN_STATE ];
				var parents = [ b.parentCtx, null ];
				return new ArrayPredictionContext(parents, payloads);
			} else if (b === PredictionContext.EMPTY) { // x + $ = [$,x] ($ is always first if present)
				var payloads = [ a.returnState, PredictionContext.EMPTY_RETURN_STATE ];
				var parents = [ a.parentCtx, null ];
				return new ArrayPredictionContext(parents, payloads);
			}
		}
		return null;
	}
	
	//
	// Merge two {@link ArrayPredictionContext} instances.
	//
	// <p>Different tops, different parents.<br>
	// <embed src="images/ArrayMerge_DiffTopDiffPar.svg" type="image/svg+xml"/></p>
	//
	// <p>Shared top, same parents.<br>
	// <embed src="images/ArrayMerge_ShareTopSamePar.svg" type="image/svg+xml"/></p>
	//
	// <p>Shared top, different parents.<br>
	// <embed src="images/ArrayMerge_ShareTopDiffPar.svg" type="image/svg+xml"/></p>
	//
	// <p>Shared top, all shared parents.<br>
	// <embed src="images/ArrayMerge_ShareTopSharePar.svg"
	// type="image/svg+xml"/></p>
	//
	// <p>Equal tops, merge parents and reduce top to
	// {@link SingletonPredictionContext}.<br>
	// <embed src="images/ArrayMerge_EqualTop.svg" type="image/svg+xml"/></p>
	// /
	function mergeArrays(a, b, rootIsWildcard, mergeCache) {
		if (mergeCache !== null) {
			var previous = mergeCache.get(a, b);
			if (previous !== null) {
				return previous;
			}
			previous = mergeCache.get(b, a);
			if (previous !== null) {
				return previous;
			}
		}
		// merge sorted payloads a + b => M
		var i = 0; // walks a
		var j = 0; // walks b
		var k = 0; // walks target M array
	
		var mergedReturnStates = [];
		var mergedParents = [];
		// walk and merge to yield mergedParents, mergedReturnStates
		while (i < a.returnStates.length && j < b.returnStates.length) {
			var a_parent = a.parents[i];
			var b_parent = b.parents[j];
			if (a.returnStates[i] === b.returnStates[j]) {
				// same payload (stack tops are equal), must yield merged singleton
				var payload = a.returnStates[i];
				// $+$ = $
				var bothDollars = payload === PredictionContext.EMPTY_RETURN_STATE &&
						a_parent === null && b_parent === null;
				var ax_ax = (a_parent !== null && b_parent !== null && a_parent === b_parent); // ax+ax
																								// ->
																								// ax
				if (bothDollars || ax_ax) {
					mergedParents[k] = a_parent; // choose left
					mergedReturnStates[k] = payload;
				} else { // ax+ay -> a'[x,y]
					var mergedParent = merge(a_parent, b_parent, rootIsWildcard, mergeCache);
					mergedParents[k] = mergedParent;
					mergedReturnStates[k] = payload;
				}
				i += 1; // hop over left one as usual
				j += 1; // but also skip one in right side since we merge
			} else if (a.returnStates[i] < b.returnStates[j]) { // copy a[i] to M
				mergedParents[k] = a_parent;
				mergedReturnStates[k] = a.returnStates[i];
				i += 1;
			} else { // b > a, copy b[j] to M
				mergedParents[k] = b_parent;
				mergedReturnStates[k] = b.returnStates[j];
				j += 1;
			}
			k += 1;
		}
		// copy over any payloads remaining in either array
		if (i < a.returnStates.length) {
			for (var p = i; p < a.returnStates.length; p++) {
				mergedParents[k] = a.parents[p];
				mergedReturnStates[k] = a.returnStates[p];
				k += 1;
			}
		} else {
			for (var p = j; p < b.returnStates.length; p++) {
				mergedParents[k] = b.parents[p];
				mergedReturnStates[k] = b.returnStates[p];
				k += 1;
			}
		}
		// trim merged if we combined a few that had same stack tops
		if (k < mergedParents.length) { // write index < last position; trim
			if (k === 1) { // for just one merged element, return singleton top
				var a_ = SingletonPredictionContext.create(mergedParents[0],
						mergedReturnStates[0]);
				if (mergeCache !== null) {
					mergeCache.set(a, b, a_);
				}
				return a_;
			}
			mergedParents = mergedParents.slice(0, k);
			mergedReturnStates = mergedReturnStates.slice(0, k);
		}
	
		var M = new ArrayPredictionContext(mergedParents, mergedReturnStates);
	
		// if we created same array as a or b, return that instead
		// TODO: track whether this is possible above during merge sort for speed
		if (M === a) {
			if (mergeCache !== null) {
				mergeCache.set(a, b, a);
			}
			return a;
		}
		if (M === b) {
			if (mergeCache !== null) {
				mergeCache.set(a, b, b);
			}
			return b;
		}
		combineCommonParents(mergedParents);
	
		if (mergeCache !== null) {
			mergeCache.set(a, b, M);
		}
		return M;
	}
	
	//
	// Make pass over all <em>M</em> {@code parents}; merge any {@code equals()}
	// ones.
	// /
	function combineCommonParents(parents) {
		var uniqueParents = {};
	
		for (var p = 0; p < parents.length; p++) {
			var parent = parents[p];
			if (!(parent in uniqueParents)) {
				uniqueParents[parent] = parent;
			}
		}
		for (var q = 0; q < parents.length; q++) {
			parents[q] = uniqueParents[parents[q]];
		}
	}
	
	function getCachedPredictionContext(context, contextCache, visited) {
		if (context.isEmpty()) {
			return context;
		}
		var existing = visited[context] || null;
		if (existing !== null) {
			return existing;
		}
		existing = contextCache.get(context);
		if (existing !== null) {
			visited[context] = existing;
			return existing;
		}
		var changed = false;
		var parents = [];
		for (var i = 0; i < parents.length; i++) {
			var parent = getCachedPredictionContext(context.getParent(i), contextCache, visited);
			if (changed || parent !== context.getParent(i)) {
				if (!changed) {
					parents = [];
					for (var j = 0; j < context.length; j++) {
						parents[j] = context.getParent(j);
					}
					changed = true;
				}
				parents[i] = parent;
			}
		}
		if (!changed) {
			contextCache.add(context);
			visited[context] = context;
			return context;
		}
		var updated = null;
		if (parents.length === 0) {
			updated = PredictionContext.EMPTY;
		} else if (parents.length === 1) {
			updated = SingletonPredictionContext.create(parents[0], context
					.getReturnState(0));
		} else {
			updated = new ArrayPredictionContext(parents, context.returnStates);
		}
		contextCache.add(updated);
		visited[updated] = updated;
		visited[context] = updated;
	
		return updated;
	}
	
	// ter's recursive version of Sam's getAllNodes()
	function getAllContextNodes(context, nodes, visited) {
		if (nodes === null) {
			nodes = [];
			return getAllContextNodes(context, nodes, visited);
		} else if (visited === null) {
			visited = {};
			return getAllContextNodes(context, nodes, visited);
		} else {
			if (context === null || visited[context] !== null) {
				return nodes;
			}
			visited[context] = context;
			nodes.push(context);
			for (var i = 0; i < context.length; i++) {
				getAllContextNodes(context.getParent(i), nodes, visited);
			}
			return nodes;
		}
	}
	
	exports.merge = merge;
	exports.PredictionContext = PredictionContext;
	exports.PredictionContextCache = PredictionContextCache;
	exports.SingletonPredictionContext = SingletonPredictionContext;
	exports.predictionContextFromRuleContext = predictionContextFromRuleContext;
	exports.getCachedPredictionContext = getCachedPredictionContext;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	// The root of the ANTLR exception hierarchy. In general, ANTLR tracks just
	//  3 kinds of errors: prediction errors, failed predicate errors, and
	//  mismatched input errors. In each case, the parser knows where it is
	//  in the input, where it is in the ATN, the rule invocation stack,
	//  and what kind of problem occurred.
	
	var PredicateTransition = __webpack_require__(8).PredicateTransition;
	
	function RecognitionException(params) {
		Error.call(this);
		if (!!Error.captureStackTrace) {
	        Error.captureStackTrace(this, RecognitionException);
		} else {
			var stack = new Error().stack;
		}
		this.message = params.message;
	    this.recognizer = params.recognizer;
	    this.input = params.input;
	    this.ctx = params.ctx;
	    // The current {@link Token} when an error occurred. Since not all streams
	    // support accessing symbols by index, we have to track the {@link Token}
	    // instance itself.
	    this.offendingToken = null;
	    // Get the ATN state number the parser was in at the time the error
	    // occurred. For {@link NoViableAltException} and
	    // {@link LexerNoViableAltException} exceptions, this is the
	    // {@link DecisionState} number. For others, it is the state whose outgoing
	    // edge we couldn't match.
	    this.offendingState = -1;
	    if (this.recognizer!==null) {
	        this.offendingState = this.recognizer.state;
	    }
	    return this;
	}
	
	RecognitionException.prototype = Object.create(Error.prototype);
	RecognitionException.prototype.constructor = RecognitionException;
	
	// <p>If the state number is not known, this method returns -1.</p>
	
	//
	// Gets the set of input symbols which could potentially follow the
	// previously matched symbol at the time this exception was thrown.
	//
	// <p>If the set of expected tokens is not known and could not be computed,
	// this method returns {@code null}.</p>
	//
	// @return The set of token types that could potentially follow the current
	// state in the ATN, or {@code null} if the information is not available.
	// /
	RecognitionException.prototype.getExpectedTokens = function() {
	    if (this.recognizer!==null) {
	        return this.recognizer.atn.getExpectedTokens(this.offendingState, this.ctx);
	    } else {
	        return null;
	    }
	};
	
	RecognitionException.prototype.toString = function() {
	    return this.message;
	};
	
	function LexerNoViableAltException(lexer, input, startIndex, deadEndConfigs) {
		RecognitionException.call(this, {message:"", recognizer:lexer, input:input, ctx:null});
	    this.startIndex = startIndex;
	    this.deadEndConfigs = deadEndConfigs;
	    return this;
	}
	
	LexerNoViableAltException.prototype = Object.create(RecognitionException.prototype);
	LexerNoViableAltException.prototype.constructor = LexerNoViableAltException;
	
	LexerNoViableAltException.prototype.toString = function() {
	    var symbol = "";
	    if (this.startIndex >= 0 && this.startIndex < this.input.size) {
	        symbol = this.input.getText((this.startIndex,this.startIndex));
	    }
	    return "LexerNoViableAltException" + symbol;
	};
	
	// Indicates that the parser could not decide which of two or more paths
	// to take based upon the remaining input. It tracks the starting token
	// of the offending input and also knows where the parser was
	// in the various paths when the error. Reported by reportNoViableAlternative()
	//
	function NoViableAltException(recognizer, input, startToken, offendingToken, deadEndConfigs, ctx) {
		ctx = ctx || recognizer._ctx;
		offendingToken = offendingToken || recognizer.getCurrentToken();
		startToken = startToken || recognizer.getCurrentToken();
		input = input || recognizer.getInputStream();
		RecognitionException.call(this, {message:"", recognizer:recognizer, input:input, ctx:ctx});
	    // Which configurations did we try at input.index() that couldn't match
		// input.LT(1)?//
	    this.deadEndConfigs = deadEndConfigs;
	    // The token object at the start index; the input stream might
	    // not be buffering tokens so get a reference to it. (At the
	    // time the error occurred, of course the stream needs to keep a
	    // buffer all of the tokens but later we might not have access to those.)
	    this.startToken = startToken;
	    this.offendingToken = offendingToken;
	}
	
	NoViableAltException.prototype = Object.create(RecognitionException.prototype);
	NoViableAltException.prototype.constructor = NoViableAltException;
	
	// This signifies any kind of mismatched input exceptions such as
	// when the current input does not match the expected token.
	//
	function InputMismatchException(recognizer) {
		RecognitionException.call(this, {message:"", recognizer:recognizer, input:recognizer.getInputStream(), ctx:recognizer._ctx});
	    this.offendingToken = recognizer.getCurrentToken();
	}
	
	InputMismatchException.prototype = Object.create(RecognitionException.prototype);
	InputMismatchException.prototype.constructor = InputMismatchException;
	
	// A semantic predicate failed during validation. Validation of predicates
	// occurs when normally parsing the alternative just like matching a token.
	// Disambiguating predicate evaluation occurs when we test a predicate during
	// prediction.
	
	function FailedPredicateException(recognizer, predicate, message) {
		RecognitionException.call(this, {message:this.formatMessage(predicate,message || null), recognizer:recognizer,
	                         input:recognizer.getInputStream(), ctx:recognizer._ctx});
	    var s = recognizer._interp.atn.states[recognizer.state];
	    var trans = s.transitions[0];
	    if (trans instanceof PredicateTransition) {
	        this.ruleIndex = trans.ruleIndex;
	        this.predicateIndex = trans.predIndex;
	    } else {
	        this.ruleIndex = 0;
	        this.predicateIndex = 0;
	    }
	    this.predicate = predicate;
	    this.offendingToken = recognizer.getCurrentToken();
	    return this;
	}
	
	FailedPredicateException.prototype = Object.create(RecognitionException.prototype);
	FailedPredicateException.prototype.constructor = FailedPredicateException;
	
	FailedPredicateException.prototype.formatMessage = function(predicate, message) {
	    if (message !==null) {
	        return message;
	    } else {
	        return "failed predicate: {" + predicate + "}?";
	    }
	};
	
	function ParseCancellationException() {
		Error.call(this);
		Error.captureStackTrace(this, ParseCancellationException);
		return this;
	}
	
	ParseCancellationException.prototype = Object.create(Error.prototype);
	ParseCancellationException.prototype.constructor = ParseCancellationException;
	
	exports.RecognitionException = RecognitionException;
	exports.NoViableAltException = NoViableAltException;
	exports.LexerNoViableAltException = LexerNoViableAltException;
	exports.InputMismatchException = InputMismatchException;
	exports.FailedPredicateException = FailedPredicateException;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	// The basic notion of a tree has a parent, a payload, and a list of children.
	//  It is the most abstract interface for all the trees used by ANTLR.
	///
	
	var Token = __webpack_require__(1).Token;
	var Interval = __webpack_require__(2).Interval;
	var INVALID_INTERVAL = new Interval(-1, -2);
	
	function Tree() {
		return this;
	}
	
	function SyntaxTree() {
		Tree.call(this);
		return this;
	}
	
	SyntaxTree.prototype = Object.create(Tree.prototype);
	SyntaxTree.prototype.constructor = SyntaxTree;
	
	function ParseTree() {
		SyntaxTree.call(this);
		return this;
	}
	
	ParseTree.prototype = Object.create(SyntaxTree.prototype);
	ParseTree.prototype.constructor = ParseTree;
	
	function RuleNode() {
		ParseTree.call(this);
		return this;
	}
	
	RuleNode.prototype = Object.create(ParseTree.prototype);
	RuleNode.prototype.constructor = RuleNode;
	
	function TerminalNode() {
		ParseTree.call(this);
		return this;
	}
	
	TerminalNode.prototype = Object.create(ParseTree.prototype);
	TerminalNode.prototype.constructor = TerminalNode;
	
	function ErrorNode() {
		TerminalNode.call(this);
		return this;
	}
	
	ErrorNode.prototype = Object.create(TerminalNode.prototype);
	ErrorNode.prototype.constructor = ErrorNode;
	
	function ParseTreeVisitor() {
		return this;
	}
	
	function ParseTreeListener() {
		return this;
	}
	
	ParseTreeListener.prototype.visitTerminal = function(node) {
	};
	
	ParseTreeListener.prototype.visitErrorNode = function(node) {
	};
	
	ParseTreeListener.prototype.enterEveryRule = function(node) {
	};
	
	ParseTreeListener.prototype.exitEveryRule = function(node) {
	};
	
	function TerminalNodeImpl(symbol) {
		TerminalNode.call(this);
		this.parentCtx = null;
		this.symbol = symbol;
		return this;
	}
	
	TerminalNodeImpl.prototype = Object.create(TerminalNode.prototype);
	TerminalNodeImpl.prototype.constructor = TerminalNodeImpl;
	
	TerminalNodeImpl.prototype.getChild = function(i) {
		return null;
	};
	
	TerminalNodeImpl.prototype.getSymbol = function() {
		return this.symbol;
	};
	
	TerminalNodeImpl.prototype.getParent = function() {
		return this.parentCtx;
	};
	
	TerminalNodeImpl.prototype.getPayload = function() {
		return this.symbol;
	};
	
	TerminalNodeImpl.prototype.getSourceInterval = function() {
		if (this.symbol === null) {
			return INVALID_INTERVAL;
		}
		var tokenIndex = this.symbol.tokenIndex;
		return new Interval(tokenIndex, tokenIndex);
	};
	
	TerminalNodeImpl.prototype.getChildCount = function() {
		return 0;
	};
	
	TerminalNodeImpl.prototype.accept = function(visitor) {
		return visitor.visitTerminal(this);
	};
	
	TerminalNodeImpl.prototype.getText = function() {
		return this.symbol.text;
	};
	
	TerminalNodeImpl.prototype.toString = function() {
		if (this.symbol.type === Token.EOF) {
			return "<EOF>";
		} else {
			return this.symbol.text;
		}
	};
	
	// Represents a token that was consumed during resynchronization
	// rather than during a valid match operation. For example,
	// we will create this kind of a node during single token insertion
	// and deletion as well as during "consume until error recovery set"
	// upon no viable alternative exceptions.
	
	function ErrorNodeImpl(token) {
		TerminalNodeImpl.call(this, token);
		return this;
	}
	
	ErrorNodeImpl.prototype = Object.create(TerminalNodeImpl.prototype);
	ErrorNodeImpl.prototype.constructor = ErrorNodeImpl;
	
	ErrorNodeImpl.prototype.isErrorNode = function() {
		return true;
	};
	
	ErrorNodeImpl.prototype.accept = function(visitor) {
		return visitor.visitErrorNode(this);
	};
	
	function ParseTreeWalker() {
		return this;
	}
	
	ParseTreeWalker.prototype.walk = function(listener, t) {
		var errorNode = t instanceof ErrorNode ||
				(t.isErrorNode !== undefined && t.isErrorNode());
		if (errorNode) {
			listener.visitErrorNode(t);
		} else if (t instanceof TerminalNode) {
			listener.visitTerminal(t);
		} else {
			this.enterRule(listener, t);
			for (var i = 0; i < t.getChildCount(); i++) {
				var child = t.getChild(i);
				this.walk(listener, child);
			}
			this.exitRule(listener, t);
		}
	};
	//
	// The discovery of a rule node, involves sending two events: the generic
	// {@link ParseTreeListener//enterEveryRule} and a
	// {@link RuleContext}-specific event. First we trigger the generic and then
	// the rule specific. We to them in reverse order upon finishing the node.
	//
	ParseTreeWalker.prototype.enterRule = function(listener, r) {
		var ctx = r.getRuleContext();
		listener.enterEveryRule(ctx);
		ctx.enterRule(listener);
	};
	
	ParseTreeWalker.prototype.exitRule = function(listener, r) {
		var ctx = r.getRuleContext();
		ctx.exitRule(listener);
		listener.exitEveryRule(ctx);
	};
	
	ParseTreeWalker.DEFAULT = new ParseTreeWalker();
	
	exports.RuleNode = RuleNode;
	exports.ErrorNode = ErrorNode;
	exports.TerminalNode = TerminalNode;
	exports.ErrorNodeImpl = ErrorNodeImpl;
	exports.TerminalNodeImpl = TerminalNodeImpl;
	exports.ParseTreeListener = ParseTreeListener;
	exports.ParseTreeVisitor = ParseTreeVisitor;
	exports.ParseTreeWalker = ParseTreeWalker;
	exports.INVALID_INTERVAL = INVALID_INTERVAL;

/***/ },
/* 7 */
/***/ function(module, exports) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	
	// The following images show the relation of states and
	// {@link ATNState//transitions} for various grammar constructs.
	//
	// <ul>
	//
	// <li>Solid edges marked with an &//0949; indicate a required
	// {@link EpsilonTransition}.</li>
	//
	// <li>Dashed edges indicate locations where any transition derived from
	// {@link Transition} might appear.</li>
	//
	// <li>Dashed nodes are place holders for either a sequence of linked
	// {@link BasicState} states or the inclusion of a block representing a nested
	// construct in one of the forms below.</li>
	//
	// <li>Nodes showing multiple outgoing alternatives with a {@code ...} support
	// any number of alternatives (one or more). Nodes without the {@code ...} only
	// support the exact number of alternatives shown in the diagram.</li>
	//
	// </ul>
	//
	// <h2>Basic Blocks</h2>
	//
	// <h3>Rule</h3>
	//
	// <embed src="images/Rule.svg" type="image/svg+xml"/>
	//
	// <h3>Block of 1 or more alternatives</h3>
	//
	// <embed src="images/Block.svg" type="image/svg+xml"/>
	//
	// <h2>Greedy Loops</h2>
	//
	// <h3>Greedy Closure: {@code (...)*}</h3>
	//
	// <embed src="images/ClosureGreedy.svg" type="image/svg+xml"/>
	//
	// <h3>Greedy Positive Closure: {@code (...)+}</h3>
	//
	// <embed src="images/PositiveClosureGreedy.svg" type="image/svg+xml"/>
	//
	// <h3>Greedy Optional: {@code (...)?}</h3>
	//
	// <embed src="images/OptionalGreedy.svg" type="image/svg+xml"/>
	//
	// <h2>Non-Greedy Loops</h2>
	//
	// <h3>Non-Greedy Closure: {@code (...)*?}</h3>
	//
	// <embed src="images/ClosureNonGreedy.svg" type="image/svg+xml"/>
	//
	// <h3>Non-Greedy Positive Closure: {@code (...)+?}</h3>
	//
	// <embed src="images/PositiveClosureNonGreedy.svg" type="image/svg+xml"/>
	//
	// <h3>Non-Greedy Optional: {@code (...)??}</h3>
	//
	// <embed src="images/OptionalNonGreedy.svg" type="image/svg+xml"/>
	//
	
	var INITIAL_NUM_TRANSITIONS = 4;
	
	function ATNState() {
	    // Which ATN are we in?
	    this.atn = null;
	    this.stateNumber = ATNState.INVALID_STATE_NUMBER;
	    this.stateType = null;
	    this.ruleIndex = 0; // at runtime, we don't have Rule objects
	    this.epsilonOnlyTransitions = false;
	    // Track the transitions emanating from this ATN state.
	    this.transitions = [];
	    // Used to cache lookahead during parsing, not used during construction
	    this.nextTokenWithinRule = null;
	    return this;
	}
	
	// constants for serialization
	ATNState.INVALID_TYPE = 0;
	ATNState.BASIC = 1;
	ATNState.RULE_START = 2;
	ATNState.BLOCK_START = 3;
	ATNState.PLUS_BLOCK_START = 4;
	ATNState.STAR_BLOCK_START = 5;
	ATNState.TOKEN_START = 6;
	ATNState.RULE_STOP = 7;
	ATNState.BLOCK_END = 8;
	ATNState.STAR_LOOP_BACK = 9;
	ATNState.STAR_LOOP_ENTRY = 10;
	ATNState.PLUS_LOOP_BACK = 11;
	ATNState.LOOP_END = 12;
	
	ATNState.serializationNames = [
	            "INVALID",
	            "BASIC",
	            "RULE_START",
	            "BLOCK_START",
	            "PLUS_BLOCK_START",
	            "STAR_BLOCK_START",
	            "TOKEN_START",
	            "RULE_STOP",
	            "BLOCK_END",
	            "STAR_LOOP_BACK",
	            "STAR_LOOP_ENTRY",
	            "PLUS_LOOP_BACK",
	            "LOOP_END" ];
	
	ATNState.INVALID_STATE_NUMBER = -1;
	
	ATNState.prototype.toString = function() {
		return this.stateNumber;
	};
	
	ATNState.prototype.equals = function(other) {
	    if (other instanceof ATNState) {
	        return this.stateNumber===other.stateNumber;
	    } else {
	        return false;
	    }
	};
	
	ATNState.prototype.isNonGreedyExitState = function() {
	    return false;
	};
	
	
	ATNState.prototype.addTransition = function(trans, index) {
		if(index===undefined) {
			index = -1;
		}
	    if (this.transitions.length===0) {
	        this.epsilonOnlyTransitions = trans.isEpsilon;
	    } else if(this.epsilonOnlyTransitions !== trans.isEpsilon) {
	        this.epsilonOnlyTransitions = false;
	    }
	    if (index===-1) {
	        this.transitions.push(trans);
	    } else {
	        this.transitions.splice(index, 1, trans);
	    }
	};
	
	function BasicState() {
		ATNState.call(this);
	    this.stateType = ATNState.BASIC;
	    return this;
	}
	
	BasicState.prototype = Object.create(ATNState.prototype);
	BasicState.prototype.constructor = BasicState;
	
	
	function DecisionState() {
		ATNState.call(this);
	    this.decision = -1;
	    this.nonGreedy = false;
	    return this;
	}
	
	DecisionState.prototype = Object.create(ATNState.prototype);
	DecisionState.prototype.constructor = DecisionState;
	
	
	//  The start of a regular {@code (...)} block.
	function BlockStartState() {
		DecisionState.call(this);
		this.endState = null;
		return this;
	}
	
	BlockStartState.prototype = Object.create(DecisionState.prototype);
	BlockStartState.prototype.constructor = BlockStartState;
	
	
	function BasicBlockStartState() {
		BlockStartState.call(this);
		this.stateType = ATNState.BLOCK_START;
		return this;
	}
	
	BasicBlockStartState.prototype = Object.create(BlockStartState.prototype);
	BasicBlockStartState.prototype.constructor = BasicBlockStartState;
	
	
	// Terminal node of a simple {@code (a|b|c)} block.
	function BlockEndState() {
		ATNState.call(this);
		this.stateType = ATNState.BLOCK_END;
	    this.startState = null;
	    return this;
	}
	
	BlockEndState.prototype = Object.create(ATNState.prototype);
	BlockEndState.prototype.constructor = BlockEndState;
	
	
	// The last node in the ATN for a rule, unless that rule is the start symbol.
	//  In that case, there is one transition to EOF. Later, we might encode
	//  references to all calls to this rule to compute FOLLOW sets for
	//  error handling.
	//
	function RuleStopState() {
		ATNState.call(this);
	    this.stateType = ATNState.RULE_STOP;
	    return this;
	}
	
	RuleStopState.prototype = Object.create(ATNState.prototype);
	RuleStopState.prototype.constructor = RuleStopState;
	
	function RuleStartState() {
		ATNState.call(this);
		this.stateType = ATNState.RULE_START;
		this.stopState = null;
		this.isPrecedenceRule = false;
		return this;
	}
	
	RuleStartState.prototype = Object.create(ATNState.prototype);
	RuleStartState.prototype.constructor = RuleStartState;
	
	// Decision state for {@code A+} and {@code (A|B)+}.  It has two transitions:
	//  one to the loop back to start of the block and one to exit.
	//
	function PlusLoopbackState() {
		DecisionState.call(this);
		this.stateType = ATNState.PLUS_LOOP_BACK;
		return this;
	}
	
	PlusLoopbackState.prototype = Object.create(DecisionState.prototype);
	PlusLoopbackState.prototype.constructor = PlusLoopbackState;
	        
	
	// Start of {@code (A|B|...)+} loop. Technically a decision state, but
	//  we don't use for code generation; somebody might need it, so I'm defining
	//  it for completeness. In reality, the {@link PlusLoopbackState} node is the
	//  real decision-making note for {@code A+}.
	//
	function PlusBlockStartState() {
		BlockStartState.call(this);
		this.stateType = ATNState.PLUS_BLOCK_START;
	    this.loopBackState = null;
	    return this;
	}
	
	PlusBlockStartState.prototype = Object.create(BlockStartState.prototype);
	PlusBlockStartState.prototype.constructor = PlusBlockStartState;
	
	// The block that begins a closure loop.
	function StarBlockStartState() {
		BlockStartState.call(this);
		this.stateType = ATNState.STAR_BLOCK_START;
		return this;
	}
	
	StarBlockStartState.prototype = Object.create(BlockStartState.prototype);
	StarBlockStartState.prototype.constructor = StarBlockStartState;
	
	
	function StarLoopbackState() {
		ATNState.call(this);
		this.stateType = ATNState.STAR_LOOP_BACK;
		return this;
	}
	
	StarLoopbackState.prototype = Object.create(ATNState.prototype);
	StarLoopbackState.prototype.constructor = StarLoopbackState;
	
	
	function StarLoopEntryState() {
		DecisionState.call(this);
		this.stateType = ATNState.STAR_LOOP_ENTRY;
	    this.loopBackState = null;
	    // Indicates whether this state can benefit from a precedence DFA during SLL decision making.
	    this.precedenceRuleDecision = null;
	    return this;
	}
	
	StarLoopEntryState.prototype = Object.create(DecisionState.prototype);
	StarLoopEntryState.prototype.constructor = StarLoopEntryState;
	
	
	// Mark the end of a * or + loop.
	function LoopEndState() {
		ATNState.call(this);
		this.stateType = ATNState.LOOP_END;
		this.loopBackState = null;
		return this;
	}
	
	LoopEndState.prototype = Object.create(ATNState.prototype);
	LoopEndState.prototype.constructor = LoopEndState;
	
	
	// The Tokens rule start state linking to each lexer rule start state */
	function TokensStartState() {
		DecisionState.call(this);
		this.stateType = ATNState.TOKEN_START;
		return this;
	}
	
	TokensStartState.prototype = Object.create(DecisionState.prototype);
	TokensStartState.prototype.constructor = TokensStartState;
	
	exports.ATNState = ATNState;
	exports.BasicState = BasicState;
	exports.DecisionState = DecisionState;
	exports.BlockStartState = BlockStartState;
	exports.BlockEndState = BlockEndState;
	exports.LoopEndState = LoopEndState;
	exports.RuleStartState = RuleStartState;
	exports.RuleStopState = RuleStopState;
	exports.TokensStartState = TokensStartState;
	exports.PlusLoopbackState = PlusLoopbackState;
	exports.StarLoopbackState = StarLoopbackState;
	exports.StarLoopEntryState = StarLoopEntryState;
	exports.PlusBlockStartState = PlusBlockStartState;
	exports.StarBlockStartState = StarBlockStartState;
	exports.BasicBlockStartState = BasicBlockStartState;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	
	//  An ATN transition between any two ATN states.  Subclasses define
	//  atom, set, epsilon, action, predicate, rule transitions.
	//
	//  <p>This is a one way link.  It emanates from a state (usually via a list of
	//  transitions) and has a target state.</p>
	//
	//  <p>Since we never have to change the ATN transitions once we construct it,
	//  we can fix these transitions as specific classes. The DFA transitions
	//  on the other hand need to update the labels as it adds transitions to
	//  the states. We'll use the term Edge for the DFA to distinguish them from
	//  ATN transitions.</p>
	
	var Token = __webpack_require__(1).Token;
	var Interval = __webpack_require__(2).Interval;
	var IntervalSet = __webpack_require__(2).IntervalSet;
	var Predicate = __webpack_require__(12).Predicate;
	var PrecedencePredicate = __webpack_require__(12).PrecedencePredicate;
	
	function Transition (target) {
	    // The target of this transition.
	    if (target===undefined || target===null) {
	        throw "target cannot be null.";
	    }
	    this.target = target;
	    // Are we epsilon, action, sempred?
	    this.isEpsilon = false;
	    this.label = null;
	    return this;
	}
	    // constants for serialization
	Transition.EPSILON = 1;
	Transition.RANGE = 2;
	Transition.RULE = 3;
	Transition.PREDICATE = 4; // e.g., {isType(input.LT(1))}?
	Transition.ATOM = 5;
	Transition.ACTION = 6;
	Transition.SET = 7; // ~(A|B) or ~atom, wildcard, which convert to next 2
	Transition.NOT_SET = 8;
	Transition.WILDCARD = 9;
	Transition.PRECEDENCE = 10;
	
	Transition.serializationNames = [
	            "INVALID",
	            "EPSILON",
	            "RANGE",
	            "RULE",
	            "PREDICATE",
	            "ATOM",
	            "ACTION",
	            "SET",
	            "NOT_SET",
	            "WILDCARD",
	            "PRECEDENCE"
	        ];
	
	Transition.serializationTypes = {
	        EpsilonTransition: Transition.EPSILON,
	        RangeTransition: Transition.RANGE,
	        RuleTransition: Transition.RULE,
	        PredicateTransition: Transition.PREDICATE,
	        AtomTransition: Transition.ATOM,
	        ActionTransition: Transition.ACTION,
	        SetTransition: Transition.SET,
	        NotSetTransition: Transition.NOT_SET,
	        WildcardTransition: Transition.WILDCARD,
	        PrecedencePredicateTransition: Transition.PRECEDENCE
	    };
	
	
	// TODO: make all transitions sets? no, should remove set edges
	function AtomTransition(target, label) {
		Transition.call(this, target);
		this.label_ = label; // The token type or character value; or, signifies special label.
	    this.label = this.makeLabel();
	    this.serializationType = Transition.ATOM;
	    return this;
	}
	
	AtomTransition.prototype = Object.create(Transition.prototype);
	AtomTransition.prototype.constructor = AtomTransition;
	
	AtomTransition.prototype.makeLabel = function() {
		var s = new IntervalSet();
	    s.addOne(this.label_);
	    return s;
	};
	
	AtomTransition.prototype.matches = function( symbol, minVocabSymbol,  maxVocabSymbol) {
	    return this.label_ === symbol;
	};
	
	AtomTransition.prototype.toString = function() {
		return this.label_;
	};
	
	function RuleTransition(ruleStart, ruleIndex, precedence, followState) {
		Transition.call(this, ruleStart);
	    this.ruleIndex = ruleIndex; // ptr to the rule definition object for this rule ref
	    this.precedence = precedence;
	    this.followState = followState; // what node to begin computations following ref to rule
	    this.serializationType = Transition.RULE;
	    this.isEpsilon = true;
	    return this;
	}
	
	RuleTransition.prototype = Object.create(Transition.prototype);
	RuleTransition.prototype.constructor = RuleTransition;
	
	RuleTransition.prototype.matches = function(symbol, minVocabSymbol,  maxVocabSymbol) {
		return false;
	};
	
	
	function EpsilonTransition(target, outermostPrecedenceReturn) {
		Transition.call(this, target);
	    this.serializationType = Transition.EPSILON;
	    this.isEpsilon = true;
	    this.outermostPrecedenceReturn = outermostPrecedenceReturn;
	    return this;
	}
	
	EpsilonTransition.prototype = Object.create(Transition.prototype);
	EpsilonTransition.prototype.constructor = EpsilonTransition;
	
	EpsilonTransition.prototype.matches = function( symbol, minVocabSymbol,  maxVocabSymbol) {
		return false;
	};
	
	EpsilonTransition.prototype.toString = function() {
		return "epsilon";
	};
	
	function RangeTransition(target, start, stop) {
		Transition.call(this, target);
		this.serializationType = Transition.RANGE;
	    this.start = start;
	    this.stop = stop;
	    this.label = this.makeLabel();
	    return this;
	}
	
	RangeTransition.prototype = Object.create(Transition.prototype);
	RangeTransition.prototype.constructor = RangeTransition;
	
	RangeTransition.prototype.makeLabel = function() {
	    var s = new IntervalSet();
	    s.addRange(this.start, this.stop);
	    return s;
	};
	
	RangeTransition.prototype.matches = function(symbol, minVocabSymbol,  maxVocabSymbol) {
		return symbol >= this.start && symbol <= this.stop;
	};
	
	RangeTransition.prototype.toString = function() {
		return "'" + String.fromCharCode(this.start) + "'..'" + String.fromCharCode(this.stop) + "'";
	};
	
	function AbstractPredicateTransition(target) {
		Transition.call(this, target);
		return this;
	}
	
	AbstractPredicateTransition.prototype = Object.create(Transition.prototype);
	AbstractPredicateTransition.prototype.constructor = AbstractPredicateTransition;
	
	function PredicateTransition(target, ruleIndex, predIndex, isCtxDependent) {
		AbstractPredicateTransition.call(this, target);
	    this.serializationType = Transition.PREDICATE;
	    this.ruleIndex = ruleIndex;
	    this.predIndex = predIndex;
	    this.isCtxDependent = isCtxDependent; // e.g., $i ref in pred
	    this.isEpsilon = true;
	    return this;
	}
	
	PredicateTransition.prototype = Object.create(AbstractPredicateTransition.prototype);
	PredicateTransition.prototype.constructor = PredicateTransition;
	
	PredicateTransition.prototype.matches = function(symbol, minVocabSymbol,  maxVocabSymbol) {
		return false;
	};
	
	PredicateTransition.prototype.getPredicate = function() {
		return new Predicate(this.ruleIndex, this.predIndex, this.isCtxDependent);
	};
	
	PredicateTransition.prototype.toString = function() {
		return "pred_" + this.ruleIndex + ":" + this.predIndex;
	};
	
	function ActionTransition(target, ruleIndex, actionIndex, isCtxDependent) {
		Transition.call(this, target);
	    this.serializationType = Transition.ACTION;
	    this.ruleIndex = ruleIndex;
	    this.actionIndex = actionIndex===undefined ? -1 : actionIndex;
	    this.isCtxDependent = isCtxDependent===undefined ? false : isCtxDependent; // e.g., $i ref in pred
	    this.isEpsilon = true;
	    return this;
	}
	
	ActionTransition.prototype = Object.create(Transition.prototype);
	ActionTransition.prototype.constructor = ActionTransition;
	
	
	ActionTransition.prototype.matches = function(symbol, minVocabSymbol,  maxVocabSymbol) {
		return false;
	};
	
	ActionTransition.prototype.toString = function() {
		return "action_" + this.ruleIndex + ":" + this.actionIndex;
	};
	        
	
	// A transition containing a set of values.
	function SetTransition(target, set) {
		Transition.call(this, target);
		this.serializationType = Transition.SET;
	    if (set !==undefined && set !==null) {
	        this.label = set;
	    } else {
	        this.label = new IntervalSet();
	        this.label.addOne(Token.INVALID_TYPE);
	    }
	    return this;
	}
	
	SetTransition.prototype = Object.create(Transition.prototype);
	SetTransition.prototype.constructor = SetTransition;
	
	SetTransition.prototype.matches = function(symbol, minVocabSymbol,  maxVocabSymbol) {
		return this.label.contains(symbol);
	};
	        
	
	SetTransition.prototype.toString = function() {
		return this.label.toString();
	};
	
	function NotSetTransition(target, set) {
		SetTransition.call(this, target, set);
		this.serializationType = Transition.NOT_SET;
		return this;
	}
	
	NotSetTransition.prototype = Object.create(SetTransition.prototype);
	NotSetTransition.prototype.constructor = NotSetTransition;
	
	NotSetTransition.prototype.matches = function(symbol, minVocabSymbol,  maxVocabSymbol) {
		return symbol >= minVocabSymbol && symbol <= maxVocabSymbol &&
				!SetTransition.prototype.matches.call(this, symbol, minVocabSymbol, maxVocabSymbol);
	};
	
	NotSetTransition.prototype.toString = function() {
		return '~' + SetTransition.prototype.toString.call(this);
	};
	
	function WildcardTransition(target) {
		Transition.call(this, target);
		this.serializationType = Transition.WILDCARD;
		return this;
	}
	
	WildcardTransition.prototype = Object.create(Transition.prototype);
	WildcardTransition.prototype.constructor = WildcardTransition;
	
	
	WildcardTransition.prototype.matches = function(symbol, minVocabSymbol,  maxVocabSymbol) {
		return symbol >= minVocabSymbol && symbol <= maxVocabSymbol;
	};
	
	WildcardTransition.prototype.toString = function() {
		return ".";
	};
	
	function PrecedencePredicateTransition(target, precedence) {
		AbstractPredicateTransition.call(this, target);
	    this.serializationType = Transition.PRECEDENCE;
	    this.precedence = precedence;
	    this.isEpsilon = true;
	    return this;
	}
	
	PrecedencePredicateTransition.prototype = Object.create(AbstractPredicateTransition.prototype);
	PrecedencePredicateTransition.prototype.constructor = PrecedencePredicateTransition;
	
	PrecedencePredicateTransition.prototype.matches = function(symbol, minVocabSymbol,  maxVocabSymbol) {
		return false;
	};
	
	PrecedencePredicateTransition.prototype.getPredicate = function() {
		return new PrecedencePredicate(this.precedence);
	};
	
	PrecedencePredicateTransition.prototype.toString = function() {
		return this.precedence + " >= _p";
	};
	        
	exports.Transition = Transition;
	exports.AtomTransition = AtomTransition;
	exports.SetTransition = SetTransition;
	exports.NotSetTransition = NotSetTransition;
	exports.RuleTransition = RuleTransition;
	exports.ActionTransition = ActionTransition;
	exports.EpsilonTransition = EpsilonTransition;
	exports.RangeTransition = RangeTransition;
	exports.WildcardTransition = WildcardTransition;
	exports.PredicateTransition = PredicateTransition;
	exports.PrecedencePredicateTransition = PrecedencePredicateTransition;
	exports.AbstractPredicateTransition = AbstractPredicateTransition;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// [The "BSD license"]
	//  Copyright (c) 2013 Terence Parr
	//  Copyright (c) 2013 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	var LL1Analyzer = __webpack_require__(33).LL1Analyzer;
	var IntervalSet = __webpack_require__(2).IntervalSet;
	
	function ATN(grammarType , maxTokenType) {
	
	    // Used for runtime deserialization of ATNs from strings///
	    // The type of the ATN.
	    this.grammarType = grammarType;
	    // The maximum value for any symbol recognized by a transition in the ATN.
	    this.maxTokenType = maxTokenType;
	    this.states = [];
	    // Each subrule/rule is a decision point and we must track them so we
	    //  can go back later and build DFA predictors for them.  This includes
	    //  all the rules, subrules, optional blocks, ()+, ()* etc...
	    this.decisionToState = [];
	    // Maps from rule index to starting state number.
	    this.ruleToStartState = [];
	    // Maps from rule index to stop state number.
	    this.ruleToStopState = null;
	    this.modeNameToStartState = {};
	    // For lexer ATNs, this maps the rule index to the resulting token type.
	    // For parser ATNs, this maps the rule index to the generated bypass token
	    // type if the
	    // {@link ATNDeserializationOptions//isGenerateRuleBypassTransitions}
	    // deserialization option was specified; otherwise, this is {@code null}.
	    this.ruleToTokenType = null;
	    // For lexer ATNs, this is an array of {@link LexerAction} objects which may
	    // be referenced by action transitions in the ATN.
	    this.lexerActions = null;
	    this.modeToStartState = [];
	
	    return this;
	}
		
	// Compute the set of valid tokens that can occur starting in state {@code s}.
	//  If {@code ctx} is null, the set of tokens will not include what can follow
	//  the rule surrounding {@code s}. In other words, the set will be
	//  restricted to tokens reachable staying within {@code s}'s rule.
	ATN.prototype.nextTokensInContext = function(s, ctx) {
	    var anal = new LL1Analyzer(this);
	    return anal.LOOK(s, null, ctx);
	};
	
	// Compute the set of valid tokens that can occur starting in {@code s} and
	// staying in same rule. {@link Token//EPSILON} is in set if we reach end of
	// rule.
	ATN.prototype.nextTokensNoContext = function(s) {
	    if (s.nextTokenWithinRule !== null ) {
	        return s.nextTokenWithinRule;
	    }
	    s.nextTokenWithinRule = this.nextTokensInContext(s, null);
	    s.nextTokenWithinRule.readonly = true;
	    return s.nextTokenWithinRule;
	};
	
	ATN.prototype.nextTokens = function(s, ctx) {
	    if ( ctx===undefined ) {
	        return this.nextTokensNoContext(s);
	    } else {
	        return this.nextTokensInContext(s, ctx);
	    }
	};
	
	ATN.prototype.addState = function( state) {
	    if ( state !== null ) {
	        state.atn = this;
	        state.stateNumber = this.states.length;
	    }
	    this.states.push(state);
	};
	
	ATN.prototype.removeState = function( state) {
	    this.states[state.stateNumber] = null; // just free mem, don't shift states in list
	};
	
	ATN.prototype.defineDecisionState = function( s) {
	    this.decisionToState.push(s);
	    s.decision = this.decisionToState.length-1;
	    return s.decision;
	};
	
	ATN.prototype.getDecisionState = function( decision) {
	    if (this.decisionToState.length===0) {
	        return null;
	    } else {
	        return this.decisionToState[decision];
	    }
	};
	
	// Computes the set of input symbols which could follow ATN state number
	// {@code stateNumber} in the specified full {@code context}. This method
	// considers the complete parser context, but does not evaluate semantic
	// predicates (i.e. all predicates encountered during the calculation are
	// assumed true). If a path in the ATN exists from the starting state to the
	// {@link RuleStopState} of the outermost context without matching any
	// symbols, {@link Token//EOF} is added to the returned set.
	//
	// <p>If {@code context} is {@code null}, it is treated as
	// {@link ParserRuleContext//EMPTY}.</p>
	//
	// @param stateNumber the ATN state number
	// @param context the full parse context
	// @return The set of potentially valid input symbols which could follow the
	// specified state in the specified context.
	// @throws IllegalArgumentException if the ATN does not contain a state with
	// number {@code stateNumber}
	var Token = __webpack_require__(1).Token;
	
	ATN.prototype.getExpectedTokens = function( stateNumber, ctx ) {
	    if ( stateNumber < 0 || stateNumber >= this.states.length ) {
	        throw("Invalid state number.");
	    }
	    var s = this.states[stateNumber];
	    var following = this.nextTokens(s);
	    if (!following.contains(Token.EPSILON)) {
	        return following;
	    }
	    var expected = new IntervalSet();
	    expected.addSet(following);
	    expected.removeOne(Token.EPSILON);
	    while (ctx !== null && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
	        var invokingState = this.states[ctx.invokingState];
	        var rt = invokingState.transitions[0];
	        following = this.nextTokens(rt.followState);
	        expected.addSet(following);
	        expected.removeOne(Token.EPSILON);
	        ctx = ctx.parentCtx;
	    }
	    if (following.contains(Token.EPSILON)) {
	        expected.addOne(Token.EOF);
	    }
	    return expected;
	};
	
	ATN.INVALID_ALT_NUMBER = 0;
	
	exports.ATN = ATN;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	//
	// Specialized {@link Set}{@code <}{@link ATNConfig}{@code >} that can track
	// info about the set, with support for combining similar configurations using a
	// graph-structured stack.
	///
	
	var ATN = __webpack_require__(9).ATN;
	var Utils = __webpack_require__(3);
	var Set = Utils.Set;
	var SemanticContext = __webpack_require__(12).SemanticContext;
	var merge = __webpack_require__(4).merge;
	
	function hashATNConfig(c) {
		return c.shortHashString();
	}
	
	function equalATNConfigs(a, b) {
		if ( a===b ) {
			return true;
		}
		if ( a===null || b===null ) {
			return false;
		}
		return a.state.stateNumber===b.state.stateNumber &&
			a.alt===b.alt && a.semanticContext.equals(b.semanticContext);
	}
	
	
	function ATNConfigSet(fullCtx) {
		//
		// The reason that we need this is because we don't want the hash map to use
		// the standard hash code and equals. We need all configurations with the
		// same
		// {@code (s,i,_,semctx)} to be equal. Unfortunately, this key effectively
		// doubles
		// the number of objects associated with ATNConfigs. The other solution is
		// to
		// use a hash table that lets us specify the equals/hashcode operation.
		// All configs but hashed by (s, i, _, pi) not including context. Wiped out
		// when we go readonly as this set becomes a DFA state.
		this.configLookup = new Set(hashATNConfig, equalATNConfigs);
		// Indicates that this configuration set is part of a full context
		// LL prediction. It will be used to determine how to merge $. With SLL
		// it's a wildcard whereas it is not for LL context merge.
		this.fullCtx = fullCtx === undefined ? true : fullCtx;
		// Indicates that the set of configurations is read-only. Do not
		// allow any code to manipulate the set; DFA states will point at
		// the sets and they must not change. This does not protect the other
		// fields; in particular, conflictingAlts is set after
		// we've made this readonly.
		this.readonly = false;
		// Track the elements as they are added to the set; supports get(i)///
		this.configs = [];
	
		// TODO: these fields make me pretty uncomfortable but nice to pack up info
		// together, saves recomputation
		// TODO: can we track conflicts as they are added to save scanning configs
		// later?
		this.uniqueAlt = 0;
		this.conflictingAlts = null;
	
		// Used in parser and lexer. In lexer, it indicates we hit a pred
		// while computing a closure operation. Don't make a DFA state from this.
		this.hasSemanticContext = false;
		this.dipsIntoOuterContext = false;
	
		this.cachedHashString = "-1";
	
		return this;
	}
	
	// Adding a new config means merging contexts with existing configs for
	// {@code (s, i, pi, _)}, where {@code s} is the
	// {@link ATNConfig//state}, {@code i} is the {@link ATNConfig//alt}, and
	// {@code pi} is the {@link ATNConfig//semanticContext}. We use
	// {@code (s,i,pi)} as key.
	//
	// <p>This method updates {@link //dipsIntoOuterContext} and
	// {@link //hasSemanticContext} when necessary.</p>
	// /
	ATNConfigSet.prototype.add = function(config, mergeCache) {
		if (mergeCache === undefined) {
			mergeCache = null;
		}
		if (this.readonly) {
			throw "This set is readonly";
		}
		if (config.semanticContext !== SemanticContext.NONE) {
			this.hasSemanticContext = true;
		}
		if (config.reachesIntoOuterContext > 0) {
			this.dipsIntoOuterContext = true;
		}
		var existing = this.configLookup.add(config);
		if (existing === config) {
			this.cachedHashString = "-1";
			this.configs.push(config); // track order here
			return true;
		}
		// a previous (s,i,pi,_), merge with it and save result
		var rootIsWildcard = !this.fullCtx;
		var merged = merge(existing.context, config.context, rootIsWildcard, mergeCache);
		// no need to check for existing.context, config.context in cache
		// since only way to create new graphs is "call rule" and here. We
		// cache at both places.
		existing.reachesIntoOuterContext = Math.max( existing.reachesIntoOuterContext, config.reachesIntoOuterContext);
		// make sure to preserve the precedence filter suppression during the merge
		if (config.precedenceFilterSuppressed) {
			existing.precedenceFilterSuppressed = true;
		}
		existing.context = merged; // replace context; no need to alt mapping
		return true;
	};
	
	ATNConfigSet.prototype.getStates = function() {
		var states = new Set();
		for (var i = 0; i < this.configs.length; i++) {
			states.add(this.configs[i].state);
		}
		return states;
	};
	
	ATNConfigSet.prototype.getPredicates = function() {
		var preds = [];
		for (var i = 0; i < this.configs.length; i++) {
			var c = this.configs[i].semanticContext;
			if (c !== SemanticContext.NONE) {
				preds.push(c.semanticContext);
			}
		}
		return preds;
	};
	
	Object.defineProperty(ATNConfigSet.prototype, "items", {
		get : function() {
			return this.configs;
		}
	});
	
	ATNConfigSet.prototype.optimizeConfigs = function(interpreter) {
		if (this.readonly) {
			throw "This set is readonly";
		}
		if (this.configLookup.length === 0) {
			return;
		}
		for (var i = 0; i < this.configs.length; i++) {
			var config = this.configs[i];
			config.context = interpreter.getCachedContext(config.context);
		}
	};
	
	ATNConfigSet.prototype.addAll = function(coll) {
		for (var i = 0; i < coll.length; i++) {
			this.add(coll[i]);
		}
		return false;
	};
	
	ATNConfigSet.prototype.equals = function(other) {
		if (this === other) {
			return true;
		} else if (!(other instanceof ATNConfigSet)) {
			return false;
		}
		return this.configs !== null && this.configs.equals(other.configs) &&
				this.fullCtx === other.fullCtx &&
				this.uniqueAlt === other.uniqueAlt &&
				this.conflictingAlts === other.conflictingAlts &&
				this.hasSemanticContext === other.hasSemanticContext &&
				this.dipsIntoOuterContext === other.dipsIntoOuterContext;
	};
	
	ATNConfigSet.prototype.hashString = function() {
		if (this.readonly) {
			if (this.cachedHashString === "-1") {
				this.cachedHashString = this.hashConfigs();
			}
			return this.cachedHashString;
		} else {
			return this.hashConfigs();
		}
	};
	
	ATNConfigSet.prototype.hashConfigs = function() {
		var s = "";
		this.configs.map(function(c) {
			s += c.toString();
		});
		return s;
	};
	
	Object.defineProperty(ATNConfigSet.prototype, "length", {
		get : function() {
			return this.configs.length;
		}
	});
	
	ATNConfigSet.prototype.isEmpty = function() {
		return this.configs.length === 0;
	};
	
	ATNConfigSet.prototype.contains = function(item) {
		if (this.configLookup === null) {
			throw "This method is not implemented for readonly sets.";
		}
		return this.configLookup.contains(item);
	};
	
	ATNConfigSet.prototype.containsFast = function(item) {
		if (this.configLookup === null) {
			throw "This method is not implemented for readonly sets.";
		}
		return this.configLookup.containsFast(item);
	};
	
	ATNConfigSet.prototype.clear = function() {
		if (this.readonly) {
			throw "This set is readonly";
		}
		this.configs = [];
		this.cachedHashString = "-1";
		this.configLookup = new Set();
	};
	
	ATNConfigSet.prototype.setReadonly = function(readonly) {
		this.readonly = readonly;
		if (readonly) {
			this.configLookup = null; // can't mod, no need for lookup cache
		}
	};
	
	ATNConfigSet.prototype.toString = function() {
		return Utils.arrayToString(this.configs) +
			(this.hasSemanticContext ? ",hasSemanticContext=" + this.hasSemanticContext : "") +
			(this.uniqueAlt !== ATN.INVALID_ALT_NUMBER ? ",uniqueAlt=" + this.uniqueAlt : "") +
			(this.conflictingAlts !== null ? ",conflictingAlts=" + this.conflictingAlts : "") +
			(this.dipsIntoOuterContext ? ",dipsIntoOuterContext" : "");
	};
	
	function OrderedATNConfigSet() {
		ATNConfigSet.call(this);
		this.configLookup = new Set();
		return this;
	}
	
	OrderedATNConfigSet.prototype = Object.create(ATNConfigSet.prototype);
	OrderedATNConfigSet.prototype.constructor = OrderedATNConfigSet;
	
	exports.ATNConfigSet = ATNConfigSet;
	exports.OrderedATNConfigSet = OrderedATNConfigSet;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	var ATNConfigSet = __webpack_require__(10).ATNConfigSet;
	
	// Map a predicate to a predicted alternative.///
	
	function PredPrediction(pred, alt) {
		this.alt = alt;
		this.pred = pred;
		return this;
	}
	
	PredPrediction.prototype.toString = function() {
		return "(" + this.pred + ", " + this.alt + ")";
	};
	
	// A DFA state represents a set of possible ATN configurations.
	// As Aho, Sethi, Ullman p. 117 says "The DFA uses its state
	// to keep track of all possible states the ATN can be in after
	// reading each input symbol. That is to say, after reading
	// input a1a2..an, the DFA is in a state that represents the
	// subset T of the states of the ATN that are reachable from the
	// ATN's start state along some path labeled a1a2..an."
	// In conventional NFA&rarr;DFA conversion, therefore, the subset T
	// would be a bitset representing the set of states the
	// ATN could be in. We need to track the alt predicted by each
	// state as well, however. More importantly, we need to maintain
	// a stack of states, tracking the closure operations as they
	// jump from rule to rule, emulating rule invocations (method calls).
	// I have to add a stack to simulate the proper lookahead sequences for
	// the underlying LL grammar from which the ATN was derived.
	//
	// <p>I use a set of ATNConfig objects not simple states. An ATNConfig
	// is both a state (ala normal conversion) and a RuleContext describing
	// the chain of rules (if any) followed to arrive at that state.</p>
	//
	// <p>A DFA state may have multiple references to a particular state,
	// but with different ATN contexts (with same or different alts)
	// meaning that state was reached via a different set of rule invocations.</p>
	// /
	
	function DFAState(stateNumber, configs) {
		if (stateNumber === null) {
			stateNumber = -1;
		}
		if (configs === null) {
			configs = new ATNConfigSet();
		}
		this.stateNumber = stateNumber;
		this.configs = configs;
		// {@code edges[symbol]} points to target of symbol. Shift up by 1 so (-1)
		// {@link Token//EOF} maps to {@code edges[0]}.
		this.edges = null;
		this.isAcceptState = false;
		// if accept state, what ttype do we match or alt do we predict?
		// This is set to {@link ATN//INVALID_ALT_NUMBER} when {@link
		// //predicates}{@code !=null} or
		// {@link //requiresFullContext}.
		this.prediction = 0;
		this.lexerActionExecutor = null;
		// Indicates that this state was created during SLL prediction that
		// discovered a conflict between the configurations in the state. Future
		// {@link ParserATNSimulator//execATN} invocations immediately jumped doing
		// full context prediction if this field is true.
		this.requiresFullContext = false;
		// During SLL parsing, this is a list of predicates associated with the
		// ATN configurations of the DFA state. When we have predicates,
		// {@link //requiresFullContext} is {@code false} since full context
		// prediction evaluates predicates
		// on-the-fly. If this is not null, then {@link //prediction} is
		// {@link ATN//INVALID_ALT_NUMBER}.
		//
		// <p>We only use these for non-{@link //requiresFullContext} but
		// conflicting states. That
		// means we know from the context (it's $ or we don't dip into outer
		// context) that it's an ambiguity not a conflict.</p>
		//
		// <p>This list is computed by {@link
		// ParserATNSimulator//predicateDFAState}.</p>
		this.predicates = null;
		return this;
	}
	
	// Get the set of all alts mentioned by all ATN configurations in this
	// DFA state.
	DFAState.prototype.getAltSet = function() {
		var alts = new Set();
		if (this.configs !== null) {
			for (var i = 0; i < this.configs.length; i++) {
				var c = this.configs[i];
				alts.add(c.alt);
			}
		}
		if (alts.length === 0) {
			return null;
		} else {
			return alts;
		}
	};
	
	// Two {@link DFAState} instances are equal if their ATN configuration sets
	// are the same. This method is used to see if a state already exists.
	//
	// <p>Because the number of alternatives and number of ATN configurations are
	// finite, there is a finite number of DFA states that can be processed.
	// This is necessary to show that the algorithm terminates.</p>
	//
	// <p>Cannot test the DFA state numbers here because in
	// {@link ParserATNSimulator//addDFAState} we need to know if any other state
	// exists that has this exact set of ATN configurations. The
	// {@link //stateNumber} is irrelevant.</p>
	DFAState.prototype.equals = function(other) {
		// compare set of ATN configurations in this set with other
		if (this === other) {
			return true;
		} else if (!(other instanceof DFAState)) {
			return false;
		} else {
			return this.configs.equals(other.configs);
		}
	};
	
	DFAState.prototype.toString = function() {
		return "" + this.stateNumber + ":" + this.hashString();
	};
	
	DFAState.prototype.hashString = function() {
		return "" +  this.configs +
				(this.isAcceptState ?
						"=>" + (this.predicates !== null ?
									this.predicates :
									this.prediction) :
						"");
	};
	
	exports.DFAState = DFAState;
	exports.PredPrediction = PredPrediction;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	
	// A tree structure used to record the semantic context in which
	//  an ATN configuration is valid.  It's either a single predicate,
	//  a conjunction {@code p1&&p2}, or a sum of products {@code p1||p2}.
	//
	//  <p>I have scoped the {@link AND}, {@link OR}, and {@link Predicate} subclasses of
	//  {@link SemanticContext} within the scope of this outer class.</p>
	//
	
	var Set = __webpack_require__(3).Set;
	
	function SemanticContext() {
		return this;
	}
	
	// For context independent predicates, we evaluate them without a local
	// context (i.e., null context). That way, we can evaluate them without
	// having to create proper rule-specific context during prediction (as
	// opposed to the parser, which creates them naturally). In a practical
	// sense, this avoids a cast exception from RuleContext to myruleContext.
	//
	// <p>For context dependent predicates, we must pass in a local context so that
	// references such as $arg evaluate properly as _localctx.arg. We only
	// capture context dependent predicates in the context in which we begin
	// prediction, so we passed in the outer context here in case of context
	// dependent predicate evaluation.</p>
	//
	SemanticContext.prototype.evaluate = function(parser, outerContext) {
	};
	
	//
	// Evaluate the precedence predicates for the context and reduce the result.
	//
	// @param parser The parser instance.
	// @param outerContext The current parser context object.
	// @return The simplified semantic context after precedence predicates are
	// evaluated, which will be one of the following values.
	// <ul>
	// <li>{@link //NONE}: if the predicate simplifies to {@code true} after
	// precedence predicates are evaluated.</li>
	// <li>{@code null}: if the predicate simplifies to {@code false} after
	// precedence predicates are evaluated.</li>
	// <li>{@code this}: if the semantic context is not changed as a result of
	// precedence predicate evaluation.</li>
	// <li>A non-{@code null} {@link SemanticContext}: the new simplified
	// semantic context after precedence predicates are evaluated.</li>
	// </ul>
	//
	SemanticContext.prototype.evalPrecedence = function(parser, outerContext) {
		return this;
	};
	
	SemanticContext.andContext = function(a, b) {
		if (a === null || a === SemanticContext.NONE) {
			return b;
		}
		if (b === null || b === SemanticContext.NONE) {
			return a;
		}
		var result = new AND(a, b);
		if (result.opnds.length === 1) {
			return result.opnds[0];
		} else {
			return result;
		}
	};
	
	SemanticContext.orContext = function(a, b) {
		if (a === null) {
			return b;
		}
		if (b === null) {
			return a;
		}
		if (a === SemanticContext.NONE || b === SemanticContext.NONE) {
			return SemanticContext.NONE;
		}
		var result = new OR(a, b);
		if (result.opnds.length === 1) {
			return result.opnds[0];
		} else {
			return result;
		}
	};
	
	function Predicate(ruleIndex, predIndex, isCtxDependent) {
		SemanticContext.call(this);
		this.ruleIndex = ruleIndex === undefined ? -1 : ruleIndex;
		this.predIndex = predIndex === undefined ? -1 : predIndex;
		this.isCtxDependent = isCtxDependent === undefined ? false : isCtxDependent; // e.g., $i ref in pred
		return this;
	}
	
	Predicate.prototype = Object.create(SemanticContext.prototype);
	Predicate.prototype.constructor = Predicate;
	
	//The default {@link SemanticContext}, which is semantically equivalent to
	//a predicate of the form {@code {true}?}.
	//
	SemanticContext.NONE = new Predicate();
	
	
	Predicate.prototype.evaluate = function(parser, outerContext) {
		var localctx = this.isCtxDependent ? outerContext : null;
		return parser.sempred(localctx, this.ruleIndex, this.predIndex);
	};
	
	Predicate.prototype.hashString = function() {
		return "" + this.ruleIndex + "/" + this.predIndex + "/" + this.isCtxDependent;
	};
	
	Predicate.prototype.equals = function(other) {
		if (this === other) {
			return true;
		} else if (!(other instanceof Predicate)) {
			return false;
		} else {
			return this.ruleIndex === other.ruleIndex &&
					this.predIndex === other.predIndex &&
					this.isCtxDependent === other.isCtxDependent;
		}
	};
	
	Predicate.prototype.toString = function() {
		return "{" + this.ruleIndex + ":" + this.predIndex + "}?";
	};
	
	function PrecedencePredicate(precedence) {
		SemanticContext.call(this);
		this.precedence = precedence === undefined ? 0 : precedence;
	}
	
	PrecedencePredicate.prototype = Object.create(SemanticContext.prototype);
	PrecedencePredicate.prototype.constructor = PrecedencePredicate;
	
	PrecedencePredicate.prototype.evaluate = function(parser, outerContext) {
		return parser.precpred(outerContext, this.precedence);
	};
	
	PrecedencePredicate.prototype.evalPrecedence = function(parser, outerContext) {
		if (parser.precpred(outerContext, this.precedence)) {
			return SemanticContext.NONE;
		} else {
			return null;
		}
	};
	
	PrecedencePredicate.prototype.compareTo = function(other) {
		return this.precedence - other.precedence;
	};
	
	PrecedencePredicate.prototype.hashString = function() {
		return "31";
	};
	
	PrecedencePredicate.prototype.equals = function(other) {
		if (this === other) {
			return true;
		} else if (!(other instanceof PrecedencePredicate)) {
			return false;
		} else {
			return this.precedence === other.precedence;
		}
	};
	
	PrecedencePredicate.prototype.toString = function() {
		return "{"+this.precedence+">=prec}?";
	};
	
	
	
	PrecedencePredicate.filterPrecedencePredicates = function(set) {
		var result = [];
		set.values().map( function(context) {
			if (context instanceof PrecedencePredicate) {
				result.push(context);
			}
		});
		return result;
	};
	
	
	// A semantic context which is true whenever none of the contained contexts
	// is false.
	//
	function AND(a, b) {
		SemanticContext.call(this);
		var operands = new Set();
		if (a instanceof AND) {
			a.opnds.map(function(o) {
				operands.add(o);
			});
		} else {
			operands.add(a);
		}
		if (b instanceof AND) {
			b.opnds.map(function(o) {
				operands.add(o);
			});
		} else {
			operands.add(b);
		}
		var precedencePredicates = PrecedencePredicate.filterPrecedencePredicates(operands);
		if (precedencePredicates.length > 0) {
			// interested in the transition with the lowest precedence
			var reduced = null;
			precedencePredicates.map( function(p) {
				if(reduced===null || p.precedence<reduced.precedence) {
					reduced = p;
				}
			});
			operands.add(reduced);
		}
		this.opnds = operands.values();
		return this;
	}
	
	AND.prototype = Object.create(SemanticContext.prototype);
	AND.prototype.constructor = AND;
	
	AND.prototype.equals = function(other) {
		if (this === other) {
			return true;
		} else if (!(other instanceof AND)) {
			return false;
		} else {
			return this.opnds === other.opnds;
		}
	};
	
	AND.prototype.hashString = function() {
		return "" + this.opnds + "/AND";
	};
	//
	// {@inheritDoc}
	//
	// <p>
	// The evaluation of predicates by this context is short-circuiting, but
	// unordered.</p>
	//
	AND.prototype.evaluate = function(parser, outerContext) {
		for (var i = 0; i < this.opnds.length; i++) {
			if (!this.opnds[i].evaluate(parser, outerContext)) {
				return false;
			}
		}
		return true;
	};
	
	AND.prototype.evalPrecedence = function(parser, outerContext) {
		var differs = false;
		var operands = [];
		for (var i = 0; i < this.opnds.length; i++) {
			var context = this.opnds[i];
			var evaluated = context.evalPrecedence(parser, outerContext);
			differs |= (evaluated !== context);
			if (evaluated === null) {
				// The AND context is false if any element is false
				return null;
			} else if (evaluated !== SemanticContext.NONE) {
				// Reduce the result by skipping true elements
				operands.push(evaluated);
			}
		}
		if (!differs) {
			return this;
		}
		if (operands.length === 0) {
			// all elements were true, so the AND context is true
			return SemanticContext.NONE;
		}
		var result = null;
		operands.map(function(o) {
			result = result === null ? o : SemanticPredicate.andContext(result, o);
		});
		return result;
	};
	
	AND.prototype.toString = function() {
		var s = "";
		this.opnds.map(function(o) {
			s += "&& " + o.toString();
		});
		return s.length > 3 ? s.slice(3) : s;
	};
	
	//
	// A semantic context which is true whenever at least one of the contained
	// contexts is true.
	//
	function OR(a, b) {
		SemanticContext.call(this);
		var operands = new Set();
		if (a instanceof OR) {
			a.opnds.map(function(o) {
				operands.add(o);
			});
		} else {
			operands.add(a);
		}
		if (b instanceof OR) {
			b.opnds.map(function(o) {
				operands.add(o);
			});
		} else {
			operands.add(b);
		}
	
		var precedencePredicates = PrecedencePredicate.filterPrecedencePredicates(operands);
		if (precedencePredicates.length > 0) {
			// interested in the transition with the highest precedence
			var s = precedencePredicates.sort(function(a, b) {
				return a.compareTo(b);
			});
			var reduced = s[s.length-1];
			operands.add(reduced);
		}
		this.opnds = operands.values();
		return this;
	}
	
	OR.prototype = Object.create(SemanticContext.prototype);
	OR.prototype.constructor = OR;
	
	OR.prototype.constructor = function(other) {
		if (this === other) {
			return true;
		} else if (!(other instanceof OR)) {
			return false;
		} else {
			return this.opnds === other.opnds;
		}
	};
	
	OR.prototype.hashString = function() {
		return "" + this.opnds + "/OR"; 
	};
	
	// <p>
	// The evaluation of predicates by this context is short-circuiting, but
	// unordered.</p>
	//
	OR.prototype.evaluate = function(parser, outerContext) {
		for (var i = 0; i < this.opnds.length; i++) {
			if (this.opnds[i].evaluate(parser, outerContext)) {
				return true;
			}
		}
		return false;
	};
	
	OR.prototype.evalPrecedence = function(parser, outerContext) {
		var differs = false;
		var operands = [];
		for (var i = 0; i < this.opnds.length; i++) {
			var context = this.opnds[i];
			var evaluated = context.evalPrecedence(parser, outerContext);
			differs |= (evaluated !== context);
			if (evaluated === SemanticContext.NONE) {
				// The OR context is true if any element is true
				return SemanticContext.NONE;
			} else if (evaluated !== null) {
				// Reduce the result by skipping false elements
				operands.push(evaluated);
			}
		}
		if (!differs) {
			return this;
		}
		if (operands.length === 0) {
			// all elements were false, so the OR context is false
			return null;
		}
		var result = null;
		operands.map(function(o) {
			return result === null ? o : SemanticContext.orContext(result, o);
		});
		return result;
	};
	
	AND.prototype.toString = function() {
		var s = "";
		this.opnds.map(function(o) {
			s += "|| " + o.toString();
		});
		return s.length > 3 ? s.slice(3) : s;
	};
	
	exports.SemanticContext = SemanticContext;
	exports.PrecedencePredicate = PrecedencePredicate;
	exports.Predicate = Predicate;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  this SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  this SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	// A lexer is recognizer that draws input symbols from a character stream.
	//  lexer grammars result in a subclass of this object. A Lexer object
	//  uses simplified match() and error recovery mechanisms in the interest
	//  of speed.
	///
	
	var Token = __webpack_require__(1).Token;
	var Recognizer = __webpack_require__(21).Recognizer;
	var CommonTokenFactory = __webpack_require__(30).CommonTokenFactory;
	var LexerNoViableAltException = __webpack_require__(5).LexerNoViableAltException;
	
	function TokenSource() {
		return this;
	}
	
	function Lexer(input) {
		Recognizer.call(this);
		this._input = input;
		this._factory = CommonTokenFactory.DEFAULT;
		this._tokenFactorySourcePair = [ this, input ];
	
		this._interp = null; // child classes must populate this
	
		// The goal of all lexer rules/methods is to create a token object.
		// this is an instance variable as multiple rules may collaborate to
		// create a single token. nextToken will return this object after
		// matching lexer rule(s). If you subclass to allow multiple token
		// emissions, then set this to the last token to be matched or
		// something nonnull so that the auto token emit mechanism will not
		// emit another token.
		this._token = null;
	
		// What character index in the stream did the current token start at?
		// Needed, for example, to get the text for current token. Set at
		// the start of nextToken.
		this._tokenStartCharIndex = -1;
	
		// The line on which the first character of the token resides///
		this._tokenStartLine = -1;
	
		// The character position of first character within the line///
		this._tokenStartColumn = -1;
	
		// Once we see EOF on char stream, next token will be EOF.
		// If you have DONE : EOF ; then you see DONE EOF.
		this._hitEOF = false;
	
		// The channel number for the current token///
		this._channel = Token.DEFAULT_CHANNEL;
	
		// The token type for the current token///
		this._type = Token.INVALID_TYPE;
	
		this._modeStack = [];
		this._mode = Lexer.DEFAULT_MODE;
	
		// You can set the text for the current token to override what is in
		// the input char buffer. Use setText() or can set this instance var.
		// /
		this._text = null;
	
		return this;
	}
	
	Lexer.prototype = Object.create(Recognizer.prototype);
	Lexer.prototype.constructor = Lexer;
	
	Lexer.DEFAULT_MODE = 0;
	Lexer.MORE = -2;
	Lexer.SKIP = -3;
	
	Lexer.DEFAULT_TOKEN_CHANNEL = Token.DEFAULT_CHANNEL;
	Lexer.HIDDEN = Token.HIDDEN_CHANNEL;
	Lexer.MIN_CHAR_VALUE = '\u0000';
	Lexer.MAX_CHAR_VALUE = '\uFFFE';
	
	Lexer.prototype.reset = function() {
		// wack Lexer state variables
		if (this._input !== null) {
			this._input.seek(0); // rewind the input
		}
		this._token = null;
		this._type = Token.INVALID_TYPE;
		this._channel = Token.DEFAULT_CHANNEL;
		this._tokenStartCharIndex = -1;
		this._tokenStartColumn = -1;
		this._tokenStartLine = -1;
		this._text = null;
	
		this._hitEOF = false;
		this._mode = Lexer.DEFAULT_MODE;
		this._modeStack = [];
	
		this._interp.reset();
	};
	
	// Return a token from this source; i.e., match a token on the char stream.
	Lexer.prototype.nextToken = function() {
		if (this._input === null) {
			throw "nextToken requires a non-null input stream.";
		}
	
		// Mark start location in char stream so unbuffered streams are
		// guaranteed at least have text of current token
		var tokenStartMarker = this._input.mark();
		try {
			while (true) {
				if (this._hitEOF) {
					this.emitEOF();
					return this._token;
				}
				this._token = null;
				this._channel = Token.DEFAULT_CHANNEL;
				this._tokenStartCharIndex = this._input.index;
				this._tokenStartColumn = this._interp.column;
				this._tokenStartLine = this._interp.line;
				this._text = null;
				var continueOuter = false;
				while (true) {
					this._type = Token.INVALID_TYPE;
					var ttype = Lexer.SKIP;
					try {
						ttype = this._interp.match(this._input, this._mode);
					} catch (e) {
						this.notifyListeners(e); // report error
						this.recover(e);
					}
					if (this._input.LA(1) === Token.EOF) {
						this._hitEOF = true;
					}
					if (this._type === Token.INVALID_TYPE) {
						this._type = ttype;
					}
					if (this._type === Lexer.SKIP) {
						continueOuter = true;
						break;
					}
					if (this._type !== Lexer.MORE) {
						break;
					}
				}
				if (continueOuter) {
					continue;
				}
				if (this._token === null) {
					this.emit();
				}
				return this._token;
			}
		} finally {
			// make sure we release marker after match or
			// unbuffered char stream will keep buffering
			this._input.release(tokenStartMarker);
		}
	};
	
	// Instruct the lexer to skip creating a token for current lexer rule
	// and look for another token. nextToken() knows to keep looking when
	// a lexer rule finishes with token set to SKIP_TOKEN. Recall that
	// if token==null at end of any token rule, it creates one for you
	// and emits it.
	// /
	Lexer.prototype.skip = function() {
		this._type = Lexer.SKIP;
	};
	
	Lexer.prototype.more = function() {
		this._type = Lexer.MORE;
	};
	
	Lexer.prototype.mode = function(m) {
		this._mode = m;
	};
	
	Lexer.prototype.pushMode = function(m) {
		if (this._interp.debug) {
			console.log("pushMode " + m);
		}
		this._modeStack.push(this._mode);
		this.mode(m);
	};
	
	Lexer.prototype.popMode = function() {
		if (this._modeStack.length === 0) {
			throw "Empty Stack";
		}
		if (this._interp.debug) {
			console.log("popMode back to " + this._modeStack.slice(0, -1));
		}
		this.mode(this._modeStack.pop());
		return this._mode;
	};
	
	// Set the char stream and reset the lexer
	Object.defineProperty(Lexer.prototype, "inputStream", {
		get : function() {
			return this._input;
		},
		set : function(input) {
			this._input = null;
			this._tokenFactorySourcePair = [ this, this._input ];
			this.reset();
			this._input = input;
			this._tokenFactorySourcePair = [ this, this._input ];
		}
	});
	
	Object.defineProperty(Lexer.prototype, "sourceName", {
		get : function sourceName() {
			return this._input.sourceName;
		}
	});
	
	// By default does not support multiple emits per nextToken invocation
	// for efficiency reasons. Subclass and override this method, nextToken,
	// and getToken (to push tokens into a list and pull from that list
	// rather than a single variable as this implementation does).
	// /
	Lexer.prototype.emitToken = function(token) {
		this._token = token;
	};
	
	// The standard method called to automatically emit a token at the
	// outermost lexical rule. The token object should point into the
	// char buffer start..stop. If there is a text override in 'text',
	// use that to set the token's text. Override this method to emit
	// custom Token objects or provide a new factory.
	// /
	Lexer.prototype.emit = function() {
		var t = this._factory.create(this._tokenFactorySourcePair, this._type,
				this._text, this._channel, this._tokenStartCharIndex, this
						.getCharIndex() - 1, this._tokenStartLine,
				this._tokenStartColumn);
		this.emitToken(t);
		return t;
	};
	
	Lexer.prototype.emitEOF = function() {
		var cpos = this.column;
		var lpos = this.line;
		var eof = this._factory.create(this._tokenFactorySourcePair, Token.EOF,
				null, Token.DEFAULT_CHANNEL, this._input.index,
				this._input.index - 1, lpos, cpos);
		this.emitToken(eof);
		return eof;
	};
	
	Object.defineProperty(Lexer.prototype, "type", {
		get : function() {
			return this.type;
		},
		set : function(type) {
			this._type = type;
		}
	});
	
	Object.defineProperty(Lexer.prototype, "line", {
		get : function() {
			return this._interp.line;
		},
		set : function(line) {
			this._interp.line = line;
		}
	});
	
	Object.defineProperty(Lexer.prototype, "column", {
		get : function() {
			return this._interp.column;
		},
		set : function(column) {
			this._interp.column = column;
		}
	});
	
	
	// What is the index of the current character of lookahead?///
	Lexer.prototype.getCharIndex = function() {
		return this._input.index;
	};
	
	// Return the text matched so far for the current token or any text override.
	//Set the complete text of this token; it wipes any previous changes to the text.
	Object.defineProperty(Lexer.prototype, "text", {
		get : function() {
			if (this._text !== null) {
				return this._text;
			} else {
				return this._interp.getText(this._input);
			}
		},
		set : function(text) {
			this._text = text;
		}
	});
	// Return a list of all Token objects in input char stream.
	// Forces load of all tokens. Does not include EOF token.
	// /
	Lexer.prototype.getAllTokens = function() {
		var tokens = [];
		var t = this.nextToken();
		while (t.type !== Token.EOF) {
			tokens.push(t);
			t = this.nextToken();
		}
		return tokens;
	};
	
	Lexer.prototype.notifyListeners = function(e) {
		var start = this._tokenStartCharIndex;
		var stop = this._input.index;
		var text = this._input.getText(start, stop);
		var msg = "token recognition error at: '" + this.getErrorDisplay(text) + "'";
		var listener = this.getErrorListenerDispatch();
		listener.syntaxError(this, null, this._tokenStartLine,
				this._tokenStartColumn, msg, e);
	};
	
	Lexer.prototype.getErrorDisplay = function(s) {
		var d = [];
		for (var i = 0; i < s.length; i++) {
			d.push(s[i]);
		}
		return d.join('');
	};
	
	Lexer.prototype.getErrorDisplayForChar = function(c) {
		if (c.charCodeAt(0) === Token.EOF) {
			return "<EOF>";
		} else if (c === '\n') {
			return "\\n";
		} else if (c === '\t') {
			return "\\t";
		} else if (c === '\r') {
			return "\\r";
		} else {
			return c;
		}
	};
	
	Lexer.prototype.getCharErrorDisplay = function(c) {
		return "'" + this.getErrorDisplayForChar(c) + "'";
	};
	
	// Lexers can normally match any char in it's vocabulary after matching
	// a token, so do the easy thing and just kill a character and hope
	// it all works out. You can instead use the rule invocation stack
	// to do sophisticated error recovery if you are in a fragment rule.
	// /
	Lexer.prototype.recover = function(re) {
		if (this._input.LA(1) !== Token.EOF) {
			if (re instanceof LexerNoViableAltException) {
				// skip a char and try again
				this._interp.consume(this._input);
			} else {
				// TODO: Do we lose character or line position information?
				this._input.consume();
			}
		}
	};
	
	exports.Lexer = Lexer;


/***/ },
/* 14 */
/***/ function(module, exports) {

	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	// A DFA walker that knows how to dump them to serialized strings.#/
	
	
	function DFASerializer(dfa, literalNames, symbolicNames) {
		this.dfa = dfa;
		this.literalNames = literalNames || [];
		this.symbolicNames = symbolicNames || [];
		return this;
	}
	
	DFASerializer.prototype.toString = function() {
	   if(this.dfa.s0 === null) {
	       return null;
	   }
	   var buf = "";
	   var states = this.dfa.sortedStates();
	   for(var i=0;i<states.length;i++) {
	       var s = states[i];
	       if(s.edges!==null) {
	            var n = s.edges.length;
	            for(var j=0;j<n;j++) {
	                var t = s.edges[j] || null;
	                if(t!==null && t.stateNumber !== 0x7FFFFFFF) {
	                    buf = buf.concat(this.getStateString(s));
	                    buf = buf.concat("-");
	                    buf = buf.concat(this.getEdgeLabel(j));
	                    buf = buf.concat("->");
	                    buf = buf.concat(this.getStateString(t));
	                    buf = buf.concat('\n');
	                }
	            }
	       }
	   }
	   return buf.length===0 ? null : buf;
	};
	
	DFASerializer.prototype.getEdgeLabel = function(i) {
	    if (i===0) {
	        return "EOF";
	    } else if(this.literalNames !==null || this.symbolicNames!==null) {
	        return this.literalNames[i-1] || this.symbolicNames[i-1];
	    } else {
	        return String.fromCharCode(i-1);
	    }
	};
	
	DFASerializer.prototype.getStateString = function(s) {
	    var baseStateStr = ( s.isAcceptState ? ":" : "") + "s" + s.stateNumber + ( s.requiresFullContext ? "^" : "");
	    if(s.isAcceptState) {
	        if (s.predicates !== null) {
	            return baseStateStr + "=>" + s.predicates.toString();
	        } else {
	            return baseStateStr + "=>" + s.prediction.toString();
	        }
	    } else {
	        return baseStateStr;
	    }
	};
	
	function LexerDFASerializer(dfa) {
		DFASerializer.call(this, dfa, null);
		return this;
	}
	
	LexerDFASerializer.prototype = Object.create(DFASerializer.prototype);
	LexerDFASerializer.prototype.constructor = LexerDFASerializer;
	
	LexerDFASerializer.prototype.getEdgeLabel = function(i) {
		return "'" + String.fromCharCode(i) + "'";
	};
	
	exports.DFASerializer = DFASerializer;
	exports.LexerDFASerializer = LexerDFASerializer;
	


/***/ },
/* 15 */
/***/ function(module, exports) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	// Provides an empty default implementation of {@link ANTLRErrorListener}. The
	// default implementation of each method does nothing, but can be overridden as
	// necessary.
	
	function ErrorListener() {
		return this;
	}
	
	ErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
	};
	
	ErrorListener.prototype.reportAmbiguity = function(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
	};
	
	ErrorListener.prototype.reportAttemptingFullContext = function(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
	};
	
	ErrorListener.prototype.reportContextSensitivity = function(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
	};
	
	function ConsoleErrorListener() {
		ErrorListener.call(this);
		return this;
	}
	
	ConsoleErrorListener.prototype = Object.create(ErrorListener.prototype);
	ConsoleErrorListener.prototype.constructor = ConsoleErrorListener;
	
	//
	// Provides a default instance of {@link ConsoleErrorListener}.
	//
	ConsoleErrorListener.INSTANCE = new ConsoleErrorListener();
	
	//
	// {@inheritDoc}
	//
	// <p>
	// This implementation prints messages to {@link System//err} containing the
	// values of {@code line}, {@code charPositionInLine}, and {@code msg} using
	// the following format.</p>
	//
	// <pre>
	// line <em>line</em>:<em>charPositionInLine</em> <em>msg</em>
	// </pre>
	//
	ConsoleErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
	    console.error("line " + line + ":" + column + " " + msg);
	};
	
	function ProxyErrorListener(delegates) {
		ErrorListener.call(this);
	    if (delegates===null) {
	        throw "delegates";
	    }
	    this.delegates = delegates;
		return this;
	}
	
	ProxyErrorListener.prototype = Object.create(ErrorListener.prototype);
	ProxyErrorListener.prototype.constructor = ProxyErrorListener;
	
	ProxyErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
	    this.delegates.map(function(d) { d.syntaxError(recognizer, offendingSymbol, line, column, msg, e); });
	};
	
	ProxyErrorListener.prototype.reportAmbiguity = function(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
	    this.delegates.map(function(d) { d.reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs); });
	};
	
	ProxyErrorListener.prototype.reportAttemptingFullContext = function(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
		this.delegates.map(function(d) { d.reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs); });
	};
	
	ProxyErrorListener.prototype.reportContextSensitivity = function(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
		this.delegates.map(function(d) { d.reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs); });
	};
	
	exports.ErrorListener = ErrorListener;
	exports.ConsoleErrorListener = ConsoleErrorListener;
	exports.ProxyErrorListener = ProxyErrorListener;
	


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	exports.atn = __webpack_require__(39);
	exports.dfa = __webpack_require__(41);
	exports.tree = __webpack_require__(45);
	exports.error = __webpack_require__(43);
	exports.Token = __webpack_require__(1).Token;
	exports.CommonToken = __webpack_require__(1).Token;
	exports.InputStream = __webpack_require__(20).InputStream;
	exports.FileStream = __webpack_require__(32).FileStream;
	exports.CommonTokenStream = __webpack_require__(31).CommonTokenStream;
	exports.Lexer = __webpack_require__(13).Lexer;
	exports.Parser = __webpack_require__(34).Parser;
	var pc = __webpack_require__(4);
	exports.PredictionContextCache = pc.PredictionContextCache;
	exports.ParserRuleContext = __webpack_require__(17).ParserRuleContext;
	exports.Interval = __webpack_require__(2).Interval;
	exports.Utils = __webpack_require__(3);


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	//* A rule invocation record for parsing.
	//
	//  Contains all of the information about the current rule not stored in the
	//  RuleContext. It handles parse tree children list, Any ATN state
	//  tracing, and the default values available for rule indications:
	//  start, stop, rule index, current alt number, current
	//  ATN state.
	//
	//  Subclasses made for each rule and grammar track the parameters,
	//  return values, locals, and labels specific to that rule. These
	//  are the objects that are returned from rules.
	//
	//  Note text is not an actual field of a rule return value; it is computed
	//  from start and stop using the input stream's toString() method.  I
	//  could add a ctor to this so that we can pass in and store the input
	//  stream, but I'm not sure we want to do that.  It would seem to be undefined
	//  to get the .text property anyway if the rule matches tokens from multiple
	//  input streams.
	//
	//  I do not use getters for fields of objects that are used simply to
	//  group values such as this aggregate.  The getters/setters are there to
	//  satisfy the superclass interface.
	
	var RuleContext = __webpack_require__(18).RuleContext;
	var Tree = __webpack_require__(6);
	var INVALID_INTERVAL = Tree.INVALID_INTERVAL;
	var TerminalNode = Tree.TerminalNode;
	var TerminalNodeImpl = Tree.TerminalNodeImpl;
	var ErrorNodeImpl = Tree.ErrorNodeImpl;
	var Interval = __webpack_require__(2).Interval;
	
	function ParserRuleContext(parent, invokingStateNumber) {
		parent = parent || null;
		invokingStateNumber = invokingStateNumber || null;
		RuleContext.call(this, parent, invokingStateNumber);
		this.ruleIndex = -1;
	    // * If we are debugging or building a parse tree for a visitor,
	    // we need to track all of the tokens and rule invocations associated
	    // with this rule's context. This is empty for parsing w/o tree constr.
	    // operation because we don't the need to track the details about
	    // how we parse this rule.
	    // /
	    this.children = null;
	    this.start = null;
	    this.stop = null;
	    // The exception that forced this rule to return. If the rule successfully
	    // completed, this is {@code null}.
	    this.exception = null;
	}
	
	ParserRuleContext.prototype = Object.create(RuleContext.prototype);
	ParserRuleContext.prototype.constructor = ParserRuleContext;
	
	// * COPY a ctx (I'm deliberately not using copy constructor)///
	ParserRuleContext.prototype.copyFrom = function(ctx) {
	    // from RuleContext
	    this.parentCtx = ctx.parentCtx;
	    this.invokingState = ctx.invokingState;
	    this.children = null;
	    this.start = ctx.start;
	    this.stop = ctx.stop;
	};
	
	// Double dispatch methods for listeners
	ParserRuleContext.prototype.enterRule = function(listener) {
	};
	
	ParserRuleContext.prototype.exitRule = function(listener) {
	};
	
	// * Does not set parent link; other add methods do that///
	ParserRuleContext.prototype.addChild = function(child) {
	    if (this.children === null) {
	        this.children = [];
	    }
	    this.children.push(child);
	    return child;
	};
	
	// * Used by enterOuterAlt to toss out a RuleContext previously added as
	// we entered a rule. If we have // label, we will need to remove
	// generic ruleContext object.
	// /
	ParserRuleContext.prototype.removeLastChild = function() {
	    if (this.children !== null) {
	        this.children.pop();
	    }
	};
	
	ParserRuleContext.prototype.addTokenNode = function(token) {
	    var node = new TerminalNodeImpl(token);
	    this.addChild(node);
	    node.parentCtx = this;
	    return node;
	};
	
	ParserRuleContext.prototype.addErrorNode = function(badToken) {
	    var node = new ErrorNodeImpl(badToken);
	    this.addChild(node);
	    node.parentCtx = this;
	    return node;
	};
	
	ParserRuleContext.prototype.getChild = function(i, type) {
		type = type || null;
		if (type === null) {
			return this.children.length>=i ? this.children[i] : null;
		} else {
			for(var j=0; j<this.children.length; j++) {
				var child = this.children[j];
				if(child instanceof type) {
					if(i===0) {
						return child;
					} else {
						i -= 1;
					}
				}
			}
			return null;
	    }
	};
	
	
	ParserRuleContext.prototype.getToken = function(ttype, i) {
		for(var j=0; j<this.children.length; j++) {
			var child = this.children[j];
			if (child instanceof TerminalNode) {
				if (child.symbol.type === ttype) {
					if(i===0) {
						return child;
					} else {
						i -= 1;
					}
				}
	        }
		}
	    return null;
	};
	
	ParserRuleContext.prototype.getTokens = function(ttype ) {
	    if (this.children=== null) {
	        return [];
	    } else {
			var tokens = [];
			for(var j=0; j<this.children.length; j++) {
				var child = this.children[j];
				if (child instanceof TerminalNode) {
					if (child.symbol.type === ttype) {
						tokens.push(child);
					}
				}
			}
			return tokens;
	    }
	};
	
	ParserRuleContext.prototype.getTypedRuleContext = function(ctxType, i) {
	    return this.getChild(i, ctxType);
	};
	
	ParserRuleContext.prototype.getTypedRuleContexts = function(ctxType) {
	    if (this.children=== null) {
	        return [];
	    } else {
			var contexts = [];
			for(var j=0; j<this.children.length; j++) {
				var child = this.children[j];
				if (child instanceof ctxType) {
					contexts.push(child);
				}
			}
			return contexts;
		}
	};
	
	ParserRuleContext.prototype.getChildCount = function() {
		if (this.children=== null) {
			return 0;
		} else {
			return this.children.length;
		}
	};
	
	ParserRuleContext.prototype.getSourceInterval = function() {
	    if( this.start === null || this.stop === null) {
	        return INVALID_INTERVAL;
	    } else {
	        return Interval(this.start.tokenIndex, this.stop.tokenIndex);
	    }
	};
	
	RuleContext.EMPTY = new ParserRuleContext();
	
	function InterpreterRuleContext(parent, invokingStateNumber, ruleIndex) {
		ParserRuleContext.call(parent, invokingStateNumber);
	    this.ruleIndex = ruleIndex;
	    return this;
	}
	
	InterpreterRuleContext.prototype = Object.create(ParserRuleContext.prototype);
	InterpreterRuleContext.prototype.constructor = InterpreterRuleContext;
	
	exports.ParserRuleContext = ParserRuleContext;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// [The "BSD license"]
	//  Copyright (c) 2013 Terence Parr
	//  Copyright (c) 2013 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	//  A rule context is a record of a single rule invocation. It knows
	//  which context invoked it, if any. If there is no parent context, then
	//  naturally the invoking state is not valid.  The parent link
	//  provides a chain upwards from the current rule invocation to the root
	//  of the invocation tree, forming a stack. We actually carry no
	//  information about the rule associated with this context (except
	//  when parsing). We keep only the state number of the invoking state from
	//  the ATN submachine that invoked this. Contrast this with the s
	//  pointer inside ParserRuleContext that tracks the current state
	//  being "executed" for the current rule.
	//
	//  The parent contexts are useful for computing lookahead sets and
	//  getting error information.
	//
	//  These objects are used during parsing and prediction.
	//  For the special case of parsers, we use the subclass
	//  ParserRuleContext.
	//
	//  @see ParserRuleContext
	///
	
	var RuleNode = __webpack_require__(6).RuleNode;
	var INVALID_INTERVAL = __webpack_require__(6).INVALID_INTERVAL;
	
	function RuleContext(parent, invokingState) {
		RuleNode.call(this);
		// What context invoked this rule?
		this.parentCtx = parent || null;
		// What state invoked the rule associated with this context?
		// The "return address" is the followState of invokingState
		// If parent is null, this should be -1.
		this.invokingState = invokingState || -1;
		return this;
	}
	
	RuleContext.prototype = Object.create(RuleNode.prototype);
	RuleContext.prototype.constructor = RuleContext;
	
	RuleContext.prototype.depth = function() {
		var n = 0;
		var p = this;
		while (p !== null) {
			p = p.parentCtx;
			n += 1;
		}
		return n;
	};
	
	// A context is empty if there is no invoking state; meaning nobody call
	// current context.
	RuleContext.prototype.isEmpty = function() {
		return this.invokingState === -1;
	};
	
	// satisfy the ParseTree / SyntaxTree interface
	
	RuleContext.prototype.getSourceInterval = function() {
		return INVALID_INTERVAL;
	};
	
	RuleContext.prototype.getRuleContext = function() {
		return this;
	};
	
	RuleContext.prototype.getPayload = function() {
		return this;
	};
	
	// Return the combined text of all child nodes. This method only considers
	// tokens which have been added to the parse tree.
	// <p>
	// Since tokens on hidden channels (e.g. whitespace or comments) are not
	// added to the parse trees, they will not appear in the output of this
	// method.
	// /
	RuleContext.prototype.getText = function() {
		if (this.getChildCount() === 0) {
			return "";
		} else {
			return this.children.map(function(child) {
				return child.getText();
			}).join("");
		}
	};
	
	RuleContext.prototype.getChild = function(i) {
		return null;
	};
	
	RuleContext.prototype.getChildCount = function() {
		return 0;
	};
	
	RuleContext.prototype.accept = function(visitor) {
		return visitor.visitChildren(this);
	};
	
	//need to manage circular dependencies, so export now
	exports.RuleContext = RuleContext;
	var Trees = __webpack_require__(44).Trees;
	
	
	// Print out a whole tree, not just a node, in LISP format
	// (root child1 .. childN). Print just a node if this is a leaf.
	//
	
	RuleContext.prototype.toStringTree = function(ruleNames, recog) {
		return Trees.toStringTree(this, ruleNames, recog);
	};
	
	RuleContext.prototype.toString = function(ruleNames, stop) {
		ruleNames = ruleNames || null;
		stop = stop || null;
		var p = this;
		var s = "[";
		while (p !== null && p !== stop) {
			if (ruleNames === null) {
				if (!p.isEmpty()) {
					s += p.invokingState;
				}
			} else {
				var ri = p.ruleIndex;
				var ruleName = (ri >= 0 && ri < ruleNames.length) ? ruleNames[ri]
						: "" + ri;
				s += ruleName;
			}
			if (p.parentCtx !== null && (ruleNames !== null || !p.parentCtx.isEmpty())) {
				s += " ";
			}
			p = p.parentCtx;
		}
		s += "]";
		return s;
	};
	


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	// A tuple: (ATN state, predicted alt, syntactic, semantic context).
	//  The syntactic context is a graph-structured stack node whose
	//  path(s) to the root is the rule invocation(s)
	//  chain used to arrive at the state.  The semantic context is
	//  the tree of semantic predicates encountered before reaching
	//  an ATN state.
	///
	
	var DecisionState = __webpack_require__(7).DecisionState;
	var SemanticContext = __webpack_require__(12).SemanticContext;
	
	function checkParams(params, isCfg) {
		if(params===null) {
			var result = { state:null, alt:null, context:null, semanticContext:null };
			if(isCfg) {
				result.reachesIntoOuterContext = 0;
			}
			return result;
		} else {
			var props = {};
			props.state = params.state || null;
			props.alt = params.alt || null;
			props.context = params.context || null;
			props.semanticContext = params.semanticContext || null;
			if(isCfg) {
				props.reachesIntoOuterContext = params.reachesIntoOuterContext || 0;
				props.precedenceFilterSuppressed = params.precedenceFilterSuppressed || false;
			}
			return props;
		}
	}
	
	function ATNConfig(params, config) {
		this.checkContext(params, config);
		params = checkParams(params);
		config = checkParams(config, true);
	    // The ATN state associated with this configuration///
	    this.state = params.state!==null ? params.state : config.state;
	    // What alt (or lexer rule) is predicted by this configuration///
	    this.alt = params.alt!==null ? params.alt : config.alt;
	    // The stack of invoking states leading to the rule/states associated
	    //  with this config.  We track only those contexts pushed during
	    //  execution of the ATN simulator.
	    this.context = params.context!==null ? params.context : config.context;
	    this.semanticContext = params.semanticContext!==null ? params.semanticContext :
	        (config.semanticContext!==null ? config.semanticContext : SemanticContext.NONE);
	    // We cannot execute predicates dependent upon local context unless
	    // we know for sure we are in the correct context. Because there is
	    // no way to do this efficiently, we simply cannot evaluate
	    // dependent predicates unless we are in the rule that initially
	    // invokes the ATN simulator.
	    //
	    // closure() tracks the depth of how far we dip into the
	    // outer context: depth &gt; 0.  Note that it may not be totally
	    // accurate depth since I don't ever decrement. TODO: make it a boolean then
	    this.reachesIntoOuterContext = config.reachesIntoOuterContext;
	    this.precedenceFilterSuppressed = config.precedenceFilterSuppressed;
	    return this;
	}
	
	ATNConfig.prototype.checkContext = function(params, config) {
		if((params.context===null || params.context===undefined) &&
				(config===null || config.context===null || config.context===undefined)) {
			this.context = null;
		}
	};
	
	// An ATN configuration is equal to another if both have
	//  the same state, they predict the same alternative, and
	//  syntactic/semantic contexts are the same.
	///
	ATNConfig.prototype.equals = function(other) {
	    if (this === other) {
	        return true;
	    } else if (! (other instanceof ATNConfig)) {
	        return false;
	    } else {
	        return this.state.stateNumber===other.state.stateNumber &&
	            this.alt===other.alt &&
	            (this.context===null ? other.context===null : this.context.equals(other.context)) &&
	            this.semanticContext.equals(other.semanticContext) &&
	            this.precedenceFilterSuppressed===other.precedenceFilterSuppressed;
	    }
	};
	
	ATNConfig.prototype.shortHashString = function() {
	    return "" + this.state.stateNumber + "/" + this.alt + "/" + this.semanticContext;
	};
	
	ATNConfig.prototype.hashString = function() {
	    return "" + this.state.stateNumber + "/" + this.alt + "/" +
	             (this.context===null ? "" : this.context.hashString()) +
	             "/" + this.semanticContext.hashString();
	};
	
	ATNConfig.prototype.toString = function() {
	    return "(" + this.state + "," + this.alt +
	        (this.context!==null ? ",[" + this.context.toString() + "]" : "") +
	        (this.semanticContext !== SemanticContext.NONE ?
	                ("," + this.semanticContext.toString())
	                : "") +
	        (this.reachesIntoOuterContext>0 ?
	                (",up=" + this.reachesIntoOuterContext)
	                : "") + ")";
	};
	
	
	function LexerATNConfig(params, config) {
		ATNConfig.call(this, params, config);
	    
	    // This is the backing field for {@link //getLexerActionExecutor}.
		var lexerActionExecutor = params.lexerActionExecutor || null;
	    this.lexerActionExecutor = lexerActionExecutor || (config!==null ? config.lexerActionExecutor : null);
	    this.passedThroughNonGreedyDecision = config!==null ? this.checkNonGreedyDecision(config, this.state) : false;
	    return this;
	}
	
	LexerATNConfig.prototype = Object.create(ATNConfig.prototype);
	LexerATNConfig.prototype.constructor = LexerATNConfig;
	
	LexerATNConfig.prototype.hashString = function() {
	    return "" + this.state.stateNumber + this.alt + this.context +
	            this.semanticContext + (this.passedThroughNonGreedyDecision ? 1 : 0) +
	            this.lexerActionExecutor;
	};
	
	LexerATNConfig.prototype.equals = function(other) {
	    if (this === other) {
	        return true;
	    } else if (!(other instanceof LexerATNConfig)) {
	        return false;
	    } else if (this.passedThroughNonGreedyDecision !== other.passedThroughNonGreedyDecision) {
	        return false;
	    } else if (this.lexerActionExecutor !== other.lexerActionExecutor) {
	        return false;
	    } else {
	        return ATNConfig.prototype.equals.call(this, other);
	    }
	};
	
	LexerATNConfig.prototype.checkNonGreedyDecision = function(source, target) {
	    return source.passedThroughNonGreedyDecision ||
	        (target instanceof DecisionState) && target.nonGreedy;
	};
	
	exports.ATNConfig = ATNConfig;
	exports.LexerATNConfig = LexerATNConfig;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// 
	//  [The "BSD license"]
	//   Copyright (c) 2012 Terence Parr
	//   Copyright (c) 2012 Sam Harwell
	//   Copyright (c) 2014 Eric Vergnaud
	//   All rights reserved.
	// 
	//   Redistribution and use in source and binary forms, with or without
	//   modification, are permitted provided that the following conditions
	//   are met:
	// 
	//   1. Redistributions of source code must retain the above copyright
	//      notice, this list of conditions and the following disclaimer.
	//   2. Redistributions in binary form must reproduce the above copyright
	//      notice, this list of conditions and the following disclaimer in the
	//      documentation and/or other materials provided with the distribution.
	//   3. The name of the author may not be used to endorse or promote products
	//      derived from this software without specific prior written permission.
	// 
	//   THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//   IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//   OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//   IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//   NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//   THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	// 
	
	var Token = __webpack_require__(1).Token;
	
	// Vacuum all input from a string and then treat it like a buffer.
	
	function _loadString(stream) {
		stream._index = 0;
		stream.data = [];
		for (var i = 0; i < stream.strdata.length; i++) {
			stream.data.push(stream.strdata.charCodeAt(i));
		}
		stream._size = stream.data.length;
	}
	
	function InputStream(data) {
		this.name = "<empty>";
		this.strdata = data;
		_loadString(this);
		return this;
	}
	
	Object.defineProperty(InputStream.prototype, "index", {
		get : function() {
			return this._index;
		}
	});
	
	Object.defineProperty(InputStream.prototype, "size", {
		get : function() {
			return this._size;
		}
	});
	
	// Reset the stream so that it's in the same state it was
	// when the object was created *except* the data array is not
	// touched.
	//
	InputStream.prototype.reset = function() {
		this._index = 0;
	};
	
	InputStream.prototype.consume = function() {
		if (this._index >= this._size) {
			// assert this.LA(1) == Token.EOF
			throw ("cannot consume EOF");
		}
		this._index += 1;
	};
	
	InputStream.prototype.LA = function(offset) {
		if (offset === 0) {
			return 0; // undefined
		}
		if (offset < 0) {
			offset += 1; // e.g., translate LA(-1) to use offset=0
		}
		var pos = this._index + offset - 1;
		if (pos < 0 || pos >= this._size) { // invalid
			return Token.EOF;
		}
		return this.data[pos];
	};
	
	InputStream.prototype.LT = function(offset) {
		return this.LA(offset);
	};
	
	// mark/release do nothing; we have entire buffer
	InputStream.prototype.mark = function() {
		return -1;
	};
	
	InputStream.prototype.release = function(marker) {
	};
	
	// consume() ahead until p==_index; can't just set p=_index as we must
	// update line and column. If we seek backwards, just set p
	//
	InputStream.prototype.seek = function(_index) {
		if (_index <= this._index) {
			this._index = _index; // just jump; don't update stream state (line,
									// ...)
			return;
		}
		// seek forward
		this._index = Math.min(_index, this._size);
	};
	
	InputStream.prototype.getText = function(start, stop) {
		if (stop >= this._size) {
			stop = this._size - 1;
		}
		if (start >= this._size) {
			return "";
		} else {
			return this.strdata.slice(start, stop + 1);
		}
	};
	
	InputStream.prototype.toString = function() {
		return this.strdata;
	};
	
	exports.InputStream = InputStream;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	
	var Token = __webpack_require__(1).Token;
	var ConsoleErrorListener = __webpack_require__(15).ConsoleErrorListener;
	var ProxyErrorListener = __webpack_require__(15).ProxyErrorListener;
	
	function Recognizer() {
	    this._listeners = [ ConsoleErrorListener.INSTANCE ];
	    this._interp = null;
	    this._stateNumber = -1;
	    return this;
	}
	
	Recognizer.tokenTypeMapCache = {};
	Recognizer.ruleIndexMapCache = {};
	
	
	Recognizer.prototype.checkVersion = function(toolVersion) {
	    var runtimeVersion = "4.5";
	    if (runtimeVersion!==toolVersion) {
	        console.log("ANTLR runtime and generated code versions disagree: "+runtimeVersion+"!="+toolVersion);
	    }
	};
	
	Recognizer.prototype.addErrorListener = function(listener) {
	    this._listeners.push(listener);
	};
	
	Recognizer.prototype.removeErrorListeners = function() {
	    this._listeners = [];
	};
	
	Recognizer.prototype.getTokenTypeMap = function() {
	    var tokenNames = this.getTokenNames();
	    if (tokenNames===null) {
	        throw("The current recognizer does not provide a list of token names.");
	    }
	    var result = this.tokenTypeMapCache[tokenNames];
	    if(result===undefined) {
	        result = tokenNames.reduce(function(o, k, i) { o[k] = i; });
	        result.EOF = Token.EOF;
	        this.tokenTypeMapCache[tokenNames] = result;
	    }
	    return result;
	};
	
	// Get a map from rule names to rule indexes.
	//
	// <p>Used for XPath and tree pattern compilation.</p>
	//
	Recognizer.prototype.getRuleIndexMap = function() {
	    var ruleNames = this.getRuleNames();
	    if (ruleNames===null) {
	        throw("The current recognizer does not provide a list of rule names.");
	    }
	    var result = this.ruleIndexMapCache[ruleNames];
	    if(result===undefined) {
	        result = ruleNames.reduce(function(o, k, i) { o[k] = i; });
	        this.ruleIndexMapCache[ruleNames] = result;
	    }
	    return result;
	};
	
	Recognizer.prototype.getTokenType = function(tokenName) {
	    var ttype = this.getTokenTypeMap()[tokenName];
	    if (ttype !==undefined) {
	        return ttype;
	    } else {
	        return Token.INVALID_TYPE;
	    }
	};
	
	
	// What is the error header, normally line/character position information?//
	Recognizer.prototype.getErrorHeader = function(e) {
	    var line = e.getOffendingToken().line;
	    var column = e.getOffendingToken().column;
	    return "line " + line + ":" + column;
	};
	
	
	// How should a token be displayed in an error message? The default
	//  is to display just the text, but during development you might
	//  want to have a lot of information spit out.  Override in that case
	//  to use t.toString() (which, for CommonToken, dumps everything about
	//  the token). This is better than forcing you to override a method in
	//  your token objects because you don't have to go modify your lexer
	//  so that it creates a new Java type.
	//
	// @deprecated This method is not called by the ANTLR 4 Runtime. Specific
	// implementations of {@link ANTLRErrorStrategy} may provide a similar
	// feature when necessary. For example, see
	// {@link DefaultErrorStrategy//getTokenErrorDisplay}.
	//
	Recognizer.prototype.getTokenErrorDisplay = function(t) {
	    if (t===null) {
	        return "<no token>";
	    }
	    var s = t.text;
	    if (s===null) {
	        if (t.type===Token.EOF) {
	            s = "<EOF>";
	        } else {
	            s = "<" + t.type + ">";
	        }
	    }
	    s = s.replace("\n","\\n").replace("\r","\\r").replace("\t","\\t");
	    return "'" + s + "'";
	};
	
	Recognizer.prototype.getErrorListenerDispatch = function() {
	    return new ProxyErrorListener(this._listeners);
	};
	
	// subclass needs to override these if there are sempreds or actions
	// that the ATN interp needs to execute
	Recognizer.prototype.sempred = function(localctx, ruleIndex, actionIndex) {
	    return true;
	};
	
	Recognizer.prototype.precpred = function(localctx , precedence) {
	    return true;
	};
	
	//Indicate that the recognizer has changed internal state that is
	//consistent with the ATN state passed in.  This way we always know
	//where we are in the ATN as the parser goes along. The rule
	//context objects form a stack that lets us see the stack of
	//invoking rules. Combine this and we have complete ATN
	//configuration information.
	
	Object.defineProperty(Recognizer.prototype, "state", {
		get : function() {
			return this._stateNumber;
		},
		set : function(state) {
			this._stateNumber = state;
		}
	});
	
	
	exports.Recognizer = Recognizer;


/***/ },
/* 22 */
/***/ function(module, exports) {

	//[The "BSD license"]
	// Copyright (c) 2013 Terence Parr
	// Copyright (c) 2013 Sam Harwell
	// Copyright (c) 2014 Eric Vergnaud
	// All rights reserved.
	//
	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions
	// are met:
	//
	// 1. Redistributions of source code must retain the above copyright
	//    notice, this list of conditions and the following disclaimer.
	// 2. Redistributions in binary form must reproduce the above copyright
	//    notice, this list of conditions and the following disclaimer in the
	//    documentation and/or other materials provided with the distribution.
	// 3. The name of the author may not be used to endorse or promote products
	//    derived from this software without specific prior written permission.
	//
	// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	// OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	// IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	// NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	function ATNDeserializationOptions(copyFrom) {
		if(copyFrom===undefined) {
			copyFrom = null;
		}
		this.readOnly = false;
	    this.verifyATN = copyFrom===null ? true : copyFrom.verifyATN;
	    this.generateRuleBypassTransitions = copyFrom===null ? false : copyFrom.generateRuleBypassTransitions;
	
	    return this;
	}
	
	ATNDeserializationOptions.defaultOptions = new ATNDeserializationOptions();
	ATNDeserializationOptions.defaultOptions.readOnly = true;
	
	//    def __setattr__(self, key, value):
	//        if key!="readOnly" and self.readOnly:
	//            raise Exception("The object is read only.")
	//        super(type(self), self).__setattr__(key,value)
	
	exports.ATNDeserializationOptions = ATNDeserializationOptions;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// [The "BSD license"]
	//  Copyright (c) 2013 Terence Parr
	//  Copyright (c) 2013 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	var Token = __webpack_require__(1).Token;
	var ATN = __webpack_require__(9).ATN;
	var ATNType = __webpack_require__(35).ATNType;
	var ATNStates = __webpack_require__(7);
	var ATNState = ATNStates.ATNState;
	var BasicState = ATNStates.BasicState;
	var DecisionState = ATNStates.DecisionState;
	var BlockStartState = ATNStates.BlockStartState;
	var BlockEndState = ATNStates.BlockEndState;
	var LoopEndState = ATNStates.LoopEndState;
	var RuleStartState = ATNStates.RuleStartState;
	var RuleStopState = ATNStates.RuleStopState;
	var TokensStartState = ATNStates.TokensStartState;
	var PlusLoopbackState = ATNStates.PlusLoopbackState;
	var StarLoopbackState = ATNStates.StarLoopbackState;
	var StarLoopEntryState = ATNStates.StarLoopEntryState;
	var PlusBlockStartState = ATNStates.PlusBlockStartState;
	var StarBlockStartState = ATNStates.StarBlockStartState;
	var BasicBlockStartState = ATNStates.BasicBlockStartState;
	var Transitions = __webpack_require__(8);
	var Transition = Transitions.Transition;
	var AtomTransition = Transitions.AtomTransition;
	var SetTransition = Transitions.SetTransition;
	var NotSetTransition = Transitions.NotSetTransition;
	var RuleTransition = Transitions.RuleTransition;
	var RangeTransition = Transitions.RangeTransition;
	var ActionTransition = Transitions.ActionTransition;
	var EpsilonTransition = Transitions.EpsilonTransition;
	var WildcardTransition = Transitions.WildcardTransition;
	var PredicateTransition = Transitions.PredicateTransition;
	var PrecedencePredicateTransition = Transitions.PrecedencePredicateTransition;
	var IntervalSet = __webpack_require__(2).IntervalSet;
	var Interval = __webpack_require__(2).Interval;
	var ATNDeserializationOptions = __webpack_require__(22).ATNDeserializationOptions;
	var LexerActions = __webpack_require__(25);
	var LexerActionType = LexerActions.LexerActionType;
	var LexerSkipAction = LexerActions.LexerSkipAction;
	var LexerChannelAction = LexerActions.LexerChannelAction;
	var LexerCustomAction = LexerActions.LexerCustomAction;
	var LexerMoreAction = LexerActions.LexerMoreAction;
	var LexerTypeAction = LexerActions.LexerTypeAction;
	var LexerPushModeAction = LexerActions.LexerPushModeAction;
	var LexerPopModeAction = LexerActions.LexerPopModeAction;
	var LexerModeAction = LexerActions.LexerModeAction;
	// This is the earliest supported serialized UUID.
	// stick to serialized version for now, we don't need a UUID instance
	var BASE_SERIALIZED_UUID = "AADB8D7E-AEEF-4415-AD2B-8204D6CF042E";
	
	// This list contains all of the currently supported UUIDs, ordered by when
	// the feature first appeared in this branch.
	var SUPPORTED_UUIDS = [ BASE_SERIALIZED_UUID ];
	
	var SERIALIZED_VERSION = 3;
	
	// This is the current serialized UUID.
	var SERIALIZED_UUID = BASE_SERIALIZED_UUID;
	
	function initArray( length, value) {
		var tmp = [];
		tmp[length-1] = value;
		return tmp.map(function(i) {return value;});
	}
	
	function ATNDeserializer (options) {
		
	    if ( options=== undefined || options === null ) {
	        options = ATNDeserializationOptions.defaultOptions;
	    }
	    this.deserializationOptions = options;
	    this.stateFactories = null;
	    this.actionFactories = null;
	    
	    return this;
	}
	
	// Determines if a particular serialized representation of an ATN supports
	// a particular feature, identified by the {@link UUID} used for serializing
	// the ATN at the time the feature was first introduced.
	//
	// @param feature The {@link UUID} marking the first time the feature was
	// supported in the serialized ATN.
	// @param actualUuid The {@link UUID} of the actual serialized ATN which is
	// currently being deserialized.
	// @return {@code true} if the {@code actualUuid} value represents a
	// serialized ATN at or after the feature identified by {@code feature} was
	// introduced; otherwise, {@code false}.
	
	ATNDeserializer.prototype.isFeatureSupported = function(feature, actualUuid) {
	    var idx1 = SUPPORTED_UUIDS.index(feature);
	    if (idx1<0) {
	        return false;
	    }
	    var idx2 = SUPPORTED_UUIDS.index(actualUuid);
	    return idx2 >= idx1;
	};
	
	ATNDeserializer.prototype.deserialize = function(data) {
	    this.reset(data);
	    this.checkVersion();
	    this.checkUUID();
	    var atn = this.readATN();
	    this.readStates(atn);
	    this.readRules(atn);
	    this.readModes(atn);
	    var sets = this.readSets(atn);
	    this.readEdges(atn, sets);
	    this.readDecisions(atn);
	    this.readLexerActions(atn);
	    this.markPrecedenceDecisions(atn);
	    this.verifyATN(atn);
	    if (this.deserializationOptions.generateRuleBypassTransitions && atn.grammarType === ATNType.PARSER ) {
	        this.generateRuleBypassTransitions(atn);
	        // re-verify after modification
	        this.verifyATN(atn);
	    }
	    return atn;
	};
	
	ATNDeserializer.prototype.reset = function(data) {
		var adjust = function(c) {
	        var v = c.charCodeAt(0);
	        return v>1  ? v-2 : -1;
		};
	    var temp = data.split("").map(adjust);
	    // don't adjust the first value since that's the version number
	    temp[0] = data.charCodeAt(0);
	    this.data = temp;
	    this.pos = 0;
	};
	
	ATNDeserializer.prototype.checkVersion = function() {
	    var version = this.readInt();
	    if ( version !== SERIALIZED_VERSION ) {
	        throw ("Could not deserialize ATN with version " + version + " (expected " + SERIALIZED_VERSION + ").");
	    }
	};
	
	ATNDeserializer.prototype.checkUUID = function() {
	    var uuid = this.readUUID();
	    if (SUPPORTED_UUIDS.indexOf(uuid)<0) {
	        throw ("Could not deserialize ATN with UUID: " + uuid +
	                        " (expected " + SERIALIZED_UUID + " or a legacy UUID).", uuid, SERIALIZED_UUID);
	    }
	    this.uuid = uuid;
	};
	
	ATNDeserializer.prototype.readATN = function() {
	    var grammarType = this.readInt();
	    var maxTokenType = this.readInt();
	    return new ATN(grammarType, maxTokenType);
	};
	
	ATNDeserializer.prototype.readStates = function(atn) {
		var j, pair, stateNumber;
	    var loopBackStateNumbers = [];
	    var endStateNumbers = [];
	    var nstates = this.readInt();
	    for(var i=0; i<nstates; i++) {
	        var stype = this.readInt();
	        // ignore bad type of states
	        if (stype===ATNState.INVALID_TYPE) {
	            atn.addState(null);
	            continue;
	        }
	        var ruleIndex = this.readInt();
	        if (ruleIndex === 0xFFFF) {
	            ruleIndex = -1;
	        }
	        var s = this.stateFactory(stype, ruleIndex);
	        if (stype === ATNState.LOOP_END) { // special case
	            var loopBackStateNumber = this.readInt();
	            loopBackStateNumbers.push([s, loopBackStateNumber]);
	        } else if(s instanceof BlockStartState) {
	            var endStateNumber = this.readInt();
	            endStateNumbers.push([s, endStateNumber]);
	        }
	        atn.addState(s);
	    }
	    // delay the assignment of loop back and end states until we know all the
		// state instances have been initialized
	    for (j=0; j<loopBackStateNumbers.length; j++) {
	        pair = loopBackStateNumbers[j];
	        pair[0].loopBackState = atn.states[pair[1]];
	    }
	
	    for (j=0; j<endStateNumbers.length; j++) {
	        pair = endStateNumbers[j];
	        pair[0].endState = atn.states[pair[1]];
	    }
	    
	    var numNonGreedyStates = this.readInt();
	    for (j=0; j<numNonGreedyStates; j++) {
	        stateNumber = this.readInt();
	        atn.states[stateNumber].nonGreedy = true;
	    }
	
	    var numPrecedenceStates = this.readInt();
	    for (j=0; j<numPrecedenceStates; j++) {
	        stateNumber = this.readInt();
	        atn.states[stateNumber].isPrecedenceRule = true;
	    }
	};
	
	ATNDeserializer.prototype.readRules = function(atn) {
	    var i;
	    var nrules = this.readInt();
	    if (atn.grammarType === ATNType.LEXER ) {
	        atn.ruleToTokenType = initArray(nrules, 0);
	    }
	    atn.ruleToStartState = initArray(nrules, 0);
	    for (i=0; i<nrules; i++) {
	        var s = this.readInt();
	        var startState = atn.states[s];
	        atn.ruleToStartState[i] = startState;
	        if ( atn.grammarType === ATNType.LEXER ) {
	            var tokenType = this.readInt();
	            if (tokenType === 0xFFFF) {
	                tokenType = Token.EOF;
	            }
	            atn.ruleToTokenType[i] = tokenType;
	        }
	    }
	    atn.ruleToStopState = initArray(nrules, 0);
	    for (i=0; i<atn.states.length; i++) {
	        var state = atn.states[i];
	        if (!(state instanceof RuleStopState)) {
	            continue;
	        }
	        atn.ruleToStopState[state.ruleIndex] = state;
	        atn.ruleToStartState[state.ruleIndex].stopState = state;
	    }
	};
	
	ATNDeserializer.prototype.readModes = function(atn) {
	    var nmodes = this.readInt();
	    for (var i=0; i<nmodes; i++) {
	        var s = this.readInt();
	        atn.modeToStartState.push(atn.states[s]);
	    }
	};
	
	ATNDeserializer.prototype.readSets = function(atn) {
	    var sets = [];
	    var m = this.readInt();
	    for (var i=0; i<m; i++) {
	        var iset = new IntervalSet();
	        sets.push(iset);
	        var n = this.readInt();
	        var containsEof = this.readInt();
	        if (containsEof!==0) {
	            iset.addOne(-1);
	        }
	        for (var j=0; j<n; j++) {
	            var i1 = this.readInt();
	            var i2 = this.readInt();
	            iset.addRange(i1, i2);
	        }
	    }
	    return sets;
	};
	
	ATNDeserializer.prototype.readEdges = function(atn, sets) {
		var i, j, state, trans, target;
	    var nedges = this.readInt();
	    for (i=0; i<nedges; i++) {
	        var src = this.readInt();
	        var trg = this.readInt();
	        var ttype = this.readInt();
	        var arg1 = this.readInt();
	        var arg2 = this.readInt();
	        var arg3 = this.readInt();
	        trans = this.edgeFactory(atn, ttype, src, trg, arg1, arg2, arg3, sets);
	        var srcState = atn.states[src];
	        srcState.addTransition(trans);
	    }
	    // edges for rule stop states can be derived, so they aren't serialized
	    for (i=0; i<atn.states.length; i++) {
	        state = atn.states[i];
	        for (j=0; j<state.transitions.length; j++) {
	            var t = state.transitions[j];
	            if (!(t instanceof RuleTransition)) {
	                continue;
	            }
				var outermostPrecedenceReturn = -1;
				if (atn.ruleToStartState[t.target.ruleIndex].isPrecedenceRule) {
					if (t.precedence === 0) {
						outermostPrecedenceReturn = t.target.ruleIndex;
					}
				}
	
				trans = new EpsilonTransition(t.followState, outermostPrecedenceReturn);
	            atn.ruleToStopState[t.target.ruleIndex].addTransition(trans);
	        }
	    }
	
	    for (i=0; i<atn.states.length; i++) {
	        state = atn.states[i];
	        if (state instanceof BlockStartState) {
	            // we need to know the end state to set its start state
	            if (state.endState === null) {
	                throw ("IllegalState");
	            }
	            // block end states can only be associated to a single block start
				// state
	            if ( state.endState.startState !== null) {
	                throw ("IllegalState");
	            }
	            state.endState.startState = state;
	        }
	        if (state instanceof PlusLoopbackState) {
	            for (j=0; j<state.transitions.length; j++) {
	                target = state.transitions[j].target;
	                if (target instanceof PlusBlockStartState) {
	                    target.loopBackState = state;
	                }
	            }
	        } else if (state instanceof StarLoopbackState) {
	            for (j=0; j<state.transitions.length; j++) {
	                target = state.transitions[j].target;
	                if (target instanceof StarLoopEntryState) {
	                    target.loopBackState = state;
	                }
	            }
	        }
	    }
	};
	
	ATNDeserializer.prototype.readDecisions = function(atn) {
	    var ndecisions = this.readInt();
	    for (var i=0; i<ndecisions; i++) {
	        var s = this.readInt();
	        var decState = atn.states[s];
	        atn.decisionToState.push(decState);
	        decState.decision = i;
	    }
	};
	
	ATNDeserializer.prototype.readLexerActions = function(atn) {
	    if (atn.grammarType === ATNType.LEXER) {
	        var count = this.readInt();
	        atn.lexerActions = initArray(count, null);
	        for (var i=0; i<count; i++) {
	            var actionType = this.readInt();
	            var data1 = this.readInt();
	            if (data1 === 0xFFFF) {
	                data1 = -1;
	            }
	            var data2 = this.readInt();
	            if (data2 === 0xFFFF) {
	                data2 = -1;
	            }
	            var lexerAction = this.lexerActionFactory(actionType, data1, data2);
	            atn.lexerActions[i] = lexerAction;
	        }
	    }
	};
	
	ATNDeserializer.prototype.generateRuleBypassTransitions = function(atn) {
		var i;
	    var count = atn.ruleToStartState.length;
	    for(i=0; i<count; i++) {
	        atn.ruleToTokenType[i] = atn.maxTokenType + i + 1;
	    }
	    for(i=0; i<count; i++) {
	        this.generateRuleBypassTransition(atn, i);
	    }
	};
	
	ATNDeserializer.prototype.generateRuleBypassTransition = function(atn, idx) {
		var i, state;
	    var bypassStart = new BasicBlockStartState();
	    bypassStart.ruleIndex = idx;
	    atn.addState(bypassStart);
	
	    var bypassStop = new BlockEndState();
	    bypassStop.ruleIndex = idx;
	    atn.addState(bypassStop);
	
	    bypassStart.endState = bypassStop;
	    atn.defineDecisionState(bypassStart);
	
	    bypassStop.startState = bypassStart;
	
	    var excludeTransition = null;
	    var endState = null;
	    
	    if (atn.ruleToStartState[idx].isPrecedenceRule) {
	        // wrap from the beginning of the rule to the StarLoopEntryState
	        endState = null;
	        for(i=0; i<atn.states.length; i++) {
	            state = atn.states[i];
	            if (this.stateIsEndStateFor(state, idx)) {
	                endState = state;
	                excludeTransition = state.loopBackState.transitions[0];
	                break;
	            }
	        }
	        if (excludeTransition === null) {
	            throw ("Couldn't identify final state of the precedence rule prefix section.");
	        }
	    } else {
	        endState = atn.ruleToStopState[idx];
	    }
	    
	    // all non-excluded transitions that currently target end state need to
		// target blockEnd instead
	    for(i=0; i<atn.states.length; i++) {
	        state = atn.states[i];
	        for(var j=0; j<state.transitions.length; j++) {
	            var transition = state.transitions[j];
	            if (transition === excludeTransition) {
	                continue;
	            }
	            if (transition.target === endState) {
	                transition.target = bypassStop;
	            }
	        }
	    }
	
	    // all transitions leaving the rule start state need to leave blockStart
		// instead
	    var ruleToStartState = atn.ruleToStartState[idx];
	    var count = ruleToStartState.transitions.length;
	    while ( count > 0) {
	        bypassStart.addTransition(ruleToStartState.transitions[count-1]);
	        ruleToStartState.transitions = ruleToStartState.transitions.slice(-1);
	    }
	    // link the new states
	    atn.ruleToStartState[idx].addTransition(new EpsilonTransition(bypassStart));
	    bypassStop.addTransition(new EpsilonTransition(endState));
	
	    var matchState = new BasicState();
	    atn.addState(matchState);
	    matchState.addTransition(new AtomTransition(bypassStop, atn.ruleToTokenType[idx]));
	    bypassStart.addTransition(new EpsilonTransition(matchState));
	};
	
	ATNDeserializer.prototype.stateIsEndStateFor = function(state, idx) {
	    if ( state.ruleIndex !== idx) {
	        return null;
	    }
	    if (!( state instanceof StarLoopEntryState)) {
	        return null;
	    }
	    var maybeLoopEndState = state.transitions[state.transitions.length - 1].target;
	    if (!( maybeLoopEndState instanceof LoopEndState)) {
	        return null;
	    }
	    if (maybeLoopEndState.epsilonOnlyTransitions &&
	        (maybeLoopEndState.transitions[0].target instanceof RuleStopState)) {
	        return state;
	    } else {
	        return null;
	    }
	};
	
	//
	// Analyze the {@link StarLoopEntryState} states in the specified ATN to set
	// the {@link StarLoopEntryState//precedenceRuleDecision} field to the
	// correct value.
	//
	// @param atn The ATN.
	//
	ATNDeserializer.prototype.markPrecedenceDecisions = function(atn) {
		for(var i=0; i<atn.states.length; i++) {
			var state = atn.states[i];
			if (!( state instanceof StarLoopEntryState)) {
	            continue;
	        }
	        // We analyze the ATN to determine if this ATN decision state is the
	        // decision for the closure block that determines whether a
	        // precedence rule should continue or complete.
	        //
	        if ( atn.ruleToStartState[state.ruleIndex].isPrecedenceRule) {
	            var maybeLoopEndState = state.transitions[state.transitions.length - 1].target;
	            if (maybeLoopEndState instanceof LoopEndState) {
	                if ( maybeLoopEndState.epsilonOnlyTransitions &&
	                        (maybeLoopEndState.transitions[0].target instanceof RuleStopState)) {
	                    state.precedenceRuleDecision = true;
	                }
	            }
	        }
		}
	};
	
	ATNDeserializer.prototype.verifyATN = function(atn) {
	    if (!this.deserializationOptions.verifyATN) {
	        return;
	    }
	    // verify assumptions
		for(var i=0; i<atn.states.length; i++) {
	        var state = atn.states[i];
	        if (state === null) {
	            continue;
	        }
	        this.checkCondition(state.epsilonOnlyTransitions || state.transitions.length <= 1);
	        if (state instanceof PlusBlockStartState) {
	            this.checkCondition(state.loopBackState !== null);
	        } else  if (state instanceof StarLoopEntryState) {
	            this.checkCondition(state.loopBackState !== null);
	            this.checkCondition(state.transitions.length === 2);
	            if (state.transitions[0].target instanceof StarBlockStartState) {
	                this.checkCondition(state.transitions[1].target instanceof LoopEndState);
	                this.checkCondition(!state.nonGreedy);
	            } else if (state.transitions[0].target instanceof LoopEndState) {
	                this.checkCondition(state.transitions[1].target instanceof StarBlockStartState);
	                this.checkCondition(state.nonGreedy);
	            } else {
	                throw("IllegalState");
	            }
	        } else if (state instanceof StarLoopbackState) {
	            this.checkCondition(state.transitions.length === 1);
	            this.checkCondition(state.transitions[0].target instanceof StarLoopEntryState);
	        } else if (state instanceof LoopEndState) {
	            this.checkCondition(state.loopBackState !== null);
	        } else if (state instanceof RuleStartState) {
	            this.checkCondition(state.stopState !== null);
	        } else if (state instanceof BlockStartState) {
	            this.checkCondition(state.endState !== null);
	        } else if (state instanceof BlockEndState) {
	            this.checkCondition(state.startState !== null);
	        } else if (state instanceof DecisionState) {
	            this.checkCondition(state.transitions.length <= 1 || state.decision >= 0);
	        } else {
	            this.checkCondition(state.transitions.length <= 1 || (state instanceof RuleStopState));
	        }
		}
	};
	
	ATNDeserializer.prototype.checkCondition = function(condition, message) {
	    if (!condition) {
	        if (message === undefined || message===null) {
	            message = "IllegalState";
	        }
	        throw (message);
	    }
	};
	
	ATNDeserializer.prototype.readInt = function() {
	    return this.data[this.pos++];
	};
	
	ATNDeserializer.prototype.readInt32 = function() {
	    var low = this.readInt();
	    var high = this.readInt();
	    return low | (high << 16);
	};
	
	ATNDeserializer.prototype.readLong = function() {
	    var low = this.readInt32();
	    var high = this.readInt32();
	    return (low & 0x00000000FFFFFFFF) | (high << 32);
	};
	
	function createByteToHex() {
		var bth = [];
		for (var i = 0; i < 256; i++) {
			bth[i] = (i + 0x100).toString(16).substr(1).toUpperCase();
		}
		return bth;
	}
	
	var byteToHex = createByteToHex();
		
	ATNDeserializer.prototype.readUUID = function() {
		var bb = [];
		for(var i=7;i>=0;i--) {
			var int = this.readInt();
			/* jshint bitwise: false */
			bb[(2*i)+1] = int & 0xFF;
			bb[2*i] = (int >> 8) & 0xFF;
		}
	    return byteToHex[bb[0]] + byteToHex[bb[1]] +
	    byteToHex[bb[2]] + byteToHex[bb[3]] + '-' +
	    byteToHex[bb[4]] + byteToHex[bb[5]] + '-' +
	    byteToHex[bb[6]] + byteToHex[bb[7]] + '-' +
	    byteToHex[bb[8]] + byteToHex[bb[9]] + '-' +
	    byteToHex[bb[10]] + byteToHex[bb[11]] +
	    byteToHex[bb[12]] + byteToHex[bb[13]] +
	    byteToHex[bb[14]] + byteToHex[bb[15]];
	};
	
	ATNDeserializer.prototype.edgeFactory = function(atn, type, src, trg, arg1, arg2, arg3, sets) {
	    var target = atn.states[trg];
	    switch(type) {
	    case Transition.EPSILON:
	        return new EpsilonTransition(target);
	    case Transition.RANGE:
	        return arg3 !== 0 ? new RangeTransition(target, Token.EOF, arg2) : new RangeTransition(target, arg1, arg2);
	    case Transition.RULE:
	        return new RuleTransition(atn.states[arg1], arg2, arg3, target);
	    case Transition.PREDICATE:
	        return new PredicateTransition(target, arg1, arg2, arg3 !== 0);
	    case Transition.PRECEDENCE:
	        return new PrecedencePredicateTransition(target, arg1);
	    case Transition.ATOM:
	        return arg3 !== 0 ? new AtomTransition(target, Token.EOF) : new AtomTransition(target, arg1);
	    case Transition.ACTION:
	        return new ActionTransition(target, arg1, arg2, arg3 !== 0);
	    case Transition.SET:
	        return new SetTransition(target, sets[arg1]);
	    case Transition.NOT_SET:
	        return new NotSetTransition(target, sets[arg1]);
	    case Transition.WILDCARD:
	        return new WildcardTransition(target);
	    default:
	        throw "The specified transition type: " + type + " is not valid.";
	    }
	};
	
	ATNDeserializer.prototype.stateFactory = function(type, ruleIndex) {
	    if (this.stateFactories === null) {
	        var sf = [];
	        sf[ATNState.INVALID_TYPE] = null;
	        sf[ATNState.BASIC] = function() { return new BasicState(); };
	        sf[ATNState.RULE_START] = function() { return new RuleStartState(); };
	        sf[ATNState.BLOCK_START] = function() { return new BasicBlockStartState(); };
	        sf[ATNState.PLUS_BLOCK_START] = function() { return new PlusBlockStartState(); };
	        sf[ATNState.STAR_BLOCK_START] = function() { return new StarBlockStartState(); };
	        sf[ATNState.TOKEN_START] = function() { return new TokensStartState(); };
	        sf[ATNState.RULE_STOP] = function() { return new RuleStopState(); };
	        sf[ATNState.BLOCK_END] = function() { return new BlockEndState(); };
	        sf[ATNState.STAR_LOOP_BACK] = function() { return new StarLoopbackState(); };
	        sf[ATNState.STAR_LOOP_ENTRY] = function() { return new StarLoopEntryState(); };
	        sf[ATNState.PLUS_LOOP_BACK] = function() { return new PlusLoopbackState(); };
	        sf[ATNState.LOOP_END] = function() { return new LoopEndState(); };
	        this.stateFactories = sf;
	    }
	    if (type>this.stateFactories.length || this.stateFactories[type] === null) {
	        throw("The specified state type " + type + " is not valid.");
	    } else {
	        var s = this.stateFactories[type]();
	        if (s!==null) {
	            s.ruleIndex = ruleIndex;
	            return s;
	        }
	    }
	};
	
	ATNDeserializer.prototype.lexerActionFactory = function(type, data1, data2) {
	    if (this.actionFactories === null) {
	        var af = [];
	        af[LexerActionType.CHANNEL] = function(data1, data2) { return new LexerChannelAction(data1); };
	        af[LexerActionType.CUSTOM] = function(data1, data2) { return new LexerCustomAction(data1, data2); };
	        af[LexerActionType.MODE] = function(data1, data2) { return new LexerModeAction(data1); };
	        af[LexerActionType.MORE] = function(data1, data2) { return LexerMoreAction.INSTANCE; };
	        af[LexerActionType.POP_MODE] = function(data1, data2) { return LexerPopModeAction.INSTANCE; };
	        af[LexerActionType.PUSH_MODE] = function(data1, data2) { return new LexerPushModeAction(data1); };
	        af[LexerActionType.SKIP] = function(data1, data2) { return LexerSkipAction.INSTANCE; };
	        af[LexerActionType.TYPE] = function(data1, data2) { return new LexerTypeAction(data1); };
	        this.actionFactories = af;
	    }
	    if (type>this.actionFactories.length || this.actionFactories[type] === null) {
	        throw("The specified lexer action type " + type + " is not valid.");
	    } else {
	        return this.actionFactories[type](data1, data2);
	    }
	};
	   
	
	exports.ATNDeserializer = ATNDeserializer;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2013 Terence Parr
	//  Copyright (c) 2013 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	var DFAState = __webpack_require__(11).DFAState;
	var ATNConfigSet = __webpack_require__(10).ATNConfigSet;
	var getCachedPredictionContext = __webpack_require__(4).getCachedPredictionContext;
	
	function ATNSimulator(atn, sharedContextCache) {
		
	    // The context cache maps all PredictionContext objects that are ==
	    //  to a single cached copy. This cache is shared across all contexts
	    //  in all ATNConfigs in all DFA states.  We rebuild each ATNConfigSet
	    //  to use only cached nodes/graphs in addDFAState(). We don't want to
	    //  fill this during closure() since there are lots of contexts that
	    //  pop up but are not used ever again. It also greatly slows down closure().
	    //
	    //  <p>This cache makes a huge difference in memory and a little bit in speed.
	    //  For the Java grammar on java.*, it dropped the memory requirements
	    //  at the end from 25M to 16M. We don't store any of the full context
	    //  graphs in the DFA because they are limited to local context only,
	    //  but apparently there's a lot of repetition there as well. We optimize
	    //  the config contexts before storing the config set in the DFA states
	    //  by literally rebuilding them with cached subgraphs only.</p>
	    //
	    //  <p>I tried a cache for use during closure operations, that was
	    //  whacked after each adaptivePredict(). It cost a little bit
	    //  more time I think and doesn't save on the overall footprint
	    //  so it's not worth the complexity.</p>
	    ///
	    this.atn = atn;
	    this.sharedContextCache = sharedContextCache;
	    return this;
	}
	
	// Must distinguish between missing edge and edge we know leads nowhere///
	ATNSimulator.ERROR = new DFAState(0x7FFFFFFF, new ATNConfigSet());
	
	
	ATNSimulator.prototype.getCachedContext = function(context) {
	    if (this.sharedContextCache ===null) {
	        return context;
	    }
	    var visited = {};
	    return getCachedPredictionContext(context, this.sharedContextCache, visited);
	};
	
	exports.ATNSimulator = ATNSimulator;


/***/ },
/* 25 */
/***/ function(module, exports) {

	//
	 //[The "BSD license"]
	 // Copyright (c) 2013 Terence Parr
	 // Copyright (c) 2013 Sam Harwell
	 // Copyright (c) 2014 Eric Vergnaud
	 // All rights reserved.
	 //
	 // Redistribution and use in source and binary forms, with or without
	 // modification, are permitted provided that the following conditions
	 // are met:
	 //
	 // 1. Redistributions of source code must retain the above copyright
	 //    notice, this list of conditions and the following disclaimer.
	 // 2. Redistributions in binary form must reproduce the above copyright
	 //    notice, this list of conditions and the following disclaimer in the
	 //    documentation and/or other materials provided with the distribution.
	 // 3. The name of the author may not be used to endorse or promote products
	 //    derived from this software without specific prior written permission.
	 //
	 // THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	 // IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	 // OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	 // IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	 // INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	 // NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 // DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 // THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 // (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	 // THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 //
	
	function LexerActionType() {
	}
	
	LexerActionType.CHANNEL = 0;     //The type of a {@link LexerChannelAction} action.
	LexerActionType.CUSTOM = 1;      //The type of a {@link LexerCustomAction} action.
	LexerActionType.MODE = 2;        //The type of a {@link LexerModeAction} action.
	LexerActionType.MORE = 3;        //The type of a {@link LexerMoreAction} action.
	LexerActionType.POP_MODE = 4;    //The type of a {@link LexerPopModeAction} action.
	LexerActionType.PUSH_MODE = 5;   //The type of a {@link LexerPushModeAction} action.
	LexerActionType.SKIP = 6;        //The type of a {@link LexerSkipAction} action.
	LexerActionType.TYPE = 7;        //The type of a {@link LexerTypeAction} action.
	
	function LexerAction(action) {
	    this.actionType = action;
	    this.isPositionDependent = false;
	    return this;
	}
	
	LexerAction.prototype.hashString = function() {
	    return "" + this.actionType;
	};
	
	LexerAction.prototype.equals = function(other) {
	    return this === other;
	};
	
	
	
	//
	// Implements the {@code skip} lexer action by calling {@link Lexer//skip}.
	//
	// <p>The {@code skip} command does not have any parameters, so this action is
	// implemented as a singleton instance exposed by {@link //INSTANCE}.</p>
	function LexerSkipAction() {
		LexerAction.call(this, LexerActionType.SKIP);
		return this;
	}
	
	LexerSkipAction.prototype = Object.create(LexerAction.prototype);
	LexerSkipAction.prototype.constructor = LexerSkipAction;
	
	// Provides a singleton instance of this parameterless lexer action.
	LexerSkipAction.INSTANCE = new LexerSkipAction();
	
	LexerSkipAction.prototype.execute = function(lexer) {
	    lexer.skip();
	};
	
	LexerSkipAction.prototype.toString = function() {
		return "skip";
	};
	
	//  Implements the {@code type} lexer action by calling {@link Lexer//setType}
	// with the assigned type.
	function LexerTypeAction(type) {
		LexerAction.call(this, LexerActionType.TYPE);
		this.type = type;
		return this;
	}
	
	LexerTypeAction.prototype = Object.create(LexerAction.prototype);
	LexerTypeAction.prototype.constructor = LexerTypeAction;
	
	LexerTypeAction.prototype.execute = function(lexer) {
	    lexer.type = this.type;
	};
	
	LexerTypeAction.prototype.hashString = function() {
		return "" + this.actionType + this.type;
	};
	
	
	LexerTypeAction.prototype.equals = function(other) {
	    if(this === other) {
	        return true;
	    } else if (! (other instanceof LexerTypeAction)) {
	        return false;
	    } else {
	        return this.type === other.type;
	    }
	};
	
	LexerTypeAction.prototype.toString = function() {
	    return "type(" + this.type + ")";
	};
	
	// Implements the {@code pushMode} lexer action by calling
	// {@link Lexer//pushMode} with the assigned mode.
	function LexerPushModeAction(mode) {
		LexerAction.call(this, LexerActionType.PUSH_MODE);
	    this.mode = mode;
	    return this;
	}
	
	LexerPushModeAction.prototype = Object.create(LexerAction.prototype);
	LexerPushModeAction.prototype.constructor = LexerPushModeAction;
	
	// <p>This action is implemented by calling {@link Lexer//pushMode} with the
	// value provided by {@link //getMode}.</p>
	LexerPushModeAction.prototype.execute = function(lexer) {
	    lexer.pushMode(this.mode);
	};
	
	LexerPushModeAction.prototype.hashString = function() {
	    return "" + this.actionType + this.mode;
	};
	
	LexerPushModeAction.prototype.equals = function(other) {
	    if (this === other) {
	        return true;
	    } else if (! (other instanceof LexerPushModeAction)) {
	        return false;
	    } else {
	        return this.mode === other.mode;
	    }
	};
	
	LexerPushModeAction.prototype.toString = function() {
		return "pushMode(" + this.mode + ")";
	};
	
	
	// Implements the {@code popMode} lexer action by calling {@link Lexer//popMode}.
	//
	// <p>The {@code popMode} command does not have any parameters, so this action is
	// implemented as a singleton instance exposed by {@link //INSTANCE}.</p>
	function LexerPopModeAction() {
		LexerAction.call(this,LexerActionType.POP_MODE);
		return this;
	}
	
	LexerPopModeAction.prototype = Object.create(LexerAction.prototype);
	LexerPopModeAction.prototype.constructor = LexerPopModeAction;
	
	LexerPopModeAction.INSTANCE = new LexerPopModeAction();
	
	// <p>This action is implemented by calling {@link Lexer//popMode}.</p>
	LexerPopModeAction.prototype.execute = function(lexer) {
	    lexer.popMode();
	};
	
	LexerPopModeAction.prototype.toString = function() {
		return "popMode";
	};
	
	// Implements the {@code more} lexer action by calling {@link Lexer//more}.
	//
	// <p>The {@code more} command does not have any parameters, so this action is
	// implemented as a singleton instance exposed by {@link //INSTANCE}.</p>
	function LexerMoreAction() {
		LexerAction.call(this, LexerActionType.MORE);
		return this;
	}
	
	LexerMoreAction.prototype = Object.create(LexerAction.prototype);
	LexerMoreAction.prototype.constructor = LexerMoreAction;
	
	LexerMoreAction.INSTANCE = new LexerMoreAction();
	
	// <p>This action is implemented by calling {@link Lexer//popMode}.</p>
	LexerMoreAction.prototype.execute = function(lexer) {
	    lexer.more();
	};
	
	LexerMoreAction.prototype.toString = function() {
	    return "more";
	};
	
	
	// Implements the {@code mode} lexer action by calling {@link Lexer//mode} with
	// the assigned mode.
	function LexerModeAction(mode) {
		LexerAction.call(this, LexerActionType.MODE);
	    this.mode = mode;
	    return this;
	}
	
	LexerModeAction.prototype = Object.create(LexerAction.prototype);
	LexerModeAction.prototype.constructor = LexerModeAction;
	
	// <p>This action is implemented by calling {@link Lexer//mode} with the
	// value provided by {@link //getMode}.</p>
	LexerModeAction.prototype.execute = function(lexer) {
	    lexer.mode(this.mode);
	};
	
	LexerModeAction.prototype.hashString = function() {
		return "" + this.actionType + this.mode;
	};
	
	LexerModeAction.prototype.equals = function(other) {
	    if (this === other) {
	        return true;
	    } else if (! (other instanceof LexerModeAction)) {
	        return false;
	    } else {
	        return this.mode === other.mode;
	    }
	};
	
	LexerModeAction.prototype.toString = function() {
	    return "mode(" + this.mode + ")";
	};
	
	// Executes a custom lexer action by calling {@link Recognizer//action} with the
	// rule and action indexes assigned to the custom action. The implementation of
	// a custom action is added to the generated code for the lexer in an override
	// of {@link Recognizer//action} when the grammar is compiled.
	//
	// <p>This class may represent embedded actions created with the <code>{...}</code>
	// syntax in ANTLR 4, as well as actions created for lexer commands where the
	// command argument could not be evaluated when the grammar was compiled.</p>
	
	
	    // Constructs a custom lexer action with the specified rule and action
	    // indexes.
	    //
	    // @param ruleIndex The rule index to use for calls to
	    // {@link Recognizer//action}.
	    // @param actionIndex The action index to use for calls to
	    // {@link Recognizer//action}.
	
	function LexerCustomAction(ruleIndex, actionIndex) {
		LexerAction.call(this, LexerActionType.CUSTOM);
	    this.ruleIndex = ruleIndex;
	    this.actionIndex = actionIndex;
	    this.isPositionDependent = true;
	    return this;
	}
	
	LexerCustomAction.prototype = Object.create(LexerAction.prototype);
	LexerCustomAction.prototype.constructor = LexerCustomAction;
	
	// <p>Custom actions are implemented by calling {@link Lexer//action} with the
	// appropriate rule and action indexes.</p>
	LexerCustomAction.prototype.execute = function(lexer) {
	    lexer.action(null, this.ruleIndex, this.actionIndex);
	};
	
	LexerCustomAction.prototype.hashString = function() {
	    return "" + this.actionType + this.ruleIndex + this.actionIndex;
	};
	
	LexerCustomAction.prototype.equals = function(other) {
	    if (this === other) {
	        return true;
	    } else if (! (other instanceof LexerCustomAction)) {
	        return false;
	    } else {
	        return this.ruleIndex === other.ruleIndex && this.actionIndex === other.actionIndex;
	    }
	};
	
	// Implements the {@code channel} lexer action by calling
	// {@link Lexer//setChannel} with the assigned channel.
	// Constructs a new {@code channel} action with the specified channel value.
	// @param channel The channel value to pass to {@link Lexer//setChannel}.
	function LexerChannelAction(channel) {
		LexerAction.call(this, LexerActionType.CHANNEL);
	    this.channel = channel;
	    return this;
	}
	
	LexerChannelAction.prototype = Object.create(LexerAction.prototype);
	LexerChannelAction.prototype.constructor = LexerChannelAction;
	
	// <p>This action is implemented by calling {@link Lexer//setChannel} with the
	// value provided by {@link //getChannel}.</p>
	LexerChannelAction.prototype.execute = function(lexer) {
	    lexer._channel = this.channel;
	};
	
	LexerChannelAction.prototype.hashString = function() {
	    return "" + this.actionType + this.channel;
	};
	
	LexerChannelAction.prototype.equals = function(other) {
	    if (this === other) {
	        return true;
	    } else if (! (other instanceof LexerChannelAction)) {
	        return false;
	    } else {
	        return this.channel === other.channel;
	    }
	};
	
	LexerChannelAction.prototype.toString = function() {
	    return "channel(" + this.channel + ")";
	};
	
	// This implementation of {@link LexerAction} is used for tracking input offsets
	// for position-dependent actions within a {@link LexerActionExecutor}.
	//
	// <p>This action is not serialized as part of the ATN, and is only required for
	// position-dependent lexer actions which appear at a location other than the
	// end of a rule. For more information about DFA optimizations employed for
	// lexer actions, see {@link LexerActionExecutor//append} and
	// {@link LexerActionExecutor//fixOffsetBeforeMatch}.</p>
	
	// Constructs a new indexed custom action by associating a character offset
	// with a {@link LexerAction}.
	//
	// <p>Note: This class is only required for lexer actions for which
	// {@link LexerAction//isPositionDependent} returns {@code true}.</p>
	//
	// @param offset The offset into the input {@link CharStream}, relative to
	// the token start index, at which the specified lexer action should be
	// executed.
	// @param action The lexer action to execute at a particular offset in the
	// input {@link CharStream}.
	function LexerIndexedCustomAction(offset, action) {
		LexerAction.call(this, action.actionType);
	    this.offset = offset;
	    this.action = action;
	    this.isPositionDependent = true;
	    return this;
	}
	
	LexerIndexedCustomAction.prototype = Object.create(LexerAction.prototype);
	LexerIndexedCustomAction.prototype.constructor = LexerIndexedCustomAction;
	
	// <p>This method calls {@link //execute} on the result of {@link //getAction}
	// using the provided {@code lexer}.</p>
	LexerIndexedCustomAction.prototype.execute = function(lexer) {
	    // assume the input stream position was properly set by the calling code
	    this.action.execute(lexer);
	};
	
	LexerIndexedCustomAction.prototype.hashString = function() {
	    return "" + this.actionType + this.offset + this.action;
	};
	
	LexerIndexedCustomAction.prototype.equals = function(other) {
	    if (this === other) {
	        return true;
	    } else if (! (other instanceof LexerIndexedCustomAction)) {
	        return false;
	    } else {
	        return this.offset === other.offset && this.action === other.action;
	    }
	};
	
	
	exports.LexerActionType = LexerActionType;
	exports.LexerSkipAction = LexerSkipAction;
	exports.LexerChannelAction = LexerChannelAction;
	exports.LexerCustomAction = LexerCustomAction;
	exports.LexerIndexedCustomAction = LexerIndexedCustomAction;
	exports.LexerMoreAction = LexerMoreAction;
	exports.LexerTypeAction = LexerTypeAction;
	exports.LexerPushModeAction = LexerPushModeAction;
	exports.LexerPopModeAction = LexerPopModeAction;
	exports.LexerModeAction = LexerModeAction;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	//
	// This enumeration defines the prediction modes available in ANTLR 4 along with
	// utility methods for analyzing configuration sets for conflicts and/or
	// ambiguities.
	
	var Set = __webpack_require__(3).Set;
	var BitSet = __webpack_require__(3).BitSet;
	var AltDict = __webpack_require__(3).AltDict;
	var ATN = __webpack_require__(9).ATN;
	var RuleStopState = __webpack_require__(7).RuleStopState;
	
	function PredictionMode() {
		return this;
	}
	
	//
	// The SLL(*) prediction mode. This prediction mode ignores the current
	// parser context when making predictions. This is the fastest prediction
	// mode, and provides correct results for many grammars. This prediction
	// mode is more powerful than the prediction mode provided by ANTLR 3, but
	// may result in syntax errors for grammar and input combinations which are
	// not SLL.
	//
	// <p>
	// When using this prediction mode, the parser will either return a correct
	// parse tree (i.e. the same parse tree that would be returned with the
	// {@link //LL} prediction mode), or it will report a syntax error. If a
	// syntax error is encountered when using the {@link //SLL} prediction mode,
	// it may be due to either an actual syntax error in the input or indicate
	// that the particular combination of grammar and input requires the more
	// powerful {@link //LL} prediction abilities to complete successfully.</p>
	//
	// <p>
	// This prediction mode does not provide any guarantees for prediction
	// behavior for syntactically-incorrect inputs.</p>
	//
	PredictionMode.SLL = 0;
	//
	// The LL(*) prediction mode. This prediction mode allows the current parser
	// context to be used for resolving SLL conflicts that occur during
	// prediction. This is the fastest prediction mode that guarantees correct
	// parse results for all combinations of grammars with syntactically correct
	// inputs.
	//
	// <p>
	// When using this prediction mode, the parser will make correct decisions
	// for all syntactically-correct grammar and input combinations. However, in
	// cases where the grammar is truly ambiguous this prediction mode might not
	// report a precise answer for <em>exactly which</em> alternatives are
	// ambiguous.</p>
	//
	// <p>
	// This prediction mode does not provide any guarantees for prediction
	// behavior for syntactically-incorrect inputs.</p>
	//
	PredictionMode.LL = 1;
	//
	// The LL(*) prediction mode with exact ambiguity detection. In addition to
	// the correctness guarantees provided by the {@link //LL} prediction mode,
	// this prediction mode instructs the prediction algorithm to determine the
	// complete and exact set of ambiguous alternatives for every ambiguous
	// decision encountered while parsing.
	//
	// <p>
	// This prediction mode may be used for diagnosing ambiguities during
	// grammar development. Due to the performance overhead of calculating sets
	// of ambiguous alternatives, this prediction mode should be avoided when
	// the exact results are not necessary.</p>
	//
	// <p>
	// This prediction mode does not provide any guarantees for prediction
	// behavior for syntactically-incorrect inputs.</p>
	//
	PredictionMode.LL_EXACT_AMBIG_DETECTION = 2;
	
	
	//
	// Computes the SLL prediction termination condition.
	//
	// <p>
	// This method computes the SLL prediction termination condition for both of
	// the following cases.</p>
	//
	// <ul>
	// <li>The usual SLL+LL fallback upon SLL conflict</li>
	// <li>Pure SLL without LL fallback</li>
	// </ul>
	//
	// <p><strong>COMBINED SLL+LL PARSING</strong></p>
	//
	// <p>When LL-fallback is enabled upon SLL conflict, correct predictions are
	// ensured regardless of how the termination condition is computed by this
	// method. Due to the substantially higher cost of LL prediction, the
	// prediction should only fall back to LL when the additional lookahead
	// cannot lead to a unique SLL prediction.</p>
	//
	// <p>Assuming combined SLL+LL parsing, an SLL configuration set with only
	// conflicting subsets should fall back to full LL, even if the
	// configuration sets don't resolve to the same alternative (e.g.
	// {@code {1,2}} and {@code {3,4}}. If there is at least one non-conflicting
	// configuration, SLL could continue with the hopes that more lookahead will
	// resolve via one of those non-conflicting configurations.</p>
	//
	// <p>Here's the prediction termination rule them: SLL (for SLL+LL parsing)
	// stops when it sees only conflicting configuration subsets. In contrast,
	// full LL keeps going when there is uncertainty.</p>
	//
	// <p><strong>HEURISTIC</strong></p>
	//
	// <p>As a heuristic, we stop prediction when we see any conflicting subset
	// unless we see a state that only has one alternative associated with it.
	// The single-alt-state thing lets prediction continue upon rules like
	// (otherwise, it would admit defeat too soon):</p>
	//
	// <p>{@code [12|1|[], 6|2|[], 12|2|[]]. s : (ID | ID ID?) ';' ;}</p>
	//
	// <p>When the ATN simulation reaches the state before {@code ';'}, it has a
	// DFA state that looks like: {@code [12|1|[], 6|2|[], 12|2|[]]}. Naturally
	// {@code 12|1|[]} and {@code 12|2|[]} conflict, but we cannot stop
	// processing this node because alternative to has another way to continue,
	// via {@code [6|2|[]]}.</p>
	//
	// <p>It also let's us continue for this rule:</p>
	//
	// <p>{@code [1|1|[], 1|2|[], 8|3|[]] a : A | A | A B ;}</p>
	//
	// <p>After matching input A, we reach the stop state for rule A, state 1.
	// State 8 is the state right before B. Clearly alternatives 1 and 2
	// conflict and no amount of further lookahead will separate the two.
	// However, alternative 3 will be able to continue and so we do not stop
	// working on this state. In the previous example, we're concerned with
	// states associated with the conflicting alternatives. Here alt 3 is not
	// associated with the conflicting configs, but since we can continue
	// looking for input reasonably, don't declare the state done.</p>
	//
	// <p><strong>PURE SLL PARSING</strong></p>
	//
	// <p>To handle pure SLL parsing, all we have to do is make sure that we
	// combine stack contexts for configurations that differ only by semantic
	// predicate. From there, we can do the usual SLL termination heuristic.</p>
	//
	// <p><strong>PREDICATES IN SLL+LL PARSING</strong></p>
	//
	// <p>SLL decisions don't evaluate predicates until after they reach DFA stop
	// states because they need to create the DFA cache that works in all
	// semantic situations. In contrast, full LL evaluates predicates collected
	// during start state computation so it can ignore predicates thereafter.
	// This means that SLL termination detection can totally ignore semantic
	// predicates.</p>
	//
	// <p>Implementation-wise, {@link ATNConfigSet} combines stack contexts but not
	// semantic predicate contexts so we might see two configurations like the
	// following.</p>
	//
	// <p>{@code (s, 1, x, {}), (s, 1, x', {p})}</p>
	//
	// <p>Before testing these configurations against others, we have to merge
	// {@code x} and {@code x'} (without modifying the existing configurations).
	// For example, we test {@code (x+x')==x''} when looking for conflicts in
	// the following configurations.</p>
	//
	// <p>{@code (s, 1, x, {}), (s, 1, x', {p}), (s, 2, x'', {})}</p>
	//
	// <p>If the configuration set has predicates (as indicated by
	// {@link ATNConfigSet//hasSemanticContext}), this algorithm makes a copy of
	// the configurations to strip out all of the predicates so that a standard
	// {@link ATNConfigSet} will merge everything ignoring predicates.</p>
	//
	PredictionMode.hasSLLConflictTerminatingPrediction = function( mode, configs) {
	    // Configs in rule stop states indicate reaching the end of the decision
	    // rule (local context) or end of start rule (full context). If all
	    // configs meet this condition, then none of the configurations is able
	    // to match additional input so we terminate prediction.
	    //
	    if (PredictionMode.allConfigsInRuleStopStates(configs)) {
	        return true;
	    }
	    // pure SLL mode parsing
	    if (mode === PredictionMode.SLL) {
	        // Don't bother with combining configs from different semantic
	        // contexts if we can fail over to full LL; costs more time
	        // since we'll often fail over anyway.
	        if (configs.hasSemanticContext) {
	            // dup configs, tossing out semantic predicates
	            var dup = new ATNConfigSet();
	            for(var i=0;i<configs.items.length;i++) {
	            	var c = configs.items[i];
	                c = new ATNConfig({semanticContext:SemanticContext.NONE}, c);
	                dup.add(c);
	            }
	            configs = dup;
	        }
	        // now we have combined contexts for configs with dissimilar preds
	    }
	    // pure SLL or combined SLL+LL mode parsing
	    var altsets = PredictionMode.getConflictingAltSubsets(configs);
	    return PredictionMode.hasConflictingAltSet(altsets) && !PredictionMode.hasStateAssociatedWithOneAlt(configs);
	};
	
	// Checks if any configuration in {@code configs} is in a
	// {@link RuleStopState}. Configurations meeting this condition have reached
	// the end of the decision rule (local context) or end of start rule (full
	// context).
	//
	// @param configs the configuration set to test
	// @return {@code true} if any configuration in {@code configs} is in a
	// {@link RuleStopState}, otherwise {@code false}
	PredictionMode.hasConfigInRuleStopState = function(configs) {
		for(var i=0;i<configs.items.length;i++) {
			var c = configs.items[i];
	        if (c.state instanceof RuleStopState) {
	            return true;
	        }
		}
	    return false;
	};
	
	// Checks if all configurations in {@code configs} are in a
	// {@link RuleStopState}. Configurations meeting this condition have reached
	// the end of the decision rule (local context) or end of start rule (full
	// context).
	//
	// @param configs the configuration set to test
	// @return {@code true} if all configurations in {@code configs} are in a
	// {@link RuleStopState}, otherwise {@code false}
	PredictionMode.allConfigsInRuleStopStates = function(configs) {
		for(var i=0;i<configs.items.length;i++) {
			var c = configs.items[i];
	        if (!(c.state instanceof RuleStopState)) {
	            return false;
	        }
		}
	    return true;
	};
	
	//
	// Full LL prediction termination.
	//
	// <p>Can we stop looking ahead during ATN simulation or is there some
	// uncertainty as to which alternative we will ultimately pick, after
	// consuming more input? Even if there are partial conflicts, we might know
	// that everything is going to resolve to the same minimum alternative. That
	// means we can stop since no more lookahead will change that fact. On the
	// other hand, there might be multiple conflicts that resolve to different
	// minimums. That means we need more look ahead to decide which of those
	// alternatives we should predict.</p>
	//
	// <p>The basic idea is to split the set of configurations {@code C}, into
	// conflicting subsets {@code (s, _, ctx, _)} and singleton subsets with
	// non-conflicting configurations. Two configurations conflict if they have
	// identical {@link ATNConfig//state} and {@link ATNConfig//context} values
	// but different {@link ATNConfig//alt} value, e.g. {@code (s, i, ctx, _)}
	// and {@code (s, j, ctx, _)} for {@code i!=j}.</p>
	//
	// <p>Reduce these configuration subsets to the set of possible alternatives.
	// You can compute the alternative subsets in one pass as follows:</p>
	//
	// <p>{@code A_s,ctx = {i | (s, i, ctx, _)}} for each configuration in
	// {@code C} holding {@code s} and {@code ctx} fixed.</p>
	//
	// <p>Or in pseudo-code, for each configuration {@code c} in {@code C}:</p>
	//
	// <pre>
	// map[c] U= c.{@link ATNConfig//alt alt} // map hash/equals uses s and x, not
	// alt and not pred
	// </pre>
	//
	// <p>The values in {@code map} are the set of {@code A_s,ctx} sets.</p>
	//
	// <p>If {@code |A_s,ctx|=1} then there is no conflict associated with
	// {@code s} and {@code ctx}.</p>
	//
	// <p>Reduce the subsets to singletons by choosing a minimum of each subset. If
	// the union of these alternative subsets is a singleton, then no amount of
	// more lookahead will help us. We will always pick that alternative. If,
	// however, there is more than one alternative, then we are uncertain which
	// alternative to predict and must continue looking for resolution. We may
	// or may not discover an ambiguity in the future, even if there are no
	// conflicting subsets this round.</p>
	//
	// <p>The biggest sin is to terminate early because it means we've made a
	// decision but were uncertain as to the eventual outcome. We haven't used
	// enough lookahead. On the other hand, announcing a conflict too late is no
	// big deal; you will still have the conflict. It's just inefficient. It
	// might even look until the end of file.</p>
	//
	// <p>No special consideration for semantic predicates is required because
	// predicates are evaluated on-the-fly for full LL prediction, ensuring that
	// no configuration contains a semantic context during the termination
	// check.</p>
	//
	// <p><strong>CONFLICTING CONFIGS</strong></p>
	//
	// <p>Two configurations {@code (s, i, x)} and {@code (s, j, x')}, conflict
	// when {@code i!=j} but {@code x=x'}. Because we merge all
	// {@code (s, i, _)} configurations together, that means that there are at
	// most {@code n} configurations associated with state {@code s} for
	// {@code n} possible alternatives in the decision. The merged stacks
	// complicate the comparison of configuration contexts {@code x} and
	// {@code x'}. Sam checks to see if one is a subset of the other by calling
	// merge and checking to see if the merged result is either {@code x} or
	// {@code x'}. If the {@code x} associated with lowest alternative {@code i}
	// is the superset, then {@code i} is the only possible prediction since the
	// others resolve to {@code min(i)} as well. However, if {@code x} is
	// associated with {@code j>i} then at least one stack configuration for
	// {@code j} is not in conflict with alternative {@code i}. The algorithm
	// should keep going, looking for more lookahead due to the uncertainty.</p>
	//
	// <p>For simplicity, I'm doing a equality check between {@code x} and
	// {@code x'} that lets the algorithm continue to consume lookahead longer
	// than necessary. The reason I like the equality is of course the
	// simplicity but also because that is the test you need to detect the
	// alternatives that are actually in conflict.</p>
	//
	// <p><strong>CONTINUE/STOP RULE</strong></p>
	//
	// <p>Continue if union of resolved alternative sets from non-conflicting and
	// conflicting alternative subsets has more than one alternative. We are
	// uncertain about which alternative to predict.</p>
	//
	// <p>The complete set of alternatives, {@code [i for (_,i,_)]}, tells us which
	// alternatives are still in the running for the amount of input we've
	// consumed at this point. The conflicting sets let us to strip away
	// configurations that won't lead to more states because we resolve
	// conflicts to the configuration with a minimum alternate for the
	// conflicting set.</p>
	//
	// <p><strong>CASES</strong></p>
	//
	// <ul>
	//
	// <li>no conflicts and more than 1 alternative in set =&gt; continue</li>
	//
	// <li> {@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s, 3, z)},
	// {@code (s', 1, y)}, {@code (s', 2, y)} yields non-conflicting set
	// {@code {3}} U conflicting sets {@code min({1,2})} U {@code min({1,2})} =
	// {@code {1,3}} =&gt; continue
	// </li>
	//
	// <li>{@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s', 1, y)},
	// {@code (s', 2, y)}, {@code (s'', 1, z)} yields non-conflicting set
	// {@code {1}} U conflicting sets {@code min({1,2})} U {@code min({1,2})} =
	// {@code {1}} =&gt; stop and predict 1</li>
	//
	// <li>{@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s', 1, y)},
	// {@code (s', 2, y)} yields conflicting, reduced sets {@code {1}} U
	// {@code {1}} = {@code {1}} =&gt; stop and predict 1, can announce
	// ambiguity {@code {1,2}}</li>
	//
	// <li>{@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s', 2, y)},
	// {@code (s', 3, y)} yields conflicting, reduced sets {@code {1}} U
	// {@code {2}} = {@code {1,2}} =&gt; continue</li>
	//
	// <li>{@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s', 3, y)},
	// {@code (s', 4, y)} yields conflicting, reduced sets {@code {1}} U
	// {@code {3}} = {@code {1,3}} =&gt; continue</li>
	//
	// </ul>
	//
	// <p><strong>EXACT AMBIGUITY DETECTION</strong></p>
	//
	// <p>If all states report the same conflicting set of alternatives, then we
	// know we have the exact ambiguity set.</p>
	//
	// <p><code>|A_<em>i</em>|&gt;1</code> and
	// <code>A_<em>i</em> = A_<em>j</em></code> for all <em>i</em>, <em>j</em>.</p>
	//
	// <p>In other words, we continue examining lookahead until all {@code A_i}
	// have more than one alternative and all {@code A_i} are the same. If
	// {@code A={{1,2}, {1,3}}}, then regular LL prediction would terminate
	// because the resolved set is {@code {1}}. To determine what the real
	// ambiguity is, we have to know whether the ambiguity is between one and
	// two or one and three so we keep going. We can only stop prediction when
	// we need exact ambiguity detection when the sets look like
	// {@code A={{1,2}}} or {@code {{1,2},{1,2}}}, etc...</p>
	//
	PredictionMode.resolvesToJustOneViableAlt = function(altsets) {
	    return PredictionMode.getSingleViableAlt(altsets);
	};
	
	//
	// Determines if every alternative subset in {@code altsets} contains more
	// than one alternative.
	//
	// @param altsets a collection of alternative subsets
	// @return {@code true} if every {@link BitSet} in {@code altsets} has
	// {@link BitSet//cardinality cardinality} &gt; 1, otherwise {@code false}
	//
	PredictionMode.allSubsetsConflict = function(altsets) {
	    return ! PredictionMode.hasNonConflictingAltSet(altsets);
	};
	//
	// Determines if any single alternative subset in {@code altsets} contains
	// exactly one alternative.
	//
	// @param altsets a collection of alternative subsets
	// @return {@code true} if {@code altsets} contains a {@link BitSet} with
	// {@link BitSet//cardinality cardinality} 1, otherwise {@code false}
	//
	PredictionMode.hasNonConflictingAltSet = function(altsets) {
		for(var i=0;i<altsets.length;i++) {
			var alts = altsets[i];
	        if (alts.length===1) {
	            return true;
	        }
		}
	    return false;
	};
	
	//
	// Determines if any single alternative subset in {@code altsets} contains
	// more than one alternative.
	//
	// @param altsets a collection of alternative subsets
	// @return {@code true} if {@code altsets} contains a {@link BitSet} with
	// {@link BitSet//cardinality cardinality} &gt; 1, otherwise {@code false}
	//
	PredictionMode.hasConflictingAltSet = function(altsets) {
		for(var i=0;i<altsets.length;i++) {
			var alts = altsets[i];
	        if (alts.length>1) {
	            return true;
	        }
		}
	    return false;
	};
	
	//
	// Determines if every alternative subset in {@code altsets} is equivalent.
	//
	// @param altsets a collection of alternative subsets
	// @return {@code true} if every member of {@code altsets} is equal to the
	// others, otherwise {@code false}
	//
	PredictionMode.allSubsetsEqual = function(altsets) {
	    var first = null;
		for(var i=0;i<altsets.length;i++) {
			var alts = altsets[i];
	        if (first === null) {
	            first = alts;
	        } else if (alts!==first) {
	            return false;
	        }
		}
	    return true;
	};
	
	//
	// Returns the unique alternative predicted by all alternative subsets in
	// {@code altsets}. If no such alternative exists, this method returns
	// {@link ATN//INVALID_ALT_NUMBER}.
	//
	// @param altsets a collection of alternative subsets
	//
	PredictionMode.getUniqueAlt = function(altsets) {
	    var all = PredictionMode.getAlts(altsets);
	    if (all.length===1) {
	        return all.minValue();
	    } else {
	        return ATN.INVALID_ALT_NUMBER;
	    }
	};
	
	// Gets the complete set of represented alternatives for a collection of
	// alternative subsets. This method returns the union of each {@link BitSet}
	// in {@code altsets}.
	//
	// @param altsets a collection of alternative subsets
	// @return the set of represented alternatives in {@code altsets}
	//
	PredictionMode.getAlts = function(altsets) {
	    var all = new BitSet();
	    altsets.map( function(alts) { all.or(alts); });
	    return all;
	};
	
	//
	// This function gets the conflicting alt subsets from a configuration set.
	// For each configuration {@code c} in {@code configs}:
	//
	// <pre>
	// map[c] U= c.{@link ATNConfig//alt alt} // map hash/equals uses s and x, not
	// alt and not pred
	// </pre>
	//
	PredictionMode.getConflictingAltSubsets = function(configs) {
	    var configToAlts = {};
		for(var i=0;i<configs.items.length;i++) {
			var c = configs.items[i];
	        var key = "key_" + c.state.stateNumber + "/" + c.context;
	        var alts = configToAlts[key] || null;
	        if (alts === null) {
	            alts = new BitSet();
	            configToAlts[key] = alts;
	        }
	        alts.add(c.alt);
		}
		var values = [];
		for(var k in configToAlts) {
			if(k.indexOf("key_")!==0) {
				continue;
			}
			values.push(configToAlts[k]);
		}
	    return values;
	};
	
	//
	// Get a map from state to alt subset from a configuration set. For each
	// configuration {@code c} in {@code configs}:
	//
	// <pre>
	// map[c.{@link ATNConfig//state state}] U= c.{@link ATNConfig//alt alt}
	// </pre>
	//
	PredictionMode.getStateToAltMap = function(configs) {
	    var m = new AltDict();
	    configs.items.map(function(c) {
	        var alts = m.get(c.state);
	        if (alts === null) {
	            alts = new BitSet();
	            m.put(c.state, alts);
	        }
	        alts.add(c.alt);
	    });
	    return m;
	};
	
	PredictionMode.hasStateAssociatedWithOneAlt = function(configs) {
	    var values = PredictionMode.getStateToAltMap(configs).values();
	    for(var i=0;i<values.length;i++) {
	        if (values[i].length===1) {
	            return true;
	        }
	    }
	    return false;
	};
	
	PredictionMode.getSingleViableAlt = function(altsets) {
	    var result = null;
		for(var i=0;i<altsets.length;i++) {
			var alts = altsets[i];
	        var minAlt = alts.minValue();
	        if(result===null) {
	            result = minAlt;
	        } else if(result!==minAlt) { // more than 1 viable alt
	            return ATN.INVALID_ALT_NUMBER;
	        }
		}
	    return result;
	};
	
	exports.PredictionMode = PredictionMode;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	
	var Token = __webpack_require__(1).Token;
	var Errors = __webpack_require__(5);
	var NoViableAltException = Errors.NoViableAltException;
	var InputMismatchException = Errors.InputMismatchException;
	var FailedPredicateException = Errors.FailedPredicateException;
	var ParseCancellationException = Errors.ParseCancellationException;
	var ATNState = __webpack_require__(7).ATNState;
	var Interval = __webpack_require__(2).Interval;
	var IntervalSet = __webpack_require__(2).IntervalSet;
	
	function ErrorStrategy() {
		
	}
	
	ErrorStrategy.prototype.reset = function(recognizer){
	};
	
	ErrorStrategy.prototype.recoverInline = function(recognizer){
	};
	
	ErrorStrategy.prototype.recover = function(recognizer, e){
	};
	
	ErrorStrategy.prototype.sync = function(recognizer){
	};
	
	ErrorStrategy.prototype.inErrorRecoveryMode = function(recognizer){
	};
	
	ErrorStrategy.prototype.reportError = function(recognizer){
	};
	
	
	
	// This is the default implementation of {@link ANTLRErrorStrategy} used for
	// error reporting and recovery in ANTLR parsers.
	//
	function DefaultErrorStrategy() {
		ErrorStrategy.call(this);
	    // Indicates whether the error strategy is currently "recovering from an
	    // error". This is used to suppress reporting multiple error messages while
	    // attempting to recover from a detected syntax error.
	    //
	    // @see //inErrorRecoveryMode
	    //
	    this.errorRecoveryMode = false;
	
	    // The index into the input stream where the last error occurred.
	    // This is used to prevent infinite loops where an error is found
	    // but no token is consumed during recovery...another error is found,
	    // ad nauseum. This is a failsafe mechanism to guarantee that at least
	    // one token/tree node is consumed for two errors.
	    //
	    this.lastErrorIndex = -1;
	    this.lastErrorStates = null;
	    return this;
	}
	
	DefaultErrorStrategy.prototype = Object.create(ErrorStrategy.prototype);
	DefaultErrorStrategy.prototype.constructor = DefaultErrorStrategy;
	
	// <p>The default implementation simply calls {@link //endErrorCondition} to
	// ensure that the handler is not in error recovery mode.</p>
	DefaultErrorStrategy.prototype.reset = function(recognizer) {
	    this.endErrorCondition(recognizer);
	};
	
	//
	// This method is called to enter error recovery mode when a recognition
	// exception is reported.
	//
	// @param recognizer the parser instance
	//
	DefaultErrorStrategy.prototype.beginErrorCondition = function(recognizer) {
	    this.errorRecoveryMode = true;
	};
	
	DefaultErrorStrategy.prototype.inErrorRecoveryMode = function(recognizer) {
	    return this.errorRecoveryMode;
	};
	
	//
	// This method is called to leave error recovery mode after recovering from
	// a recognition exception.
	//
	// @param recognizer
	//
	DefaultErrorStrategy.prototype.endErrorCondition = function(recognizer) {
	    this.errorRecoveryMode = false;
	    this.lastErrorStates = null;
	    this.lastErrorIndex = -1;
	};
	
	//
	// {@inheritDoc}
	//
	// <p>The default implementation simply calls {@link //endErrorCondition}.</p>
	//
	DefaultErrorStrategy.prototype.reportMatch = function(recognizer) {
	    this.endErrorCondition(recognizer);
	};
	
	//
	// {@inheritDoc}
	//
	// <p>The default implementation returns immediately if the handler is already
	// in error recovery mode. Otherwise, it calls {@link //beginErrorCondition}
	// and dispatches the reporting task based on the runtime type of {@code e}
	// according to the following table.</p>
	//
	// <ul>
	// <li>{@link NoViableAltException}: Dispatches the call to
	// {@link //reportNoViableAlternative}</li>
	// <li>{@link InputMismatchException}: Dispatches the call to
	// {@link //reportInputMismatch}</li>
	// <li>{@link FailedPredicateException}: Dispatches the call to
	// {@link //reportFailedPredicate}</li>
	// <li>All other types: calls {@link Parser//notifyErrorListeners} to report
	// the exception</li>
	// </ul>
	//
	DefaultErrorStrategy.prototype.reportError = function(recognizer, e) {
	   // if we've already reported an error and have not matched a token
	   // yet successfully, don't report any errors.
	    if(this.inErrorRecoveryMode(recognizer)) {
	        return; // don't report spurious errors
	    }
	    this.beginErrorCondition(recognizer);
	    if ( e instanceof NoViableAltException ) {
	        this.reportNoViableAlternative(recognizer, e);
	    } else if ( e instanceof InputMismatchException ) {
	        this.reportInputMismatch(recognizer, e);
	    } else if ( e instanceof FailedPredicateException ) {
	        this.reportFailedPredicate(recognizer, e);
	    } else {
	        console.log("unknown recognition error type: " + e.constructor.name);
	        console.log(e.stack);
	        recognizer.notifyErrorListeners(e.getOffendingToken(), e.getMessage(), e);
	    }
	};
	//
	// {@inheritDoc}
	//
	// <p>The default implementation resynchronizes the parser by consuming tokens
	// until we find one in the resynchronization set--loosely the set of tokens
	// that can follow the current rule.</p>
	//
	DefaultErrorStrategy.prototype.recover = function(recognizer, e) {
	    if (this.lastErrorIndex===recognizer.getInputStream().index &&
	        this.lastErrorStates !== null && this.lastErrorStates.indexOf(recognizer.state)>=0) {
			// uh oh, another error at same token index and previously-visited
			// state in ATN; must be a case where LT(1) is in the recovery
			// token set so nothing got consumed. Consume a single token
			// at least to prevent an infinite loop; this is a failsafe.
			recognizer.consume();
	    }
	    this.lastErrorIndex = recognizer._input.index;
	    if (this.lastErrorStates === null) {
	        this.lastErrorStates = [];
	    }
	    this.lastErrorStates.push(recognizer.state);
	    var followSet = this.getErrorRecoverySet(recognizer);
	    this.consumeUntil(recognizer, followSet);
	};
	
	// The default implementation of {@link ANTLRErrorStrategy//sync} makes sure
	// that the current lookahead symbol is consistent with what were expecting
	// at this point in the ATN. You can call this anytime but ANTLR only
	// generates code to check before subrules/loops and each iteration.
	//
	// <p>Implements Jim Idle's magic sync mechanism in closures and optional
	// subrules. E.g.,</p>
	//
	// <pre>
	// a : sync ( stuff sync )* ;
	// sync : {consume to what can follow sync} ;
	// </pre>
	//
	// At the start of a sub rule upon error, {@link //sync} performs single
	// token deletion, if possible. If it can't do that, it bails on the current
	// rule and uses the default error recovery, which consumes until the
	// resynchronization set of the current rule.
	//
	// <p>If the sub rule is optional ({@code (...)?}, {@code (...)*}, or block
	// with an empty alternative), then the expected set includes what follows
	// the subrule.</p>
	//
	// <p>During loop iteration, it consumes until it sees a token that can start a
	// sub rule or what follows loop. Yes, that is pretty aggressive. We opt to
	// stay in the loop as long as possible.</p>
	//
	// <p><strong>ORIGINS</strong></p>
	//
	// <p>Previous versions of ANTLR did a poor job of their recovery within loops.
	// A single mismatch token or missing token would force the parser to bail
	// out of the entire rules surrounding the loop. So, for rule</p>
	//
	// <pre>
	// classDef : 'class' ID '{' member* '}'
	// </pre>
	//
	// input with an extra token between members would force the parser to
	// consume until it found the next class definition rather than the next
	// member definition of the current class.
	//
	// <p>This functionality cost a little bit of effort because the parser has to
	// compare token set at the start of the loop and at each iteration. If for
	// some reason speed is suffering for you, you can turn off this
	// functionality by simply overriding this method as a blank { }.</p>
	//
	DefaultErrorStrategy.prototype.sync = function(recognizer) {
	    // If already recovering, don't try to sync
	    if (this.inErrorRecoveryMode(recognizer)) {
	        return;
	    }
	    var s = recognizer._interp.atn.states[recognizer.state];
	    var la = recognizer.getTokenStream().LA(1);
	    // try cheaper subset first; might get lucky. seems to shave a wee bit off
	    if (la===Token.EOF || recognizer.atn.nextTokens(s).contains(la)) {
	        return;
	    }
	    // Return but don't end recovery. only do that upon valid token match
	    if(recognizer.isExpectedToken(la)) {
	        return;
	    }
	    switch (s.stateType) {
	    case ATNState.BLOCK_START:
	    case ATNState.STAR_BLOCK_START:
	    case ATNState.PLUS_BLOCK_START:
	    case ATNState.STAR_LOOP_ENTRY:
	       // report error and recover if possible
	        if( this.singleTokenDeletion(recognizer) !== null) {
	            return;
	        } else {
	            throw new InputMismatchException(recognizer);
	        }
	        break;
	    case ATNState.PLUS_LOOP_BACK:
	    case ATNState.STAR_LOOP_BACK:
	        this.reportUnwantedToken(recognizer);
	        var expecting = recognizer.getExpectedTokens();
	        var whatFollowsLoopIterationOrRule = expecting.addSet(this.getErrorRecoverySet(recognizer));
	        this.consumeUntil(recognizer, whatFollowsLoopIterationOrRule);
	        break;
	    default:
	        // do nothing if we can't identify the exact kind of ATN state
	    }
	};
	
	// This is called by {@link //reportError} when the exception is a
	// {@link NoViableAltException}.
	//
	// @see //reportError
	//
	// @param recognizer the parser instance
	// @param e the recognition exception
	//
	DefaultErrorStrategy.prototype.reportNoViableAlternative = function(recognizer, e) {
	    var tokens = recognizer.getTokenStream();
	    var input;
	    if(tokens !== null) {
	        if (e.startToken.type===Token.EOF) {
	            input = "<EOF>";
	        } else {
	            input = tokens.getText(new Interval(e.startToken, e.offendingToken));
	        }
	    } else {
	        input = "<unknown input>";
	    }
	    var msg = "no viable alternative at input " + this.escapeWSAndQuote(input);
	    recognizer.notifyErrorListeners(msg, e.offendingToken, e);
	};
	
	//
	// This is called by {@link //reportError} when the exception is an
	// {@link InputMismatchException}.
	//
	// @see //reportError
	//
	// @param recognizer the parser instance
	// @param e the recognition exception
	//
	DefaultErrorStrategy.prototype.reportInputMismatch = function(recognizer, e) {
	    var msg = "mismatched input " + this.getTokenErrorDisplay(e.offendingToken) +
	          " expecting " + e.getExpectedTokens().toString(recognizer.literalNames, recognizer.symbolicNames);
	    recognizer.notifyErrorListeners(msg, e.offendingToken, e);
	};
	
	//
	// This is called by {@link //reportError} when the exception is a
	// {@link FailedPredicateException}.
	//
	// @see //reportError
	//
	// @param recognizer the parser instance
	// @param e the recognition exception
	//
	DefaultErrorStrategy.prototype.reportFailedPredicate = function(recognizer, e) {
	    var ruleName = recognizer.ruleNames[recognizer._ctx.ruleIndex];
	    var msg = "rule " + ruleName + " " + e.message;
	    recognizer.notifyErrorListeners(msg, e.offendingToken, e);
	};
	
	// This method is called to report a syntax error which requires the removal
	// of a token from the input stream. At the time this method is called, the
	// erroneous symbol is current {@code LT(1)} symbol and has not yet been
	// removed from the input stream. When this method returns,
	// {@code recognizer} is in error recovery mode.
	//
	// <p>This method is called when {@link //singleTokenDeletion} identifies
	// single-token deletion as a viable recovery strategy for a mismatched
	// input error.</p>
	//
	// <p>The default implementation simply returns if the handler is already in
	// error recovery mode. Otherwise, it calls {@link //beginErrorCondition} to
	// enter error recovery mode, followed by calling
	// {@link Parser//notifyErrorListeners}.</p>
	//
	// @param recognizer the parser instance
	//
	DefaultErrorStrategy.prototype.reportUnwantedToken = function(recognizer) {
	    if (this.inErrorRecoveryMode(recognizer)) {
	        return;
	    }
	    this.beginErrorCondition(recognizer);
	    var t = recognizer.getCurrentToken();
	    var tokenName = this.getTokenErrorDisplay(t);
	    var expecting = this.getExpectedTokens(recognizer);
	    var msg = "extraneous input " + tokenName + " expecting " +
	        expecting.toString(recognizer.literalNames, recognizer.symbolicNames);
	    recognizer.notifyErrorListeners(msg, t, null);
	};
	// This method is called to report a syntax error which requires the
	// insertion of a missing token into the input stream. At the time this
	// method is called, the missing token has not yet been inserted. When this
	// method returns, {@code recognizer} is in error recovery mode.
	//
	// <p>This method is called when {@link //singleTokenInsertion} identifies
	// single-token insertion as a viable recovery strategy for a mismatched
	// input error.</p>
	//
	// <p>The default implementation simply returns if the handler is already in
	// error recovery mode. Otherwise, it calls {@link //beginErrorCondition} to
	// enter error recovery mode, followed by calling
	// {@link Parser//notifyErrorListeners}.</p>
	//
	// @param recognizer the parser instance
	//
	DefaultErrorStrategy.prototype.reportMissingToken = function(recognizer) {
	    if ( this.inErrorRecoveryMode(recognizer)) {
	        return;
	    }
	    this.beginErrorCondition(recognizer);
	    var t = recognizer.getCurrentToken();
	    var expecting = this.getExpectedTokens(recognizer);
	    var msg = "missing " + expecting.toString(recognizer.literalNames, recognizer.symbolicNames) +
	          " at " + this.getTokenErrorDisplay(t);
	    recognizer.notifyErrorListeners(msg, t, null);
	};
	
	// <p>The default implementation attempts to recover from the mismatched input
	// by using single token insertion and deletion as described below. If the
	// recovery attempt fails, this method throws an
	// {@link InputMismatchException}.</p>
	//
	// <p><strong>EXTRA TOKEN</strong> (single token deletion)</p>
	//
	// <p>{@code LA(1)} is not what we are looking for. If {@code LA(2)} has the
	// right token, however, then assume {@code LA(1)} is some extra spurious
	// token and delete it. Then consume and return the next token (which was
	// the {@code LA(2)} token) as the successful result of the match operation.</p>
	//
	// <p>This recovery strategy is implemented by {@link
	// //singleTokenDeletion}.</p>
	//
	// <p><strong>MISSING TOKEN</strong> (single token insertion)</p>
	//
	// <p>If current token (at {@code LA(1)}) is consistent with what could come
	// after the expected {@code LA(1)} token, then assume the token is missing
	// and use the parser's {@link TokenFactory} to create it on the fly. The
	// "insertion" is performed by returning the created token as the successful
	// result of the match operation.</p>
	//
	// <p>This recovery strategy is implemented by {@link
	// //singleTokenInsertion}.</p>
	//
	// <p><strong>EXAMPLE</strong></p>
	//
	// <p>For example, Input {@code i=(3;} is clearly missing the {@code ')'}. When
	// the parser returns from the nested call to {@code expr}, it will have
	// call chain:</p>
	//
	// <pre>
	// stat &rarr; expr &rarr; atom
	// </pre>
	//
	// and it will be trying to match the {@code ')'} at this point in the
	// derivation:
	//
	// <pre>
	// =&gt; ID '=' '(' INT ')' ('+' atom)* ';'
	// ^
	// </pre>
	//
	// The attempt to match {@code ')'} will fail when it sees {@code ';'} and
	// call {@link //recoverInline}. To recover, it sees that {@code LA(1)==';'}
	// is in the set of tokens that can follow the {@code ')'} token reference
	// in rule {@code atom}. It can assume that you forgot the {@code ')'}.
	//
	DefaultErrorStrategy.prototype.recoverInline = function(recognizer) {
	    // SINGLE TOKEN DELETION
	    var matchedSymbol = this.singleTokenDeletion(recognizer);
	    if (matchedSymbol !== null) {
	        // we have deleted the extra token.
	        // now, move past ttype token as if all were ok
	        recognizer.consume();
	        return matchedSymbol;
	    }
	    // SINGLE TOKEN INSERTION
	    if (this.singleTokenInsertion(recognizer)) {
	        return this.getMissingSymbol(recognizer);
	    }
	    // even that didn't work; must throw the exception
	    throw new InputMismatchException(recognizer);
	};
	
	//
	// This method implements the single-token insertion inline error recovery
	// strategy. It is called by {@link //recoverInline} if the single-token
	// deletion strategy fails to recover from the mismatched input. If this
	// method returns {@code true}, {@code recognizer} will be in error recovery
	// mode.
	//
	// <p>This method determines whether or not single-token insertion is viable by
	// checking if the {@code LA(1)} input symbol could be successfully matched
	// if it were instead the {@code LA(2)} symbol. If this method returns
	// {@code true}, the caller is responsible for creating and inserting a
	// token with the correct type to produce this behavior.</p>
	//
	// @param recognizer the parser instance
	// @return {@code true} if single-token insertion is a viable recovery
	// strategy for the current mismatched input, otherwise {@code false}
	//
	DefaultErrorStrategy.prototype.singleTokenInsertion = function(recognizer) {
	    var currentSymbolType = recognizer.getTokenStream().LA(1);
	    // if current token is consistent with what could come after current
	    // ATN state, then we know we're missing a token; error recovery
	    // is free to conjure up and insert the missing token
	    var atn = recognizer._interp.atn;
	    var currentState = atn.states[recognizer.state];
	    var next = currentState.transitions[0].target;
	    var expectingAtLL2 = atn.nextTokens(next, recognizer._ctx);
	    if (expectingAtLL2.contains(currentSymbolType) ){
	        this.reportMissingToken(recognizer);
	        return true;
	    } else {
	        return false;
	    }
	};
	
	// This method implements the single-token deletion inline error recovery
	// strategy. It is called by {@link //recoverInline} to attempt to recover
	// from mismatched input. If this method returns null, the parser and error
	// handler state will not have changed. If this method returns non-null,
	// {@code recognizer} will <em>not</em> be in error recovery mode since the
	// returned token was a successful match.
	//
	// <p>If the single-token deletion is successful, this method calls
	// {@link //reportUnwantedToken} to report the error, followed by
	// {@link Parser//consume} to actually "delete" the extraneous token. Then,
	// before returning {@link //reportMatch} is called to signal a successful
	// match.</p>
	//
	// @param recognizer the parser instance
	// @return the successfully matched {@link Token} instance if single-token
	// deletion successfully recovers from the mismatched input, otherwise
	// {@code null}
	//
	DefaultErrorStrategy.prototype.singleTokenDeletion = function(recognizer) {
	    var nextTokenType = recognizer.getTokenStream().LA(2);
	    var expecting = this.getExpectedTokens(recognizer);
	    if (expecting.contains(nextTokenType)) {
	        this.reportUnwantedToken(recognizer);
	        // print("recoverFromMismatchedToken deleting " \
	        // + str(recognizer.getTokenStream().LT(1)) \
	        // + " since " + str(recognizer.getTokenStream().LT(2)) \
	        // + " is what we want", file=sys.stderr)
	        recognizer.consume(); // simply delete extra token
	        // we want to return the token we're actually matching
	        var matchedSymbol = recognizer.getCurrentToken();
	        this.reportMatch(recognizer); // we know current token is correct
	        return matchedSymbol;
	    } else {
	        return null;
	    }
	};
	
	// Conjure up a missing token during error recovery.
	//
	// The recognizer attempts to recover from single missing
	// symbols. But, actions might refer to that missing symbol.
	// For example, x=ID {f($x);}. The action clearly assumes
	// that there has been an identifier matched previously and that
	// $x points at that token. If that token is missing, but
	// the next token in the stream is what we want we assume that
	// this token is missing and we keep going. Because we
	// have to return some token to replace the missing token,
	// we have to conjure one up. This method gives the user control
	// over the tokens returned for missing tokens. Mostly,
	// you will want to create something special for identifier
	// tokens. For literals such as '{' and ',', the default
	// action in the parser or tree parser works. It simply creates
	// a CommonToken of the appropriate type. The text will be the token.
	// If you change what tokens must be created by the lexer,
	// override this method to create the appropriate tokens.
	//
	DefaultErrorStrategy.prototype.getMissingSymbol = function(recognizer) {
	    var currentSymbol = recognizer.getCurrentToken();
	    var expecting = this.getExpectedTokens(recognizer);
	    var expectedTokenType = expecting.first(); // get any element
	    var tokenText;
	    if (expectedTokenType===Token.EOF) {
	        tokenText = "<missing EOF>";
	    } else {
	        tokenText = "<missing " + recognizer.literalNames[expectedTokenType] + ">";
	    }
	    var current = currentSymbol;
	    var lookback = recognizer.getTokenStream().LT(-1);
	    if (current.type===Token.EOF && lookback !== null) {
	        current = lookback;
	    }
	    return recognizer.getTokenFactory().create(current.source,
	        expectedTokenType, tokenText, Token.DEFAULT_CHANNEL,
	        -1, -1, current.line, current.column);
	};
	
	DefaultErrorStrategy.prototype.getExpectedTokens = function(recognizer) {
	    return recognizer.getExpectedTokens();
	};
	
	// How should a token be displayed in an error message? The default
	// is to display just the text, but during development you might
	// want to have a lot of information spit out. Override in that case
	// to use t.toString() (which, for CommonToken, dumps everything about
	// the token). This is better than forcing you to override a method in
	// your token objects because you don't have to go modify your lexer
	// so that it creates a new Java type.
	//
	DefaultErrorStrategy.prototype.getTokenErrorDisplay = function(t) {
	    if (t === null) {
	        return "<no token>";
	    }
	    var s = t.text;
	    if (s === null) {
	        if (t.type===Token.EOF) {
	            s = "<EOF>";
	        } else {
	            s = "<" + t.type + ">";
	        }
	    }
	    return this.escapeWSAndQuote(s);
	};
	
	DefaultErrorStrategy.prototype.escapeWSAndQuote = function(s) {
	    s = s.replace(/\n/g,"\\n");
	    s = s.replace(/\r/g,"\\r");
	    s = s.replace(/\t/g,"\\t");
	    return "'" + s + "'";
	};
	
	// Compute the error recovery set for the current rule. During
	// rule invocation, the parser pushes the set of tokens that can
	// follow that rule reference on the stack; this amounts to
	// computing FIRST of what follows the rule reference in the
	// enclosing rule. See LinearApproximator.FIRST().
	// This local follow set only includes tokens
	// from within the rule; i.e., the FIRST computation done by
	// ANTLR stops at the end of a rule.
	//
	// EXAMPLE
	//
	// When you find a "no viable alt exception", the input is not
	// consistent with any of the alternatives for rule r. The best
	// thing to do is to consume tokens until you see something that
	// can legally follow a call to r//or* any rule that called r.
	// You don't want the exact set of viable next tokens because the
	// input might just be missing a token--you might consume the
	// rest of the input looking for one of the missing tokens.
	//
	// Consider grammar:
	//
	// a : '[' b ']'
	// | '(' b ')'
	// ;
	// b : c '^' INT ;
	// c : ID
	// | INT
	// ;
	//
	// At each rule invocation, the set of tokens that could follow
	// that rule is pushed on a stack. Here are the various
	// context-sensitive follow sets:
	//
	// FOLLOW(b1_in_a) = FIRST(']') = ']'
	// FOLLOW(b2_in_a) = FIRST(')') = ')'
	// FOLLOW(c_in_b) = FIRST('^') = '^'
	//
	// Upon erroneous input "[]", the call chain is
	//
	// a -> b -> c
	//
	// and, hence, the follow context stack is:
	//
	// depth follow set start of rule execution
	// 0 <EOF> a (from main())
	// 1 ']' b
	// 2 '^' c
	//
	// Notice that ')' is not included, because b would have to have
	// been called from a different context in rule a for ')' to be
	// included.
	//
	// For error recovery, we cannot consider FOLLOW(c)
	// (context-sensitive or otherwise). We need the combined set of
	// all context-sensitive FOLLOW sets--the set of all tokens that
	// could follow any reference in the call chain. We need to
	// resync to one of those tokens. Note that FOLLOW(c)='^' and if
	// we resync'd to that token, we'd consume until EOF. We need to
	// sync to context-sensitive FOLLOWs for a, b, and c: {']','^'}.
	// In this case, for input "[]", LA(1) is ']' and in the set, so we would
	// not consume anything. After printing an error, rule c would
	// return normally. Rule b would not find the required '^' though.
	// At this point, it gets a mismatched token error and throws an
	// exception (since LA(1) is not in the viable following token
	// set). The rule exception handler tries to recover, but finds
	// the same recovery set and doesn't consume anything. Rule b
	// exits normally returning to rule a. Now it finds the ']' (and
	// with the successful match exits errorRecovery mode).
	//
	// So, you can see that the parser walks up the call chain looking
	// for the token that was a member of the recovery set.
	//
	// Errors are not generated in errorRecovery mode.
	//
	// ANTLR's error recovery mechanism is based upon original ideas:
	//
	// "Algorithms + Data Structures = Programs" by Niklaus Wirth
	//
	// and
	//
	// "A note on error recovery in recursive descent parsers":
	// http://portal.acm.org/citation.cfm?id=947902.947905
	//
	// Later, Josef Grosch had some good ideas:
	//
	// "Efficient and Comfortable Error Recovery in Recursive Descent
	// Parsers":
	// ftp://www.cocolab.com/products/cocktail/doca4.ps/ell.ps.zip
	//
	// Like Grosch I implement context-sensitive FOLLOW sets that are combined
	// at run-time upon error to avoid overhead during parsing.
	//
	DefaultErrorStrategy.prototype.getErrorRecoverySet = function(recognizer) {
	    var atn = recognizer._interp.atn;
	    var ctx = recognizer._ctx;
	    var recoverSet = new IntervalSet();
	    while (ctx !== null && ctx.invokingState>=0) {
	        // compute what follows who invoked us
	        var invokingState = atn.states[ctx.invokingState];
	        var rt = invokingState.transitions[0];
	        var follow = atn.nextTokens(rt.followState);
	        recoverSet.addSet(follow);
	        ctx = ctx.parentCtx;
	    }
	    recoverSet.removeOne(Token.EPSILON);
	    return recoverSet;
	};
	
	// Consume tokens until one matches the given token set.//
	DefaultErrorStrategy.prototype.consumeUntil = function(recognizer, set) {
	    var ttype = recognizer.getTokenStream().LA(1);
	    while( ttype !== Token.EOF && !set.contains(ttype)) {
	        recognizer.consume();
	        ttype = recognizer.getTokenStream().LA(1);
	    }
	};
	
	//
	// This implementation of {@link ANTLRErrorStrategy} responds to syntax errors
	// by immediately canceling the parse operation with a
	// {@link ParseCancellationException}. The implementation ensures that the
	// {@link ParserRuleContext//exception} field is set for all parse tree nodes
	// that were not completed prior to encountering the error.
	//
	// <p>
	// This error strategy is useful in the following scenarios.</p>
	//
	// <ul>
	// <li><strong>Two-stage parsing:</strong> This error strategy allows the first
	// stage of two-stage parsing to immediately terminate if an error is
	// encountered, and immediately fall back to the second stage. In addition to
	// avoiding wasted work by attempting to recover from errors here, the empty
	// implementation of {@link BailErrorStrategy//sync} improves the performance of
	// the first stage.</li>
	// <li><strong>Silent validation:</strong> When syntax errors are not being
	// reported or logged, and the parse result is simply ignored if errors occur,
	// the {@link BailErrorStrategy} avoids wasting work on recovering from errors
	// when the result will be ignored either way.</li>
	// </ul>
	//
	// <p>
	// {@code myparser.setErrorHandler(new BailErrorStrategy());}</p>
	//
	// @see Parser//setErrorHandler(ANTLRErrorStrategy)
	//
	function BailErrorStrategy() {
		DefaultErrorStrategy.call(this);
		return this;
	}
	
	BailErrorStrategy.prototype = Object.create(DefaultErrorStrategy.prototype);
	BailErrorStrategy.prototype.constructor = BailErrorStrategy;
	
	// Instead of recovering from exception {@code e}, re-throw it wrapped
	// in a {@link ParseCancellationException} so it is not caught by the
	// rule function catches. Use {@link Exception//getCause()} to get the
	// original {@link RecognitionException}.
	//
	BailErrorStrategy.prototype.recover = function(recognizer, e) {
	    var context = recognizer._ctx;
	    while (context !== null) {
	        context.exception = e;
	        context = context.parentCtx;
	    }
	    throw new ParseCancellationException(e);
	};
	    
	// Make sure we don't attempt to recover inline; if the parser
	// successfully recovers, it won't throw an exception.
	//
	BailErrorStrategy.prototype.recoverInline = function(recognizer) {
	    this.recover(recognizer, new InputMismatchException(recognizer));
	};
	
	// Make sure we don't attempt to recover from problems in subrules.//
	BailErrorStrategy.prototype.sync = function(recognizer) {
	    // pass
	};
	
	exports.BailErrorStrategy = BailErrorStrategy;
	exports.DefaultErrorStrategy = DefaultErrorStrategy;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Generated from /Users/gboyer/Projects/JavaScript/jspath-mutator/src/antlr/JsonPath.g4 by ANTLR 4.5.1
	// jshint ignore: start
	var antlr4 = __webpack_require__(16);
	
	// This class defines a complete generic visitor for a parse tree produced by JsonPathParser.
	
	function JsonPathVisitor() {
		antlr4.tree.ParseTreeVisitor.call(this);
		return this;
	}
	
	JsonPathVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
	JsonPathVisitor.prototype.constructor = JsonPathVisitor;
	
	// Visit a parse tree produced by JsonPathParser#parseJsonPath.
	JsonPathVisitor.prototype.visitParseJsonPath = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#jsonPath.
	JsonPathVisitor.prototype.visitJsonPath = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#accessSpec.
	JsonPathVisitor.prototype.visitAccessSpec = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#dotAccess.
	JsonPathVisitor.prototype.visitDotAccess = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#bracketAccess.
	JsonPathVisitor.prototype.visitBracketAccess = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#recursiveDescent.
	JsonPathVisitor.prototype.visitRecursiveDescent = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#selector.
	JsonPathVisitor.prototype.visitSelector = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#bracketExpression.
	JsonPathVisitor.prototype.visitBracketExpression = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#interpolation.
	JsonPathVisitor.prototype.visitInterpolation = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#arraySlice.
	JsonPathVisitor.prototype.visitArraySlice = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#arraySection.
	JsonPathVisitor.prototype.visitArraySection = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#simpleSection.
	JsonPathVisitor.prototype.visitSimpleSection = function (ctx) {};
	
	// Visit a parse tree produced by JsonPathParser#fieldIndex.
	JsonPathVisitor.prototype.visitFieldIndex = function (ctx) {};
	
	exports.JsonPathVisitor = JsonPathVisitor;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	// This implementation of {@link TokenStream} loads tokens from a
	// {@link TokenSource} on-demand, and places the tokens in a buffer to provide
	// access to any previous token by index.
	//
	// <p>
	// This token stream ignores the value of {@link Token//getChannel}. If your
	// parser requires the token stream filter tokens to only those on a particular
	// channel, such as {@link Token//DEFAULT_CHANNEL} or
	// {@link Token//HIDDEN_CHANNEL}, use a filtering token stream such a
	// {@link CommonTokenStream}.</p>
	
	var Token = __webpack_require__(1).Token;
	var Lexer = __webpack_require__(13).Lexer;
	var Interval = __webpack_require__(2).Interval;
	
	// this is just to keep meaningful parameter types to Parser
	function TokenStream() {
		return this;
	}
	
	function BufferedTokenStream(tokenSource) {
	
		TokenStream.call(this);
		// The {@link TokenSource} from which tokens for this stream are fetched.
		this.tokenSource = tokenSource;
	
		// A collection of all tokens fetched from the token source. The list is
		// considered a complete view of the input once {@link //fetchedEOF} is set
		// to {@code true}.
		this.tokens = [];
	
		// The index into {@link //tokens} of the current token (next token to
		// {@link //consume}). {@link //tokens}{@code [}{@link //p}{@code ]} should
		// be
		// {@link //LT LT(1)}.
		//
		// <p>This field is set to -1 when the stream is first constructed or when
		// {@link //setTokenSource} is called, indicating that the first token has
		// not yet been fetched from the token source. For additional information,
		// see the documentation of {@link IntStream} for a description of
		// Initializing Methods.</p>
		this.index = -1;
	
		// Indicates whether the {@link Token//EOF} token has been fetched from
		// {@link //tokenSource} and added to {@link //tokens}. This field improves
		// performance for the following cases:
		//
		// <ul>
		// <li>{@link //consume}: The lookahead check in {@link //consume} to
		// prevent
		// consuming the EOF symbol is optimized by checking the values of
		// {@link //fetchedEOF} and {@link //p} instead of calling {@link
		// //LA}.</li>
		// <li>{@link //fetch}: The check to prevent adding multiple EOF symbols
		// into
		// {@link //tokens} is trivial with this field.</li>
		// <ul>
		this.fetchedEOF = false;
		return this;
	}
	
	BufferedTokenStream.prototype = Object.create(TokenStream.prototype);
	BufferedTokenStream.prototype.constructor = BufferedTokenStream;
	
	BufferedTokenStream.prototype.mark = function() {
		return 0;
	};
	
	BufferedTokenStream.prototype.release = function(marker) {
		// no resources to release
	};
	
	BufferedTokenStream.prototype.reset = function() {
		this.seek(0);
	};
	
	BufferedTokenStream.prototype.seek = function(index) {
		this.lazyInit();
		this.index = this.adjustSeekIndex(index);
	};
	
	BufferedTokenStream.prototype.get = function(index) {
		this.lazyInit();
		return this.tokens[index];
	};
	
	BufferedTokenStream.prototype.consume = function() {
		var skipEofCheck = false;
		if (this.index >= 0) {
			if (this.fetchedEOF) {
				// the last token in tokens is EOF. skip check if p indexes any
				// fetched token except the last.
				skipEofCheck = this.index < this.tokens.length - 1;
			} else {
				// no EOF token in tokens. skip check if p indexes a fetched token.
				skipEofCheck = this.index < this.tokens.length;
			}
		} else {
			// not yet initialized
			skipEofCheck = false;
		}
		if (!skipEofCheck && this.LA(1) === Token.EOF) {
			throw "cannot consume EOF";
		}
		if (this.sync(this.index + 1)) {
			this.index = this.adjustSeekIndex(this.index + 1);
		}
	};
	
	// Make sure index {@code i} in tokens has a token.
	//
	// @return {@code true} if a token is located at index {@code i}, otherwise
	// {@code false}.
	// @see //get(int i)
	// /
	BufferedTokenStream.prototype.sync = function(i) {
		var n = i - this.tokens.length + 1; // how many more elements we need?
		if (n > 0) {
			var fetched = this.fetch(n);
			return fetched >= n;
		}
		return true;
	};
	
	// Add {@code n} elements to buffer.
	//
	// @return The actual number of elements added to the buffer.
	// /
	BufferedTokenStream.prototype.fetch = function(n) {
		if (this.fetchedEOF) {
			return 0;
		}
		for (var i = 0; i < n; i++) {
			var t = this.tokenSource.nextToken();
			t.tokenIndex = this.tokens.length;
			this.tokens.push(t);
			if (t.type === Token.EOF) {
				this.fetchedEOF = true;
				return i + 1;
			}
		}
		return n;
	};
	
	// Get all tokens from start..stop inclusively///
	BufferedTokenStream.prototype.getTokens = function(start, stop, types) {
		if (types === undefined) {
			types = null;
		}
		if (start < 0 || stop < 0) {
			return null;
		}
		this.lazyInit();
		var subset = [];
		if (stop >= this.tokens.length) {
			stop = this.tokens.length - 1;
		}
		for (var i = start; i < stop; i++) {
			var t = this.tokens[i];
			if (t.type === Token.EOF) {
				break;
			}
			if (types === null || types.contains(t.type)) {
				subset.push(t);
			}
		}
		return subset;
	};
	
	BufferedTokenStream.prototype.LA = function(i) {
		return this.LT(i).type;
	};
	
	BufferedTokenStream.prototype.LB = function(k) {
		if (this.index - k < 0) {
			return null;
		}
		return this.tokens[this.index - k];
	};
	
	BufferedTokenStream.prototype.LT = function(k) {
		this.lazyInit();
		if (k === 0) {
			return null;
		}
		if (k < 0) {
			return this.LB(-k);
		}
		var i = this.index + k - 1;
		this.sync(i);
		if (i >= this.tokens.length) { // return EOF token
			// EOF must be last token
			return this.tokens[this.tokens.length - 1];
		}
		return this.tokens[i];
	};
	
	// Allowed derived classes to modify the behavior of operations which change
	// the current stream position by adjusting the target token index of a seek
	// operation. The default implementation simply returns {@code i}. If an
	// exception is thrown in this method, the current stream index should not be
	// changed.
	//
	// <p>For example, {@link CommonTokenStream} overrides this method to ensure
	// that
	// the seek target is always an on-channel token.</p>
	//
	// @param i The target token index.
	// @return The adjusted target token index.
	
	BufferedTokenStream.prototype.adjustSeekIndex = function(i) {
		return i;
	};
	
	BufferedTokenStream.prototype.lazyInit = function() {
		if (this.index === -1) {
			this.setup();
		}
	};
	
	BufferedTokenStream.prototype.setup = function() {
		this.sync(0);
		this.index = this.adjustSeekIndex(0);
	};
	
	// Reset this token stream by setting its token source.///
	BufferedTokenStream.prototype.setTokenSource = function(tokenSource) {
		this.tokenSource = tokenSource;
		this.tokens = [];
		this.index = -1;
	};
	
	// Given a starting index, return the index of the next token on channel.
	// Return i if tokens[i] is on channel. Return -1 if there are no tokens
	// on channel between i and EOF.
	// /
	BufferedTokenStream.prototype.nextTokenOnChannel = function(i, channel) {
		this.sync(i);
		if (i >= this.tokens.length) {
			return -1;
		}
		var token = this.tokens[i];
		while (token.channel !== this.channel) {
			if (token.type === Token.EOF) {
				return -1;
			}
			i += 1;
			this.sync(i);
			token = this.tokens[i];
		}
		return i;
	};
	
	// Given a starting index, return the index of the previous token on channel.
	// Return i if tokens[i] is on channel. Return -1 if there are no tokens
	// on channel between i and 0.
	BufferedTokenStream.prototype.previousTokenOnChannel = function(i, channel) {
		while (i >= 0 && this.tokens[i].channel !== channel) {
			i -= 1;
		}
		return i;
	};
	
	// Collect all tokens on specified channel to the right of
	// the current token up until we see a token on DEFAULT_TOKEN_CHANNEL or
	// EOF. If channel is -1, find any non default channel token.
	BufferedTokenStream.prototype.getHiddenTokensToRight = function(tokenIndex,
			channel) {
		if (channel === undefined) {
			channel = -1;
		}
		this.lazyInit();
		if (this.tokenIndex < 0 || tokenIndex >= this.tokens.length) {
			throw "" + tokenIndex + " not in 0.." + this.tokens.length - 1;
		}
		var nextOnChannel = this.nextTokenOnChannel(tokenIndex + 1,
				Lexer.DEFAULT_TOKEN_CHANNEL);
		var from_ = tokenIndex + 1;
		// if none onchannel to right, nextOnChannel=-1 so set to = last token
		var to = nextOnChannel === -1 ? this.tokens.length - 1 : nextOnChannel;
		return this.filterForChannel(from_, to, channel);
	};
	
	// Collect all tokens on specified channel to the left of
	// the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
	// If channel is -1, find any non default channel token.
	BufferedTokenStream.prototype.getHiddenTokensToLeft = function(tokenIndex,
			channel) {
		if (channel === undefined) {
			channel = -1;
		}
		this.lazyInit();
		if (tokenIndex < 0 || tokenIndex >= this.tokens.length) {
			throw "" + tokenIndex + " not in 0.." + this.tokens.length - 1;
		}
		var prevOnChannel = this.previousTokenOnChannel(tokenIndex - 1,
				Lexer.DEFAULT_TOKEN_CHANNEL);
		if (prevOnChannel === tokenIndex - 1) {
			return null;
		}
		// if none on channel to left, prevOnChannel=-1 then from=0
		var from_ = prevOnChannel + 1;
		var to = tokenIndex - 1;
		return this.filterForChannel(from_, to, channel);
	};
	
	BufferedTokenStream.prototype.filterForChannel = function(left, right, channel) {
		var hidden = [];
		for (var i = left; i < right + 1; i++) {
			var t = this.tokens[i];
			if (channel === -1) {
				if (t.channel !== Lexer.DEFAULT_TOKEN_CHANNEL) {
					hidden.push(t);
				}
			} else if (t.channel === channel) {
				hidden.push(t);
			}
		}
		if (hidden.length === 0) {
			return null;
		}
		return hidden;
	};
	
	BufferedTokenStream.prototype.getSourceName = function() {
		return this.tokenSource.getSourceName();
	};
	
	// Get the text of all tokens in this buffer.///
	BufferedTokenStream.prototype.getText = function(interval) {
		this.lazyInit();
		this.fill();
		if (interval === undefined || interval === null) {
			interval = new Interval(0, this.tokens.length - 1);
		}
		var start = interval.start;
		if (start instanceof Token) {
			start = start.tokenIndex;
		}
		var stop = interval.stop;
		if (stop instanceof Token) {
			stop = stop.tokenIndex;
		}
		if (start === null || stop === null || start < 0 || stop < 0) {
			return "";
		}
		if (stop >= this.tokens.length) {
			stop = this.tokens.length - 1;
		}
		var s = "";
		for (var i = start; i < stop + 1; i++) {
			var t = this.tokens[i];
			if (t.type === Token.EOF) {
				break;
			}
			s = s + t.text;
		}
		return s;
	};
	
	// Get all tokens from lexer until EOF///
	BufferedTokenStream.prototype.fill = function() {
		this.lazyInit();
		while (this.fetch(1000) === 1000) {
			continue;
		}
	};
	
	exports.BufferedTokenStream = BufferedTokenStream;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	
	//
	// This default implementation of {@link TokenFactory} creates
	// {@link CommonToken} objects.
	//
	
	var CommonToken = __webpack_require__(1).CommonToken;
	
	function TokenFactory() {
		return this;
	}
	
	function CommonTokenFactory(copyText) {
		TokenFactory.call(this);
	    // Indicates whether {@link CommonToken//setText} should be called after
	    // constructing tokens to explicitly set the text. This is useful for cases
	    // where the input stream might not be able to provide arbitrary substrings
	    // of text from the input after the lexer creates a token (e.g. the
	    // implementation of {@link CharStream//getText} in
	    // {@link UnbufferedCharStream} throws an
	    // {@link UnsupportedOperationException}). Explicitly setting the token text
	    // allows {@link Token//getText} to be called at any time regardless of the
	    // input stream implementation.
	    //
	    // <p>
	    // The default value is {@code false} to avoid the performance and memory
	    // overhead of copying text for every token unless explicitly requested.</p>
	    //
	    this.copyText = copyText===undefined ? false : copyText;
		return this;
	}
	
	CommonTokenFactory.prototype = Object.create(TokenFactory.prototype);
	CommonTokenFactory.prototype.constructor = CommonTokenFactory;
	
	//
	// The default {@link CommonTokenFactory} instance.
	//
	// <p>
	// This token factory does not explicitly copy token text when constructing
	// tokens.</p>
	//
	CommonTokenFactory.DEFAULT = new CommonTokenFactory();
	
	CommonTokenFactory.prototype.create = function(source, type, text, channel, start, stop, line, column) {
	    var t = new CommonToken(source, type, channel, start, stop);
	    t.line = line;
	    t.column = column;
	    if (text !==null) {
	        t.text = text;
	    } else if (this.copyText && source[1] !==null) {
	        t.text = source[1].getText(start,stop);
	    }
	    return t;
	};
	
	CommonTokenFactory.prototype.createThin = function(type, text) {
	    var t = new CommonToken(null, type);
	    t.text = text;
	    return t;
	};
	
	exports.CommonTokenFactory = CommonTokenFactory;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	//
	// This class extends {@link BufferedTokenStream} with functionality to filter
	// token streams to tokens on a particular channel (tokens where
	// {@link Token//getChannel} returns a particular value).
	//
	// <p>
	// This token stream provides access to all tokens by index or when calling
	// methods like {@link //getText}. The channel filtering is only used for code
	// accessing tokens via the lookahead methods {@link //LA}, {@link //LT}, and
	// {@link //LB}.</p>
	//
	// <p>
	// By default, tokens are placed on the default channel
	// ({@link Token//DEFAULT_CHANNEL}), but may be reassigned by using the
	// {@code ->channel(HIDDEN)} lexer command, or by using an embedded action to
	// call {@link Lexer//setChannel}.
	// </p>
	//
	// <p>
	// Note: lexer rules which use the {@code ->skip} lexer command or call
	// {@link Lexer//skip} do not produce tokens at all, so input text matched by
	// such a rule will not be available as part of the token stream, regardless of
	// channel.</p>
	///
	
	var Token = __webpack_require__(1).Token;
	var BufferedTokenStream = __webpack_require__(29).BufferedTokenStream;
	
	function CommonTokenStream(lexer, channel) {
		BufferedTokenStream.call(this, lexer);
	    this.channel = channel===undefined ? Token.DEFAULT_CHANNEL : channel;
	    return this;
	}
	
	CommonTokenStream.prototype = Object.create(BufferedTokenStream.prototype);
	CommonTokenStream.prototype.constructor = CommonTokenStream;
	
	CommonTokenStream.prototype.adjustSeekIndex = function(i) {
	    return this.nextTokenOnChannel(i, this.channel);
	};
	
	CommonTokenStream.prototype.LB = function(k) {
	    if (k===0 || this.index-k<0) {
	        return null;
	    }
	    var i = this.index;
	    var n = 1;
	    // find k good tokens looking backwards
	    while (n <= k) {
	        // skip off-channel tokens
	        i = this.previousTokenOnChannel(i - 1, this.channel);
	        n += 1;
	    }
	    if (i < 0) {
	        return null;
	    }
	    return this.tokens[i];
	};
	
	CommonTokenStream.prototype.LT = function(k) {
	    this.lazyInit();
	    if (k === 0) {
	        return null;
	    }
	    if (k < 0) {
	        return this.LB(-k);
	    }
	    var i = this.index;
	    var n = 1; // we know tokens[pos] is a good one
	    // find k good tokens
	    while (n < k) {
	        // skip off-channel tokens, but make sure to not look past EOF
	        if (this.sync(i + 1)) {
	            i = this.nextTokenOnChannel(i + 1, this.channel);
	        }
	        n += 1;
	    }
	    return this.tokens[i];
	};
	
	// Count EOF just once.///
	CommonTokenStream.prototype.getNumberOfOnChannelTokens = function() {
	    var n = 0;
	    this.fill();
	    for (var i =0; i< this.tokens.length;i++) {
	        var t = this.tokens[i];
	        if( t.channel===this.channel) {
	            n += 1;
	        }
	        if( t.type===Token.EOF) {
	            break;
	        }
	    }
	    return n;
	};
	
	exports.CommonTokenStream = CommonTokenStream;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	//
	//  [The "BSD license"]
	//   Copyright (c) 2012 Terence Parr
	//   Copyright (c) 2012 Sam Harwell
	//   Copyright (c) 2014 Eric Vergnaud
	//   All rights reserved.
	// 
	//   Redistribution and use in source and binary forms, with or without
	//   modification, are permitted provided that the following conditions
	//   are met:
	// 
	//   1. Redistributions of source code must retain the above copyright
	//      notice, this list of conditions and the following disclaimer.
	//   2. Redistributions in binary form must reproduce the above copyright
	//      notice, this list of conditions and the following disclaimer in the
	//      documentation and/or other materials provided with the distribution.
	//   3. The name of the author may not be used to endorse or promote products
	//      derived from this software without specific prior written permission.
	// 
	//   THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//   IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//   OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//   IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//   NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//   THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	// 
	
	//
	//  This is an InputStream that is loaded from a file all at once
	//  when you construct the object.
	// 
	var InputStream = __webpack_require__(20).InputStream;
	try {
		var fs = __webpack_require__(50);
	} catch(ex) {
		// probably running from browser, no "Node.js/fs" makes sense 
	}
		
	function FileStream(fileName) {
		var data = fs.readFileSync(fileName, "utf8");
		InputStream.call(this, data);
		this.fileName = fileName;
		return this;
	}
	
	FileStream.prototype = Object.create(InputStream.prototype);
	FileStream.prototype.constructor = FileStream;
	
	exports.FileStream = FileStream;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	var Set = __webpack_require__(3).Set;
	var BitSet = __webpack_require__(3).BitSet;
	var Token = __webpack_require__(1).Token;
	var ATNConfig = __webpack_require__(19).ATNConfig;
	var Interval = __webpack_require__(2).Interval;
	var IntervalSet = __webpack_require__(2).IntervalSet;
	var RuleStopState = __webpack_require__(7).RuleStopState;
	var RuleTransition = __webpack_require__(8).RuleTransition;
	var NotSetTransition = __webpack_require__(8).NotSetTransition;
	var WildcardTransition = __webpack_require__(8).WildcardTransition;
	var AbstractPredicateTransition = __webpack_require__(8).AbstractPredicateTransition;
	
	var pc = __webpack_require__(4);
	var predictionContextFromRuleContext = pc.predictionContextFromRuleContext;
	var PredictionContext = pc.PredictionContext;
	var SingletonPredictionContext = pc.SingletonPredictionContext;
	
	function LL1Analyzer (atn) {
	    this.atn = atn;
	}
	
	//* Special value added to the lookahead sets to indicate that we hit
	//  a predicate during analysis if {@code seeThruPreds==false}.
	///
	LL1Analyzer.HIT_PRED = Token.INVALID_TYPE;
	
	
	//*
	// Calculates the SLL(1) expected lookahead set for each outgoing transition
	// of an {@link ATNState}. The returned array has one element for each
	// outgoing transition in {@code s}. If the closure from transition
	// <em>i</em> leads to a semantic predicate before matching a symbol, the
	// element at index <em>i</em> of the result will be {@code null}.
	//
	// @param s the ATN state
	// @return the expected symbols for each outgoing transition of {@code s}.
	///
	LL1Analyzer.prototype.getDecisionLookahead = function(s) {
	    if (s === null) {
	        return null;
	    }
	    var count = s.transitions.length;
	    var look = [];
	    for(var alt=0; alt< count; alt++) {
	        look[alt] = new IntervalSet();
	        var lookBusy = new Set();
	        var seeThruPreds = false; // fail to get lookahead upon pred
	        this._LOOK(s.transition(alt).target, null, PredictionContext.EMPTY,
	              look[alt], lookBusy, new BitSet(), seeThruPreds, false);
	        // Wipe out lookahead for this alternative if we found nothing
	        // or we had a predicate when we !seeThruPreds
	        if (look[alt].length===0 || look[alt].contains(LL1Analyzer.HIT_PRED)) {
	            look[alt] = null;
	        }
	    }
	    return look;
	};
	
	//*
	// Compute set of tokens that can follow {@code s} in the ATN in the
	// specified {@code ctx}.
	//
	// <p>If {@code ctx} is {@code null} and the end of the rule containing
	// {@code s} is reached, {@link Token//EPSILON} is added to the result set.
	// If {@code ctx} is not {@code null} and the end of the outermost rule is
	// reached, {@link Token//EOF} is added to the result set.</p>
	//
	// @param s the ATN state
	// @param stopState the ATN state to stop at. This can be a
	// {@link BlockEndState} to detect epsilon paths through a closure.
	// @param ctx the complete parser context, or {@code null} if the context
	// should be ignored
	//
	// @return The set of tokens that can follow {@code s} in the ATN in the
	// specified {@code ctx}.
	///
	LL1Analyzer.prototype.LOOK = function(s, stopState, ctx) {
	    var r = new IntervalSet();
	    var seeThruPreds = true; // ignore preds; get all lookahead
		ctx = ctx || null;
	    var lookContext = ctx!==null ? predictionContextFromRuleContext(s.atn, ctx) : null;
	    this._LOOK(s, stopState, lookContext, r, new Set(), new BitSet(), seeThruPreds, true);
	    return r;
	};
	    
	//*
	// Compute set of tokens that can follow {@code s} in the ATN in the
	// specified {@code ctx}.
	//
	// <p>If {@code ctx} is {@code null} and {@code stopState} or the end of the
	// rule containing {@code s} is reached, {@link Token//EPSILON} is added to
	// the result set. If {@code ctx} is not {@code null} and {@code addEOF} is
	// {@code true} and {@code stopState} or the end of the outermost rule is
	// reached, {@link Token//EOF} is added to the result set.</p>
	//
	// @param s the ATN state.
	// @param stopState the ATN state to stop at. This can be a
	// {@link BlockEndState} to detect epsilon paths through a closure.
	// @param ctx The outer context, or {@code null} if the outer context should
	// not be used.
	// @param look The result lookahead set.
	// @param lookBusy A set used for preventing epsilon closures in the ATN
	// from causing a stack overflow. Outside code should pass
	// {@code new Set<ATNConfig>} for this argument.
	// @param calledRuleStack A set used for preventing left recursion in the
	// ATN from causing a stack overflow. Outside code should pass
	// {@code new BitSet()} for this argument.
	// @param seeThruPreds {@code true} to true semantic predicates as
	// implicitly {@code true} and "see through them", otherwise {@code false}
	// to treat semantic predicates as opaque and add {@link //HIT_PRED} to the
	// result if one is encountered.
	// @param addEOF Add {@link Token//EOF} to the result if the end of the
	// outermost context is reached. This parameter has no effect if {@code ctx}
	// is {@code null}.
	///
	LL1Analyzer.prototype._LOOK = function(s, stopState , ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF) {
	    var c = new ATNConfig({state:s, alt:0}, ctx);
	    if (lookBusy.contains(c)) {
	        return;
	    }
	    lookBusy.add(c);
	    if (s === stopState) {
	        if (ctx ===null) {
	            look.addOne(Token.EPSILON);
	            return;
	        } else if (ctx.isEmpty() && addEOF) {
	            look.addOne(Token.EOF);
	            return;
	        }
	    }
	    if (s instanceof RuleStopState ) {
	        if (ctx ===null) {
	            look.addOne(Token.EPSILON);
	            return;
	        } else if (ctx.isEmpty() && addEOF) {
	            look.addOne(Token.EOF);
	            return;
	        }
	        if (ctx !== PredictionContext.EMPTY) {
	            // run thru all possible stack tops in ctx
	            for(var i=0; i<ctx.length; i++) {
	                var returnState = this.atn.states[ctx.getReturnState(i)];
	                var removed = calledRuleStack.contains(returnState.ruleIndex);
	                try {
	                    calledRuleStack.remove(returnState.ruleIndex);
	                    this._LOOK(returnState, stopState, ctx.getParent(i), look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
	                } finally {
	                    if (removed) {
	                        calledRuleStack.add(returnState.ruleIndex);
	                    }
	                }
	            }
	            return;
	        }
	    }
	    for(var j=0; j<s.transitions.length; j++) {
	        var t = s.transitions[j];
	        if (t.constructor === RuleTransition) {
	            if (calledRuleStack.contains(t.target.ruleIndex)) {
	                continue;
	            }
	            var newContext = SingletonPredictionContext.create(ctx, t.followState.stateNumber);
	            try {
	                calledRuleStack.add(t.target.ruleIndex);
	                this._LOOK(t.target, stopState, newContext, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
	            } finally {
	                calledRuleStack.remove(t.target.ruleIndex);
	            }
	        } else if (t instanceof AbstractPredicateTransition ) {
	            if (seeThruPreds) {
	                this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
	            } else {
	                look.addOne(LL1Analyzer.HIT_PRED);
	            }
	        } else if( t.isEpsilon) {
	            this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
	        } else if (t.constructor === WildcardTransition) {
	            look.addRange( Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType );
	        } else {
	            var set = t.label;
	            if (set !== null) {
	                if (t instanceof NotSetTransition) {
	                    set = set.complement(Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
	                }
	                look.addSet(set);
	            }
	        }
	    }
	};
	
	exports.LL1Analyzer = LL1Analyzer;
	


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  this SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  this SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	var Token = __webpack_require__(1).Token;
	var ParseTreeListener = __webpack_require__(6).ParseTreeListener;
	var Recognizer = __webpack_require__(21).Recognizer;
	var DefaultErrorStrategy = __webpack_require__(27).DefaultErrorStrategy;
	var ATNDeserializer = __webpack_require__(23).ATNDeserializer;
	var ATNDeserializationOptions = __webpack_require__(22).ATNDeserializationOptions;
	
	function TraceListener(parser) {
		ParseTreeListener.call(this);
	    this.parser = parser;
		return this;
	}
	
	TraceListener.prototype = Object.create(ParseTreeListener);
	TraceListener.prototype.constructor = TraceListener;
	
	TraceListener.prototype.enterEveryRule = function(ctx) {
		console.log("enter   " + this.parser.ruleNames[ctx.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
	};
	
	TraceListener.prototype.visitTerminal = function( node) {
		console.log("consume " + node.symbol + " rule " + this.parser.ruleNames[this.parser._ctx.ruleIndex]);
	};
	
	TraceListener.prototype.exitEveryRule = function(ctx) {
		console.log("exit    " + this.parser.ruleNames[ctx.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
	};
	
	// this is all the parsing support code essentially; most of it is error
	// recovery stuff.//
	function Parser(input) {
		Recognizer.call(this);
		// The input stream.
		this._input = null;
		// The error handling strategy for the parser. The default value is a new
		// instance of {@link DefaultErrorStrategy}.
		this._errHandler = new DefaultErrorStrategy();
		this._precedenceStack = [];
		this._precedenceStack.push(0);
		// The {@link ParserRuleContext} object for the currently executing rule.
		// this is always non-null during the parsing process.
		this._ctx = null;
		// Specifies whether or not the parser should construct a parse tree during
		// the parsing process. The default value is {@code true}.
		this.buildParseTrees = true;
		// When {@link //setTrace}{@code (true)} is called, a reference to the
		// {@link TraceListener} is stored here so it can be easily removed in a
		// later call to {@link //setTrace}{@code (false)}. The listener itself is
		// implemented as a parser listener so this field is not directly used by
		// other parser methods.
		this._tracer = null;
		// The list of {@link ParseTreeListener} listeners registered to receive
		// events during the parse.
		this._parseListeners = null;
		// The number of syntax errors reported during parsing. this value is
		// incremented each time {@link //notifyErrorListeners} is called.
		this._syntaxErrors = 0;
		this.setInputStream(input);
		return this;
	}
	
	Parser.prototype = Object.create(Recognizer.prototype);
	Parser.prototype.contructor = Parser;
	
	// this field maps from the serialized ATN string to the deserialized {@link
	// ATN} with
	// bypass alternatives.
	//
	// @see ATNDeserializationOptions//isGenerateRuleBypassTransitions()
	//
	Parser.bypassAltsAtnCache = {};
	
	// reset the parser's state//
	Parser.prototype.reset = function() {
		if (this._input !== null) {
			this._input.seek(0);
		}
		this._errHandler.reset(this);
		this._ctx = null;
		this._syntaxErrors = 0;
		this.setTrace(false);
		this._precedenceStack = [];
		this._precedenceStack.push(0);
		if (this._interp !== null) {
			this._interp.reset();
		}
	};
	
	// Match current input symbol against {@code ttype}. If the symbol type
	// matches, {@link ANTLRErrorStrategy//reportMatch} and {@link //consume} are
	// called to complete the match process.
	//
	// <p>If the symbol type does not match,
	// {@link ANTLRErrorStrategy//recoverInline} is called on the current error
	// strategy to attempt recovery. If {@link //getBuildParseTree} is
	// {@code true} and the token index of the symbol returned by
	// {@link ANTLRErrorStrategy//recoverInline} is -1, the symbol is added to
	// the parse tree by calling {@link ParserRuleContext//addErrorNode}.</p>
	//
	// @param ttype the token type to match
	// @return the matched symbol
	// @throws RecognitionException if the current input symbol did not match
	// {@code ttype} and the error strategy could not recover from the
	// mismatched symbol
	
	Parser.prototype.match = function(ttype) {
		var t = this.getCurrentToken();
		if (t.type === ttype) {
			this._errHandler.reportMatch(this);
			this.consume();
		} else {
			t = this._errHandler.recoverInline(this);
			if (this.buildParseTrees && t.tokenIndex === -1) {
				// we must have conjured up a new token during single token
				// insertion
				// if it's not the current symbol
				this._ctx.addErrorNode(t);
			}
		}
		return t;
	};
	// Match current input symbol as a wildcard. If the symbol type matches
	// (i.e. has a value greater than 0), {@link ANTLRErrorStrategy//reportMatch}
	// and {@link //consume} are called to complete the match process.
	//
	// <p>If the symbol type does not match,
	// {@link ANTLRErrorStrategy//recoverInline} is called on the current error
	// strategy to attempt recovery. If {@link //getBuildParseTree} is
	// {@code true} and the token index of the symbol returned by
	// {@link ANTLRErrorStrategy//recoverInline} is -1, the symbol is added to
	// the parse tree by calling {@link ParserRuleContext//addErrorNode}.</p>
	//
	// @return the matched symbol
	// @throws RecognitionException if the current input symbol did not match
	// a wildcard and the error strategy could not recover from the mismatched
	// symbol
	
	Parser.prototype.matchWildcard = function() {
		var t = this.getCurrentToken();
		if (t.type > 0) {
			this._errHandler.reportMatch(this);
			this.consume();
		} else {
			t = this._errHandler.recoverInline(this);
			if (this._buildParseTrees && t.tokenIndex === -1) {
				// we must have conjured up a new token during single token
				// insertion
				// if it's not the current symbol
				this._ctx.addErrorNode(t);
			}
		}
		return t;
	};
	
	Parser.prototype.getParseListeners = function() {
		return this._parseListeners || [];
	};
	
	// Registers {@code listener} to receive events during the parsing process.
	//
	// <p>To support output-preserving grammar transformations (including but not
	// limited to left-recursion removal, automated left-factoring, and
	// optimized code generation), calls to listener methods during the parse
	// may differ substantially from calls made by
	// {@link ParseTreeWalker//DEFAULT} used after the parse is complete. In
	// particular, rule entry and exit events may occur in a different order
	// during the parse than after the parser. In addition, calls to certain
	// rule entry methods may be omitted.</p>
	//
	// <p>With the following specific exceptions, calls to listener events are
	// <em>deterministic</em>, i.e. for identical input the calls to listener
	// methods will be the same.</p>
	//
	// <ul>
	// <li>Alterations to the grammar used to generate code may change the
	// behavior of the listener calls.</li>
	// <li>Alterations to the command line options passed to ANTLR 4 when
	// generating the parser may change the behavior of the listener calls.</li>
	// <li>Changing the version of the ANTLR Tool used to generate the parser
	// may change the behavior of the listener calls.</li>
	// </ul>
	//
	// @param listener the listener to add
	//
	// @throws NullPointerException if {@code} listener is {@code null}
	//
	Parser.prototype.addParseListener = function(listener) {
		if (listener === null) {
			throw "listener";
		}
		if (this._parseListeners === null) {
			this._parseListeners = [];
		}
		this._parseListeners.push(listener);
	};
	
	//
	// Remove {@code listener} from the list of parse listeners.
	//
	// <p>If {@code listener} is {@code null} or has not been added as a parse
	// listener, this method does nothing.</p>
	// @param listener the listener to remove
	//
	Parser.prototype.removeParseListener = function(listener) {
		if (this._parseListeners !== null) {
			var idx = this._parseListeners.indexOf(listener);
			if (idx >= 0) {
				this._parseListeners.splice(idx, 1);
			}
			if (this._parseListeners.length === 0) {
				this._parseListeners = null;
			}
		}
	};
	
	// Remove all parse listeners.
	Parser.prototype.removeParseListeners = function() {
		this._parseListeners = null;
	};
	
	// Notify any parse listeners of an enter rule event.
	Parser.prototype.triggerEnterRuleEvent = function() {
		if (this._parseListeners !== null) {
	        var ctx = this._ctx;
			this._parseListeners.map(function(listener) {
				listener.enterEveryRule(ctx);
				ctx.enterRule(listener);
			});
		}
	};
	
	//
	// Notify any parse listeners of an exit rule event.
	//
	// @see //addParseListener
	//
	Parser.prototype.triggerExitRuleEvent = function() {
		if (this._parseListeners !== null) {
			// reverse order walk of listeners
	        var ctx = this._ctx;
			this._parseListeners.slice(0).reverse().map(function(listener) {
				ctx.exitRule(listener);
				listener.exitEveryRule(ctx);
			});
		}
	};
	
	Parser.prototype.getTokenFactory = function() {
		return this._input.tokenSource._factory;
	};
	
	// Tell our token source and error strategy about a new way to create tokens.//
	Parser.prototype.setTokenFactory = function(factory) {
		this._input.tokenSource._factory = factory;
	};
	
	// The ATN with bypass alternatives is expensive to create so we create it
	// lazily.
	//
	// @throws UnsupportedOperationException if the current parser does not
	// implement the {@link //getSerializedATN()} method.
	//
	Parser.prototype.getATNWithBypassAlts = function() {
		var serializedAtn = this.getSerializedATN();
		if (serializedAtn === null) {
			throw "The current parser does not support an ATN with bypass alternatives.";
		}
		var result = this.bypassAltsAtnCache[serializedAtn];
		if (result === null) {
			var deserializationOptions = new ATNDeserializationOptions();
			deserializationOptions.generateRuleBypassTransitions = true;
			result = new ATNDeserializer(deserializationOptions)
					.deserialize(serializedAtn);
			this.bypassAltsAtnCache[serializedAtn] = result;
		}
		return result;
	};
	
	// The preferred method of getting a tree pattern. For example, here's a
	// sample use:
	//
	// <pre>
	// ParseTree t = parser.expr();
	// ParseTreePattern p = parser.compileParseTreePattern("&lt;ID&gt;+0",
	// MyParser.RULE_expr);
	// ParseTreeMatch m = p.match(t);
	// String id = m.get("ID");
	// </pre>
	
	var Lexer = __webpack_require__(13).Lexer;
	
	Parser.prototype.compileParseTreePattern = function(pattern, patternRuleIndex, lexer) {
		lexer = lexer || null;
		if (lexer === null) {
			if (this.getTokenStream() !== null) {
				var tokenSource = this.getTokenStream().getTokenSource();
				if (tokenSource instanceof Lexer) {
					lexer = tokenSource;
				}
			}
		}
		if (lexer === null) {
			throw "Parser can't discover a lexer to use";
		}
		var m = new ParseTreePatternMatcher(lexer, this);
		return m.compile(pattern, patternRuleIndex);
	};
	
	Parser.prototype.getInputStream = function() {
		return this.getTokenStream();
	};
	
	Parser.prototype.setInputStream = function(input) {
		this.setTokenStream(input);
	};
	
	Parser.prototype.getTokenStream = function() {
		return this._input;
	};
	
	// Set the token stream and reset the parser.//
	Parser.prototype.setTokenStream = function(input) {
		this._input = null;
		this.reset();
		this._input = input;
	};
	
	// Match needs to return the current input symbol, which gets put
	// into the label for the associated token ref; e.g., x=ID.
	//
	Parser.prototype.getCurrentToken = function() {
		return this._input.LT(1);
	};
	
	Parser.prototype.notifyErrorListeners = function(msg, offendingToken, err) {
		offendingToken = offendingToken || null;
		err = err || null;
		if (offendingToken === null) {
			offendingToken = this.getCurrentToken();
		}
		this._syntaxErrors += 1;
		var line = offendingToken.line;
		var column = offendingToken.column;
		var listener = this.getErrorListenerDispatch();
		listener.syntaxError(this, offendingToken, line, column, msg, err);
	};
	
	//
	// Consume and return the {@linkplain //getCurrentToken current symbol}.
	//
	// <p>E.g., given the following input with {@code A} being the current
	// lookahead symbol, this function moves the cursor to {@code B} and returns
	// {@code A}.</p>
	//
	// <pre>
	// A B
	// ^
	// </pre>
	//
	// If the parser is not in error recovery mode, the consumed symbol is added
	// to the parse tree using {@link ParserRuleContext//addChild(Token)}, and
	// {@link ParseTreeListener//visitTerminal} is called on any parse listeners.
	// If the parser <em>is</em> in error recovery mode, the consumed symbol is
	// added to the parse tree using
	// {@link ParserRuleContext//addErrorNode(Token)}, and
	// {@link ParseTreeListener//visitErrorNode} is called on any parse
	// listeners.
	//
	Parser.prototype.consume = function() {
		var o = this.getCurrentToken();
		if (o.type !== Token.EOF) {
			this.getInputStream().consume();
		}
		var hasListener = this._parseListeners !== null && this._parseListeners.length > 0;
		if (this.buildParseTrees || hasListener) {
			var node;
			if (this._errHandler.inErrorRecoveryMode(this)) {
				node = this._ctx.addErrorNode(o);
			} else {
				node = this._ctx.addTokenNode(o);
			}
			if (hasListener) {
				this._parseListeners.map(function(listener) {
					listener.visitTerminal(node);
				});
			}
		}
		return o;
	};
	
	Parser.prototype.addContextToParseTree = function() {
		// add current context to parent if we have a parent
		if (this._ctx.parentCtx !== null) {
			this._ctx.parentCtx.addChild(this._ctx);
		}
	};
	
	// Always called by generated parsers upon entry to a rule. Access field
	// {@link //_ctx} get the current context.
	
	Parser.prototype.enterRule = function(localctx, state, ruleIndex) {
		this.state = state;
		this._ctx = localctx;
		this._ctx.start = this._input.LT(1);
		if (this.buildParseTrees) {
			this.addContextToParseTree();
		}
		if (this._parseListeners !== null) {
			this.triggerEnterRuleEvent();
		}
	};
	
	Parser.prototype.exitRule = function() {
		this._ctx.stop = this._input.LT(-1);
		// trigger event on _ctx, before it reverts to parent
		if (this._parseListeners !== null) {
			this.triggerExitRuleEvent();
		}
		this.state = this._ctx.invokingState;
		this._ctx = this._ctx.parentCtx;
	};
	
	Parser.prototype.enterOuterAlt = function(localctx, altNum) {
		// if we have new localctx, make sure we replace existing ctx
		// that is previous child of parse tree
		if (this.buildParseTrees && this._ctx !== localctx) {
			if (this._ctx.parentCtx !== null) {
				this._ctx.parentCtx.removeLastChild();
				this._ctx.parentCtx.addChild(localctx);
			}
		}
		this._ctx = localctx;
	};
	
	// Get the precedence level for the top-most precedence rule.
	//
	// @return The precedence level for the top-most precedence rule, or -1 if
	// the parser context is not nested within a precedence rule.
	
	Parser.prototype.getPrecedence = function() {
		if (this._precedenceStack.length === 0) {
			return -1;
		} else {
			return this._precedenceStack[this._precedenceStack.length-1];
		}
	};
	
	Parser.prototype.enterRecursionRule = function(localctx, state, ruleIndex,
			precedence) {
		this.state = state;
		this._precedenceStack.push(precedence);
		this._ctx = localctx;
		this._ctx.start = this._input.LT(1);
		if (this._parseListeners !== null) {
			this.triggerEnterRuleEvent(); // simulates rule entry for
											// left-recursive rules
		}
	};
	
	//
	// Like {@link //enterRule} but for recursive rules.
	
	Parser.prototype.pushNewRecursionContext = function(localctx, state, ruleIndex) {
		var previous = this._ctx;
		previous.parentCtx = localctx;
		previous.invokingState = state;
		previous.stop = this._input.LT(-1);
	
		this._ctx = localctx;
		this._ctx.start = previous.start;
		if (this.buildParseTrees) {
			this._ctx.addChild(previous);
		}
		if (this._parseListeners !== null) {
			this.triggerEnterRuleEvent(); // simulates rule entry for
											// left-recursive rules
		}
	};
	
	Parser.prototype.unrollRecursionContexts = function(parentCtx) {
		this._precedenceStack.pop();
		this._ctx.stop = this._input.LT(-1);
		var retCtx = this._ctx; // save current ctx (return value)
		// unroll so _ctx is as it was before call to recursive method
		if (this._parseListeners !== null) {
			while (this._ctx !== parentCtx) {
				this.triggerExitRuleEvent();
				this._ctx = this._ctx.parentCtx;
			}
		} else {
			this._ctx = parentCtx;
		}
		// hook into tree
		retCtx.parentCtx = parentCtx;
		if (this.buildParseTrees && parentCtx !== null) {
			// add return ctx into invoking rule's tree
			parentCtx.addChild(retCtx);
		}
	};
	
	Parser.prototype.getInvokingContext = function(ruleIndex) {
		var ctx = this._ctx;
		while (ctx !== null) {
			if (ctx.ruleIndex === ruleIndex) {
				return ctx;
			}
			ctx = ctx.parentCtx;
		}
		return null;
	};
	
	Parser.prototype.precpred = function(localctx, precedence) {
		return precedence >= this._precedenceStack[this._precedenceStack.length-1];
	};
	
	Parser.prototype.inContext = function(context) {
		// TODO: useful in parser?
		return false;
	};
	
	//
	// Checks whether or not {@code symbol} can follow the current state in the
	// ATN. The behavior of this method is equivalent to the following, but is
	// implemented such that the complete context-sensitive follow set does not
	// need to be explicitly constructed.
	//
	// <pre>
	// return getExpectedTokens().contains(symbol);
	// </pre>
	//
	// @param symbol the symbol type to check
	// @return {@code true} if {@code symbol} can follow the current state in
	// the ATN, otherwise {@code false}.
	
	Parser.prototype.isExpectedToken = function(symbol) {
		var atn = this._interp.atn;
		var ctx = this._ctx;
		var s = atn.states[this.state];
		var following = atn.nextTokens(s);
		if (following.contains(symbol)) {
			return true;
		}
		if (!following.contains(Token.EPSILON)) {
			return false;
		}
		while (ctx !== null && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
			var invokingState = atn.states[ctx.invokingState];
			var rt = invokingState.transitions[0];
			following = atn.nextTokens(rt.followState);
			if (following.contains(symbol)) {
				return true;
			}
			ctx = ctx.parentCtx;
		}
		if (following.contains(Token.EPSILON) && symbol === Token.EOF) {
			return true;
		} else {
			return false;
		}
	};
	
	// Computes the set of input symbols which could follow the current parser
	// state and context, as given by {@link //getState} and {@link //getContext},
	// respectively.
	//
	// @see ATN//getExpectedTokens(int, RuleContext)
	//
	Parser.prototype.getExpectedTokens = function() {
		return this._interp.atn.getExpectedTokens(this.state, this._ctx);
	};
	
	Parser.prototype.getExpectedTokensWithinCurrentRule = function() {
		var atn = this._interp.atn;
		var s = atn.states[this.state];
		return atn.nextTokens(s);
	};
	
	// Get a rule's index (i.e., {@code RULE_ruleName} field) or -1 if not found.//
	Parser.prototype.getRuleIndex = function(ruleName) {
		var ruleIndex = this.getRuleIndexMap()[ruleName];
		if (ruleIndex !== null) {
			return ruleIndex;
		} else {
			return -1;
		}
	};
	
	// Return List&lt;String&gt; of the rule names in your parser instance
	// leading up to a call to the current rule. You could override if
	// you want more details such as the file/line info of where
	// in the ATN a rule is invoked.
	//
	// this is very useful for error messages.
	//
	Parser.prototype.getRuleInvocationStack = function(p) {
		p = p || null;
		if (p === null) {
			p = this._ctx;
		}
		var stack = [];
		while (p !== null) {
			// compute what follows who invoked us
			var ruleIndex = p.ruleIndex;
			if (ruleIndex < 0) {
				stack.push("n/a");
			} else {
				stack.push(this.ruleNames[ruleIndex]);
			}
			p = p.parentCtx;
		}
		return stack;
	};
	
	// For debugging and other purposes.//
	Parser.prototype.getDFAStrings = function() {
		return this._interp.decisionToDFA.toString();
	};
	// For debugging and other purposes.//
	Parser.prototype.dumpDFA = function() {
		var seenOne = false;
		for (var i = 0; i < this._interp.decisionToDFA.length; i++) {
			var dfa = this._interp.decisionToDFA[i];
			if (dfa.states.length > 0) {
				if (seenOne) {
					console.log();
				}
				this.printer.println("Decision " + dfa.decision + ":");
				this.printer.print(dfa.toString(this.literalNames, this.symbolicNames));
				seenOne = true;
			}
		}
	};
	
	/*
	"			printer = function() {\r\n" +
	"				this.println = function(s) { document.getElementById('output') += s + '\\n'; }\r\n" +
	"				this.print = function(s) { document.getElementById('output') += s; }\r\n" +
	"			};\r\n" +
	*/
	
	Parser.prototype.getSourceName = function() {
		return this._input.sourceName;
	};
	
	// During a parse is sometimes useful to listen in on the rule entry and exit
	// events as well as token matches. this is for quick and dirty debugging.
	//
	Parser.prototype.setTrace = function(trace) {
		if (!trace) {
			this.removeParseListener(this._tracer);
			this._tracer = null;
		} else {
			if (this._tracer !== null) {
				this.removeParseListener(this._tracer);
			}
			this._tracer = new TraceListener(this);
			this.addParseListener(this._tracer);
		}
	};
	
	exports.Parser = Parser;

/***/ },
/* 35 */
/***/ function(module, exports) {

	// [The "BSD license"]
	//  Copyright (c) 2013 Terence Parr
	//  Copyright (c) 2013 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	// Represents the type of recognizer an ATN applies to.
	
	function ATNType() {
		
	}
	
	ATNType.LEXER = 0;
	ATNType.PARSER = 1;
	
	exports.ATNType = ATNType;
	


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	// When we hit an accept state in either the DFA or the ATN, we
	//  have to notify the character stream to start buffering characters
	//  via {@link IntStream//mark} and record the current state. The current sim state
	//  includes the current index into the input, the current line,
	//  and current character position in that line. Note that the Lexer is
	//  tracking the starting line and characterization of the token. These
	//  variables track the "state" of the simulator when it hits an accept state.
	//
	//  <p>We track these variables separately for the DFA and ATN simulation
	//  because the DFA simulation often has to fail over to the ATN
	//  simulation. If the ATN simulation fails, we need the DFA to fall
	//  back to its previously accepted state, if any. If the ATN succeeds,
	//  then the ATN does the accept and the DFA simulator that invoked it
	//  can simply return the predicted token type.</p>
	///
	
	var Token = __webpack_require__(1).Token;
	var Lexer = __webpack_require__(13).Lexer;
	var ATN = __webpack_require__(9).ATN;
	var ATNSimulator = __webpack_require__(24).ATNSimulator;
	var DFAState = __webpack_require__(11).DFAState;
	var ATNConfigSet = __webpack_require__(10).ATNConfigSet;
	var OrderedATNConfigSet = __webpack_require__(10).OrderedATNConfigSet;
	var PredictionContext = __webpack_require__(4).PredictionContext;
	var SingletonPredictionContext = __webpack_require__(4).SingletonPredictionContext;
	var RuleStopState = __webpack_require__(7).RuleStopState;
	var LexerATNConfig = __webpack_require__(19).LexerATNConfig;
	var Transition = __webpack_require__(8).Transition;
	var LexerActionExecutor = __webpack_require__(37).LexerActionExecutor;
	var LexerNoViableAltException = __webpack_require__(5).LexerNoViableAltException;
	
	function resetSimState(sim) {
		sim.index = -1;
		sim.line = 0;
		sim.column = -1;
		sim.dfaState = null;
	}
	
	function SimState() {
		resetSimState(this);
		return this;
	}
	
	SimState.prototype.reset = function() {
		resetSimState(this);
	};
	
	function LexerATNSimulator(recog, atn, decisionToDFA, sharedContextCache) {
		ATNSimulator.call(this, atn, sharedContextCache);
		this.decisionToDFA = decisionToDFA;
		this.recog = recog;
		// The current token's starting index into the character stream.
		// Shared across DFA to ATN simulation in case the ATN fails and the
		// DFA did not have a previous accept state. In this case, we use the
		// ATN-generated exception object.
		this.startIndex = -1;
		// line number 1..n within the input///
		this.line = 1;
		// The index of the character relative to the beginning of the line
		// 0..n-1///
		this.column = 0;
		this.mode = Lexer.DEFAULT_MODE;
		// Used during DFA/ATN exec to record the most recent accept configuration
		// info
		this.prevAccept = new SimState();
		// done
		return this;
	}
	
	LexerATNSimulator.prototype = Object.create(ATNSimulator.prototype);
	LexerATNSimulator.prototype.constructor = LexerATNSimulator;
	
	LexerATNSimulator.debug = false;
	LexerATNSimulator.dfa_debug = false;
	
	LexerATNSimulator.MIN_DFA_EDGE = 0;
	LexerATNSimulator.MAX_DFA_EDGE = 127; // forces unicode to stay in ATN
	
	LexerATNSimulator.match_calls = 0;
	
	LexerATNSimulator.prototype.copyState = function(simulator) {
		this.column = simulator.column;
		this.line = simulator.line;
		this.mode = simulator.mode;
		this.startIndex = simulator.startIndex;
	};
	
	LexerATNSimulator.prototype.match = function(input, mode) {
		this.match_calls += 1;
		this.mode = mode;
		var mark = input.mark();
		try {
			this.startIndex = input.index;
			this.prevAccept.reset();
			var dfa = this.decisionToDFA[mode];
			if (dfa.s0 === null) {
				return this.matchATN(input);
			} else {
				return this.execATN(input, dfa.s0);
			}
		} finally {
			input.release(mark);
		}
	};
	
	LexerATNSimulator.prototype.reset = function() {
		this.prevAccept.reset();
		this.startIndex = -1;
		this.line = 1;
		this.column = 0;
		this.mode = Lexer.DEFAULT_MODE;
	};
	
	LexerATNSimulator.prototype.matchATN = function(input) {
		var startState = this.atn.modeToStartState[this.mode];
	
		if (this.debug) {
			console.log("matchATN mode " + this.mode + " start: " + startState);
		}
		var old_mode = this.mode;
		var s0_closure = this.computeStartState(input, startState);
		var suppressEdge = s0_closure.hasSemanticContext;
		s0_closure.hasSemanticContext = false;
	
		var next = this.addDFAState(s0_closure);
		if (!suppressEdge) {
			this.decisionToDFA[this.mode].s0 = next;
		}
	
		var predict = this.execATN(input, next);
	
		if (this.debug) {
			console.log("DFA after matchATN: " + this.decisionToDFA[old_mode].toLexerString());
		}
		return predict;
	};
	
	LexerATNSimulator.prototype.execATN = function(input, ds0) {
		if (this.debug) {
			console.log("start state closure=" + ds0.configs);
		}
		if (ds0.isAcceptState) {
			// allow zero-length tokens
			this.captureSimState(this.prevAccept, input, ds0);
		}
		var t = input.LA(1);
		var s = ds0; // s is current/from DFA state
	
		while (true) { // while more work
			if (this.debug) {
				console.log("execATN loop starting closure: " + s.configs);
			}
	
			// As we move src->trg, src->trg, we keep track of the previous trg to
			// avoid looking up the DFA state again, which is expensive.
			// If the previous target was already part of the DFA, we might
			// be able to avoid doing a reach operation upon t. If s!=null,
			// it means that semantic predicates didn't prevent us from
			// creating a DFA state. Once we know s!=null, we check to see if
			// the DFA state has an edge already for t. If so, we can just reuse
			// it's configuration set; there's no point in re-computing it.
			// This is kind of like doing DFA simulation within the ATN
			// simulation because DFA simulation is really just a way to avoid
			// computing reach/closure sets. Technically, once we know that
			// we have a previously added DFA state, we could jump over to
			// the DFA simulator. But, that would mean popping back and forth
			// a lot and making things more complicated algorithmically.
			// This optimization makes a lot of sense for loops within DFA.
			// A character will take us back to an existing DFA state
			// that already has lots of edges out of it. e.g., .* in comments.
			// print("Target for:" + str(s) + " and:" + str(t))
			var target = this.getExistingTargetState(s, t);
			// print("Existing:" + str(target))
			if (target === null) {
				target = this.computeTargetState(input, s, t);
				// print("Computed:" + str(target))
			}
			if (target === ATNSimulator.ERROR) {
				break;
			}
			// If this is a consumable input element, make sure to consume before
			// capturing the accept state so the input index, line, and char
			// position accurately reflect the state of the interpreter at the
			// end of the token.
			if (t !== Token.EOF) {
				this.consume(input);
			}
			if (target.isAcceptState) {
				this.captureSimState(this.prevAccept, input, target);
				if (t === Token.EOF) {
					break;
				}
			}
			t = input.LA(1);
			s = target; // flip; current DFA target becomes new src/from state
		}
		return this.failOrAccept(this.prevAccept, input, s.configs, t);
	};
	
	// Get an existing target state for an edge in the DFA. If the target state
	// for the edge has not yet been computed or is otherwise not available,
	// this method returns {@code null}.
	//
	// @param s The current DFA state
	// @param t The next input symbol
	// @return The existing target DFA state for the given input symbol
	// {@code t}, or {@code null} if the target state for this edge is not
	// already cached
	LexerATNSimulator.prototype.getExistingTargetState = function(s, t) {
		if (s.edges === null || t < LexerATNSimulator.MIN_DFA_EDGE || t > LexerATNSimulator.MAX_DFA_EDGE) {
			return null;
		}
	
		var target = s.edges[t - LexerATNSimulator.MIN_DFA_EDGE];
		if(target===undefined) {
			target = null;
		}
		if (this.debug && target !== null) {
			console.log("reuse state " + s.stateNumber + " edge to " + target.stateNumber);
		}
		return target;
	};
	
	// Compute a target state for an edge in the DFA, and attempt to add the
	// computed state and corresponding edge to the DFA.
	//
	// @param input The input stream
	// @param s The current DFA state
	// @param t The next input symbol
	//
	// @return The computed target DFA state for the given input symbol
	// {@code t}. If {@code t} does not lead to a valid DFA state, this method
	// returns {@link //ERROR}.
	LexerATNSimulator.prototype.computeTargetState = function(input, s, t) {
		var reach = new OrderedATNConfigSet();
		// if we don't find an existing DFA state
		// Fill reach starting from closure, following t transitions
		this.getReachableConfigSet(input, s.configs, reach, t);
	
		if (reach.items.length === 0) { // we got nowhere on t from s
			if (!reach.hasSemanticContext) {
				// we got nowhere on t, don't throw out this knowledge; it'd
				// cause a failover from DFA later.
				this.addDFAEdge(s, t, ATNSimulator.ERROR);
			}
			// stop when we can't match any more char
			return ATNSimulator.ERROR;
		}
		// Add an edge from s to target DFA found/created for reach
		return this.addDFAEdge(s, t, null, reach);
	};
	
	LexerATNSimulator.prototype.failOrAccept = function(prevAccept, input, reach, t) {
		if (this.prevAccept.dfaState !== null) {
			var lexerActionExecutor = prevAccept.dfaState.lexerActionExecutor;
			this.accept(input, lexerActionExecutor, this.startIndex,
					prevAccept.index, prevAccept.line, prevAccept.column);
			return prevAccept.dfaState.prediction;
		} else {
			// if no accept and EOF is first char, return EOF
			if (t === Token.EOF && input.index === this.startIndex) {
				return Token.EOF;
			}
			throw new LexerNoViableAltException(this.recog, input, this.startIndex, reach);
		}
	};
	
	// Given a starting configuration set, figure out all ATN configurations
	// we can reach upon input {@code t}. Parameter {@code reach} is a return
	// parameter.
	LexerATNSimulator.prototype.getReachableConfigSet = function(input, closure,
			reach, t) {
		// this is used to skip processing for configs which have a lower priority
		// than a config that already reached an accept state for the same rule
		var skipAlt = ATN.INVALID_ALT_NUMBER;
		for (var i = 0; i < closure.items.length; i++) {
			var cfg = closure.items[i];
			var currentAltReachedAcceptState = (cfg.alt === skipAlt);
			if (currentAltReachedAcceptState && cfg.passedThroughNonGreedyDecision) {
				continue;
			}
			if (this.debug) {
				console.log("testing %s at %s\n", this.getTokenName(t), cfg
						.toString(this.recog, true));
			}
			for (var j = 0; j < cfg.state.transitions.length; j++) {
				var trans = cfg.state.transitions[j]; // for each transition
				var target = this.getReachableTarget(trans, t);
				if (target !== null) {
					var lexerActionExecutor = cfg.lexerActionExecutor;
					if (lexerActionExecutor !== null) {
						lexerActionExecutor = lexerActionExecutor.fixOffsetBeforeMatch(input.index - this.startIndex);
					}
					var treatEofAsEpsilon = (t === Token.EOF);
					var config = new LexerATNConfig({state:target, lexerActionExecutor:lexerActionExecutor}, cfg);
					if (this.closure(input, config, reach,
							currentAltReachedAcceptState, true, treatEofAsEpsilon)) {
						// any remaining configs for this alt have a lower priority
						// than the one that just reached an accept state.
						skipAlt = cfg.alt;
					}
				}
			}
		}
	};
	
	LexerATNSimulator.prototype.accept = function(input, lexerActionExecutor,
			startIndex, index, line, charPos) {
		if (this.debug) {
			console.log("ACTION %s\n", lexerActionExecutor);
		}
		// seek to after last char in token
		input.seek(index);
		this.line = line;
		this.column = charPos;
		if (lexerActionExecutor !== null && this.recog !== null) {
			lexerActionExecutor.execute(this.recog, input, startIndex);
		}
	};
	
	LexerATNSimulator.prototype.getReachableTarget = function(trans, t) {
		if (trans.matches(t, 0, 0xFFFE)) {
			return trans.target;
		} else {
			return null;
		}
	};
	
	LexerATNSimulator.prototype.computeStartState = function(input, p) {
		var initialContext = PredictionContext.EMPTY;
		var configs = new OrderedATNConfigSet();
		for (var i = 0; i < p.transitions.length; i++) {
			var target = p.transitions[i].target;
	        var cfg = new LexerATNConfig({state:target, alt:i+1, context:initialContext}, null);
			this.closure(input, cfg, configs, false, false, false);
		}
		return configs;
	};
	
	// Since the alternatives within any lexer decision are ordered by
	// preference, this method stops pursuing the closure as soon as an accept
	// state is reached. After the first accept state is reached by depth-first
	// search from {@code config}, all other (potentially reachable) states for
	// this rule would have a lower priority.
	//
	// @return {@code true} if an accept state is reached, otherwise
	// {@code false}.
	LexerATNSimulator.prototype.closure = function(input, config, configs,
			currentAltReachedAcceptState, speculative, treatEofAsEpsilon) {
		var cfg = null;
		if (this.debug) {
			console.log("closure(" + config.toString(this.recog, true) + ")");
		}
		if (config.state instanceof RuleStopState) {
			if (this.debug) {
				if (this.recog !== null) {
					console.log("closure at %s rule stop %s\n", this.recog.getRuleNames()[config.state.ruleIndex], config);
				} else {
					console.log("closure at rule stop %s\n", config);
				}
			}
			if (config.context === null || config.context.hasEmptyPath()) {
				if (config.context === null || config.context.isEmpty()) {
					configs.add(config);
					return true;
				} else {
					configs.add(new LexerATNConfig({ state:config.state, context:PredictionContext.EMPTY}, config));
					currentAltReachedAcceptState = true;
				}
			}
			if (config.context !== null && !config.context.isEmpty()) {
				for (var i = 0; i < config.context.length; i++) {
					if (config.context.getReturnState(i) !== PredictionContext.EMPTY_RETURN_STATE) {
						var newContext = config.context.getParent(i); // "pop" return state
						var returnState = this.atn.states[config.context.getReturnState(i)];
						cfg = new LexerATNConfig({ state:returnState, context:newContext }, config);
						currentAltReachedAcceptState = this.closure(input, cfg,
								configs, currentAltReachedAcceptState, speculative,
								treatEofAsEpsilon);
					}
				}
			}
			return currentAltReachedAcceptState;
		}
		// optimization
		if (!config.state.epsilonOnlyTransitions) {
			if (!currentAltReachedAcceptState || !config.passedThroughNonGreedyDecision) {
				configs.add(config);
			}
		}
		for (var j = 0; j < config.state.transitions.length; j++) {
			var trans = config.state.transitions[j];
			cfg = this.getEpsilonTarget(input, config, trans, configs, speculative, treatEofAsEpsilon);
			if (cfg !== null) {
				currentAltReachedAcceptState = this.closure(input, cfg, configs,
						currentAltReachedAcceptState, speculative, treatEofAsEpsilon);
			}
		}
		return currentAltReachedAcceptState;
	};
	
	// side-effect: can alter configs.hasSemanticContext
	LexerATNSimulator.prototype.getEpsilonTarget = function(input, config, trans,
			configs, speculative, treatEofAsEpsilon) {
		var cfg = null;
		if (trans.serializationType === Transition.RULE) {
			var newContext = SingletonPredictionContext.create(config.context, trans.followState.stateNumber);
			cfg = new LexerATNConfig( { state:trans.target, context:newContext}, config);
		} else if (trans.serializationType === Transition.PRECEDENCE) {
			throw "Precedence predicates are not supported in lexers.";
		} else if (trans.serializationType === Transition.PREDICATE) {
			// Track traversing semantic predicates. If we traverse,
			// we cannot add a DFA state for this "reach" computation
			// because the DFA would not test the predicate again in the
			// future. Rather than creating collections of semantic predicates
			// like v3 and testing them on prediction, v4 will test them on the
			// fly all the time using the ATN not the DFA. This is slower but
			// semantically it's not used that often. One of the key elements to
			// this predicate mechanism is not adding DFA states that see
			// predicates immediately afterwards in the ATN. For example,
	
			// a : ID {p1}? | ID {p2}? ;
	
			// should create the start state for rule 'a' (to save start state
			// competition), but should not create target of ID state. The
			// collection of ATN states the following ID references includes
			// states reached by traversing predicates. Since this is when we
			// test them, we cannot cash the DFA state target of ID.
	
			if (this.debug) {
				console.log("EVAL rule " + trans.ruleIndex + ":" + trans.predIndex);
			}
			configs.hasSemanticContext = true;
			if (this.evaluatePredicate(input, trans.ruleIndex, trans.predIndex, speculative)) {
				cfg = new LexerATNConfig({ state:trans.target}, config);
			}
		} else if (trans.serializationType === Transition.ACTION) {
			if (config.context === null || config.context.hasEmptyPath()) {
				// execute actions anywhere in the start rule for a token.
				//
				// TODO: if the entry rule is invoked recursively, some
				// actions may be executed during the recursive call. The
				// problem can appear when hasEmptyPath() is true but
				// isEmpty() is false. In this case, the config needs to be
				// split into two contexts - one with just the empty path
				// and another with everything but the empty path.
				// Unfortunately, the current algorithm does not allow
				// getEpsilonTarget to return two configurations, so
				// additional modifications are needed before we can support
				// the split operation.
				var lexerActionExecutor = LexerActionExecutor.append(config.lexerActionExecutor,
						this.atn.lexerActions[trans.actionIndex]);
				cfg = new LexerATNConfig({ state:trans.target, lexerActionExecutor:lexerActionExecutor }, config);
			} else {
				// ignore actions in referenced rules
				cfg = new LexerATNConfig( { state:trans.target}, config);
			}
		} else if (trans.serializationType === Transition.EPSILON) {
			cfg = new LexerATNConfig({ state:trans.target}, config);
		} else if (trans.serializationType === Transition.ATOM ||
					trans.serializationType === Transition.RANGE ||
					trans.serializationType === Transition.SET) {
			if (treatEofAsEpsilon) {
				if (trans.matches(Token.EOF, 0, 0xFFFF)) {
					cfg = new LexerATNConfig( { state:trans.target }, config);
				}
			}
		}
		return cfg;
	};
	
	// Evaluate a predicate specified in the lexer.
	//
	// <p>If {@code speculative} is {@code true}, this method was called before
	// {@link //consume} for the matched character. This method should call
	// {@link //consume} before evaluating the predicate to ensure position
	// sensitive values, including {@link Lexer//getText}, {@link Lexer//getLine},
	// and {@link Lexer//getcolumn}, properly reflect the current
	// lexer state. This method should restore {@code input} and the simulator
	// to the original state before returning (i.e. undo the actions made by the
	// call to {@link //consume}.</p>
	//
	// @param input The input stream.
	// @param ruleIndex The rule containing the predicate.
	// @param predIndex The index of the predicate within the rule.
	// @param speculative {@code true} if the current index in {@code input} is
	// one character before the predicate's location.
	//
	// @return {@code true} if the specified predicate evaluates to
	// {@code true}.
	// /
	LexerATNSimulator.prototype.evaluatePredicate = function(input, ruleIndex,
			predIndex, speculative) {
		// assume true if no recognizer was provided
		if (this.recog === null) {
			return true;
		}
		if (!speculative) {
			return this.recog.sempred(null, ruleIndex, predIndex);
		}
		var savedcolumn = this.column;
		var savedLine = this.line;
		var index = input.index;
		var marker = input.mark();
		try {
			this.consume(input);
			return this.recog.sempred(null, ruleIndex, predIndex);
		} finally {
			this.column = savedcolumn;
			this.line = savedLine;
			input.seek(index);
			input.release(marker);
		}
	};
	
	LexerATNSimulator.prototype.captureSimState = function(settings, input, dfaState) {
		settings.index = input.index;
		settings.line = this.line;
		settings.column = this.column;
		settings.dfaState = dfaState;
	};
	
	LexerATNSimulator.prototype.addDFAEdge = function(from_, tk, to, cfgs) {
		if (to === undefined) {
			to = null;
		}
		if (cfgs === undefined) {
			cfgs = null;
		}
		if (to === null && cfgs !== null) {
			// leading to this call, ATNConfigSet.hasSemanticContext is used as a
			// marker indicating dynamic predicate evaluation makes this edge
			// dependent on the specific input sequence, so the static edge in the
			// DFA should be omitted. The target DFAState is still created since
			// execATN has the ability to resynchronize with the DFA state cache
			// following the predicate evaluation step.
			//
			// TJP notes: next time through the DFA, we see a pred again and eval.
			// If that gets us to a previously created (but dangling) DFA
			// state, we can continue in pure DFA mode from there.
			// /
			var suppressEdge = cfgs.hasSemanticContext;
			cfgs.hasSemanticContext = false;
	
			to = this.addDFAState(cfgs);
	
			if (suppressEdge) {
				return to;
			}
		}
		// add the edge
		if (tk < LexerATNSimulator.MIN_DFA_EDGE || tk > LexerATNSimulator.MAX_DFA_EDGE) {
			// Only track edges within the DFA bounds
			return to;
		}
		if (this.debug) {
			console.log("EDGE " + from_ + " -> " + to + " upon " + tk);
		}
		if (from_.edges === null) {
			// make room for tokens 1..n and -1 masquerading as index 0
			from_.edges = [];
		}
		from_.edges[tk - LexerATNSimulator.MIN_DFA_EDGE] = to; // connect
	
		return to;
	};
	
	// Add a new DFA state if there isn't one with this set of
	// configurations already. This method also detects the first
	// configuration containing an ATN rule stop state. Later, when
	// traversing the DFA, we will know which rule to accept.
	LexerATNSimulator.prototype.addDFAState = function(configs) {
		var proposed = new DFAState(null, configs);
		var firstConfigWithRuleStopState = null;
		for (var i = 0; i < configs.items.length; i++) {
			var cfg = configs.items[i];
			if (cfg.state instanceof RuleStopState) {
				firstConfigWithRuleStopState = cfg;
				break;
			}
		}
		if (firstConfigWithRuleStopState !== null) {
			proposed.isAcceptState = true;
			proposed.lexerActionExecutor = firstConfigWithRuleStopState.lexerActionExecutor;
			proposed.prediction = this.atn.ruleToTokenType[firstConfigWithRuleStopState.state.ruleIndex];
		}
		var hash = proposed.hashString();
		var dfa = this.decisionToDFA[this.mode];
		var existing = dfa.states[hash] || null;
		if (existing!==null) {
			return existing;
		}
		var newState = proposed;
		newState.stateNumber = dfa.states.length;
		configs.setReadonly(true);
		newState.configs = configs;
		dfa.states[hash] = newState;
		return newState;
	};
	
	LexerATNSimulator.prototype.getDFA = function(mode) {
		return this.decisionToDFA[mode];
	};
	
	// Get the text matched so far for the current token.
	LexerATNSimulator.prototype.getText = function(input) {
		// index is first lookahead char, don't include.
		return input.getText(this.startIndex, input.index - 1);
	};
	
	LexerATNSimulator.prototype.consume = function(input) {
		var curChar = input.LA(1);
		if (curChar === "\n".charCodeAt(0)) {
			this.line += 1;
			this.column = 0;
		} else {
			this.column += 1;
		}
		input.consume();
	};
	
	LexerATNSimulator.prototype.getTokenName = function(tt) {
		if (tt === -1) {
			return "EOF";
		} else {
			return "'" + String.fromCharCode(tt) + "'";
		}
	};
	
	exports.LexerATNSimulator = LexerATNSimulator;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2013 Terence Parr
	//  Copyright (c) 2013 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	
	// Represents an executor for a sequence of lexer actions which traversed during
	// the matching operation of a lexer rule (token).
	//
	// <p>The executor tracks position information for position-dependent lexer actions
	// efficiently, ensuring that actions appearing only at the end of the rule do
	// not cause bloating of the {@link DFA} created for the lexer.</p>
	
	var LexerIndexedCustomAction = __webpack_require__(25).LexerIndexedCustomAction;
	
	function LexerActionExecutor(lexerActions) {
		this.lexerActions = lexerActions === null ? [] : lexerActions;
		// Caches the result of {@link //hashCode} since the hash code is an element
		// of the performance-critical {@link LexerATNConfig//hashCode} operation.
		this.hashString = lexerActions.toString(); // "".join([str(la) for la in
		// lexerActions]))
		return this;
	}
	
	// Creates a {@link LexerActionExecutor} which executes the actions for
	// the input {@code lexerActionExecutor} followed by a specified
	// {@code lexerAction}.
	//
	// @param lexerActionExecutor The executor for actions already traversed by
	// the lexer while matching a token within a particular
	// {@link LexerATNConfig}. If this is {@code null}, the method behaves as
	// though it were an empty executor.
	// @param lexerAction The lexer action to execute after the actions
	// specified in {@code lexerActionExecutor}.
	//
	// @return A {@link LexerActionExecutor} for executing the combine actions
	// of {@code lexerActionExecutor} and {@code lexerAction}.
	LexerActionExecutor.append = function(lexerActionExecutor, lexerAction) {
		if (lexerActionExecutor === null) {
			return new LexerActionExecutor([ lexerAction ]);
		}
		var lexerActions = lexerActionExecutor.lexerActions.concat([ lexerAction ]);
		return new LexerActionExecutor(lexerActions);
	};
	
	// Creates a {@link LexerActionExecutor} which encodes the current offset
	// for position-dependent lexer actions.
	//
	// <p>Normally, when the executor encounters lexer actions where
	// {@link LexerAction//isPositionDependent} returns {@code true}, it calls
	// {@link IntStream//seek} on the input {@link CharStream} to set the input
	// position to the <em>end</em> of the current token. This behavior provides
	// for efficient DFA representation of lexer actions which appear at the end
	// of a lexer rule, even when the lexer rule matches a variable number of
	// characters.</p>
	//
	// <p>Prior to traversing a match transition in the ATN, the current offset
	// from the token start index is assigned to all position-dependent lexer
	// actions which have not already been assigned a fixed offset. By storing
	// the offsets relative to the token start index, the DFA representation of
	// lexer actions which appear in the middle of tokens remains efficient due
	// to sharing among tokens of the same length, regardless of their absolute
	// position in the input stream.</p>
	//
	// <p>If the current executor already has offsets assigned to all
	// position-dependent lexer actions, the method returns {@code this}.</p>
	//
	// @param offset The current offset to assign to all position-dependent
	// lexer actions which do not already have offsets assigned.
	//
	// @return A {@link LexerActionExecutor} which stores input stream offsets
	// for all position-dependent lexer actions.
	// /
	LexerActionExecutor.prototype.fixOffsetBeforeMatch = function(offset) {
		var updatedLexerActions = null;
		for (var i = 0; i < this.lexerActions.length; i++) {
			if (this.lexerActions[i].isPositionDependent &&
					!(this.lexerActions[i] instanceof LexerIndexedCustomAction)) {
				if (updatedLexerActions === null) {
					updatedLexerActions = this.lexerActions.concat([]);
				}
				updatedLexerActions[i] = new LexerIndexedCustomAction(offset,
						this.lexerActions[i]);
			}
		}
		if (updatedLexerActions === null) {
			return this;
		} else {
			return new LexerActionExecutor(updatedLexerActions);
		}
	};
	
	// Execute the actions encapsulated by this executor within the context of a
	// particular {@link Lexer}.
	//
	// <p>This method calls {@link IntStream//seek} to set the position of the
	// {@code input} {@link CharStream} prior to calling
	// {@link LexerAction//execute} on a position-dependent action. Before the
	// method returns, the input position will be restored to the same position
	// it was in when the method was invoked.</p>
	//
	// @param lexer The lexer instance.
	// @param input The input stream which is the source for the current token.
	// When this method is called, the current {@link IntStream//index} for
	// {@code input} should be the start of the following token, i.e. 1
	// character past the end of the current token.
	// @param startIndex The token start index. This value may be passed to
	// {@link IntStream//seek} to set the {@code input} position to the beginning
	// of the token.
	// /
	LexerActionExecutor.prototype.execute = function(lexer, input, startIndex) {
		var requiresSeek = false;
		var stopIndex = input.index;
		try {
			for (var i = 0; i < this.lexerActions.length; i++) {
				var lexerAction = this.lexerActions[i];
				if (lexerAction instanceof LexerIndexedCustomAction) {
					var offset = lexerAction.offset;
					input.seek(startIndex + offset);
					lexerAction = lexerAction.action;
					requiresSeek = (startIndex + offset) !== stopIndex;
				} else if (lexerAction.isPositionDependent) {
					input.seek(stopIndex);
					requiresSeek = false;
				}
				lexerAction.execute(lexer);
			}
		} finally {
			if (requiresSeek) {
				input.seek(stopIndex);
			}
		}
	};
	
	LexerActionExecutor.prototype.hashString = function() {
		return this.hashString;
	};
	
	LexerActionExecutor.prototype.equals = function(other) {
		if (this === other) {
			return true;
		} else if (!(other instanceof LexerActionExecutor)) {
			return false;
		} else {
			return this.hashString === other.hashString &&
					this.lexerActions === other.lexerActions;
		}
	};
	
	exports.LexerActionExecutor = LexerActionExecutor;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	
	//
	// The embodiment of the adaptive LL(*), ALL(*), parsing strategy.
	//
	// <p>
	// The basic complexity of the adaptive strategy makes it harder to understand.
	// We begin with ATN simulation to build paths in a DFA. Subsequent prediction
	// requests go through the DFA first. If they reach a state without an edge for
	// the current symbol, the algorithm fails over to the ATN simulation to
	// complete the DFA path for the current input (until it finds a conflict state
	// or uniquely predicting state).</p>
	//
	// <p>
	// All of that is done without using the outer context because we want to create
	// a DFA that is not dependent upon the rule invocation stack when we do a
	// prediction. One DFA works in all contexts. We avoid using context not
	// necessarily because it's slower, although it can be, but because of the DFA
	// caching problem. The closure routine only considers the rule invocation stack
	// created during prediction beginning in the decision rule. For example, if
	// prediction occurs without invoking another rule's ATN, there are no context
	// stacks in the configurations. When lack of context leads to a conflict, we
	// don't know if it's an ambiguity or a weakness in the strong LL(*) parsing
	// strategy (versus full LL(*)).</p>
	//
	// <p>
	// When SLL yields a configuration set with conflict, we rewind the input and
	// retry the ATN simulation, this time using full outer context without adding
	// to the DFA. Configuration context stacks will be the full invocation stacks
	// from the start rule. If we get a conflict using full context, then we can
	// definitively say we have a true ambiguity for that input sequence. If we
	// don't get a conflict, it implies that the decision is sensitive to the outer
	// context. (It is not context-sensitive in the sense of context-sensitive
	// grammars.)</p>
	//
	// <p>
	// The next time we reach this DFA state with an SLL conflict, through DFA
	// simulation, we will again retry the ATN simulation using full context mode.
	// This is slow because we can't save the results and have to "interpret" the
	// ATN each time we get that input.</p>
	//
	// <p>
	// <strong>CACHING FULL CONTEXT PREDICTIONS</strong></p>
	//
	// <p>
	// We could cache results from full context to predicted alternative easily and
	// that saves a lot of time but doesn't work in presence of predicates. The set
	// of visible predicates from the ATN start state changes depending on the
	// context, because closure can fall off the end of a rule. I tried to cache
	// tuples (stack context, semantic context, predicted alt) but it was slower
	// than interpreting and much more complicated. Also required a huge amount of
	// memory. The goal is not to create the world's fastest parser anyway. I'd like
	// to keep this algorithm simple. By launching multiple threads, we can improve
	// the speed of parsing across a large number of files.</p>
	//
	// <p>
	// There is no strict ordering between the amount of input used by SLL vs LL,
	// which makes it really hard to build a cache for full context. Let's say that
	// we have input A B C that leads to an SLL conflict with full context X. That
	// implies that using X we might only use A B but we could also use A B C D to
	// resolve conflict. Input A B C D could predict alternative 1 in one position
	// in the input and A B C E could predict alternative 2 in another position in
	// input. The conflicting SLL configurations could still be non-unique in the
	// full context prediction, which would lead us to requiring more input than the
	// original A B C.	To make a	prediction cache work, we have to track	the exact
	// input	used during the previous prediction. That amounts to a cache that maps
	// X to a specific DFA for that context.</p>
	//
	// <p>
	// Something should be done for left-recursive expression predictions. They are
	// likely LL(1) + pred eval. Easier to do the whole SLL unless error and retry
	// with full LL thing Sam does.</p>
	//
	// <p>
	// <strong>AVOIDING FULL CONTEXT PREDICTION</strong></p>
	//
	// <p>
	// We avoid doing full context retry when the outer context is empty, we did not
	// dip into the outer context by falling off the end of the decision state rule,
	// or when we force SLL mode.</p>
	//
	// <p>
	// As an example of the not dip into outer context case, consider as super
	// constructor calls versus function calls. One grammar might look like
	// this:</p>
	//
	// <pre>
	// ctorBody
	//   : '{' superCall? stat* '}'
	//   ;
	// </pre>
	//
	// <p>
	// Or, you might see something like</p>
	//
	// <pre>
	// stat
	//   : superCall ';'
	//   | expression ';'
	//   | ...
	//   ;
	// </pre>
	//
	// <p>
	// In both cases I believe that no closure operations will dip into the outer
	// context. In the first case ctorBody in the worst case will stop at the '}'.
	// In the 2nd case it should stop at the ';'. Both cases should stay within the
	// entry rule and not dip into the outer context.</p>
	//
	// <p>
	// <strong>PREDICATES</strong></p>
	//
	// <p>
	// Predicates are always evaluated if present in either SLL or LL both. SLL and
	// LL simulation deals with predicates differently. SLL collects predicates as
	// it performs closure operations like ANTLR v3 did. It delays predicate
	// evaluation until it reaches and accept state. This allows us to cache the SLL
	// ATN simulation whereas, if we had evaluated predicates on-the-fly during
	// closure, the DFA state configuration sets would be different and we couldn't
	// build up a suitable DFA.</p>
	//
	// <p>
	// When building a DFA accept state during ATN simulation, we evaluate any
	// predicates and return the sole semantically valid alternative. If there is
	// more than 1 alternative, we report an ambiguity. If there are 0 alternatives,
	// we throw an exception. Alternatives without predicates act like they have
	// true predicates. The simple way to think about it is to strip away all
	// alternatives with false predicates and choose the minimum alternative that
	// remains.</p>
	//
	// <p>
	// When we start in the DFA and reach an accept state that's predicated, we test
	// those and return the minimum semantically viable alternative. If no
	// alternatives are viable, we throw an exception.</p>
	//
	// <p>
	// During full LL ATN simulation, closure always evaluates predicates and
	// on-the-fly. This is crucial to reducing the configuration set size during
	// closure. It hits a landmine when parsing with the Java grammar, for example,
	// without this on-the-fly evaluation.</p>
	//
	// <p>
	// <strong>SHARING DFA</strong></p>
	//
	// <p>
	// All instances of the same parser share the same decision DFAs through a
	// static field. Each instance gets its own ATN simulator but they share the
	// same {@link //decisionToDFA} field. They also share a
	// {@link PredictionContextCache} object that makes sure that all
	// {@link PredictionContext} objects are shared among the DFA states. This makes
	// a big size difference.</p>
	//
	// <p>
	// <strong>THREAD SAFETY</strong></p>
	//
	// <p>
	// The {@link ParserATNSimulator} locks on the {@link //decisionToDFA} field when
	// it adds a new DFA object to that array. {@link //addDFAEdge}
	// locks on the DFA for the current decision when setting the
	// {@link DFAState//edges} field. {@link //addDFAState} locks on
	// the DFA for the current decision when looking up a DFA state to see if it
	// already exists. We must make sure that all requests to add DFA states that
	// are equivalent result in the same shared DFA object. This is because lots of
	// threads will be trying to update the DFA at once. The
	// {@link //addDFAState} method also locks inside the DFA lock
	// but this time on the shared context cache when it rebuilds the
	// configurations' {@link PredictionContext} objects using cached
	// subgraphs/nodes. No other locking occurs, even during DFA simulation. This is
	// safe as long as we can guarantee that all threads referencing
	// {@code s.edge[t]} get the same physical target {@link DFAState}, or
	// {@code null}. Once into the DFA, the DFA simulation does not reference the
	// {@link DFA//states} map. It follows the {@link DFAState//edges} field to new
	// targets. The DFA simulator will either find {@link DFAState//edges} to be
	// {@code null}, to be non-{@code null} and {@code dfa.edges[t]} null, or
	// {@code dfa.edges[t]} to be non-null. The
	// {@link //addDFAEdge} method could be racing to set the field
	// but in either case the DFA simulator works; if {@code null}, and requests ATN
	// simulation. It could also race trying to get {@code dfa.edges[t]}, but either
	// way it will work because it's not doing a test and set operation.</p>
	//
	// <p>
	// <strong>Starting with SLL then failing to combined SLL/LL (Two-Stage
	// Parsing)</strong></p>
	//
	// <p>
	// Sam pointed out that if SLL does not give a syntax error, then there is no
	// point in doing full LL, which is slower. We only have to try LL if we get a
	// syntax error. For maximum speed, Sam starts the parser set to pure SLL
	// mode with the {@link BailErrorStrategy}:</p>
	//
	// <pre>
	// parser.{@link Parser//getInterpreter() getInterpreter()}.{@link //setPredictionMode setPredictionMode}{@code (}{@link PredictionMode//SLL}{@code )};
	// parser.{@link Parser//setErrorHandler setErrorHandler}(new {@link BailErrorStrategy}());
	// </pre>
	//
	// <p>
	// If it does not get a syntax error, then we're done. If it does get a syntax
	// error, we need to retry with the combined SLL/LL strategy.</p>
	//
	// <p>
	// The reason this works is as follows. If there are no SLL conflicts, then the
	// grammar is SLL (at least for that input set). If there is an SLL conflict,
	// the full LL analysis must yield a set of viable alternatives which is a
	// subset of the alternatives reported by SLL. If the LL set is a singleton,
	// then the grammar is LL but not SLL. If the LL set is the same size as the SLL
	// set, the decision is SLL. If the LL set has size &gt; 1, then that decision
	// is truly ambiguous on the current input. If the LL set is smaller, then the
	// SLL conflict resolution might choose an alternative that the full LL would
	// rule out as a possibility based upon better context information. If that's
	// the case, then the SLL parse will definitely get an error because the full LL
	// analysis says it's not viable. If SLL conflict resolution chooses an
	// alternative within the LL set, them both SLL and LL would choose the same
	// alternative because they both choose the minimum of multiple conflicting
	// alternatives.</p>
	//
	// <p>
	// Let's say we have a set of SLL conflicting alternatives {@code {1, 2, 3}} and
	// a smaller LL set called <em>s</em>. If <em>s</em> is {@code {2, 3}}, then SLL
	// parsing will get an error because SLL will pursue alternative 1. If
	// <em>s</em> is {@code {1, 2}} or {@code {1, 3}} then both SLL and LL will
	// choose the same alternative because alternative one is the minimum of either
	// set. If <em>s</em> is {@code {2}} or {@code {3}} then SLL will get a syntax
	// error. If <em>s</em> is {@code {1}} then SLL will succeed.</p>
	//
	// <p>
	// Of course, if the input is invalid, then we will get an error for sure in
	// both SLL and LL parsing. Erroneous input will therefore require 2 passes over
	// the input.</p>
	//
	
	var Utils = __webpack_require__(3);
	var Set = Utils.Set;
	var BitSet = Utils.BitSet;
	var DoubleDict = Utils.DoubleDict;
	var ATN = __webpack_require__(9).ATN;
	var ATNConfig = __webpack_require__(19).ATNConfig;
	var ATNConfigSet = __webpack_require__(10).ATNConfigSet;
	var Token = __webpack_require__(1).Token;
	var DFAState = __webpack_require__(11).DFAState;
	var PredPrediction = __webpack_require__(11).PredPrediction;
	var ATNSimulator = __webpack_require__(24).ATNSimulator;
	var PredictionMode = __webpack_require__(26).PredictionMode;
	var RuleContext = __webpack_require__(18).RuleContext;
	var ParserRuleContext = __webpack_require__(17).ParserRuleContext;
	var SemanticContext = __webpack_require__(12).SemanticContext;
	var StarLoopEntryState = __webpack_require__(7).StarLoopEntryState;
	var RuleStopState = __webpack_require__(7).RuleStopState;
	var PredictionContext = __webpack_require__(4).PredictionContext;
	var Interval = __webpack_require__(2).Interval;
	var Transitions = __webpack_require__(8);
	var Transition = Transitions.Transition;
	var SetTransition = Transitions.SetTransition;
	var NotSetTransition = Transitions.NotSetTransition;
	var RuleTransition = Transitions.RuleTransition;
	var ActionTransition = Transitions.ActionTransition;
	var NoViableAltException = __webpack_require__(5).NoViableAltException;
	
	var SingletonPredictionContext = __webpack_require__(4).SingletonPredictionContext;
	var predictionContextFromRuleContext = __webpack_require__(4).predictionContextFromRuleContext;
	
	function ParserATNSimulator(parser, atn, decisionToDFA, sharedContextCache) {
		ATNSimulator.call(this, atn, sharedContextCache);
	    this.parser = parser;
	    this.decisionToDFA = decisionToDFA;
	    // SLL, LL, or LL + exact ambig detection?//
	    this.predictionMode = PredictionMode.LL;
	    // LAME globals to avoid parameters!!!!! I need these down deep in predTransition
	    this._input = null;
	    this._startIndex = 0;
	    this._outerContext = null;
	    this._dfa = null;
	    // Each prediction operation uses a cache for merge of prediction contexts.
	    //  Don't keep around as it wastes huge amounts of memory. DoubleKeyMap
	    //  isn't synchronized but we're ok since two threads shouldn't reuse same
	    //  parser/atnsim object because it can only handle one input at a time.
	    //  This maps graphs a and b to merged result c. (a,b)&rarr;c. We can avoid
	    //  the merge if we ever see a and b again.  Note that (b,a)&rarr;c should
	    //  also be examined during cache lookup.
	    //
	    this.mergeCache = null;
	    return this;
	}
	
	ParserATNSimulator.prototype = Object.create(ATNSimulator.prototype);
	ParserATNSimulator.prototype.constructor = ParserATNSimulator;
	
	ParserATNSimulator.prototype.debug = false;
	ParserATNSimulator.prototype.debug_list_atn_decisions = false;
	ParserATNSimulator.prototype.dfa_debug = false;
	ParserATNSimulator.prototype.retry_debug = false;
	
	
	ParserATNSimulator.prototype.reset = function() {
	};
	
	ParserATNSimulator.prototype.adaptivePredict = function(input, decision, outerContext) {
	    if (this.debug || this.debug_list_atn_decisions) {
	        console.log("adaptivePredict decision " + decision +
	                               " exec LA(1)==" + this.getLookaheadName(input) +
	                               " line " + input.LT(1).line + ":" +
	                               input.LT(1).column);
	    }
	    this._input = input;
	    this._startIndex = input.index;
	    this._outerContext = outerContext;
	    
	    var dfa = this.decisionToDFA[decision];
	    this._dfa = dfa;
	    var m = input.mark();
	    var index = input.index;
	
	    // Now we are certain to have a specific decision's DFA
	    // But, do we still need an initial state?
	    try {
	        var s0;
	        if (dfa.precedenceDfa) {
	            // the start state for a precedence DFA depends on the current
	            // parser precedence, and is provided by a DFA method.
	            s0 = dfa.getPrecedenceStartState(this.parser.getPrecedence());
	        } else {
	            // the start state for a "regular" DFA is just s0
	            s0 = dfa.s0;
	        }
	        if (s0===null) {
	            if (outerContext===null) {
	                outerContext = RuleContext.EMPTY;
	            }
	            if (this.debug || this.debug_list_atn_decisions) {
	                console.log("predictATN decision " + dfa.decision +
	                                   " exec LA(1)==" + this.getLookaheadName(input) +
	                                   ", outerContext=" + outerContext.toString(this.parser.ruleNames));
	            }
	            // If this is not a precedence DFA, we check the ATN start state
	            // to determine if this ATN start state is the decision for the
	            // closure block that determines whether a precedence rule
	            // should continue or complete.
	            //
	            if (!dfa.precedenceDfa && (dfa.atnStartState instanceof StarLoopEntryState)) {
	                if (dfa.atnStartState.precedenceRuleDecision) {
	                    dfa.setPrecedenceDfa(true);
	                }
	            }
	            var fullCtx = false;
	            var s0_closure = this.computeStartState(dfa.atnStartState, RuleContext.EMPTY, fullCtx);
	
	            if( dfa.precedenceDfa) {
	                // If this is a precedence DFA, we use applyPrecedenceFilter
	                // to convert the computed start state to a precedence start
	                // state. We then use DFA.setPrecedenceStartState to set the
	                // appropriate start state for the precedence level rather
	                // than simply setting DFA.s0.
	                //
	                s0_closure = this.applyPrecedenceFilter(s0_closure);
	                s0 = this.addDFAState(dfa, new DFAState(null, s0_closure));
	                dfa.setPrecedenceStartState(this.parser.getPrecedence(), s0);
	            } else {
	                s0 = this.addDFAState(dfa, new DFAState(null, s0_closure));
	                dfa.s0 = s0;
	            }
	        }
	        var alt = this.execATN(dfa, s0, input, index, outerContext);
	        if (this.debug) {
	            console.log("DFA after predictATN: " + dfa.toString(this.parser.literalNames));
	        }
	        return alt;
	    } finally {
	        this._dfa = null;
	        this.mergeCache = null; // wack cache after each prediction
	        input.seek(index);
	        input.release(m);
	    }
	};
	// Performs ATN simulation to compute a predicted alternative based
	//  upon the remaining input, but also updates the DFA cache to avoid
	//  having to traverse the ATN again for the same input sequence.
	
	// There are some key conditions we're looking for after computing a new
	// set of ATN configs (proposed DFA state):
	      // if the set is empty, there is no viable alternative for current symbol
	      // does the state uniquely predict an alternative?
	      // does the state have a conflict that would prevent us from
	      //   putting it on the work list?
	
	// We also have some key operations to do:
	      // add an edge from previous DFA state to potentially new DFA state, D,
	      //   upon current symbol but only if adding to work list, which means in all
	      //   cases except no viable alternative (and possibly non-greedy decisions?)
	      // collecting predicates and adding semantic context to DFA accept states
	      // adding rule context to context-sensitive DFA accept states
	      // consuming an input symbol
	      // reporting a conflict
	      // reporting an ambiguity
	      // reporting a context sensitivity
	      // reporting insufficient predicates
	
	// cover these cases:
	//    dead end
	//    single alt
	//    single alt + preds
	//    conflict
	//    conflict + preds
	//
	ParserATNSimulator.prototype.execATN = function(dfa, s0, input, startIndex, outerContext ) {
	    if (this.debug || this.debug_list_atn_decisions) {
	        console.log("execATN decision " + dfa.decision +
	                " exec LA(1)==" + this.getLookaheadName(input) +
	                " line " + input.LT(1).line + ":" + input.LT(1).column);
	    }
	    var alt;
	    var previousD = s0;
	
	    if (this.debug) {
	        console.log("s0 = " + s0);
	    }
	    var t = input.LA(1);
	    while(true) { // while more work
	        var D = this.getExistingTargetState(previousD, t);
	        if(D===null) {
	            D = this.computeTargetState(dfa, previousD, t);
	        }
	        if(D===ATNSimulator.ERROR) {
	            // if any configs in previous dipped into outer context, that
	            // means that input up to t actually finished entry rule
	            // at least for SLL decision. Full LL doesn't dip into outer
	            // so don't need special case.
	            // We will get an error no matter what so delay until after
	            // decision; better error message. Also, no reachable target
	            // ATN states in SLL implies LL will also get nowhere.
	            // If conflict in states that dip out, choose min since we
	            // will get error no matter what.
	            var e = this.noViableAlt(input, outerContext, previousD.configs, startIndex);
	            input.seek(startIndex);
	            alt = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(previousD.configs, outerContext);
	            if(alt!==ATN.INVALID_ALT_NUMBER) {
	                return alt;
	            } else {
	                throw e;
	            }
	        }
	        if(D.requiresFullContext && this.predictionMode !== PredictionMode.SLL) {
	            // IF PREDS, MIGHT RESOLVE TO SINGLE ALT => SLL (or syntax error)
	            var conflictingAlts = null;
	            if (D.predicates!==null) {
	                if (this.debug) {
	                    console.log("DFA state has preds in DFA sim LL failover");
	                }
	                var conflictIndex = input.index;
	                if(conflictIndex !== startIndex) {
	                    input.seek(startIndex);
	                }
	                conflictingAlts = this.evalSemanticContext(D.predicates, outerContext, true);
	                if (conflictingAlts.length===1) {
	                    if(this.debug) {
	                        console.log("Full LL avoided");
	                    }
	                    return conflictingAlts.minValue();
	                }
	                if (conflictIndex !== startIndex) {
	                    // restore the index so reporting the fallback to full
	                    // context occurs with the index at the correct spot
	                    input.seek(conflictIndex);
	                }
	            }
	            if (this.dfa_debug) {
	                console.log("ctx sensitive state " + outerContext +" in " + D);
	            }
	            var fullCtx = true;
	            var s0_closure = this.computeStartState(dfa.atnStartState, outerContext, fullCtx);
	            this.reportAttemptingFullContext(dfa, conflictingAlts, D.configs, startIndex, input.index);
	            alt = this.execATNWithFullContext(dfa, D, s0_closure, input, startIndex, outerContext);
	            return alt;
	        }
	        if (D.isAcceptState) {
	            if (D.predicates===null) {
	                return D.prediction;
	            }
	            var stopIndex = input.index;
	            input.seek(startIndex);
	            var alts = this.evalSemanticContext(D.predicates, outerContext, true);
	            if (alts.length===0) {
	                throw this.noViableAlt(input, outerContext, D.configs, startIndex);
	            } else if (alts.length===1) {
	                return alts.minValue();
	            } else {
	                // report ambiguity after predicate evaluation to make sure the correct set of ambig alts is reported.
	                this.reportAmbiguity(dfa, D, startIndex, stopIndex, false, alts, D.configs);
	                return alts.minValue();
	            }
	        }
	        previousD = D;
	
	        if (t !== Token.EOF) {
	            input.consume();
	            t = input.LA(1);
	        }
	    }
	};
	//
	// Get an existing target state for an edge in the DFA. If the target state
	// for the edge has not yet been computed or is otherwise not available,
	// this method returns {@code null}.
	//
	// @param previousD The current DFA state
	// @param t The next input symbol
	// @return The existing target DFA state for the given input symbol
	// {@code t}, or {@code null} if the target state for this edge is not
	// already cached
	//
	ParserATNSimulator.prototype.getExistingTargetState = function(previousD, t) {
	    var edges = previousD.edges;
	    if (edges===null) {
	        return null;
	    } else {
	        return edges[t + 1] || null;
	    }
	};
	//
	// Compute a target state for an edge in the DFA, and attempt to add the
	// computed state and corresponding edge to the DFA.
	//
	// @param dfa The DFA
	// @param previousD The current DFA state
	// @param t The next input symbol
	//
	// @return The computed target DFA state for the given input symbol
	// {@code t}. If {@code t} does not lead to a valid DFA state, this method
	// returns {@link //ERROR}.
	//
	ParserATNSimulator.prototype.computeTargetState = function(dfa, previousD, t) {
	   var reach = this.computeReachSet(previousD.configs, t, false);
	    if(reach===null) {
	        this.addDFAEdge(dfa, previousD, t, ATNSimulator.ERROR);
	        return ATNSimulator.ERROR;
	    }
	    // create new target state; we'll add to DFA after it's complete
	    var D = new DFAState(null, reach);
	
	    var predictedAlt = this.getUniqueAlt(reach);
	
	    if (this.debug) {
	        var altSubSets = PredictionMode.getConflictingAltSubsets(reach);
	        console.log("SLL altSubSets=" + Utils.arrayToString(altSubSets) +
	                    ", previous=" + previousD.configs +
	                    ", configs=" + reach +
	                    ", predict=" + predictedAlt +
	                    ", allSubsetsConflict=" +
	                    PredictionMode.allSubsetsConflict(altSubSets) + ", conflictingAlts=" +
	                    this.getConflictingAlts(reach));
	    }
	    if (predictedAlt!==ATN.INVALID_ALT_NUMBER) {
	        // NO CONFLICT, UNIQUELY PREDICTED ALT
	        D.isAcceptState = true;
	        D.configs.uniqueAlt = predictedAlt;
	        D.prediction = predictedAlt;
	    } else if (PredictionMode.hasSLLConflictTerminatingPrediction(this.predictionMode, reach)) {
	        // MORE THAN ONE VIABLE ALTERNATIVE
	        D.configs.conflictingAlts = this.getConflictingAlts(reach);
	        D.requiresFullContext = true;
	        // in SLL-only mode, we will stop at this state and return the minimum alt
	        D.isAcceptState = true;
	        D.prediction = D.configs.conflictingAlts.minValue();
	    }
	    if (D.isAcceptState && D.configs.hasSemanticContext) {
	        this.predicateDFAState(D, this.atn.getDecisionState(dfa.decision));
	        if( D.predicates!==null) {
	            D.prediction = ATN.INVALID_ALT_NUMBER;
	        }
	    }
	    // all adds to dfa are done after we've created full D state
	    D = this.addDFAEdge(dfa, previousD, t, D);
	    return D;
	};
	
	ParserATNSimulator.prototype.predicateDFAState = function(dfaState, decisionState) {
	    // We need to test all predicates, even in DFA states that
	    // uniquely predict alternative.
	    var nalts = decisionState.transitions.length;
	    // Update DFA so reach becomes accept state with (predicate,alt)
	    // pairs if preds found for conflicting alts
	    var altsToCollectPredsFrom = this.getConflictingAltsOrUniqueAlt(dfaState.configs);
	    var altToPred = this.getPredsForAmbigAlts(altsToCollectPredsFrom, dfaState.configs, nalts);
	    if (altToPred!==null) {
	        dfaState.predicates = this.getPredicatePredictions(altsToCollectPredsFrom, altToPred);
	        dfaState.prediction = ATN.INVALID_ALT_NUMBER; // make sure we use preds
	    } else {
	        // There are preds in configs but they might go away
	        // when OR'd together like {p}? || NONE == NONE. If neither
	        // alt has preds, resolve to min alt
	        dfaState.prediction = altsToCollectPredsFrom.minValue();
	    }
	};
	
	// comes back with reach.uniqueAlt set to a valid alt
	ParserATNSimulator.prototype.execATNWithFullContext = function(dfa, D, // how far we got before failing over
	                                     s0,
	                                     input,
	                                     startIndex,
	                                     outerContext) {
	    if (this.debug || this.debug_list_atn_decisions) {
	        console.log("execATNWithFullContext "+s0);
	    }
	    var fullCtx = true;
	    var foundExactAmbig = false;
	    var reach = null;
	    var previous = s0;
	    input.seek(startIndex);
	    var t = input.LA(1);
	    var predictedAlt = -1;
	    while (true) { // while more work
	        reach = this.computeReachSet(previous, t, fullCtx);
	        if (reach===null) {
	            // if any configs in previous dipped into outer context, that
	            // means that input up to t actually finished entry rule
	            // at least for LL decision. Full LL doesn't dip into outer
	            // so don't need special case.
	            // We will get an error no matter what so delay until after
	            // decision; better error message. Also, no reachable target
	            // ATN states in SLL implies LL will also get nowhere.
	            // If conflict in states that dip out, choose min since we
	            // will get error no matter what.
	            var e = this.noViableAlt(input, outerContext, previous, startIndex);
	            input.seek(startIndex);
	            var alt = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(previous, outerContext);
	            if(alt!==ATN.INVALID_ALT_NUMBER) {
	                return alt;
	            } else {
	                throw e;
	            }
	        }
	        var altSubSets = PredictionMode.getConflictingAltSubsets(reach);
	        if(this.debug) {
	            console.log("LL altSubSets=" + altSubSets + ", predict=" +
	                  PredictionMode.getUniqueAlt(altSubSets) + ", resolvesToJustOneViableAlt=" +
	                  PredictionMode.resolvesToJustOneViableAlt(altSubSets));
	        }
	        reach.uniqueAlt = this.getUniqueAlt(reach);
	        // unique prediction?
	        if(reach.uniqueAlt!==ATN.INVALID_ALT_NUMBER) {
	            predictedAlt = reach.uniqueAlt;
	            break;
	        } else if (this.predictionMode !== PredictionMode.LL_EXACT_AMBIG_DETECTION) {
	            predictedAlt = PredictionMode.resolvesToJustOneViableAlt(altSubSets);
	            if(predictedAlt !== ATN.INVALID_ALT_NUMBER) {
	                break;
	            }
	        } else {
	            // In exact ambiguity mode, we never try to terminate early.
	            // Just keeps scarfing until we know what the conflict is
	            if (PredictionMode.allSubsetsConflict(altSubSets) && PredictionMode.allSubsetsEqual(altSubSets)) {
	                foundExactAmbig = true;
	                predictedAlt = PredictionMode.getSingleViableAlt(altSubSets);
	                break;
	            }
	            // else there are multiple non-conflicting subsets or
	            // we're not sure what the ambiguity is yet.
	            // So, keep going.
	        }
	        previous = reach;
	        if( t !== Token.EOF) {
	            input.consume();
	            t = input.LA(1);
	        }
	    }
	    // If the configuration set uniquely predicts an alternative,
	    // without conflict, then we know that it's a full LL decision
	    // not SLL.
	    if (reach.uniqueAlt !== ATN.INVALID_ALT_NUMBER ) {
	        this.reportContextSensitivity(dfa, predictedAlt, reach, startIndex, input.index);
	        return predictedAlt;
	    }
	    // We do not check predicates here because we have checked them
	    // on-the-fly when doing full context prediction.
	
	    //
	    // In non-exact ambiguity detection mode, we might	actually be able to
	    // detect an exact ambiguity, but I'm not going to spend the cycles
	    // needed to check. We only emit ambiguity warnings in exact ambiguity
	    // mode.
	    //
	    // For example, we might know that we have conflicting configurations.
	    // But, that does not mean that there is no way forward without a
	    // conflict. It's possible to have nonconflicting alt subsets as in:
	
	    // altSubSets=[{1, 2}, {1, 2}, {1}, {1, 2}]
	
	    // from
	    //
	    //    [(17,1,[5 $]), (13,1,[5 10 $]), (21,1,[5 10 $]), (11,1,[$]),
	    //     (13,2,[5 10 $]), (21,2,[5 10 $]), (11,2,[$])]
	    //
	    // In this case, (17,1,[5 $]) indicates there is some next sequence that
	    // would resolve this without conflict to alternative 1. Any other viable
	    // next sequence, however, is associated with a conflict.  We stop
	    // looking for input because no amount of further lookahead will alter
	    // the fact that we should predict alternative 1.  We just can't say for
	    // sure that there is an ambiguity without looking further.
	
	    this.reportAmbiguity(dfa, D, startIndex, input.index, foundExactAmbig, null, reach);
	
	    return predictedAlt;
	};
	
	ParserATNSimulator.prototype.computeReachSet = function(closure, t, fullCtx) {
	    if (this.debug) {
	        console.log("in computeReachSet, starting closure: " + closure);
	    }
	    if( this.mergeCache===null) {
	        this.mergeCache = new DoubleDict();
	    }
	    var intermediate = new ATNConfigSet(fullCtx);
	
	    // Configurations already in a rule stop state indicate reaching the end
	    // of the decision rule (local context) or end of the start rule (full
	    // context). Once reached, these configurations are never updated by a
	    // closure operation, so they are handled separately for the performance
	    // advantage of having a smaller intermediate set when calling closure.
	    //
	    // For full-context reach operations, separate handling is required to
	    // ensure that the alternative matching the longest overall sequence is
	    // chosen when multiple such configurations can match the input.
	    
	    var skippedStopStates = null;
	
	    // First figure out where we can reach on input t
	    for (var i=0; i<closure.items.length;i++) {
	        var c = closure.items[i];
	        if(this.debug) {
	            console.log("testing " + this.getTokenName(t) + " at " + c);
	        }
	        if (c.state instanceof RuleStopState) {
	            if (fullCtx || t === Token.EOF) {
	                if (skippedStopStates===null) {
	                    skippedStopStates = [];
	                }
	                skippedStopStates.push(c);
	                if(this.debug) {
	                    console.log("added " + c + " to skippedStopStates");
	                }
	            }
	            continue;
	        }
	        for(var j=0;j<c.state.transitions.length;j++) {
	            var trans = c.state.transitions[j];
	            var target = this.getReachableTarget(trans, t);
	            if (target!==null) {
	                var cfg = new ATNConfig({state:target}, c);
	                intermediate.add(cfg, this.mergeCache);
	                if(this.debug) {
	                    console.log("added " + cfg + " to intermediate");
	                }
	            }
	        }
	    }
	    // Now figure out where the reach operation can take us...
	    var reach = null;
	
	    // This block optimizes the reach operation for intermediate sets which
	    // trivially indicate a termination state for the overall
	    // adaptivePredict operation.
	    //
	    // The conditions assume that intermediate
	    // contains all configurations relevant to the reach set, but this
	    // condition is not true when one or more configurations have been
	    // withheld in skippedStopStates, or when the current symbol is EOF.
	    //
	    if (skippedStopStates===null && t!==Token.EOF) {
	        if (intermediate.items.length===1) {
	            // Don't pursue the closure if there is just one state.
	            // It can only have one alternative; just add to result
	            // Also don't pursue the closure if there is unique alternative
	            // among the configurations.
	            reach = intermediate;
	        } else if (this.getUniqueAlt(intermediate)!==ATN.INVALID_ALT_NUMBER) {
	            // Also don't pursue the closure if there is unique alternative
	            // among the configurations.
	            reach = intermediate;
	        }
	    }
	    // If the reach set could not be trivially determined, perform a closure
	    // operation on the intermediate set to compute its initial value.
	    //
	    if (reach===null) {
	        reach = new ATNConfigSet(fullCtx);
	        var closureBusy = new Set();
	        var treatEofAsEpsilon = t === Token.EOF;
	        for (var k=0; k<intermediate.items.length;k++) {
	            this.closure(intermediate.items[k], reach, closureBusy, false, fullCtx, treatEofAsEpsilon);
	        }
	    }
	    if (t === Token.EOF) {
	        // After consuming EOF no additional input is possible, so we are
	        // only interested in configurations which reached the end of the
	        // decision rule (local context) or end of the start rule (full
	        // context). Update reach to contain only these configurations. This
	        // handles both explicit EOF transitions in the grammar and implicit
	        // EOF transitions following the end of the decision or start rule.
	        //
	        // When reach==intermediate, no closure operation was performed. In
	        // this case, removeAllConfigsNotInRuleStopState needs to check for
	        // reachable rule stop states as well as configurations already in
	        // a rule stop state.
	        //
	        // This is handled before the configurations in skippedStopStates,
	        // because any configurations potentially added from that list are
	        // already guaranteed to meet this condition whether or not it's
	        // required.
	        //
	        reach = this.removeAllConfigsNotInRuleStopState(reach, reach === intermediate);
	    }
	    // If skippedStopStates!==null, then it contains at least one
	    // configuration. For full-context reach operations, these
	    // configurations reached the end of the start rule, in which case we
	    // only add them back to reach if no configuration during the current
	    // closure operation reached such a state. This ensures adaptivePredict
	    // chooses an alternative matching the longest overall sequence when
	    // multiple alternatives are viable.
	    //
	    if (skippedStopStates!==null && ( (! fullCtx) || (! PredictionMode.hasConfigInRuleStopState(reach)))) {
	        for (var l=0; l<skippedStopStates.length;l++) {
	            reach.add(skippedStopStates[l], this.mergeCache);
	        }
	    }
	    if (reach.items.length===0) {
	        return null;
	    } else {
	        return reach;
	    }
	};
	//
	// Return a configuration set containing only the configurations from
	// {@code configs} which are in a {@link RuleStopState}. If all
	// configurations in {@code configs} are already in a rule stop state, this
	// method simply returns {@code configs}.
	//
	// <p>When {@code lookToEndOfRule} is true, this method uses
	// {@link ATN//nextTokens} for each configuration in {@code configs} which is
	// not already in a rule stop state to see if a rule stop state is reachable
	// from the configuration via epsilon-only transitions.</p>
	//
	// @param configs the configuration set to update
	// @param lookToEndOfRule when true, this method checks for rule stop states
	// reachable by epsilon-only transitions from each configuration in
	// {@code configs}.
	//
	// @return {@code configs} if all configurations in {@code configs} are in a
	// rule stop state, otherwise return a new configuration set containing only
	// the configurations from {@code configs} which are in a rule stop state
	//
	ParserATNSimulator.prototype.removeAllConfigsNotInRuleStopState = function(configs, lookToEndOfRule) {
	    if (PredictionMode.allConfigsInRuleStopStates(configs)) {
	        return configs;
	    }
	    var result = new ATNConfigSet(configs.fullCtx);
	    for(var i=0; i<configs.items.length;i++) {
	        var config = configs.items[i];
	        if (config.state instanceof RuleStopState) {
	            result.add(config, this.mergeCache);
	            continue;
	        }
	        if (lookToEndOfRule && config.state.epsilonOnlyTransitions) {
	            var nextTokens = this.atn.nextTokens(config.state);
	            if (nextTokens.contains(Token.EPSILON)) {
	                var endOfRuleState = this.atn.ruleToStopState[config.state.ruleIndex];
	                result.add(new ATNConfig({state:endOfRuleState}, config), this.mergeCache);
	            }
	        }
	    }
	    return result;
	};
	
	ParserATNSimulator.prototype.computeStartState = function(p, ctx, fullCtx) {
	    // always at least the implicit call to start rule
	    var initialContext = predictionContextFromRuleContext(this.atn, ctx);
	    var configs = new ATNConfigSet(fullCtx);
	    for(var i=0;i<p.transitions.length;i++) {
	        var target = p.transitions[i].target;
	        var c = new ATNConfig({ state:target, alt:i+1, context:initialContext }, null);
	        var closureBusy = new Set();
	        this.closure(c, configs, closureBusy, true, fullCtx, false);
	    }
	    return configs;
	};
	
	//
	// This method transforms the start state computed by
	// {@link //computeStartState} to the special start state used by a
	// precedence DFA for a particular precedence value. The transformation
	// process applies the following changes to the start state's configuration
	// set.
	//
	// <ol>
	// <li>Evaluate the precedence predicates for each configuration using
	// {@link SemanticContext//evalPrecedence}.</li>
	// <li>Remove all configurations which predict an alternative greater than
	// 1, for which another configuration that predicts alternative 1 is in the
	// same ATN state with the same prediction context. This transformation is
	// valid for the following reasons:
	// <ul>
	// <li>The closure block cannot contain any epsilon transitions which bypass
	// the body of the closure, so all states reachable via alternative 1 are
	// part of the precedence alternatives of the transformed left-recursive
	// rule.</li>
	// <li>The "primary" portion of a left recursive rule cannot contain an
	// epsilon transition, so the only way an alternative other than 1 can exist
	// in a state that is also reachable via alternative 1 is by nesting calls
	// to the left-recursive rule, with the outer calls not being at the
	// preferred precedence level.</li>
	// </ul>
	// </li>
	// </ol>
	//
	// <p>
	// The prediction context must be considered by this filter to address
	// situations like the following.
	// </p>
	// <code>
	// <pre>
	// grammar TA;
	// prog: statement* EOF;
	// statement: letterA | statement letterA 'b' ;
	// letterA: 'a';
	// </pre>
	// </code>
	// <p>
	// If the above grammar, the ATN state immediately before the token
	// reference {@code 'a'} in {@code letterA} is reachable from the left edge
	// of both the primary and closure blocks of the left-recursive rule
	// {@code statement}. The prediction context associated with each of these
	// configurations distinguishes between them, and prevents the alternative
	// which stepped out to {@code prog} (and then back in to {@code statement}
	// from being eliminated by the filter.
	// </p>
	//
	// @param configs The configuration set computed by
	// {@link //computeStartState} as the start state for the DFA.
	// @return The transformed configuration set representing the start state
	// for a precedence DFA at a particular precedence level (determined by
	// calling {@link Parser//getPrecedence}).
	//
	ParserATNSimulator.prototype.applyPrecedenceFilter = function(configs) {
		var config;
		var statesFromAlt1 = [];
	    var configSet = new ATNConfigSet(configs.fullCtx);
	    for(var i=0; i<configs.items.length; i++) {
	        config = configs.items[i];
	        // handle alt 1 first
	        if (config.alt !== 1) {
	            continue;
	        }
	        var updatedContext = config.semanticContext.evalPrecedence(this.parser, this._outerContext);
	        if (updatedContext===null) {
	            // the configuration was eliminated
	            continue;
	        }
	        statesFromAlt1[config.state.stateNumber] = config.context;
	        if (updatedContext !== config.semanticContext) {
	            configSet.add(new ATNConfig({semanticContext:updatedContext}, config), this.mergeCache);
	        } else {
	            configSet.add(config, this.mergeCache);
	        }
	    }
	    for(i=0; i<configs.items.length; i++) {
	        config = configs.items[i];
	        if (config.alt === 1) {
	            // already handled
	            continue;
	        }
	        // In the future, this elimination step could be updated to also
	        // filter the prediction context for alternatives predicting alt>1
	        // (basically a graph subtraction algorithm).
			if (!config.precedenceFilterSuppressed) {
	            var context = statesFromAlt1[config.state.stateNumber] || null;
	            if (context!==null && context.equals(config.context)) {
	                // eliminated
	                continue;
	            }
			}
	        configSet.add(config, this.mergeCache);
	    }
	    return configSet;
	};
	
	ParserATNSimulator.prototype.getReachableTarget = function(trans, ttype) {
	    if (trans.matches(ttype, 0, this.atn.maxTokenType)) {
	        return trans.target;
	    } else {
	        return null;
	    }
	};
	
	ParserATNSimulator.prototype.getPredsForAmbigAlts = function(ambigAlts, configs, nalts) {
	    // REACH=[1|1|[]|0:0, 1|2|[]|0:1]
	    // altToPred starts as an array of all null contexts. The entry at index i
	    // corresponds to alternative i. altToPred[i] may have one of three values:
	    //   1. null: no ATNConfig c is found such that c.alt==i
	    //   2. SemanticContext.NONE: At least one ATNConfig c exists such that
	    //      c.alt==i and c.semanticContext==SemanticContext.NONE. In other words,
	    //      alt i has at least one unpredicated config.
	    //   3. Non-NONE Semantic Context: There exists at least one, and for all
	    //      ATNConfig c such that c.alt==i, c.semanticContext!=SemanticContext.NONE.
	    //
	    // From this, it is clear that NONE||anything==NONE.
	    //
	    var altToPred = [];
	    for(var i=0;i<configs.items.length;i++) {
	        var c = configs.items[i];
	        if(ambigAlts.contains( c.alt )) {
	            altToPred[c.alt] = SemanticContext.orContext(altToPred[c.alt] || null, c.semanticContext);
	        }
	    }
	    var nPredAlts = 0;
	    for (i =1;i< nalts+1;i++) {
	        var pred = altToPred[i] || null;
	        if (pred===null) {
	            altToPred[i] = SemanticContext.NONE;
	        } else if (pred !== SemanticContext.NONE) {
	            nPredAlts += 1;
	        }
	    }
	    // nonambig alts are null in altToPred
	    if (nPredAlts===0) {
	        altToPred = null;
	    }
	    if (this.debug) {
	        console.log("getPredsForAmbigAlts result " + Utils.arrayToString(altToPred));
	    }
	    return altToPred;
	};
	
	ParserATNSimulator.prototype.getPredicatePredictions = function(ambigAlts, altToPred) {
	    var pairs = [];
	    var containsPredicate = false;
	    for (var i=1; i<altToPred.length;i++) {
	        var pred = altToPred[i];
	        // unpredicated is indicated by SemanticContext.NONE
	        if( ambigAlts!==null && ambigAlts.contains( i )) {
	            pairs.push(new PredPrediction(pred, i));
	        }
	        if (pred !== SemanticContext.NONE) {
	            containsPredicate = true;
	        }
	    }
	    if (! containsPredicate) {
	        return null;
	    }
	    return pairs;
	};
	
	//
	// This method is used to improve the localization of error messages by
	// choosing an alternative rather than throwing a
	// {@link NoViableAltException} in particular prediction scenarios where the
	// {@link //ERROR} state was reached during ATN simulation.
	//
	// <p>
	// The default implementation of this method uses the following
	// algorithm to identify an ATN configuration which successfully parsed the
	// decision entry rule. Choosing such an alternative ensures that the
	// {@link ParserRuleContext} returned by the calling rule will be complete
	// and valid, and the syntax error will be reported later at a more
	// localized location.</p>
	//
	// <ul>
	// <li>If a syntactically valid path or paths reach the end of the decision rule and
	// they are semantically valid if predicated, return the min associated alt.</li>
	// <li>Else, if a semantically invalid but syntactically valid path exist
	// or paths exist, return the minimum associated alt.
	// </li>
	// <li>Otherwise, return {@link ATN//INVALID_ALT_NUMBER}.</li>
	// </ul>
	//
	// <p>
	// In some scenarios, the algorithm described above could predict an
	// alternative which will result in a {@link FailedPredicateException} in
	// the parser. Specifically, this could occur if the <em>only</em> configuration
	// capable of successfully parsing to the end of the decision rule is
	// blocked by a semantic predicate. By choosing this alternative within
	// {@link //adaptivePredict} instead of throwing a
	// {@link NoViableAltException}, the resulting
	// {@link FailedPredicateException} in the parser will identify the specific
	// predicate which is preventing the parser from successfully parsing the
	// decision rule, which helps developers identify and correct logic errors
	// in semantic predicates.
	// </p>
	//
	// @param configs The ATN configurations which were valid immediately before
	// the {@link //ERROR} state was reached
	// @param outerContext The is the \gamma_0 initial parser context from the paper
	// or the parser stack at the instant before prediction commences.
	//
	// @return The value to return from {@link //adaptivePredict}, or
	// {@link ATN//INVALID_ALT_NUMBER} if a suitable alternative was not
	// identified and {@link //adaptivePredict} should report an error instead.
	//
	ParserATNSimulator.prototype.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule = function(configs, outerContext) {
	    var cfgs = this.splitAccordingToSemanticValidity(configs, outerContext);
	    var semValidConfigs = cfgs[0];
	    var semInvalidConfigs = cfgs[1];
	    var alt = this.getAltThatFinishedDecisionEntryRule(semValidConfigs);
	    if (alt!==ATN.INVALID_ALT_NUMBER) { // semantically/syntactically viable path exists
	        return alt;
	    }
	    // Is there a syntactically valid path with a failed pred?
	    if (semInvalidConfigs.items.length>0) {
	        alt = this.getAltThatFinishedDecisionEntryRule(semInvalidConfigs);
	        if (alt!==ATN.INVALID_ALT_NUMBER) { // syntactically viable path exists
	            return alt;
	        }
	    }
	    return ATN.INVALID_ALT_NUMBER;
	};
	    
	ParserATNSimulator.prototype.getAltThatFinishedDecisionEntryRule = function(configs) {
	    var alts = [];
	    for(var i=0;i<configs.items.length; i++) {
	        var c = configs.items[i];
	        if (c.reachesIntoOuterContext>0 || ((c.state instanceof RuleStopState) && c.context.hasEmptyPath())) {
	            if(alts.indexOf(c.alt)<0) {
	                alts.push(c.alt);
	            }
	        }
	    }
	    if (alts.length===0) {
	        return ATN.INVALID_ALT_NUMBER;
	    } else {
	        return Math.min.apply(null, alts);
	    }
	};
	// Walk the list of configurations and split them according to
	//  those that have preds evaluating to true/false.  If no pred, assume
	//  true pred and include in succeeded set.  Returns Pair of sets.
	//
	//  Create a new set so as not to alter the incoming parameter.
	//
	//  Assumption: the input stream has been restored to the starting point
	//  prediction, which is where predicates need to evaluate.
	//
	ParserATNSimulator.prototype.splitAccordingToSemanticValidity = function( configs, outerContext) {
	    var succeeded = new ATNConfigSet(configs.fullCtx);
	    var failed = new ATNConfigSet(configs.fullCtx);
	    for(var i=0;i<configs.items.length; i++) {
	        var c = configs.items[i];
	        if (c.semanticContext !== SemanticContext.NONE) {
	            var predicateEvaluationResult = c.semanticContext.evaluate(this.parser, outerContext);
	            if (predicateEvaluationResult) {
	                succeeded.add(c);
	            } else {
	                failed.add(c);
	            }
	        } else {
	            succeeded.add(c);
	        }
	    }
	    return [succeeded, failed];
	};
	
	// Look through a list of predicate/alt pairs, returning alts for the
	//  pairs that win. A {@code NONE} predicate indicates an alt containing an
	//  unpredicated config which behaves as "always true." If !complete
	//  then we stop at the first predicate that evaluates to true. This
	//  includes pairs with null predicates.
	//
	ParserATNSimulator.prototype.evalSemanticContext = function(predPredictions, outerContext, complete) {
	    var predictions = new BitSet();
	    for(var i=0;i<predPredictions.length;i++) {
	    	var pair = predPredictions[i];
	        if (pair.pred === SemanticContext.NONE) {
	            predictions.add(pair.alt);
	            if (! complete) {
	                break;
	            }
	            continue;
	        }
	        var predicateEvaluationResult = pair.pred.evaluate(this.parser, outerContext);
	        if (this.debug || this.dfa_debug) {
	            console.log("eval pred " + pair + "=" + predicateEvaluationResult);
	        }
	        if (predicateEvaluationResult) {
	            if (this.debug || this.dfa_debug) {
	                console.log("PREDICT " + pair.alt);
	            }
	            predictions.add(pair.alt);
	            if (! complete) {
	                break;
	            }
	        }
	    }
	    return predictions;
	};
	
	// TODO: If we are doing predicates, there is no point in pursuing
	//     closure operations if we reach a DFA state that uniquely predicts
	//     alternative. We will not be caching that DFA state and it is a
	//     waste to pursue the closure. Might have to advance when we do
	//     ambig detection thought :(
	//
	
	ParserATNSimulator.prototype.closure = function(config, configs, closureBusy, collectPredicates, fullCtx, treatEofAsEpsilon) {
	    var initialDepth = 0;
	    this.closureCheckingStopState(config, configs, closureBusy, collectPredicates,
	                             fullCtx, initialDepth, treatEofAsEpsilon);
	};
	
	
	ParserATNSimulator.prototype.closureCheckingStopState = function(config, configs, closureBusy, collectPredicates, fullCtx, depth, treatEofAsEpsilon) {
	    if (this.debug) {
	        console.log("closure(" + config.toString(this.parser,true) + ")");
	        console.log("configs(" + configs.toString() + ")");
	        if(config.reachesIntoOuterContext>50) {
	            throw "problem";
	        }
	    }
	    if (config.state instanceof RuleStopState) {
	        // We hit rule end. If we have context info, use it
	        // run thru all possible stack tops in ctx
	        if (! config.context.isEmpty()) {
	            for ( var i =0; i<config.context.length; i++) {
	                if (config.context.getReturnState(i) === PredictionContext.EMPTY_RETURN_STATE) {
	                    if (fullCtx) {
	                        configs.add(new ATNConfig({state:config.state, context:PredictionContext.EMPTY}, config), this.mergeCache);
	                        continue;
	                    } else {
	                        // we have no context info, just chase follow links (if greedy)
	                        if (this.debug) {
	                            console.log("FALLING off rule " + this.getRuleName(config.state.ruleIndex));
	                        }
	                        this.closure_(config, configs, closureBusy, collectPredicates,
	                                 fullCtx, depth, treatEofAsEpsilon);
	                    }
	                    continue;
	                }
	                returnState = this.atn.states[config.context.getReturnState(i)];
	                newContext = config.context.getParent(i); // "pop" return state
	                var parms = {state:returnState, alt:config.alt, context:newContext, semanticContext:config.semanticContext};
	                c = new ATNConfig(parms, null);
	                // While we have context to pop back from, we may have
	                // gotten that context AFTER having falling off a rule.
	                // Make sure we track that we are now out of context.
	                c.reachesIntoOuterContext = config.reachesIntoOuterContext;
	                this.closureCheckingStopState(c, configs, closureBusy, collectPredicates, fullCtx, depth - 1, treatEofAsEpsilon);
	            }
	            return;
	        } else if( fullCtx) {
	            // reached end of start rule
	            configs.add(config, this.mergeCache);
	            return;
	        } else {
	            // else if we have no context info, just chase follow links (if greedy)
	            if (this.debug) {
	                console.log("FALLING off rule " + this.getRuleName(config.state.ruleIndex));
	            }
	        }
	    }
	    this.closure_(config, configs, closureBusy, collectPredicates, fullCtx, depth, treatEofAsEpsilon);
	};
	
	// Do the actual work of walking epsilon edges//
	ParserATNSimulator.prototype.closure_ = function(config, configs, closureBusy, collectPredicates, fullCtx, depth, treatEofAsEpsilon) {
	    var p = config.state;
	    // optimization
	    if (! p.epsilonOnlyTransitions) {
	        configs.add(config, this.mergeCache);
	        // make sure to not return here, because EOF transitions can act as
	        // both epsilon transitions and non-epsilon transitions.
	    }
	    for(var i = 0;i<p.transitions.length; i++) {
	        var t = p.transitions[i];
	        var continueCollecting = collectPredicates && !(t instanceof ActionTransition);
	        var c = this.getEpsilonTarget(config, t, continueCollecting, depth === 0, fullCtx, treatEofAsEpsilon);
	        if (c!==null) {
				if (!t.isEpsilon && closureBusy.add(c)!==c){
					// avoid infinite recursion for EOF* and EOF+
					continue;
				}
	            var newDepth = depth;
	            if ( config.state instanceof RuleStopState) {
	                // target fell off end of rule; mark resulting c as having dipped into outer context
	                // We can't get here if incoming config was rule stop and we had context
	                // track how far we dip into outer context.  Might
	                // come in handy and we avoid evaluating context dependent
	                // preds if this is > 0.
	
	                if (closureBusy.add(c)!==c) {
	                    // avoid infinite recursion for right-recursive rules
	                    continue;
	                }
	
					if (this._dfa !== null && this._dfa.precedenceDfa) {
						if (t.outermostPrecedenceReturn === this._dfa.atnStartState.ruleIndex) {
							c.precedenceFilterSuppressed = true;
						}
					}
	
	                c.reachesIntoOuterContext += 1;
	                configs.dipsIntoOuterContext = true; // TODO: can remove? only care when we add to set per middle of this method
	                newDepth -= 1;
	                if (this.debug) {
	                    console.log("dips into outer ctx: " + c);
	                }
	            } else if (t instanceof RuleTransition) {
	                // latch when newDepth goes negative - once we step out of the entry context we can't return
	                if (newDepth >= 0) {
	                    newDepth += 1;
	                }
	            }
	            this.closureCheckingStopState(c, configs, closureBusy, continueCollecting, fullCtx, newDepth, treatEofAsEpsilon);
	        }
	    }
	};
	
	ParserATNSimulator.prototype.getRuleName = function( index) {
	    if (this.parser!==null && index>=0) {
	        return this.parser.ruleNames[index];
	    } else {
	        return "<rule " + index + ">";
	    }
	};
	
	ParserATNSimulator.prototype.getEpsilonTarget = function(config, t, collectPredicates, inContext, fullCtx, treatEofAsEpsilon) {
	    switch(t.serializationType) {
	    case Transition.RULE:
	        return this.ruleTransition(config, t);
	    case Transition.PRECEDENCE:
	        return this.precedenceTransition(config, t, collectPredicates, inContext, fullCtx);
	    case Transition.PREDICATE:
	        return this.predTransition(config, t, collectPredicates, inContext, fullCtx);
	    case Transition.ACTION:
	        return this.actionTransition(config, t);
	    case Transition.EPSILON:
	        return new ATNConfig({state:t.target}, config);
	    case Transition.ATOM:
	    case Transition.RANGE:
	    case Transition.SET:
	        // EOF transitions act like epsilon transitions after the first EOF
	        // transition is traversed
	        if (treatEofAsEpsilon) {
	            if (t.matches(Token.EOF, 0, 1)) {
	                return new ATNConfig({state: t.target}, config);
	            }
	        }
	        return null;
	    default:
	    	return null;
	    }
	};
	
	ParserATNSimulator.prototype.actionTransition = function(config, t) {
	    if (this.debug) {
	        console.log("ACTION edge " + t.ruleIndex + ":" + t.actionIndex);
	    }
	    return new ATNConfig({state:t.target}, config);
	};
	
	ParserATNSimulator.prototype.precedenceTransition = function(config, pt,  collectPredicates, inContext, fullCtx) {
	    if (this.debug) {
	        console.log("PRED (collectPredicates=" + collectPredicates + ") " +
	                pt.precedence + ">=_p, ctx dependent=true");
	        if (this.parser!==null) {
	        	console.log("context surrounding pred is " + Utils.arrayToString(this.parser.getRuleInvocationStack()));
	        }
	    }
	    var c = null;
	    if (collectPredicates && inContext) {
	        if (fullCtx) {
	            // In full context mode, we can evaluate predicates on-the-fly
	            // during closure, which dramatically reduces the size of
	            // the config sets. It also obviates the need to test predicates
	            // later during conflict resolution.
	            var currentPosition = this._input.index;
	            this._input.seek(this._startIndex);
	            var predSucceeds = pt.getPredicate().evaluate(this.parser, this._outerContext);
	            this._input.seek(currentPosition);
	            if (predSucceeds) {
	                c = new ATNConfig({state:pt.target}, config); // no pred context
	            }
	        } else {
	            newSemCtx = SemanticContext.andContext(config.semanticContext, pt.getPredicate());
	            c = new ATNConfig({state:pt.target, semanticContext:newSemCtx}, config);
	        }
	    } else {
	        c = new ATNConfig({state:pt.target}, config);
	    }
	    if (this.debug) {
	        console.log("config from pred transition=" + c);
	    }
	    return c;
	};
	
	ParserATNSimulator.prototype.predTransition = function(config, pt, collectPredicates, inContext, fullCtx) {
	    if (this.debug) {
	        console.log("PRED (collectPredicates=" + collectPredicates + ") " + pt.ruleIndex +
	                ":" + pt.predIndex + ", ctx dependent=" + pt.isCtxDependent);
	        if (this.parser!==null) {
	            console.log("context surrounding pred is " + Utils.arrayToString(this.parser.getRuleInvocationStack()));
	        }
	    }
	    var c = null;
	    if (collectPredicates && ((pt.isCtxDependent && inContext) || ! pt.isCtxDependent)) {
	        if (fullCtx) {
	            // In full context mode, we can evaluate predicates on-the-fly
	            // during closure, which dramatically reduces the size of
	            // the config sets. It also obviates the need to test predicates
	            // later during conflict resolution.
	            var currentPosition = this._input.index;
	            this._input.seek(this._startIndex);
	            var predSucceeds = pt.getPredicate().evaluate(this.parser, this._outerContext);
	            this._input.seek(currentPosition);
	            if (predSucceeds) {
	                c = new ATNConfig({state:pt.target}, config); // no pred context
	            }
	        } else {
	            var newSemCtx = SemanticContext.andContext(config.semanticContext, pt.getPredicate());
	            c = new ATNConfig({state:pt.target, semanticContext:newSemCtx}, config);
	        }
	    } else {
	        c = new ATNConfig({state:pt.target}, config);
	    }
	    if (this.debug) {
	        console.log("config from pred transition=" + c);
	    }
	    return c;
	};
	
	ParserATNSimulator.prototype.ruleTransition = function(config, t) {
	    if (this.debug) {
	        console.log("CALL rule " + this.getRuleName(t.target.ruleIndex) + ", ctx=" + config.context);
	    }
	    var returnState = t.followState;
	    var newContext = SingletonPredictionContext.create(config.context, returnState.stateNumber);
	    return new ATNConfig({state:t.target, context:newContext}, config );
	};
	
	ParserATNSimulator.prototype.getConflictingAlts = function(configs) {
	    var altsets = PredictionMode.getConflictingAltSubsets(configs);
	    return PredictionMode.getAlts(altsets);
	};
	
	 // Sam pointed out a problem with the previous definition, v3, of
	 // ambiguous states. If we have another state associated with conflicting
	 // alternatives, we should keep going. For example, the following grammar
	 //
	 // s : (ID | ID ID?) ';' ;
	 //
	 // When the ATN simulation reaches the state before ';', it has a DFA
	 // state that looks like: [12|1|[], 6|2|[], 12|2|[]]. Naturally
	 // 12|1|[] and 12|2|[] conflict, but we cannot stop processing this node
	 // because alternative to has another way to continue, via [6|2|[]].
	 // The key is that we have a single state that has config's only associated
	 // with a single alternative, 2, and crucially the state transitions
	 // among the configurations are all non-epsilon transitions. That means
	 // we don't consider any conflicts that include alternative 2. So, we
	 // ignore the conflict between alts 1 and 2. We ignore a set of
	 // conflicting alts when there is an intersection with an alternative
	 // associated with a single alt state in the state&rarr;config-list map.
	 //
	 // It's also the case that we might have two conflicting configurations but
	 // also a 3rd nonconflicting configuration for a different alternative:
	 // [1|1|[], 1|2|[], 8|3|[]]. This can come about from grammar:
	 //
	 // a : A | A | A B ;
	 //
	 // After matching input A, we reach the stop state for rule A, state 1.
	 // State 8 is the state right before B. Clearly alternatives 1 and 2
	 // conflict and no amount of further lookahead will separate the two.
	 // However, alternative 3 will be able to continue and so we do not
	 // stop working on this state. In the previous example, we're concerned
	 // with states associated with the conflicting alternatives. Here alt
	 // 3 is not associated with the conflicting configs, but since we can continue
	 // looking for input reasonably, I don't declare the state done. We
	 // ignore a set of conflicting alts when we have an alternative
	 // that we still need to pursue.
	//
	
	ParserATNSimulator.prototype.getConflictingAltsOrUniqueAlt = function(configs) {
	    var conflictingAlts = null;
	    if (configs.uniqueAlt!== ATN.INVALID_ALT_NUMBER) {
	        conflictingAlts = new BitSet();
	        conflictingAlts.add(configs.uniqueAlt);
	    } else {
	        conflictingAlts = configs.conflictingAlts;
	    }
	    return conflictingAlts;
	};
	
	ParserATNSimulator.prototype.getTokenName = function( t) {
	    if (t===Token.EOF) {
	        return "EOF";
	    }
	    if( this.parser!==null && this.parser.literalNames!==null) {
	        if (t >= this.parser.literalNames.length) {
	            console.log("" + t + " ttype out of range: " + this.parser.literalNames);
	            console.log("" + this.parser.getInputStream().getTokens());
	        } else {
	            return this.parser.literalNames[t] + "<" + t + ">";
	        }
	    }
	    return "" + t;
	};
	
	ParserATNSimulator.prototype.getLookaheadName = function(input) {
	    return this.getTokenName(input.LA(1));
	};
	
	// Used for debugging in adaptivePredict around execATN but I cut
	//  it out for clarity now that alg. works well. We can leave this
	//  "dead" code for a bit.
	//
	ParserATNSimulator.prototype.dumpDeadEndConfigs = function(nvae) {
	    console.log("dead end configs: ");
	    var decs = nvae.getDeadEndConfigs();
	    for(var i=0; i<decs.length; i++) {
	    	var c = decs[i];
	        var trans = "no edges";
	        if (c.state.transitions.length>0) {
	            var t = c.state.transitions[0];
	            if (t instanceof AtomTransition) {
	                trans = "Atom "+ this.getTokenName(t.label);
	            } else if (t instanceof SetTransition) {
	                var neg = (t instanceof NotSetTransition);
	                trans = (neg ? "~" : "") + "Set " + t.set;
	            }
	        }
	        console.error(c.toString(this.parser, true) + ":" + trans);
	    }
	};
	
	ParserATNSimulator.prototype.noViableAlt = function(input, outerContext, configs, startIndex) {
	    return new NoViableAltException(this.parser, input, input.get(startIndex), input.LT(1), configs, outerContext);
	};
	
	ParserATNSimulator.prototype.getUniqueAlt = function(configs) {
	    var alt = ATN.INVALID_ALT_NUMBER;
	    for(var i=0;i<configs.items.length;i++) {
	    	var c = configs.items[i];
	        if (alt === ATN.INVALID_ALT_NUMBER) {
	            alt = c.alt // found first alt
	        } else if( c.alt!==alt) {
	            return ATN.INVALID_ALT_NUMBER;
	        }
	    }
	    return alt;
	};
	
	//
	// Add an edge to the DFA, if possible. This method calls
	// {@link //addDFAState} to ensure the {@code to} state is present in the
	// DFA. If {@code from} is {@code null}, or if {@code t} is outside the
	// range of edges that can be represented in the DFA tables, this method
	// returns without adding the edge to the DFA.
	//
	// <p>If {@code to} is {@code null}, this method returns {@code null}.
	// Otherwise, this method returns the {@link DFAState} returned by calling
	// {@link //addDFAState} for the {@code to} state.</p>
	//
	// @param dfa The DFA
	// @param from The source state for the edge
	// @param t The input symbol
	// @param to The target state for the edge
	//
	// @return If {@code to} is {@code null}, this method returns {@code null};
	// otherwise this method returns the result of calling {@link //addDFAState}
	// on {@code to}
	//
	ParserATNSimulator.prototype.addDFAEdge = function(dfa, from_, t, to) {
	    if( this.debug) {
	        console.log("EDGE " + from_ + " -> " + to + " upon " + this.getTokenName(t));
	    }
	    if (to===null) {
	        return null;
	    }
	    to = this.addDFAState(dfa, to); // used existing if possible not incoming
	    if (from_===null || t < -1 || t > this.atn.maxTokenType) {
	        return to;
	    }
	    if (from_.edges===null) {
	        from_.edges = [];
	    }
	    from_.edges[t+1] = to; // connect
	
	    if (this.debug) {
	        var names = this.parser===null ? null : this.parser.literalNames;
	        console.log("DFA=\n" + dfa.toString(names));
	    }
	    return to;
	};
	//
	// Add state {@code D} to the DFA if it is not already present, and return
	// the actual instance stored in the DFA. If a state equivalent to {@code D}
	// is already in the DFA, the existing state is returned. Otherwise this
	// method returns {@code D} after adding it to the DFA.
	//
	// <p>If {@code D} is {@link //ERROR}, this method returns {@link //ERROR} and
	// does not change the DFA.</p>
	//
	// @param dfa The dfa
	// @param D The DFA state to add
	// @return The state stored in the DFA. This will be either the existing
	// state if {@code D} is already in the DFA, or {@code D} itself if the
	// state was not already present.
	//
	ParserATNSimulator.prototype.addDFAState = function(dfa, D) {
	    if (D == ATNSimulator.ERROR) {
	        return D;
	    }
	    var hash = D.hashString();
	    var existing = dfa.states[hash] || null;
	    if(existing!==null) {
	        return existing;
	    }
	    D.stateNumber = dfa.states.length;
	    if (! D.configs.readonly) {
	        D.configs.optimizeConfigs(this);
	        D.configs.setReadonly(true);
	    }
	    dfa.states[hash] = D;
	    if (this.debug) {
	        console.log("adding new DFA state: " + D);
	    }
	    return D;
	};
	
	ParserATNSimulator.prototype.reportAttemptingFullContext = function(dfa, conflictingAlts, configs, startIndex, stopIndex) {
	    if (this.debug || this.retry_debug) {
	        var interval = new Interval(startIndex, stopIndex + 1);
	        console.log("reportAttemptingFullContext decision=" + dfa.decision + ":" + configs +
	                           ", input=" + this.parser.getTokenStream().getText(interval));
	    }
	    if (this.parser!==null) {
	        this.parser.getErrorListenerDispatch().reportAttemptingFullContext(this.parser, dfa, startIndex, stopIndex, conflictingAlts, configs);
	    }
	};
	
	ParserATNSimulator.prototype.reportContextSensitivity = function(dfa, prediction, configs, startIndex, stopIndex) {
	    if (this.debug || this.retry_debug) {
	        var interval = new Interval(startIndex, stopIndex + 1);
	        console.log("reportContextSensitivity decision=" + dfa.decision + ":" + configs +
	                           ", input=" + this.parser.getTokenStream().getText(interval));
	    }
	    if (this.parser!==null) {
	        this.parser.getErrorListenerDispatch().reportContextSensitivity(this.parser, dfa, startIndex, stopIndex, prediction, configs);
	    }
	};
	    
	// If context sensitive parsing, we know it's ambiguity not conflict//
	ParserATNSimulator.prototype.reportAmbiguity = function(dfa, D, startIndex, stopIndex,
	                               exact, ambigAlts, configs ) {
	    if (this.debug || this.retry_debug) {
	        var interval = new Interval(startIndex, stopIndex + 1);
	        console.log("reportAmbiguity " + ambigAlts + ":" + configs +
	                           ", input=" + this.parser.getTokenStream().getText(interval));
	    }
	    if (this.parser!==null) {
	        this.parser.getErrorListenerDispatch().reportAmbiguity(this.parser, dfa, startIndex, stopIndex, exact, ambigAlts, configs);
	    }
	};
	            
	exports.ParserATNSimulator = ParserATNSimulator;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	exports.ATN = __webpack_require__(9).ATN;
	exports.ATNDeserializer = __webpack_require__(23).ATNDeserializer;
	exports.LexerATNSimulator = __webpack_require__(36).LexerATNSimulator;
	exports.ParserATNSimulator = __webpack_require__(38).ParserATNSimulator;
	exports.PredictionMode = __webpack_require__(26).PredictionMode;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	var DFAState = __webpack_require__(11).DFAState;
	var ATNConfigSet = __webpack_require__(10).ATNConfigSet;
	var DFASerializer = __webpack_require__(14).DFASerializer;
	var LexerDFASerializer = __webpack_require__(14).LexerDFASerializer;
	
	function DFAStatesSet() {
		return this;
	}
	
	Object.defineProperty(DFAStatesSet.prototype, "length", {
		get : function() {
			return Object.keys(this).length;
		}
	});
	
	function DFA(atnStartState, decision) {
		if (decision === undefined) {
			decision = 0;
		}
		// From which ATN state did we create this DFA?
		this.atnStartState = atnStartState;
		this.decision = decision;
		// A set of all DFA states. Use {@link Map} so we can get old state back
		// ({@link Set} only allows you to see if it's there).
		this._states = new DFAStatesSet();
		this.s0 = null;
		// {@code true} if this DFA is for a precedence decision; otherwise,
		// {@code false}. This is the backing field for {@link //isPrecedenceDfa},
		// {@link //setPrecedenceDfa}.
		this.precedenceDfa = false;
		return this;
	}
	
	// Get the start state for a specific precedence value.
	//
	// @param precedence The current precedence.
	// @return The start state corresponding to the specified precedence, or
	// {@code null} if no start state exists for the specified precedence.
	//
	// @throws IllegalStateException if this is not a precedence DFA.
	// @see //isPrecedenceDfa()
	
	DFA.prototype.getPrecedenceStartState = function(precedence) {
		if (!(this.precedenceDfa)) {
			throw ("Only precedence DFAs may contain a precedence start state.");
		}
		// s0.edges is never null for a precedence DFA
		if (precedence < 0 || precedence >= this.s0.edges.length) {
			return null;
		}
		return this.s0.edges[precedence] || null;
	};
	
	// Set the start state for a specific precedence value.
	//
	// @param precedence The current precedence.
	// @param startState The start state corresponding to the specified
	// precedence.
	//
	// @throws IllegalStateException if this is not a precedence DFA.
	// @see //isPrecedenceDfa()
	//
	DFA.prototype.setPrecedenceStartState = function(precedence, startState) {
		if (!(this.precedenceDfa)) {
			throw ("Only precedence DFAs may contain a precedence start state.");
		}
		if (precedence < 0) {
			return;
		}
	
		// synchronization on s0 here is ok. when the DFA is turned into a
		// precedence DFA, s0 will be initialized once and not updated again
		// s0.edges is never null for a precedence DFA
		this.s0.edges[precedence] = startState;
	};
	
	//
	// Sets whether this is a precedence DFA. If the specified value differs
	// from the current DFA configuration, the following actions are taken;
	// otherwise no changes are made to the current DFA.
	//
	// <ul>
	// <li>The {@link //states} map is cleared</li>
	// <li>If {@code precedenceDfa} is {@code false}, the initial state
	// {@link //s0} is set to {@code null}; otherwise, it is initialized to a new
	// {@link DFAState} with an empty outgoing {@link DFAState//edges} array to
	// store the start states for individual precedence values.</li>
	// <li>The {@link //precedenceDfa} field is updated</li>
	// </ul>
	//
	// @param precedenceDfa {@code true} if this is a precedence DFA; otherwise,
	// {@code false}
	
	DFA.prototype.setPrecedenceDfa = function(precedenceDfa) {
		if (this.precedenceDfa!==precedenceDfa) {
			this._states = new DFAStatesSet();
			if (precedenceDfa) {
				var precedenceState = new DFAState(new ATNConfigSet());
				precedenceState.edges = [];
				precedenceState.isAcceptState = false;
				precedenceState.requiresFullContext = false;
				this.s0 = precedenceState;
			} else {
				this.s0 = null;
			}
			this.precedenceDfa = precedenceDfa;
		}
	};
	
	Object.defineProperty(DFA.prototype, "states", {
		get : function() {
			return this._states;
		}
	});
	
	// Return a list of all states in this DFA, ordered by state number.
	DFA.prototype.sortedStates = function() {
		// states_ is a map of state/state, where key=value
		var keys = Object.keys(this._states);
		var list = [];
		for(var i=0;i<keys.length;i++) {
			list.push(this._states[keys[i]]);
		}
		return list.sort(function(a, b) {
			return a.stateNumber - b.stateNumber;
		});
	};
	
	DFA.prototype.toString = function(literalNames, symbolicNames) {
		literalNames = literalNames || null;
		symbolicNames = symbolicNames || null;
		if (this.s0 === null) {
			return "";
		}
		var serializer = new DFASerializer(this, literalNames, symbolicNames);
		return serializer.toString();
	};
	
	DFA.prototype.toLexerString = function() {
		if (this.s0 === null) {
			return "";
		}
		var serializer = new LexerDFASerializer(this);
		return serializer.toString();
	};
	
	exports.DFA = DFA;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	exports.DFA = __webpack_require__(40).DFA;
	exports.DFASerializer = __webpack_require__(14).DFASerializer;
	exports.LexerDFASerializer = __webpack_require__(14).LexerDFASerializer;
	exports.PredPrediction = __webpack_require__(11).PredPrediction;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	//
	// [The "BSD license"]
	//  Copyright (c) 2012 Terence Parr
	//  Copyright (c) 2012 Sam Harwell
	//  Copyright (c) 2014 Eric Vergnaud
	//  All rights reserved.
	//
	//  Redistribution and use in source and binary forms, with or without
	//  modification, are permitted provided that the following conditions
	//  are met:
	//
	//  1. Redistributions of source code must retain the above copyright
	//     notice, this list of conditions and the following disclaimer.
	//  2. Redistributions in binary form must reproduce the above copyright
	//     notice, this list of conditions and the following disclaimer in the
	//     documentation and/or other materials provided with the distribution.
	//  3. The name of the author may not be used to endorse or promote products
	//     derived from this software without specific prior written permission.
	//
	//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	
	//
	// This implementation of {@link ANTLRErrorListener} can be used to identify
	// certain potential correctness and performance problems in grammars. "Reports"
	// are made by calling {@link Parser//notifyErrorListeners} with the appropriate
	// message.
	//
	// <ul>
	// <li><b>Ambiguities</b>: These are cases where more than one path through the
	// grammar can match the input.</li>
	// <li><b>Weak context sensitivity</b>: These are cases where full-context
	// prediction resolved an SLL conflict to a unique alternative which equaled the
	// minimum alternative of the SLL conflict.</li>
	// <li><b>Strong (forced) context sensitivity</b>: These are cases where the
	// full-context prediction resolved an SLL conflict to a unique alternative,
	// <em>and</em> the minimum alternative of the SLL conflict was found to not be
	// a truly viable alternative. Two-stage parsing cannot be used for inputs where
	// this situation occurs.</li>
	// </ul>
	
	var BitSet = __webpack_require__(3).BitSet;
	var ErrorListener = __webpack_require__(15).ErrorListener;
	var Interval = __webpack_require__(2).Interval;
	
	function DiagnosticErrorListener(exactOnly) {
		ErrorListener.call(this);
		exactOnly = exactOnly || true;
		// whether all ambiguities or only exact ambiguities are reported.
		this.exactOnly = exactOnly;
		return this;
	}
	
	DiagnosticErrorListener.prototype = Object.create(ErrorListener.prototype);
	DiagnosticErrorListener.prototype.constructor = DiagnosticErrorListener;
	
	DiagnosticErrorListener.prototype.reportAmbiguity = function(recognizer, dfa,
			startIndex, stopIndex, exact, ambigAlts, configs) {
		if (this.exactOnly && !exact) {
			return;
		}
		var msg = "reportAmbiguity d=" +
				this.getDecisionDescription(recognizer, dfa) +
				": ambigAlts=" +
				this.getConflictingAlts(ambigAlts, configs) +
				", input='" +
				recognizer.getTokenStream().getText(new Interval(startIndex, stopIndex)) + "'";
		recognizer.notifyErrorListeners(msg);
	};
	
	DiagnosticErrorListener.prototype.reportAttemptingFullContext = function(
			recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
		var msg = "reportAttemptingFullContext d=" +
				this.getDecisionDescription(recognizer, dfa) +
				", input='" +
				recognizer.getTokenStream().getText(new Interval(startIndex, stopIndex)) + "'";
		recognizer.notifyErrorListeners(msg);
	};
	
	DiagnosticErrorListener.prototype.reportContextSensitivity = function(
			recognizer, dfa, startIndex, stopIndex, prediction, configs) {
		var msg = "reportContextSensitivity d=" +
				this.getDecisionDescription(recognizer, dfa) +
				", input='" +
				recognizer.getTokenStream().getText(new Interval(startIndex, stopIndex)) + "'";
		recognizer.notifyErrorListeners(msg);
	};
	
	DiagnosticErrorListener.prototype.getDecisionDescription = function(recognizer, dfa) {
		var decision = dfa.decision;
		var ruleIndex = dfa.atnStartState.ruleIndex;
	
		var ruleNames = recognizer.ruleNames;
		if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
			return "" + decision;
		}
		var ruleName = ruleNames[ruleIndex] || null;
		if (ruleName === null || ruleName.length === 0) {
			return "" + decision;
		}
		return "" + decision + " (" + ruleName + ")";
	};
	
	//
	// Computes the set of conflicting or ambiguous alternatives from a
	// configuration set, if that information was not already provided by the
	// parser.
	//
	// @param reportedAlts The set of conflicting or ambiguous alternatives, as
	// reported by the parser.
	// @param configs The conflicting or ambiguous configuration set.
	// @return Returns {@code reportedAlts} if it is not {@code null}, otherwise
	// returns the set of alternatives represented in {@code configs}.
	//
	DiagnosticErrorListener.prototype.getConflictingAlts = function(reportedAlts, configs) {
		if (reportedAlts !== null) {
			return reportedAlts;
		}
		var result = new BitSet();
		for (var i = 0; i < configs.items.length; i++) {
			result.add(configs.items[i].alt);
		}
		return "{" + result.values().join(", ") + "}";
	};
	
	exports.DiagnosticErrorListener = DiagnosticErrorListener;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	exports.RecognitionException = __webpack_require__(5).RecognitionException;
	exports.NoViableAltException = __webpack_require__(5).NoViableAltException;
	exports.LexerNoViableAltException = __webpack_require__(5).LexerNoViableAltException;
	exports.InputMismatchException = __webpack_require__(5).InputMismatchException;
	exports.FailedPredicateException = __webpack_require__(5).FailedPredicateException;
	exports.DiagnosticErrorListener = __webpack_require__(42).DiagnosticErrorListener;
	exports.BailErrorStrategy = __webpack_require__(27).BailErrorStrategy;
	exports.ErrorListener = __webpack_require__(15).ErrorListener;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * [The "BSD license"]
	 *  Copyright (c) 2012 Terence Parr
	 *  Copyright (c) 2012 Sam Harwell
	 *  All rights reserved.
	 *
	 *  Redistribution and use in source and binary forms, with or without
	 *  modification, are permitted provided that the following conditions
	 *  are met:
	 *
	 *  1. Redistributions of source code must retain the above copyright
	 *     notice, this list of conditions and the following disclaimer.
	 *  2. Redistributions in binary form must reproduce the above copyright
	 *     notice, this list of conditions and the following disclaimer in the
	 *     documentation and/or other materials provided with the distribution.
	 *  3. The name of the author may not be used to endorse or promote products
	 *     derived from this software without specific prior written permission.
	 *
	 *  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
	 *  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	 *  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
	 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
	 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 *  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	 *  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	
	var Utils = __webpack_require__(3);
	var Token = __webpack_require__(1).Token;
	var RuleNode = __webpack_require__(6).RuleNode;
	var ErrorNode = __webpack_require__(6).ErrorNode;
	var TerminalNode = __webpack_require__(6).TerminalNode;
	var ParserRuleContext = __webpack_require__(17).ParserRuleContext;
	
	
	/** A set of utility routines useful for all kinds of ANTLR trees. */
	function Trees() {
	}
	
	// Print out a whole tree in LISP form. {@link //getNodeText} is used on the
	//  node payloads to get the text for the nodes.  Detect
	//  parse trees and extract data appropriately.
	Trees.toStringTree = function(tree, ruleNames, recog) {
		ruleNames = ruleNames || null;
		recog = recog || null;
	    if(recog!==null) {
	       ruleNames = recog.ruleNames;
	    }
	    var s = Trees.getNodeText(tree, ruleNames);
	    s = Utils.escapeWhitespace(s, false);
	    var c = tree.getChildCount();
	    if(c===0) {
	        return s;
	    }
	    var res = "(" + s + ' ';
	    if(c>0) {
	        s = Trees.toStringTree(tree.getChild(0), ruleNames);
	        res = res.concat(s);
	    }
	    for(var i=1;i<c;i++) {
	        s = Trees.toStringTree(tree.getChild(i), ruleNames);
	        res = res.concat(' ' + s);
	    }
	    res = res.concat(")");
	    return res;
	};
	
	Trees.getNodeText = function(t, ruleNames, recog) {
		ruleNames = ruleNames || null;
		recog = recog || null;
	    if(recog!==null) {
	        ruleNames = recog.ruleNames;
	    }
	    if(ruleNames!==null) {
	       if (t instanceof RuleNode) {
	           return ruleNames[t.getRuleContext().ruleIndex];
	       } else if ( t instanceof ErrorNode) {
	           return t.toString();
	       } else if(t instanceof TerminalNode) {
	           if(t.symbol!==null) {
	               return t.symbol.text;
	           }
	       }
	    }
	    // no recog for rule names
	    var payload = t.getPayload();
	    if (payload instanceof Token ) {
	       return payload.text;
	    }
	    return t.getPayload().toString();
	};
	
	
	// Return ordered list of all children of this node
	Trees.getChildren = function(t) {
		var list = [];
		for(var i=0;i<t.getChildCount();i++) {
			list.push(t.getChild(i));
		}
		return list;
	};
	
	// Return a list of all ancestors of this node.  The first node of
	//  list is the root and the last is the parent of this node.
	//
	Trees.getAncestors = function(t) {
	    var ancestors = [];
	    t = t.getParent();
	    while(t!==null) {
	        ancestors = [t].concat(ancestors);
	        t = t.getParent();
	    }
	    return ancestors;
	};
	   
	Trees.findAllTokenNodes = function(t, ttype) {
	    return Trees.findAllNodes(t, ttype, true);
	};
	
	Trees.findAllRuleNodes = function(t, ruleIndex) {
		return Trees.findAllNodes(t, ruleIndex, false);
	};
	
	Trees.findAllNodes = function(t, index, findTokens) {
		var nodes = [];
		Trees._findAllNodes(t, index, findTokens, nodes);
		return nodes;
	};
	
	Trees._findAllNodes = function(t, index, findTokens, nodes) {
		// check this node (the root) first
		if(findTokens && (t instanceof TerminalNode)) {
			if(t.symbol.type===index) {
				nodes.push(t);
			}
		} else if(!findTokens && (t instanceof ParserRuleContext)) {
			if(t.ruleIndex===index) {
				nodes.push(t);
			}
		}
		// check children
		for(var i=0;i<t.getChildCount();i++) {
			Trees._findAllNodes(t.getChild(i), index, findTokens, nodes);
		}
	};
	
	Trees.descendants = function(t) {
		var nodes = [t];
	    for(var i=0;i<t.getChildCount();i++) {
	        nodes = nodes.concat(Trees.descendants(t.getChild(i)));
	    }
	    return nodes;
	};
	
	
	exports.Trees = Trees;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var Tree = __webpack_require__(6);
	exports.Trees = __webpack_require__(6).Trees;
	exports.RuleNode = Tree.RuleNode;
	exports.ParseTreeListener = Tree.ParseTreeListener;
	exports.ParseTreeVisitor = Tree.ParseTreeVisitor;
	exports.ParseTreeWalker = Tree.ParseTreeWalker;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.JsonPathCompiler = exports.createParser = exports.parse = undefined;
	
	var _antlr = __webpack_require__(16);
	
	var _JsonPathLexer = __webpack_require__(47);
	
	var _JsonPathParser = __webpack_require__(48);
	
	var _JsonPathVisitor2 = __webpack_require__(28);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var parse = exports.parse = function parse(input) {
	  return createParser(input).parseJsonPath().accept(new JsonPathCompiler());
	};
	
	var createParser = exports.createParser = function createParser(input) {
	  var chars = new _antlr.InputStream(input);
	  var lexer = new _JsonPathLexer.JsonPathLexer(chars);
	  var tokens = new _antlr.CommonTokenStream(lexer);
	  return new _JsonPathParser.JsonPathParser(tokens);
	};
	
	var JsonPathCompiler = exports.JsonPathCompiler = function (_JsonPathVisitor) {
	  _inherits(JsonPathCompiler, _JsonPathVisitor);
	
	  function JsonPathCompiler() {
	    _classCallCheck(this, JsonPathCompiler);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(JsonPathCompiler).apply(this, arguments));
	  }
	
	  _createClass(JsonPathCompiler, [{
	    key: 'visitParseJsonPath',
	    value: function visitParseJsonPath(ctx) {
	      return this.visit(ctx, 0);
	    }
	  }, {
	    key: 'visitJsonPath',
	    value: function visitJsonPath(ctx) {
	      return this.visitChildren(ctx.accessSpec());
	    }
	  }, {
	    key: 'visitAccessSpec',
	    value: function visitAccessSpec(ctx) {
	      return this.visit(ctx, 0);
	    }
	  }, {
	    key: 'visitDotAccess',
	    value: function visitDotAccess(ctx) {
	      return { index: this.visit(ctx.selector()) };
	    }
	  }, {
	    key: 'visitRecursiveDescent',
	    value: function visitRecursiveDescent(ctx) {
	      return { descent: this.visit(ctx.selector()) };
	    }
	  }, {
	    key: 'visitSelector',
	    value: function visitSelector(ctx) {
	      return this.visit(ctx, 0);
	    }
	  }, {
	    key: 'visitBracketAccess',
	    value: function visitBracketAccess(ctx) {
	      return this.visit(ctx.bracketExpression());
	    }
	  }, {
	    key: 'visitBracketExpression',
	    value: function visitBracketExpression(ctx) {
	      return this.visit(ctx, 0);
	    }
	  }, {
	    key: 'visitInterpolation',
	    value: function visitInterpolation(ctx) {
	      return { interpolation: '$' + ctx.Interpolation().getText() };
	    }
	  }, {
	    key: 'visitFieldIndex',
	    value: function visitFieldIndex(ctx) {
	      return { index: ctx.Identifier() ? ctx.Identifier().getText() : parseInt(ctx.NumericIndex().getText()) };
	    }
	  }, {
	    key: 'visitArraySlice',
	    value: function visitArraySlice(ctx) {
	      return { slice: this.visit(ctx, 0) };
	    }
	  }, {
	    key: 'visitArraySection',
	    value: function visitArraySection(ctx) {
	      return [ctx.startSection ? parseInt(ctx.startSection.text) : 0, ctx.endSection ? parseInt(ctx.endSection.text) : -1, ctx.stepSection ? parseInt(ctx.stepSection.text) : 1];
	    }
	  }, {
	    key: 'visitSimpleSection',
	    value: function visitSimpleSection(ctx) {
	      return [parseInt(ctx.startSection.text), parseInt(ctx.endSection.text), 1];
	    }
	  }, {
	    key: 'visitTerminal',
	    value: function visitTerminal(ctx) {
	      return ctx.getText();
	    }
	  }, {
	    key: 'visitErrorNode',
	    value: function visitErrorNode(ctx) {
	      console.log(ctx);
	    }
	  }, {
	    key: 'visit',
	    value: function visit(ctx, index) {
	      if (typeof index === 'undefined') {
	        return ctx.accept(this);
	      } else {
	        return ctx.getChild(index).accept(this);
	      }
	    }
	  }, {
	    key: 'visitChildren',
	    value: function visitChildren(contexts) {
	      var _this2 = this;
	
	      return contexts.map(function (x) {
	        return x.accept(_this2);
	      });
	    }
	  }, {
	    key: 'bubble',
	    value: function bubble(children, resultBuilder) {
	      if (children.length == 1) {
	        return this.visit(children[0]);
	      } else {
	        return resultBuilder(this.visitChildren(children));
	      }
	    }
	  }]);
	
	  return JsonPathCompiler;
	}(_JsonPathVisitor2.JsonPathVisitor);

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	// Generated from /Users/gboyer/Projects/JavaScript/jspath-mutator/src/antlr/JsonPath.g4 by ANTLR 4.5.1
	// jshint ignore: start
	var antlr4 = __webpack_require__(16);
	
	var serializedATN = ["\u0003а훑舆괭䐗껱趀ꫝ", "\u0002\u000eS\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004", "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t", "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004", "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0003\u0002", "\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005", "\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007", "\u0003\b\u0003\b\u0003\t\u0003\t\u0003\n\u0003\n\u0007\n3\n\n\f\n\u000e", "\n6\u000b\n\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0007\u000b<\n\u000b", "\f\u000b\u000e\u000b?\u000b\u000b\u0003\f\u0005\fB\n\f\u0003\f\u0006", "\fE\n\f\r\f\u000e\fF\u0003\r\u0006\rJ\n\r\r\r\u000e\rK\u0003\r\u0003", "\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u00034\u0002\u0010", "\u0003\u0003\u0005\u0004\u0007\u0005\t\u0006\u000b\u0007\r\b\u000f\t", "\u0011\n\u0013\u000b\u0015\f\u0017\r\u0019\u000e\u001b\u0002\u001d\u0002", "\u0003\u0002\u0007\u0004\u0002--//\u0003\u00022;\u0005\u0002\u000b\f", "\u000f\u000f\"\"\u0005\u0002C\\aac|\u0006\u00022;C\\aac|U\u0002\u0003", "\u0003\u0002\u0002\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0002\u0007", "\u0003\u0002\u0002\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002\u000b", "\u0003\u0002\u0002\u0002\u0002\r\u0003\u0002\u0002\u0002\u0002\u000f", "\u0003\u0002\u0002\u0002\u0002\u0011\u0003\u0002\u0002\u0002\u0002\u0013", "\u0003\u0002\u0002\u0002\u0002\u0015\u0003\u0002\u0002\u0002\u0002\u0017", "\u0003\u0002\u0002\u0002\u0002\u0019\u0003\u0002\u0002\u0002\u0003\u001f", "\u0003\u0002\u0002\u0002\u0005!\u0003\u0002\u0002\u0002\u0007#\u0003", "\u0002\u0002\u0002\t%\u0003\u0002\u0002\u0002\u000b'\u0003\u0002\u0002", "\u0002\r*\u0003\u0002\u0002\u0002\u000f,\u0003\u0002\u0002\u0002\u0011", ".\u0003\u0002\u0002\u0002\u00130\u0003\u0002\u0002\u0002\u00159\u0003", "\u0002\u0002\u0002\u0017A\u0003\u0002\u0002\u0002\u0019I\u0003\u0002", "\u0002\u0002\u001bO\u0003\u0002\u0002\u0002\u001dQ\u0003\u0002\u0002", "\u0002\u001f \u0007&\u0002\u0002 \u0004\u0003\u0002\u0002\u0002!\"\u0007", "0\u0002\u0002\"\u0006\u0003\u0002\u0002\u0002#$\u0007]\u0002\u0002$", "\b\u0003\u0002\u0002\u0002%&\u0007_\u0002\u0002&\n\u0003\u0002\u0002", "\u0002'(\u00070\u0002\u0002()\u00070\u0002\u0002)\f\u0003\u0002\u0002", "\u0002*+\u0007,\u0002\u0002+\u000e\u0003\u0002\u0002\u0002,-\u0007<", "\u0002\u0002-\u0010\u0003\u0002\u0002\u0002./\u0007.\u0002\u0002/\u0012", "\u0003\u0002\u0002\u000204\u0007}\u0002\u000213\u000b\u0002\u0002\u0002", "21\u0003\u0002\u0002\u000236\u0003\u0002\u0002\u000245\u0003\u0002\u0002", "\u000242\u0003\u0002\u0002\u000257\u0003\u0002\u0002\u000264\u0003\u0002", "\u0002\u000278\u0007\u0002\u00028\u0014\u0003\u0002\u0002\u0002", "9=\u0005\u001b\u000e\u0002:<\u0005\u001d\u000f\u0002;:\u0003\u0002\u0002", "\u0002<?\u0003\u0002\u0002\u0002=;\u0003\u0002\u0002\u0002=>\u0003\u0002", "\u0002\u0002>\u0016\u0003\u0002\u0002\u0002?=\u0003\u0002\u0002\u0002", "@B\t\u0002\u0002\u0002A@\u0003\u0002\u0002\u0002AB\u0003\u0002\u0002", "\u0002BD\u0003\u0002\u0002\u0002CE\t\u0003\u0002\u0002DC\u0003\u0002", "\u0002\u0002EF\u0003\u0002\u0002\u0002FD\u0003\u0002\u0002\u0002FG\u0003", "\u0002\u0002\u0002G\u0018\u0003\u0002\u0002\u0002HJ\t\u0004\u0002\u0002", "IH\u0003\u0002\u0002\u0002JK\u0003\u0002\u0002\u0002KI\u0003\u0002\u0002", "\u0002KL\u0003\u0002\u0002\u0002LM\u0003\u0002\u0002\u0002MN\b\r\u0002", "\u0002N\u001a\u0003\u0002\u0002\u0002OP\t\u0005\u0002\u0002P\u001c\u0003", "\u0002\u0002\u0002QR\t\u0006\u0002\u0002R\u001e\u0003\u0002\u0002\u0002", "\b\u00024=AFK\u0003\b\u0002\u0002"].join("");
	
	var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);
	
	var decisionsToDFA = atn.decisionToState.map(function (ds, index) {
	    return new antlr4.dfa.DFA(ds, index);
	});
	
	function JsonPathLexer(input) {
	    antlr4.Lexer.call(this, input);
	    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
	    return this;
	}
	
	JsonPathLexer.prototype = Object.create(antlr4.Lexer.prototype);
	JsonPathLexer.prototype.constructor = JsonPathLexer;
	
	JsonPathLexer.EOF = antlr4.Token.EOF;
	JsonPathLexer.T__0 = 1;
	JsonPathLexer.T__1 = 2;
	JsonPathLexer.T__2 = 3;
	JsonPathLexer.T__3 = 4;
	JsonPathLexer.T__4 = 5;
	JsonPathLexer.T__5 = 6;
	JsonPathLexer.T__6 = 7;
	JsonPathLexer.T__7 = 8;
	JsonPathLexer.Interpolation = 9;
	JsonPathLexer.Identifier = 10;
	JsonPathLexer.NumericIndex = 11;
	JsonPathLexer.WS = 12;
	
	JsonPathLexer.modeNames = ["DEFAULT_MODE"];
	
	JsonPathLexer.literalNames = ['null', "'$'", "'.'", "'['", "']'", "'..'", "'*'", "':'", "','"];
	
	JsonPathLexer.symbolicNames = ['null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', "Interpolation", "Identifier", "NumericIndex", "WS"];
	
	JsonPathLexer.ruleNames = ["T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", "Interpolation", "Identifier", "NumericIndex", "WS", "IdentifierStart", "IdentifierChar"];
	
	JsonPathLexer.grammarFileName = "JsonPath.g4";
	
	exports.JsonPathLexer = JsonPathLexer;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Generated from /Users/gboyer/Projects/JavaScript/jspath-mutator/src/antlr/JsonPath.g4 by ANTLR 4.5.1
	// jshint ignore: start
	var antlr4 = __webpack_require__(16);
	var JsonPathVisitor = __webpack_require__(28).JsonPathVisitor;
	
	var grammarFileName = "JsonPath.g4";
	
	var serializedATN = ['\u0003а훑舆괭䐗껱趀ꫝ', '\u0003\u000eS\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t', '\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004', '\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004', '\r\t\r\u0004\u000e\t\u000e\u0003\u0002\u0003\u0002\u0003\u0002\u0003', '\u0003\u0003\u0003\u0006\u0003"\n\u0003\r\u0003\u000e\u0003#\u0003', '\u0004\u0003\u0004\u0003\u0004\u0005\u0004)\n\u0004\u0003\u0005\u0003', '\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003', '\u0007\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003\t\u0003\t\u0003', '\t\u0005\t:\n\t\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0005\u000b', '@\n\u000b\u0003\f\u0005\fC\n\f\u0003\f\u0003\f\u0005\fG\n\f\u0003\f', '\u0003\f\u0005\fK\n\f\u0003\r\u0003\r\u0003\r\u0003\r\u0003\u000e\u0003', '\u000e\u0003\u000e\u0002\u0002\u000f\u0002\u0004\u0006\b\n\f\u000e\u0010', '\u0012\u0014\u0016\u0018\u001a\u0002\u0004\u0004\u0002\b\b\f\f\u0003', '\u0002\f\rN\u0002\u001c\u0003\u0002\u0002\u0002\u0004\u001f\u0003\u0002', '\u0002\u0002\u0006(\u0003\u0002\u0002\u0002\b*\u0003\u0002\u0002\u0002', '\n-\u0003\u0002\u0002\u0002\f1\u0003\u0002\u0002\u0002\u000e4\u0003', '\u0002\u0002\u0002\u00109\u0003\u0002\u0002\u0002\u0012;\u0003\u0002', '\u0002\u0002\u0014?\u0003\u0002\u0002\u0002\u0016B\u0003\u0002\u0002', '\u0002\u0018L\u0003\u0002\u0002\u0002\u001aP\u0003\u0002\u0002\u0002', '\u001c\u001d\u0005\u0004\u0003\u0002\u001d\u001e\u0007\u0002\u0002\u0003', '\u001e\u0003\u0003\u0002\u0002\u0002\u001f!\u0007\u0003\u0002\u0002', ' "\u0005\u0006\u0004\u0002! \u0003\u0002\u0002\u0002"#\u0003\u0002', '\u0002\u0002#!\u0003\u0002\u0002\u0002#$\u0003\u0002\u0002\u0002$\u0005', '\u0003\u0002\u0002\u0002%)\u0005\f\u0007\u0002&)\u0005\b\u0005\u0002', '\')\u0005\n\u0006\u0002(%\u0003\u0002\u0002\u0002(&\u0003\u0002\u0002', '\u0002(\'\u0003\u0002\u0002\u0002)\u0007\u0003\u0002\u0002\u0002*+\u0007', '\u0004\u0002\u0002+,\u0005\u000e\b\u0002,\t\u0003\u0002\u0002\u0002', '-.\u0007\u0005\u0002\u0002./\u0005\u0010\t\u0002/0\u0007\u0006\u0002', '\u00020\u000b\u0003\u0002\u0002\u000212\u0007\u0007\u0002\u000223\u0005', '\u000e\b\u00023\r\u0003\u0002\u0002\u000245\t\u0002\u0002\u00025\u000f', '\u0003\u0002\u0002\u00026:\u0005\u001a\u000e\u00027:\u0005\u0014\u000b', '\u00028:\u0005\u0012\n\u000296\u0003\u0002\u0002\u000297\u0003\u0002', '\u0002\u000298\u0003\u0002\u0002\u0002:\u0011\u0003\u0002\u0002\u0002', ';<\u0007\u000b\u0002\u0002<\u0013\u0003\u0002\u0002\u0002=@\u0005\u0016', '\f\u0002>@\u0005\u0018\r\u0002?=\u0003\u0002\u0002\u0002?>\u0003\u0002', '\u0002\u0002@\u0015\u0003\u0002\u0002\u0002AC\u0007\r\u0002\u0002BA', '\u0003\u0002\u0002\u0002BC\u0003\u0002\u0002\u0002CD\u0003\u0002\u0002', '\u0002DF\u0007\t\u0002\u0002EG\u0007\r\u0002\u0002FE\u0003\u0002\u0002', '\u0002FG\u0003\u0002\u0002\u0002GJ\u0003\u0002\u0002\u0002HI\u0007\t', '\u0002\u0002IK\u0007\r\u0002\u0002JH\u0003\u0002\u0002\u0002JK\u0003', '\u0002\u0002\u0002K\u0017\u0003\u0002\u0002\u0002LM\u0007\r\u0002\u0002', 'MN\u0007\n\u0002\u0002NO\u0007\r\u0002\u0002O\u0019\u0003\u0002\u0002', '\u0002PQ\t\u0003\u0002\u0002Q\u001b\u0003\u0002\u0002\u0002\t#(9?BF', "J"].join("");
	
	var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);
	
	var decisionsToDFA = atn.decisionToState.map(function (ds, index) {
	    return new antlr4.dfa.DFA(ds, index);
	});
	
	var sharedContextCache = new antlr4.PredictionContextCache();
	
	var literalNames = ['null', "'$'", "'.'", "'['", "']'", "'..'", "'*'", "':'", "','"];
	
	var symbolicNames = ['null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', "Interpolation", "Identifier", "NumericIndex", "WS"];
	
	var ruleNames = ["parseJsonPath", "jsonPath", "accessSpec", "dotAccess", "bracketAccess", "recursiveDescent", "selector", "bracketExpression", "interpolation", "arraySlice", "arraySection", "simpleSection", "fieldIndex"];
	
	function JsonPathParser(input) {
	    antlr4.Parser.call(this, input);
	    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
	    this.ruleNames = ruleNames;
	    this.literalNames = literalNames;
	    this.symbolicNames = symbolicNames;
	    return this;
	}
	
	JsonPathParser.prototype = Object.create(antlr4.Parser.prototype);
	JsonPathParser.prototype.constructor = JsonPathParser;
	
	Object.defineProperty(JsonPathParser.prototype, "atn", {
	    get: function get() {
	        return atn;
	    }
	});
	
	JsonPathParser.EOF = antlr4.Token.EOF;
	JsonPathParser.T__0 = 1;
	JsonPathParser.T__1 = 2;
	JsonPathParser.T__2 = 3;
	JsonPathParser.T__3 = 4;
	JsonPathParser.T__4 = 5;
	JsonPathParser.T__5 = 6;
	JsonPathParser.T__6 = 7;
	JsonPathParser.T__7 = 8;
	JsonPathParser.Interpolation = 9;
	JsonPathParser.Identifier = 10;
	JsonPathParser.NumericIndex = 11;
	JsonPathParser.WS = 12;
	
	JsonPathParser.RULE_parseJsonPath = 0;
	JsonPathParser.RULE_jsonPath = 1;
	JsonPathParser.RULE_accessSpec = 2;
	JsonPathParser.RULE_dotAccess = 3;
	JsonPathParser.RULE_bracketAccess = 4;
	JsonPathParser.RULE_recursiveDescent = 5;
	JsonPathParser.RULE_selector = 6;
	JsonPathParser.RULE_bracketExpression = 7;
	JsonPathParser.RULE_interpolation = 8;
	JsonPathParser.RULE_arraySlice = 9;
	JsonPathParser.RULE_arraySection = 10;
	JsonPathParser.RULE_simpleSection = 11;
	JsonPathParser.RULE_fieldIndex = 12;
	
	function ParseJsonPathContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_parseJsonPath;
	    return this;
	}
	
	ParseJsonPathContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	ParseJsonPathContext.prototype.constructor = ParseJsonPathContext;
	
	ParseJsonPathContext.prototype.jsonPath = function () {
	    return this.getTypedRuleContext(JsonPathContext, 0);
	};
	
	ParseJsonPathContext.prototype.EOF = function () {
	    return this.getToken(JsonPathParser.EOF, 0);
	};
	
	ParseJsonPathContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitParseJsonPath(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.ParseJsonPathContext = ParseJsonPathContext;
	
	JsonPathParser.prototype.parseJsonPath = function () {
	
	    var localctx = new ParseJsonPathContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, JsonPathParser.RULE_parseJsonPath);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 26;
	        this.jsonPath();
	        this.state = 27;
	        this.match(JsonPathParser.EOF);
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function JsonPathContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_jsonPath;
	    return this;
	}
	
	JsonPathContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	JsonPathContext.prototype.constructor = JsonPathContext;
	
	JsonPathContext.prototype.accessSpec = function (i) {
	    if (i === undefined) {
	        i = null;
	    }
	    if (i === null) {
	        return this.getTypedRuleContexts(AccessSpecContext);
	    } else {
	        return this.getTypedRuleContext(AccessSpecContext, i);
	    }
	};
	
	JsonPathContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitJsonPath(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.JsonPathContext = JsonPathContext;
	
	JsonPathParser.prototype.jsonPath = function () {
	
	    var localctx = new JsonPathContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, JsonPathParser.RULE_jsonPath);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 29;
	        this.match(JsonPathParser.T__0);
	        this.state = 31;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 30;
	            this.accessSpec();
	            this.state = 33;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while ((_la & ~0x1f) == 0 && (1 << _la & (1 << JsonPathParser.T__1 | 1 << JsonPathParser.T__2 | 1 << JsonPathParser.T__4)) !== 0);
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function AccessSpecContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_accessSpec;
	    return this;
	}
	
	AccessSpecContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	AccessSpecContext.prototype.constructor = AccessSpecContext;
	
	AccessSpecContext.prototype.recursiveDescent = function () {
	    return this.getTypedRuleContext(RecursiveDescentContext, 0);
	};
	
	AccessSpecContext.prototype.dotAccess = function () {
	    return this.getTypedRuleContext(DotAccessContext, 0);
	};
	
	AccessSpecContext.prototype.bracketAccess = function () {
	    return this.getTypedRuleContext(BracketAccessContext, 0);
	};
	
	AccessSpecContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitAccessSpec(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.AccessSpecContext = AccessSpecContext;
	
	JsonPathParser.prototype.accessSpec = function () {
	
	    var localctx = new AccessSpecContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, JsonPathParser.RULE_accessSpec);
	    try {
	        this.state = 38;
	        switch (this._input.LA(1)) {
	            case JsonPathParser.T__4:
	                this.enterOuterAlt(localctx, 1);
	                this.state = 35;
	                this.recursiveDescent();
	                break;
	            case JsonPathParser.T__1:
	                this.enterOuterAlt(localctx, 2);
	                this.state = 36;
	                this.dotAccess();
	                break;
	            case JsonPathParser.T__2:
	                this.enterOuterAlt(localctx, 3);
	                this.state = 37;
	                this.bracketAccess();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function DotAccessContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_dotAccess;
	    return this;
	}
	
	DotAccessContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	DotAccessContext.prototype.constructor = DotAccessContext;
	
	DotAccessContext.prototype.selector = function () {
	    return this.getTypedRuleContext(SelectorContext, 0);
	};
	
	DotAccessContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitDotAccess(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.DotAccessContext = DotAccessContext;
	
	JsonPathParser.prototype.dotAccess = function () {
	
	    var localctx = new DotAccessContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, JsonPathParser.RULE_dotAccess);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 40;
	        this.match(JsonPathParser.T__1);
	        this.state = 41;
	        this.selector();
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function BracketAccessContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_bracketAccess;
	    return this;
	}
	
	BracketAccessContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	BracketAccessContext.prototype.constructor = BracketAccessContext;
	
	BracketAccessContext.prototype.bracketExpression = function () {
	    return this.getTypedRuleContext(BracketExpressionContext, 0);
	};
	
	BracketAccessContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitBracketAccess(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.BracketAccessContext = BracketAccessContext;
	
	JsonPathParser.prototype.bracketAccess = function () {
	
	    var localctx = new BracketAccessContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, JsonPathParser.RULE_bracketAccess);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 43;
	        this.match(JsonPathParser.T__2);
	        this.state = 44;
	        this.bracketExpression();
	        this.state = 45;
	        this.match(JsonPathParser.T__3);
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function RecursiveDescentContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_recursiveDescent;
	    return this;
	}
	
	RecursiveDescentContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	RecursiveDescentContext.prototype.constructor = RecursiveDescentContext;
	
	RecursiveDescentContext.prototype.selector = function () {
	    return this.getTypedRuleContext(SelectorContext, 0);
	};
	
	RecursiveDescentContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitRecursiveDescent(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.RecursiveDescentContext = RecursiveDescentContext;
	
	JsonPathParser.prototype.recursiveDescent = function () {
	
	    var localctx = new RecursiveDescentContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, JsonPathParser.RULE_recursiveDescent);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 47;
	        this.match(JsonPathParser.T__4);
	        this.state = 48;
	        this.selector();
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function SelectorContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_selector;
	    return this;
	}
	
	SelectorContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	SelectorContext.prototype.constructor = SelectorContext;
	
	SelectorContext.prototype.Identifier = function () {
	    return this.getToken(JsonPathParser.Identifier, 0);
	};
	
	SelectorContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitSelector(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.SelectorContext = SelectorContext;
	
	JsonPathParser.prototype.selector = function () {
	
	    var localctx = new SelectorContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, JsonPathParser.RULE_selector);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 50;
	        _la = this._input.LA(1);
	        if (!(_la === JsonPathParser.T__5 || _la === JsonPathParser.Identifier)) {
	            this._errHandler.recoverInline(this);
	        } else {
	            this.consume();
	        }
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function BracketExpressionContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_bracketExpression;
	    return this;
	}
	
	BracketExpressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	BracketExpressionContext.prototype.constructor = BracketExpressionContext;
	
	BracketExpressionContext.prototype.fieldIndex = function () {
	    return this.getTypedRuleContext(FieldIndexContext, 0);
	};
	
	BracketExpressionContext.prototype.arraySlice = function () {
	    return this.getTypedRuleContext(ArraySliceContext, 0);
	};
	
	BracketExpressionContext.prototype.interpolation = function () {
	    return this.getTypedRuleContext(InterpolationContext, 0);
	};
	
	BracketExpressionContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitBracketExpression(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.BracketExpressionContext = BracketExpressionContext;
	
	JsonPathParser.prototype.bracketExpression = function () {
	
	    var localctx = new BracketExpressionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, JsonPathParser.RULE_bracketExpression);
	    try {
	        this.state = 55;
	        var la_ = this._interp.adaptivePredict(this._input, 2, this._ctx);
	        switch (la_) {
	            case 1:
	                this.enterOuterAlt(localctx, 1);
	                this.state = 52;
	                this.fieldIndex();
	                break;
	
	            case 2:
	                this.enterOuterAlt(localctx, 2);
	                this.state = 53;
	                this.arraySlice();
	                break;
	
	            case 3:
	                this.enterOuterAlt(localctx, 3);
	                this.state = 54;
	                this.interpolation();
	                break;
	
	        }
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function InterpolationContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_interpolation;
	    return this;
	}
	
	InterpolationContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	InterpolationContext.prototype.constructor = InterpolationContext;
	
	InterpolationContext.prototype.Interpolation = function () {
	    return this.getToken(JsonPathParser.Interpolation, 0);
	};
	
	InterpolationContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitInterpolation(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.InterpolationContext = InterpolationContext;
	
	JsonPathParser.prototype.interpolation = function () {
	
	    var localctx = new InterpolationContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 16, JsonPathParser.RULE_interpolation);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 57;
	        this.match(JsonPathParser.Interpolation);
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function ArraySliceContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_arraySlice;
	    return this;
	}
	
	ArraySliceContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	ArraySliceContext.prototype.constructor = ArraySliceContext;
	
	ArraySliceContext.prototype.arraySection = function () {
	    return this.getTypedRuleContext(ArraySectionContext, 0);
	};
	
	ArraySliceContext.prototype.simpleSection = function () {
	    return this.getTypedRuleContext(SimpleSectionContext, 0);
	};
	
	ArraySliceContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitArraySlice(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.ArraySliceContext = ArraySliceContext;
	
	JsonPathParser.prototype.arraySlice = function () {
	
	    var localctx = new ArraySliceContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, JsonPathParser.RULE_arraySlice);
	    try {
	        this.state = 61;
	        var la_ = this._interp.adaptivePredict(this._input, 3, this._ctx);
	        switch (la_) {
	            case 1:
	                this.enterOuterAlt(localctx, 1);
	                this.state = 59;
	                this.arraySection();
	                break;
	
	            case 2:
	                this.enterOuterAlt(localctx, 2);
	                this.state = 60;
	                this.simpleSection();
	                break;
	
	        }
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function ArraySectionContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_arraySection;
	    this.startSection = null; // Token
	    this.endSection = null; // Token
	    this.stepSection = null; // Token
	    return this;
	}
	
	ArraySectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	ArraySectionContext.prototype.constructor = ArraySectionContext;
	
	ArraySectionContext.prototype.NumericIndex = function (i) {
	    if (i === undefined) {
	        i = null;
	    }
	    if (i === null) {
	        return this.getTokens(JsonPathParser.NumericIndex);
	    } else {
	        return this.getToken(JsonPathParser.NumericIndex, i);
	    }
	};
	
	ArraySectionContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitArraySection(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.ArraySectionContext = ArraySectionContext;
	
	JsonPathParser.prototype.arraySection = function () {
	
	    var localctx = new ArraySectionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 20, JsonPathParser.RULE_arraySection);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 64;
	        _la = this._input.LA(1);
	        if (_la === JsonPathParser.NumericIndex) {
	            this.state = 63;
	            localctx.startSection = this.match(JsonPathParser.NumericIndex);
	        }
	
	        this.state = 66;
	        this.match(JsonPathParser.T__6);
	        this.state = 68;
	        _la = this._input.LA(1);
	        if (_la === JsonPathParser.NumericIndex) {
	            this.state = 67;
	            localctx.endSection = this.match(JsonPathParser.NumericIndex);
	        }
	
	        this.state = 72;
	        _la = this._input.LA(1);
	        if (_la === JsonPathParser.T__6) {
	            this.state = 70;
	            this.match(JsonPathParser.T__6);
	            this.state = 71;
	            localctx.stepSection = this.match(JsonPathParser.NumericIndex);
	        }
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function SimpleSectionContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_simpleSection;
	    this.startSection = null; // Token
	    this.endSection = null; // Token
	    return this;
	}
	
	SimpleSectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	SimpleSectionContext.prototype.constructor = SimpleSectionContext;
	
	SimpleSectionContext.prototype.NumericIndex = function (i) {
	    if (i === undefined) {
	        i = null;
	    }
	    if (i === null) {
	        return this.getTokens(JsonPathParser.NumericIndex);
	    } else {
	        return this.getToken(JsonPathParser.NumericIndex, i);
	    }
	};
	
	SimpleSectionContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitSimpleSection(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.SimpleSectionContext = SimpleSectionContext;
	
	JsonPathParser.prototype.simpleSection = function () {
	
	    var localctx = new SimpleSectionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 22, JsonPathParser.RULE_simpleSection);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 74;
	        localctx.startSection = this.match(JsonPathParser.NumericIndex);
	        this.state = 75;
	        this.match(JsonPathParser.T__7);
	        this.state = 76;
	        localctx.endSection = this.match(JsonPathParser.NumericIndex);
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	function FieldIndexContext(parser, parent, invokingState) {
	    if (parent === undefined) {
	        parent = null;
	    }
	    if (invokingState === undefined || invokingState === null) {
	        invokingState = -1;
	    }
	    antlr4.ParserRuleContext.call(this, parent, invokingState);
	    this.parser = parser;
	    this.ruleIndex = JsonPathParser.RULE_fieldIndex;
	    return this;
	}
	
	FieldIndexContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
	FieldIndexContext.prototype.constructor = FieldIndexContext;
	
	FieldIndexContext.prototype.Identifier = function () {
	    return this.getToken(JsonPathParser.Identifier, 0);
	};
	
	FieldIndexContext.prototype.NumericIndex = function () {
	    return this.getToken(JsonPathParser.NumericIndex, 0);
	};
	
	FieldIndexContext.prototype.accept = function (visitor) {
	    if (visitor instanceof JsonPathVisitor) {
	        return visitor.visitFieldIndex(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	};
	
	JsonPathParser.FieldIndexContext = FieldIndexContext;
	
	JsonPathParser.prototype.fieldIndex = function () {
	
	    var localctx = new FieldIndexContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 24, JsonPathParser.RULE_fieldIndex);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 78;
	        _la = this._input.LA(1);
	        if (!(_la === JsonPathParser.Identifier || _la === JsonPathParser.NumericIndex)) {
	            this._errHandler.recoverInline(this);
	        } else {
	            this.consume();
	        }
	    } catch (re) {
	        if (re instanceof antlr4.error.RecognitionException) {
	            localctx.exception = re;
	            this._errHandler.reportError(this, re);
	            this._errHandler.recover(this, re);
	        } else {
	            throw re;
	        }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	};
	
	exports.JsonPathParser = JsonPathParser;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * lodash 4.2.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash -d -o ./foo/lodash.js`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	;(function() {
	
	  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
	  var undefined;
	
	  /** Used as the semantic version number. */
	  var VERSION = '4.2.1';
	
	  /** Used to compose bitmasks for wrapper metadata. */
	  var BIND_FLAG = 1,
	      BIND_KEY_FLAG = 2,
	      CURRY_BOUND_FLAG = 4,
	      CURRY_FLAG = 8,
	      CURRY_RIGHT_FLAG = 16,
	      PARTIAL_FLAG = 32,
	      PARTIAL_RIGHT_FLAG = 64,
	      ARY_FLAG = 128,
	      REARG_FLAG = 256,
	      FLIP_FLAG = 512;
	
	  /** Used to compose bitmasks for comparison styles. */
	  var UNORDERED_COMPARE_FLAG = 1,
	      PARTIAL_COMPARE_FLAG = 2;
	
	  /** Used as default options for `_.truncate`. */
	  var DEFAULT_TRUNC_LENGTH = 30,
	      DEFAULT_TRUNC_OMISSION = '...';
	
	  /** Used to detect hot functions by number of calls within a span of milliseconds. */
	  var HOT_COUNT = 150,
	      HOT_SPAN = 16;
	
	  /** Used as the size to enable large array optimizations. */
	  var LARGE_ARRAY_SIZE = 200;
	
	  /** Used to indicate the type of lazy iteratees. */
	  var LAZY_FILTER_FLAG = 1,
	      LAZY_MAP_FLAG = 2,
	      LAZY_WHILE_FLAG = 3;
	
	  /** Used as the `TypeError` message for "Functions" methods. */
	  var FUNC_ERROR_TEXT = 'Expected a function';
	
	  /** Used to stand-in for `undefined` hash values. */
	  var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	  /** Used as references for various `Number` constants. */
	  var INFINITY = 1 / 0,
	      MAX_SAFE_INTEGER = 9007199254740991,
	      MAX_INTEGER = 1.7976931348623157e+308,
	      NAN = 0 / 0;
	
	  /** Used as references for the maximum length and index of an array. */
	  var MAX_ARRAY_LENGTH = 4294967295,
	      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
	      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
	
	  /** Used as the internal argument placeholder. */
	  var PLACEHOLDER = '__lodash_placeholder__';
	
	  /** `Object#toString` result references. */
	  var argsTag = '[object Arguments]',
	      arrayTag = '[object Array]',
	      boolTag = '[object Boolean]',
	      dateTag = '[object Date]',
	      errorTag = '[object Error]',
	      funcTag = '[object Function]',
	      genTag = '[object GeneratorFunction]',
	      mapTag = '[object Map]',
	      numberTag = '[object Number]',
	      objectTag = '[object Object]',
	      regexpTag = '[object RegExp]',
	      setTag = '[object Set]',
	      stringTag = '[object String]',
	      symbolTag = '[object Symbol]',
	      weakMapTag = '[object WeakMap]';
	
	  var arrayBufferTag = '[object ArrayBuffer]',
	      float32Tag = '[object Float32Array]',
	      float64Tag = '[object Float64Array]',
	      int8Tag = '[object Int8Array]',
	      int16Tag = '[object Int16Array]',
	      int32Tag = '[object Int32Array]',
	      uint8Tag = '[object Uint8Array]',
	      uint8ClampedTag = '[object Uint8ClampedArray]',
	      uint16Tag = '[object Uint16Array]',
	      uint32Tag = '[object Uint32Array]';
	
	  /** Used to match empty string literals in compiled template source. */
	  var reEmptyStringLeading = /\b__p \+= '';/g,
	      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
	
	  /** Used to match HTML entities and HTML characters. */
	  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
	      reUnescapedHtml = /[&<>"'`]/g,
	      reHasEscapedHtml = RegExp(reEscapedHtml.source),
	      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
	
	  /** Used to match template delimiters. */
	  var reEscape = /<%-([\s\S]+?)%>/g,
	      reEvaluate = /<%([\s\S]+?)%>/g,
	      reInterpolate = /<%=([\s\S]+?)%>/g;
	
	  /** Used to match property names within property paths. */
	  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	      reIsPlainProp = /^\w*$/,
	      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;
	
	  /** Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns). */
	  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
	      reHasRegExpChar = RegExp(reRegExpChar.source);
	
	  /** Used to match leading and trailing whitespace. */
	  var reTrim = /^\s+|\s+$/g,
	      reTrimStart = /^\s+/,
	      reTrimEnd = /\s+$/;
	
	  /** Used to match backslashes in property paths. */
	  var reEscapeChar = /\\(\\)?/g;
	
	  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
	  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
	
	  /** Used to match `RegExp` flags from their coerced string values. */
	  var reFlags = /\w*$/;
	
	  /** Used to detect hexadecimal string values. */
	  var reHasHexPrefix = /^0x/i;
	
	  /** Used to detect bad signed hexadecimal string values. */
	  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	
	  /** Used to detect binary string values. */
	  var reIsBinary = /^0b[01]+$/i;
	
	  /** Used to detect host constructors (Safari > 5). */
	  var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	  /** Used to detect octal string values. */
	  var reIsOctal = /^0o[0-7]+$/i;
	
	  /** Used to detect unsigned integer values. */
	  var reIsUint = /^(?:0|[1-9]\d*)$/;
	
	  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
	  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;
	
	  /** Used to ensure capturing order of template delimiters. */
	  var reNoMatch = /($^)/;
	
	  /** Used to match unescaped characters in compiled string literals. */
	  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
	
	  /** Used to compose unicode character classes. */
	  var rsAstralRange = '\\ud800-\\udfff',
	      rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
	      rsComboSymbolsRange = '\\u20d0-\\u20f0',
	      rsDingbatRange = '\\u2700-\\u27bf',
	      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
	      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
	      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
	      rsQuoteRange = '\\u2018\\u2019\\u201c\\u201d',
	      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
	      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
	      rsVarRange = '\\ufe0e\\ufe0f',
	      rsBreakRange = rsMathOpRange + rsNonCharRange + rsQuoteRange + rsSpaceRange;
	
	  /** Used to compose unicode capture groups. */
	  var rsAstral = '[' + rsAstralRange + ']',
	      rsBreak = '[' + rsBreakRange + ']',
	      rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
	      rsDigits = '\\d+',
	      rsDingbat = '[' + rsDingbatRange + ']',
	      rsLower = '[' + rsLowerRange + ']',
	      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
	      rsFitz = '\\ud83c[\\udffb-\\udfff]',
	      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
	      rsNonAstral = '[^' + rsAstralRange + ']',
	      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	      rsUpper = '[' + rsUpperRange + ']',
	      rsZWJ = '\\u200d';
	
	  /** Used to compose unicode regexes. */
	  var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
	      rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
	      reOptMod = rsModifier + '?',
	      rsOptVar = '[' + rsVarRange + ']?',
	      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	      rsSeq = rsOptVar + reOptMod + rsOptJoin,
	      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
	      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
	
	  /**
	   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
	   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
	   */
	  var reComboMark = RegExp(rsCombo, 'g');
	
	  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	  var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
	
	  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
	  var reHasComplexSymbol = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');
	
	  /** Used to match non-compound words composed of alphanumeric characters. */
	  var reBasicWord = /[a-zA-Z0-9]+/g;
	
	  /** Used to match complex or compound words. */
	  var reComplexWord = RegExp([
	    rsUpper + '?' + rsLower + '+(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
	    rsUpperMisc + '+(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
	    rsUpper + '?' + rsLowerMisc + '+',
	    rsUpper + '+',
	    rsDigits,
	    rsEmoji
	  ].join('|'), 'g');
	
	  /** Used to detect strings that need a more robust regexp to match words. */
	  var reHasComplexWord = /[a-z][A-Z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
	
	  /** Used to assign default `context` object properties. */
	  var contextProps = [
	    'Array', 'Date', 'Error', 'Float32Array', 'Float64Array', 'Function',
	    'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
	    'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
	    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap', '_',
	    'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
	  ];
	
	  /** Used to make template sourceURLs easier to identify. */
	  var templateCounter = -1;
	
	  /** Used to identify `toStringTag` values of typed arrays. */
	  var typedArrayTags = {};
	  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	  typedArrayTags[uint32Tag] = true;
	  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	  /** Used to identify `toStringTag` values supported by `_.clone`. */
	  var cloneableTags = {};
	  cloneableTags[argsTag] = cloneableTags[arrayTag] =
	  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
	  cloneableTags[dateTag] = cloneableTags[float32Tag] =
	  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
	  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
	  cloneableTags[mapTag] = cloneableTags[numberTag] =
	  cloneableTags[objectTag] = cloneableTags[regexpTag] =
	  cloneableTags[setTag] = cloneableTags[stringTag] =
	  cloneableTags[symbolTag] = cloneableTags[uint8Tag] =
	  cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] =
	  cloneableTags[uint32Tag] = true;
	  cloneableTags[errorTag] = cloneableTags[funcTag] =
	  cloneableTags[weakMapTag] = false;
	
	  /** Used to map latin-1 supplementary letters to basic latin letters. */
	  var deburredLetters = {
	    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
	    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
	    '\xc7': 'C',  '\xe7': 'c',
	    '\xd0': 'D',  '\xf0': 'd',
	    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
	    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
	    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
	    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
	    '\xd1': 'N',  '\xf1': 'n',
	    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
	    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
	    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
	    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
	    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
	    '\xc6': 'Ae', '\xe6': 'ae',
	    '\xde': 'Th', '\xfe': 'th',
	    '\xdf': 'ss'
	  };
	
	  /** Used to map characters to HTML entities. */
	  var htmlEscapes = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '`': '&#96;'
	  };
	
	  /** Used to map HTML entities to characters. */
	  var htmlUnescapes = {
	    '&amp;': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&#39;': "'",
	    '&#96;': '`'
	  };
	
	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };
	
	  /** Used to escape characters for inclusion in compiled string literals. */
	  var stringEscapes = {
	    '\\': '\\',
	    "'": "'",
	    '\n': 'n',
	    '\r': 'r',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  /** Built-in method references without a dependency on `root`. */
	  var freeParseFloat = parseFloat,
	      freeParseInt = parseInt;
	
	  /** Detect free variable `exports`. */
	  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
	
	  /** Detect free variable `module`. */
	  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
	
	  /** Detect free variable `global` from Node.js. */
	  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);
	
	  /** Detect free variable `self`. */
	  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	
	  /** Detect free variable `window`. */
	  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	
	  /** Detect the popular CommonJS extension `module.exports`. */
	  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
	
	  /** Detect `this` as the global object. */
	  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	
	  /**
	   * Used as a reference to the global object.
	   *
	   * The `this` value is used if it's the global object to avoid Greasemonkey's
	   * restricted `window` object, otherwise the `window` object is used.
	   */
	  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();
	
	  /*--------------------------------------------------------------------------*/
	
	  /**
	   * Adds the key-value `pair` to `map`.
	   *
	   * @private
	   * @param {Object} map The map to modify.
	   * @param {Array} pair The key-value pair to add.
	   * @returns {Object} Returns `map`.
	   */
	  function addMapEntry(map, pair) {
	    map.set(pair[0], pair[1]);
	    return map;
	  }
	
	  /**
	   * Adds `value` to `set`.
	   *
	   * @private
	   * @param {Object} set The set to modify.
	   * @param {*} value The value to add.
	   * @returns {Object} Returns `set`.
	   */
	  function addSetEntry(set, value) {
	    set.add(value);
	    return set;
	  }
	
	  /**
	   * A faster alternative to `Function#apply`, this function invokes `func`
	   * with the `this` binding of `thisArg` and the arguments of `args`.
	   *
	   * @private
	   * @param {Function} func The function to invoke.
	   * @param {*} thisArg The `this` binding of `func`.
	   * @param {...*} args The arguments to invoke `func` with.
	   * @returns {*} Returns the result of `func`.
	   */
	  function apply(func, thisArg, args) {
	    var length = args.length;
	    switch (length) {
	      case 0: return func.call(thisArg);
	      case 1: return func.call(thisArg, args[0]);
	      case 2: return func.call(thisArg, args[0], args[1]);
	      case 3: return func.call(thisArg, args[0], args[1], args[2]);
	    }
	    return func.apply(thisArg, args);
	  }
	
	  /**
	   * A specialized version of `baseAggregator` for arrays.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} setter The function to set `accumulator` values.
	   * @param {Function} iteratee The iteratee to transform keys.
	   * @param {Object} accumulator The initial aggregated object.
	   * @returns {Function} Returns `accumulator`.
	   */
	  function arrayAggregator(array, setter, iteratee, accumulator) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      var value = array[index];
	      setter(accumulator, value, iteratee(value), array);
	    }
	    return accumulator;
	  }
	
	  /**
	   * Creates a new array concatenating `array` with `other`.
	   *
	   * @private
	   * @param {Array} array The first array to concatenate.
	   * @param {Array} other The second array to concatenate.
	   * @returns {Array} Returns the new concatenated array.
	   */
	  function arrayConcat(array, other) {
	    var index = -1,
	        length = array.length,
	        othIndex = -1,
	        othLength = other.length,
	        result = Array(length + othLength);
	
	    while (++index < length) {
	      result[index] = array[index];
	    }
	    while (++othIndex < othLength) {
	      result[index++] = other[othIndex];
	    }
	    return result;
	  }
	
	  /**
	   * A specialized version of `_.forEach` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayEach(array, iteratee) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      if (iteratee(array[index], index, array) === false) {
	        break;
	      }
	    }
	    return array;
	  }
	
	  /**
	   * A specialized version of `_.forEachRight` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayEachRight(array, iteratee) {
	    var length = array.length;
	
	    while (length--) {
	      if (iteratee(array[length], length, array) === false) {
	        break;
	      }
	    }
	    return array;
	  }
	
	  /**
	   * A specialized version of `_.every` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
	   */
	  function arrayEvery(array, predicate) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      if (!predicate(array[index], index, array)) {
	        return false;
	      }
	    }
	    return true;
	  }
	
	  /**
	   * A specialized version of `_.filter` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {Array} Returns the new filtered array.
	   */
	  function arrayFilter(array, predicate) {
	    var index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];
	
	    while (++index < length) {
	      var value = array[index];
	      if (predicate(value, index, array)) {
	        result[++resIndex] = value;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * A specialized version of `_.includes` for arrays without support for
	   * specifying an index to search from.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} target The value to search for.
	   * @returns {boolean} Returns `true` if `target` is found, else `false`.
	   */
	  function arrayIncludes(array, value) {
	    return !!array.length && baseIndexOf(array, value, 0) > -1;
	  }
	
	  /**
	   * A specialized version of `_.includesWith` for arrays without support for
	   * specifying an index to search from.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} target The value to search for.
	   * @param {Function} comparator The comparator invoked per element.
	   * @returns {boolean} Returns `true` if `target` is found, else `false`.
	   */
	  function arrayIncludesWith(array, value, comparator) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      if (comparator(value, array[index])) {
	        return true;
	      }
	    }
	    return false;
	  }
	
	  /**
	   * A specialized version of `_.map` for arrays without support for iteratee
	   * shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns the new mapped array.
	   */
	  function arrayMap(array, iteratee) {
	    var index = -1,
	        length = array.length,
	        result = Array(length);
	
	    while (++index < length) {
	      result[index] = iteratee(array[index], index, array);
	    }
	    return result;
	  }
	
	  /**
	   * Appends the elements of `values` to `array`.
	   *
	   * @private
	   * @param {Array} array The array to modify.
	   * @param {Array} values The values to append.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayPush(array, values) {
	    var index = -1,
	        length = values.length,
	        offset = array.length;
	
	    while (++index < length) {
	      array[offset + index] = values[index];
	    }
	    return array;
	  }
	
	  /**
	   * A specialized version of `_.reduce` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {*} [accumulator] The initial value.
	   * @param {boolean} [initAccum] Specify using the first element of `array` as the initial value.
	   * @returns {*} Returns the accumulated value.
	   */
	  function arrayReduce(array, iteratee, accumulator, initAccum) {
	    var index = -1,
	        length = array.length;
	
	    if (initAccum && length) {
	      accumulator = array[++index];
	    }
	    while (++index < length) {
	      accumulator = iteratee(accumulator, array[index], index, array);
	    }
	    return accumulator;
	  }
	
	  /**
	   * A specialized version of `_.reduceRight` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {*} [accumulator] The initial value.
	   * @param {boolean} [initAccum] Specify using the last element of `array` as the initial value.
	   * @returns {*} Returns the accumulated value.
	   */
	  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
	    var length = array.length;
	    if (initAccum && length) {
	      accumulator = array[--length];
	    }
	    while (length--) {
	      accumulator = iteratee(accumulator, array[length], length, array);
	    }
	    return accumulator;
	  }
	
	  /**
	   * A specialized version of `_.some` for arrays without support for iteratee
	   * shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
	   */
	  function arraySome(array, predicate) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      if (predicate(array[index], index, array)) {
	        return true;
	      }
	    }
	    return false;
	  }
	
	  /**
	   * The base implementation of methods like `_.max` and `_.min` which accepts a
	   * `comparator` to determine the extremum value.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The iteratee invoked per iteration.
	   * @param {Function} comparator The comparator used to compare values.
	   * @returns {*} Returns the extremum value.
	   */
	  function baseExtremum(array, iteratee, comparator) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      var value = array[index],
	          current = iteratee(value);
	
	      if (current != null && (computed === undefined
	            ? current === current
	            : comparator(current, computed)
	          )) {
	        var computed = current,
	            result = value;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * The base implementation of methods like `_.find` and `_.findKey`, without
	   * support for iteratee shorthands, which iterates over `collection` using
	   * `eachFunc`.
	   *
	   * @private
	   * @param {Array|Object} collection The collection to search.
	   * @param {Function} predicate The function invoked per iteration.
	   * @param {Function} eachFunc The function to iterate over `collection`.
	   * @param {boolean} [retKey] Specify returning the key of the found element instead of the element itself.
	   * @returns {*} Returns the found element or its key, else `undefined`.
	   */
	  function baseFind(collection, predicate, eachFunc, retKey) {
	    var result;
	    eachFunc(collection, function(value, key, collection) {
	      if (predicate(value, key, collection)) {
	        result = retKey ? key : value;
	        return false;
	      }
	    });
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.findIndex` and `_.findLastIndex` without
	   * support for iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {Function} predicate The function invoked per iteration.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   */
	  function baseFindIndex(array, predicate, fromRight) {
	    var length = array.length,
	        index = fromRight ? length : -1;
	
	    while ((fromRight ? index-- : ++index < length)) {
	      if (predicate(array[index], index, array)) {
	        return index;
	      }
	    }
	    return -1;
	  }
	
	  /**
	   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} value The value to search for.
	   * @param {number} fromIndex The index to search from.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   */
	  function baseIndexOf(array, value, fromIndex) {
	    if (value !== value) {
	      return indexOfNaN(array, fromIndex);
	    }
	    var index = fromIndex - 1,
	        length = array.length;
	
	    while (++index < length) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return -1;
	  }
	
	  /**
	   * The base implementation of `_.reduce` and `_.reduceRight`, without support
	   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
	   *
	   * @private
	   * @param {Array|Object} collection The collection to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {*} accumulator The initial value.
	   * @param {boolean} initAccum Specify using the first or last element of `collection` as the initial value.
	   * @param {Function} eachFunc The function to iterate over `collection`.
	   * @returns {*} Returns the accumulated value.
	   */
	  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
	    eachFunc(collection, function(value, index, collection) {
	      accumulator = initAccum
	        ? (initAccum = false, value)
	        : iteratee(accumulator, value, index, collection);
	    });
	    return accumulator;
	  }
	
	  /**
	   * The base implementation of `_.sortBy` which uses `comparer` to define
	   * the sort order of `array` and replaces criteria objects with their
	   * corresponding values.
	   *
	   * @private
	   * @param {Array} array The array to sort.
	   * @param {Function} comparer The function to define sort order.
	   * @returns {Array} Returns `array`.
	   */
	  function baseSortBy(array, comparer) {
	    var length = array.length;
	
	    array.sort(comparer);
	    while (length--) {
	      array[length] = array[length].value;
	    }
	    return array;
	  }
	
	  /**
	   * The base implementation of `_.sum` without support for iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {number} Returns the sum.
	   */
	  function baseSum(array, iteratee) {
	    var result,
	        index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      var current = iteratee(array[index]);
	      if (current !== undefined) {
	        result = result === undefined ? current : (result + current);
	      }
	    }
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.times` without support for iteratee shorthands
	   * or max array length checks.
	   *
	   * @private
	   * @param {number} n The number of times to invoke `iteratee`.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns the array of results.
	   */
	  function baseTimes(n, iteratee) {
	    var index = -1,
	        result = Array(n);
	
	    while (++index < n) {
	      result[index] = iteratee(index);
	    }
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
	   * of key-value pairs for `object` corresponding to the property names of `props`.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @param {Array} props The property names to get values for.
	   * @returns {Object} Returns the new array of key-value pairs.
	   */
	  function baseToPairs(object, props) {
	    return arrayMap(props, function(key) {
	      return [key, object[key]];
	    });
	  }
	
	  /**
	   * The base implementation of `_.unary` without support for storing wrapper metadata.
	   *
	   * @private
	   * @param {Function} func The function to cap arguments for.
	   * @returns {Function} Returns the new function.
	   */
	  function baseUnary(func) {
	    return function(value) {
	      return func(value);
	    };
	  }
	
	  /**
	   * The base implementation of `_.values` and `_.valuesIn` which creates an
	   * array of `object` property values corresponding to the property names
	   * of `props`.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @param {Array} props The property names to get values for.
	   * @returns {Object} Returns the array of property values.
	   */
	  function baseValues(object, props) {
	    return arrayMap(props, function(key) {
	      return object[key];
	    });
	  }
	
	  /**
	   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
	   * that is not found in the character symbols.
	   *
	   * @private
	   * @param {Array} strSymbols The string symbols to inspect.
	   * @param {Array} chrSymbols The character symbols to find.
	   * @returns {number} Returns the index of the first unmatched string symbol.
	   */
	  function charsStartIndex(strSymbols, chrSymbols) {
	    var index = -1,
	        length = strSymbols.length;
	
	    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	    return index;
	  }
	
	  /**
	   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
	   * that is not found in the character symbols.
	   *
	   * @private
	   * @param {Array} strSymbols The string symbols to inspect.
	   * @param {Array} chrSymbols The character symbols to find.
	   * @returns {number} Returns the index of the last unmatched string symbol.
	   */
	  function charsEndIndex(strSymbols, chrSymbols) {
	    var index = strSymbols.length;
	
	    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	    return index;
	  }
	
	  /**
	   * Checks if `value` is a global object.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	   */
	  function checkGlobal(value) {
	    return (value && value.Object === Object) ? value : null;
	  }
	
	  /**
	   * Compares values to sort them in ascending order.
	   *
	   * @private
	   * @param {*} value The value to compare.
	   * @param {*} other The other value to compare.
	   * @returns {number} Returns the sort order indicator for `value`.
	   */
	  function compareAscending(value, other) {
	    if (value !== other) {
	      var valIsNull = value === null,
	          valIsUndef = value === undefined,
	          valIsReflexive = value === value;
	
	      var othIsNull = other === null,
	          othIsUndef = other === undefined,
	          othIsReflexive = other === other;
	
	      if ((value > other && !othIsNull) || !valIsReflexive ||
	          (valIsNull && !othIsUndef && othIsReflexive) ||
	          (valIsUndef && othIsReflexive)) {
	        return 1;
	      }
	      if ((value < other && !valIsNull) || !othIsReflexive ||
	          (othIsNull && !valIsUndef && valIsReflexive) ||
	          (othIsUndef && valIsReflexive)) {
	        return -1;
	      }
	    }
	    return 0;
	  }
	
	  /**
	   * Used by `_.orderBy` to compare multiple properties of a value to another
	   * and stable sort them.
	   *
	   * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
	   * specify an order of "desc" for descending or "asc" for ascending sort order
	   * of corresponding values.
	   *
	   * @private
	   * @param {Object} object The object to compare.
	   * @param {Object} other The other object to compare.
	   * @param {boolean[]|string[]} orders The order to sort by for each property.
	   * @returns {number} Returns the sort order indicator for `object`.
	   */
	  function compareMultiple(object, other, orders) {
	    var index = -1,
	        objCriteria = object.criteria,
	        othCriteria = other.criteria,
	        length = objCriteria.length,
	        ordersLength = orders.length;
	
	    while (++index < length) {
	      var result = compareAscending(objCriteria[index], othCriteria[index]);
	      if (result) {
	        if (index >= ordersLength) {
	          return result;
	        }
	        var order = orders[index];
	        return result * (order == 'desc' ? -1 : 1);
	      }
	    }
	    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	    // that causes it, under certain circumstances, to provide the same value for
	    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
	    // for more details.
	    //
	    // This also ensures a stable sort in V8 and other engines.
	    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
	    return object.index - other.index;
	  }
	
	  /**
	   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
	   *
	   * @private
	   * @param {string} letter The matched letter to deburr.
	   * @returns {string} Returns the deburred letter.
	   */
	  function deburrLetter(letter) {
	    return deburredLetters[letter];
	  }
	
	  /**
	   * Used by `_.escape` to convert characters to HTML entities.
	   *
	   * @private
	   * @param {string} chr The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeHtmlChar(chr) {
	    return htmlEscapes[chr];
	  }
	
	  /**
	   * Used by `_.template` to escape characters for inclusion in compiled string literals.
	   *
	   * @private
	   * @param {string} chr The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeStringChar(chr) {
	    return '\\' + stringEscapes[chr];
	  }
	
	  /**
	   * Gets the index at which the first occurrence of `NaN` is found in `array`.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {number} fromIndex The index to search from.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	   */
	  function indexOfNaN(array, fromIndex, fromRight) {
	    var length = array.length,
	        index = fromIndex + (fromRight ? 0 : -1);
	
	    while ((fromRight ? index-- : ++index < length)) {
	      var other = array[index];
	      if (other !== other) {
	        return index;
	      }
	    }
	    return -1;
	  }
	
	  /**
	   * Checks if `value` is a host object in IE < 9.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	   */
	  function isHostObject(value) {
	    // Many host objects are `Object` objects that can coerce to strings
	    // despite having improperly defined `toString` methods.
	    var result = false;
	    if (value != null && typeof value.toString != 'function') {
	      try {
	        result = !!(value + '');
	      } catch (e) {}
	    }
	    return result;
	  }
	
	  /**
	   * Checks if `value` is a valid array-like index.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	   */
	  function isIndex(value, length) {
	    value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	    length = length == null ? MAX_SAFE_INTEGER : length;
	    return value > -1 && value % 1 == 0 && value < length;
	  }
	
	  /**
	   * Converts `iterator` to an array.
	   *
	   * @private
	   * @param {Object} iterator The iterator to convert.
	   * @returns {Array} Returns the converted array.
	   */
	  function iteratorToArray(iterator) {
	    var data,
	        result = [];
	
	    while (!(data = iterator.next()).done) {
	      result.push(data.value);
	    }
	    return result;
	  }
	
	  /**
	   * Converts `map` to an array.
	   *
	   * @private
	   * @param {Object} map The map to convert.
	   * @returns {Array} Returns the converted array.
	   */
	  function mapToArray(map) {
	    var index = -1,
	        result = Array(map.size);
	
	    map.forEach(function(value, key) {
	      result[++index] = [key, value];
	    });
	    return result;
	  }
	
	  /**
	   * Replaces all `placeholder` elements in `array` with an internal placeholder
	   * and returns an array of their indexes.
	   *
	   * @private
	   * @param {Array} array The array to modify.
	   * @param {*} placeholder The placeholder to replace.
	   * @returns {Array} Returns the new array of placeholder indexes.
	   */
	  function replaceHolders(array, placeholder) {
	    var index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];
	
	    while (++index < length) {
	      if (array[index] === placeholder) {
	        array[index] = PLACEHOLDER;
	        result[++resIndex] = index;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * Converts `set` to an array.
	   *
	   * @private
	   * @param {Object} set The set to convert.
	   * @returns {Array} Returns the converted array.
	   */
	  function setToArray(set) {
	    var index = -1,
	        result = Array(set.size);
	
	    set.forEach(function(value) {
	      result[++index] = value;
	    });
	    return result;
	  }
	
	  /**
	   * Gets the number of symbols in `string`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @returns {number} Returns the string size.
	   */
	  function stringSize(string) {
	    if (!(string && reHasComplexSymbol.test(string))) {
	      return string.length;
	    }
	    var result = reComplexSymbol.lastIndex = 0;
	    while (reComplexSymbol.test(string)) {
	      result++;
	    }
	    return result;
	  }
	
	  /**
	   * Converts `string` to an array.
	   *
	   * @private
	   * @param {string} string The string to convert.
	   * @returns {Array} Returns the converted array.
	   */
	  function stringToArray(string) {
	    return string.match(reComplexSymbol);
	  }
	
	  /**
	   * Used by `_.unescape` to convert HTML entities to characters.
	   *
	   * @private
	   * @param {string} chr The matched character to unescape.
	   * @returns {string} Returns the unescaped character.
	   */
	  function unescapeHtmlChar(chr) {
	    return htmlUnescapes[chr];
	  }
	
	  /*--------------------------------------------------------------------------*/
	
	  /**
	   * Create a new pristine `lodash` function using the `context` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Util
	   * @param {Object} [context=root] The context object.
	   * @returns {Function} Returns a new `lodash` function.
	   * @example
	   *
	   * _.mixin({ 'foo': _.constant('foo') });
	   *
	   * var lodash = _.runInContext();
	   * lodash.mixin({ 'bar': lodash.constant('bar') });
	   *
	   * _.isFunction(_.foo);
	   * // => true
	   * _.isFunction(_.bar);
	   * // => false
	   *
	   * lodash.isFunction(lodash.foo);
	   * // => false
	   * lodash.isFunction(lodash.bar);
	   * // => true
	   *
	   * // Use `context` to mock `Date#getTime` use in `_.now`.
	   * var mock = _.runInContext({
	   *   'Date': function() {
	   *     return { 'getTime': getTimeMock };
	   *   }
	   * });
	   *
	   * // Create a suped-up `defer` in Node.js.
	   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
	   */
	  function runInContext(context) {
	    context = context ? _.defaults({}, context, _.pick(root, contextProps)) : root;
	
	    /** Built-in constructor references. */
	    var Date = context.Date,
	        Error = context.Error,
	        Math = context.Math,
	        RegExp = context.RegExp,
	        TypeError = context.TypeError;
	
	    /** Used for built-in method references. */
	    var arrayProto = context.Array.prototype,
	        objectProto = context.Object.prototype;
	
	    /** Used to resolve the decompiled source of functions. */
	    var funcToString = context.Function.prototype.toString;
	
	    /** Used to check objects for own properties. */
	    var hasOwnProperty = objectProto.hasOwnProperty;
	
	    /** Used to generate unique IDs. */
	    var idCounter = 0;
	
	    /** Used to infer the `Object` constructor. */
	    var objectCtorString = funcToString.call(Object);
	
	    /**
	     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	     * of values.
	     */
	    var objectToString = objectProto.toString;
	
	    /** Used to restore the original `_` reference in `_.noConflict`. */
	    var oldDash = root._;
	
	    /** Used to detect if a method is native. */
	    var reIsNative = RegExp('^' +
	      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	    );
	
	    /** Built-in value references. */
	    var Reflect = context.Reflect,
	        Symbol = context.Symbol,
	        Uint8Array = context.Uint8Array,
	        clearTimeout = context.clearTimeout,
	        enumerate = Reflect ? Reflect.enumerate : undefined,
	        getPrototypeOf = Object.getPrototypeOf,
	        getOwnPropertySymbols = Object.getOwnPropertySymbols,
	        iteratorSymbol = typeof (iteratorSymbol = Symbol && Symbol.iterator) == 'symbol' ? iteratorSymbol : undefined,
	        propertyIsEnumerable = objectProto.propertyIsEnumerable,
	        setTimeout = context.setTimeout,
	        splice = arrayProto.splice;
	
	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeCeil = Math.ceil,
	        nativeFloor = Math.floor,
	        nativeIsFinite = context.isFinite,
	        nativeJoin = arrayProto.join,
	        nativeKeys = Object.keys,
	        nativeMax = Math.max,
	        nativeMin = Math.min,
	        nativeParseInt = context.parseInt,
	        nativeRandom = Math.random,
	        nativeReverse = arrayProto.reverse;
	
	    /* Built-in method references that are verified to be native. */
	    var Map = getNative(context, 'Map'),
	        Set = getNative(context, 'Set'),
	        WeakMap = getNative(context, 'WeakMap'),
	        nativeCreate = getNative(Object, 'create');
	
	    /** Used to store function metadata. */
	    var metaMap = WeakMap && new WeakMap;
	
	    /** Used to detect maps and sets. */
	    var mapCtorString = Map ? funcToString.call(Map) : '',
	        setCtorString = Set ? funcToString.call(Set) : '';
	
	    /** Used to convert symbols to primitives and strings. */
	    var symbolProto = Symbol ? Symbol.prototype : undefined,
	        symbolValueOf = Symbol ? symbolProto.valueOf : undefined,
	        symbolToString = Symbol ? symbolProto.toString : undefined;
	
	    /** Used to lookup unminified function names. */
	    var realNames = {};
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a `lodash` object which wraps `value` to enable implicit method
	     * chaining. Methods that operate on and return arrays, collections, and
	     * functions can be chained together. Methods that retrieve a single value or
	     * may return a primitive value will automatically end the chain sequence and
	     * return the unwrapped value. Otherwise, the value must be unwrapped with
	     * `_#value`.
	     *
	     * Explicit chaining, which must be unwrapped with `_#value` in all cases,
	     * may be enabled using `_.chain`.
	     *
	     * The execution of chained methods is lazy, that is, it's deferred until
	     * `_#value` is implicitly or explicitly called.
	     *
	     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
	     * fusion is an optimization to merge iteratee calls; this avoids the creation
	     * of intermediate arrays and can greatly reduce the number of iteratee executions.
	     * Sections of a chain sequence qualify for shortcut fusion if the section is
	     * applied to an array of at least two hundred elements and any iteratees
	     * accept only one argument. The heuristic for whether a section qualifies
	     * for shortcut fusion is subject to change.
	     *
	     * Chaining is supported in custom builds as long as the `_#value` method is
	     * directly or indirectly included in the build.
	     *
	     * In addition to lodash methods, wrappers have `Array` and `String` methods.
	     *
	     * The wrapper `Array` methods are:
	     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
	     *
	     * The wrapper `String` methods are:
	     * `replace` and `split`
	     *
	     * The wrapper methods that support shortcut fusion are:
	     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
	     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
	     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
	     *
	     * The chainable wrapper methods are:
	     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`,
	     * `at`, `before`, `bind`, `bindAll`, `bindKey`, `chain`, `chunk`, `commit`,
	     * `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`, `curry`,
	     * `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`, `difference`,
	     * `differenceBy`, `differenceWith`, `drop`, `dropRight`, `dropRightWhile`,
	     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flip`, `flow`,
	     * `flowRight`, `fromPairs`, `functions`, `functionsIn`, `groupBy`, `initial`,
	     * `intersection`, `intersectionBy`, `intersectionWith`, `invert`, `invertBy`,
	     * `invokeMap`, `iteratee`, `keyBy`, `keys`, `keysIn`, `map`, `mapKeys`,
	     * `mapValues`, `matches`, `matchesProperty`, `memoize`, `merge`, `mergeWith`,
	     * `method`, `methodOf`, `mixin`, `negate`, `nthArg`, `omit`, `omitBy`, `once`,
	     * `orderBy`, `over`, `overArgs`, `overEvery`, `overSome`, `partial`,
	     * `partialRight`, `partition`, `pick`, `pickBy`, `plant`, `property`,
	     * `propertyOf`, `pull`, `pullAll`, `pullAllBy`, `pullAt`, `push`, `range`,
	     * `rangeRight`, `rearg`, `reject`, `remove`, `rest`, `reverse`, `sampleSize`,
	     * `set`, `setWith`, `shuffle`, `slice`, `sort`, `sortBy`, `splice`, `spread`,
	     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`, `throttle`,
	     * `thru`, `toArray`, `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`,
	     * `transform`, `unary`, `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`,
	     * `uniqWith`, `unset`, `unshift`, `unzip`, `unzipWith`, `values`, `valuesIn`,
	     * `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`, `zipObject`,
	     * `zipObjectDeep`, and `zipWith`
	     *
	     * The wrapper methods that are **not** chainable by default are:
	     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
	     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `deburr`, `endsWith`, `eq`,
	     * `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
	     * `findLast`, `findLastIndex`, `findLastKey`, `floor`, `forEach`, `forEachRight`,
	     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
	     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
	     * `isArguments`, `isArray`, `isArrayLike`, `isArrayLikeObject`, `isBoolean`,
	     * `isDate`, `isElement`, `isEmpty`, `isEqual`, `isEqualWith`, `isError`,
	     * `isFinite`, `isFunction`, `isInteger`, `isLength`, `isMatch`, `isMatchWith`,
	     * `isNaN`, `isNative`, `isNil`, `isNull`, `isNumber`, `isObject`, `isObjectLike`,
	     * `isPlainObject`, `isRegExp`, `isSafeInteger`, `isString`, `isUndefined`,
	     * `isTypedArray`, `join`, `kebabCase`, `last`, `lastIndexOf`, `lowerCase`,
	     * `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `min`, `minBy`,
	     * `noConflict`, `noop`, `now`, `pad`, `padEnd`, `padStart`, `parseInt`,
	     * `pop`, `random`, `reduce`, `reduceRight`, `repeat`, `result`, `round`,
	     * `runInContext`, `sample`, `shift`, `size`, `snakeCase`, `some`, `sortedIndex`,
	     * `sortedIndexBy`, `sortedLastIndex`, `sortedLastIndexBy`, `startCase`,
	     * `startsWith`, `subtract`, `sum`, `sumBy`, `template`, `times`, `toLower`,
	     * `toInteger`, `toLength`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`,
	     * `trim`, `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`,
	     * `upperCase`, `upperFirst`, `value`, and `words`
	     *
	     * @name _
	     * @constructor
	     * @category Seq
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var wrapped = _([1, 2, 3]);
	     *
	     * // Returns an unwrapped value.
	     * wrapped.reduce(_.add);
	     * // => 6
	     *
	     * // Returns a wrapped value.
	     * var squares = wrapped.map(square);
	     *
	     * _.isArray(squares);
	     * // => false
	     *
	     * _.isArray(squares.value());
	     * // => true
	     */
	    function lodash(value) {
	      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
	        if (value instanceof LodashWrapper) {
	          return value;
	        }
	        if (hasOwnProperty.call(value, '__wrapped__')) {
	          return wrapperClone(value);
	        }
	      }
	      return new LodashWrapper(value);
	    }
	
	    /**
	     * The function whose prototype all chaining wrappers inherit from.
	     *
	     * @private
	     */
	    function baseLodash() {
	      // No operation performed.
	    }
	
	    /**
	     * The base constructor for creating `lodash` wrapper objects.
	     *
	     * @private
	     * @param {*} value The value to wrap.
	     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
	     */
	    function LodashWrapper(value, chainAll) {
	      this.__wrapped__ = value;
	      this.__actions__ = [];
	      this.__chain__ = !!chainAll;
	      this.__index__ = 0;
	      this.__values__ = undefined;
	    }
	
	    /**
	     * By default, the template delimiters used by lodash are like those in
	     * embedded Ruby (ERB). Change the following template settings to use
	     * alternative delimiters.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    lodash.templateSettings = {
	
	      /**
	       * Used to detect `data` property values to be HTML-escaped.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'escape': reEscape,
	
	      /**
	       * Used to detect code to be evaluated.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'evaluate': reEvaluate,
	
	      /**
	       * Used to detect `data` property values to inject.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'interpolate': reInterpolate,
	
	      /**
	       * Used to reference the data object in the template text.
	       *
	       * @memberOf _.templateSettings
	       * @type string
	       */
	      'variable': '',
	
	      /**
	       * Used to import variables into the compiled template.
	       *
	       * @memberOf _.templateSettings
	       * @type Object
	       */
	      'imports': {
	
	        /**
	         * A reference to the `lodash` function.
	         *
	         * @memberOf _.templateSettings.imports
	         * @type Function
	         */
	        '_': lodash
	      }
	    };
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
	     *
	     * @private
	     * @param {*} value The value to wrap.
	     */
	    function LazyWrapper(value) {
	      this.__wrapped__ = value;
	      this.__actions__ = [];
	      this.__dir__ = 1;
	      this.__filtered__ = false;
	      this.__iteratees__ = [];
	      this.__takeCount__ = MAX_ARRAY_LENGTH;
	      this.__views__ = [];
	    }
	
	    /**
	     * Creates a clone of the lazy wrapper object.
	     *
	     * @private
	     * @name clone
	     * @memberOf LazyWrapper
	     * @returns {Object} Returns the cloned `LazyWrapper` object.
	     */
	    function lazyClone() {
	      var result = new LazyWrapper(this.__wrapped__);
	      result.__actions__ = copyArray(this.__actions__);
	      result.__dir__ = this.__dir__;
	      result.__filtered__ = this.__filtered__;
	      result.__iteratees__ = copyArray(this.__iteratees__);
	      result.__takeCount__ = this.__takeCount__;
	      result.__views__ = copyArray(this.__views__);
	      return result;
	    }
	
	    /**
	     * Reverses the direction of lazy iteration.
	     *
	     * @private
	     * @name reverse
	     * @memberOf LazyWrapper
	     * @returns {Object} Returns the new reversed `LazyWrapper` object.
	     */
	    function lazyReverse() {
	      if (this.__filtered__) {
	        var result = new LazyWrapper(this);
	        result.__dir__ = -1;
	        result.__filtered__ = true;
	      } else {
	        result = this.clone();
	        result.__dir__ *= -1;
	      }
	      return result;
	    }
	
	    /**
	     * Extracts the unwrapped value from its lazy wrapper.
	     *
	     * @private
	     * @name value
	     * @memberOf LazyWrapper
	     * @returns {*} Returns the unwrapped value.
	     */
	    function lazyValue() {
	      var array = this.__wrapped__.value(),
	          dir = this.__dir__,
	          isArr = isArray(array),
	          isRight = dir < 0,
	          arrLength = isArr ? array.length : 0,
	          view = getView(0, arrLength, this.__views__),
	          start = view.start,
	          end = view.end,
	          length = end - start,
	          index = isRight ? end : (start - 1),
	          iteratees = this.__iteratees__,
	          iterLength = iteratees.length,
	          resIndex = 0,
	          takeCount = nativeMin(length, this.__takeCount__);
	
	      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
	        return baseWrapperValue(array, this.__actions__);
	      }
	      var result = [];
	
	      outer:
	      while (length-- && resIndex < takeCount) {
	        index += dir;
	
	        var iterIndex = -1,
	            value = array[index];
	
	        while (++iterIndex < iterLength) {
	          var data = iteratees[iterIndex],
	              iteratee = data.iteratee,
	              type = data.type,
	              computed = iteratee(value);
	
	          if (type == LAZY_MAP_FLAG) {
	            value = computed;
	          } else if (!computed) {
	            if (type == LAZY_FILTER_FLAG) {
	              continue outer;
	            } else {
	              break outer;
	            }
	          }
	        }
	        result[resIndex++] = value;
	      }
	      return result;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates an hash object.
	     *
	     * @private
	     * @returns {Object} Returns the new hash object.
	     */
	    function Hash() {}
	
	    /**
	     * Removes `key` and its value from the hash.
	     *
	     * @private
	     * @param {Object} hash The hash to modify.
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	     */
	    function hashDelete(hash, key) {
	      return hashHas(hash, key) && delete hash[key];
	    }
	
	    /**
	     * Gets the hash value for `key`.
	     *
	     * @private
	     * @param {Object} hash The hash to query.
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the entry value.
	     */
	    function hashGet(hash, key) {
	      if (nativeCreate) {
	        var result = hash[key];
	        return result === HASH_UNDEFINED ? undefined : result;
	      }
	      return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
	    }
	
	    /**
	     * Checks if a hash value for `key` exists.
	     *
	     * @private
	     * @param {Object} hash The hash to query.
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function hashHas(hash, key) {
	      return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
	    }
	
	    /**
	     * Sets the hash `key` to `value`.
	     *
	     * @private
	     * @param {Object} hash The hash to modify.
	     * @param {string} key The key of the value to set.
	     * @param {*} value The value to set.
	     */
	    function hashSet(hash, key, value) {
	      hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a map cache object to store key-value pairs.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     */
	    function MapCache(values) {
	      var index = -1,
	          length = values ? values.length : 0;
	
	      this.clear();
	      while (++index < length) {
	        var entry = values[index];
	        this.set(entry[0], entry[1]);
	      }
	    }
	
	    /**
	     * Removes all key-value entries from the map.
	     *
	     * @private
	     * @name clear
	     * @memberOf MapCache
	     */
	    function mapClear() {
	      this.__data__ = { 'hash': new Hash, 'map': Map ? new Map : [], 'string': new Hash };
	    }
	
	    /**
	     * Removes `key` and its value from the map.
	     *
	     * @private
	     * @name delete
	     * @memberOf MapCache
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	     */
	    function mapDelete(key) {
	      var data = this.__data__;
	      if (isKeyable(key)) {
	        return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
	      }
	      return Map ? data.map['delete'](key) : assocDelete(data.map, key);
	    }
	
	    /**
	     * Gets the map value for `key`.
	     *
	     * @private
	     * @name get
	     * @memberOf MapCache
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the entry value.
	     */
	    function mapGet(key) {
	      var data = this.__data__;
	      if (isKeyable(key)) {
	        return hashGet(typeof key == 'string' ? data.string : data.hash, key);
	      }
	      return Map ? data.map.get(key) : assocGet(data.map, key);
	    }
	
	    /**
	     * Checks if a map value for `key` exists.
	     *
	     * @private
	     * @name has
	     * @memberOf MapCache
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function mapHas(key) {
	      var data = this.__data__;
	      if (isKeyable(key)) {
	        return hashHas(typeof key == 'string' ? data.string : data.hash, key);
	      }
	      return Map ? data.map.has(key) : assocHas(data.map, key);
	    }
	
	    /**
	     * Sets the map `key` to `value`.
	     *
	     * @private
	     * @name set
	     * @memberOf MapCache
	     * @param {string} key The key of the value to set.
	     * @param {*} value The value to set.
	     * @returns {Object} Returns the map cache object.
	     */
	    function mapSet(key, value) {
	      var data = this.__data__;
	      if (isKeyable(key)) {
	        hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
	      } else if (Map) {
	        data.map.set(key, value);
	      } else {
	        assocSet(data.map, key, value);
	      }
	      return this;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     *
	     * Creates a set cache object to store unique values.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     */
	    function SetCache(values) {
	      var index = -1,
	          length = values ? values.length : 0;
	
	      this.__data__ = new MapCache;
	      while (++index < length) {
	        this.push(values[index]);
	      }
	    }
	
	    /**
	     * Checks if `value` is in `cache`.
	     *
	     * @private
	     * @param {Object} cache The set cache to search.
	     * @param {*} value The value to search for.
	     * @returns {number} Returns `true` if `value` is found, else `false`.
	     */
	    function cacheHas(cache, value) {
	      var map = cache.__data__;
	      if (isKeyable(value)) {
	        var data = map.__data__,
	            hash = typeof value == 'string' ? data.string : data.hash;
	
	        return hash[value] === HASH_UNDEFINED;
	      }
	      return map.has(value);
	    }
	
	    /**
	     * Adds `value` to the set cache.
	     *
	     * @private
	     * @name push
	     * @memberOf SetCache
	     * @param {*} value The value to cache.
	     */
	    function cachePush(value) {
	      var map = this.__data__;
	      if (isKeyable(value)) {
	        var data = map.__data__,
	            hash = typeof value == 'string' ? data.string : data.hash;
	
	        hash[value] = HASH_UNDEFINED;
	      }
	      else {
	        map.set(value, HASH_UNDEFINED);
	      }
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a stack cache object to store key-value pairs.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     */
	    function Stack(values) {
	      var index = -1,
	          length = values ? values.length : 0;
	
	      this.clear();
	      while (++index < length) {
	        var entry = values[index];
	        this.set(entry[0], entry[1]);
	      }
	    }
	
	    /**
	     * Removes all key-value entries from the stack.
	     *
	     * @private
	     * @name clear
	     * @memberOf Stack
	     */
	    function stackClear() {
	      this.__data__ = { 'array': [], 'map': null };
	    }
	
	    /**
	     * Removes `key` and its value from the stack.
	     *
	     * @private
	     * @name delete
	     * @memberOf Stack
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	     */
	    function stackDelete(key) {
	      var data = this.__data__,
	          array = data.array;
	
	      return array ? assocDelete(array, key) : data.map['delete'](key);
	    }
	
	    /**
	     * Gets the stack value for `key`.
	     *
	     * @private
	     * @name get
	     * @memberOf Stack
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the entry value.
	     */
	    function stackGet(key) {
	      var data = this.__data__,
	          array = data.array;
	
	      return array ? assocGet(array, key) : data.map.get(key);
	    }
	
	    /**
	     * Checks if a stack value for `key` exists.
	     *
	     * @private
	     * @name has
	     * @memberOf Stack
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function stackHas(key) {
	      var data = this.__data__,
	          array = data.array;
	
	      return array ? assocHas(array, key) : data.map.has(key);
	    }
	
	    /**
	     * Sets the stack `key` to `value`.
	     *
	     * @private
	     * @name set
	     * @memberOf Stack
	     * @param {string} key The key of the value to set.
	     * @param {*} value The value to set.
	     * @returns {Object} Returns the stack cache object.
	     */
	    function stackSet(key, value) {
	      var data = this.__data__,
	          array = data.array;
	
	      if (array) {
	        if (array.length < (LARGE_ARRAY_SIZE - 1)) {
	          assocSet(array, key, value);
	        } else {
	          data.array = null;
	          data.map = new MapCache(array);
	        }
	      }
	      var map = data.map;
	      if (map) {
	        map.set(key, value);
	      }
	      return this;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Removes `key` and its value from the associative array.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	     */
	    function assocDelete(array, key) {
	      var index = assocIndexOf(array, key);
	      if (index < 0) {
	        return false;
	      }
	      var lastIndex = array.length - 1;
	      if (index == lastIndex) {
	        array.pop();
	      } else {
	        splice.call(array, index, 1);
	      }
	      return true;
	    }
	
	    /**
	     * Gets the associative array value for `key`.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the entry value.
	     */
	    function assocGet(array, key) {
	      var index = assocIndexOf(array, key);
	      return index < 0 ? undefined : array[index][1];
	    }
	
	    /**
	     * Checks if an associative array value for `key` exists.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function assocHas(array, key) {
	      return assocIndexOf(array, key) > -1;
	    }
	
	    /**
	     * Gets the index at which the first occurrence of `key` is found in `array`
	     * of key-value pairs.
	     *
	     * @private
	     * @param {Array} array The array to search.
	     * @param {*} key The key to search for.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     */
	    function assocIndexOf(array, key) {
	      var length = array.length;
	      while (length--) {
	        if (eq(array[length][0], key)) {
	          return length;
	        }
	      }
	      return -1;
	    }
	
	    /**
	     * Sets the associative array `key` to `value`.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {string} key The key of the value to set.
	     * @param {*} value The value to set.
	     */
	    function assocSet(array, key, value) {
	      var index = assocIndexOf(array, key);
	      if (index < 0) {
	        array.push([key, value]);
	      } else {
	        array[index][1] = value;
	      }
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Used by `_.defaults` to customize its `_.assignIn` use.
	     *
	     * @private
	     * @param {*} objValue The destination value.
	     * @param {*} srcValue The source value.
	     * @param {string} key The key of the property to assign.
	     * @param {Object} object The parent object of `objValue`.
	     * @returns {*} Returns the value to assign.
	     */
	    function assignInDefaults(objValue, srcValue, key, object) {
	      if (objValue === undefined ||
	          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
	        return srcValue;
	      }
	      return objValue;
	    }
	
	    /**
	     * This function is like `assignValue` except that it doesn't assign `undefined` values.
	     *
	     * @private
	     * @param {Object} object The object to modify.
	     * @param {string} key The key of the property to assign.
	     * @param {*} value The value to assign.
	     */
	    function assignMergeValue(object, key, value) {
	      if ((value !== undefined && !eq(object[key], value)) ||
	          (typeof key == 'number' && value === undefined && !(key in object))) {
	        object[key] = value;
	      }
	    }
	
	    /**
	     * Assigns `value` to `key` of `object` if the existing value is not equivalent
	     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @private
	     * @param {Object} object The object to modify.
	     * @param {string} key The key of the property to assign.
	     * @param {*} value The value to assign.
	     */
	    function assignValue(object, key, value) {
	      var objValue = object[key];
	      if ((!eq(objValue, value) ||
	            (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) ||
	          (value === undefined && !(key in object))) {
	        object[key] = value;
	      }
	    }
	
	    /**
	     * Aggregates elements of `collection` on `accumulator` with keys transformed
	     * by `iteratee` and values set by `setter`.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} setter The function to set `accumulator` values.
	     * @param {Function} iteratee The iteratee to transform keys.
	     * @param {Object} accumulator The initial aggregated object.
	     * @returns {Function} Returns `accumulator`.
	     */
	    function baseAggregator(collection, setter, iteratee, accumulator) {
	      baseEach(collection, function(value, key, collection) {
	        setter(accumulator, value, iteratee(value), collection);
	      });
	      return accumulator;
	    }
	
	    /**
	     * The base implementation of `_.assign` without support for multiple sources
	     * or `customizer` functions.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @returns {Object} Returns `object`.
	     */
	    function baseAssign(object, source) {
	      return object && copyObject(source, keys(source), object);
	    }
	
	    /**
	     * The base implementation of `_.at` without support for individual paths.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {string[]} paths The property paths of elements to pick.
	     * @returns {Array} Returns the new array of picked elements.
	     */
	    function baseAt(object, paths) {
	      var index = -1,
	          isNil = object == null,
	          length = paths.length,
	          result = Array(length);
	
	      while (++index < length) {
	        result[index] = isNil ? undefined : get(object, paths[index]);
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.clamp` which doesn't coerce arguments to numbers.
	     *
	     * @private
	     * @param {number} number The number to clamp.
	     * @param {number} [lower] The lower bound.
	     * @param {number} upper The upper bound.
	     * @returns {number} Returns the clamped number.
	     */
	    function baseClamp(number, lower, upper) {
	      if (number === number) {
	        if (upper !== undefined) {
	          number = number <= upper ? number : upper;
	        }
	        if (lower !== undefined) {
	          number = number >= lower ? number : lower;
	        }
	      }
	      return number;
	    }
	
	    /**
	     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	     * traversed objects.
	     *
	     * @private
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @param {Function} [customizer] The function to customize cloning.
	     * @param {string} [key] The key of `value`.
	     * @param {Object} [object] The parent object of `value`.
	     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	     * @returns {*} Returns the cloned value.
	     */
	    function baseClone(value, isDeep, customizer, key, object, stack) {
	      var result;
	      if (customizer) {
	        result = object ? customizer(value, key, object, stack) : customizer(value);
	      }
	      if (result !== undefined) {
	        return result;
	      }
	      if (!isObject(value)) {
	        return value;
	      }
	      var isArr = isArray(value);
	      if (isArr) {
	        result = initCloneArray(value);
	        if (!isDeep) {
	          return copyArray(value, result);
	        }
	      } else {
	        var tag = getTag(value),
	            isFunc = tag == funcTag || tag == genTag;
	
	        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	          if (isHostObject(value)) {
	            return object ? value : {};
	          }
	          result = initCloneObject(isFunc ? {} : value);
	          if (!isDeep) {
	            return copySymbols(value, baseAssign(result, value));
	          }
	        } else {
	          return cloneableTags[tag]
	            ? initCloneByTag(value, tag, isDeep)
	            : (object ? value : {});
	        }
	      }
	      // Check for circular references and return its corresponding clone.
	      stack || (stack = new Stack);
	      var stacked = stack.get(value);
	      if (stacked) {
	        return stacked;
	      }
	      stack.set(value, result);
	
	      // Recursively populate clone (susceptible to call stack limits).
	      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
	        assignValue(result, key, baseClone(subValue, isDeep, customizer, key, value, stack));
	      });
	      return isArr ? result : copySymbols(value, result);
	    }
	
	    /**
	     * The base implementation of `_.conforms` which doesn't clone `source`.
	     *
	     * @private
	     * @param {Object} source The object of property predicates to conform to.
	     * @returns {Function} Returns the new function.
	     */
	    function baseConforms(source) {
	      var props = keys(source),
	          length = props.length;
	
	      return function(object) {
	        if (object == null) {
	          return !length;
	        }
	        var index = length;
	        while (index--) {
	          var key = props[index],
	              predicate = source[key],
	              value = object[key];
	
	          if ((value === undefined && !(key in Object(object))) || !predicate(value)) {
	            return false;
	          }
	        }
	        return true;
	      };
	    }
	
	    /**
	     * The base implementation of `_.create` without support for assigning
	     * properties to the created object.
	     *
	     * @private
	     * @param {Object} prototype The object to inherit from.
	     * @returns {Object} Returns the new object.
	     */
	    var baseCreate = (function() {
	      function object() {}
	      return function(prototype) {
	        if (isObject(prototype)) {
	          object.prototype = prototype;
	          var result = new object;
	          object.prototype = undefined;
	        }
	        return result || {};
	      };
	    }());
	
	    /**
	     * The base implementation of `_.delay` and `_.defer` which accepts an array
	     * of `func` arguments.
	     *
	     * @private
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay invocation.
	     * @param {Object} args The arguments provide to `func`.
	     * @returns {number} Returns the timer id.
	     */
	    function baseDelay(func, wait, args) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return setTimeout(function() { func.apply(undefined, args); }, wait);
	    }
	
	    /**
	     * The base implementation of methods like `_.difference` without support for
	     * excluding multiple arrays or iteratee shorthands.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Array} values The values to exclude.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of filtered values.
	     */
	    function baseDifference(array, values, iteratee, comparator) {
	      var index = -1,
	          includes = arrayIncludes,
	          isCommon = true,
	          length = array.length,
	          result = [],
	          valuesLength = values.length;
	
	      if (!length) {
	        return result;
	      }
	      if (iteratee) {
	        values = arrayMap(values, baseUnary(iteratee));
	      }
	      if (comparator) {
	        includes = arrayIncludesWith;
	        isCommon = false;
	      }
	      else if (values.length >= LARGE_ARRAY_SIZE) {
	        includes = cacheHas;
	        isCommon = false;
	        values = new SetCache(values);
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value) : value;
	
	        if (isCommon && computed === computed) {
	          var valuesIndex = valuesLength;
	          while (valuesIndex--) {
	            if (values[valuesIndex] === computed) {
	              continue outer;
	            }
	          }
	          result.push(value);
	        }
	        else if (!includes(values, computed, comparator)) {
	          result.push(value);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.forEach` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array|Object} Returns `collection`.
	     */
	    var baseEach = createBaseEach(baseForOwn);
	
	    /**
	     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array|Object} Returns `collection`.
	     */
	    var baseEachRight = createBaseEach(baseForOwnRight, true);
	
	    /**
	     * The base implementation of `_.every` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`
	     */
	    function baseEvery(collection, predicate) {
	      var result = true;
	      baseEach(collection, function(value, index, collection) {
	        result = !!predicate(value, index, collection);
	        return result;
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.fill` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to fill.
	     * @param {*} value The value to fill `array` with.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns `array`.
	     */
	    function baseFill(array, value, start, end) {
	      var length = array.length;
	
	      start = toInteger(start);
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = (end === undefined || end > length) ? length : toInteger(end);
	      if (end < 0) {
	        end += length;
	      }
	      end = start > end ? 0 : toLength(end);
	      while (start < end) {
	        array[start++] = value;
	      }
	      return array;
	    }
	
	    /**
	     * The base implementation of `_.filter` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     */
	    function baseFilter(collection, predicate) {
	      var result = [];
	      baseEach(collection, function(value, index, collection) {
	        if (predicate(value, index, collection)) {
	          result.push(value);
	        }
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.flatten` with support for restricting flattening.
	     *
	     * @private
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isDeep] Specify a deep flatten.
	     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
	     * @param {Array} [result=[]] The initial result value.
	     * @returns {Array} Returns the new flattened array.
	     */
	    function baseFlatten(array, isDeep, isStrict, result) {
	      result || (result = []);
	
	      var index = -1,
	          length = array.length;
	
	      while (++index < length) {
	        var value = array[index];
	        if (isArrayLikeObject(value) &&
	            (isStrict || isArray(value) || isArguments(value))) {
	          if (isDeep) {
	            // Recursively flatten arrays (susceptible to call stack limits).
	            baseFlatten(value, isDeep, isStrict, result);
	          } else {
	            arrayPush(result, value);
	          }
	        } else if (!isStrict) {
	          result[result.length] = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `baseForIn` and `baseForOwn` which iterates
	     * over `object` properties returned by `keysFunc` invoking `iteratee` for
	     * each property. Iteratee functions may exit iteration early by explicitly
	     * returning `false`.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseFor = createBaseFor();
	
	    /**
	     * This function is like `baseFor` except that it iterates over properties
	     * in the opposite order.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseForRight = createBaseFor(true);
	
	    /**
	     * The base implementation of `_.forIn` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForIn(object, iteratee) {
	      return object == null ? object : baseFor(object, iteratee, keysIn);
	    }
	
	    /**
	     * The base implementation of `_.forOwn` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwn(object, iteratee) {
	      return object && baseFor(object, iteratee, keys);
	    }
	
	    /**
	     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwnRight(object, iteratee) {
	      return object && baseForRight(object, iteratee, keys);
	    }
	
	    /**
	     * The base implementation of `_.functions` which creates an array of
	     * `object` function property names filtered from those provided.
	     *
	     * @private
	     * @param {Object} object The object to inspect.
	     * @param {Array} props The property names to filter.
	     * @returns {Array} Returns the new array of filtered property names.
	     */
	    function baseFunctions(object, props) {
	      return arrayFilter(props, function(key) {
	        return isFunction(object[key]);
	      });
	    }
	
	    /**
	     * The base implementation of `_.get` without support for default values.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to get.
	     * @returns {*} Returns the resolved value.
	     */
	    function baseGet(object, path) {
	      path = isKey(path, object) ? [path + ''] : baseToPath(path);
	
	      var index = 0,
	          length = path.length;
	
	      while (object != null && index < length) {
	        object = object[path[index++]];
	      }
	      return (index && index == length) ? object : undefined;
	    }
	
	    /**
	     * The base implementation of `_.has` without support for deep paths.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} key The key to check.
	     * @returns {boolean} Returns `true` if `key` exists, else `false`.
	     */
	    function baseHas(object, key) {
	      // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	      // that are composed entirely of index properties, return `false` for
	      // `hasOwnProperty` checks of them.
	      return hasOwnProperty.call(object, key) ||
	        (typeof object == 'object' && key in object && getPrototypeOf(object) === null);
	    }
	
	    /**
	     * The base implementation of `_.hasIn` without support for deep paths.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} key The key to check.
	     * @returns {boolean} Returns `true` if `key` exists, else `false`.
	     */
	    function baseHasIn(object, key) {
	      return key in Object(object);
	    }
	
	    /**
	     * The base implementation of `_.inRange` which doesn't coerce arguments to numbers.
	     *
	     * @private
	     * @param {number} number The number to check.
	     * @param {number} start The start of the range.
	     * @param {number} end The end of the range.
	     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
	     */
	    function baseInRange(number, start, end) {
	      return number >= nativeMin(start, end) && number < nativeMax(start, end);
	    }
	
	    /**
	     * The base implementation of methods like `_.intersection`, without support
	     * for iteratee shorthands, that accepts an array of arrays to inspect.
	     *
	     * @private
	     * @param {Array} arrays The arrays to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of shared values.
	     */
	    function baseIntersection(arrays, iteratee, comparator) {
	      var includes = comparator ? arrayIncludesWith : arrayIncludes,
	          othLength = arrays.length,
	          othIndex = othLength,
	          caches = Array(othLength),
	          result = [];
	
	      while (othIndex--) {
	        var array = arrays[othIndex];
	        if (othIndex && iteratee) {
	          array = arrayMap(array, baseUnary(iteratee));
	        }
	        caches[othIndex] = !comparator && (iteratee || array.length >= 120)
	          ? new SetCache(othIndex && array)
	          : undefined;
	      }
	      array = arrays[0];
	
	      var index = -1,
	          length = array.length,
	          seen = caches[0];
	
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value) : value;
	
	        if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
	          var othIndex = othLength;
	          while (--othIndex) {
	            var cache = caches[othIndex];
	            if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
	              continue outer;
	            }
	          }
	          if (seen) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.invert` and `_.invertBy` which inverts
	     * `object` with values transformed by `iteratee` and set by `setter`.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} setter The function to set `accumulator` values.
	     * @param {Function} iteratee The iteratee to transform values.
	     * @param {Object} accumulator The initial inverted object.
	     * @returns {Function} Returns `accumulator`.
	     */
	    function baseInverter(object, setter, iteratee, accumulator) {
	      baseForOwn(object, function(value, key, object) {
	        setter(accumulator, iteratee(value), key, object);
	      });
	      return accumulator;
	    }
	
	    /**
	     * The base implementation of `_.invoke` without support for individual
	     * method arguments.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the method to invoke.
	     * @param {Array} args The arguments to invoke the method with.
	     * @returns {*} Returns the result of the invoked method.
	     */
	    function baseInvoke(object, path, args) {
	      if (!isKey(path, object)) {
	        path = baseToPath(path);
	        object = parent(object, path);
	        path = last(path);
	      }
	      var func = object == null ? object : object[path];
	      return func == null ? undefined : apply(func, object, args);
	    }
	
	    /**
	     * The base implementation of `_.isEqual` which supports partial comparisons
	     * and tracks traversed objects.
	     *
	     * @private
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {boolean} [bitmask] The bitmask of comparison flags.
	     *  The bitmask may be composed of the following flags:
	     *     1 - Unordered comparison
	     *     2 - Partial comparison
	     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     */
	    function baseIsEqual(value, other, customizer, bitmask, stack) {
	      if (value === other) {
	        return true;
	      }
	      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	        return value !== value && other !== other;
	      }
	      return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
	    }
	
	    /**
	     * A specialized version of `baseIsEqual` for arrays and objects which performs
	     * deep comparisons and tracks traversed objects enabling objects with circular
	     * references to be compared.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
	      var objIsArr = isArray(object),
	          othIsArr = isArray(other),
	          objTag = arrayTag,
	          othTag = arrayTag;
	
	      if (!objIsArr) {
	        objTag = getTag(object);
	        if (objTag == argsTag) {
	          objTag = objectTag;
	        } else if (objTag != objectTag) {
	          objIsArr = isTypedArray(object);
	        }
	      }
	      if (!othIsArr) {
	        othTag = getTag(other);
	        if (othTag == argsTag) {
	          othTag = objectTag;
	        } else if (othTag != objectTag) {
	          othIsArr = isTypedArray(other);
	        }
	      }
	      var objIsObj = objTag == objectTag && !isHostObject(object),
	          othIsObj = othTag == objectTag && !isHostObject(other),
	          isSameTag = objTag == othTag;
	
	      if (isSameTag && !(objIsArr || objIsObj)) {
	        return equalByTag(object, other, objTag, equalFunc, customizer, bitmask);
	      }
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	      if (!isPartial) {
	        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	        if (objIsWrapped || othIsWrapped) {
	          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, bitmask, stack);
	        }
	      }
	      if (!isSameTag) {
	        return false;
	      }
	      stack || (stack = new Stack);
	      return (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, bitmask, stack);
	    }
	
	    /**
	     * The base implementation of `_.isMatch` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to inspect.
	     * @param {Object} source The object of property values to match.
	     * @param {Array} matchData The property names, values, and compare flags to match.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     */
	    function baseIsMatch(object, source, matchData, customizer) {
	      var index = matchData.length,
	          length = index,
	          noCustomizer = !customizer;
	
	      if (object == null) {
	        return !length;
	      }
	      object = Object(object);
	      while (index--) {
	        var data = matchData[index];
	        if ((noCustomizer && data[2])
	              ? data[1] !== object[data[0]]
	              : !(data[0] in object)
	            ) {
	          return false;
	        }
	      }
	      while (++index < length) {
	        data = matchData[index];
	        var key = data[0],
	            objValue = object[key],
	            srcValue = data[1];
	
	        if (noCustomizer && data[2]) {
	          if (objValue === undefined && !(key in object)) {
	            return false;
	          }
	        } else {
	          var stack = new Stack,
	              result = customizer ? customizer(objValue, srcValue, key, object, source, stack) : undefined;
	
	          if (!(result === undefined
	                ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
	                : result
	              )) {
	            return false;
	          }
	        }
	      }
	      return true;
	    }
	
	    /**
	     * The base implementation of `_.iteratee`.
	     *
	     * @private
	     * @param {*} [value=_.identity] The value to convert to an iteratee.
	     * @returns {Function} Returns the iteratee.
	     */
	    function baseIteratee(value) {
	      var type = typeof value;
	      if (type == 'function') {
	        return value;
	      }
	      if (value == null) {
	        return identity;
	      }
	      if (type == 'object') {
	        return isArray(value)
	          ? baseMatchesProperty(value[0], value[1])
	          : baseMatches(value);
	      }
	      return property(value);
	    }
	
	    /**
	     * The base implementation of `_.keys` which doesn't skip the constructor
	     * property of prototypes or treat sparse arrays as dense.
	     *
	     * @private
	     * @type Function
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     */
	    function baseKeys(object) {
	      return nativeKeys(Object(object));
	    }
	
	    /**
	     * The base implementation of `_.keysIn` which doesn't skip the constructor
	     * property of prototypes or treat sparse arrays as dense.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     */
	    function baseKeysIn(object) {
	      object = object == null ? object : Object(object);
	
	      var result = [];
	      for (var key in object) {
	        result.push(key);
	      }
	      return result;
	    }
	
	    // Fallback for IE < 9 with es6-shim.
	    if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
	      baseKeysIn = function(object) {
	        return iteratorToArray(enumerate(object));
	      };
	    }
	
	    /**
	     * The base implementation of `_.map` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     */
	    function baseMap(collection, iteratee) {
	      var index = -1,
	          result = isArrayLike(collection) ? Array(collection.length) : [];
	
	      baseEach(collection, function(value, key, collection) {
	        result[++index] = iteratee(value, key, collection);
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.matches` which doesn't clone `source`.
	     *
	     * @private
	     * @param {Object} source The object of property values to match.
	     * @returns {Function} Returns the new function.
	     */
	    function baseMatches(source) {
	      var matchData = getMatchData(source);
	      if (matchData.length == 1 && matchData[0][2]) {
	        var key = matchData[0][0],
	            value = matchData[0][1];
	
	        return function(object) {
	          if (object == null) {
	            return false;
	          }
	          return object[key] === value &&
	            (value !== undefined || (key in Object(object)));
	        };
	      }
	      return function(object) {
	        return object === source || baseIsMatch(object, source, matchData);
	      };
	    }
	
	    /**
	     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	     *
	     * @private
	     * @param {string} path The path of the property to get.
	     * @param {*} srcValue The value to match.
	     * @returns {Function} Returns the new function.
	     */
	    function baseMatchesProperty(path, srcValue) {
	      return function(object) {
	        var objValue = get(object, path);
	        return (objValue === undefined && objValue === srcValue)
	          ? hasIn(object, path)
	          : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
	      };
	    }
	
	    /**
	     * The base implementation of `_.merge` without support for multiple sources.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {number} srcIndex The index of `source`.
	     * @param {Function} [customizer] The function to customize merged values.
	     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
	     */
	    function baseMerge(object, source, srcIndex, customizer, stack) {
	      if (object === source) {
	        return;
	      }
	      var props = (isArray(source) || isTypedArray(source)) ? undefined : keysIn(source);
	      arrayEach(props || source, function(srcValue, key) {
	        if (props) {
	          key = srcValue;
	          srcValue = source[key];
	        }
	        if (isObject(srcValue)) {
	          stack || (stack = new Stack);
	          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	        }
	        else {
	          var newValue = customizer ? customizer(object[key], srcValue, (key + ''), object, source, stack) : undefined;
	          if (newValue === undefined) {
	            newValue = srcValue;
	          }
	          assignMergeValue(object, key, newValue);
	        }
	      });
	    }
	
	    /**
	     * A specialized version of `baseMerge` for arrays and objects which performs
	     * deep merges and tracks traversed objects enabling objects with circular
	     * references to be merged.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {string} key The key of the value to merge.
	     * @param {number} srcIndex The index of `source`.
	     * @param {Function} mergeFunc The function to merge values.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
	     */
	    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	      var objValue = object[key],
	          srcValue = source[key],
	          stacked = stack.get(srcValue);
	
	      if (stacked) {
	        assignMergeValue(object, key, stacked);
	        return;
	      }
	      var newValue = customizer ? customizer(objValue, srcValue, (key + ''), object, source, stack) : undefined,
	          isCommon = newValue === undefined;
	
	      if (isCommon) {
	        newValue = srcValue;
	        if (isArray(srcValue) || isTypedArray(srcValue)) {
	          if (isArray(objValue)) {
	            newValue = srcIndex ? copyArray(objValue) : objValue;
	          }
	          else if (isArrayLikeObject(objValue)) {
	            newValue = copyArray(objValue);
	          }
	          else {
	            isCommon = false;
	            newValue = baseClone(srcValue);
	          }
	        }
	        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	          if (isArguments(objValue)) {
	            newValue = toPlainObject(objValue);
	          }
	          else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
	            isCommon = false;
	            newValue = baseClone(srcValue);
	          }
	          else {
	            newValue = srcIndex ? baseClone(objValue) : objValue;
	          }
	        }
	        else {
	          isCommon = false;
	        }
	      }
	      stack.set(srcValue, newValue);
	
	      if (isCommon) {
	        // Recursively merge objects and arrays (susceptible to call stack limits).
	        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	      }
	      assignMergeValue(object, key, newValue);
	    }
	
	    /**
	     * The base implementation of `_.orderBy` without param guards.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
	     * @param {string[]} orders The sort orders of `iteratees`.
	     * @returns {Array} Returns the new sorted array.
	     */
	    function baseOrderBy(collection, iteratees, orders) {
	      var index = -1,
	          toIteratee = getIteratee();
	
	      iteratees = arrayMap(iteratees.length ? iteratees : Array(1), function(iteratee) {
	        return toIteratee(iteratee);
	      });
	
	      var result = baseMap(collection, function(value, key, collection) {
	        var criteria = arrayMap(iteratees, function(iteratee) {
	          return iteratee(value);
	        });
	        return { 'criteria': criteria, 'index': ++index, 'value': value };
	      });
	
	      return baseSortBy(result, function(object, other) {
	        return compareMultiple(object, other, orders);
	      });
	    }
	
	    /**
	     * The base implementation of `_.pick` without support for individual
	     * property names.
	     *
	     * @private
	     * @param {Object} object The source object.
	     * @param {string[]} props The property names to pick.
	     * @returns {Object} Returns the new object.
	     */
	    function basePick(object, props) {
	      object = Object(object);
	      return arrayReduce(props, function(result, key) {
	        if (key in object) {
	          result[key] = object[key];
	        }
	        return result;
	      }, {});
	    }
	
	    /**
	     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The source object.
	     * @param {Function} predicate The function invoked per property.
	     * @returns {Object} Returns the new object.
	     */
	    function basePickBy(object, predicate) {
	      var result = {};
	      baseForIn(object, function(value, key) {
	        if (predicate(value, key)) {
	          result[key] = value;
	        }
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.property` without support for deep paths.
	     *
	     * @private
	     * @param {string} key The key of the property to get.
	     * @returns {Function} Returns the new function.
	     */
	    function baseProperty(key) {
	      return function(object) {
	        return object == null ? undefined : object[key];
	      };
	    }
	
	    /**
	     * A specialized version of `baseProperty` which supports deep paths.
	     *
	     * @private
	     * @param {Array|string} path The path of the property to get.
	     * @returns {Function} Returns the new function.
	     */
	    function basePropertyDeep(path) {
	      return function(object) {
	        return baseGet(object, path);
	      };
	    }
	
	    /**
	     * The base implementation of `_.pullAll`.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {Array} values The values to remove.
	     * @returns {Array} Returns `array`.
	     */
	    function basePullAll(array, values) {
	      return basePullAllBy(array, values);
	    }
	
	    /**
	     * The base implementation of `_.pullAllBy` without support for iteratee
	     * shorthands.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {Array} values The values to remove.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @returns {Array} Returns `array`.
	     */
	    function basePullAllBy(array, values, iteratee) {
	      var index = -1,
	          length = values.length,
	          seen = array;
	
	      if (iteratee) {
	        seen = arrayMap(array, function(value) { return iteratee(value); });
	      }
	      while (++index < length) {
	        var fromIndex = 0,
	            value = values[index],
	            computed = iteratee ? iteratee(value) : value;
	
	        while ((fromIndex = baseIndexOf(seen, computed, fromIndex)) > -1) {
	          if (seen !== array) {
	            splice.call(seen, fromIndex, 1);
	          }
	          splice.call(array, fromIndex, 1);
	        }
	      }
	      return array;
	    }
	
	    /**
	     * The base implementation of `_.pullAt` without support for individual
	     * indexes or capturing the removed elements.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {number[]} indexes The indexes of elements to remove.
	     * @returns {Array} Returns `array`.
	     */
	    function basePullAt(array, indexes) {
	      var length = array ? indexes.length : 0,
	          lastIndex = length - 1;
	
	      while (length--) {
	        var index = indexes[length];
	        if (lastIndex == length || index != previous) {
	          var previous = index;
	          if (isIndex(index)) {
	            splice.call(array, index, 1);
	          }
	          else if (!isKey(index, array)) {
	            var path = baseToPath(index),
	                object = parent(array, path);
	
	            if (object != null) {
	              delete object[last(path)];
	            }
	          }
	          else {
	            delete array[index];
	          }
	        }
	      }
	      return array;
	    }
	
	    /**
	     * The base implementation of `_.random` without support for returning
	     * floating-point numbers.
	     *
	     * @private
	     * @param {number} lower The lower bound.
	     * @param {number} upper The upper bound.
	     * @returns {number} Returns the random number.
	     */
	    function baseRandom(lower, upper) {
	      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
	    }
	
	    /**
	     * The base implementation of `_.range` and `_.rangeRight` which doesn't
	     * coerce arguments to numbers.
	     *
	     * @private
	     * @param {number} start The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} step The value to increment or decrement by.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Array} Returns the new array of numbers.
	     */
	    function baseRange(start, end, step, fromRight) {
	      var index = -1,
	          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
	          result = Array(length);
	
	      while (length--) {
	        result[fromRight ? length : ++index] = start;
	        start += step;
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.set`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to set.
	     * @param {*} value The value to set.
	     * @param {Function} [customizer] The function to customize path creation.
	     * @returns {Object} Returns `object`.
	     */
	    function baseSet(object, path, value, customizer) {
	      path = isKey(path, object) ? [path + ''] : baseToPath(path);
	
	      var index = -1,
	          length = path.length,
	          lastIndex = length - 1,
	          nested = object;
	
	      while (nested != null && ++index < length) {
	        var key = path[index];
	        if (isObject(nested)) {
	          var newValue = value;
	          if (index != lastIndex) {
	            var objValue = nested[key];
	            newValue = customizer ? customizer(objValue, key, nested) : undefined;
	            if (newValue === undefined) {
	              newValue = objValue == null ? (isIndex(path[index + 1]) ? [] : {}) : objValue;
	            }
	          }
	          assignValue(nested, key, newValue);
	        }
	        nested = nested[key];
	      }
	      return object;
	    }
	
	    /**
	     * The base implementation of `setData` without support for hot loop detection.
	     *
	     * @private
	     * @param {Function} func The function to associate metadata with.
	     * @param {*} data The metadata.
	     * @returns {Function} Returns `func`.
	     */
	    var baseSetData = !metaMap ? identity : function(func, data) {
	      metaMap.set(func, data);
	      return func;
	    };
	
	    /**
	     * The base implementation of `_.slice` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseSlice(array, start, end) {
	      var index = -1,
	          length = array.length;
	
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = end > length ? length : end;
	      if (end < 0) {
	        end += length;
	      }
	      length = start > end ? 0 : ((end - start) >>> 0);
	      start >>>= 0;
	
	      var result = Array(length);
	      while (++index < length) {
	        result[index] = array[index + start];
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.some` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
	     */
	    function baseSome(collection, predicate) {
	      var result;
	
	      baseEach(collection, function(value, index, collection) {
	        result = predicate(value, index, collection);
	        return !result;
	      });
	      return !!result;
	    }
	
	    /**
	     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
	     * performs a binary search of `array` to determine the index at which `value`
	     * should be inserted into `array` in order to maintain its sort order.
	     *
	     * @private
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     */
	    function baseSortedIndex(array, value, retHighest) {
	      var low = 0,
	          high = array ? array.length : low;
	
	      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
	        while (low < high) {
	          var mid = (low + high) >>> 1,
	              computed = array[mid];
	
	          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
	            low = mid + 1;
	          } else {
	            high = mid;
	          }
	        }
	        return high;
	      }
	      return baseSortedIndexBy(array, value, identity, retHighest);
	    }
	
	    /**
	     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
	     * which invokes `iteratee` for `value` and each element of `array` to compute
	     * their sort ranking. The iteratee is invoked with one argument; (value).
	     *
	     * @private
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function} iteratee The iteratee invoked per element.
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     */
	    function baseSortedIndexBy(array, value, iteratee, retHighest) {
	      value = iteratee(value);
	
	      var low = 0,
	          high = array ? array.length : 0,
	          valIsNaN = value !== value,
	          valIsNull = value === null,
	          valIsUndef = value === undefined;
	
	      while (low < high) {
	        var mid = nativeFloor((low + high) / 2),
	            computed = iteratee(array[mid]),
	            isDef = computed !== undefined,
	            isReflexive = computed === computed;
	
	        if (valIsNaN) {
	          var setLow = isReflexive || retHighest;
	        } else if (valIsNull) {
	          setLow = isReflexive && isDef && (retHighest || computed != null);
	        } else if (valIsUndef) {
	          setLow = isReflexive && (retHighest || isDef);
	        } else if (computed == null) {
	          setLow = false;
	        } else {
	          setLow = retHighest ? (computed <= value) : (computed < value);
	        }
	        if (setLow) {
	          low = mid + 1;
	        } else {
	          high = mid;
	        }
	      }
	      return nativeMin(high, MAX_ARRAY_INDEX);
	    }
	
	    /**
	     * The base implementation of `_.sortedUniq`.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @returns {Array} Returns the new duplicate free array.
	     */
	    function baseSortedUniq(array) {
	      return baseSortedUniqBy(array);
	    }
	
	    /**
	     * The base implementation of `_.sortedUniqBy` without support for iteratee
	     * shorthands.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     */
	    function baseSortedUniqBy(array, iteratee) {
	      var index = 0,
	          length = array.length,
	          value = array[0],
	          computed = iteratee ? iteratee(value) : value,
	          seen = computed,
	          resIndex = 0,
	          result = [value];
	
	      while (++index < length) {
	        value = array[index],
	        computed = iteratee ? iteratee(value) : value;
	
	        if (!eq(computed, seen)) {
	          seen = computed;
	          result[++resIndex] = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.toPath` which only converts `value` to a
	     * path if it's not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Array} Returns the property path array.
	     */
	    function baseToPath(value) {
	      return isArray(value) ? value : stringToPath(value);
	    }
	
	    /**
	     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     */
	    function baseUniq(array, iteratee, comparator) {
	      var index = -1,
	          includes = arrayIncludes,
	          length = array.length,
	          isCommon = true,
	          result = [],
	          seen = result;
	
	      if (comparator) {
	        isCommon = false;
	        includes = arrayIncludesWith;
	      }
	      else if (length >= LARGE_ARRAY_SIZE) {
	        var set = iteratee ? null : createSet(array);
	        if (set) {
	          return setToArray(set);
	        }
	        isCommon = false;
	        includes = cacheHas;
	        seen = new SetCache;
	      }
	      else {
	        seen = iteratee ? [] : result;
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value) : value;
	
	        if (isCommon && computed === computed) {
	          var seenIndex = seen.length;
	          while (seenIndex--) {
	            if (seen[seenIndex] === computed) {
	              continue outer;
	            }
	          }
	          if (iteratee) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	        else if (!includes(seen, computed, comparator)) {
	          if (seen !== result) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.unset`.
	     *
	     * @private
	     * @param {Object} object The object to modify.
	     * @param {Array|string} path The path of the property to unset.
	     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
	     */
	    function baseUnset(object, path) {
	      path = isKey(path, object) ? [path + ''] : baseToPath(path);
	      object = parent(object, path);
	      var key = last(path);
	      return (object != null && has(object, key)) ? delete object[key] : true;
	    }
	
	    /**
	     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
	     * without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {Function} predicate The function invoked per iteration.
	     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseWhile(array, predicate, isDrop, fromRight) {
	      var length = array.length,
	          index = fromRight ? length : -1;
	
	      while ((fromRight ? index-- : ++index < length) &&
	        predicate(array[index], index, array)) {}
	
	      return isDrop
	        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
	        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
	    }
	
	    /**
	     * The base implementation of `wrapperValue` which returns the result of
	     * performing a sequence of actions on the unwrapped `value`, where each
	     * successive action is supplied the return value of the previous.
	     *
	     * @private
	     * @param {*} value The unwrapped value.
	     * @param {Array} actions Actions to perform to resolve the unwrapped value.
	     * @returns {*} Returns the resolved value.
	     */
	    function baseWrapperValue(value, actions) {
	      var result = value;
	      if (result instanceof LazyWrapper) {
	        result = result.value();
	      }
	      return arrayReduce(actions, function(result, action) {
	        return action.func.apply(action.thisArg, arrayPush([result], action.args));
	      }, result);
	    }
	
	    /**
	     * The base implementation of methods like `_.xor`, without support for
	     * iteratee shorthands, that accepts an array of arrays to inspect.
	     *
	     * @private
	     * @param {Array} arrays The arrays to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of values.
	     */
	    function baseXor(arrays, iteratee, comparator) {
	      var index = -1,
	          length = arrays.length;
	
	      while (++index < length) {
	        var result = result
	          ? arrayPush(
	              baseDifference(result, arrays[index], iteratee, comparator),
	              baseDifference(arrays[index], result, iteratee, comparator)
	            )
	          : arrays[index];
	      }
	      return (result && result.length) ? baseUniq(result, iteratee, comparator) : [];
	    }
	
	    /**
	     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
	     *
	     * @private
	     * @param {Array} props The property names.
	     * @param {Array} values The property values.
	     * @param {Function} assignFunc The function to assign values.
	     * @returns {Object} Returns the new object.
	     */
	    function baseZipObject(props, values, assignFunc) {
	      var index = -1,
	          length = props.length,
	          valsLength = values.length,
	          result = {};
	
	      while (++index < length) {
	        assignFunc(result, props[index], index < valsLength ? values[index] : undefined);
	      }
	      return result;
	    }
	
	    /**
	     * Creates a clone of `buffer`.
	     *
	     * @private
	     * @param {ArrayBuffer} buffer The array buffer to clone.
	     * @returns {ArrayBuffer} Returns the cloned array buffer.
	     */
	    function cloneBuffer(buffer) {
	      var Ctor = buffer.constructor,
	          result = new Ctor(buffer.byteLength),
	          view = new Uint8Array(result);
	
	      view.set(new Uint8Array(buffer));
	      return result;
	    }
	
	    /**
	     * Creates a clone of `map`.
	     *
	     * @private
	     * @param {Object} map The map to clone.
	     * @returns {Object} Returns the cloned map.
	     */
	    function cloneMap(map) {
	      var Ctor = map.constructor;
	      return arrayReduce(mapToArray(map), addMapEntry, new Ctor);
	    }
	
	    /**
	     * Creates a clone of `regexp`.
	     *
	     * @private
	     * @param {Object} regexp The regexp to clone.
	     * @returns {Object} Returns the cloned regexp.
	     */
	    function cloneRegExp(regexp) {
	      var Ctor = regexp.constructor,
	          result = new Ctor(regexp.source, reFlags.exec(regexp));
	
	      result.lastIndex = regexp.lastIndex;
	      return result;
	    }
	
	    /**
	     * Creates a clone of `set`.
	     *
	     * @private
	     * @param {Object} set The set to clone.
	     * @returns {Object} Returns the cloned set.
	     */
	    function cloneSet(set) {
	      var Ctor = set.constructor;
	      return arrayReduce(setToArray(set), addSetEntry, new Ctor);
	    }
	
	    /**
	     * Creates a clone of the `symbol` object.
	     *
	     * @private
	     * @param {Object} symbol The symbol object to clone.
	     * @returns {Object} Returns the cloned symbol object.
	     */
	    function cloneSymbol(symbol) {
	      return Symbol ? Object(symbolValueOf.call(symbol)) : {};
	    }
	
	    /**
	     * Creates a clone of `typedArray`.
	     *
	     * @private
	     * @param {Object} typedArray The typed array to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @returns {Object} Returns the cloned typed array.
	     */
	    function cloneTypedArray(typedArray, isDeep) {
	      var buffer = typedArray.buffer,
	          Ctor = typedArray.constructor;
	
	      return new Ctor(isDeep ? cloneBuffer(buffer) : buffer, typedArray.byteOffset, typedArray.length);
	    }
	
	    /**
	     * Creates an array that is the composition of partially applied arguments,
	     * placeholders, and provided arguments into a single array of arguments.
	     *
	     * @private
	     * @param {Array|Object} args The provided arguments.
	     * @param {Array} partials The arguments to prepend to those provided.
	     * @param {Array} holders The `partials` placeholder indexes.
	     * @returns {Array} Returns the new array of composed arguments.
	     */
	    function composeArgs(args, partials, holders) {
	      var holdersLength = holders.length,
	          argsIndex = -1,
	          argsLength = nativeMax(args.length - holdersLength, 0),
	          leftIndex = -1,
	          leftLength = partials.length,
	          result = Array(leftLength + argsLength);
	
	      while (++leftIndex < leftLength) {
	        result[leftIndex] = partials[leftIndex];
	      }
	      while (++argsIndex < holdersLength) {
	        result[holders[argsIndex]] = args[argsIndex];
	      }
	      while (argsLength--) {
	        result[leftIndex++] = args[argsIndex++];
	      }
	      return result;
	    }
	
	    /**
	     * This function is like `composeArgs` except that the arguments composition
	     * is tailored for `_.partialRight`.
	     *
	     * @private
	     * @param {Array|Object} args The provided arguments.
	     * @param {Array} partials The arguments to append to those provided.
	     * @param {Array} holders The `partials` placeholder indexes.
	     * @returns {Array} Returns the new array of composed arguments.
	     */
	    function composeArgsRight(args, partials, holders) {
	      var holdersIndex = -1,
	          holdersLength = holders.length,
	          argsIndex = -1,
	          argsLength = nativeMax(args.length - holdersLength, 0),
	          rightIndex = -1,
	          rightLength = partials.length,
	          result = Array(argsLength + rightLength);
	
	      while (++argsIndex < argsLength) {
	        result[argsIndex] = args[argsIndex];
	      }
	      var offset = argsIndex;
	      while (++rightIndex < rightLength) {
	        result[offset + rightIndex] = partials[rightIndex];
	      }
	      while (++holdersIndex < holdersLength) {
	        result[offset + holders[holdersIndex]] = args[argsIndex++];
	      }
	      return result;
	    }
	
	    /**
	     * Copies the values of `source` to `array`.
	     *
	     * @private
	     * @param {Array} source The array to copy values from.
	     * @param {Array} [array=[]] The array to copy values to.
	     * @returns {Array} Returns `array`.
	     */
	    function copyArray(source, array) {
	      var index = -1,
	          length = source.length;
	
	      array || (array = Array(length));
	      while (++index < length) {
	        array[index] = source[index];
	      }
	      return array;
	    }
	
	    /**
	     * Copies properties of `source` to `object`.
	     *
	     * @private
	     * @param {Object} source The object to copy properties from.
	     * @param {Array} props The property names to copy.
	     * @param {Object} [object={}] The object to copy properties to.
	     * @returns {Object} Returns `object`.
	     */
	    function copyObject(source, props, object) {
	      return copyObjectWith(source, props, object);
	    }
	
	    /**
	     * This function is like `copyObject` except that it accepts a function to
	     * customize copied values.
	     *
	     * @private
	     * @param {Object} source The object to copy properties from.
	     * @param {Array} props The property names to copy.
	     * @param {Object} [object={}] The object to copy properties to.
	     * @param {Function} [customizer] The function to customize copied values.
	     * @returns {Object} Returns `object`.
	     */
	    function copyObjectWith(source, props, object, customizer) {
	      object || (object = {});
	
	      var index = -1,
	          length = props.length;
	
	      while (++index < length) {
	        var key = props[index],
	            newValue = customizer ? customizer(object[key], source[key], key, object, source) : source[key];
	
	        assignValue(object, key, newValue);
	      }
	      return object;
	    }
	
	    /**
	     * Copies own symbol properties of `source` to `object`.
	     *
	     * @private
	     * @param {Object} source The object to copy symbols from.
	     * @param {Object} [object={}] The object to copy symbols to.
	     * @returns {Object} Returns `object`.
	     */
	    function copySymbols(source, object) {
	      return copyObject(source, getSymbols(source), object);
	    }
	
	    /**
	     * Creates a function like `_.groupBy`.
	     *
	     * @private
	     * @param {Function} setter The function to set accumulator values.
	     * @param {Function} [initializer] The accumulator object initializer.
	     * @returns {Function} Returns the new aggregator function.
	     */
	    function createAggregator(setter, initializer) {
	      return function(collection, iteratee) {
	        var func = isArray(collection) ? arrayAggregator : baseAggregator,
	            accumulator = initializer ? initializer() : {};
	
	        return func(collection, setter, getIteratee(iteratee), accumulator);
	      };
	    }
	
	    /**
	     * Creates a function like `_.assign`.
	     *
	     * @private
	     * @param {Function} assigner The function to assign values.
	     * @returns {Function} Returns the new assigner function.
	     */
	    function createAssigner(assigner) {
	      return rest(function(object, sources) {
	        var index = -1,
	            length = sources.length,
	            customizer = length > 1 ? sources[length - 1] : undefined,
	            guard = length > 2 ? sources[2] : undefined;
	
	        customizer = typeof customizer == 'function' ? (length--, customizer) : undefined;
	        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	          customizer = length < 3 ? undefined : customizer;
	          length = 1;
	        }
	        object = Object(object);
	        while (++index < length) {
	          var source = sources[index];
	          if (source) {
	            assigner(object, source, index, customizer);
	          }
	        }
	        return object;
	      });
	    }
	
	    /**
	     * Creates a `baseEach` or `baseEachRight` function.
	     *
	     * @private
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseEach(eachFunc, fromRight) {
	      return function(collection, iteratee) {
	        if (collection == null) {
	          return collection;
	        }
	        if (!isArrayLike(collection)) {
	          return eachFunc(collection, iteratee);
	        }
	        var length = collection.length,
	            index = fromRight ? length : -1,
	            iterable = Object(collection);
	
	        while ((fromRight ? index-- : ++index < length)) {
	          if (iteratee(iterable[index], index, iterable) === false) {
	            break;
	          }
	        }
	        return collection;
	      };
	    }
	
	    /**
	     * Creates a base function for methods like `_.forIn`.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseFor(fromRight) {
	      return function(object, iteratee, keysFunc) {
	        var index = -1,
	            iterable = Object(object),
	            props = keysFunc(object),
	            length = props.length;
	
	        while (length--) {
	          var key = props[fromRight ? length : ++index];
	          if (iteratee(iterable[key], key, iterable) === false) {
	            break;
	          }
	        }
	        return object;
	      };
	    }
	
	    /**
	     * Creates a function that wraps `func` to invoke it with the optional `this`
	     * binding of `thisArg`.
	     *
	     * @private
	     * @param {Function} func The function to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createBaseWrapper(func, bitmask, thisArg) {
	      var isBind = bitmask & BIND_FLAG,
	          Ctor = createCtorWrapper(func);
	
	      function wrapper() {
	        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	        return fn.apply(isBind ? thisArg : this, arguments);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a function like `_.lowerFirst`.
	     *
	     * @private
	     * @param {string} methodName The name of the `String` case method to use.
	     * @returns {Function} Returns the new function.
	     */
	    function createCaseFirst(methodName) {
	      return function(string) {
	        string = toString(string);
	
	        var strSymbols = reHasComplexSymbol.test(string) ? stringToArray(string) : undefined,
	            chr = strSymbols ? strSymbols[0] : string.charAt(0),
	            trailing = strSymbols ? strSymbols.slice(1).join('') : string.slice(1);
	
	        return chr[methodName]() + trailing;
	      };
	    }
	
	    /**
	     * Creates a function like `_.camelCase`.
	     *
	     * @private
	     * @param {Function} callback The function to combine each word.
	     * @returns {Function} Returns the new compounder function.
	     */
	    function createCompounder(callback) {
	      return function(string) {
	        return arrayReduce(words(deburr(string)), callback, '');
	      };
	    }
	
	    /**
	     * Creates a function that produces an instance of `Ctor` regardless of
	     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
	     *
	     * @private
	     * @param {Function} Ctor The constructor to wrap.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createCtorWrapper(Ctor) {
	      return function() {
	        // Use a `switch` statement to work with class constructors.
	        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
	        // for more details.
	        var args = arguments;
	        switch (args.length) {
	          case 0: return new Ctor;
	          case 1: return new Ctor(args[0]);
	          case 2: return new Ctor(args[0], args[1]);
	          case 3: return new Ctor(args[0], args[1], args[2]);
	          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
	          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
	          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
	          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
	        }
	        var thisBinding = baseCreate(Ctor.prototype),
	            result = Ctor.apply(thisBinding, args);
	
	        // Mimic the constructor's `return` behavior.
	        // See https://es5.github.io/#x13.2.2 for more details.
	        return isObject(result) ? result : thisBinding;
	      };
	    }
	
	    /**
	     * Creates a function that wraps `func` to enable currying.
	     *
	     * @private
	     * @param {Function} func The function to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {number} arity The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createCurryWrapper(func, bitmask, arity) {
	      var Ctor = createCtorWrapper(func);
	
	      function wrapper() {
	        var length = arguments.length,
	            index = length,
	            args = Array(length),
	            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func,
	            placeholder = lodash.placeholder || wrapper.placeholder;
	
	        while (index--) {
	          args[index] = arguments[index];
	        }
	        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
	          ? []
	          : replaceHolders(args, placeholder);
	
	        length -= holders.length;
	        return length < arity
	          ? createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, undefined, args, holders, undefined, undefined, arity - length)
	          : apply(fn, this, args);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a `_.flow` or `_.flowRight` function.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new flow function.
	     */
	    function createFlow(fromRight) {
	      return rest(function(funcs) {
	        funcs = baseFlatten(funcs);
	
	        var length = funcs.length,
	            index = length,
	            prereq = LodashWrapper.prototype.thru;
	
	        if (fromRight) {
	          funcs.reverse();
	        }
	        while (index--) {
	          var func = funcs[index];
	          if (typeof func != 'function') {
	            throw new TypeError(FUNC_ERROR_TEXT);
	          }
	          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
	            var wrapper = new LodashWrapper([], true);
	          }
	        }
	        index = wrapper ? index : length;
	        while (++index < length) {
	          func = funcs[index];
	
	          var funcName = getFuncName(func),
	              data = funcName == 'wrapper' ? getData(func) : undefined;
	
	          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
	            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
	          } else {
	            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
	          }
	        }
	        return function() {
	          var args = arguments,
	              value = args[0];
	
	          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
	            return wrapper.plant(value).value();
	          }
	          var index = 0,
	              result = length ? funcs[index].apply(this, args) : value;
	
	          while (++index < length) {
	            result = funcs[index].call(this, result);
	          }
	          return result;
	        };
	      });
	    }
	
	    /**
	     * Creates a function that wraps `func` to invoke it with optional `this`
	     * binding of `thisArg`, partial application, and currying.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
	     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
	      var isAry = bitmask & ARY_FLAG,
	          isBind = bitmask & BIND_FLAG,
	          isBindKey = bitmask & BIND_KEY_FLAG,
	          isCurry = bitmask & CURRY_FLAG,
	          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
	          isFlip = bitmask & FLIP_FLAG,
	          Ctor = isBindKey ? undefined : createCtorWrapper(func);
	
	      function wrapper() {
	        var length = arguments.length,
	            index = length,
	            args = Array(length);
	
	        while (index--) {
	          args[index] = arguments[index];
	        }
	        if (partials) {
	          args = composeArgs(args, partials, holders);
	        }
	        if (partialsRight) {
	          args = composeArgsRight(args, partialsRight, holdersRight);
	        }
	        if (isCurry || isCurryRight) {
	          var placeholder = lodash.placeholder || wrapper.placeholder,
	              argsHolders = replaceHolders(args, placeholder);
	
	          length -= argsHolders.length;
	          if (length < arity) {
	            return createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, thisArg, args, argsHolders, argPos, ary, arity - length);
	          }
	        }
	        var thisBinding = isBind ? thisArg : this,
	            fn = isBindKey ? thisBinding[func] : func;
	
	        if (argPos) {
	          args = reorder(args, argPos);
	        } else if (isFlip && args.length > 1) {
	          args.reverse();
	        }
	        if (isAry && ary < args.length) {
	          args.length = ary;
	        }
	        if (this && this !== root && this instanceof wrapper) {
	          fn = Ctor || createCtorWrapper(fn);
	        }
	        return fn.apply(thisBinding, args);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a function like `_.invertBy`.
	     *
	     * @private
	     * @param {Function} setter The function to set accumulator values.
	     * @param {Function} toIteratee The function to resolve iteratees.
	     * @returns {Function} Returns the new inverter function.
	     */
	    function createInverter(setter, toIteratee) {
	      return function(object, iteratee) {
	        return baseInverter(object, setter, toIteratee(iteratee), {});
	      };
	    }
	
	    /**
	     * Creates a function like `_.over`.
	     *
	     * @private
	     * @param {Function} arrayFunc The function to iterate over iteratees.
	     * @returns {Function} Returns the new invoker function.
	     */
	    function createOver(arrayFunc) {
	      return rest(function(iteratees) {
	        iteratees = arrayMap(baseFlatten(iteratees), getIteratee());
	        return rest(function(args) {
	          var thisArg = this;
	          return arrayFunc(iteratees, function(iteratee) {
	            return apply(iteratee, thisArg, args);
	          });
	        });
	      });
	    }
	
	    /**
	     * Creates the padding for `string` based on `length`. The `chars` string
	     * is truncated if the number of characters exceeds `length`.
	     *
	     * @private
	     * @param {string} string The string to create padding for.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padding for `string`.
	     */
	    function createPadding(string, length, chars) {
	      length = toInteger(length);
	
	      var strLength = stringSize(string);
	      if (!length || strLength >= length) {
	        return '';
	      }
	      var padLength = length - strLength;
	      chars = chars === undefined ? ' ' : (chars + '');
	
	      var result = repeat(chars, nativeCeil(padLength / stringSize(chars)));
	      return reHasComplexSymbol.test(chars)
	        ? stringToArray(result).slice(0, padLength).join('')
	        : result.slice(0, padLength);
	    }
	
	    /**
	     * Creates a function that wraps `func` to invoke it with the optional `this`
	     * binding of `thisArg` and the `partials` prepended to those provided to
	     * the wrapper.
	     *
	     * @private
	     * @param {Function} func The function to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {Array} partials The arguments to prepend to those provided to the new function.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createPartialWrapper(func, bitmask, thisArg, partials) {
	      var isBind = bitmask & BIND_FLAG,
	          Ctor = createCtorWrapper(func);
	
	      function wrapper() {
	        var argsIndex = -1,
	            argsLength = arguments.length,
	            leftIndex = -1,
	            leftLength = partials.length,
	            args = Array(leftLength + argsLength),
	            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	
	        while (++leftIndex < leftLength) {
	          args[leftIndex] = partials[leftIndex];
	        }
	        while (argsLength--) {
	          args[leftIndex++] = arguments[++argsIndex];
	        }
	        return apply(fn, isBind ? thisArg : this, args);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a `_.range` or `_.rangeRight` function.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new range function.
	     */
	    function createRange(fromRight) {
	      return function(start, end, step) {
	        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
	          end = step = undefined;
	        }
	        // Ensure the sign of `-0` is preserved.
	        start = toNumber(start);
	        start = start === start ? start : 0;
	        if (end === undefined) {
	          end = start;
	          start = 0;
	        } else {
	          end = toNumber(end) || 0;
	        }
	        step = step === undefined ? (start < end ? 1 : -1) : (toNumber(step) || 0);
	        return baseRange(start, end, step, fromRight);
	      };
	    }
	
	    /**
	     * Creates a function that wraps `func` to continue currying.
	     *
	     * @private
	     * @param {Function} func The function to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {Function} wrapFunc The function to create the `func` wrapper.
	     * @param {*} placeholder The placeholder to replace.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createRecurryWrapper(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
	      var isCurry = bitmask & CURRY_FLAG,
	          newArgPos = argPos ? copyArray(argPos) : undefined,
	          newsHolders = isCurry ? holders : undefined,
	          newHoldersRight = isCurry ? undefined : holders,
	          newPartials = isCurry ? partials : undefined,
	          newPartialsRight = isCurry ? undefined : partials;
	
	      bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
	      bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
	
	      if (!(bitmask & CURRY_BOUND_FLAG)) {
	        bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
	      }
	      var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, arity],
	          result = wrapFunc.apply(undefined, newData);
	
	      if (isLaziable(func)) {
	        setData(result, newData);
	      }
	      result.placeholder = placeholder;
	      return result;
	    }
	
	    /**
	     * Creates a function like `_.round`.
	     *
	     * @private
	     * @param {string} methodName The name of the `Math` method to use when rounding.
	     * @returns {Function} Returns the new round function.
	     */
	    function createRound(methodName) {
	      var func = Math[methodName];
	      return function(number, precision) {
	        number = toNumber(number);
	        precision = toInteger(precision);
	        if (precision) {
	          // Shift with exponential notation to avoid floating-point issues.
	          // See [MDN](https://mdn.io/round#Examples) for more details.
	          var pair = (toString(number) + 'e').split('e'),
	              value = func(pair[0] + 'e' + (+pair[1] + precision));
	
	          pair = (toString(value) + 'e').split('e');
	          return +(pair[0] + 'e' + (+pair[1] - precision));
	        }
	        return func(number);
	      };
	    }
	
	    /**
	     * Creates a set of `values`.
	     *
	     * @private
	     * @param {Array} values The values to add to the set.
	     * @returns {Object} Returns the new set.
	     */
	    var createSet = !(Set && new Set([1, 2]).size === 2) ? noop : function(values) {
	      return new Set(values);
	    };
	
	    /**
	     * Creates a function that either curries or invokes `func` with optional
	     * `this` binding and partially applied arguments.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags.
	     *  The bitmask may be composed of the following flags:
	     *     1 - `_.bind`
	     *     2 - `_.bindKey`
	     *     4 - `_.curry` or `_.curryRight` of a bound function
	     *     8 - `_.curry`
	     *    16 - `_.curryRight`
	     *    32 - `_.partial`
	     *    64 - `_.partialRight`
	     *   128 - `_.rearg`
	     *   256 - `_.ary`
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to be partially applied.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
	      var isBindKey = bitmask & BIND_KEY_FLAG;
	      if (!isBindKey && typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var length = partials ? partials.length : 0;
	      if (!length) {
	        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
	        partials = holders = undefined;
	      }
	      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
	      arity = arity === undefined ? arity : toInteger(arity);
	      length -= holders ? holders.length : 0;
	
	      if (bitmask & PARTIAL_RIGHT_FLAG) {
	        var partialsRight = partials,
	            holdersRight = holders;
	
	        partials = holders = undefined;
	      }
	      var data = isBindKey ? undefined : getData(func),
	          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];
	
	      if (data) {
	        mergeData(newData, data);
	      }
	      func = newData[0];
	      bitmask = newData[1];
	      thisArg = newData[2];
	      partials = newData[3];
	      holders = newData[4];
	      arity = newData[9] = newData[9] == null
	        ? (isBindKey ? 0 : func.length)
	        : nativeMax(newData[9] - length, 0);
	
	      if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
	        bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
	      }
	      if (!bitmask || bitmask == BIND_FLAG) {
	        var result = createBaseWrapper(func, bitmask, thisArg);
	      } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
	        result = createCurryWrapper(func, bitmask, arity);
	      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
	        result = createPartialWrapper(func, bitmask, thisArg, partials);
	      } else {
	        result = createHybridWrapper.apply(undefined, newData);
	      }
	      var setter = data ? baseSetData : setData;
	      return setter(result, newData);
	    }
	
	    /**
	     * A specialized version of `baseIsEqualDeep` for arrays with support for
	     * partial deep comparisons.
	     *
	     * @private
	     * @param {Array} array The array to compare.
	     * @param {Array} other The other array to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	     * @param {Object} [stack] Tracks traversed `array` and `other` objects.
	     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	     */
	    function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
	      var index = -1,
	          isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	          isUnordered = bitmask & UNORDERED_COMPARE_FLAG,
	          arrLength = array.length,
	          othLength = other.length;
	
	      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(array);
	      if (stacked) {
	        return stacked == other;
	      }
	      var result = true;
	      stack.set(array, other);
	
	      // Ignore non-index properties.
	      while (++index < arrLength) {
	        var arrValue = array[index],
	            othValue = other[index];
	
	        if (customizer) {
	          var compared = isPartial
	            ? customizer(othValue, arrValue, index, other, array, stack)
	            : customizer(arrValue, othValue, index, array, other, stack);
	        }
	        if (compared !== undefined) {
	          if (compared) {
	            continue;
	          }
	          result = false;
	          break;
	        }
	        // Recursively compare arrays (susceptible to call stack limits).
	        if (isUnordered) {
	          if (!arraySome(other, function(othValue) {
	                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack);
	              })) {
	            result = false;
	            break;
	          }
	        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
	          result = false;
	          break;
	        }
	      }
	      stack['delete'](array);
	      return result;
	    }
	
	    /**
	     * A specialized version of `baseIsEqualDeep` for comparing objects of
	     * the same `toStringTag`.
	     *
	     * **Note:** This function only supports comparing values with tags of
	     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {string} tag The `toStringTag` of the objects to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function equalByTag(object, other, tag, equalFunc, customizer, bitmask) {
	      switch (tag) {
	        case arrayBufferTag:
	          if ((object.byteLength != other.byteLength) ||
	              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	            return false;
	          }
	          return true;
	
	        case boolTag:
	        case dateTag:
	          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	          return +object == +other;
	
	        case errorTag:
	          return object.name == other.name && object.message == other.message;
	
	        case numberTag:
	          // Treat `NaN` vs. `NaN` as equal.
	          return (object != +object) ? other != +other : object == +other;
	
	        case regexpTag:
	        case stringTag:
	          // Coerce regexes to strings and treat strings primitives and string
	          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	          return object == (other + '');
	
	        case mapTag:
	          var convert = mapToArray;
	
	        case setTag:
	          var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	          convert || (convert = setToArray);
	
	          // Recursively compare objects (susceptible to call stack limits).
	          return (isPartial || object.size == other.size) &&
	            equalFunc(convert(object), convert(other), customizer, bitmask | UNORDERED_COMPARE_FLAG);
	
	        case symbolTag:
	          return !!Symbol && (symbolValueOf.call(object) == symbolValueOf.call(other));
	      }
	      return false;
	    }
	
	    /**
	     * A specialized version of `baseIsEqualDeep` for objects with support for
	     * partial deep comparisons.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	          objProps = keys(object),
	          objLength = objProps.length,
	          othProps = keys(other),
	          othLength = othProps.length;
	
	      if (objLength != othLength && !isPartial) {
	        return false;
	      }
	      var index = objLength;
	      while (index--) {
	        var key = objProps[index];
	        if (!(isPartial ? key in other : baseHas(other, key))) {
	          return false;
	        }
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      var result = true;
	      stack.set(object, other);
	
	      var skipCtor = isPartial;
	      while (++index < objLength) {
	        key = objProps[index];
	        var objValue = object[key],
	            othValue = other[key];
	
	        if (customizer) {
	          var compared = isPartial
	            ? customizer(othValue, objValue, key, other, object, stack)
	            : customizer(objValue, othValue, key, object, other, stack);
	        }
	        // Recursively compare objects (susceptible to call stack limits).
	        if (!(compared === undefined
	              ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
	              : compared
	            )) {
	          result = false;
	          break;
	        }
	        skipCtor || (skipCtor = key == 'constructor');
	      }
	      if (result && !skipCtor) {
	        var objCtor = object.constructor,
	            othCtor = other.constructor;
	
	        // Non `Object` object instances with different constructors are not equal.
	        if (objCtor != othCtor &&
	            ('constructor' in object && 'constructor' in other) &&
	            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	          result = false;
	        }
	      }
	      stack['delete'](object);
	      return result;
	    }
	
	    /**
	     * Gets metadata for `func`.
	     *
	     * @private
	     * @param {Function} func The function to query.
	     * @returns {*} Returns the metadata for `func`.
	     */
	    var getData = !metaMap ? noop : function(func) {
	      return metaMap.get(func);
	    };
	
	    /**
	     * Gets the name of `func`.
	     *
	     * @private
	     * @param {Function} func The function to query.
	     * @returns {string} Returns the function name.
	     */
	    function getFuncName(func) {
	      var result = (func.name + ''),
	          array = realNames[result],
	          length = hasOwnProperty.call(realNames, result) ? array.length : 0;
	
	      while (length--) {
	        var data = array[length],
	            otherFunc = data.func;
	        if (otherFunc == null || otherFunc == func) {
	          return data.name;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Gets the appropriate "iteratee" function. If the `_.iteratee` method is
	     * customized this function returns the custom method, otherwise it returns
	     * `baseIteratee`. If arguments are provided the chosen function is invoked
	     * with them and its result is returned.
	     *
	     * @private
	     * @param {*} [value] The value to convert to an iteratee.
	     * @param {number} [arity] The arity of the created iteratee.
	     * @returns {Function} Returns the chosen function or its result.
	     */
	    function getIteratee() {
	      var result = lodash.iteratee || iteratee;
	      result = result === iteratee ? baseIteratee : result;
	      return arguments.length ? result(arguments[0], arguments[1]) : result;
	    }
	
	    /**
	     * Gets the "length" property value of `object`.
	     *
	     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	     * that affects Safari on at least iOS 8.1-8.3 ARM64.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {*} Returns the "length" value.
	     */
	    var getLength = baseProperty('length');
	
	    /**
	     * Gets the property names, values, and compare flags of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the match data of `object`.
	     */
	    function getMatchData(object) {
	      var result = toPairs(object),
	          length = result.length;
	
	      while (length--) {
	        result[length][2] = isStrictComparable(result[length][1]);
	      }
	      return result;
	    }
	
	    /**
	     * Gets the native function at `key` of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {string} key The key of the method to get.
	     * @returns {*} Returns the function if it's native, else `undefined`.
	     */
	    function getNative(object, key) {
	      var value = object == null ? undefined : object[key];
	      return isNative(value) ? value : undefined;
	    }
	
	    /**
	     * Creates an array of the own symbol properties of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of symbols.
	     */
	    var getSymbols = getOwnPropertySymbols || function() {
	      return [];
	    };
	
	    /**
	     * Gets the `toStringTag` of `value`.
	     *
	     * @private
	     * @param {*} value The value to query.
	     * @returns {string} Returns the `toStringTag`.
	     */
	    function getTag(value) {
	      return objectToString.call(value);
	    }
	
	    // Fallback for IE 11 providing `toStringTag` values for maps and sets.
	    if ((Map && getTag(new Map) != mapTag) || (Set && getTag(new Set) != setTag)) {
	      getTag = function(value) {
	        var result = objectToString.call(value),
	            Ctor = result == objectTag ? value.constructor : null,
	            ctorString = typeof Ctor == 'function' ? funcToString.call(Ctor) : '';
	
	        if (ctorString) {
	          if (ctorString == mapCtorString) {
	            return mapTag;
	          }
	          if (ctorString == setCtorString) {
	            return setTag;
	          }
	        }
	        return result;
	      };
	    }
	
	    /**
	     * Gets the view, applying any `transforms` to the `start` and `end` positions.
	     *
	     * @private
	     * @param {number} start The start of the view.
	     * @param {number} end The end of the view.
	     * @param {Array} transforms The transformations to apply to the view.
	     * @returns {Object} Returns an object containing the `start` and `end`
	     *  positions of the view.
	     */
	    function getView(start, end, transforms) {
	      var index = -1,
	          length = transforms.length;
	
	      while (++index < length) {
	        var data = transforms[index],
	            size = data.size;
	
	        switch (data.type) {
	          case 'drop':      start += size; break;
	          case 'dropRight': end -= size; break;
	          case 'take':      end = nativeMin(end, start + size); break;
	          case 'takeRight': start = nativeMax(start, end - size); break;
	        }
	      }
	      return { 'start': start, 'end': end };
	    }
	
	    /**
	     * Checks if `path` exists on `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path to check.
	     * @param {Function} hasFunc The function to check properties.
	     * @returns {boolean} Returns `true` if `path` exists, else `false`.
	     */
	    function hasPath(object, path, hasFunc) {
	      if (object == null) {
	        return false;
	      }
	      var result = hasFunc(object, path);
	      if (!result && !isKey(path)) {
	        path = baseToPath(path);
	        object = parent(object, path);
	        if (object != null) {
	          path = last(path);
	          result = hasFunc(object, path);
	        }
	      }
	      var length = object ? object.length : undefined;
	      return result || (
	        !!length && isLength(length) && isIndex(path, length) &&
	        (isArray(object) || isString(object) || isArguments(object))
	      );
	    }
	
	    /**
	     * Initializes an array clone.
	     *
	     * @private
	     * @param {Array} array The array to clone.
	     * @returns {Array} Returns the initialized clone.
	     */
	    function initCloneArray(array) {
	      var length = array.length,
	          result = array.constructor(length);
	
	      // Add properties assigned by `RegExp#exec`.
	      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	        result.index = array.index;
	        result.input = array.input;
	      }
	      return result;
	    }
	
	    /**
	     * Initializes an object clone.
	     *
	     * @private
	     * @param {Object} object The object to clone.
	     * @returns {Object} Returns the initialized clone.
	     */
	    function initCloneObject(object) {
	      if (isPrototype(object)) {
	        return {};
	      }
	      var Ctor = object.constructor;
	      return baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
	    }
	
	    /**
	     * Initializes an object clone based on its `toStringTag`.
	     *
	     * **Note:** This function only supports cloning values with tags of
	     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	     *
	     * @private
	     * @param {Object} object The object to clone.
	     * @param {string} tag The `toStringTag` of the object to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @returns {Object} Returns the initialized clone.
	     */
	    function initCloneByTag(object, tag, isDeep) {
	      var Ctor = object.constructor;
	      switch (tag) {
	        case arrayBufferTag:
	          return cloneBuffer(object);
	
	        case boolTag:
	        case dateTag:
	          return new Ctor(+object);
	
	        case float32Tag: case float64Tag:
	        case int8Tag: case int16Tag: case int32Tag:
	        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	          return cloneTypedArray(object, isDeep);
	
	        case mapTag:
	          return cloneMap(object);
	
	        case numberTag:
	        case stringTag:
	          return new Ctor(object);
	
	        case regexpTag:
	          return cloneRegExp(object);
	
	        case setTag:
	          return cloneSet(object);
	
	        case symbolTag:
	          return cloneSymbol(object);
	      }
	    }
	
	    /**
	     * Creates an array of index keys for `object` values of arrays,
	     * `arguments` objects, and strings, otherwise `null` is returned.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array|null} Returns index keys, else `null`.
	     */
	    function indexKeys(object) {
	      var length = object ? object.length : undefined;
	      if (isLength(length) &&
	          (isArray(object) || isString(object) || isArguments(object))) {
	        return baseTimes(length, String);
	      }
	      return null;
	    }
	
	    /**
	     * Checks if the provided arguments are from an iteratee call.
	     *
	     * @private
	     * @param {*} value The potential iteratee value argument.
	     * @param {*} index The potential iteratee index or key argument.
	     * @param {*} object The potential iteratee object argument.
	     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	     */
	    function isIterateeCall(value, index, object) {
	      if (!isObject(object)) {
	        return false;
	      }
	      var type = typeof index;
	      if (type == 'number'
	          ? (isArrayLike(object) && isIndex(index, object.length))
	          : (type == 'string' && index in object)) {
	        return eq(object[index], value);
	      }
	      return false;
	    }
	
	    /**
	     * Checks if `value` is a property name and not a property path.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @param {Object} [object] The object to query keys on.
	     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	     */
	    function isKey(value, object) {
	      if (typeof value == 'number') {
	        return true;
	      }
	      return !isArray(value) &&
	        (reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	          (object != null && value in Object(object)));
	    }
	
	    /**
	     * Checks if `value` is suitable for use as unique object key.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	     */
	    function isKeyable(value) {
	      var type = typeof value;
	      return type == 'number' || type == 'boolean' ||
	        (type == 'string' && value !== '__proto__') || value == null;
	    }
	
	    /**
	     * Checks if `func` has a lazy counterpart.
	     *
	     * @private
	     * @param {Function} func The function to check.
	     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
	     */
	    function isLaziable(func) {
	      var funcName = getFuncName(func),
	          other = lodash[funcName];
	
	      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
	        return false;
	      }
	      if (func === other) {
	        return true;
	      }
	      var data = getData(other);
	      return !!data && func === data[0];
	    }
	
	    /**
	     * Checks if `value` is likely a prototype object.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	     */
	    function isPrototype(value) {
	      var Ctor = value && value.constructor,
	          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	
	      return value === proto;
	    }
	
	    /**
	     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` if suitable for strict
	     *  equality comparisons, else `false`.
	     */
	    function isStrictComparable(value) {
	      return value === value && !isObject(value);
	    }
	
	    /**
	     * Merges the function metadata of `source` into `data`.
	     *
	     * Merging metadata reduces the number of wrappers used to invoke a function.
	     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
	     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
	     * modify function arguments, making the order in which they are executed important,
	     * preventing the merging of metadata. However, we make an exception for a safe
	     * combined case where curried functions have `_.ary` and or `_.rearg` applied.
	     *
	     * @private
	     * @param {Array} data The destination metadata.
	     * @param {Array} source The source metadata.
	     * @returns {Array} Returns `data`.
	     */
	    function mergeData(data, source) {
	      var bitmask = data[1],
	          srcBitmask = source[1],
	          newBitmask = bitmask | srcBitmask,
	          isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);
	
	      var isCombo =
	        (srcBitmask == ARY_FLAG && (bitmask == CURRY_FLAG)) ||
	        (srcBitmask == ARY_FLAG && (bitmask == REARG_FLAG) && (data[7].length <= source[8])) ||
	        (srcBitmask == (ARY_FLAG | REARG_FLAG) && (source[7].length <= source[8]) && (bitmask == CURRY_FLAG));
	
	      // Exit early if metadata can't be merged.
	      if (!(isCommon || isCombo)) {
	        return data;
	      }
	      // Use source `thisArg` if available.
	      if (srcBitmask & BIND_FLAG) {
	        data[2] = source[2];
	        // Set when currying a bound function.
	        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
	      }
	      // Compose partial arguments.
	      var value = source[3];
	      if (value) {
	        var partials = data[3];
	        data[3] = partials ? composeArgs(partials, value, source[4]) : copyArray(value);
	        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : copyArray(source[4]);
	      }
	      // Compose partial right arguments.
	      value = source[5];
	      if (value) {
	        partials = data[5];
	        data[5] = partials ? composeArgsRight(partials, value, source[6]) : copyArray(value);
	        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : copyArray(source[6]);
	      }
	      // Use source `argPos` if available.
	      value = source[7];
	      if (value) {
	        data[7] = copyArray(value);
	      }
	      // Use source `ary` if it's smaller.
	      if (srcBitmask & ARY_FLAG) {
	        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
	      }
	      // Use source `arity` if one is not provided.
	      if (data[9] == null) {
	        data[9] = source[9];
	      }
	      // Use source `func` and merge bitmasks.
	      data[0] = source[0];
	      data[1] = newBitmask;
	
	      return data;
	    }
	
	    /**
	     * Used by `_.defaultsDeep` to customize its `_.merge` use.
	     *
	     * @private
	     * @param {*} objValue The destination value.
	     * @param {*} srcValue The source value.
	     * @param {string} key The key of the property to merge.
	     * @param {Object} object The parent object of `objValue`.
	     * @param {Object} source The parent object of `srcValue`.
	     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
	     * @returns {*} Returns the value to assign.
	     */
	    function mergeDefaults(objValue, srcValue, key, object, source, stack) {
	      if (isObject(objValue) && isObject(srcValue)) {
	        stack.set(srcValue, objValue);
	        baseMerge(objValue, srcValue, undefined, mergeDefaults, stack);
	      }
	      return objValue;
	    }
	
	    /**
	     * Gets the parent value at `path` of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array} path The path to get the parent value of.
	     * @returns {*} Returns the parent value.
	     */
	    function parent(object, path) {
	      return path.length == 1 ? object : get(object, baseSlice(path, 0, -1));
	    }
	
	    /**
	     * Reorder `array` according to the specified indexes where the element at
	     * the first index is assigned as the first element, the element at
	     * the second index is assigned as the second element, and so on.
	     *
	     * @private
	     * @param {Array} array The array to reorder.
	     * @param {Array} indexes The arranged array indexes.
	     * @returns {Array} Returns `array`.
	     */
	    function reorder(array, indexes) {
	      var arrLength = array.length,
	          length = nativeMin(indexes.length, arrLength),
	          oldArray = copyArray(array);
	
	      while (length--) {
	        var index = indexes[length];
	        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
	      }
	      return array;
	    }
	
	    /**
	     * Sets metadata for `func`.
	     *
	     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
	     * period of time, it will trip its breaker and transition to an identity function
	     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
	     * for more details.
	     *
	     * @private
	     * @param {Function} func The function to associate metadata with.
	     * @param {*} data The metadata.
	     * @returns {Function} Returns `func`.
	     */
	    var setData = (function() {
	      var count = 0,
	          lastCalled = 0;
	
	      return function(key, value) {
	        var stamp = now(),
	            remaining = HOT_SPAN - (stamp - lastCalled);
	
	        lastCalled = stamp;
	        if (remaining > 0) {
	          if (++count >= HOT_COUNT) {
	            return key;
	          }
	        } else {
	          count = 0;
	        }
	        return baseSetData(key, value);
	      };
	    }());
	
	    /**
	     * Converts `string` to a property path array.
	     *
	     * @private
	     * @param {string} string The string to convert.
	     * @returns {Array} Returns the property path array.
	     */
	    function stringToPath(string) {
	      var result = [];
	      toString(string).replace(rePropName, function(match, number, quote, string) {
	        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	      });
	      return result;
	    }
	
	    /**
	     * Converts `value` to an array-like object if it's not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Array} Returns the array-like object.
	     */
	    function toArrayLikeObject(value) {
	      return isArrayLikeObject(value) ? value : [];
	    }
	
	    /**
	     * Converts `value` to a function if it's not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Function} Returns the function.
	     */
	    function toFunction(value) {
	      return typeof value == 'function' ? value : identity;
	    }
	
	    /**
	     * Creates a clone of `wrapper`.
	     *
	     * @private
	     * @param {Object} wrapper The wrapper to clone.
	     * @returns {Object} Returns the cloned wrapper.
	     */
	    function wrapperClone(wrapper) {
	      if (wrapper instanceof LazyWrapper) {
	        return wrapper.clone();
	      }
	      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
	      result.__actions__ = copyArray(wrapper.__actions__);
	      result.__index__  = wrapper.__index__;
	      result.__values__ = wrapper.__values__;
	      return result;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates an array of elements split into groups the length of `size`.
	     * If `array` can't be split evenly, the final chunk will be the remaining
	     * elements.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to process.
	     * @param {number} [size=0] The length of each chunk.
	     * @returns {Array} Returns the new array containing chunks.
	     * @example
	     *
	     * _.chunk(['a', 'b', 'c', 'd'], 2);
	     * // => [['a', 'b'], ['c', 'd']]
	     *
	     * _.chunk(['a', 'b', 'c', 'd'], 3);
	     * // => [['a', 'b', 'c'], ['d']]
	     */
	    function chunk(array, size) {
	      size = nativeMax(toInteger(size), 0);
	
	      var length = array ? array.length : 0;
	      if (!length || size < 1) {
	        return [];
	      }
	      var index = 0,
	          resIndex = -1,
	          result = Array(nativeCeil(length / size));
	
	      while (index < length) {
	        result[++resIndex] = baseSlice(array, index, (index += size));
	      }
	      return result;
	    }
	
	    /**
	     * Creates an array with all falsey values removed. The values `false`, `null`,
	     * `0`, `""`, `undefined`, and `NaN` are falsey.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to compact.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.compact([0, 1, false, 2, '', 3]);
	     * // => [1, 2, 3]
	     */
	    function compact(array) {
	      var index = -1,
	          length = array ? array.length : 0,
	          resIndex = -1,
	          result = [];
	
	      while (++index < length) {
	        var value = array[index];
	        if (value) {
	          result[++resIndex] = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Creates a new array concatenating `array` with any additional arrays
	     * and/or values.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to concatenate.
	     * @param {...*} [values] The values to concatenate.
	     * @returns {Array} Returns the new concatenated array.
	     * @example
	     *
	     * var array = [1];
	     * var other = _.concat(array, 2, [3], [[4]]);
	     *
	     * console.log(other);
	     * // => [1, 2, 3, [4]]
	     *
	     * console.log(array);
	     * // => [1]
	     */
	    var concat = rest(function(array, values) {
	      if (!isArray(array)) {
	        array = array == null ? [] : [Object(array)];
	      }
	      values = baseFlatten(values);
	      return arrayConcat(array, values);
	    });
	
	    /**
	     * Creates an array of unique `array` values not included in the other
	     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {...Array} [values] The values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.difference([3, 2, 1], [4, 2]);
	     * // => [3, 1]
	     */
	    var difference = rest(function(array, values) {
	      return isArrayLikeObject(array)
	        ? baseDifference(array, baseFlatten(values, false, true))
	        : [];
	    });
	
	    /**
	     * This method is like `_.difference` except that it accepts `iteratee` which
	     * is invoked for each element of `array` and `values` to generate the criterion
	     * by which uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {...Array} [values] The values to exclude.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
	     * // => [3.1, 1.3]
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
	     * // => [{ 'x': 2 }]
	     */
	    var differenceBy = rest(function(array, values) {
	      var iteratee = last(values);
	      if (isArrayLikeObject(iteratee)) {
	        iteratee = undefined;
	      }
	      return isArrayLikeObject(array)
	        ? baseDifference(array, baseFlatten(values, false, true), getIteratee(iteratee))
	        : [];
	    });
	
	    /**
	     * This method is like `_.difference` except that it accepts `comparator`
	     * which is invoked to compare elements of `array` to `values`. The comparator
	     * is invoked with two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {...Array} [values] The values to exclude.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	     *
	     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
	     * // => [{ 'x': 2, 'y': 1 }]
	     */
	    var differenceWith = rest(function(array, values) {
	      var comparator = last(values);
	      if (isArrayLikeObject(comparator)) {
	        comparator = undefined;
	      }
	      return isArrayLikeObject(array)
	        ? baseDifference(array, baseFlatten(values, false, true), undefined, comparator)
	        : [];
	    });
	
	    /**
	     * Creates a slice of `array` with `n` elements dropped from the beginning.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to drop.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.drop([1, 2, 3]);
	     * // => [2, 3]
	     *
	     * _.drop([1, 2, 3], 2);
	     * // => [3]
	     *
	     * _.drop([1, 2, 3], 5);
	     * // => []
	     *
	     * _.drop([1, 2, 3], 0);
	     * // => [1, 2, 3]
	     */
	    function drop(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      n = (guard || n === undefined) ? 1 : toInteger(n);
	      return baseSlice(array, n < 0 ? 0 : n, length);
	    }
	
	    /**
	     * Creates a slice of `array` with `n` elements dropped from the end.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to drop.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.dropRight([1, 2, 3]);
	     * // => [1, 2]
	     *
	     * _.dropRight([1, 2, 3], 2);
	     * // => [1]
	     *
	     * _.dropRight([1, 2, 3], 5);
	     * // => []
	     *
	     * _.dropRight([1, 2, 3], 0);
	     * // => [1, 2, 3]
	     */
	    function dropRight(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      n = (guard || n === undefined) ? 1 : toInteger(n);
	      n = length - n;
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }
	
	    /**
	     * Creates a slice of `array` excluding elements dropped from the end.
	     * Elements are dropped until `predicate` returns falsey. The predicate is
	     * invoked with three arguments: (value, index, array).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * _.dropRightWhile(users, function(o) { return !o.active; });
	     * // => objects for ['barney']
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
	     * // => objects for ['barney', 'fred']
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.dropRightWhile(users, ['active', false]);
	     * // => objects for ['barney']
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.dropRightWhile(users, 'active');
	     * // => objects for ['barney', 'fred', 'pebbles']
	     */
	    function dropRightWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3), true, true)
	        : [];
	    }
	
	    /**
	     * Creates a slice of `array` excluding elements dropped from the beginning.
	     * Elements are dropped until `predicate` returns falsey. The predicate is
	     * invoked with three arguments: (value, index, array).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * _.dropWhile(users, function(o) { return !o.active; });
	     * // => objects for ['pebbles']
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.dropWhile(users, { 'user': 'barney', 'active': false });
	     * // => objects for ['fred', 'pebbles']
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.dropWhile(users, ['active', false]);
	     * // => objects for ['pebbles']
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.dropWhile(users, 'active');
	     * // => objects for ['barney', 'fred', 'pebbles']
	     */
	    function dropWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3), true)
	        : [];
	    }
	
	    /**
	     * Fills elements of `array` with `value` from `start` up to, but not
	     * including, `end`.
	     *
	     * **Note:** This method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to fill.
	     * @param {*} value The value to fill `array` with.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _.fill(array, 'a');
	     * console.log(array);
	     * // => ['a', 'a', 'a']
	     *
	     * _.fill(Array(3), 2);
	     * // => [2, 2, 2]
	     *
	     * _.fill([4, 6, 8, 10], '*', 1, 3);
	     * // => [4, '*', '*', 10]
	     */
	    function fill(array, value, start, end) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
	        start = 0;
	        end = length;
	      }
	      return baseFill(array, value, start, end);
	    }
	
	    /**
	     * This method is like `_.find` except that it returns the index of the first
	     * element `predicate` returns truthy for instead of the element itself.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * _.findIndex(users, function(o) { return o.user == 'barney'; });
	     * // => 0
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.findIndex(users, { 'user': 'fred', 'active': false });
	     * // => 1
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.findIndex(users, ['active', false]);
	     * // => 0
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.findIndex(users, 'active');
	     * // => 2
	     */
	    function findIndex(array, predicate) {
	      return (array && array.length)
	        ? baseFindIndex(array, getIteratee(predicate, 3))
	        : -1;
	    }
	
	    /**
	     * This method is like `_.findIndex` except that it iterates over elements
	     * of `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
	     * // => 2
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
	     * // => 0
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.findLastIndex(users, ['active', false]);
	     * // => 2
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.findLastIndex(users, 'active');
	     * // => 0
	     */
	    function findLastIndex(array, predicate) {
	      return (array && array.length)
	        ? baseFindIndex(array, getIteratee(predicate, 3), true)
	        : -1;
	    }
	
	    /**
	     * Flattens `array` a single level.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to flatten.
	     * @returns {Array} Returns the new flattened array.
	     * @example
	     *
	     * _.flatten([1, [2, 3, [4]]]);
	     * // => [1, 2, 3, [4]]
	     */
	    function flatten(array) {
	      var length = array ? array.length : 0;
	      return length ? baseFlatten(array) : [];
	    }
	
	    /**
	     * This method is like `_.flatten` except that it recursively flattens `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to recursively flatten.
	     * @returns {Array} Returns the new flattened array.
	     * @example
	     *
	     * _.flattenDeep([1, [2, 3, [4]]]);
	     * // => [1, 2, 3, 4]
	     */
	    function flattenDeep(array) {
	      var length = array ? array.length : 0;
	      return length ? baseFlatten(array, true) : [];
	    }
	
	    /**
	     * The inverse of `_.toPairs`; this method returns an object composed
	     * from key-value `pairs`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} pairs The key-value pairs.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * _.fromPairs([['fred', 30], ['barney', 40]]);
	     * // => { 'fred': 30, 'barney': 40 }
	     */
	    function fromPairs(pairs) {
	      var index = -1,
	          length = pairs ? pairs.length : 0,
	          result = {};
	
	      while (++index < length) {
	        var pair = pairs[index];
	        result[pair[0]] = pair[1];
	      }
	      return result;
	    }
	
	    /**
	     * Gets the first element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @alias first
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {*} Returns the first element of `array`.
	     * @example
	     *
	     * _.head([1, 2, 3]);
	     * // => 1
	     *
	     * _.head([]);
	     * // => undefined
	     */
	    function head(array) {
	      return array ? array[0] : undefined;
	    }
	
	    /**
	     * Gets the index at which the first occurrence of `value` is found in `array`
	     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons. If `fromIndex` is negative, it's used as the offset
	     * from the end of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {number} [fromIndex=0] The index to search from.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.indexOf([1, 2, 1, 2], 2);
	     * // => 1
	     *
	     * // Search from the `fromIndex`.
	     * _.indexOf([1, 2, 1, 2], 2, 2);
	     * // => 3
	     */
	    function indexOf(array, value, fromIndex) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return -1;
	      }
	      fromIndex = toInteger(fromIndex);
	      if (fromIndex < 0) {
	        fromIndex = nativeMax(length + fromIndex, 0);
	      }
	      return baseIndexOf(array, value, fromIndex);
	    }
	
	    /**
	     * Gets all but the last element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.initial([1, 2, 3]);
	     * // => [1, 2]
	     */
	    function initial(array) {
	      return dropRight(array, 1);
	    }
	
	    /**
	     * Creates an array of unique values that are included in all of the provided
	     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of shared values.
	     * @example
	     *
	     * _.intersection([2, 1], [4, 2], [1, 2]);
	     * // => [2]
	     */
	    var intersection = rest(function(arrays) {
	      var mapped = arrayMap(arrays, toArrayLikeObject);
	      return (mapped.length && mapped[0] === arrays[0])
	        ? baseIntersection(mapped)
	        : [];
	    });
	
	    /**
	     * This method is like `_.intersection` except that it accepts `iteratee`
	     * which is invoked for each element of each `arrays` to generate the criterion
	     * by which uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new array of shared values.
	     * @example
	     *
	     * _.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
	     * // => [2.1]
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }]
	     */
	    var intersectionBy = rest(function(arrays) {
	      var iteratee = last(arrays),
	          mapped = arrayMap(arrays, toArrayLikeObject);
	
	      if (iteratee === last(mapped)) {
	        iteratee = undefined;
	      } else {
	        mapped.pop();
	      }
	      return (mapped.length && mapped[0] === arrays[0])
	        ? baseIntersection(mapped, getIteratee(iteratee))
	        : [];
	    });
	
	    /**
	     * This method is like `_.intersection` except that it accepts `comparator`
	     * which is invoked to compare elements of `arrays`. The comparator is invoked
	     * with two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of shared values.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
	     *
	     * _.intersectionWith(objects, others, _.isEqual);
	     * // => [{ 'x': 1, 'y': 2 }]
	     */
	    var intersectionWith = rest(function(arrays) {
	      var comparator = last(arrays),
	          mapped = arrayMap(arrays, toArrayLikeObject);
	
	      if (comparator === last(mapped)) {
	        comparator = undefined;
	      } else {
	        mapped.pop();
	      }
	      return (mapped.length && mapped[0] === arrays[0])
	        ? baseIntersection(mapped, undefined, comparator)
	        : [];
	    });
	
	    /**
	     * Converts all elements in `array` into a string separated by `separator`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to convert.
	     * @param {string} [separator=','] The element separator.
	     * @returns {string} Returns the joined string.
	     * @example
	     *
	     * _.join(['a', 'b', 'c'], '~');
	     * // => 'a~b~c'
	     */
	    function join(array, separator) {
	      return array ? nativeJoin.call(array, separator) : '';
	    }
	
	    /**
	     * Gets the last element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {*} Returns the last element of `array`.
	     * @example
	     *
	     * _.last([1, 2, 3]);
	     * // => 3
	     */
	    function last(array) {
	      var length = array ? array.length : 0;
	      return length ? array[length - 1] : undefined;
	    }
	
	    /**
	     * This method is like `_.indexOf` except that it iterates over elements of
	     * `array` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {number} [fromIndex=array.length-1] The index to search from.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.lastIndexOf([1, 2, 1, 2], 2);
	     * // => 3
	     *
	     * // Search from the `fromIndex`.
	     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
	     * // => 1
	     */
	    function lastIndexOf(array, value, fromIndex) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return -1;
	      }
	      var index = length;
	      if (fromIndex !== undefined) {
	        index = toInteger(fromIndex);
	        index = (index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1)) + 1;
	      }
	      if (value !== value) {
	        return indexOfNaN(array, index, true);
	      }
	      while (index--) {
	        if (array[index] === value) {
	          return index;
	        }
	      }
	      return -1;
	    }
	
	    /**
	     * Removes all provided values from `array` using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * **Note:** Unlike `_.without`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {...*} [values] The values to remove.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3, 1, 2, 3];
	     *
	     * _.pull(array, 2, 3);
	     * console.log(array);
	     * // => [1, 1]
	     */
	    var pull = rest(pullAll);
	
	    /**
	     * This method is like `_.pull` except that it accepts an array of values to remove.
	     *
	     * **Note:** Unlike `_.difference`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {Array} values The values to remove.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3, 1, 2, 3];
	     *
	     * _.pullAll(array, [2, 3]);
	     * console.log(array);
	     * // => [1, 1]
	     */
	    function pullAll(array, values) {
	      return (array && array.length && values && values.length)
	        ? basePullAll(array, values)
	        : array;
	    }
	
	    /**
	     * This method is like `_.pullAll` except that it accepts `iteratee` which is
	     * invoked for each element of `array` and `values` to generate the criterion
	     * by which uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {Array} values The values to remove.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
	     *
	     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
	     * console.log(array);
	     * // => [{ 'x': 2 }]
	     */
	    function pullAllBy(array, values, iteratee) {
	      return (array && array.length && values && values.length)
	        ? basePullAllBy(array, values, getIteratee(iteratee))
	        : array;
	    }
	
	    /**
	     * Removes elements from `array` corresponding to `indexes` and returns an
	     * array of removed elements.
	     *
	     * **Note:** Unlike `_.at`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
	     *  specified individually or in arrays.
	     * @returns {Array} Returns the new array of removed elements.
	     * @example
	     *
	     * var array = [5, 10, 15, 20];
	     * var evens = _.pullAt(array, 1, 3);
	     *
	     * console.log(array);
	     * // => [5, 15]
	     *
	     * console.log(evens);
	     * // => [10, 20]
	     */
	    var pullAt = rest(function(array, indexes) {
	      indexes = arrayMap(baseFlatten(indexes), String);
	
	      var result = baseAt(array, indexes);
	      basePullAt(array, indexes.sort(compareAscending));
	      return result;
	    });
	
	    /**
	     * Removes all elements from `array` that `predicate` returns truthy for
	     * and returns an array of the removed elements. The predicate is invoked with
	     * three arguments: (value, index, array).
	     *
	     * **Note:** Unlike `_.filter`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new array of removed elements.
	     * @example
	     *
	     * var array = [1, 2, 3, 4];
	     * var evens = _.remove(array, function(n) {
	     *   return n % 2 == 0;
	     * });
	     *
	     * console.log(array);
	     * // => [1, 3]
	     *
	     * console.log(evens);
	     * // => [2, 4]
	     */
	    function remove(array, predicate) {
	      var result = [];
	      if (!(array && array.length)) {
	        return result;
	      }
	      var index = -1,
	          indexes = [],
	          length = array.length;
	
	      predicate = getIteratee(predicate, 3);
	      while (++index < length) {
	        var value = array[index];
	        if (predicate(value, index, array)) {
	          result.push(value);
	          indexes.push(index);
	        }
	      }
	      basePullAt(array, indexes);
	      return result;
	    }
	
	    /**
	     * Reverses `array` so that the first element becomes the last, the second
	     * element becomes the second to last, and so on.
	     *
	     * **Note:** This method mutates `array` and is based on
	     * [`Array#reverse`](https://mdn.io/Array/reverse).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _.reverse(array);
	     * // => [3, 2, 1]
	     *
	     * console.log(array);
	     * // => [3, 2, 1]
	     */
	    function reverse(array) {
	      return array ? nativeReverse.call(array) : array;
	    }
	
	    /**
	     * Creates a slice of `array` from `start` up to, but not including, `end`.
	     *
	     * **Note:** This method is used instead of [`Array#slice`](https://mdn.io/Array/slice)
	     * to ensure dense arrays are returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function slice(array, start, end) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
	        start = 0;
	        end = length;
	      }
	      else {
	        start = start == null ? 0 : toInteger(start);
	        end = end === undefined ? length : toInteger(end);
	      }
	      return baseSlice(array, start, end);
	    }
	
	    /**
	     * Uses a binary search to determine the lowest index at which `value` should
	     * be inserted into `array` in order to maintain its sort order.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     * @example
	     *
	     * _.sortedIndex([30, 50], 40);
	     * // => 1
	     *
	     * _.sortedIndex([4, 5], 4);
	     * // => 0
	     */
	    function sortedIndex(array, value) {
	      return baseSortedIndex(array, value);
	    }
	
	    /**
	     * This method is like `_.sortedIndex` except that it accepts `iteratee`
	     * which is invoked for `value` and each element of `array` to compute their
	     * sort ranking. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     * @example
	     *
	     * var dict = { 'thirty': 30, 'forty': 40, 'fifty': 50 };
	     *
	     * _.sortedIndexBy(['thirty', 'fifty'], 'forty', _.propertyOf(dict));
	     * // => 1
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.sortedIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
	     * // => 0
	     */
	    function sortedIndexBy(array, value, iteratee) {
	      return baseSortedIndexBy(array, value, getIteratee(iteratee));
	    }
	
	    /**
	     * This method is like `_.indexOf` except that it performs a binary
	     * search on a sorted `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.sortedIndexOf([1, 1, 2, 2], 2);
	     * // => 2
	     */
	    function sortedIndexOf(array, value) {
	      var length = array ? array.length : 0;
	      if (length) {
	        var index = baseSortedIndex(array, value);
	        if (index < length && eq(array[index], value)) {
	          return index;
	        }
	      }
	      return -1;
	    }
	
	    /**
	     * This method is like `_.sortedIndex` except that it returns the highest
	     * index at which `value` should be inserted into `array` in order to
	     * maintain its sort order.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     * @example
	     *
	     * _.sortedLastIndex([4, 5], 4);
	     * // => 1
	     */
	    function sortedLastIndex(array, value) {
	      return baseSortedIndex(array, value, true);
	    }
	
	    /**
	     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
	     * which is invoked for `value` and each element of `array` to compute their
	     * sort ranking. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     * @example
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.sortedLastIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
	     * // => 1
	     */
	    function sortedLastIndexBy(array, value, iteratee) {
	      return baseSortedIndexBy(array, value, getIteratee(iteratee), true);
	    }
	
	    /**
	     * This method is like `_.lastIndexOf` except that it performs a binary
	     * search on a sorted `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.sortedLastIndexOf([1, 1, 2, 2], 2);
	     * // => 3
	     */
	    function sortedLastIndexOf(array, value) {
	      var length = array ? array.length : 0;
	      if (length) {
	        var index = baseSortedIndex(array, value, true) - 1;
	        if (eq(array[index], value)) {
	          return index;
	        }
	      }
	      return -1;
	    }
	
	    /**
	     * This method is like `_.uniq` except that it's designed and optimized
	     * for sorted arrays.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * _.sortedUniq([1, 1, 2]);
	     * // => [1, 2]
	     */
	    function sortedUniq(array) {
	      return (array && array.length)
	        ? baseSortedUniq(array)
	        : [];
	    }
	
	    /**
	     * This method is like `_.uniqBy` except that it's designed and optimized
	     * for sorted arrays.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
	     * // => [1.1, 2.3]
	     */
	    function sortedUniqBy(array, iteratee) {
	      return (array && array.length)
	        ? baseSortedUniqBy(array, getIteratee(iteratee))
	        : [];
	    }
	
	    /**
	     * Gets all but the first element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.tail([1, 2, 3]);
	     * // => [2, 3]
	     */
	    function tail(array) {
	      return drop(array, 1);
	    }
	
	    /**
	     * Creates a slice of `array` with `n` elements taken from the beginning.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to take.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.take([1, 2, 3]);
	     * // => [1]
	     *
	     * _.take([1, 2, 3], 2);
	     * // => [1, 2]
	     *
	     * _.take([1, 2, 3], 5);
	     * // => [1, 2, 3]
	     *
	     * _.take([1, 2, 3], 0);
	     * // => []
	     */
	    function take(array, n, guard) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      n = (guard || n === undefined) ? 1 : toInteger(n);
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }
	
	    /**
	     * Creates a slice of `array` with `n` elements taken from the end.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to take.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.takeRight([1, 2, 3]);
	     * // => [3]
	     *
	     * _.takeRight([1, 2, 3], 2);
	     * // => [2, 3]
	     *
	     * _.takeRight([1, 2, 3], 5);
	     * // => [1, 2, 3]
	     *
	     * _.takeRight([1, 2, 3], 0);
	     * // => []
	     */
	    function takeRight(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      n = (guard || n === undefined) ? 1 : toInteger(n);
	      n = length - n;
	      return baseSlice(array, n < 0 ? 0 : n, length);
	    }
	
	    /**
	     * Creates a slice of `array` with elements taken from the end. Elements are
	     * taken until `predicate` returns falsey. The predicate is invoked with three
	     * arguments: (value, index, array).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * _.takeRightWhile(users, function(o) { return !o.active; });
	     * // => objects for ['fred', 'pebbles']
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
	     * // => objects for ['pebbles']
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.takeRightWhile(users, ['active', false]);
	     * // => objects for ['fred', 'pebbles']
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.takeRightWhile(users, 'active');
	     * // => []
	     */
	    function takeRightWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3), false, true)
	        : [];
	    }
	
	    /**
	     * Creates a slice of `array` with elements taken from the beginning. Elements
	     * are taken until `predicate` returns falsey. The predicate is invoked with
	     * three arguments: (value, index, array).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false},
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * _.takeWhile(users, function(o) { return !o.active; });
	     * // => objects for ['barney', 'fred']
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.takeWhile(users, { 'user': 'barney', 'active': false });
	     * // => objects for ['barney']
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.takeWhile(users, ['active', false]);
	     * // => objects for ['barney', 'fred']
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.takeWhile(users, 'active');
	     * // => []
	     */
	    function takeWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3))
	        : [];
	    }
	
	    /**
	     * Creates an array of unique values, in order, from all of the provided arrays
	     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of combined values.
	     * @example
	     *
	     * _.union([2, 1], [4, 2], [1, 2]);
	     * // => [2, 1, 4]
	     */
	    var union = rest(function(arrays) {
	      return baseUniq(baseFlatten(arrays, false, true));
	    });
	
	    /**
	     * This method is like `_.union` except that it accepts `iteratee` which is
	     * invoked for each element of each `arrays` to generate the criterion by which
	     * uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new array of combined values.
	     * @example
	     *
	     * _.unionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
	     * // => [2.1, 1.2, 4.3]
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }, { 'x': 2 }]
	     */
	    var unionBy = rest(function(arrays) {
	      var iteratee = last(arrays);
	      if (isArrayLikeObject(iteratee)) {
	        iteratee = undefined;
	      }
	      return baseUniq(baseFlatten(arrays, false, true), getIteratee(iteratee));
	    });
	
	    /**
	     * This method is like `_.union` except that it accepts `comparator` which
	     * is invoked to compare elements of `arrays`. The comparator is invoked
	     * with two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of combined values.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
	     *
	     * _.unionWith(objects, others, _.isEqual);
	     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
	     */
	    var unionWith = rest(function(arrays) {
	      var comparator = last(arrays);
	      if (isArrayLikeObject(comparator)) {
	        comparator = undefined;
	      }
	      return baseUniq(baseFlatten(arrays, false, true), undefined, comparator);
	    });
	
	    /**
	     * Creates a duplicate-free version of an array, using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons, in which only the first occurrence of each element
	     * is kept.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * _.uniq([2, 1, 2]);
	     * // => [2, 1]
	     */
	    function uniq(array) {
	      return (array && array.length)
	        ? baseUniq(array)
	        : [];
	    }
	
	    /**
	     * This method is like `_.uniq` except that it accepts `iteratee` which is
	     * invoked for each element in `array` to generate the criterion by which
	     * uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
	     * // => [2.1, 1.2]
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }, { 'x': 2 }]
	     */
	    function uniqBy(array, iteratee) {
	      return (array && array.length)
	        ? baseUniq(array, getIteratee(iteratee))
	        : [];
	    }
	
	    /**
	     * This method is like `_.uniq` except that it accepts `comparator` which
	     * is invoked to compare elements of `array`. The comparator is invoked with
	     * two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 },  { 'x': 1, 'y': 2 }];
	     *
	     * _.uniqWith(objects, _.isEqual);
	     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
	     */
	    function uniqWith(array, comparator) {
	      return (array && array.length)
	        ? baseUniq(array, undefined, comparator)
	        : [];
	    }
	
	    /**
	     * This method is like `_.zip` except that it accepts an array of grouped
	     * elements and creates an array regrouping the elements to their pre-zip
	     * configuration.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array of grouped elements to process.
	     * @returns {Array} Returns the new array of regrouped elements.
	     * @example
	     *
	     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     *
	     * _.unzip(zipped);
	     * // => [['fred', 'barney'], [30, 40], [true, false]]
	     */
	    function unzip(array) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      var length = 0;
	      array = arrayFilter(array, function(group) {
	        if (isArrayLikeObject(group)) {
	          length = nativeMax(group.length, length);
	          return true;
	        }
	      });
	      return baseTimes(length, function(index) {
	        return arrayMap(array, baseProperty(index));
	      });
	    }
	
	    /**
	     * This method is like `_.unzip` except that it accepts `iteratee` to specify
	     * how regrouped values should be combined. The iteratee is invoked with the
	     * elements of each group: (...group).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array of grouped elements to process.
	     * @param {Function} [iteratee=_.identity] The function to combine regrouped values.
	     * @returns {Array} Returns the new array of regrouped elements.
	     * @example
	     *
	     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
	     * // => [[1, 10, 100], [2, 20, 200]]
	     *
	     * _.unzipWith(zipped, _.add);
	     * // => [3, 30, 300]
	     */
	    function unzipWith(array, iteratee) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      var result = unzip(array);
	      if (iteratee == null) {
	        return result;
	      }
	      return arrayMap(result, function(group) {
	        return apply(iteratee, undefined, group);
	      });
	    }
	
	    /**
	     * Creates an array excluding all provided values using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to filter.
	     * @param {...*} [values] The values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.without([1, 2, 1, 3], 1, 2);
	     * // => [3]
	     */
	    var without = rest(function(array, values) {
	      return isArrayLikeObject(array)
	        ? baseDifference(array, values)
	        : [];
	    });
	
	    /**
	     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
	     * of the provided arrays.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of values.
	     * @example
	     *
	     * _.xor([2, 1], [4, 2]);
	     * // => [1, 4]
	     */
	    var xor = rest(function(arrays) {
	      return baseXor(arrayFilter(arrays, isArrayLikeObject));
	    });
	
	    /**
	     * This method is like `_.xor` except that it accepts `iteratee` which is
	     * invoked for each element of each `arrays` to generate the criterion by which
	     * uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new array of values.
	     * @example
	     *
	     * _.xorBy([2.1, 1.2], [4.3, 2.4], Math.floor);
	     * // => [1.2, 4.3]
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 2 }]
	     */
	    var xorBy = rest(function(arrays) {
	      var iteratee = last(arrays);
	      if (isArrayLikeObject(iteratee)) {
	        iteratee = undefined;
	      }
	      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee));
	    });
	
	    /**
	     * This method is like `_.xor` except that it accepts `comparator` which is
	     * invoked to compare elements of `arrays`. The comparator is invoked with
	     * two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of values.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
	     *
	     * _.xorWith(objects, others, _.isEqual);
	     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
	     */
	    var xorWith = rest(function(arrays) {
	      var comparator = last(arrays);
	      if (isArrayLikeObject(comparator)) {
	        comparator = undefined;
	      }
	      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
	    });
	
	    /**
	     * Creates an array of grouped elements, the first of which contains the first
	     * elements of the given arrays, the second of which contains the second elements
	     * of the given arrays, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to process.
	     * @returns {Array} Returns the new array of grouped elements.
	     * @example
	     *
	     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     */
	    var zip = rest(unzip);
	
	    /**
	     * This method is like `_.fromPairs` except that it accepts two arrays,
	     * one of property names and one of corresponding values.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} [props=[]] The property names.
	     * @param {Array} [values=[]] The property values.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * _.zipObject(['a', 'b'], [1, 2]);
	     * // => { 'a': 1, 'b': 2 }
	     */
	    function zipObject(props, values) {
	      return baseZipObject(props || [], values || [], assignValue);
	    }
	
	    /**
	     * This method is like `_.zipObject` except that it supports property paths.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} [props=[]] The property names.
	     * @param {Array} [values=[]] The property values.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
	     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
	     */
	    function zipObjectDeep(props, values) {
	      return baseZipObject(props || [], values || [], baseSet);
	    }
	
	    /**
	     * This method is like `_.zip` except that it accepts `iteratee` to specify
	     * how grouped values should be combined. The iteratee is invoked with the
	     * elements of each group: (...group).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to process.
	     * @param {Function} [iteratee=_.identity] The function to combine grouped values.
	     * @returns {Array} Returns the new array of grouped elements.
	     * @example
	     *
	     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
	     *   return a + b + c;
	     * });
	     * // => [111, 222]
	     */
	    var zipWith = rest(function(arrays) {
	      var length = arrays.length,
	          iteratee = length > 1 ? arrays[length - 1] : undefined;
	
	      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
	      return unzipWith(arrays, iteratee);
	    });
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a `lodash` object that wraps `value` with explicit method chaining enabled.
	     * The result of such method chaining must be unwrapped with `_#value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Seq
	     * @param {*} value The value to wrap.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36 },
	     *   { 'user': 'fred',    'age': 40 },
	     *   { 'user': 'pebbles', 'age': 1 }
	     * ];
	     *
	     * var youngest = _
	     *   .chain(users)
	     *   .sortBy('age')
	     *   .map(function(o) {
	     *     return o.user + ' is ' + o.age;
	     *   })
	     *   .head()
	     *   .value();
	     * // => 'pebbles is 1'
	     */
	    function chain(value) {
	      var result = lodash(value);
	      result.__chain__ = true;
	      return result;
	    }
	
	    /**
	     * This method invokes `interceptor` and returns `value`. The interceptor
	     * is invoked with one argument; (value). The purpose of this method is to
	     * "tap into" a method chain in order to modify intermediate results.
	     *
	     * @static
	     * @memberOf _
	     * @category Seq
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * _([1, 2, 3])
	     *  .tap(function(array) {
	     *    // Mutate input array.
	     *    array.pop();
	     *  })
	     *  .reverse()
	     *  .value();
	     * // => [2, 1]
	     */
	    function tap(value, interceptor) {
	      interceptor(value);
	      return value;
	    }
	
	    /**
	     * This method is like `_.tap` except that it returns the result of `interceptor`.
	     * The purpose of this method is to "pass thru" values replacing intermediate
	     * results in a method chain.
	     *
	     * @static
	     * @memberOf _
	     * @category Seq
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @returns {*} Returns the result of `interceptor`.
	     * @example
	     *
	     * _('  abc  ')
	     *  .chain()
	     *  .trim()
	     *  .thru(function(value) {
	     *    return [value];
	     *  })
	     *  .value();
	     * // => ['abc']
	     */
	    function thru(value, interceptor) {
	      return interceptor(value);
	    }
	
	    /**
	     * This method is the wrapper version of `_.at`.
	     *
	     * @name at
	     * @memberOf _
	     * @category Seq
	     * @param {...(string|string[])} [paths] The property paths of elements to pick,
	     *  specified individually or in arrays.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
	     *
	     * _(object).at(['a[0].b.c', 'a[1]']).value();
	     * // => [3, 4]
	     *
	     * _(['a', 'b', 'c']).at(0, 2).value();
	     * // => ['a', 'c']
	     */
	    var wrapperAt = rest(function(paths) {
	      paths = baseFlatten(paths);
	      var length = paths.length,
	          start = length ? paths[0] : 0,
	          value = this.__wrapped__,
	          interceptor = function(object) { return baseAt(object, paths); };
	
	      if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
	        return this.thru(interceptor);
	      }
	      value = value.slice(start, +start + (length ? 1 : 0));
	      value.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
	      return new LodashWrapper(value, this.__chain__).thru(function(array) {
	        if (length && !array.length) {
	          array.push(undefined);
	        }
	        return array;
	      });
	    });
	
	    /**
	     * Enables explicit method chaining on the wrapper object.
	     *
	     * @name chain
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * // A sequence without explicit chaining.
	     * _(users).head();
	     * // => { 'user': 'barney', 'age': 36 }
	     *
	     * // A sequence with explicit chaining.
	     * _(users)
	     *   .chain()
	     *   .head()
	     *   .pick('user')
	     *   .value();
	     * // => { 'user': 'barney' }
	     */
	    function wrapperChain() {
	      return chain(this);
	    }
	
	    /**
	     * Executes the chained sequence and returns the wrapped result.
	     *
	     * @name commit
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2];
	     * var wrapped = _(array).push(3);
	     *
	     * console.log(array);
	     * // => [1, 2]
	     *
	     * wrapped = wrapped.commit();
	     * console.log(array);
	     * // => [1, 2, 3]
	     *
	     * wrapped.last();
	     * // => 3
	     *
	     * console.log(array);
	     * // => [1, 2, 3]
	     */
	    function wrapperCommit() {
	      return new LodashWrapper(this.value(), this.__chain__);
	    }
	
	    /**
	     * This method is the wrapper version of `_.flatMap`.
	     *
	     * @name flatMap
	     * @memberOf _
	     * @category Seq
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * function duplicate(n) {
	     *   return [n, n];
	     * }
	     *
	     * _([1, 2]).flatMap(duplicate).value();
	     * // => [1, 1, 2, 2]
	     */
	    function wrapperFlatMap(iteratee) {
	      return this.map(iteratee).flatten();
	    }
	
	    /**
	     * Gets the next value on a wrapped object following the
	     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
	     *
	     * @name next
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the next iterator value.
	     * @example
	     *
	     * var wrapped = _([1, 2]);
	     *
	     * wrapped.next();
	     * // => { 'done': false, 'value': 1 }
	     *
	     * wrapped.next();
	     * // => { 'done': false, 'value': 2 }
	     *
	     * wrapped.next();
	     * // => { 'done': true, 'value': undefined }
	     */
	    function wrapperNext() {
	      if (this.__values__ === undefined) {
	        this.__values__ = toArray(this.value());
	      }
	      var done = this.__index__ >= this.__values__.length,
	          value = done ? undefined : this.__values__[this.__index__++];
	
	      return { 'done': done, 'value': value };
	    }
	
	    /**
	     * Enables the wrapper to be iterable.
	     *
	     * @name Symbol.iterator
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the wrapper object.
	     * @example
	     *
	     * var wrapped = _([1, 2]);
	     *
	     * wrapped[Symbol.iterator]() === wrapped;
	     * // => true
	     *
	     * Array.from(wrapped);
	     * // => [1, 2]
	     */
	    function wrapperToIterator() {
	      return this;
	    }
	
	    /**
	     * Creates a clone of the chained sequence planting `value` as the wrapped value.
	     *
	     * @name plant
	     * @memberOf _
	     * @category Seq
	     * @param {*} value The value to plant.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var wrapped = _([1, 2]).map(square);
	     * var other = wrapped.plant([3, 4]);
	     *
	     * other.value();
	     * // => [9, 16]
	     *
	     * wrapped.value();
	     * // => [1, 4]
	     */
	    function wrapperPlant(value) {
	      var result,
	          parent = this;
	
	      while (parent instanceof baseLodash) {
	        var clone = wrapperClone(parent);
	        clone.__index__ = 0;
	        clone.__values__ = undefined;
	        if (result) {
	          previous.__wrapped__ = clone;
	        } else {
	          result = clone;
	        }
	        var previous = clone;
	        parent = parent.__wrapped__;
	      }
	      previous.__wrapped__ = value;
	      return result;
	    }
	
	    /**
	     * This method is the wrapper version of `_.reverse`.
	     *
	     * **Note:** This method mutates the wrapped array.
	     *
	     * @name reverse
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _(array).reverse().value()
	     * // => [3, 2, 1]
	     *
	     * console.log(array);
	     * // => [3, 2, 1]
	     */
	    function wrapperReverse() {
	      var value = this.__wrapped__;
	      if (value instanceof LazyWrapper) {
	        var wrapped = value;
	        if (this.__actions__.length) {
	          wrapped = new LazyWrapper(this);
	        }
	        wrapped = wrapped.reverse();
	        wrapped.__actions__.push({ 'func': thru, 'args': [reverse], 'thisArg': undefined });
	        return new LodashWrapper(wrapped, this.__chain__);
	      }
	      return this.thru(reverse);
	    }
	
	    /**
	     * Executes the chained sequence to extract the unwrapped value.
	     *
	     * @name value
	     * @memberOf _
	     * @alias toJSON, valueOf
	     * @category Seq
	     * @returns {*} Returns the resolved unwrapped value.
	     * @example
	     *
	     * _([1, 2, 3]).value();
	     * // => [1, 2, 3]
	     */
	    function wrapperValue() {
	      return baseWrapperValue(this.__wrapped__, this.__actions__);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is the number of times the key was returned by `iteratee`.
	     * The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.countBy([6.1, 4.2, 6.3], Math.floor);
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy(['one', 'two', 'three'], 'length');
	     * // => { '3': 2, '5': 1 }
	     */
	    var countBy = createAggregator(function(result, value, key) {
	      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
	    });
	
	    /**
	     * Checks if `predicate` returns truthy for **all** elements of `collection`.
	     * Iteration is stopped once `predicate` returns falsey. The predicate is
	     * invoked with three arguments: (value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
	     * @example
	     *
	     * _.every([true, 1, null, 'yes'], Boolean);
	     * // => false
	     *
	     * var users = [
	     *   { 'user': 'barney', 'active': false },
	     *   { 'user': 'fred',   'active': false }
	     * ];
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.every(users, { 'user': 'barney', 'active': false });
	     * // => false
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.every(users, ['active', false]);
	     * // => true
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.every(users, 'active');
	     * // => false
	     */
	    function every(collection, predicate, guard) {
	      var func = isArray(collection) ? arrayEvery : baseEvery;
	      if (guard && isIterateeCall(collection, predicate, guard)) {
	        predicate = undefined;
	      }
	      return func(collection, getIteratee(predicate, 3));
	    }
	
	    /**
	     * Iterates over elements of `collection`, returning an array of all elements
	     * `predicate` returns truthy for. The predicate is invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * _.filter(users, function(o) { return !o.active; });
	     * // => objects for ['fred']
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.filter(users, { 'age': 36, 'active': true });
	     * // => objects for ['barney']
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.filter(users, ['active', false]);
	     * // => objects for ['fred']
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.filter(users, 'active');
	     * // => objects for ['barney']
	     */
	    function filter(collection, predicate) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      return func(collection, getIteratee(predicate, 3));
	    }
	
	    /**
	     * Iterates over elements of `collection`, returning the first element
	     * `predicate` returns truthy for. The predicate is invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36, 'active': true },
	     *   { 'user': 'fred',    'age': 40, 'active': false },
	     *   { 'user': 'pebbles', 'age': 1,  'active': true }
	     * ];
	     *
	     * _.find(users, function(o) { return o.age < 40; });
	     * // => object for 'barney'
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.find(users, { 'age': 1, 'active': true });
	     * // => object for 'pebbles'
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.find(users, ['active', false]);
	     * // => object for 'fred'
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.find(users, 'active');
	     * // => object for 'barney'
	     */
	    function find(collection, predicate) {
	      predicate = getIteratee(predicate, 3);
	      if (isArray(collection)) {
	        var index = baseFindIndex(collection, predicate);
	        return index > -1 ? collection[index] : undefined;
	      }
	      return baseFind(collection, predicate, baseEach);
	    }
	
	    /**
	     * This method is like `_.find` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * _.findLast([1, 2, 3, 4], function(n) {
	     *   return n % 2 == 1;
	     * });
	     * // => 3
	     */
	    function findLast(collection, predicate) {
	      predicate = getIteratee(predicate, 3);
	      if (isArray(collection)) {
	        var index = baseFindIndex(collection, predicate, true);
	        return index > -1 ? collection[index] : undefined;
	      }
	      return baseFind(collection, predicate, baseEachRight);
	    }
	
	    /**
	     * Creates an array of flattened values by running each element in `collection`
	     * through `iteratee` and concating its result to the other mapped values.
	     * The iteratee is invoked with three arguments: (value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new flattened array.
	     * @example
	     *
	     * function duplicate(n) {
	     *   return [n, n];
	     * }
	     *
	     * _.flatMap([1, 2], duplicate);
	     * // => [1, 1, 2, 2]
	     */
	    function flatMap(collection, iteratee) {
	      return baseFlatten(map(collection, iteratee));
	    }
	
	    /**
	     * Iterates over elements of `collection` invoking `iteratee` for each element.
	     * The iteratee is invoked with three arguments: (value, index|key, collection).
	     * Iteratee functions may exit iteration early by explicitly returning `false`.
	     *
	     * **Note:** As with other "Collections" methods, objects with a "length" property
	     * are iterated like arrays. To avoid this behavior use `_.forIn` or `_.forOwn`
	     * for object iteration.
	     *
	     * @static
	     * @memberOf _
	     * @alias each
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array|Object} Returns `collection`.
	     * @example
	     *
	     * _([1, 2]).forEach(function(value) {
	     *   console.log(value);
	     * });
	     * // => logs `1` then `2`
	     *
	     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a' then 'b' (iteration order is not guaranteed)
	     */
	    function forEach(collection, iteratee) {
	      return (typeof iteratee == 'function' && isArray(collection))
	        ? arrayEach(collection, iteratee)
	        : baseEach(collection, toFunction(iteratee));
	    }
	
	    /**
	     * This method is like `_.forEach` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias eachRight
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array|Object} Returns `collection`.
	     * @example
	     *
	     * _.forEachRight([1, 2], function(value) {
	     *   console.log(value);
	     * });
	     * // => logs `2` then `1`
	     */
	    function forEachRight(collection, iteratee) {
	      return (typeof iteratee == 'function' && isArray(collection))
	        ? arrayEachRight(collection, iteratee)
	        : baseEachRight(collection, toFunction(iteratee));
	    }
	
	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is an array of elements responsible for generating the key.
	     * The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
	     * // => { '4': [4.2], '6': [6.1, 6.3] }
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.groupBy(['one', 'two', 'three'], 'length');
	     * // => { '3': ['one', 'two'], '5': ['three'] }
	     */
	    var groupBy = createAggregator(function(result, value, key) {
	      if (hasOwnProperty.call(result, key)) {
	        result[key].push(value);
	      } else {
	        result[key] = [value];
	      }
	    });
	
	    /**
	     * Checks if `value` is in `collection`. If `collection` is a string it's checked
	     * for a substring of `value`, otherwise [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * is used for equality comparisons. If `fromIndex` is negative, it's used as
	     * the offset from the end of `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {*} value The value to search for.
	     * @param {number} [fromIndex=0] The index to search from.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
	     * @returns {boolean} Returns `true` if `value` is found, else `false`.
	     * @example
	     *
	     * _.includes([1, 2, 3], 1);
	     * // => true
	     *
	     * _.includes([1, 2, 3], 1, 2);
	     * // => false
	     *
	     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
	     * // => true
	     *
	     * _.includes('pebbles', 'eb');
	     * // => true
	     */
	    function includes(collection, value, fromIndex, guard) {
	      collection = isArrayLike(collection) ? collection : values(collection);
	      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;
	
	      var length = collection.length;
	      if (fromIndex < 0) {
	        fromIndex = nativeMax(length + fromIndex, 0);
	      }
	      return isString(collection)
	        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
	        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
	    }
	
	    /**
	     * Invokes the method at `path` of each element in `collection`, returning
	     * an array of the results of each invoked method. Any additional arguments
	     * are provided to each invoked method. If `methodName` is a function it's
	     * invoked for, and `this` bound to, each element in `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Array|Function|string} path The path of the method to invoke or
	     *  the function invoked per iteration.
	     * @param {...*} [args] The arguments to invoke each method with.
	     * @returns {Array} Returns the array of results.
	     * @example
	     *
	     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
	     * // => [[1, 5, 7], [1, 2, 3]]
	     *
	     * _.invokeMap([123, 456], String.prototype.split, '');
	     * // => [['1', '2', '3'], ['4', '5', '6']]
	     */
	    var invokeMap = rest(function(collection, path, args) {
	      var index = -1,
	          isFunc = typeof path == 'function',
	          isProp = isKey(path),
	          result = isArrayLike(collection) ? Array(collection.length) : [];
	
	      baseEach(collection, function(value) {
	        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
	        result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
	      });
	      return result;
	    });
	
	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is the last element responsible for generating the key. The
	     * iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * var array = [
	     *   { 'dir': 'left', 'code': 97 },
	     *   { 'dir': 'right', 'code': 100 }
	     * ];
	     *
	     * _.keyBy(array, function(o) {
	     *   return String.fromCharCode(o.code);
	     * });
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.keyBy(array, 'dir');
	     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
	     */
	    var keyBy = createAggregator(function(result, value, key) {
	      result[key] = value;
	    });
	
	    /**
	     * Creates an array of values by running each element in `collection` through
	     * `iteratee`. The iteratee is invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * Many lodash methods are guarded to work as iteratees for methods like
	     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	     *
	     * The guarded methods are:
	     * `ary`, `curry`, `curryRight`, `drop`, `dropRight`, `every`, `fill`,
	     * `invert`, `parseInt`, `random`, `range`, `rangeRight`, `slice`, `some`,
	     * `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimEnd`, `trimStart`,
	     * and `words`
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * _.map([4, 8], square);
	     * // => [16, 64]
	     *
	     * _.map({ 'a': 4, 'b': 8 }, square);
	     * // => [16, 64] (iteration order is not guaranteed)
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.map(users, 'user');
	     * // => ['barney', 'fred']
	     */
	    function map(collection, iteratee) {
	      var func = isArray(collection) ? arrayMap : baseMap;
	      return func(collection, getIteratee(iteratee, 3));
	    }
	
	    /**
	     * This method is like `_.sortBy` except that it allows specifying the sort
	     * orders of the iteratees to sort by. If `orders` is unspecified, all values
	     * are sorted in ascending order. Otherwise, specify an order of "desc" for
	     * descending or "asc" for ascending sort order of corresponding values.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function[]|Object[]|string[]} [iteratees=[_.identity]] The iteratees to sort by.
	     * @param {string[]} [orders] The sort orders of `iteratees`.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'fred',   'age': 48 },
	     *   { 'user': 'barney', 'age': 34 },
	     *   { 'user': 'fred',   'age': 42 },
	     *   { 'user': 'barney', 'age': 36 }
	     * ];
	     *
	     * // Sort by `user` in ascending order and by `age` in descending order.
	     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
	     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
	     */
	    function orderBy(collection, iteratees, orders, guard) {
	      if (collection == null) {
	        return [];
	      }
	      if (!isArray(iteratees)) {
	        iteratees = iteratees == null ? [] : [iteratees];
	      }
	      orders = guard ? undefined : orders;
	      if (!isArray(orders)) {
	        orders = orders == null ? [] : [orders];
	      }
	      return baseOrderBy(collection, iteratees, orders);
	    }
	
	    /**
	     * Creates an array of elements split into two groups, the first of which
	     * contains elements `predicate` returns truthy for, the second of which
	     * contains elements `predicate` returns falsey for. The predicate is
	     * invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the array of grouped elements.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36, 'active': false },
	     *   { 'user': 'fred',    'age': 40, 'active': true },
	     *   { 'user': 'pebbles', 'age': 1,  'active': false }
	     * ];
	     *
	     * _.partition(users, function(o) { return o.active; });
	     * // => objects for [['fred'], ['barney', 'pebbles']]
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.partition(users, { 'age': 1, 'active': false });
	     * // => objects for [['pebbles'], ['barney', 'fred']]
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.partition(users, ['active', false]);
	     * // => objects for [['barney', 'pebbles'], ['fred']]
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.partition(users, 'active');
	     * // => objects for [['fred'], ['barney', 'pebbles']]
	     */
	    var partition = createAggregator(function(result, value, key) {
	      result[key ? 0 : 1].push(value);
	    }, function() { return [[], []]; });
	
	    /**
	     * Reduces `collection` to a value which is the accumulated result of running
	     * each element in `collection` through `iteratee`, where each successive
	     * invocation is supplied the return value of the previous. If `accumulator`
	     * is not provided the first element of `collection` is used as the initial
	     * value. The iteratee is invoked with four arguments:
	     * (accumulator, value, index|key, collection).
	     *
	     * Many lodash methods are guarded to work as iteratees for methods like
	     * `_.reduce`, `_.reduceRight`, and `_.transform`.
	     *
	     * The guarded methods are:
	     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
	     * and `sortBy`
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * _.reduce([1, 2], function(sum, n) {
	     *   return sum + n;
	     * }, 0);
	     * // => 3
	     *
	     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	     *   (result[value] || (result[value] = [])).push(key);
	     *   return result;
	     * }, {});
	     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
	     */
	    function reduce(collection, iteratee, accumulator) {
	      var func = isArray(collection) ? arrayReduce : baseReduce,
	          initAccum = arguments.length < 3;
	
	      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
	    }
	
	    /**
	     * This method is like `_.reduce` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var array = [[0, 1], [2, 3], [4, 5]];
	     *
	     * _.reduceRight(array, function(flattened, other) {
	     *   return flattened.concat(other);
	     * }, []);
	     * // => [4, 5, 2, 3, 0, 1]
	     */
	    function reduceRight(collection, iteratee, accumulator) {
	      var func = isArray(collection) ? arrayReduceRight : baseReduce,
	          initAccum = arguments.length < 3;
	
	      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
	    }
	
	    /**
	     * The opposite of `_.filter`; this method returns the elements of `collection`
	     * that `predicate` does **not** return truthy for.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': false },
	     *   { 'user': 'fred',   'age': 40, 'active': true }
	     * ];
	     *
	     * _.reject(users, function(o) { return !o.active; });
	     * // => objects for ['fred']
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.reject(users, { 'age': 40, 'active': true });
	     * // => objects for ['barney']
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.reject(users, ['active', false]);
	     * // => objects for ['fred']
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.reject(users, 'active');
	     * // => objects for ['barney']
	     */
	    function reject(collection, predicate) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      predicate = getIteratee(predicate, 3);
	      return func(collection, function(value, index, collection) {
	        return !predicate(value, index, collection);
	      });
	    }
	
	    /**
	     * Gets a random element from `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to sample.
	     * @returns {*} Returns the random element.
	     * @example
	     *
	     * _.sample([1, 2, 3, 4]);
	     * // => 2
	     */
	    function sample(collection) {
	      var array = isArrayLike(collection) ? collection : values(collection),
	          length = array.length;
	
	      return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
	    }
	
	    /**
	     * Gets `n` random elements at unique keys from `collection` up to the
	     * size of `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to sample.
	     * @param {number} [n=0] The number of elements to sample.
	     * @returns {Array} Returns the random elements.
	     * @example
	     *
	     * _.sampleSize([1, 2, 3], 2);
	     * // => [3, 1]
	     *
	     * _.sampleSize([1, 2, 3], 4);
	     * // => [2, 3, 1]
	     */
	    function sampleSize(collection, n) {
	      var index = -1,
	          result = toArray(collection),
	          length = result.length,
	          lastIndex = length - 1;
	
	      n = baseClamp(toInteger(n), 0, length);
	      while (++index < n) {
	        var rand = baseRandom(index, lastIndex),
	            value = result[rand];
	
	        result[rand] = result[index];
	        result[index] = value;
	      }
	      result.length = n;
	      return result;
	    }
	
	    /**
	     * Creates an array of shuffled values, using a version of the
	     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to shuffle.
	     * @returns {Array} Returns the new shuffled array.
	     * @example
	     *
	     * _.shuffle([1, 2, 3, 4]);
	     * // => [4, 1, 3, 2]
	     */
	    function shuffle(collection) {
	      return sampleSize(collection, MAX_ARRAY_LENGTH);
	    }
	
	    /**
	     * Gets the size of `collection` by returning its length for array-like
	     * values or the number of own enumerable properties for objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to inspect.
	     * @returns {number} Returns the collection size.
	     * @example
	     *
	     * _.size([1, 2, 3]);
	     * // => 3
	     *
	     * _.size({ 'a': 1, 'b': 2 });
	     * // => 2
	     *
	     * _.size('pebbles');
	     * // => 7
	     */
	    function size(collection) {
	      if (collection == null) {
	        return 0;
	      }
	      if (isArrayLike(collection)) {
	        var result = collection.length;
	        return (result && isString(collection)) ? stringSize(collection) : result;
	      }
	      return keys(collection).length;
	    }
	
	    /**
	     * Checks if `predicate` returns truthy for **any** element of `collection`.
	     * Iteration is stopped once `predicate` returns truthy. The predicate is
	     * invoked with three arguments: (value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
	     * @example
	     *
	     * _.some([null, 0, 'yes', false], Boolean);
	     * // => true
	     *
	     * var users = [
	     *   { 'user': 'barney', 'active': true },
	     *   { 'user': 'fred',   'active': false }
	     * ];
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.some(users, { 'user': 'barney', 'active': false });
	     * // => false
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.some(users, ['active', false]);
	     * // => true
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.some(users, 'active');
	     * // => true
	     */
	    function some(collection, predicate, guard) {
	      var func = isArray(collection) ? arraySome : baseSome;
	      if (guard && isIterateeCall(collection, predicate, guard)) {
	        predicate = undefined;
	      }
	      return func(collection, getIteratee(predicate, 3));
	    }
	
	    /**
	     * Creates an array of elements, sorted in ascending order by the results of
	     * running each element in a collection through each iteratee. This method
	     * performs a stable sort, that is, it preserves the original sort order of
	     * equal elements. The iteratees are invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {...(Function|Function[]|Object|Object[]|string|string[])} [iteratees=[_.identity]]
	     *  The iteratees to sort by, specified individually or in arrays.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'fred',   'age': 48 },
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 42 },
	     *   { 'user': 'barney', 'age': 34 }
	     * ];
	     *
	     * _.sortBy(users, function(o) { return o.user; });
	     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
	     *
	     * _.sortBy(users, ['user', 'age']);
	     * // => objects for [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
	     *
	     * _.sortBy(users, 'user', function(o) {
	     *   return Math.floor(o.age / 10);
	     * });
	     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
	     */
	    var sortBy = rest(function(collection, iteratees) {
	      if (collection == null) {
	        return [];
	      }
	      var length = iteratees.length;
	      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
	        iteratees = [];
	      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
	        iteratees.length = 1;
	      }
	      return baseOrderBy(collection, baseFlatten(iteratees), []);
	    });
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Gets the timestamp of the number of milliseconds that have elapsed since
	     * the Unix epoch (1 January 1970 00:00:00 UTC).
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Date
	     * @returns {number} Returns the timestamp.
	     * @example
	     *
	     * _.defer(function(stamp) {
	     *   console.log(_.now() - stamp);
	     * }, _.now());
	     * // => logs the number of milliseconds it took for the deferred function to be invoked
	     */
	    var now = Date.now;
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * The opposite of `_.before`; this method creates a function that invokes
	     * `func` once it's called `n` or more times.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {number} n The number of calls before `func` is invoked.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var saves = ['profile', 'settings'];
	     *
	     * var done = _.after(saves.length, function() {
	     *   console.log('done saving!');
	     * });
	     *
	     * _.forEach(saves, function(type) {
	     *   asyncSave({ 'type': type, 'complete': done });
	     * });
	     * // => logs 'done saving!' after the two async saves have completed
	     */
	    function after(n, func) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      n = toInteger(n);
	      return function() {
	        if (--n < 1) {
	          return func.apply(this, arguments);
	        }
	      };
	    }
	
	    /**
	     * Creates a function that accepts up to `n` arguments, ignoring any
	     * additional arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to cap arguments for.
	     * @param {number} [n=func.length] The arity cap.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
	     * // => [6, 8, 10]
	     */
	    function ary(func, n, guard) {
	      n = guard ? undefined : n;
	      n = (func && n == null) ? func.length : n;
	      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
	    }
	
	    /**
	     * Creates a function that invokes `func`, with the `this` binding and arguments
	     * of the created function, while it's called less than `n` times. Subsequent
	     * calls to the created function return the result of the last `func` invocation.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {number} n The number of calls at which `func` is no longer invoked.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * jQuery(element).on('click', _.before(5, addContactToList));
	     * // => allows adding up to 4 contacts to the list
	     */
	    function before(n, func) {
	      var result;
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      n = toInteger(n);
	      return function() {
	        if (--n > 0) {
	          result = func.apply(this, arguments);
	        }
	        if (n <= 1) {
	          func = undefined;
	        }
	        return result;
	      };
	    }
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of `thisArg`
	     * and prepends any additional `_.bind` arguments to those provided to the
	     * bound function.
	     *
	     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
	     * may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** Unlike native `Function#bind` this method doesn't set the "length"
	     * property of bound functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to bind.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var greet = function(greeting, punctuation) {
	     *   return greeting + ' ' + this.user + punctuation;
	     * };
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * var bound = _.bind(greet, object, 'hi');
	     * bound('!');
	     * // => 'hi fred!'
	     *
	     * // Bound with placeholders.
	     * var bound = _.bind(greet, object, _, '!');
	     * bound('hi');
	     * // => 'hi fred!'
	     */
	    var bind = rest(function(func, thisArg, partials) {
	      var bitmask = BIND_FLAG;
	      if (partials.length) {
	        var placeholder = lodash.placeholder || bind.placeholder,
	            holders = replaceHolders(partials, placeholder);
	
	        bitmask |= PARTIAL_FLAG;
	      }
	      return createWrapper(func, bitmask, thisArg, partials, holders);
	    });
	
	    /**
	     * Creates a function that invokes the method at `object[key]` and prepends
	     * any additional `_.bindKey` arguments to those provided to the bound function.
	     *
	     * This method differs from `_.bind` by allowing bound functions to reference
	     * methods that may be redefined or don't yet exist.
	     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
	     * for more details.
	     *
	     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Object} object The object to invoke the method on.
	     * @param {string} key The key of the method.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var object = {
	     *   'user': 'fred',
	     *   'greet': function(greeting, punctuation) {
	     *     return greeting + ' ' + this.user + punctuation;
	     *   }
	     * };
	     *
	     * var bound = _.bindKey(object, 'greet', 'hi');
	     * bound('!');
	     * // => 'hi fred!'
	     *
	     * object.greet = function(greeting, punctuation) {
	     *   return greeting + 'ya ' + this.user + punctuation;
	     * };
	     *
	     * bound('!');
	     * // => 'hiya fred!'
	     *
	     * // Bound with placeholders.
	     * var bound = _.bindKey(object, 'greet', _, '!');
	     * bound('hi');
	     * // => 'hiya fred!'
	     */
	    var bindKey = rest(function(object, key, partials) {
	      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
	      if (partials.length) {
	        var placeholder = lodash.placeholder || bindKey.placeholder,
	            holders = replaceHolders(partials, placeholder);
	
	        bitmask |= PARTIAL_FLAG;
	      }
	      return createWrapper(key, bitmask, object, partials, holders);
	    });
	
	    /**
	     * Creates a function that accepts arguments of `func` and either invokes
	     * `func` returning its result, if at least `arity` number of arguments have
	     * been provided, or returns a function that accepts the remaining `func`
	     * arguments, and so on. The arity of `func` may be specified if `func.length`
	     * is not sufficient.
	     *
	     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
	     * may be used as a placeholder for provided arguments.
	     *
	     * **Note:** This method doesn't set the "length" property of curried functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var abc = function(a, b, c) {
	     *   return [a, b, c];
	     * };
	     *
	     * var curried = _.curry(abc);
	     *
	     * curried(1)(2)(3);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2)(3);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2, 3);
	     * // => [1, 2, 3]
	     *
	     * // Curried with placeholders.
	     * curried(1)(_, 3)(2);
	     * // => [1, 2, 3]
	     */
	    function curry(func, arity, guard) {
	      arity = guard ? undefined : arity;
	      var result = createWrapper(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
	      result.placeholder = lodash.placeholder || curry.placeholder;
	      return result;
	    }
	
	    /**
	     * This method is like `_.curry` except that arguments are applied to `func`
	     * in the manner of `_.partialRight` instead of `_.partial`.
	     *
	     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for provided arguments.
	     *
	     * **Note:** This method doesn't set the "length" property of curried functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var abc = function(a, b, c) {
	     *   return [a, b, c];
	     * };
	     *
	     * var curried = _.curryRight(abc);
	     *
	     * curried(3)(2)(1);
	     * // => [1, 2, 3]
	     *
	     * curried(2, 3)(1);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2, 3);
	     * // => [1, 2, 3]
	     *
	     * // Curried with placeholders.
	     * curried(3)(1, _)(2);
	     * // => [1, 2, 3]
	     */
	    function curryRight(func, arity, guard) {
	      arity = guard ? undefined : arity;
	      var result = createWrapper(func, CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
	      result.placeholder = lodash.placeholder || curryRight.placeholder;
	      return result;
	    }
	
	    /**
	     * Creates a debounced function that delays invoking `func` until after `wait`
	     * milliseconds have elapsed since the last time the debounced function was
	     * invoked. The debounced function comes with a `cancel` method to cancel
	     * delayed `func` invocations and a `flush` method to immediately invoke them.
	     * Provide an options object to indicate whether `func` should be invoked on
	     * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	     * with the last arguments provided to the debounced function. Subsequent calls
	     * to the debounced function return the result of the last `func` invocation.
	     *
	     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	     * on the trailing edge of the timeout only if the debounced function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	     * for details over the differences between `_.debounce` and `_.throttle`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to debounce.
	     * @param {number} [wait=0] The number of milliseconds to delay.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=false] Specify invoking on the leading
	     *  edge of the timeout.
	     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	     *  delayed before it's invoked.
	     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	     *  edge of the timeout.
	     * @returns {Function} Returns the new debounced function.
	     * @example
	     *
	     * // Avoid costly calculations while the window size is in flux.
	     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	     *
	     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	     * jQuery(element).on('click', _.debounce(sendMail, 300, {
	     *   'leading': true,
	     *   'trailing': false
	     * }));
	     *
	     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	     * var source = new EventSource('/stream');
	     * jQuery(source).on('message', debounced);
	     *
	     * // Cancel the trailing debounced invocation.
	     * jQuery(window).on('popstate', debounced.cancel);
	     */
	    function debounce(func, wait, options) {
	      var args,
	          maxTimeoutId,
	          result,
	          stamp,
	          thisArg,
	          timeoutId,
	          trailingCall,
	          lastCalled = 0,
	          leading = false,
	          maxWait = false,
	          trailing = true;
	
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      wait = toNumber(wait) || 0;
	      if (isObject(options)) {
	        leading = !!options.leading;
	        maxWait = 'maxWait' in options && nativeMax(toNumber(options.maxWait) || 0, wait);
	        trailing = 'trailing' in options ? !!options.trailing : trailing;
	      }
	
	      function cancel() {
	        if (timeoutId) {
	          clearTimeout(timeoutId);
	        }
	        if (maxTimeoutId) {
	          clearTimeout(maxTimeoutId);
	        }
	        lastCalled = 0;
	        args = maxTimeoutId = thisArg = timeoutId = trailingCall = undefined;
	      }
	
	      function complete(isCalled, id) {
	        if (id) {
	          clearTimeout(id);
	        }
	        maxTimeoutId = timeoutId = trailingCall = undefined;
	        if (isCalled) {
	          lastCalled = now();
	          result = func.apply(thisArg, args);
	          if (!timeoutId && !maxTimeoutId) {
	            args = thisArg = undefined;
	          }
	        }
	      }
	
	      function delayed() {
	        var remaining = wait - (now() - stamp);
	        if (remaining <= 0 || remaining > wait) {
	          complete(trailingCall, maxTimeoutId);
	        } else {
	          timeoutId = setTimeout(delayed, remaining);
	        }
	      }
	
	      function flush() {
	        if ((timeoutId && trailingCall) || (maxTimeoutId && trailing)) {
	          result = func.apply(thisArg, args);
	        }
	        cancel();
	        return result;
	      }
	
	      function maxDelayed() {
	        complete(trailing, timeoutId);
	      }
	
	      function debounced() {
	        args = arguments;
	        stamp = now();
	        thisArg = this;
	        trailingCall = trailing && (timeoutId || !leading);
	
	        if (maxWait === false) {
	          var leadingCall = leading && !timeoutId;
	        } else {
	          if (!maxTimeoutId && !leading) {
	            lastCalled = stamp;
	          }
	          var remaining = maxWait - (stamp - lastCalled),
	              isCalled = remaining <= 0 || remaining > maxWait;
	
	          if (isCalled) {
	            if (maxTimeoutId) {
	              maxTimeoutId = clearTimeout(maxTimeoutId);
	            }
	            lastCalled = stamp;
	            result = func.apply(thisArg, args);
	          }
	          else if (!maxTimeoutId) {
	            maxTimeoutId = setTimeout(maxDelayed, remaining);
	          }
	        }
	        if (isCalled && timeoutId) {
	          timeoutId = clearTimeout(timeoutId);
	        }
	        else if (!timeoutId && wait !== maxWait) {
	          timeoutId = setTimeout(delayed, wait);
	        }
	        if (leadingCall) {
	          isCalled = true;
	          result = func.apply(thisArg, args);
	        }
	        if (isCalled && !timeoutId && !maxTimeoutId) {
	          args = thisArg = undefined;
	        }
	        return result;
	      }
	      debounced.cancel = cancel;
	      debounced.flush = flush;
	      return debounced;
	    }
	
	    /**
	     * Defers invoking the `func` until the current call stack has cleared. Any
	     * additional arguments are provided to `func` when it's invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to defer.
	     * @param {...*} [args] The arguments to invoke `func` with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.defer(function(text) {
	     *   console.log(text);
	     * }, 'deferred');
	     * // => logs 'deferred' after one or more milliseconds
	     */
	    var defer = rest(function(func, args) {
	      return baseDelay(func, 1, args);
	    });
	
	    /**
	     * Invokes `func` after `wait` milliseconds. Any additional arguments are
	     * provided to `func` when it's invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay invocation.
	     * @param {...*} [args] The arguments to invoke `func` with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.delay(function(text) {
	     *   console.log(text);
	     * }, 1000, 'later');
	     * // => logs 'later' after one second
	     */
	    var delay = rest(function(func, wait, args) {
	      return baseDelay(func, toNumber(wait) || 0, args);
	    });
	
	    /**
	     * Creates a function that invokes `func` with arguments reversed.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to flip arguments for.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var flipped = _.flip(function() {
	     *   return _.toArray(arguments);
	     * });
	     *
	     * flipped('a', 'b', 'c', 'd');
	     * // => ['d', 'c', 'b', 'a']
	     */
	    function flip(func) {
	      return createWrapper(func, FLIP_FLAG);
	    }
	
	    /**
	     * Creates a function that memoizes the result of `func`. If `resolver` is
	     * provided it determines the cache key for storing the result based on the
	     * arguments provided to the memoized function. By default, the first argument
	     * provided to the memoized function is used as the map cache key. The `func`
	     * is invoked with the `this` binding of the memoized function.
	     *
	     * **Note:** The cache is exposed as the `cache` property on the memoized
	     * function. Its creation may be customized by replacing the `_.memoize.Cache`
	     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
	     * method interface of `delete`, `get`, `has`, and `set`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to have its output memoized.
	     * @param {Function} [resolver] The function to resolve the cache key.
	     * @returns {Function} Returns the new memoizing function.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': 2 };
	     * var other = { 'c': 3, 'd': 4 };
	     *
	     * var values = _.memoize(_.values);
	     * values(object);
	     * // => [1, 2]
	     *
	     * values(other);
	     * // => [3, 4]
	     *
	     * object.a = 2;
	     * values(object);
	     * // => [1, 2]
	     *
	     * // Modify the result cache.
	     * values.cache.set(object, ['a', 'b']);
	     * values(object);
	     * // => ['a', 'b']
	     *
	     * // Replace `_.memoize.Cache`.
	     * _.memoize.Cache = WeakMap;
	     */
	    function memoize(func, resolver) {
	      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var memoized = function() {
	        var args = arguments,
	            key = resolver ? resolver.apply(this, args) : args[0],
	            cache = memoized.cache;
	
	        if (cache.has(key)) {
	          return cache.get(key);
	        }
	        var result = func.apply(this, args);
	        memoized.cache = cache.set(key, result);
	        return result;
	      };
	      memoized.cache = new memoize.Cache;
	      return memoized;
	    }
	
	    /**
	     * Creates a function that negates the result of the predicate `func`. The
	     * `func` predicate is invoked with the `this` binding and arguments of the
	     * created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} predicate The predicate to negate.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function isEven(n) {
	     *   return n % 2 == 0;
	     * }
	     *
	     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
	     * // => [1, 3, 5]
	     */
	    function negate(predicate) {
	      if (typeof predicate != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return function() {
	        return !predicate.apply(this, arguments);
	      };
	    }
	
	    /**
	     * Creates a function that is restricted to invoking `func` once. Repeat calls
	     * to the function return the value of the first invocation. The `func` is
	     * invoked with the `this` binding and arguments of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var initialize = _.once(createApplication);
	     * initialize();
	     * initialize();
	     * // `initialize` invokes `createApplication` once
	     */
	    function once(func) {
	      return before(2, func);
	    }
	
	    /**
	     * Creates a function that invokes `func` with arguments transformed by
	     * corresponding `transforms`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to wrap.
	     * @param {...(Function|Function[])} [transforms] The functions to transform
	     * arguments, specified individually or in arrays.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function doubled(n) {
	     *   return n * 2;
	     * }
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var func = _.overArgs(function(x, y) {
	     *   return [x, y];
	     * }, square, doubled);
	     *
	     * func(9, 3);
	     * // => [81, 6]
	     *
	     * func(10, 5);
	     * // => [100, 10]
	     */
	    var overArgs = rest(function(func, transforms) {
	      transforms = arrayMap(baseFlatten(transforms), getIteratee());
	
	      var funcsLength = transforms.length;
	      return rest(function(args) {
	        var index = -1,
	            length = nativeMin(args.length, funcsLength);
	
	        while (++index < length) {
	          args[index] = transforms[index].call(this, args[index]);
	        }
	        return apply(func, this, args);
	      });
	    });
	
	    /**
	     * Creates a function that invokes `func` with `partial` arguments prepended
	     * to those provided to the new function. This method is like `_.bind` except
	     * it does **not** alter the `this` binding.
	     *
	     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** This method doesn't set the "length" property of partially
	     * applied functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) {
	     *   return greeting + ' ' + name;
	     * };
	     *
	     * var sayHelloTo = _.partial(greet, 'hello');
	     * sayHelloTo('fred');
	     * // => 'hello fred'
	     *
	     * // Partially applied with placeholders.
	     * var greetFred = _.partial(greet, _, 'fred');
	     * greetFred('hi');
	     * // => 'hi fred'
	     */
	    var partial = rest(function(func, partials) {
	      var placeholder = lodash.placeholder || partial.placeholder,
	          holders = replaceHolders(partials, placeholder);
	
	      return createWrapper(func, PARTIAL_FLAG, undefined, partials, holders);
	    });
	
	    /**
	     * This method is like `_.partial` except that partially applied arguments
	     * are appended to those provided to the new function.
	     *
	     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** This method doesn't set the "length" property of partially
	     * applied functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) {
	     *   return greeting + ' ' + name;
	     * };
	     *
	     * var greetFred = _.partialRight(greet, 'fred');
	     * greetFred('hi');
	     * // => 'hi fred'
	     *
	     * // Partially applied with placeholders.
	     * var sayHelloTo = _.partialRight(greet, 'hello', _);
	     * sayHelloTo('fred');
	     * // => 'hello fred'
	     */
	    var partialRight = rest(function(func, partials) {
	      var placeholder = lodash.placeholder || partialRight.placeholder,
	          holders = replaceHolders(partials, placeholder);
	
	      return createWrapper(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders);
	    });
	
	    /**
	     * Creates a function that invokes `func` with arguments arranged according
	     * to the specified indexes where the argument value at the first index is
	     * provided as the first argument, the argument value at the second index is
	     * provided as the second argument, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to rearrange arguments for.
	     * @param {...(number|number[])} indexes The arranged argument indexes,
	     *  specified individually or in arrays.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var rearged = _.rearg(function(a, b, c) {
	     *   return [a, b, c];
	     * }, 2, 0, 1);
	     *
	     * rearged('b', 'c', 'a')
	     * // => ['a', 'b', 'c']
	     */
	    var rearg = rest(function(func, indexes) {
	      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
	    });
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of the
	     * created function and arguments from `start` and beyond provided as an array.
	     *
	     * **Note:** This method is based on the [rest parameter](https://mdn.io/rest_parameters).
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to apply a rest parameter to.
	     * @param {number} [start=func.length-1] The start position of the rest parameter.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var say = _.rest(function(what, names) {
	     *   return what + ' ' + _.initial(names).join(', ') +
	     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	     * });
	     *
	     * say('hello', 'fred', 'barney', 'pebbles');
	     * // => 'hello fred, barney, & pebbles'
	     */
	    function rest(func, start) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
	      return function() {
	        var args = arguments,
	            index = -1,
	            length = nativeMax(args.length - start, 0),
	            array = Array(length);
	
	        while (++index < length) {
	          array[index] = args[start + index];
	        }
	        switch (start) {
	          case 0: return func.call(this, array);
	          case 1: return func.call(this, args[0], array);
	          case 2: return func.call(this, args[0], args[1], array);
	        }
	        var otherArgs = Array(start + 1);
	        index = -1;
	        while (++index < start) {
	          otherArgs[index] = args[index];
	        }
	        otherArgs[start] = array;
	        return apply(func, this, otherArgs);
	      };
	    }
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of the created
	     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
	     *
	     * **Note:** This method is based on the [spread operator](https://mdn.io/spread_operator).
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to spread arguments over.
	     * @param {number} [start=0] The start position of the spread.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var say = _.spread(function(who, what) {
	     *   return who + ' says ' + what;
	     * });
	     *
	     * say(['fred', 'hello']);
	     * // => 'fred says hello'
	     *
	     * var numbers = Promise.all([
	     *   Promise.resolve(40),
	     *   Promise.resolve(36)
	     * ]);
	     *
	     * numbers.then(_.spread(function(x, y) {
	     *   return x + y;
	     * }));
	     * // => a Promise of 76
	     */
	    function spread(func, start) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      start = start === undefined ? 0 : nativeMax(toInteger(start), 0);
	      return rest(function(args) {
	        var array = args[start],
	            otherArgs = args.slice(0, start);
	
	        if (array) {
	          arrayPush(otherArgs, array);
	        }
	        return apply(func, this, otherArgs);
	      });
	    }
	
	    /**
	     * Creates a throttled function that only invokes `func` at most once per
	     * every `wait` milliseconds. The throttled function comes with a `cancel`
	     * method to cancel delayed `func` invocations and a `flush` method to
	     * immediately invoke them. Provide an options object to indicate whether
	     * `func` should be invoked on the leading and/or trailing edge of the `wait`
	     * timeout. The `func` is invoked with the last arguments provided to the
	     * throttled function. Subsequent calls to the throttled function return the
	     * result of the last `func` invocation.
	     *
	     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	     * on the trailing edge of the timeout only if the throttled function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	     * for details over the differences between `_.throttle` and `_.debounce`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to throttle.
	     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=true] Specify invoking on the leading
	     *  edge of the timeout.
	     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	     *  edge of the timeout.
	     * @returns {Function} Returns the new throttled function.
	     * @example
	     *
	     * // Avoid excessively updating the position while scrolling.
	     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	     *
	     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
	     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
	     * jQuery(element).on('click', throttled);
	     *
	     * // Cancel the trailing throttled invocation.
	     * jQuery(window).on('popstate', throttled.cancel);
	     */
	    function throttle(func, wait, options) {
	      var leading = true,
	          trailing = true;
	
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      if (isObject(options)) {
	        leading = 'leading' in options ? !!options.leading : leading;
	        trailing = 'trailing' in options ? !!options.trailing : trailing;
	      }
	      return debounce(func, wait, { 'leading': leading, 'maxWait': wait, 'trailing': trailing });
	    }
	
	    /**
	     * Creates a function that accepts up to one argument, ignoring any
	     * additional arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to cap arguments for.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * _.map(['6', '8', '10'], _.unary(parseInt));
	     * // => [6, 8, 10]
	     */
	    function unary(func) {
	      return ary(func, 1);
	    }
	
	    /**
	     * Creates a function that provides `value` to the wrapper function as its
	     * first argument. Any additional arguments provided to the function are
	     * appended to those provided to the wrapper function. The wrapper is invoked
	     * with the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {*} value The value to wrap.
	     * @param {Function} wrapper The wrapper function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var p = _.wrap(_.escape, function(func, text) {
	     *   return '<p>' + func(text) + '</p>';
	     * });
	     *
	     * p('fred, barney, & pebbles');
	     * // => '<p>fred, barney, &amp; pebbles</p>'
	     */
	    function wrap(value, wrapper) {
	      wrapper = wrapper == null ? identity : wrapper;
	      return partial(wrapper, value);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a shallow clone of `value`.
	     *
	     * **Note:** This method is loosely based on the
	     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
	     * and supports cloning arrays, array buffers, booleans, date objects, maps,
	     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
	     * arrays. The own enumerable properties of `arguments` objects are cloned
	     * as plain objects. An empty object is returned for uncloneable values such
	     * as error objects, functions, DOM nodes, and WeakMaps.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to clone.
	     * @returns {*} Returns the cloned value.
	     * @example
	     *
	     * var objects = [{ 'a': 1 }, { 'b': 2 }];
	     *
	     * var shallow = _.clone(objects);
	     * console.log(shallow[0] === objects[0]);
	     * // => true
	     */
	    function clone(value) {
	      return baseClone(value);
	    }
	
	    /**
	     * This method is like `_.clone` except that it accepts `customizer` which
	     * is invoked to produce the cloned value. If `customizer` returns `undefined`
	     * cloning is handled by the method instead. The `customizer` is invoked with
	     * up to four arguments; (value [, index|key, object, stack]).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to clone.
	     * @param {Function} [customizer] The function to customize cloning.
	     * @returns {*} Returns the cloned value.
	     * @example
	     *
	     * function customizer(value) {
	     *   if (_.isElement(value)) {
	     *     return value.cloneNode(false);
	     *   }
	     * }
	     *
	     * var el = _.cloneWith(document.body, customizer);
	     *
	     * console.log(el === document.body);
	     * // => false
	     * console.log(el.nodeName);
	     * // => 'BODY'
	     * console.log(el.childNodes.length);
	     * // => 0
	     */
	    function cloneWith(value, customizer) {
	      return baseClone(value, false, customizer);
	    }
	
	    /**
	     * This method is like `_.clone` except that it recursively clones `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to recursively clone.
	     * @returns {*} Returns the deep cloned value.
	     * @example
	     *
	     * var objects = [{ 'a': 1 }, { 'b': 2 }];
	     *
	     * var deep = _.cloneDeep(objects);
	     * console.log(deep[0] === objects[0]);
	     * // => false
	     */
	    function cloneDeep(value) {
	      return baseClone(value, true);
	    }
	
	    /**
	     * This method is like `_.cloneWith` except that it recursively clones `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to recursively clone.
	     * @param {Function} [customizer] The function to customize cloning.
	     * @returns {*} Returns the deep cloned value.
	     * @example
	     *
	     * function customizer(value) {
	     *   if (_.isElement(value)) {
	     *     return value.cloneNode(true);
	     *   }
	     * }
	     *
	     * var el = _.cloneDeepWith(document.body, customizer);
	     *
	     * console.log(el === document.body);
	     * // => false
	     * console.log(el.nodeName);
	     * // => 'BODY'
	     * console.log(el.childNodes.length);
	     * // => 20
	     */
	    function cloneDeepWith(value, customizer) {
	      return baseClone(value, true, customizer);
	    }
	
	    /**
	     * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * comparison between two values to determine if they are equivalent.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var other = { 'user': 'fred' };
	     *
	     * _.eq(object, object);
	     * // => true
	     *
	     * _.eq(object, other);
	     * // => false
	     *
	     * _.eq('a', 'a');
	     * // => true
	     *
	     * _.eq('a', Object('a'));
	     * // => false
	     *
	     * _.eq(NaN, NaN);
	     * // => true
	     */
	    function eq(value, other) {
	      return value === other || (value !== value && other !== other);
	    }
	
	    /**
	     * Checks if `value` is greater than `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
	     * @example
	     *
	     * _.gt(3, 1);
	     * // => true
	     *
	     * _.gt(3, 3);
	     * // => false
	     *
	     * _.gt(1, 3);
	     * // => false
	     */
	    function gt(value, other) {
	      return value > other;
	    }
	
	    /**
	     * Checks if `value` is greater than or equal to `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
	     * @example
	     *
	     * _.gte(3, 1);
	     * // => true
	     *
	     * _.gte(3, 3);
	     * // => true
	     *
	     * _.gte(1, 3);
	     * // => false
	     */
	    function gte(value, other) {
	      return value >= other;
	    }
	
	    /**
	     * Checks if `value` is likely an `arguments` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isArguments(function() { return arguments; }());
	     * // => true
	     *
	     * _.isArguments([1, 2, 3]);
	     * // => false
	     */
	    function isArguments(value) {
	      // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	        (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	    }
	
	    /**
	     * Checks if `value` is classified as an `Array` object.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isArray([1, 2, 3]);
	     * // => true
	     *
	     * _.isArray(document.body.children);
	     * // => false
	     *
	     * _.isArray('abc');
	     * // => false
	     *
	     * _.isArray(_.noop);
	     * // => false
	     */
	    var isArray = Array.isArray;
	
	    /**
	     * Checks if `value` is array-like. A value is considered array-like if it's
	     * not a function and has a `value.length` that's an integer greater than or
	     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	     * @example
	     *
	     * _.isArrayLike([1, 2, 3]);
	     * // => true
	     *
	     * _.isArrayLike(document.body.children);
	     * // => true
	     *
	     * _.isArrayLike('abc');
	     * // => true
	     *
	     * _.isArrayLike(_.noop);
	     * // => false
	     */
	    function isArrayLike(value) {
	      return value != null &&
	        !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
	    }
	
	    /**
	     * This method is like `_.isArrayLike` except that it also checks if `value`
	     * is an object.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
	     * @example
	     *
	     * _.isArrayLikeObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isArrayLikeObject(document.body.children);
	     * // => true
	     *
	     * _.isArrayLikeObject('abc');
	     * // => false
	     *
	     * _.isArrayLikeObject(_.noop);
	     * // => false
	     */
	    function isArrayLikeObject(value) {
	      return isObjectLike(value) && isArrayLike(value);
	    }
	
	    /**
	     * Checks if `value` is classified as a boolean primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isBoolean(false);
	     * // => true
	     *
	     * _.isBoolean(null);
	     * // => false
	     */
	    function isBoolean(value) {
	      return value === true || value === false ||
	        (isObjectLike(value) && objectToString.call(value) == boolTag);
	    }
	
	    /**
	     * Checks if `value` is classified as a `Date` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isDate(new Date);
	     * // => true
	     *
	     * _.isDate('Mon April 23 2012');
	     * // => false
	     */
	    function isDate(value) {
	      return isObjectLike(value) && objectToString.call(value) == dateTag;
	    }
	
	    /**
	     * Checks if `value` is likely a DOM element.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
	     * @example
	     *
	     * _.isElement(document.body);
	     * // => true
	     *
	     * _.isElement('<body>');
	     * // => false
	     */
	    function isElement(value) {
	      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
	    }
	
	    /**
	     * Checks if `value` is empty. A value is considered empty unless it's an
	     * `arguments` object, array, string, or jQuery-like collection with a length
	     * greater than `0` or an object with own enumerable properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Array|Object|string} value The value to inspect.
	     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	     * @example
	     *
	     * _.isEmpty(null);
	     * // => true
	     *
	     * _.isEmpty(true);
	     * // => true
	     *
	     * _.isEmpty(1);
	     * // => true
	     *
	     * _.isEmpty([1, 2, 3]);
	     * // => false
	     *
	     * _.isEmpty({ 'a': 1 });
	     * // => false
	     */
	    function isEmpty(value) {
	      if (isArrayLike(value) &&
	          (isArray(value) || isString(value) || isFunction(value.splice) || isArguments(value))) {
	        return !value.length;
	      }
	      for (var key in value) {
	        if (hasOwnProperty.call(value, key)) {
	          return false;
	        }
	      }
	      return true;
	    }
	
	    /**
	     * Performs a deep comparison between two values to determine if they are
	     * equivalent.
	     *
	     * **Note:** This method supports comparing arrays, array buffers, booleans,
	     * date objects, error objects, maps, numbers, `Object` objects, regexes,
	     * sets, strings, symbols, and typed arrays. `Object` objects are compared
	     * by their own, not inherited, enumerable properties. Functions and DOM
	     * nodes are **not** supported.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var other = { 'user': 'fred' };
	     *
	     * _.isEqual(object, other);
	     * // => true
	     *
	     * object === other;
	     * // => false
	     */
	    function isEqual(value, other) {
	      return baseIsEqual(value, other);
	    }
	
	    /**
	     * This method is like `_.isEqual` except that it accepts `customizer` which is
	     * invoked to compare values. If `customizer` returns `undefined` comparisons are
	     * handled by the method instead. The `customizer` is invoked with up to six arguments:
	     * (objValue, othValue [, index|key, object, other, stack]).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * function isGreeting(value) {
	     *   return /^h(?:i|ello)$/.test(value);
	     * }
	     *
	     * function customizer(objValue, othValue) {
	     *   if (isGreeting(objValue) && isGreeting(othValue)) {
	     *     return true;
	     *   }
	     * }
	     *
	     * var array = ['hello', 'goodbye'];
	     * var other = ['hi', 'goodbye'];
	     *
	     * _.isEqualWith(array, other, customizer);
	     * // => true
	     */
	    function isEqualWith(value, other, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined;
	      var result = customizer ? customizer(value, other) : undefined;
	      return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
	    }
	
	    /**
	     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
	     * `SyntaxError`, `TypeError`, or `URIError` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
	     * @example
	     *
	     * _.isError(new Error);
	     * // => true
	     *
	     * _.isError(Error);
	     * // => false
	     */
	    function isError(value) {
	      return isObjectLike(value) &&
	        typeof value.message == 'string' && objectToString.call(value) == errorTag;
	    }
	
	    /**
	     * Checks if `value` is a finite primitive number.
	     *
	     * **Note:** This method is based on [`Number.isFinite`](https://mdn.io/Number/isFinite).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
	     * @example
	     *
	     * _.isFinite(3);
	     * // => true
	     *
	     * _.isFinite(Number.MAX_VALUE);
	     * // => true
	     *
	     * _.isFinite(3.14);
	     * // => true
	     *
	     * _.isFinite(Infinity);
	     * // => false
	     */
	    function isFinite(value) {
	      return typeof value == 'number' && nativeIsFinite(value);
	    }
	
	    /**
	     * Checks if `value` is classified as a `Function` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isFunction(_);
	     * // => true
	     *
	     * _.isFunction(/abc/);
	     * // => false
	     */
	    function isFunction(value) {
	      // The use of `Object#toString` avoids issues with the `typeof` operator
	      // in Safari 8 which returns 'object' for typed array constructors, and
	      // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	      var tag = isObject(value) ? objectToString.call(value) : '';
	      return tag == funcTag || tag == genTag;
	    }
	
	    /**
	     * Checks if `value` is an integer.
	     *
	     * **Note:** This method is based on [`Number.isInteger`](https://mdn.io/Number/isInteger).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
	     * @example
	     *
	     * _.isInteger(3);
	     * // => true
	     *
	     * _.isInteger(Number.MIN_VALUE);
	     * // => false
	     *
	     * _.isInteger(Infinity);
	     * // => false
	     *
	     * _.isInteger('3');
	     * // => false
	     */
	    function isInteger(value) {
	      return typeof value == 'number' && value == toInteger(value);
	    }
	
	    /**
	     * Checks if `value` is a valid array-like length.
	     *
	     * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	     * @example
	     *
	     * _.isLength(3);
	     * // => true
	     *
	     * _.isLength(Number.MIN_VALUE);
	     * // => false
	     *
	     * _.isLength(Infinity);
	     * // => false
	     *
	     * _.isLength('3');
	     * // => false
	     */
	    function isLength(value) {
	      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	    }
	
	    /**
	     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	     * @example
	     *
	     * _.isObject({});
	     * // => true
	     *
	     * _.isObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isObject(_.noop);
	     * // => true
	     *
	     * _.isObject(null);
	     * // => false
	     */
	    function isObject(value) {
	      var type = typeof value;
	      return !!value && (type == 'object' || type == 'function');
	    }
	
	    /**
	     * Checks if `value` is object-like. A value is object-like if it's not `null`
	     * and has a `typeof` result of "object".
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	     * @example
	     *
	     * _.isObjectLike({});
	     * // => true
	     *
	     * _.isObjectLike([1, 2, 3]);
	     * // => true
	     *
	     * _.isObjectLike(_.noop);
	     * // => false
	     *
	     * _.isObjectLike(null);
	     * // => false
	     */
	    function isObjectLike(value) {
	      return !!value && typeof value == 'object';
	    }
	
	    /**
	     * Performs a deep comparison between `object` and `source` to determine if
	     * `object` contains equivalent property values.
	     *
	     * **Note:** This method supports comparing the same values as `_.isEqual`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Object} object The object to inspect.
	     * @param {Object} source The object of property values to match.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred', 'age': 40 };
	     *
	     * _.isMatch(object, { 'age': 40 });
	     * // => true
	     *
	     * _.isMatch(object, { 'age': 36 });
	     * // => false
	     */
	    function isMatch(object, source) {
	      return object === source || baseIsMatch(object, source, getMatchData(source));
	    }
	
	    /**
	     * This method is like `_.isMatch` except that it accepts `customizer` which
	     * is invoked to compare values. If `customizer` returns `undefined` comparisons
	     * are handled by the method instead. The `customizer` is invoked with five
	     * arguments: (objValue, srcValue, index|key, object, source).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Object} object The object to inspect.
	     * @param {Object} source The object of property values to match.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     * @example
	     *
	     * function isGreeting(value) {
	     *   return /^h(?:i|ello)$/.test(value);
	     * }
	     *
	     * function customizer(objValue, srcValue) {
	     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
	     *     return true;
	     *   }
	     * }
	     *
	     * var object = { 'greeting': 'hello' };
	     * var source = { 'greeting': 'hi' };
	     *
	     * _.isMatchWith(object, source, customizer);
	     * // => true
	     */
	    function isMatchWith(object, source, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined;
	      return baseIsMatch(object, source, getMatchData(source), customizer);
	    }
	
	    /**
	     * Checks if `value` is `NaN`.
	     *
	     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
	     * which returns `true` for `undefined` and other non-numeric values.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	     * @example
	     *
	     * _.isNaN(NaN);
	     * // => true
	     *
	     * _.isNaN(new Number(NaN));
	     * // => true
	     *
	     * isNaN(undefined);
	     * // => true
	     *
	     * _.isNaN(undefined);
	     * // => false
	     */
	    function isNaN(value) {
	      // An `NaN` primitive is the only value that is not equal to itself.
	      // Perform the `toStringTag` check first to avoid errors with some ActiveX objects in IE.
	      return isNumber(value) && value != +value;
	    }
	
	    /**
	     * Checks if `value` is a native function.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	     * @example
	     *
	     * _.isNative(Array.prototype.push);
	     * // => true
	     *
	     * _.isNative(_);
	     * // => false
	     */
	    function isNative(value) {
	      if (value == null) {
	        return false;
	      }
	      if (isFunction(value)) {
	        return reIsNative.test(funcToString.call(value));
	      }
	      return isObjectLike(value) &&
	        (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
	    }
	
	    /**
	     * Checks if `value` is `null`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
	     * @example
	     *
	     * _.isNull(null);
	     * // => true
	     *
	     * _.isNull(void 0);
	     * // => false
	     */
	    function isNull(value) {
	      return value === null;
	    }
	
	    /**
	     * Checks if `value` is `null` or `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
	     * @example
	     *
	     * _.isNil(null);
	     * // => true
	     *
	     * _.isNil(void 0);
	     * // => true
	     *
	     * _.isNil(NaN);
	     * // => false
	     */
	    function isNil(value) {
	      return value == null;
	    }
	
	    /**
	     * Checks if `value` is classified as a `Number` primitive or object.
	     *
	     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
	     * as numbers, use the `_.isFinite` method.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isNumber(3);
	     * // => true
	     *
	     * _.isNumber(Number.MIN_VALUE);
	     * // => true
	     *
	     * _.isNumber(Infinity);
	     * // => true
	     *
	     * _.isNumber('3');
	     * // => false
	     */
	    function isNumber(value) {
	      return typeof value == 'number' ||
	        (isObjectLike(value) && objectToString.call(value) == numberTag);
	    }
	
	    /**
	     * Checks if `value` is a plain object, that is, an object created by the
	     * `Object` constructor or one with a `[[Prototype]]` of `null`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     * }
	     *
	     * _.isPlainObject(new Foo);
	     * // => false
	     *
	     * _.isPlainObject([1, 2, 3]);
	     * // => false
	     *
	     * _.isPlainObject({ 'x': 0, 'y': 0 });
	     * // => true
	     *
	     * _.isPlainObject(Object.create(null));
	     * // => true
	     */
	    function isPlainObject(value) {
	      if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
	        return false;
	      }
	      var proto = objectProto;
	      if (typeof value.constructor == 'function') {
	        proto = getPrototypeOf(value);
	      }
	      if (proto === null) {
	        return true;
	      }
	      var Ctor = proto.constructor;
	      return (typeof Ctor == 'function' &&
	        Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	    }
	
	    /**
	     * Checks if `value` is classified as a `RegExp` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isRegExp(/abc/);
	     * // => true
	     *
	     * _.isRegExp('/abc/');
	     * // => false
	     */
	    function isRegExp(value) {
	      return isObject(value) && objectToString.call(value) == regexpTag;
	    }
	
	    /**
	     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
	     * double precision number which isn't the result of a rounded unsafe integer.
	     *
	     * **Note:** This method is based on [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
	     * @example
	     *
	     * _.isSafeInteger(3);
	     * // => true
	     *
	     * _.isSafeInteger(Number.MIN_VALUE);
	     * // => false
	     *
	     * _.isSafeInteger(Infinity);
	     * // => false
	     *
	     * _.isSafeInteger('3');
	     * // => false
	     */
	    function isSafeInteger(value) {
	      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
	    }
	
	    /**
	     * Checks if `value` is classified as a `String` primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isString('abc');
	     * // => true
	     *
	     * _.isString(1);
	     * // => false
	     */
	    function isString(value) {
	      return typeof value == 'string' ||
	        (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
	    }
	
	    /**
	     * Checks if `value` is classified as a `Symbol` primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isSymbol(Symbol.iterator);
	     * // => true
	     *
	     * _.isSymbol('abc');
	     * // => false
	     */
	    function isSymbol(value) {
	      return typeof value == 'symbol' ||
	        (isObjectLike(value) && objectToString.call(value) == symbolTag);
	    }
	
	    /**
	     * Checks if `value` is classified as a typed array.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isTypedArray(new Uint8Array);
	     * // => true
	     *
	     * _.isTypedArray([]);
	     * // => false
	     */
	    function isTypedArray(value) {
	      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
	    }
	
	    /**
	     * Checks if `value` is `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	     * @example
	     *
	     * _.isUndefined(void 0);
	     * // => true
	     *
	     * _.isUndefined(null);
	     * // => false
	     */
	    function isUndefined(value) {
	      return value === undefined;
	    }
	
	    /**
	     * Checks if `value` is less than `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
	     * @example
	     *
	     * _.lt(1, 3);
	     * // => true
	     *
	     * _.lt(3, 3);
	     * // => false
	     *
	     * _.lt(3, 1);
	     * // => false
	     */
	    function lt(value, other) {
	      return value < other;
	    }
	
	    /**
	     * Checks if `value` is less than or equal to `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
	     * @example
	     *
	     * _.lte(1, 3);
	     * // => true
	     *
	     * _.lte(3, 3);
	     * // => true
	     *
	     * _.lte(3, 1);
	     * // => false
	     */
	    function lte(value, other) {
	      return value <= other;
	    }
	
	    /**
	     * Converts `value` to an array.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {Array} Returns the converted array.
	     * @example
	     *
	     * _.toArray({ 'a': 1, 'b': 2 });
	     * // => [1, 2]
	     *
	     * _.toArray('abc');
	     * // => ['a', 'b', 'c']
	     *
	     * _.toArray(1);
	     * // => []
	     *
	     * _.toArray(null);
	     * // => []
	     */
	    function toArray(value) {
	      if (!value) {
	        return [];
	      }
	      if (isArrayLike(value)) {
	        return isString(value) ? stringToArray(value) : copyArray(value);
	      }
	      if (iteratorSymbol && value[iteratorSymbol]) {
	        return iteratorToArray(value[iteratorSymbol]());
	      }
	      var tag = getTag(value),
	          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);
	
	      return func(value);
	    }
	
	    /**
	     * Converts `value` to an integer.
	     *
	     * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.toInteger(3);
	     * // => 3
	     *
	     * _.toInteger(Number.MIN_VALUE);
	     * // => 0
	     *
	     * _.toInteger(Infinity);
	     * // => 1.7976931348623157e+308
	     *
	     * _.toInteger('3');
	     * // => 3
	     */
	    function toInteger(value) {
	      if (!value) {
	        return value === 0 ? value : 0;
	      }
	      value = toNumber(value);
	      if (value === INFINITY || value === -INFINITY) {
	        var sign = (value < 0 ? -1 : 1);
	        return sign * MAX_INTEGER;
	      }
	      var remainder = value % 1;
	      return value === value ? (remainder ? value - remainder : value) : 0;
	    }
	
	    /**
	     * Converts `value` to an integer suitable for use as the length of an
	     * array-like object.
	     *
	     * **Note:** This method is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.toLength(3);
	     * // => 3
	     *
	     * _.toLength(Number.MIN_VALUE);
	     * // => 0
	     *
	     * _.toLength(Infinity);
	     * // => 4294967295
	     *
	     * _.toLength('3');
	     * // => 3
	     */
	    function toLength(value) {
	      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
	    }
	
	    /**
	     * Converts `value` to a number.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to process.
	     * @returns {number} Returns the number.
	     * @example
	     *
	     * _.toNumber(3);
	     * // => 3
	     *
	     * _.toNumber(Number.MIN_VALUE);
	     * // => 5e-324
	     *
	     * _.toNumber(Infinity);
	     * // => Infinity
	     *
	     * _.toNumber('3');
	     * // => 3
	     */
	    function toNumber(value) {
	      if (isObject(value)) {
	        var other = isFunction(value.valueOf) ? value.valueOf() : value;
	        value = isObject(other) ? (other + '') : other;
	      }
	      if (typeof value != 'string') {
	        return value === 0 ? value : +value;
	      }
	      value = value.replace(reTrim, '');
	      var isBinary = reIsBinary.test(value);
	      return (isBinary || reIsOctal.test(value))
	        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	        : (reIsBadHex.test(value) ? NAN : +value);
	    }
	
	    /**
	     * Converts `value` to a plain object flattening inherited enumerable
	     * properties of `value` to own properties of the plain object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {Object} Returns the converted plain object.
	     * @example
	     *
	     * function Foo() {
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.assign({ 'a': 1 }, new Foo);
	     * // => { 'a': 1, 'b': 2 }
	     *
	     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	     * // => { 'a': 1, 'b': 2, 'c': 3 }
	     */
	    function toPlainObject(value) {
	      return copyObject(value, keysIn(value));
	    }
	
	    /**
	     * Converts `value` to a safe integer. A safe integer can be compared and
	     * represented correctly.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.toSafeInteger(3);
	     * // => 3
	     *
	     * _.toSafeInteger(Number.MIN_VALUE);
	     * // => 0
	     *
	     * _.toSafeInteger(Infinity);
	     * // => 9007199254740991
	     *
	     * _.toSafeInteger('3');
	     * // => 3
	     */
	    function toSafeInteger(value) {
	      return baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
	    }
	
	    /**
	     * Converts `value` to a string if it's not one. An empty string is returned
	     * for `null` and `undefined` values. The sign of `-0` is preserved.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to process.
	     * @returns {string} Returns the string.
	     * @example
	     *
	     * _.toString(null);
	     * // => ''
	     *
	     * _.toString(-0);
	     * // => '-0'
	     *
	     * _.toString([1, 2, 3]);
	     * // => '1,2,3'
	     */
	    function toString(value) {
	      // Exit early for strings to avoid a performance hit in some environments.
	      if (typeof value == 'string') {
	        return value;
	      }
	      if (value == null) {
	        return '';
	      }
	      if (isSymbol(value)) {
	        return Symbol ? symbolToString.call(value) : '';
	      }
	      var result = (value + '');
	      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Assigns own enumerable properties of source objects to the destination
	     * object. Source objects are applied from left to right. Subsequent sources
	     * overwrite property assignments of previous sources.
	     *
	     * **Note:** This method mutates `object` and is loosely based on
	     * [`Object.assign`](https://mdn.io/Object/assign).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.c = 3;
	     * }
	     *
	     * function Bar() {
	     *   this.e = 5;
	     * }
	     *
	     * Foo.prototype.d = 4;
	     * Bar.prototype.f = 6;
	     *
	     * _.assign({ 'a': 1 }, new Foo, new Bar);
	     * // => { 'a': 1, 'c': 3, 'e': 5 }
	     */
	    var assign = createAssigner(function(object, source) {
	      copyObject(source, keys(source), object);
	    });
	
	    /**
	     * This method is like `_.assign` except that it iterates over own and
	     * inherited source properties.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @alias extend
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.b = 2;
	     * }
	     *
	     * function Bar() {
	     *   this.d = 4;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     * Bar.prototype.e = 5;
	     *
	     * _.assignIn({ 'a': 1 }, new Foo, new Bar);
	     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 }
	     */
	    var assignIn = createAssigner(function(object, source) {
	      copyObject(source, keysIn(source), object);
	    });
	
	    /**
	     * This method is like `_.assignIn` except that it accepts `customizer` which
	     * is invoked to produce the assigned values. If `customizer` returns `undefined`
	     * assignment is handled by the method instead. The `customizer` is invoked
	     * with five arguments: (objValue, srcValue, key, object, source).
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @alias extendWith
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} sources The source objects.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function customizer(objValue, srcValue) {
	     *   return _.isUndefined(objValue) ? srcValue : objValue;
	     * }
	     *
	     * var defaults = _.partialRight(_.assignInWith, customizer);
	     *
	     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	     * // => { 'a': 1, 'b': 2 }
	     */
	    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
	      copyObjectWith(source, keysIn(source), object, customizer);
	    });
	
	    /**
	     * This method is like `_.assign` except that it accepts `customizer` which
	     * is invoked to produce the assigned values. If `customizer` returns `undefined`
	     * assignment is handled by the method instead. The `customizer` is invoked
	     * with five arguments: (objValue, srcValue, key, object, source).
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} sources The source objects.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function customizer(objValue, srcValue) {
	     *   return _.isUndefined(objValue) ? srcValue : objValue;
	     * }
	     *
	     * var defaults = _.partialRight(_.assignWith, customizer);
	     *
	     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	     * // => { 'a': 1, 'b': 2 }
	     */
	    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
	      copyObjectWith(source, keys(source), object, customizer);
	    });
	
	    /**
	     * Creates an array of values corresponding to `paths` of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {...(string|string[])} [paths] The property paths of elements to pick,
	     *  specified individually or in arrays.
	     * @returns {Array} Returns the new array of picked elements.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
	     *
	     * _.at(object, ['a[0].b.c', 'a[1]']);
	     * // => [3, 4]
	     *
	     * _.at(['a', 'b', 'c'], 0, 2);
	     * // => ['a', 'c']
	     */
	    var at = rest(function(object, paths) {
	      return baseAt(object, baseFlatten(paths));
	    });
	
	    /**
	     * Creates an object that inherits from the `prototype` object. If a `properties`
	     * object is provided its own enumerable properties are assigned to the created object.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} prototype The object to inherit from.
	     * @param {Object} [properties] The properties to assign to the object.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * function Circle() {
	     *   Shape.call(this);
	     * }
	     *
	     * Circle.prototype = _.create(Shape.prototype, {
	     *   'constructor': Circle
	     * });
	     *
	     * var circle = new Circle;
	     * circle instanceof Circle;
	     * // => true
	     *
	     * circle instanceof Shape;
	     * // => true
	     */
	    function create(prototype, properties) {
	      var result = baseCreate(prototype);
	      return properties ? baseAssign(result, properties) : result;
	    }
	
	    /**
	     * Assigns own and inherited enumerable properties of source objects to the
	     * destination object for all destination properties that resolve to `undefined`.
	     * Source objects are applied from left to right. Once a property is set,
	     * additional values of the same property are ignored.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	     * // => { 'user': 'barney', 'age': 36 }
	     */
	    var defaults = rest(function(args) {
	      args.push(undefined, assignInDefaults);
	      return apply(assignInWith, undefined, args);
	    });
	
	    /**
	     * This method is like `_.defaults` except that it recursively assigns
	     * default properties.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
	     * // => { 'user': { 'name': 'barney', 'age': 36 } }
	     *
	     */
	    var defaultsDeep = rest(function(args) {
	      args.push(undefined, mergeDefaults);
	      return apply(mergeWith, undefined, args);
	    });
	
	    /**
	     * This method is like `_.find` except that it returns the key of the first
	     * element `predicate` returns truthy for instead of the element itself.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
	     * @example
	     *
	     * var users = {
	     *   'barney':  { 'age': 36, 'active': true },
	     *   'fred':    { 'age': 40, 'active': false },
	     *   'pebbles': { 'age': 1,  'active': true }
	     * };
	     *
	     * _.findKey(users, function(o) { return o.age < 40; });
	     * // => 'barney' (iteration order is not guaranteed)
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.findKey(users, { 'age': 1, 'active': true });
	     * // => 'pebbles'
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.findKey(users, ['active', false]);
	     * // => 'fred'
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.findKey(users, 'active');
	     * // => 'barney'
	     */
	    function findKey(object, predicate) {
	      return baseFind(object, getIteratee(predicate, 3), baseForOwn, true);
	    }
	
	    /**
	     * This method is like `_.findKey` except that it iterates over elements of
	     * a collection in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
	     * @example
	     *
	     * var users = {
	     *   'barney':  { 'age': 36, 'active': true },
	     *   'fred':    { 'age': 40, 'active': false },
	     *   'pebbles': { 'age': 1,  'active': true }
	     * };
	     *
	     * _.findLastKey(users, function(o) { return o.age < 40; });
	     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
	     *
	     * // The `_.matches` iteratee shorthand.
	     * _.findLastKey(users, { 'age': 36, 'active': true });
	     * // => 'barney'
	     *
	     * // The `_.matchesProperty` iteratee shorthand.
	     * _.findLastKey(users, ['active', false]);
	     * // => 'fred'
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.findLastKey(users, 'active');
	     * // => 'pebbles'
	     */
	    function findLastKey(object, predicate) {
	      return baseFind(object, getIteratee(predicate, 3), baseForOwnRight, true);
	    }
	
	    /**
	     * Iterates over own and inherited enumerable properties of an object invoking
	     * `iteratee` for each property. The iteratee is invoked with three arguments:
	     * (value, key, object). Iteratee functions may exit iteration early by explicitly
	     * returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forIn(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a', 'b', then 'c' (iteration order is not guaranteed)
	     */
	    function forIn(object, iteratee) {
	      return object == null ? object : baseFor(object, toFunction(iteratee), keysIn);
	    }
	
	    /**
	     * This method is like `_.forIn` except that it iterates over properties of
	     * `object` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forInRight(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'
	     */
	    function forInRight(object, iteratee) {
	      return object == null ? object : baseForRight(object, toFunction(iteratee), keysIn);
	    }
	
	    /**
	     * Iterates over own enumerable properties of an object invoking `iteratee`
	     * for each property. The iteratee is invoked with three arguments:
	     * (value, key, object). Iteratee functions may exit iteration early by
	     * explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forOwn(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a' then 'b' (iteration order is not guaranteed)
	     */
	    function forOwn(object, iteratee) {
	      return object && baseForOwn(object, toFunction(iteratee));
	    }
	
	    /**
	     * This method is like `_.forOwn` except that it iterates over properties of
	     * `object` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forOwnRight(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'
	     */
	    function forOwnRight(object, iteratee) {
	      return object && baseForOwnRight(object, toFunction(iteratee));
	    }
	
	    /**
	     * Creates an array of function property names from own enumerable properties
	     * of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the new array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = _.constant('a');
	     *   this.b = _.constant('b');
	     * }
	     *
	     * Foo.prototype.c = _.constant('c');
	     *
	     * _.functions(new Foo);
	     * // => ['a', 'b']
	     */
	    function functions(object) {
	      return object == null ? [] : baseFunctions(object, keys(object));
	    }
	
	    /**
	     * Creates an array of function property names from own and inherited
	     * enumerable properties of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the new array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = _.constant('a');
	     *   this.b = _.constant('b');
	     * }
	     *
	     * Foo.prototype.c = _.constant('c');
	     *
	     * _.functionsIn(new Foo);
	     * // => ['a', 'b', 'c']
	     */
	    function functionsIn(object) {
	      return object == null ? [] : baseFunctions(object, keysIn(object));
	    }
	
	    /**
	     * Gets the value at `path` of `object`. If the resolved value is
	     * `undefined` the `defaultValue` is used in its place.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to get.
	     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	     *
	     * _.get(object, 'a[0].b.c');
	     * // => 3
	     *
	     * _.get(object, ['a', '0', 'b', 'c']);
	     * // => 3
	     *
	     * _.get(object, 'a.b.c', 'default');
	     * // => 'default'
	     */
	    function get(object, path, defaultValue) {
	      var result = object == null ? undefined : baseGet(object, path);
	      return result === undefined ? defaultValue : result;
	    }
	
	    /**
	     * Checks if `path` is a direct property of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path to check.
	     * @returns {boolean} Returns `true` if `path` exists, else `false`.
	     * @example
	     *
	     * var object = { 'a': { 'b': { 'c': 3 } } };
	     * var other = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
	     *
	     * _.has(object, 'a');
	     * // => true
	     *
	     * _.has(object, 'a.b.c');
	     * // => true
	     *
	     * _.has(object, ['a', 'b', 'c']);
	     * // => true
	     *
	     * _.has(other, 'a');
	     * // => false
	     */
	    function has(object, path) {
	      return hasPath(object, path, baseHas);
	    }
	
	    /**
	     * Checks if `path` is a direct or inherited property of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path to check.
	     * @returns {boolean} Returns `true` if `path` exists, else `false`.
	     * @example
	     *
	     * var object = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
	     *
	     * _.hasIn(object, 'a');
	     * // => true
	     *
	     * _.hasIn(object, 'a.b.c');
	     * // => true
	     *
	     * _.hasIn(object, ['a', 'b', 'c']);
	     * // => true
	     *
	     * _.hasIn(object, 'b');
	     * // => false
	     */
	    function hasIn(object, path) {
	      return hasPath(object, path, baseHasIn);
	    }
	
	    /**
	     * Creates an object composed of the inverted keys and values of `object`.
	     * If `object` contains duplicate values, subsequent values overwrite property
	     * assignments of previous values.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to invert.
	     * @returns {Object} Returns the new inverted object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': 2, 'c': 1 };
	     *
	     * _.invert(object);
	     * // => { '1': 'c', '2': 'b' }
	     */
	    var invert = createInverter(function(result, value, key) {
	      result[value] = key;
	    }, constant(identity));
	
	    /**
	     * This method is like `_.invert` except that the inverted object is generated
	     * from the results of running each element of `object` through `iteratee`.
	     * The corresponding inverted value of each inverted key is an array of keys
	     * responsible for generating the inverted value. The iteratee is invoked
	     * with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to invert.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Object} Returns the new inverted object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': 2, 'c': 1 };
	     *
	     * _.invertBy(object);
	     * // => { '1': ['a', 'c'], '2': ['b'] }
	     *
	     * _.invertBy(object, function(value) {
	     *   return 'group' + value;
	     * });
	     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
	     */
	    var invertBy = createInverter(function(result, value, key) {
	      if (hasOwnProperty.call(result, value)) {
	        result[value].push(key);
	      } else {
	        result[value] = [key];
	      }
	    }, getIteratee);
	
	    /**
	     * Invokes the method at `path` of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the method to invoke.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {*} Returns the result of the invoked method.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
	     *
	     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
	     * // => [2, 3]
	     */
	    var invoke = rest(baseInvoke);
	
	    /**
	     * Creates an array of the own enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects. See the
	     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	     * for more details.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keys(new Foo);
	     * // => ['a', 'b'] (iteration order is not guaranteed)
	     *
	     * _.keys('hi');
	     * // => ['0', '1']
	     */
	    function keys(object) {
	      var isProto = isPrototype(object);
	      if (!(isProto || isArrayLike(object))) {
	        return baseKeys(object);
	      }
	      var indexes = indexKeys(object),
	          skipIndexes = !!indexes,
	          result = indexes || [],
	          length = result.length;
	
	      for (var key in object) {
	        if (baseHas(object, key) &&
	            !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	            !(isProto && key == 'constructor')) {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Creates an array of the own and inherited enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keysIn(new Foo);
	     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	     */
	    function keysIn(object) {
	      var index = -1,
	          isProto = isPrototype(object),
	          props = baseKeysIn(object),
	          propsLength = props.length,
	          indexes = indexKeys(object),
	          skipIndexes = !!indexes,
	          result = indexes || [],
	          length = result.length;
	
	      while (++index < propsLength) {
	        var key = props[index];
	        if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The opposite of `_.mapValues`; this method creates an object with the
	     * same values as `object` and keys generated by running each own enumerable
	     * property of `object` through `iteratee`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns the new mapped object.
	     * @example
	     *
	     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
	     *   return key + value;
	     * });
	     * // => { 'a1': 1, 'b2': 2 }
	     */
	    function mapKeys(object, iteratee) {
	      var result = {};
	      iteratee = getIteratee(iteratee, 3);
	
	      baseForOwn(object, function(value, key, object) {
	        result[iteratee(value, key, object)] = value;
	      });
	      return result;
	    }
	
	    /**
	     * Creates an object with the same keys as `object` and values generated by
	     * running each own enumerable property of `object` through `iteratee`. The
	     * iteratee function is invoked with three arguments: (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns the new mapped object.
	     * @example
	     *
	     * var users = {
	     *   'fred':    { 'user': 'fred',    'age': 40 },
	     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	     * };
	     *
	     * _.mapValues(users, function(o) { return o.age; });
	     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.mapValues(users, 'age');
	     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	     */
	    function mapValues(object, iteratee) {
	      var result = {};
	      iteratee = getIteratee(iteratee, 3);
	
	      baseForOwn(object, function(value, key, object) {
	        result[key] = iteratee(value, key, object);
	      });
	      return result;
	    }
	
	    /**
	     * Recursively merges own and inherited enumerable properties of source
	     * objects into the destination object, skipping source properties that resolve
	     * to `undefined`. Array and plain object properties are merged recursively.
	     * Other objects and value types are overridden by assignment. Source objects
	     * are applied from left to right. Subsequent sources overwrite property
	     * assignments of previous sources.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var users = {
	     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
	     * };
	     *
	     * var ages = {
	     *   'data': [{ 'age': 36 }, { 'age': 40 }]
	     * };
	     *
	     * _.merge(users, ages);
	     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
	     */
	    var merge = createAssigner(function(object, source, srcIndex) {
	      baseMerge(object, source, srcIndex);
	    });
	
	    /**
	     * This method is like `_.merge` except that it accepts `customizer` which
	     * is invoked to produce the merged values of the destination and source
	     * properties. If `customizer` returns `undefined` merging is handled by the
	     * method instead. The `customizer` is invoked with seven arguments:
	     * (objValue, srcValue, key, object, source, stack).
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} sources The source objects.
	     * @param {Function} customizer The function to customize assigned values.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function customizer(objValue, srcValue) {
	     *   if (_.isArray(objValue)) {
	     *     return objValue.concat(srcValue);
	     *   }
	     * }
	     *
	     * var object = {
	     *   'fruits': ['apple'],
	     *   'vegetables': ['beet']
	     * };
	     *
	     * var other = {
	     *   'fruits': ['banana'],
	     *   'vegetables': ['carrot']
	     * };
	     *
	     * _.mergeWith(object, other, customizer);
	     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
	     */
	    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
	      baseMerge(object, source, srcIndex, customizer);
	    });
	
	    /**
	     * The opposite of `_.pick`; this method creates an object composed of the
	     * own and inherited enumerable properties of `object` that are not omitted.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {...(string|string[])} [props] The property names to omit, specified
	     *  individually or in arrays..
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': '2', 'c': 3 };
	     *
	     * _.omit(object, ['a', 'c']);
	     * // => { 'b': '2' }
	     */
	    var omit = rest(function(object, props) {
	      if (object == null) {
	        return {};
	      }
	      props = arrayMap(baseFlatten(props), String);
	      return basePick(object, baseDifference(keysIn(object), props));
	    });
	
	    /**
	     * The opposite of `_.pickBy`; this method creates an object composed of the
	     * own and inherited enumerable properties of `object` that `predicate`
	     * doesn't return truthy for.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per property.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': '2', 'c': 3 };
	     *
	     * _.omitBy(object, _.isNumber);
	     * // => { 'b': '2' }
	     */
	    function omitBy(object, predicate) {
	      predicate = getIteratee(predicate, 2);
	      return basePickBy(object, function(value, key) {
	        return !predicate(value, key);
	      });
	    }
	
	    /**
	     * Creates an object composed of the picked `object` properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {...(string|string[])} [props] The property names to pick, specified
	     *  individually or in arrays.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': '2', 'c': 3 };
	     *
	     * _.pick(object, ['a', 'c']);
	     * // => { 'a': 1, 'c': 3 }
	     */
	    var pick = rest(function(object, props) {
	      return object == null ? {} : basePick(object, baseFlatten(props));
	    });
	
	    /**
	     * Creates an object composed of the `object` properties `predicate` returns
	     * truthy for. The predicate is invoked with two arguments: (value, key).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per property.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': '2', 'c': 3 };
	     *
	     * _.pickBy(object, _.isNumber);
	     * // => { 'a': 1, 'c': 3 }
	     */
	    function pickBy(object, predicate) {
	      return object == null ? {} : basePickBy(object, getIteratee(predicate, 2));
	    }
	
	    /**
	     * This method is like `_.get` except that if the resolved value is a function
	     * it's invoked with the `this` binding of its parent object and its result
	     * is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to resolve.
	     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
	     *
	     * _.result(object, 'a[0].b.c1');
	     * // => 3
	     *
	     * _.result(object, 'a[0].b.c2');
	     * // => 4
	     *
	     * _.result(object, 'a[0].b.c3', 'default');
	     * // => 'default'
	     *
	     * _.result(object, 'a[0].b.c3', _.constant('default'));
	     * // => 'default'
	     */
	    function result(object, path, defaultValue) {
	      if (!isKey(path, object)) {
	        path = baseToPath(path);
	        var result = get(object, path);
	        object = parent(object, path);
	      } else {
	        result = object == null ? undefined : object[path];
	      }
	      if (result === undefined) {
	        result = defaultValue;
	      }
	      return isFunction(result) ? result.call(object) : result;
	    }
	
	    /**
	     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist
	     * it's created. Arrays are created for missing index properties while objects
	     * are created for all other missing properties. Use `_.setWith` to customize
	     * `path` creation.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to modify.
	     * @param {Array|string} path The path of the property to set.
	     * @param {*} value The value to set.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	     *
	     * _.set(object, 'a[0].b.c', 4);
	     * console.log(object.a[0].b.c);
	     * // => 4
	     *
	     * _.set(object, 'x[0].y.z', 5);
	     * console.log(object.x[0].y.z);
	     * // => 5
	     */
	    function set(object, path, value) {
	      return object == null ? object : baseSet(object, path, value);
	    }
	
	    /**
	     * This method is like `_.set` except that it accepts `customizer` which is
	     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
	     * path creation is handled by the method instead. The `customizer` is invoked
	     * with three arguments: (nsValue, key, nsObject).
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to modify.
	     * @param {Array|string} path The path of the property to set.
	     * @param {*} value The value to set.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.setWith({ '0': { 'length': 2 } }, '[0][1][2]', 3, Object);
	     * // => { '0': { '1': { '2': 3 }, 'length': 2 } }
	     */
	    function setWith(object, path, value, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined;
	      return object == null ? object : baseSet(object, path, value, customizer);
	    }
	
	    /**
	     * Creates an array of own enumerable key-value pairs for `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the new array of key-value pairs.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.toPairs(new Foo);
	     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
	     */
	    function toPairs(object) {
	      return baseToPairs(object, keys(object));
	    }
	
	    /**
	     * Creates an array of own and inherited enumerable key-value pairs for `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the new array of key-value pairs.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.toPairsIn(new Foo);
	     * // => [['a', 1], ['b', 2], ['c', 1]] (iteration order is not guaranteed)
	     */
	    function toPairsIn(object) {
	      return baseToPairs(object, keysIn(object));
	    }
	
	    /**
	     * An alternative to `_.reduce`; this method transforms `object` to a new
	     * `accumulator` object which is the result of running each of its own enumerable
	     * properties through `iteratee`, with each invocation potentially mutating
	     * the `accumulator` object. The iteratee is invoked with four arguments:
	     * (accumulator, value, key, object). Iteratee functions may exit iteration
	     * early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Array|Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The custom accumulator value.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * _.transform([2, 3, 4], function(result, n) {
	     *   result.push(n *= n);
	     *   return n % 2 == 0;
	     * }, []);
	     * // => [4, 9]
	     *
	     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	     *   (result[value] || (result[value] = [])).push(key);
	     * }, {});
	     * // => { '1': ['a', 'c'], '2': ['b'] }
	     */
	    function transform(object, iteratee, accumulator) {
	      var isArr = isArray(object) || isTypedArray(object);
	      iteratee = getIteratee(iteratee, 4);
	
	      if (accumulator == null) {
	        if (isArr || isObject(object)) {
	          var Ctor = object.constructor;
	          if (isArr) {
	            accumulator = isArray(object) ? new Ctor : [];
	          } else {
	            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
	          }
	        } else {
	          accumulator = {};
	        }
	      }
	      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
	        return iteratee(accumulator, value, index, object);
	      });
	      return accumulator;
	    }
	
	    /**
	     * Removes the property at `path` of `object`.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to modify.
	     * @param {Array|string} path The path of the property to unset.
	     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
	     * _.unset(object, 'a[0].b.c');
	     * // => true
	     *
	     * console.log(object);
	     * // => { 'a': [{ 'b': {} }] };
	     *
	     * _.unset(object, 'a[0].b.c');
	     * // => true
	     *
	     * console.log(object);
	     * // => { 'a': [{ 'b': {} }] };
	     */
	    function unset(object, path) {
	      return object == null ? true : baseUnset(object, path);
	    }
	
	    /**
	     * Creates an array of the own enumerable property values of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property values.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.values(new Foo);
	     * // => [1, 2] (iteration order is not guaranteed)
	     *
	     * _.values('hi');
	     * // => ['h', 'i']
	     */
	    function values(object) {
	      return object ? baseValues(object, keys(object)) : [];
	    }
	
	    /**
	     * Creates an array of the own and inherited enumerable property values of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property values.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.valuesIn(new Foo);
	     * // => [1, 2, 3] (iteration order is not guaranteed)
	     */
	    function valuesIn(object) {
	      return object == null ? baseValues(object, keysIn(object)) : [];
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Clamps `number` within the inclusive `lower` and `upper` bounds.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} number The number to clamp.
	     * @param {number} [lower] The lower bound.
	     * @param {number} upper The upper bound.
	     * @returns {number} Returns the clamped number.
	     * @example
	     *
	     * _.clamp(-10, -5, 5);
	     * // => -5
	     *
	     * _.clamp(10, -5, 5);
	     * // => 5
	     */
	    function clamp(number, lower, upper) {
	      if (upper === undefined) {
	        upper = lower;
	        lower = undefined;
	      }
	      if (upper !== undefined) {
	        upper = toNumber(upper);
	        upper = upper === upper ? upper : 0;
	      }
	      if (lower !== undefined) {
	        lower = toNumber(lower);
	        lower = lower === lower ? lower : 0;
	      }
	      return baseClamp(toNumber(number), lower, upper);
	    }
	
	    /**
	     * Checks if `n` is between `start` and up to but not including, `end`. If
	     * `end` is not specified it's set to `start` with `start` then set to `0`.
	     * If `start` is greater than `end` the params are swapped to support
	     * negative ranges.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} number The number to check.
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
	     * @example
	     *
	     * _.inRange(3, 2, 4);
	     * // => true
	     *
	     * _.inRange(4, 8);
	     * // => true
	     *
	     * _.inRange(4, 2);
	     * // => false
	     *
	     * _.inRange(2, 2);
	     * // => false
	     *
	     * _.inRange(1.2, 2);
	     * // => true
	     *
	     * _.inRange(5.2, 4);
	     * // => false
	     *
	     * _.inRange(-3, -2, -6);
	     * // => true
	     */
	    function inRange(number, start, end) {
	      start = toNumber(start) || 0;
	      if (end === undefined) {
	        end = start;
	        start = 0;
	      } else {
	        end = toNumber(end) || 0;
	      }
	      number = toNumber(number);
	      return baseInRange(number, start, end);
	    }
	
	    /**
	     * Produces a random number between the inclusive `lower` and `upper` bounds.
	     * If only one argument is provided a number between `0` and the given number
	     * is returned. If `floating` is `true`, or either `lower` or `upper` are floats,
	     * a floating-point number is returned instead of an integer.
	     *
	     * **Note:** JavaScript follows the IEEE-754 standard for resolving
	     * floating-point values which can produce unexpected results.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} [lower=0] The lower bound.
	     * @param {number} [upper=1] The upper bound.
	     * @param {boolean} [floating] Specify returning a floating-point number.
	     * @returns {number} Returns the random number.
	     * @example
	     *
	     * _.random(0, 5);
	     * // => an integer between 0 and 5
	     *
	     * _.random(5);
	     * // => also an integer between 0 and 5
	     *
	     * _.random(5, true);
	     * // => a floating-point number between 0 and 5
	     *
	     * _.random(1.2, 5.2);
	     * // => a floating-point number between 1.2 and 5.2
	     */
	    function random(lower, upper, floating) {
	      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
	        upper = floating = undefined;
	      }
	      if (floating === undefined) {
	        if (typeof upper == 'boolean') {
	          floating = upper;
	          upper = undefined;
	        }
	        else if (typeof lower == 'boolean') {
	          floating = lower;
	          lower = undefined;
	        }
	      }
	      if (lower === undefined && upper === undefined) {
	        lower = 0;
	        upper = 1;
	      }
	      else {
	        lower = toNumber(lower) || 0;
	        if (upper === undefined) {
	          upper = lower;
	          lower = 0;
	        } else {
	          upper = toNumber(upper) || 0;
	        }
	      }
	      if (lower > upper) {
	        var temp = lower;
	        lower = upper;
	        upper = temp;
	      }
	      if (floating || lower % 1 || upper % 1) {
	        var rand = nativeRandom();
	        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
	      }
	      return baseRandom(lower, upper);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the camel cased string.
	     * @example
	     *
	     * _.camelCase('Foo Bar');
	     * // => 'fooBar'
	     *
	     * _.camelCase('--foo-bar');
	     * // => 'fooBar'
	     *
	     * _.camelCase('__foo_bar__');
	     * // => 'fooBar'
	     */
	    var camelCase = createCompounder(function(result, word, index) {
	      word = word.toLowerCase();
	      return result + (index ? capitalize(word) : word);
	    });
	
	    /**
	     * Converts the first character of `string` to upper case and the remaining
	     * to lower case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to capitalize.
	     * @returns {string} Returns the capitalized string.
	     * @example
	     *
	     * _.capitalize('FRED');
	     * // => 'Fred'
	     */
	    function capitalize(string) {
	      return upperFirst(toString(string).toLowerCase());
	    }
	
	    /**
	     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
	     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to deburr.
	     * @returns {string} Returns the deburred string.
	     * @example
	     *
	     * _.deburr('déjà vu');
	     * // => 'deja vu'
	     */
	    function deburr(string) {
	      string = toString(string);
	      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
	    }
	
	    /**
	     * Checks if `string` ends with the given target string.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to search.
	     * @param {string} [target] The string to search for.
	     * @param {number} [position=string.length] The position to search from.
	     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
	     * @example
	     *
	     * _.endsWith('abc', 'c');
	     * // => true
	     *
	     * _.endsWith('abc', 'b');
	     * // => false
	     *
	     * _.endsWith('abc', 'b', 2);
	     * // => true
	     */
	    function endsWith(string, target, position) {
	      string = toString(string);
	      target = typeof target == 'string' ? target : (target + '');
	
	      var length = string.length;
	      position = position === undefined
	        ? length
	        : baseClamp(toInteger(position), 0, length);
	
	      position -= target.length;
	      return position >= 0 && string.indexOf(target, position) == position;
	    }
	
	    /**
	     * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
	     * their corresponding HTML entities.
	     *
	     * **Note:** No other characters are escaped. To escape additional
	     * characters use a third-party library like [_he_](https://mths.be/he).
	     *
	     * Though the ">" character is escaped for symmetry, characters like
	     * ">" and "/" don't need escaping in HTML and have no special meaning
	     * unless they're part of a tag or unquoted attribute value.
	     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
	     * (under "semi-related fun fact") for more details.
	     *
	     * Backticks are escaped because in IE < 9, they can break out of
	     * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
	     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
	     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
	     * for more details.
	     *
	     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
	     * to reduce XSS vectors.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escape('fred, barney, & pebbles');
	     * // => 'fred, barney, &amp; pebbles'
	     */
	    function escape(string) {
	      string = toString(string);
	      return (string && reHasUnescapedHtml.test(string))
	        ? string.replace(reUnescapedHtml, escapeHtmlChar)
	        : string;
	    }
	
	    /**
	     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
	     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escapeRegExp('[lodash](https://lodash.com/)');
	     * // => '\[lodash\]\(https://lodash\.com/\)'
	     */
	    function escapeRegExp(string) {
	      string = toString(string);
	      return (string && reHasRegExpChar.test(string))
	        ? string.replace(reRegExpChar, '\\$&')
	        : string;
	    }
	
	    /**
	     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the kebab cased string.
	     * @example
	     *
	     * _.kebabCase('Foo Bar');
	     * // => 'foo-bar'
	     *
	     * _.kebabCase('fooBar');
	     * // => 'foo-bar'
	     *
	     * _.kebabCase('__foo_bar__');
	     * // => 'foo-bar'
	     */
	    var kebabCase = createCompounder(function(result, word, index) {
	      return result + (index ? '-' : '') + word.toLowerCase();
	    });
	
	    /**
	     * Converts `string`, as space separated words, to lower case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the lower cased string.
	     * @example
	     *
	     * _.lowerCase('--Foo-Bar');
	     * // => 'foo bar'
	     *
	     * _.lowerCase('fooBar');
	     * // => 'foo bar'
	     *
	     * _.lowerCase('__FOO_BAR__');
	     * // => 'foo bar'
	     */
	    var lowerCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + word.toLowerCase();
	    });
	
	    /**
	     * Converts the first character of `string` to lower case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the converted string.
	     * @example
	     *
	     * _.lowerFirst('Fred');
	     * // => 'fred'
	     *
	     * _.lowerFirst('FRED');
	     * // => 'fRED'
	     */
	    var lowerFirst = createCaseFirst('toLowerCase');
	
	    /**
	     * Converts the first character of `string` to upper case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the converted string.
	     * @example
	     *
	     * _.upperFirst('fred');
	     * // => 'Fred'
	     *
	     * _.upperFirst('FRED');
	     * // => 'FRED'
	     */
	    var upperFirst = createCaseFirst('toUpperCase');
	
	    /**
	     * Pads `string` on the left and right sides if it's shorter than `length`.
	     * Padding characters are truncated if they can't be evenly divided by `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.pad('abc', 8);
	     * // => '  abc   '
	     *
	     * _.pad('abc', 8, '_-');
	     * // => '_-abc_-_'
	     *
	     * _.pad('abc', 3);
	     * // => 'abc'
	     */
	    function pad(string, length, chars) {
	      string = toString(string);
	      length = toInteger(length);
	
	      var strLength = stringSize(string);
	      if (!length || strLength >= length) {
	        return string;
	      }
	      var mid = (length - strLength) / 2,
	          leftLength = nativeFloor(mid),
	          rightLength = nativeCeil(mid);
	
	      return createPadding('', leftLength, chars) + string + createPadding('', rightLength, chars);
	    }
	
	    /**
	     * Pads `string` on the right side if it's shorter than `length`. Padding
	     * characters are truncated if they exceed `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.padEnd('abc', 6);
	     * // => 'abc   '
	     *
	     * _.padEnd('abc', 6, '_-');
	     * // => 'abc_-_'
	     *
	     * _.padEnd('abc', 3);
	     * // => 'abc'
	     */
	    function padEnd(string, length, chars) {
	      string = toString(string);
	      return string + createPadding(string, length, chars);
	    }
	
	    /**
	     * Pads `string` on the left side if it's shorter than `length`. Padding
	     * characters are truncated if they exceed `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.padStart('abc', 6);
	     * // => '   abc'
	     *
	     * _.padStart('abc', 6, '_-');
	     * // => '_-_abc'
	     *
	     * _.padStart('abc', 3);
	     * // => 'abc'
	     */
	    function padStart(string, length, chars) {
	      string = toString(string);
	      return createPadding(string, length, chars) + string;
	    }
	
	    /**
	     * Converts `string` to an integer of the specified radix. If `radix` is
	     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
	     * in which case a `radix` of `16` is used.
	     *
	     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#x15.1.2.2)
	     * of `parseInt`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} string The string to convert.
	     * @param {number} [radix] The radix to interpret `value` by.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.parseInt('08');
	     * // => 8
	     *
	     * _.map(['6', '08', '10'], _.parseInt);
	     * // => [6, 8, 10]
	     */
	    function parseInt(string, radix, guard) {
	      // Chrome fails to trim leading <BOM> whitespace characters.
	      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
	      if (guard || radix == null) {
	        radix = 0;
	      } else if (radix) {
	        radix = +radix;
	      }
	      string = toString(string).replace(reTrim, '');
	      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
	    }
	
	    /**
	     * Repeats the given string `n` times.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to repeat.
	     * @param {number} [n=0] The number of times to repeat the string.
	     * @returns {string} Returns the repeated string.
	     * @example
	     *
	     * _.repeat('*', 3);
	     * // => '***'
	     *
	     * _.repeat('abc', 2);
	     * // => 'abcabc'
	     *
	     * _.repeat('abc', 0);
	     * // => ''
	     */
	    function repeat(string, n) {
	      string = toString(string);
	      n = toInteger(n);
	
	      var result = '';
	      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
	        return result;
	      }
	      // Leverage the exponentiation by squaring algorithm for a faster repeat.
	      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
	      do {
	        if (n % 2) {
	          result += string;
	        }
	        n = nativeFloor(n / 2);
	        string += string;
	      } while (n);
	
	      return result;
	    }
	
	    /**
	     * Replaces matches for `pattern` in `string` with `replacement`.
	     *
	     * **Note:** This method is based on [`String#replace`](https://mdn.io/String/replace).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to modify.
	     * @param {RegExp|string} pattern The pattern to replace.
	     * @param {Function|string} replacement The match replacement.
	     * @returns {string} Returns the modified string.
	     * @example
	     *
	     * _.replace('Hi Fred', 'Fred', 'Barney');
	     * // => 'Hi Barney'
	     */
	    function replace() {
	      var args = arguments,
	          string = toString(args[0]);
	
	      return args.length < 3 ? string : string.replace(args[1], args[2]);
	    }
	
	    /**
	     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the snake cased string.
	     * @example
	     *
	     * _.snakeCase('Foo Bar');
	     * // => 'foo_bar'
	     *
	     * _.snakeCase('fooBar');
	     * // => 'foo_bar'
	     *
	     * _.snakeCase('--foo-bar');
	     * // => 'foo_bar'
	     */
	    var snakeCase = createCompounder(function(result, word, index) {
	      return result + (index ? '_' : '') + word.toLowerCase();
	    });
	
	    /**
	     * Splits `string` by `separator`.
	     *
	     * **Note:** This method is based on [`String#split`](https://mdn.io/String/split).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to split.
	     * @param {RegExp|string} separator The separator pattern to split by.
	     * @param {number} [limit] The length to truncate results to.
	     * @returns {Array} Returns the new array of string segments.
	     * @example
	     *
	     * _.split('a-b-c', '-', 2);
	     * // => ['a', 'b']
	     */
	    function split(string, separator, limit) {
	      return toString(string).split(separator, limit);
	    }
	
	    /**
	     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the start cased string.
	     * @example
	     *
	     * _.startCase('--foo-bar');
	     * // => 'Foo Bar'
	     *
	     * _.startCase('fooBar');
	     * // => 'Foo Bar'
	     *
	     * _.startCase('__foo_bar__');
	     * // => 'Foo Bar'
	     */
	    var startCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + capitalize(word);
	    });
	
	    /**
	     * Checks if `string` starts with the given target string.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to search.
	     * @param {string} [target] The string to search for.
	     * @param {number} [position=0] The position to search from.
	     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
	     * @example
	     *
	     * _.startsWith('abc', 'a');
	     * // => true
	     *
	     * _.startsWith('abc', 'b');
	     * // => false
	     *
	     * _.startsWith('abc', 'b', 1);
	     * // => true
	     */
	    function startsWith(string, target, position) {
	      string = toString(string);
	      position = baseClamp(toInteger(position), 0, string.length);
	      return string.lastIndexOf(target, position) == position;
	    }
	
	    /**
	     * Creates a compiled template function that can interpolate data properties
	     * in "interpolate" delimiters, HTML-escape interpolated data properties in
	     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
	     * properties may be accessed as free variables in the template. If a setting
	     * object is provided it takes precedence over `_.templateSettings` values.
	     *
	     * **Note:** In the development build `_.template` utilizes
	     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
	     * for easier debugging.
	     *
	     * For more information on precompiling templates see
	     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
	     *
	     * For more information on Chrome extension sandboxes see
	     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The template string.
	     * @param {Object} [options] The options object.
	     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
	     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
	     * @param {Object} [options.imports] An object to import into the template as free variables.
	     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
	     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
	     * @param {string} [options.variable] The data object variable name.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Function} Returns the compiled template function.
	     * @example
	     *
	     * // Use the "interpolate" delimiter to create a compiled template.
	     * var compiled = _.template('hello <%= user %>!');
	     * compiled({ 'user': 'fred' });
	     * // => 'hello fred!'
	     *
	     * // Use the HTML "escape" delimiter to escape data property values.
	     * var compiled = _.template('<b><%- value %></b>');
	     * compiled({ 'value': '<script>' });
	     * // => '<b>&lt;script&gt;</b>'
	     *
	     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
	     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
	     * compiled({ 'users': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // Use the internal `print` function in "evaluate" delimiters.
	     * var compiled = _.template('<% print("hello " + user); %>!');
	     * compiled({ 'user': 'barney' });
	     * // => 'hello barney!'
	     *
	     * // Use the ES delimiter as an alternative to the default "interpolate" delimiter.
	     * var compiled = _.template('hello ${ user }!');
	     * compiled({ 'user': 'pebbles' });
	     * // => 'hello pebbles!'
	     *
	     * // Use custom template delimiters.
	     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
	     * var compiled = _.template('hello {{ user }}!');
	     * compiled({ 'user': 'mustache' });
	     * // => 'hello mustache!'
	     *
	     * // Use backslashes to treat delimiters as plain text.
	     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
	     * compiled({ 'value': 'ignored' });
	     * // => '<%- value %>'
	     *
	     * // Use the `imports` option to import `jQuery` as `jq`.
	     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
	     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
	     * compiled({ 'users': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
	     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
	     * compiled(data);
	     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
	     *
	     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
	     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
	     * compiled.source;
	     * // => function(data) {
	     * //   var __t, __p = '';
	     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
	     * //   return __p;
	     * // }
	     *
	     * // Use the `source` property to inline compiled templates for meaningful
	     * // line numbers in error messages and stack traces.
	     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
	     *   var JST = {\
	     *     "main": ' + _.template(mainText).source + '\
	     *   };\
	     * ');
	     */
	    function template(string, options, guard) {
	      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
	      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
	      var settings = lodash.templateSettings;
	
	      if (guard && isIterateeCall(string, options, guard)) {
	        options = undefined;
	      }
	      string = toString(string);
	      options = assignInWith({}, options, settings, assignInDefaults);
	
	      var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
	          importsKeys = keys(imports),
	          importsValues = baseValues(imports, importsKeys);
	
	      var isEscaping,
	          isEvaluating,
	          index = 0,
	          interpolate = options.interpolate || reNoMatch,
	          source = "__p += '";
	
	      // Compile the regexp to match each delimiter.
	      var reDelimiters = RegExp(
	        (options.escape || reNoMatch).source + '|' +
	        interpolate.source + '|' +
	        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	        (options.evaluate || reNoMatch).source + '|$'
	      , 'g');
	
	      // Use a sourceURL for easier debugging.
	      var sourceURL = '//# sourceURL=' +
	        ('sourceURL' in options
	          ? options.sourceURL
	          : ('lodash.templateSources[' + (++templateCounter) + ']')
	        ) + '\n';
	
	      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	        interpolateValue || (interpolateValue = esTemplateValue);
	
	        // Escape characters that can't be included in string literals.
	        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
	
	        // Replace delimiters with snippets.
	        if (escapeValue) {
	          isEscaping = true;
	          source += "' +\n__e(" + escapeValue + ") +\n'";
	        }
	        if (evaluateValue) {
	          isEvaluating = true;
	          source += "';\n" + evaluateValue + ";\n__p += '";
	        }
	        if (interpolateValue) {
	          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	        }
	        index = offset + match.length;
	
	        // The JS engine embedded in Adobe products needs `match` returned in
	        // order to produce the correct `offset` value.
	        return match;
	      });
	
	      source += "';\n";
	
	      // If `variable` is not specified wrap a with-statement around the generated
	      // code to add the data object to the top of the scope chain.
	      var variable = options.variable;
	      if (!variable) {
	        source = 'with (obj) {\n' + source + '\n}\n';
	      }
	      // Cleanup code by stripping empty strings.
	      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	        .replace(reEmptyStringMiddle, '$1')
	        .replace(reEmptyStringTrailing, '$1;');
	
	      // Frame code as the function body.
	      source = 'function(' + (variable || 'obj') + ') {\n' +
	        (variable
	          ? ''
	          : 'obj || (obj = {});\n'
	        ) +
	        "var __t, __p = ''" +
	        (isEscaping
	           ? ', __e = _.escape'
	           : ''
	        ) +
	        (isEvaluating
	          ? ', __j = Array.prototype.join;\n' +
	            "function print() { __p += __j.call(arguments, '') }\n"
	          : ';\n'
	        ) +
	        source +
	        'return __p\n}';
	
	      var result = attempt(function() {
	        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
	      });
	
	      // Provide the compiled function's source by its `toString` method or
	      // the `source` property as a convenience for inlining compiled templates.
	      result.source = source;
	      if (isError(result)) {
	        throw result;
	      }
	      return result;
	    }
	
	    /**
	     * Converts `string`, as a whole, to lower case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the lower cased string.
	     * @example
	     *
	     * _.toLower('--Foo-Bar');
	     * // => '--foo-bar'
	     *
	     * _.toLower('fooBar');
	     * // => 'foobar'
	     *
	     * _.toLower('__FOO_BAR__');
	     * // => '__foo_bar__'
	     */
	    function toLower(value) {
	      return toString(value).toLowerCase();
	    }
	
	    /**
	     * Converts `string`, as a whole, to upper case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the upper cased string.
	     * @example
	     *
	     * _.toUpper('--foo-bar');
	     * // => '--FOO-BAR'
	     *
	     * _.toUpper('fooBar');
	     * // => 'FOOBAR'
	     *
	     * _.toUpper('__foo_bar__');
	     * // => '__FOO_BAR__'
	     */
	    function toUpper(value) {
	      return toString(value).toUpperCase();
	    }
	
	    /**
	     * Removes leading and trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trim('  abc  ');
	     * // => 'abc'
	     *
	     * _.trim('-_-abc-_-', '_-');
	     * // => 'abc'
	     *
	     * _.map(['  foo  ', '  bar  '], _.trim);
	     * // => ['foo', 'bar']
	     */
	    function trim(string, chars, guard) {
	      string = toString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard || chars === undefined) {
	        return string.replace(reTrim, '');
	      }
	      chars = (chars + '');
	      if (!chars) {
	        return string;
	      }
	      var strSymbols = stringToArray(string),
	          chrSymbols = stringToArray(chars);
	
	      return strSymbols.slice(charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1).join('');
	    }
	
	    /**
	     * Removes trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trimEnd('  abc  ');
	     * // => '  abc'
	     *
	     * _.trimEnd('-_-abc-_-', '_-');
	     * // => '-_-abc'
	     */
	    function trimEnd(string, chars, guard) {
	      string = toString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard || chars === undefined) {
	        return string.replace(reTrimEnd, '');
	      }
	      chars = (chars + '');
	      if (!chars) {
	        return string;
	      }
	      var strSymbols = stringToArray(string);
	      return strSymbols.slice(0, charsEndIndex(strSymbols, stringToArray(chars)) + 1).join('');
	    }
	
	    /**
	     * Removes leading whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trimStart('  abc  ');
	     * // => 'abc  '
	     *
	     * _.trimStart('-_-abc-_-', '_-');
	     * // => 'abc-_-'
	     */
	    function trimStart(string, chars, guard) {
	      string = toString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard || chars === undefined) {
	        return string.replace(reTrimStart, '');
	      }
	      chars = (chars + '');
	      if (!chars) {
	        return string;
	      }
	      var strSymbols = stringToArray(string);
	      return strSymbols.slice(charsStartIndex(strSymbols, stringToArray(chars))).join('');
	    }
	
	    /**
	     * Truncates `string` if it's longer than the given maximum string length.
	     * The last characters of the truncated string are replaced with the omission
	     * string which defaults to "...".
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to truncate.
	     * @param {Object} [options] The options object.
	     * @param {number} [options.length=30] The maximum string length.
	     * @param {string} [options.omission='...'] The string to indicate text is omitted.
	     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
	     * @returns {string} Returns the truncated string.
	     * @example
	     *
	     * _.truncate('hi-diddly-ho there, neighborino');
	     * // => 'hi-diddly-ho there, neighbo...'
	     *
	     * _.truncate('hi-diddly-ho there, neighborino', {
	     *   'length': 24,
	     *   'separator': ' '
	     * });
	     * // => 'hi-diddly-ho there,...'
	     *
	     * _.truncate('hi-diddly-ho there, neighborino', {
	     *   'length': 24,
	     *   'separator': /,? +/
	     * });
	     * // => 'hi-diddly-ho there...'
	     *
	     * _.truncate('hi-diddly-ho there, neighborino', {
	     *   'omission': ' [...]'
	     * });
	     * // => 'hi-diddly-ho there, neig [...]'
	     */
	    function truncate(string, options) {
	      var length = DEFAULT_TRUNC_LENGTH,
	          omission = DEFAULT_TRUNC_OMISSION;
	
	      if (isObject(options)) {
	        var separator = 'separator' in options ? options.separator : separator;
	        length = 'length' in options ? toInteger(options.length) : length;
	        omission = 'omission' in options ? toString(options.omission) : omission;
	      }
	      string = toString(string);
	
	      var strLength = string.length;
	      if (reHasComplexSymbol.test(string)) {
	        var strSymbols = stringToArray(string);
	        strLength = strSymbols.length;
	      }
	      if (length >= strLength) {
	        return string;
	      }
	      var end = length - stringSize(omission);
	      if (end < 1) {
	        return omission;
	      }
	      var result = strSymbols
	        ? strSymbols.slice(0, end).join('')
	        : string.slice(0, end);
	
	      if (separator === undefined) {
	        return result + omission;
	      }
	      if (strSymbols) {
	        end += (result.length - end);
	      }
	      if (isRegExp(separator)) {
	        if (string.slice(end).search(separator)) {
	          var match,
	              substring = result;
	
	          if (!separator.global) {
	            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
	          }
	          separator.lastIndex = 0;
	          while ((match = separator.exec(substring))) {
	            var newEnd = match.index;
	          }
	          result = result.slice(0, newEnd === undefined ? end : newEnd);
	        }
	      } else if (string.indexOf(separator, end) != end) {
	        var index = result.lastIndexOf(separator);
	        if (index > -1) {
	          result = result.slice(0, index);
	        }
	      }
	      return result + omission;
	    }
	
	    /**
	     * The inverse of `_.escape`; this method converts the HTML entities
	     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
	     * corresponding characters.
	     *
	     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
	     * entities use a third-party library like [_he_](https://mths.be/he).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to unescape.
	     * @returns {string} Returns the unescaped string.
	     * @example
	     *
	     * _.unescape('fred, barney, &amp; pebbles');
	     * // => 'fred, barney, & pebbles'
	     */
	    function unescape(string) {
	      string = toString(string);
	      return (string && reHasEscapedHtml.test(string))
	        ? string.replace(reEscapedHtml, unescapeHtmlChar)
	        : string;
	    }
	
	    /**
	     * Converts `string`, as space separated words, to upper case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the upper cased string.
	     * @example
	     *
	     * _.upperCase('--foo-bar');
	     * // => 'FOO BAR'
	     *
	     * _.upperCase('fooBar');
	     * // => 'FOO BAR'
	     *
	     * _.upperCase('__foo_bar__');
	     * // => 'FOO BAR'
	     */
	    var upperCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + word.toUpperCase();
	    });
	
	    /**
	     * Splits `string` into an array of its words.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to inspect.
	     * @param {RegExp|string} [pattern] The pattern to match words.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the words of `string`.
	     * @example
	     *
	     * _.words('fred, barney, & pebbles');
	     * // => ['fred', 'barney', 'pebbles']
	     *
	     * _.words('fred, barney, & pebbles', /[^, ]+/g);
	     * // => ['fred', 'barney', '&', 'pebbles']
	     */
	    function words(string, pattern, guard) {
	      string = toString(string);
	      pattern = guard ? undefined : pattern;
	
	      if (pattern === undefined) {
	        pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord;
	      }
	      return string.match(pattern) || [];
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Attempts to invoke `func`, returning either the result or the caught error
	     * object. Any additional arguments are provided to `func` when it's invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Function} func The function to attempt.
	     * @returns {*} Returns the `func` result or error object.
	     * @example
	     *
	     * // Avoid throwing errors for invalid selectors.
	     * var elements = _.attempt(function(selector) {
	     *   return document.querySelectorAll(selector);
	     * }, '>_>');
	     *
	     * if (_.isError(elements)) {
	     *   elements = [];
	     * }
	     */
	    var attempt = rest(function(func, args) {
	      try {
	        return apply(func, undefined, args);
	      } catch (e) {
	        return isObject(e) ? e : new Error(e);
	      }
	    });
	
	    /**
	     * Binds methods of an object to the object itself, overwriting the existing
	     * method.
	     *
	     * **Note:** This method doesn't set the "length" property of bound functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} object The object to bind and assign the bound methods to.
	     * @param {...(string|string[])} methodNames The object method names to bind,
	     *  specified individually or in arrays.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'onClick': function() {
	     *     console.log('clicked ' + this.label);
	     *   }
	     * };
	     *
	     * _.bindAll(view, 'onClick');
	     * jQuery(element).on('click', view.onClick);
	     * // => logs 'clicked docs' when clicked
	     */
	    var bindAll = rest(function(object, methodNames) {
	      arrayEach(baseFlatten(methodNames), function(key) {
	        object[key] = bind(object[key], object);
	      });
	      return object;
	    });
	
	    /**
	     * Creates a function that iterates over `pairs` invoking the corresponding
	     * function of the first predicate to return truthy. The predicate-function
	     * pairs are invoked with the `this` binding and arguments of the created
	     * function.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Array} pairs The predicate-function pairs.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.cond([
	     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
	     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
	     *   [_.constant(true),                _.constant('no match')]
	     * ]);
	     *
	     * func({ 'a': 1, 'b': 2 });
	     * // => 'matches A'
	     *
	     * func({ 'a': 0, 'b': 1 });
	     * // => 'matches B'
	     *
	     * func({ 'a': '1', 'b': '2' });
	     * // => 'no match'
	     */
	    function cond(pairs) {
	      var length = pairs ? pairs.length : 0,
	          toIteratee = getIteratee();
	
	      pairs = !length ? [] : arrayMap(pairs, function(pair) {
	        if (typeof pair[1] != 'function') {
	          throw new TypeError(FUNC_ERROR_TEXT);
	        }
	        return [toIteratee(pair[0]), pair[1]];
	      });
	
	      return rest(function(args) {
	        var index = -1;
	        while (++index < length) {
	          var pair = pairs[index];
	          if (apply(pair[0], this, args)) {
	            return apply(pair[1], this, args);
	          }
	        }
	      });
	    }
	
	    /**
	     * Creates a function that invokes the predicate properties of `source` with
	     * the corresponding property values of a given object, returning `true` if
	     * all predicates return truthy, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} source The object of property predicates to conform to.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.filter(users, _.conforms({ 'age': _.partial(_.gt, _, 38) }));
	     * // => [{ 'user': 'fred', 'age': 40 }]
	     */
	    function conforms(source) {
	      return baseConforms(baseClone(source, true));
	    }
	
	    /**
	     * Creates a function that returns `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {*} value The value to return from the new function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var getter = _.constant(object);
	     *
	     * getter() === object;
	     * // => true
	     */
	    function constant(value) {
	      return function() {
	        return value;
	      };
	    }
	
	    /**
	     * Creates a function that returns the result of invoking the provided
	     * functions with the `this` binding of the created function, where each
	     * successive invocation is supplied the return value of the previous.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} [funcs] Functions to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var addSquare = _.flow(_.add, square);
	     * addSquare(1, 2);
	     * // => 9
	     */
	    var flow = createFlow();
	
	    /**
	     * This method is like `_.flow` except that it creates a function that
	     * invokes the provided functions from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} [funcs] Functions to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var addSquare = _.flowRight(square, _.add);
	     * addSquare(1, 2);
	     * // => 9
	     */
	    var flowRight = createFlow(true);
	
	    /**
	     * This method returns the first argument provided to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {*} value Any value.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * _.identity(object) === object;
	     * // => true
	     */
	    function identity(value) {
	      return value;
	    }
	
	    /**
	     * Creates a function that invokes `func` with the arguments of the created
	     * function. If `func` is a property name the created callback returns the
	     * property value for a given element. If `func` is an object the created
	     * callback returns `true` for elements that contain the equivalent object properties, otherwise it returns `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {*} [func=_.identity] The value to convert to a callback.
	     * @returns {Function} Returns the callback.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * // Create custom iteratee shorthands.
	     * _.iteratee = _.wrap(_.iteratee, function(callback, func) {
	     *   var p = /^(\S+)\s*([<>])\s*(\S+)$/.exec(func);
	     *   return !p ? callback(func) : function(object) {
	     *     return (p[2] == '>' ? object[p[1]] > p[3] : object[p[1]] < p[3]);
	     *   };
	     * });
	     *
	     * _.filter(users, 'age > 36');
	     * // => [{ 'user': 'fred', 'age': 40 }]
	     */
	    function iteratee(func) {
	      return baseIteratee(typeof func == 'function' ? func : baseClone(func, true));
	    }
	
	    /**
	     * Creates a function that performs a deep partial comparison between a given
	     * object and `source`, returning `true` if the given object has equivalent
	     * property values, else `false`.
	     *
	     * **Note:** This method supports comparing the same values as `_.isEqual`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} source The object of property values to match.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
	     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
	     */
	    function matches(source) {
	      return baseMatches(baseClone(source, true));
	    }
	
	    /**
	     * Creates a function that performs a deep partial comparison between the
	     * value at `path` of a given object to `srcValue`, returning `true` if the
	     * object value is equivalent, else `false`.
	     *
	     * **Note:** This method supports comparing the same values as `_.isEqual`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Array|string} path The path of the property to get.
	     * @param {*} srcValue The value to match.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * _.find(users, _.matchesProperty('user', 'fred'));
	     * // => { 'user': 'fred' }
	     */
	    function matchesProperty(path, srcValue) {
	      return baseMatchesProperty(path, baseClone(srcValue, true));
	    }
	
	    /**
	     * Creates a function that invokes the method at `path` of a given object.
	     * Any additional arguments are provided to the invoked method.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Array|string} path The path of the method to invoke.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var objects = [
	     *   { 'a': { 'b': { 'c': _.constant(2) } } },
	     *   { 'a': { 'b': { 'c': _.constant(1) } } }
	     * ];
	     *
	     * _.map(objects, _.method('a.b.c'));
	     * // => [2, 1]
	     *
	     * _.invokeMap(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
	     * // => [1, 2]
	     */
	    var method = rest(function(path, args) {
	      return function(object) {
	        return baseInvoke(object, path, args);
	      };
	    });
	
	    /**
	     * The opposite of `_.method`; this method creates a function that invokes
	     * the method at a given path of `object`. Any additional arguments are
	     * provided to the invoked method.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} object The object to query.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var array = _.times(3, _.constant),
	     *     object = { 'a': array, 'b': array, 'c': array };
	     *
	     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
	     * // => [2, 0]
	     *
	     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
	     * // => [2, 0]
	     */
	    var methodOf = rest(function(object, args) {
	      return function(path) {
	        return baseInvoke(object, path, args);
	      };
	    });
	
	    /**
	     * Adds all own enumerable function properties of a source object to the
	     * destination object. If `object` is a function then methods are added to
	     * its prototype as well.
	     *
	     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
	     * avoid conflicts caused by modifying the original.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Function|Object} [object=lodash] The destination object.
	     * @param {Object} source The object of functions to add.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.chain=true] Specify whether the functions added
	     *  are chainable.
	     * @returns {Function|Object} Returns `object`.
	     * @example
	     *
	     * function vowels(string) {
	     *   return _.filter(string, function(v) {
	     *     return /[aeiou]/i.test(v);
	     *   });
	     * }
	     *
	     * _.mixin({ 'vowels': vowels });
	     * _.vowels('fred');
	     * // => ['e']
	     *
	     * _('fred').vowels().value();
	     * // => ['e']
	     *
	     * _.mixin({ 'vowels': vowels }, { 'chain': false });
	     * _('fred').vowels();
	     * // => ['e']
	     */
	    function mixin(object, source, options) {
	      var props = keys(source),
	          methodNames = baseFunctions(source, props);
	
	      if (options == null &&
	          !(isObject(source) && (methodNames.length || !props.length))) {
	        options = source;
	        source = object;
	        object = this;
	        methodNames = baseFunctions(source, keys(source));
	      }
	      var chain = (isObject(options) && 'chain' in options) ? options.chain : true,
	          isFunc = isFunction(object);
	
	      arrayEach(methodNames, function(methodName) {
	        var func = source[methodName];
	        object[methodName] = func;
	        if (isFunc) {
	          object.prototype[methodName] = function() {
	            var chainAll = this.__chain__;
	            if (chain || chainAll) {
	              var result = object(this.__wrapped__),
	                  actions = result.__actions__ = copyArray(this.__actions__);
	
	              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
	              result.__chain__ = chainAll;
	              return result;
	            }
	            return func.apply(object, arrayPush([this.value()], arguments));
	          };
	        }
	      });
	
	      return object;
	    }
	
	    /**
	     * Reverts the `_` variable to its previous value and returns a reference to
	     * the `lodash` function.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @returns {Function} Returns the `lodash` function.
	     * @example
	     *
	     * var lodash = _.noConflict();
	     */
	    function noConflict() {
	      if (root._ === this) {
	        root._ = oldDash;
	      }
	      return this;
	    }
	
	    /**
	     * A no-operation function that returns `undefined` regardless of the
	     * arguments it receives.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * _.noop(object) === undefined;
	     * // => true
	     */
	    function noop() {
	      // No operation performed.
	    }
	
	    /**
	     * Creates a function that returns its nth argument.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {number} [n=0] The index of the argument to return.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.nthArg(1);
	     *
	     * func('a', 'b', 'c');
	     * // => 'b'
	     */
	    function nthArg(n) {
	      n = toInteger(n);
	      return function() {
	        return arguments[n];
	      };
	    }
	
	    /**
	     * Creates a function that invokes `iteratees` with the arguments provided
	     * to the created function and returns their results.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} iteratees The iteratees to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.over(Math.max, Math.min);
	     *
	     * func(1, 2, 3, 4);
	     * // => [4, 1]
	     */
	    var over = createOver(arrayMap);
	
	    /**
	     * Creates a function that checks if **all** of the `predicates` return
	     * truthy when invoked with the arguments provided to the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} predicates The predicates to check.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.overEvery(Boolean, isFinite);
	     *
	     * func('1');
	     * // => true
	     *
	     * func(null);
	     * // => false
	     *
	     * func(NaN);
	     * // => false
	     */
	    var overEvery = createOver(arrayEvery);
	
	    /**
	     * Creates a function that checks if **any** of the `predicates` return
	     * truthy when invoked with the arguments provided to the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} predicates The predicates to check.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.overSome(Boolean, isFinite);
	     *
	     * func('1');
	     * // => true
	     *
	     * func(null);
	     * // => true
	     *
	     * func(NaN);
	     * // => false
	     */
	    var overSome = createOver(arraySome);
	
	    /**
	     * Creates a function that returns the value at `path` of a given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Array|string} path The path of the property to get.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var objects = [
	     *   { 'a': { 'b': { 'c': 2 } } },
	     *   { 'a': { 'b': { 'c': 1 } } }
	     * ];
	     *
	     * _.map(objects, _.property('a.b.c'));
	     * // => [2, 1]
	     *
	     * _.map(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	     * // => [1, 2]
	     */
	    function property(path) {
	      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	    }
	
	    /**
	     * The opposite of `_.property`; this method creates a function that returns
	     * the value at a given path of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} object The object to query.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var array = [0, 1, 2],
	     *     object = { 'a': array, 'b': array, 'c': array };
	     *
	     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
	     * // => [2, 0]
	     *
	     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
	     * // => [2, 0]
	     */
	    function propertyOf(object) {
	      return function(path) {
	        return object == null ? undefined : baseGet(object, path);
	      };
	    }
	
	    /**
	     * Creates an array of numbers (positive and/or negative) progressing from
	     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
	     * `start` is specified without an `end` or `step`. If `end` is not specified
	     * it's set to `start` with `start` then set to `0`.
	     *
	     * **Note:** JavaScript follows the IEEE-754 standard for resolving
	     * floating-point values which can produce unexpected results.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} [step=1] The value to increment or decrement by.
	     * @returns {Array} Returns the new array of numbers.
	     * @example
	     *
	     * _.range(4);
	     * // => [0, 1, 2, 3]
	     *
	     * _.range(-4);
	     * // => [0, -1, -2, -3]
	     *
	     * _.range(1, 5);
	     * // => [1, 2, 3, 4]
	     *
	     * _.range(0, 20, 5);
	     * // => [0, 5, 10, 15]
	     *
	     * _.range(0, -4, -1);
	     * // => [0, -1, -2, -3]
	     *
	     * _.range(1, 4, 0);
	     * // => [1, 1, 1]
	     *
	     * _.range(0);
	     * // => []
	     */
	    var range = createRange();
	
	    /**
	     * This method is like `_.range` except that it populates values in
	     * descending order.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} [step=1] The value to increment or decrement by.
	     * @returns {Array} Returns the new array of numbers.
	     * @example
	     *
	     * _.rangeRight(4);
	     * // => [3, 2, 1, 0]
	     *
	     * _.rangeRight(-4);
	     * // => [-3, -2, -1, 0]
	     *
	     * _.rangeRight(1, 5);
	     * // => [4, 3, 2, 1]
	     *
	     * _.rangeRight(0, 20, 5);
	     * // => [15, 10, 5, 0]
	     *
	     * _.rangeRight(0, -4, -1);
	     * // => [-3, -2, -1, 0]
	     *
	     * _.rangeRight(1, 4, 0);
	     * // => [1, 1, 1]
	     *
	     * _.rangeRight(0);
	     * // => []
	     */
	    var rangeRight = createRange(true);
	
	    /**
	     * Invokes the iteratee function `n` times, returning an array of the results
	     * of each invocation. The iteratee is invoked with one argument; (index).
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {number} n The number of times to invoke `iteratee`.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the array of results.
	     * @example
	     *
	     * _.times(3, String);
	     * // => ['0', '1', '2']
	     *
	     *  _.times(4, _.constant(true));
	     * // => [true, true, true, true]
	     */
	    function times(n, iteratee) {
	      n = toInteger(n);
	      if (n < 1 || n > MAX_SAFE_INTEGER) {
	        return [];
	      }
	      var index = MAX_ARRAY_LENGTH,
	          length = nativeMin(n, MAX_ARRAY_LENGTH);
	
	      iteratee = toFunction(iteratee);
	      n -= MAX_ARRAY_LENGTH;
	
	      var result = baseTimes(length, iteratee);
	      while (++index < n) {
	        iteratee(index);
	      }
	      return result;
	    }
	
	    /**
	     * Converts `value` to a property path array.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {*} value The value to convert.
	     * @returns {Array} Returns the new property path array.
	     * @example
	     *
	     * _.toPath('a.b.c');
	     * // => ['a', 'b', 'c']
	     *
	     * _.toPath('a[0].b.c');
	     * // => ['a', '0', 'b', 'c']
	     *
	     * var path = ['a', 'b', 'c'],
	     *     newPath = _.toPath(path);
	     *
	     * console.log(newPath);
	     * // => ['a', 'b', 'c']
	     *
	     * console.log(path === newPath);
	     * // => false
	     */
	    function toPath(value) {
	      return isArray(value) ? arrayMap(value, String) : stringToPath(value);
	    }
	
	    /**
	     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {string} [prefix] The value to prefix the ID with.
	     * @returns {string} Returns the unique ID.
	     * @example
	     *
	     * _.uniqueId('contact_');
	     * // => 'contact_104'
	     *
	     * _.uniqueId();
	     * // => '105'
	     */
	    function uniqueId(prefix) {
	      var id = ++idCounter;
	      return toString(prefix) + id;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Adds two numbers.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} augend The first number in an addition.
	     * @param {number} addend The second number in an addition.
	     * @returns {number} Returns the total.
	     * @example
	     *
	     * _.add(6, 4);
	     * // => 10
	     */
	    function add(augend, addend) {
	      var result;
	      if (augend !== undefined) {
	        result = augend;
	      }
	      if (addend !== undefined) {
	        result = result === undefined ? addend : (result + addend);
	      }
	      return result;
	    }
	
	    /**
	     * Computes `number` rounded up to `precision`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} number The number to round up.
	     * @param {number} [precision=0] The precision to round up to.
	     * @returns {number} Returns the rounded up number.
	     * @example
	     *
	     * _.ceil(4.006);
	     * // => 5
	     *
	     * _.ceil(6.004, 2);
	     * // => 6.01
	     *
	     * _.ceil(6040, -2);
	     * // => 6100
	     */
	    var ceil = createRound('ceil');
	
	    /**
	     * Computes `number` rounded down to `precision`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} number The number to round down.
	     * @param {number} [precision=0] The precision to round down to.
	     * @returns {number} Returns the rounded down number.
	     * @example
	     *
	     * _.floor(4.006);
	     * // => 4
	     *
	     * _.floor(0.046, 2);
	     * // => 0.04
	     *
	     * _.floor(4060, -2);
	     * // => 4000
	     */
	    var floor = createRound('floor');
	
	    /**
	     * Computes the maximum value of `array`. If `array` is empty or falsey
	     * `undefined` is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @returns {*} Returns the maximum value.
	     * @example
	     *
	     * _.max([4, 2, 8, 6]);
	     * // => 8
	     *
	     * _.max([]);
	     * // => undefined
	     */
	    function max(array) {
	      return (array && array.length)
	        ? baseExtremum(array, identity, gt)
	        : undefined;
	    }
	
	    /**
	     * This method is like `_.max` except that it accepts `iteratee` which is
	     * invoked for each element in `array` to generate the criterion by which
	     * the value is ranked. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {*} Returns the maximum value.
	     * @example
	     *
	     * var objects = [{ 'n': 1 }, { 'n': 2 }];
	     *
	     * _.maxBy(objects, function(o) { return o.n; });
	     * // => { 'n': 2 }
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.maxBy(objects, 'n');
	     * // => { 'n': 2 }
	     */
	    function maxBy(array, iteratee) {
	      return (array && array.length)
	        ? baseExtremum(array, getIteratee(iteratee), gt)
	        : undefined;
	    }
	
	    /**
	     * Computes the mean of the values in `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @returns {number} Returns the mean.
	     * @example
	     *
	     * _.mean([4, 2, 8, 6]);
	     * // => 5
	     */
	    function mean(array) {
	      return sum(array) / (array ? array.length : 0);
	    }
	
	    /**
	     * Computes the minimum value of `array`. If `array` is empty or falsey
	     * `undefined` is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @returns {*} Returns the minimum value.
	     * @example
	     *
	     * _.min([4, 2, 8, 6]);
	     * // => 2
	     *
	     * _.min([]);
	     * // => undefined
	     */
	    function min(array) {
	      return (array && array.length)
	        ? baseExtremum(array, identity, lt)
	        : undefined;
	    }
	
	    /**
	     * This method is like `_.min` except that it accepts `iteratee` which is
	     * invoked for each element in `array` to generate the criterion by which
	     * the value is ranked. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {*} Returns the minimum value.
	     * @example
	     *
	     * var objects = [{ 'n': 1 }, { 'n': 2 }];
	     *
	     * _.minBy(objects, function(o) { return o.n; });
	     * // => { 'n': 1 }
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.minBy(objects, 'n');
	     * // => { 'n': 1 }
	     */
	    function minBy(array, iteratee) {
	      return (array && array.length)
	        ? baseExtremum(array, getIteratee(iteratee), lt)
	        : undefined;
	    }
	
	    /**
	     * Computes `number` rounded to `precision`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} number The number to round.
	     * @param {number} [precision=0] The precision to round to.
	     * @returns {number} Returns the rounded number.
	     * @example
	     *
	     * _.round(4.006);
	     * // => 4
	     *
	     * _.round(4.006, 2);
	     * // => 4.01
	     *
	     * _.round(4060, -2);
	     * // => 4100
	     */
	    var round = createRound('round');
	
	    /**
	     * Subtract two numbers.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} minuend The first number in a subtraction.
	     * @param {number} subtrahend The second number in a subtraction.
	     * @returns {number} Returns the difference.
	     * @example
	     *
	     * _.subtract(6, 4);
	     * // => 2
	     */
	    function subtract(minuend, subtrahend) {
	      var result;
	      if (minuend !== undefined) {
	        result = minuend;
	      }
	      if (subtrahend !== undefined) {
	        result = result === undefined ? subtrahend : (result - subtrahend);
	      }
	      return result;
	    }
	
	    /**
	     * Computes the sum of the values in `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @returns {number} Returns the sum.
	     * @example
	     *
	     * _.sum([4, 2, 8, 6]);
	     * // => 20
	     */
	    function sum(array) {
	      return (array && array.length)
	        ? baseSum(array, identity)
	        : 0;
	    }
	
	    /**
	     * This method is like `_.sum` except that it accepts `iteratee` which is
	     * invoked for each element in `array` to generate the value to be summed.
	     * The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {number} Returns the sum.
	     * @example
	     *
	     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
	     *
	     * _.sumBy(objects, function(o) { return o.n; });
	     * // => 20
	     *
	     * // The `_.property` iteratee shorthand.
	     * _.sumBy(objects, 'n');
	     * // => 20
	     */
	    function sumBy(array, iteratee) {
	      return (array && array.length)
	        ? baseSum(array, getIteratee(iteratee))
	        : 0;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    // Ensure wrappers are instances of `baseLodash`.
	    lodash.prototype = baseLodash.prototype;
	
	    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
	    LodashWrapper.prototype.constructor = LodashWrapper;
	
	    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
	    LazyWrapper.prototype.constructor = LazyWrapper;
	
	    // Avoid inheriting from `Object.prototype` when possible.
	    Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;
	
	    // Add functions to the `MapCache`.
	    MapCache.prototype.clear = mapClear;
	    MapCache.prototype['delete'] = mapDelete;
	    MapCache.prototype.get = mapGet;
	    MapCache.prototype.has = mapHas;
	    MapCache.prototype.set = mapSet;
	
	    // Add functions to the `SetCache`.
	    SetCache.prototype.push = cachePush;
	
	    // Add functions to the `Stack` cache.
	    Stack.prototype.clear = stackClear;
	    Stack.prototype['delete'] = stackDelete;
	    Stack.prototype.get = stackGet;
	    Stack.prototype.has = stackHas;
	    Stack.prototype.set = stackSet;
	
	    // Assign cache to `_.memoize`.
	    memoize.Cache = MapCache;
	
	    // Add functions that return wrapped values when chaining.
	    lodash.after = after;
	    lodash.ary = ary;
	    lodash.assign = assign;
	    lodash.assignIn = assignIn;
	    lodash.assignInWith = assignInWith;
	    lodash.assignWith = assignWith;
	    lodash.at = at;
	    lodash.before = before;
	    lodash.bind = bind;
	    lodash.bindAll = bindAll;
	    lodash.bindKey = bindKey;
	    lodash.chain = chain;
	    lodash.chunk = chunk;
	    lodash.compact = compact;
	    lodash.concat = concat;
	    lodash.cond = cond;
	    lodash.conforms = conforms;
	    lodash.constant = constant;
	    lodash.countBy = countBy;
	    lodash.create = create;
	    lodash.curry = curry;
	    lodash.curryRight = curryRight;
	    lodash.debounce = debounce;
	    lodash.defaults = defaults;
	    lodash.defaultsDeep = defaultsDeep;
	    lodash.defer = defer;
	    lodash.delay = delay;
	    lodash.difference = difference;
	    lodash.differenceBy = differenceBy;
	    lodash.differenceWith = differenceWith;
	    lodash.drop = drop;
	    lodash.dropRight = dropRight;
	    lodash.dropRightWhile = dropRightWhile;
	    lodash.dropWhile = dropWhile;
	    lodash.fill = fill;
	    lodash.filter = filter;
	    lodash.flatMap = flatMap;
	    lodash.flatten = flatten;
	    lodash.flattenDeep = flattenDeep;
	    lodash.flip = flip;
	    lodash.flow = flow;
	    lodash.flowRight = flowRight;
	    lodash.fromPairs = fromPairs;
	    lodash.functions = functions;
	    lodash.functionsIn = functionsIn;
	    lodash.groupBy = groupBy;
	    lodash.initial = initial;
	    lodash.intersection = intersection;
	    lodash.intersectionBy = intersectionBy;
	    lodash.intersectionWith = intersectionWith;
	    lodash.invert = invert;
	    lodash.invertBy = invertBy;
	    lodash.invokeMap = invokeMap;
	    lodash.iteratee = iteratee;
	    lodash.keyBy = keyBy;
	    lodash.keys = keys;
	    lodash.keysIn = keysIn;
	    lodash.map = map;
	    lodash.mapKeys = mapKeys;
	    lodash.mapValues = mapValues;
	    lodash.matches = matches;
	    lodash.matchesProperty = matchesProperty;
	    lodash.memoize = memoize;
	    lodash.merge = merge;
	    lodash.mergeWith = mergeWith;
	    lodash.method = method;
	    lodash.methodOf = methodOf;
	    lodash.mixin = mixin;
	    lodash.negate = negate;
	    lodash.nthArg = nthArg;
	    lodash.omit = omit;
	    lodash.omitBy = omitBy;
	    lodash.once = once;
	    lodash.orderBy = orderBy;
	    lodash.over = over;
	    lodash.overArgs = overArgs;
	    lodash.overEvery = overEvery;
	    lodash.overSome = overSome;
	    lodash.partial = partial;
	    lodash.partialRight = partialRight;
	    lodash.partition = partition;
	    lodash.pick = pick;
	    lodash.pickBy = pickBy;
	    lodash.property = property;
	    lodash.propertyOf = propertyOf;
	    lodash.pull = pull;
	    lodash.pullAll = pullAll;
	    lodash.pullAllBy = pullAllBy;
	    lodash.pullAt = pullAt;
	    lodash.range = range;
	    lodash.rangeRight = rangeRight;
	    lodash.rearg = rearg;
	    lodash.reject = reject;
	    lodash.remove = remove;
	    lodash.rest = rest;
	    lodash.reverse = reverse;
	    lodash.sampleSize = sampleSize;
	    lodash.set = set;
	    lodash.setWith = setWith;
	    lodash.shuffle = shuffle;
	    lodash.slice = slice;
	    lodash.sortBy = sortBy;
	    lodash.sortedUniq = sortedUniq;
	    lodash.sortedUniqBy = sortedUniqBy;
	    lodash.split = split;
	    lodash.spread = spread;
	    lodash.tail = tail;
	    lodash.take = take;
	    lodash.takeRight = takeRight;
	    lodash.takeRightWhile = takeRightWhile;
	    lodash.takeWhile = takeWhile;
	    lodash.tap = tap;
	    lodash.throttle = throttle;
	    lodash.thru = thru;
	    lodash.toArray = toArray;
	    lodash.toPairs = toPairs;
	    lodash.toPairsIn = toPairsIn;
	    lodash.toPath = toPath;
	    lodash.toPlainObject = toPlainObject;
	    lodash.transform = transform;
	    lodash.unary = unary;
	    lodash.union = union;
	    lodash.unionBy = unionBy;
	    lodash.unionWith = unionWith;
	    lodash.uniq = uniq;
	    lodash.uniqBy = uniqBy;
	    lodash.uniqWith = uniqWith;
	    lodash.unset = unset;
	    lodash.unzip = unzip;
	    lodash.unzipWith = unzipWith;
	    lodash.values = values;
	    lodash.valuesIn = valuesIn;
	    lodash.without = without;
	    lodash.words = words;
	    lodash.wrap = wrap;
	    lodash.xor = xor;
	    lodash.xorBy = xorBy;
	    lodash.xorWith = xorWith;
	    lodash.zip = zip;
	    lodash.zipObject = zipObject;
	    lodash.zipObjectDeep = zipObjectDeep;
	    lodash.zipWith = zipWith;
	
	    // Add aliases.
	    lodash.extend = assignIn;
	    lodash.extendWith = assignInWith;
	
	    // Add functions to `lodash.prototype`.
	    mixin(lodash, lodash);
	
	    /*------------------------------------------------------------------------*/
	
	    // Add functions that return unwrapped values when chaining.
	    lodash.add = add;
	    lodash.attempt = attempt;
	    lodash.camelCase = camelCase;
	    lodash.capitalize = capitalize;
	    lodash.ceil = ceil;
	    lodash.clamp = clamp;
	    lodash.clone = clone;
	    lodash.cloneDeep = cloneDeep;
	    lodash.cloneDeepWith = cloneDeepWith;
	    lodash.cloneWith = cloneWith;
	    lodash.deburr = deburr;
	    lodash.endsWith = endsWith;
	    lodash.eq = eq;
	    lodash.escape = escape;
	    lodash.escapeRegExp = escapeRegExp;
	    lodash.every = every;
	    lodash.find = find;
	    lodash.findIndex = findIndex;
	    lodash.findKey = findKey;
	    lodash.findLast = findLast;
	    lodash.findLastIndex = findLastIndex;
	    lodash.findLastKey = findLastKey;
	    lodash.floor = floor;
	    lodash.forEach = forEach;
	    lodash.forEachRight = forEachRight;
	    lodash.forIn = forIn;
	    lodash.forInRight = forInRight;
	    lodash.forOwn = forOwn;
	    lodash.forOwnRight = forOwnRight;
	    lodash.get = get;
	    lodash.gt = gt;
	    lodash.gte = gte;
	    lodash.has = has;
	    lodash.hasIn = hasIn;
	    lodash.head = head;
	    lodash.identity = identity;
	    lodash.includes = includes;
	    lodash.indexOf = indexOf;
	    lodash.inRange = inRange;
	    lodash.invoke = invoke;
	    lodash.isArguments = isArguments;
	    lodash.isArray = isArray;
	    lodash.isArrayLike = isArrayLike;
	    lodash.isArrayLikeObject = isArrayLikeObject;
	    lodash.isBoolean = isBoolean;
	    lodash.isDate = isDate;
	    lodash.isElement = isElement;
	    lodash.isEmpty = isEmpty;
	    lodash.isEqual = isEqual;
	    lodash.isEqualWith = isEqualWith;
	    lodash.isError = isError;
	    lodash.isFinite = isFinite;
	    lodash.isFunction = isFunction;
	    lodash.isInteger = isInteger;
	    lodash.isLength = isLength;
	    lodash.isMatch = isMatch;
	    lodash.isMatchWith = isMatchWith;
	    lodash.isNaN = isNaN;
	    lodash.isNative = isNative;
	    lodash.isNil = isNil;
	    lodash.isNull = isNull;
	    lodash.isNumber = isNumber;
	    lodash.isObject = isObject;
	    lodash.isObjectLike = isObjectLike;
	    lodash.isPlainObject = isPlainObject;
	    lodash.isRegExp = isRegExp;
	    lodash.isSafeInteger = isSafeInteger;
	    lodash.isString = isString;
	    lodash.isSymbol = isSymbol;
	    lodash.isTypedArray = isTypedArray;
	    lodash.isUndefined = isUndefined;
	    lodash.join = join;
	    lodash.kebabCase = kebabCase;
	    lodash.last = last;
	    lodash.lastIndexOf = lastIndexOf;
	    lodash.lowerCase = lowerCase;
	    lodash.lowerFirst = lowerFirst;
	    lodash.lt = lt;
	    lodash.lte = lte;
	    lodash.max = max;
	    lodash.maxBy = maxBy;
	    lodash.mean = mean;
	    lodash.min = min;
	    lodash.minBy = minBy;
	    lodash.noConflict = noConflict;
	    lodash.noop = noop;
	    lodash.now = now;
	    lodash.pad = pad;
	    lodash.padEnd = padEnd;
	    lodash.padStart = padStart;
	    lodash.parseInt = parseInt;
	    lodash.random = random;
	    lodash.reduce = reduce;
	    lodash.reduceRight = reduceRight;
	    lodash.repeat = repeat;
	    lodash.replace = replace;
	    lodash.result = result;
	    lodash.round = round;
	    lodash.runInContext = runInContext;
	    lodash.sample = sample;
	    lodash.size = size;
	    lodash.snakeCase = snakeCase;
	    lodash.some = some;
	    lodash.sortedIndex = sortedIndex;
	    lodash.sortedIndexBy = sortedIndexBy;
	    lodash.sortedIndexOf = sortedIndexOf;
	    lodash.sortedLastIndex = sortedLastIndex;
	    lodash.sortedLastIndexBy = sortedLastIndexBy;
	    lodash.sortedLastIndexOf = sortedLastIndexOf;
	    lodash.startCase = startCase;
	    lodash.startsWith = startsWith;
	    lodash.subtract = subtract;
	    lodash.sum = sum;
	    lodash.sumBy = sumBy;
	    lodash.template = template;
	    lodash.times = times;
	    lodash.toInteger = toInteger;
	    lodash.toLength = toLength;
	    lodash.toLower = toLower;
	    lodash.toNumber = toNumber;
	    lodash.toSafeInteger = toSafeInteger;
	    lodash.toString = toString;
	    lodash.toUpper = toUpper;
	    lodash.trim = trim;
	    lodash.trimEnd = trimEnd;
	    lodash.trimStart = trimStart;
	    lodash.truncate = truncate;
	    lodash.unescape = unescape;
	    lodash.uniqueId = uniqueId;
	    lodash.upperCase = upperCase;
	    lodash.upperFirst = upperFirst;
	
	    // Add aliases.
	    lodash.each = forEach;
	    lodash.eachRight = forEachRight;
	    lodash.first = head;
	
	    mixin(lodash, (function() {
	      var source = {};
	      baseForOwn(lodash, function(func, methodName) {
	        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
	          source[methodName] = func;
	        }
	      });
	      return source;
	    }()), { 'chain': false });
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * The semantic version number.
	     *
	     * @static
	     * @memberOf _
	     * @type string
	     */
	    lodash.VERSION = VERSION;
	
	    // Assign default placeholders.
	    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
	      lodash[methodName].placeholder = lodash;
	    });
	
	    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
	    arrayEach(['drop', 'take'], function(methodName, index) {
	      LazyWrapper.prototype[methodName] = function(n) {
	        var filtered = this.__filtered__;
	        if (filtered && !index) {
	          return new LazyWrapper(this);
	        }
	        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);
	
	        var result = this.clone();
	        if (filtered) {
	          result.__takeCount__ = nativeMin(n, result.__takeCount__);
	        } else {
	          result.__views__.push({ 'size': nativeMin(n, MAX_ARRAY_LENGTH), 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
	        }
	        return result;
	      };
	
	      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
	        return this.reverse()[methodName](n).reverse();
	      };
	    });
	
	    // Add `LazyWrapper` methods that accept an `iteratee` value.
	    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
	      var type = index + 1,
	          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
	
	      LazyWrapper.prototype[methodName] = function(iteratee) {
	        var result = this.clone();
	        result.__iteratees__.push({ 'iteratee': getIteratee(iteratee, 3), 'type': type });
	        result.__filtered__ = result.__filtered__ || isFilter;
	        return result;
	      };
	    });
	
	    // Add `LazyWrapper` methods for `_.head` and `_.last`.
	    arrayEach(['head', 'last'], function(methodName, index) {
	      var takeName = 'take' + (index ? 'Right' : '');
	
	      LazyWrapper.prototype[methodName] = function() {
	        return this[takeName](1).value()[0];
	      };
	    });
	
	    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
	    arrayEach(['initial', 'tail'], function(methodName, index) {
	      var dropName = 'drop' + (index ? '' : 'Right');
	
	      LazyWrapper.prototype[methodName] = function() {
	        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
	      };
	    });
	
	    LazyWrapper.prototype.compact = function() {
	      return this.filter(identity);
	    };
	
	    LazyWrapper.prototype.find = function(predicate) {
	      return this.filter(predicate).head();
	    };
	
	    LazyWrapper.prototype.findLast = function(predicate) {
	      return this.reverse().find(predicate);
	    };
	
	    LazyWrapper.prototype.invokeMap = rest(function(path, args) {
	      if (typeof path == 'function') {
	        return new LazyWrapper(this);
	      }
	      return this.map(function(value) {
	        return baseInvoke(value, path, args);
	      });
	    });
	
	    LazyWrapper.prototype.reject = function(predicate) {
	      predicate = getIteratee(predicate, 3);
	      return this.filter(function(value) {
	        return !predicate(value);
	      });
	    };
	
	    LazyWrapper.prototype.slice = function(start, end) {
	      start = toInteger(start);
	
	      var result = this;
	      if (result.__filtered__ && (start > 0 || end < 0)) {
	        return new LazyWrapper(result);
	      }
	      if (start < 0) {
	        result = result.takeRight(-start);
	      } else if (start) {
	        result = result.drop(start);
	      }
	      if (end !== undefined) {
	        end = toInteger(end);
	        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
	      }
	      return result;
	    };
	
	    LazyWrapper.prototype.takeRightWhile = function(predicate) {
	      return this.reverse().takeWhile(predicate).reverse();
	    };
	
	    LazyWrapper.prototype.toArray = function() {
	      return this.take(MAX_ARRAY_LENGTH);
	    };
	
	    // Add `LazyWrapper` methods to `lodash.prototype`.
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
	          isTaker = /^(?:head|last)$/.test(methodName),
	          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
	          retUnwrapped = isTaker || /^find/.test(methodName);
	
	      if (!lodashFunc) {
	        return;
	      }
	      lodash.prototype[methodName] = function() {
	        var value = this.__wrapped__,
	            args = isTaker ? [1] : arguments,
	            isLazy = value instanceof LazyWrapper,
	            iteratee = args[0],
	            useLazy = isLazy || isArray(value);
	
	        var interceptor = function(value) {
	          var result = lodashFunc.apply(lodash, arrayPush([value], args));
	          return (isTaker && chainAll) ? result[0] : result;
	        };
	
	        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
	          // Avoid lazy use if the iteratee has a "length" value other than `1`.
	          isLazy = useLazy = false;
	        }
	        var chainAll = this.__chain__,
	            isHybrid = !!this.__actions__.length,
	            isUnwrapped = retUnwrapped && !chainAll,
	            onlyLazy = isLazy && !isHybrid;
	
	        if (!retUnwrapped && useLazy) {
	          value = onlyLazy ? value : new LazyWrapper(this);
	          var result = func.apply(value, args);
	          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
	          return new LodashWrapper(result, chainAll);
	        }
	        if (isUnwrapped && onlyLazy) {
	          return func.apply(this, args);
	        }
	        result = this.thru(interceptor);
	        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
	      };
	    });
	
	    // Add `Array` and `String` methods to `lodash.prototype`.
	    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
	      var func = arrayProto[methodName],
	          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
	          retUnwrapped = /^(?:pop|shift)$/.test(methodName);
	
	      lodash.prototype[methodName] = function() {
	        var args = arguments;
	        if (retUnwrapped && !this.__chain__) {
	          return func.apply(this.value(), args);
	        }
	        return this[chainName](function(value) {
	          return func.apply(value, args);
	        });
	      };
	    });
	
	    // Map minified function names to their real names.
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var lodashFunc = lodash[methodName];
	      if (lodashFunc) {
	        var key = (lodashFunc.name + ''),
	            names = realNames[key] || (realNames[key] = []);
	
	        names.push({ 'name': methodName, 'func': lodashFunc });
	      }
	    });
	
	    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': undefined }];
	
	    // Add functions to the lazy wrapper.
	    LazyWrapper.prototype.clone = lazyClone;
	    LazyWrapper.prototype.reverse = lazyReverse;
	    LazyWrapper.prototype.value = lazyValue;
	
	    // Add chaining functions to the `lodash` wrapper.
	    lodash.prototype.at = wrapperAt;
	    lodash.prototype.chain = wrapperChain;
	    lodash.prototype.commit = wrapperCommit;
	    lodash.prototype.flatMap = wrapperFlatMap;
	    lodash.prototype.next = wrapperNext;
	    lodash.prototype.plant = wrapperPlant;
	    lodash.prototype.reverse = wrapperReverse;
	    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
	
	    if (iteratorSymbol) {
	      lodash.prototype[iteratorSymbol] = wrapperToIterator;
	    }
	    return lodash;
	  }
	
	  /*--------------------------------------------------------------------------*/
	
	  // Export lodash.
	  var _ = runInContext();
	
	  // Expose lodash on the free variable `window` or `self` when available. This
	  // prevents errors in cases where lodash is loaded by a script tag in the presence
	  // of an AMD loader. See http://requirejs.org/docs/errors.html#mismatch for more details.
	  (freeWindow || freeSelf || {})._ = _;
	
	  // Some AMD build optimizers like r.js check for condition patterns like the following:
	  if (true) {
	    // Define as an anonymous module so, through path mapping, it can be
	    // referenced as the "underscore" module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
	  else if (freeExports && freeModule) {
	    // Export for Node.js.
	    if (moduleExports) {
	      (freeModule.exports = _)._ = _;
	    }
	    // Export for CommonJS support.
	    freeExports._ = _;
	  }
	  else {
	    // Export to the global object.
	    root._ = _;
	  }
	}.call(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(51)(module), (function() { return this; }())))

/***/ },
/* 50 */
/***/ function(module, exports) {



/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ]);
//# sourceMappingURL=jspath-mutator.js.map