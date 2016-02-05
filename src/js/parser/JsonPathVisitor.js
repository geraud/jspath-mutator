// Generated from /Users/gboyer/Projects/JavaScript/jspath-mutator/src/antlr/JsonPath.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by JsonPathParser.

function JsonPathVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

JsonPathVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
JsonPathVisitor.prototype.constructor = JsonPathVisitor;

// Visit a parse tree produced by JsonPathParser#parseJsonPath.
JsonPathVisitor.prototype.visitParseJsonPath = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#jsonPath.
JsonPathVisitor.prototype.visitJsonPath = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#accessSpec.
JsonPathVisitor.prototype.visitAccessSpec = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#dotAccess.
JsonPathVisitor.prototype.visitDotAccess = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#bracketAccess.
JsonPathVisitor.prototype.visitBracketAccess = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#recursiveDescent.
JsonPathVisitor.prototype.visitRecursiveDescent = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#selector.
JsonPathVisitor.prototype.visitSelector = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#bracketExpression.
JsonPathVisitor.prototype.visitBracketExpression = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#interpolation.
JsonPathVisitor.prototype.visitInterpolation = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#arraySlice.
JsonPathVisitor.prototype.visitArraySlice = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#arraySection.
JsonPathVisitor.prototype.visitArraySection = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#simpleSection.
JsonPathVisitor.prototype.visitSimpleSection = function(ctx) {
};


// Visit a parse tree produced by JsonPathParser#fieldIndex.
JsonPathVisitor.prototype.visitFieldIndex = function(ctx) {
};



exports.JsonPathVisitor = JsonPathVisitor;