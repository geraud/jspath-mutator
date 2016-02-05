// Generated from /Users/gboyer/Projects/JavaScript/jspath-mutator/src/antlr/JsonPath.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\u0003\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\u0002\u000eS\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0003\u0002",
    "\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005",
    "\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007",
    "\u0003\b\u0003\b\u0003\t\u0003\t\u0003\n\u0003\n\u0007\n3\n\n\f\n\u000e",
    "\n6\u000b\n\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0007\u000b<\n\u000b",
    "\f\u000b\u000e\u000b?\u000b\u000b\u0003\f\u0005\fB\n\f\u0003\f\u0006",
    "\fE\n\f\r\f\u000e\fF\u0003\r\u0006\rJ\n\r\r\r\u000e\rK\u0003\r\u0003",
    "\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u00034\u0002\u0010",
    "\u0003\u0003\u0005\u0004\u0007\u0005\t\u0006\u000b\u0007\r\b\u000f\t",
    "\u0011\n\u0013\u000b\u0015\f\u0017\r\u0019\u000e\u001b\u0002\u001d\u0002",
    "\u0003\u0002\u0007\u0004\u0002--//\u0003\u00022;\u0005\u0002\u000b\f",
    "\u000f\u000f\"\"\u0005\u0002C\\aac|\u0006\u00022;C\\aac|U\u0002\u0003",
    "\u0003\u0002\u0002\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0002\u0007",
    "\u0003\u0002\u0002\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002\u000b",
    "\u0003\u0002\u0002\u0002\u0002\r\u0003\u0002\u0002\u0002\u0002\u000f",
    "\u0003\u0002\u0002\u0002\u0002\u0011\u0003\u0002\u0002\u0002\u0002\u0013",
    "\u0003\u0002\u0002\u0002\u0002\u0015\u0003\u0002\u0002\u0002\u0002\u0017",
    "\u0003\u0002\u0002\u0002\u0002\u0019\u0003\u0002\u0002\u0002\u0003\u001f",
    "\u0003\u0002\u0002\u0002\u0005!\u0003\u0002\u0002\u0002\u0007#\u0003",
    "\u0002\u0002\u0002\t%\u0003\u0002\u0002\u0002\u000b\'\u0003\u0002\u0002",
    "\u0002\r*\u0003\u0002\u0002\u0002\u000f,\u0003\u0002\u0002\u0002\u0011",
    ".\u0003\u0002\u0002\u0002\u00130\u0003\u0002\u0002\u0002\u00159\u0003",
    "\u0002\u0002\u0002\u0017A\u0003\u0002\u0002\u0002\u0019I\u0003\u0002",
    "\u0002\u0002\u001bO\u0003\u0002\u0002\u0002\u001dQ\u0003\u0002\u0002",
    "\u0002\u001f \u0007&\u0002\u0002 \u0004\u0003\u0002\u0002\u0002!\"\u0007",
    "0\u0002\u0002\"\u0006\u0003\u0002\u0002\u0002#$\u0007]\u0002\u0002$",
    "\b\u0003\u0002\u0002\u0002%&\u0007_\u0002\u0002&\n\u0003\u0002\u0002",
    "\u0002\'(\u00070\u0002\u0002()\u00070\u0002\u0002)\f\u0003\u0002\u0002",
    "\u0002*+\u0007,\u0002\u0002+\u000e\u0003\u0002\u0002\u0002,-\u0007<",
    "\u0002\u0002-\u0010\u0003\u0002\u0002\u0002./\u0007.\u0002\u0002/\u0012",
    "\u0003\u0002\u0002\u000204\u0007}\u0002\u000213\u000b\u0002\u0002\u0002",
    "21\u0003\u0002\u0002\u000236\u0003\u0002\u0002\u000245\u0003\u0002\u0002",
    "\u000242\u0003\u0002\u0002\u000257\u0003\u0002\u0002\u000264\u0003\u0002",
    "\u0002\u000278\u0007\u007f\u0002\u00028\u0014\u0003\u0002\u0002\u0002",
    "9=\u0005\u001b\u000e\u0002:<\u0005\u001d\u000f\u0002;:\u0003\u0002\u0002",
    "\u0002<?\u0003\u0002\u0002\u0002=;\u0003\u0002\u0002\u0002=>\u0003\u0002",
    "\u0002\u0002>\u0016\u0003\u0002\u0002\u0002?=\u0003\u0002\u0002\u0002",
    "@B\t\u0002\u0002\u0002A@\u0003\u0002\u0002\u0002AB\u0003\u0002\u0002",
    "\u0002BD\u0003\u0002\u0002\u0002CE\t\u0003\u0002\u0002DC\u0003\u0002",
    "\u0002\u0002EF\u0003\u0002\u0002\u0002FD\u0003\u0002\u0002\u0002FG\u0003",
    "\u0002\u0002\u0002G\u0018\u0003\u0002\u0002\u0002HJ\t\u0004\u0002\u0002",
    "IH\u0003\u0002\u0002\u0002JK\u0003\u0002\u0002\u0002KI\u0003\u0002\u0002",
    "\u0002KL\u0003\u0002\u0002\u0002LM\u0003\u0002\u0002\u0002MN\b\r\u0002",
    "\u0002N\u001a\u0003\u0002\u0002\u0002OP\t\u0005\u0002\u0002P\u001c\u0003",
    "\u0002\u0002\u0002QR\t\u0006\u0002\u0002R\u001e\u0003\u0002\u0002\u0002",
    "\b\u00024=AFK\u0003\b\u0002\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

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


JsonPathLexer.modeNames = [ "DEFAULT_MODE" ];

JsonPathLexer.literalNames = [ 'null', "'$'", "'.'", "'['", "']'", "'..'", 
                               "'*'", "':'", "','" ];

JsonPathLexer.symbolicNames = [ 'null', 'null', 'null', 'null', 'null', 
                                'null', 'null', 'null', 'null', "Interpolation", 
                                "Identifier", "NumericIndex", "WS" ];

JsonPathLexer.ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", 
                            "T__6", "T__7", "Interpolation", "Identifier", 
                            "NumericIndex", "WS", "IdentifierStart", "IdentifierChar" ];

JsonPathLexer.grammarFileName = "JsonPath.g4";



exports.JsonPathLexer = JsonPathLexer;

