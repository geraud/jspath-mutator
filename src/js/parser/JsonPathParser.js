// Generated from /Users/gboyer/Projects/JavaScript/jspath-mutator/src/antlr/JsonPath.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var JsonPathVisitor = require('./JsonPathVisitor').JsonPathVisitor;

var grammarFileName = "JsonPath.g4";

var serializedATN = ["\u0003\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\u0003\u000eS\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0003\u0003\u0003\u0006\u0003\"\n\u0003\r\u0003\u000e\u0003#\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0005\u0004)\n\u0004\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0007\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003\t\u0003\t\u0003",
    "\t\u0005\t:\n\t\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0005\u000b",
    "@\n\u000b\u0003\f\u0005\fC\n\f\u0003\f\u0003\f\u0005\fG\n\f\u0003\f",
    "\u0003\f\u0005\fK\n\f\u0003\r\u0003\r\u0003\r\u0003\r\u0003\u000e\u0003",
    "\u000e\u0003\u000e\u0002\u0002\u000f\u0002\u0004\u0006\b\n\f\u000e\u0010",
    "\u0012\u0014\u0016\u0018\u001a\u0002\u0004\u0004\u0002\b\b\f\f\u0003",
    "\u0002\f\rN\u0002\u001c\u0003\u0002\u0002\u0002\u0004\u001f\u0003\u0002",
    "\u0002\u0002\u0006(\u0003\u0002\u0002\u0002\b*\u0003\u0002\u0002\u0002",
    "\n-\u0003\u0002\u0002\u0002\f1\u0003\u0002\u0002\u0002\u000e4\u0003",
    "\u0002\u0002\u0002\u00109\u0003\u0002\u0002\u0002\u0012;\u0003\u0002",
    "\u0002\u0002\u0014?\u0003\u0002\u0002\u0002\u0016B\u0003\u0002\u0002",
    "\u0002\u0018L\u0003\u0002\u0002\u0002\u001aP\u0003\u0002\u0002\u0002",
    "\u001c\u001d\u0005\u0004\u0003\u0002\u001d\u001e\u0007\u0002\u0002\u0003",
    "\u001e\u0003\u0003\u0002\u0002\u0002\u001f!\u0007\u0003\u0002\u0002",
    " \"\u0005\u0006\u0004\u0002! \u0003\u0002\u0002\u0002\"#\u0003\u0002",
    "\u0002\u0002#!\u0003\u0002\u0002\u0002#$\u0003\u0002\u0002\u0002$\u0005",
    "\u0003\u0002\u0002\u0002%)\u0005\f\u0007\u0002&)\u0005\b\u0005\u0002",
    "\')\u0005\n\u0006\u0002(%\u0003\u0002\u0002\u0002(&\u0003\u0002\u0002",
    "\u0002(\'\u0003\u0002\u0002\u0002)\u0007\u0003\u0002\u0002\u0002*+\u0007",
    "\u0004\u0002\u0002+,\u0005\u000e\b\u0002,\t\u0003\u0002\u0002\u0002",
    "-.\u0007\u0005\u0002\u0002./\u0005\u0010\t\u0002/0\u0007\u0006\u0002",
    "\u00020\u000b\u0003\u0002\u0002\u000212\u0007\u0007\u0002\u000223\u0005",
    "\u000e\b\u00023\r\u0003\u0002\u0002\u000245\t\u0002\u0002\u00025\u000f",
    "\u0003\u0002\u0002\u00026:\u0005\u001a\u000e\u00027:\u0005\u0014\u000b",
    "\u00028:\u0005\u0012\n\u000296\u0003\u0002\u0002\u000297\u0003\u0002",
    "\u0002\u000298\u0003\u0002\u0002\u0002:\u0011\u0003\u0002\u0002\u0002",
    ";<\u0007\u000b\u0002\u0002<\u0013\u0003\u0002\u0002\u0002=@\u0005\u0016",
    "\f\u0002>@\u0005\u0018\r\u0002?=\u0003\u0002\u0002\u0002?>\u0003\u0002",
    "\u0002\u0002@\u0015\u0003\u0002\u0002\u0002AC\u0007\r\u0002\u0002BA",
    "\u0003\u0002\u0002\u0002BC\u0003\u0002\u0002\u0002CD\u0003\u0002\u0002",
    "\u0002DF\u0007\t\u0002\u0002EG\u0007\r\u0002\u0002FE\u0003\u0002\u0002",
    "\u0002FG\u0003\u0002\u0002\u0002GJ\u0003\u0002\u0002\u0002HI\u0007\t",
    "\u0002\u0002IK\u0007\r\u0002\u0002JH\u0003\u0002\u0002\u0002JK\u0003",
    "\u0002\u0002\u0002K\u0017\u0003\u0002\u0002\u0002LM\u0007\r\u0002\u0002",
    "MN\u0007\n\u0002\u0002NO\u0007\r\u0002\u0002O\u0019\u0003\u0002\u0002",
    "\u0002PQ\t\u0003\u0002\u0002Q\u001b\u0003\u0002\u0002\u0002\t#(9?BF",
    "J"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ 'null', "'$'", "'.'", "'['", "']'", "'..'", "'*'", 
                     "':'", "','" ];

var symbolicNames = [ 'null', 'null', 'null', 'null', 'null', 'null', 'null', 
                      'null', 'null', "Interpolation", "Identifier", "NumericIndex", 
                      "WS" ];

var ruleNames =  [ "parseJsonPath", "jsonPath", "accessSpec", "dotAccess", 
                   "bracketAccess", "recursiveDescent", "selector", "bracketExpression", 
                   "interpolation", "arraySlice", "arraySection", "simpleSection", 
                   "fieldIndex" ];

function JsonPathParser (input) {
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
	get : function() {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_parseJsonPath;
    return this;
}

ParseJsonPathContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParseJsonPathContext.prototype.constructor = ParseJsonPathContext;

ParseJsonPathContext.prototype.jsonPath = function() {
    return this.getTypedRuleContext(JsonPathContext,0);
};

ParseJsonPathContext.prototype.EOF = function() {
    return this.getToken(JsonPathParser.EOF, 0);
};

ParseJsonPathContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitParseJsonPath(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.ParseJsonPathContext = ParseJsonPathContext;

JsonPathParser.prototype.parseJsonPath = function() {

    var localctx = new ParseJsonPathContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, JsonPathParser.RULE_parseJsonPath);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 26;
        this.jsonPath();
        this.state = 27;
        this.match(JsonPathParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_jsonPath;
    return this;
}

JsonPathContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
JsonPathContext.prototype.constructor = JsonPathContext;

JsonPathContext.prototype.accessSpec = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(AccessSpecContext);
    } else {
        return this.getTypedRuleContext(AccessSpecContext,i);
    }
};

JsonPathContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitJsonPath(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.JsonPathContext = JsonPathContext;

JsonPathParser.prototype.jsonPath = function() {

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
        } while((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << JsonPathParser.T__1) | (1 << JsonPathParser.T__2) | (1 << JsonPathParser.T__4))) !== 0));
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_accessSpec;
    return this;
}

AccessSpecContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AccessSpecContext.prototype.constructor = AccessSpecContext;

AccessSpecContext.prototype.recursiveDescent = function() {
    return this.getTypedRuleContext(RecursiveDescentContext,0);
};

AccessSpecContext.prototype.dotAccess = function() {
    return this.getTypedRuleContext(DotAccessContext,0);
};

AccessSpecContext.prototype.bracketAccess = function() {
    return this.getTypedRuleContext(BracketAccessContext,0);
};

AccessSpecContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitAccessSpec(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.AccessSpecContext = AccessSpecContext;

JsonPathParser.prototype.accessSpec = function() {

    var localctx = new AccessSpecContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, JsonPathParser.RULE_accessSpec);
    try {
        this.state = 38;
        switch(this._input.LA(1)) {
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
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_dotAccess;
    return this;
}

DotAccessContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DotAccessContext.prototype.constructor = DotAccessContext;

DotAccessContext.prototype.selector = function() {
    return this.getTypedRuleContext(SelectorContext,0);
};

DotAccessContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitDotAccess(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.DotAccessContext = DotAccessContext;

JsonPathParser.prototype.dotAccess = function() {

    var localctx = new DotAccessContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, JsonPathParser.RULE_dotAccess);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 40;
        this.match(JsonPathParser.T__1);
        this.state = 41;
        this.selector();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_bracketAccess;
    return this;
}

BracketAccessContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BracketAccessContext.prototype.constructor = BracketAccessContext;

BracketAccessContext.prototype.bracketExpression = function() {
    return this.getTypedRuleContext(BracketExpressionContext,0);
};

BracketAccessContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitBracketAccess(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.BracketAccessContext = BracketAccessContext;

JsonPathParser.prototype.bracketAccess = function() {

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
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_recursiveDescent;
    return this;
}

RecursiveDescentContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
RecursiveDescentContext.prototype.constructor = RecursiveDescentContext;

RecursiveDescentContext.prototype.selector = function() {
    return this.getTypedRuleContext(SelectorContext,0);
};

RecursiveDescentContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitRecursiveDescent(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.RecursiveDescentContext = RecursiveDescentContext;

JsonPathParser.prototype.recursiveDescent = function() {

    var localctx = new RecursiveDescentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, JsonPathParser.RULE_recursiveDescent);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 47;
        this.match(JsonPathParser.T__4);
        this.state = 48;
        this.selector();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_selector;
    return this;
}

SelectorContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SelectorContext.prototype.constructor = SelectorContext;

SelectorContext.prototype.Identifier = function() {
    return this.getToken(JsonPathParser.Identifier, 0);
};

SelectorContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitSelector(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.SelectorContext = SelectorContext;

JsonPathParser.prototype.selector = function() {

    var localctx = new SelectorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, JsonPathParser.RULE_selector);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 50;
        _la = this._input.LA(1);
        if(!(_la===JsonPathParser.T__5 || _la===JsonPathParser.Identifier)) {
        this._errHandler.recoverInline(this);
        }
        else {
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_bracketExpression;
    return this;
}

BracketExpressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BracketExpressionContext.prototype.constructor = BracketExpressionContext;

BracketExpressionContext.prototype.fieldIndex = function() {
    return this.getTypedRuleContext(FieldIndexContext,0);
};

BracketExpressionContext.prototype.arraySlice = function() {
    return this.getTypedRuleContext(ArraySliceContext,0);
};

BracketExpressionContext.prototype.interpolation = function() {
    return this.getTypedRuleContext(InterpolationContext,0);
};

BracketExpressionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitBracketExpression(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.BracketExpressionContext = BracketExpressionContext;

JsonPathParser.prototype.bracketExpression = function() {

    var localctx = new BracketExpressionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, JsonPathParser.RULE_bracketExpression);
    try {
        this.state = 55;
        var la_ = this._interp.adaptivePredict(this._input,2,this._ctx);
        switch(la_) {
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
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_interpolation;
    return this;
}

InterpolationContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InterpolationContext.prototype.constructor = InterpolationContext;

InterpolationContext.prototype.Interpolation = function() {
    return this.getToken(JsonPathParser.Interpolation, 0);
};

InterpolationContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitInterpolation(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.InterpolationContext = InterpolationContext;

JsonPathParser.prototype.interpolation = function() {

    var localctx = new InterpolationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, JsonPathParser.RULE_interpolation);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 57;
        this.match(JsonPathParser.Interpolation);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_arraySlice;
    return this;
}

ArraySliceContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ArraySliceContext.prototype.constructor = ArraySliceContext;

ArraySliceContext.prototype.arraySection = function() {
    return this.getTypedRuleContext(ArraySectionContext,0);
};

ArraySliceContext.prototype.simpleSection = function() {
    return this.getTypedRuleContext(SimpleSectionContext,0);
};

ArraySliceContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitArraySlice(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.ArraySliceContext = ArraySliceContext;

JsonPathParser.prototype.arraySlice = function() {

    var localctx = new ArraySliceContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, JsonPathParser.RULE_arraySlice);
    try {
        this.state = 61;
        var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
        switch(la_) {
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
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
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

ArraySectionContext.prototype.NumericIndex = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(JsonPathParser.NumericIndex);
    } else {
        return this.getToken(JsonPathParser.NumericIndex, i);
    }
};


ArraySectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitArraySection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.ArraySectionContext = ArraySectionContext;

JsonPathParser.prototype.arraySection = function() {

    var localctx = new ArraySectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, JsonPathParser.RULE_arraySection);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 64;
        _la = this._input.LA(1);
        if(_la===JsonPathParser.NumericIndex) {
            this.state = 63;
            localctx.startSection = this.match(JsonPathParser.NumericIndex);
        }

        this.state = 66;
        this.match(JsonPathParser.T__6);
        this.state = 68;
        _la = this._input.LA(1);
        if(_la===JsonPathParser.NumericIndex) {
            this.state = 67;
            localctx.endSection = this.match(JsonPathParser.NumericIndex);
        }

        this.state = 72;
        _la = this._input.LA(1);
        if(_la===JsonPathParser.T__6) {
            this.state = 70;
            this.match(JsonPathParser.T__6);
            this.state = 71;
            localctx.stepSection = this.match(JsonPathParser.NumericIndex);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
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

SimpleSectionContext.prototype.NumericIndex = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(JsonPathParser.NumericIndex);
    } else {
        return this.getToken(JsonPathParser.NumericIndex, i);
    }
};


SimpleSectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitSimpleSection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.SimpleSectionContext = SimpleSectionContext;

JsonPathParser.prototype.simpleSection = function() {

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
    	if(re instanceof antlr4.error.RecognitionException) {
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
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = JsonPathParser.RULE_fieldIndex;
    return this;
}

FieldIndexContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FieldIndexContext.prototype.constructor = FieldIndexContext;

FieldIndexContext.prototype.Identifier = function() {
    return this.getToken(JsonPathParser.Identifier, 0);
};

FieldIndexContext.prototype.NumericIndex = function() {
    return this.getToken(JsonPathParser.NumericIndex, 0);
};

FieldIndexContext.prototype.accept = function(visitor) {
    if ( visitor instanceof JsonPathVisitor ) {
        return visitor.visitFieldIndex(this);
    } else {
        return visitor.visitChildren(this);
    }
};




JsonPathParser.FieldIndexContext = FieldIndexContext;

JsonPathParser.prototype.fieldIndex = function() {

    var localctx = new FieldIndexContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, JsonPathParser.RULE_fieldIndex);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 78;
        _la = this._input.LA(1);
        if(!(_la===JsonPathParser.Identifier || _la===JsonPathParser.NumericIndex)) {
        this._errHandler.recoverInline(this);
        }
        else {
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
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
